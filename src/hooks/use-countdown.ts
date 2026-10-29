import { useCallback, useEffect, useRef, useState } from "react";

/** Fast enough to feed a smooth bar, cheap enough to re-render a phone ten
 *  times a second during a round. */
const TICK_MS = 100;

/**
 * Countdown in milliseconds. Every tick subtracts the time that actually
 * passed instead of assuming a second did, so a slow frame, a pause or a
 * throttled tab cannot make the bar disagree with the clock: both hit zero on
 * the same tick.
 */
export const useCountdown = (totalMs: number, running: boolean) => {
	const [remainingMs, setRemainingMs] = useState(totalMs);
	const remainingRef = useRef(totalMs);

	const reset = useCallback(() => {
		remainingRef.current = totalMs;
		setRemainingMs(totalMs);
	}, [totalMs]);

	useEffect(() => {
		reset();
	}, [reset]);

	useEffect(() => {
		if (!running) {
			return;
		}
		let last = performance.now();
		const timer = setInterval(() => {
			const now = performance.now();
			const next = Math.max(0, remainingRef.current - (now - last));
			last = now;
			remainingRef.current = next;
			setRemainingMs(next);
			if (next <= 0) {
				// Nothing left to count: stop re-rendering the screen every tick.
				clearInterval(timer);
			}
		}, TICK_MS);
		return () => clearInterval(timer);
	}, [running]);

	return { remainingMs, reset };
};
