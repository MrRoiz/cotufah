import { useEffect, useMemo, useRef, useState } from "react";

import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/data/categories";
import { assignSpies } from "@/games/spy/assign";
import {
	DISCUSS_SECONDS,
	HANDOFF_SECONDS,
	type SpyPhase,
} from "@/games/spy/rules";
import { useRoundWords } from "@/games/use-round-words";
import { FINAL_SECONDS, useCountdown } from "@/hooks/use-countdown";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { haptic } from "@/lib/haptics";
import { playSound } from "@/lib/sound";

const listFormatters = new Map<Locale, Intl.ListFormat>();

const listFormatter = (locale: Locale): Intl.ListFormat => {
	const cached = listFormatters.get(locale);
	if (cached) {
		return cached;
	}
	const formatter = new Intl.ListFormat(locale, {
		style: "long",
		type: "conjunction",
	});
	listFormatters.set(locale, formatter);
	return formatter;
};

/** Round state for Spy: one word, one assignment, one phase at a time. */
export const useSpyRound = ({
	lang,
	players,
	spyCount,
	category,
}: {
	lang: Locale;
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
		if (second > 0 && second <= FINAL_SECONDS && lastTick.current !== second) {
			lastTick.current = second;
			playSound("tick");
		}
		if (second === 0 && !ended.current) {
			ended.current = true;
			playSound("end");
			haptic("end");
		}
	}, [phase, paused, discussTimer.remainingMs]);

	const { words, isPending, refetch, isFetching } = useRoundWords({
		game: "spy",
		lang,
		category,
		count: 1,
	});
	const word = words[0];

	const spyNames = useMemo(
		() => assignment.map((spyIndex) => players[spyIndex] ?? "").filter(Boolean),
		[assignment, players],
	);
	const spyList = useMemo(
		() => listFormatter(lang).format(spyNames),
		[lang, spyNames],
	);

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
		isSpy: assignment.includes(index),
		spyList,
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
