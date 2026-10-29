import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { CategoryChoice } from "@/data/schema";
import { getRoundFn } from "@/fns/decks.functions";
import { assignSpies } from "@/games/spy/assign";
import { useCountdown } from "@/hooks/use-countdown";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { haptic } from "@/lib/haptics";
import { playSound, TICK_LAST_SECONDS } from "@/lib/sound";

export const DISCUSS_SECONDS = 120;
export const HANDOFF_SECONDS = 5;
export const MIN_PLAYERS = 3;

export type SpyPhase = "deal" | "handoff" | "discuss" | "vote" | "reveal";

export const parsePlayers = (value: string): string[] => {
	return value
		.split("|")
		.map((name) => decodeURIComponent(name))
		.filter(Boolean);
};

/** Round state for Spy: one word, one assignment, one phase at a time. */
export const useSpyRound = ({
	lang,
	players,
	spyCount,
	category,
}: {
	lang: "es" | "en";
	players: string[];
	spyCount: number;
	category: CategoryChoice;
}) => {
	// The phone is passed around during a round, so it must not lock.
	useWakeLock();

	const [assignment, setAssignment] = useState(() =>
		assignSpies(players.length, spyCount),
	);
	const [phase, setPhase] = useState<SpyPhase>("handoff");
	const [index, setIndex] = useState(-1);
	const [revealed, setRevealed] = useState(false);
	const [peeked, setPeeked] = useState(false);
	const [paused, setPaused] = useState(false);
	const handoffTimer = useCountdown(
		HANDOFF_SECONDS * 1000,
		phase === "handoff",
	);
	const discussTimer = useCountdown(
		DISCUSS_SECONDS * 1000,
		phase === "discuss" && !paused,
	);
	const [accused, setAccused] = useState<number | null>(null);

	const lastTick = useRef<number | null>(null);
	const ended = useRef(false);
	useEffect(() => {
		if (phase !== "discuss") {
			lastTick.current = null;
			ended.current = false;
			return;
		}
		if (paused) {
			return;
		}
		const second = Math.ceil(discussTimer.remainingMs / 1000);
		if (
			second > 0 &&
			second <= TICK_LAST_SECONDS &&
			lastTick.current !== second
		) {
			lastTick.current = second;
			playSound("tick");
		}
		if (second === 0 && !ended.current) {
			ended.current = true;
			playSound("end");
			haptic("end");
		}
	}, [phase, paused, discussTimer.remainingMs]);

	const { data, isPending, refetch, isFetching } = useQuery({
		queryKey: ["spy-word", lang, category],
		queryFn: () =>
			getRoundFn({ data: { game: "spy", locale: lang, count: 1, category } }),
		staleTime: 0,
	});
	const word = data?.[0];

	useEffect(() => {
		if (phase !== "handoff" || handoffTimer.remainingMs > 0) {
			return;
		}
		setIndex((value) => value + 1);
		setPeeked(false);
		setRevealed(false);
		setPhase("deal");
	}, [phase, handoffTimer.remainingMs]);

	const nextPlayer = () => {
		setRevealed(false);
		setPeeked(false);
		if (index + 1 >= players.length) {
			setPhase("discuss");
			return;
		}
		// The person handing the phone over must not see the next role.
		handoffTimer.reset();
		setPhase("handoff");
	};

	const again = () => {
		setAssignment(assignSpies(players.length, spyCount));
		setIndex(-1);
		setRevealed(false);
		setPeeked(false);
		setAccused(null);
		discussTimer.reset();
		setPaused(false);
		handoffTimer.reset();
		setPhase("handoff");
		refetch();
	};

	const spyNames = assignment
		.map((spyIndex) => players[spyIndex] ?? "")
		.filter(Boolean);

	return {
		phase,
		handoffMs: handoffTimer.remainingMs,
		index,
		revealed,
		peeked,
		remainingMs: discussTimer.remainingMs,
		paused,
		accused,
		assignment,
		word,
		waiting: isPending || !word,
		isFetching,
		currentPlayer: players[index] ?? "",
		nextPlayerName: players[index + 1] ?? "",
		isLastPlayer: index + 1 >= players.length,
		isSpy: assignment.includes(index),
		spyList: new Intl.ListFormat(lang, {
			style: "long",
			type: "conjunction",
		}).format(spyNames),
		caught: accused !== null && assignment.includes(accused),
		setPhase,
		setRevealed,
		setPeeked,
		setPaused,
		setAccused,
		nextPlayer,
		again,
	};
};
