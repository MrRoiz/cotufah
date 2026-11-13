import { useCallback, useEffect, useMemo, useState } from "react";

import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import { useRoundWords } from "@/decks/hooks/use-round-words";
import { useCountdown } from "@/games/hooks/use-countdown";
import { useRoundCues } from "@/games/hooks/use-round-cues";
import { useWakeLock } from "@/games/hooks/use-wake-lock";
import { assignSpies } from "@/games/spy/assign-spies";
import { DISCUSS_MS, HANDOFF_MS, type SpyPhase } from "@/games/spy/rules";
import { formatList } from "@/i18n";

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
	const handoffTimer = useCountdown(HANDOFF_MS, phase === "handoff");
	const discussTimer = useCountdown(DISCUSS_MS, phase === "discuss" && !paused);
	const [accused, setAccused] = useState<number | null>(null);

	useRoundCues({
		// The clock is frozen while paused, so a pause needs no extra guard.
		active: phase === "discuss",
		remainingMs: discussTimer.remainingMs,
	});

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
	const spyList = useMemo(() => formatList(lang, spyNames), [lang, spyNames]);

	/** Nobody but the player holding the phone may see the role. */
	const hideRole = useCallback(() => {
		setRevealed(false);
		setPeeked(false);
	}, []);

	useEffect(() => {
		if (phase !== "handoff" || handoffTimer.remainingMs > 0) {
			return;
		}
		setIndex((value) => value + 1);
		hideRole();
		setPhase("deal");
	}, [phase, handoffTimer.remainingMs, hideRole]);

	const nextPlayer = () => {
		hideRole();
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
		hideRole();
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
