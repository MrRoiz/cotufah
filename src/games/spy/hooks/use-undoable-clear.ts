import { useEffect, useState } from "react";

import { useCountdown } from "@/games/hooks/use-countdown";

const UNDO_WINDOW_MS = 5000;

/**
 * Clears the whole player list in one tap and keeps the old list for a few
 * seconds so a slip can be undone, instead of asking for confirmation first.
 */
export const useUndoableClear = ({
	players,
	onChange,
}: {
	players: string[];
	onChange: (players: string[]) => void;
}) => {
	const [cleared, setCleared] = useState<string[] | null>(null);
	const isUndoable = cleared !== null;
	const { remainingMs, reset } = useCountdown(UNDO_WINDOW_MS, isUndoable);
	const hasExpired = isUndoable && remainingMs <= 0;

	useEffect(() => {
		if (hasExpired) {
			setCleared(null);
		}
	}, [hasExpired]);

	const clear = () => {
		reset();
		setCleared(players);
		onChange([]);
	};

	const undo = () => {
		if (cleared === null) {
			return;
		}
		onChange(cleared);
		setCleared(null);
	};

	const dismiss = () => setCleared(null);

	return {
		isUndoable,
		undoTimeLeft: remainingMs / UNDO_WINDOW_MS,
		clear,
		undo,
		dismiss,
	};
};
