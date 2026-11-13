import { useEffect, useRef } from "react";

import { haptic } from "@/games/haptics";
import { FINAL_SECONDS, secondsLeft } from "@/games/use-countdown";
import { playSound } from "@/lib/sound";

/**
 * The cues every round shares: a tick on each of the last seconds and one end
 * cue plus a buzz when the clock hits zero. Both games read the same rules, so
 * a round sounds the same whichever one is playing.
 */
export const useRoundCues = ({
	active,
	remainingMs,
	onEnd,
}: {
	/** False while the clock is not counting (paused, another phase). */
	active: boolean;
	remainingMs: number;
	/** Runs once per run, when the clock reaches zero. */
	onEnd?: () => void;
}) => {
	const lastTick = useRef<number | null>(null);
	const ended = useRef(false);
	const end = useRef(onEnd);
	end.current = onEnd;

	useEffect(() => {
		if (!active) {
			lastTick.current = null;
			ended.current = false;
			return;
		}

		const second = secondsLeft(remainingMs);
		if (second > 0 && second <= FINAL_SECONDS && lastTick.current !== second) {
			lastTick.current = second;
			playSound("tick");
		}

		if (second === 0 && !ended.current) {
			ended.current = true;
			playSound("end");
			haptic("end");
			end.current?.();
		}
	}, [active, remainingMs]);
};
