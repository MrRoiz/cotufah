import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/config/app";
import { type CategoryChoice, MAX_ROUND_WORDS } from "@/decks/categories";
import { useRoundWords } from "@/decks/use-round-words";
import { requestMotionPermission } from "@/games/charades/motion-sensor";
import type {
	CharadesAnswer,
	CharadesPhase,
	Duration,
} from "@/games/charades/rules";
import {
	motionProbeReliable,
	useMotionProbe,
} from "@/games/charades/use-motion-probe";
import { useTilt } from "@/games/charades/use-tilt";
import { haptic } from "@/games/haptics";
import { useCountdown } from "@/games/use-countdown";
import { useRoundCues } from "@/games/use-round-cues";
import { useWakeLock } from "@/games/use-wake-lock";
import { playSound } from "@/lib/sound";

const COUNTDOWN_FROM = 3;
/** Each number of the 3-2-1, and the pause before "go". */
const COUNTDOWN_STEP_MS = 700;
const COUNTDOWN_GO_MS = 650;
/** How long the correct/pass flash covers the stage. */
const FLASH_MS = 320;
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
	const totalMs = duration * 1000;
	const { remainingMs, reset: resetTimer } = useCountdown(
		totalMs,
		phase === "playing",
	);
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
			const tick = setTimeout(
				() => setCountdown((value) => value - 1),
				COUNTDOWN_STEP_MS,
			);
			return () => clearTimeout(tick);
		}
		const go = setTimeout(() => {
			setPhase("playing");
			recalibrate();
		}, COUNTDOWN_GO_MS);
		return () => clearTimeout(go);
	}, [phase, countdown, recalibrate]);

	// The 3-2-1 ticks and the start gun, keyed by the number on screen.
	const lastCue = useRef<number | null>(null);
	const startPlayed = useRef(false);
	useEffect(() => {
		if (phase !== "countdown") {
			lastCue.current = null;
			startPlayed.current = false;
			return;
		}
		if (countdown > 0) {
			if (lastCue.current !== countdown) {
				lastCue.current = countdown;
				playSound("tick");
			}
			return;
		}
		if (!startPlayed.current) {
			startPlayed.current = true;
			playSound("start");
		}
	}, [phase, countdown]);

	useRoundCues({
		active: phase === "playing",
		remainingMs,
		onEnd: () => setPhase("results"),
	});

	const answer = (correct: boolean) => {
		if (phase !== "playing") {
			return;
		}

		const now = performance.now();
		if (now - lastAnswerAt.current < ANSWER_COOLDOWN_MS) {
			return;
		}
		lastAnswerAt.current = now;

		setFlash(correct ? "correct" : "pass");
		flashTimer.current = window.setTimeout(() => setFlash(null), FLASH_MS);
		haptic(correct ? "correct" : "pass");
		playSound(correct ? "correct" : "pass");

		const word = words[answers.length];
		setAnswers((current) => [...current, { word, correct }]);

		if (answers.length + 1 >= words.length) {
			setPhase("results");
		}
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
		resetTimer();
		setCountdown(COUNTDOWN_FROM);
		setPhase("countdown");
		recalibrate();
		refetch();
	};

	// One pass, because the results screen shows both lists and the score.
	const correctWords: string[] = [];
	const passedWords: string[] = [];
	for (const entry of answers) {
		if (entry.correct) {
			correctWords.push(entry.word);
		} else {
			passedWords.push(entry.word);
		}
	}

	return {
		phase,
		countdown,
		remainingMs,
		totalMs,
		flash,
		zonesVisible,
		probe,
		probing,
		isPending,
		isFetching,
		hasWords: words.length > 0,
		word: words[answers.length] ?? "",
		correctWords,
		passedWords,
		correctCount: correctWords.length,
		finished: answers.length >= words.length,
		// The word still on screen when time runs out was never answered, so it
		// is not in `answers`; the results show it instead of losing it.
		pendingWord:
			phase === "results" && answers.length < words.length
				? (words[answers.length] ?? null)
				: null,
		startRound,
		answer,
		restart,
	};
};
