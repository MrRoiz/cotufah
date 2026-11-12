import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/config/app";
import { type CategoryChoice, MAX_ROUND_WORDS } from "@/decks/categories";
import { useRoundWords } from "@/decks/use-round-words";
import type {
	CharadesAnswer,
	CharadesPhase,
	Duration,
} from "@/games/charades/rules";
import {
	motionProbeReliable,
	requestMotionPermission,
	useMotionProbe,
	useTilt,
} from "@/games/charades/use-tilt";
import { haptic } from "@/games/haptics";
import {
	FINAL_SECONDS,
	secondsLeft,
	useCountdown,
} from "@/games/use-countdown";
import { useWakeLock } from "@/games/use-wake-lock";
import { playSound } from "@/lib/sound";

const COUNTDOWN_FROM = 3;
/** Ignore answers that land within this window: taps are easy to double. */
const ANSWER_COOLDOWN_MS = 700;
/** Give a working sensor a moment before replacing it with tap zones. */
const ZONES_GRACE_MS = 900;

/** All round state in one place, so the route only wires props to screens. */
export const useCharadesRound = ({
	lang,
	duration,
	category,
}: {
	lang: Locale;
	duration: Duration;
	category: CategoryChoice;
}) => {
	useWakeLock();

	const { words, isPending, refetch, isFetching } = useRoundWords({
		game: "charades",
		lang,
		category,
		count: MAX_ROUND_WORDS,
	});

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
	const flashTimer = useRef<number | null>(null);

	useEffect(
		() => () => {
			if (flashTimer.current !== null) {
				window.clearTimeout(flashTimer.current);
			}
		},
		[],
	);

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

	// Same tick as the round's last seconds, so the 3-2-1 reads as a clock.
	const lastCountTick = useRef<number | null>(null);
	useEffect(() => {
		if (phase !== "countdown" || countdown <= 0) {
			lastCountTick.current = null;
			return;
		}
		if (lastCountTick.current === countdown) {
			return;
		}
		lastCountTick.current = countdown;
		playSound("tick");
	}, [phase, countdown]);

	// The countdown hitting zero is the start gun; a ref keeps it to one shot
	// even if the effect runs again while the word is coming up.
	const startCuePlayed = useRef(false);
	useEffect(() => {
		if (phase !== "countdown") {
			startCuePlayed.current = false;
			return;
		}
		if (countdown !== 0 || startCuePlayed.current) {
			return;
		}
		startCuePlayed.current = true;
		playSound("start");
	}, [phase, countdown]);

	useEffect(() => {
		if (phase === "playing" && remainingMs <= 0) {
			playSound("end");
			haptic("end");
			setPhase("results");
		}
	}, [phase, remainingMs]);

	// One tick per second for the last five, keyed by the second shown on screen.
	const lastTick = useRef<number | null>(null);
	useEffect(() => {
		if (phase !== "playing") {
			lastTick.current = null;
			return;
		}
		const second = secondsLeft(remainingMs);
		if (second > 0 && second <= FINAL_SECONDS && lastTick.current !== second) {
			lastTick.current = second;
			playSound("tick");
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
		flashTimer.current = window.setTimeout(() => setFlash(null), 320);
		haptic(correct ? "correct" : "pass");
		playSound(correct ? "correct" : "pass");
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
		probe,
		probing,
		isPending,
		isFetching,
		correctCount: answers.filter((entry) => entry.correct).length,
		finished: answers.length >= words.length,
		// The word still on screen when time runs out was never answered, so it
		// is not in `answers`; the results show it instead of losing it.
		pendingWord:
			phase === "results" && answers.length < words.length
				? (words[index] ?? null)
				: null,
		startRound,
		answer,
		restart,
	};
};
