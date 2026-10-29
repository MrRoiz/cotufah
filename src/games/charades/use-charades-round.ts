import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import type { CategoryChoice } from "@/data/schema";
import { getRoundFn } from "@/fns/decks.functions";
import type { CharadesAnswer } from "@/games/charades/results-screen";
import { useCountdown } from "@/hooks/use-countdown";
import {
	motionProbeReliable,
	requestMotionPermission,
	useMotionProbe,
	useTilt,
} from "@/hooks/use-tilt";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { haptic } from "@/lib/haptics";

const COUNTDOWN_FROM = 3;
/** Ignore answers that land within this window: taps are easy to double. */
const ANSWER_COOLDOWN_MS = 700;
/** Give a working sensor a moment before replacing it with tap zones. */
const ZONES_GRACE_MS = 900;

export type CharadesPhase = "intro" | "countdown" | "playing" | "results";

/** All round state in one place, so the route only wires props to panels. */
export const useCharadesRound = ({
	lang,
	duration,
	category,
}: {
	lang: "es" | "en";
	duration: number;
	category: CategoryChoice;
}) => {
	useWakeLock();

	const { data, isPending, refetch, isFetching } = useQuery({
		queryKey: ["charades-round", lang, category],
		queryFn: () =>
			getRoundFn({
				data: { game: "charades", locale: lang, count: 40, category },
			}),
		staleTime: 0,
	});
	const words = data ?? [];

	const [phase, setPhase] = useState<CharadesPhase>("intro");
	const [countdown, setCountdown] = useState(COUNTDOWN_FROM);
	const { remainingMs, reset: resetTimer } = useCountdown(
		duration * 1000,
		phase === "playing",
	);
	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState<CharadesAnswer[]>([]);
	const [flash, setFlash] = useState<"correct" | "pass" | null>(null);
	const [zonesVisible, setZonesVisible] = useState(false);
	const lastAnswerAt = useRef(0);

	const probeReliable = motionProbeReliable();
	const probe = useMotionProbe(probeReliable && phase === "intro");
	const probing = probe === "unknown" && probeReliable && phase === "intro";

	const { supported, recalibrate } = useTilt({
		enabled: phase === "playing",
		onTilt: (direction) => answer(direction === "down"),
	});

	useEffect(() => {
		if (phase !== "playing" || supported) {
			setZonesVisible(false);
			return;
		}
		// The intro already probed the device, so an unsupported one gets the tap
		// halves from the first frame instead of swapping layout mid-round.
		if (probe === "no") {
			setZonesVisible(true);
			return;
		}
		const timer = setTimeout(() => setZonesVisible(true), ZONES_GRACE_MS);
		return () => clearTimeout(timer);
	}, [phase, supported, probe]);

	useEffect(() => {
		if (phase !== "countdown") {
			return;
		}
		if (countdown > 0) {
			const tick = setTimeout(() => setCountdown((value) => value - 1), 700);
			return () => clearTimeout(tick);
		}
		const go = setTimeout(() => {
			setPhase("playing");
			recalibrate();
		}, 650);
		return () => clearTimeout(go);
	}, [phase, countdown, recalibrate]);

	useEffect(() => {
		if (phase === "playing" && remainingMs <= 0) {
			setPhase("results");
		}
	}, [phase, remainingMs]);

	const answer = (correct: boolean) => {
		if (phase !== "playing") {
			return;
		}

		const now = performance.now();
		if (now - lastAnswerAt.current < ANSWER_COOLDOWN_MS) {
			return;
		}
		lastAnswerAt.current = now;

		if (index >= words.length) {
			setPhase("results");
			return;
		}

		setFlash(correct ? "correct" : "pass");
		window.setTimeout(() => setFlash(null), 320);
		haptic(correct ? "correct" : "pass");
		setAnswers((current) => [...current, { word: words[index], correct }]);

		if (index + 1 >= words.length) {
			setPhase("results");
			return;
		}
		setIndex((value) => value + 1);
	};

	const startRound = async () => {
		// iOS asks for sensor permission here; whether it is granted only changes
		// which controls the round uses, and the round detects that itself.
		await requestMotionPermission();
		setCountdown(COUNTDOWN_FROM);
		setPhase("countdown");
	};

	const restart = () => {
		setAnswers([]);
		setIndex(0);
		resetTimer();
		setCountdown(COUNTDOWN_FROM);
		setPhase("countdown");
		recalibrate();
		refetch();
	};

	return {
		phase,
		countdown,
		words,
		index,
		remainingMs,
		totalMs: duration * 1000,
		answers,
		flash,
		zonesVisible,
		supported,
		probe,
		probing,
		isPending,
		isFetching,
		correctCount: answers.filter((entry) => entry.correct).length,
		finished: answers.length >= words.length,
		startRound,
		answer,
		restart,
	};
};
