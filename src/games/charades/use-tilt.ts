import { useCallback, useEffect, useRef, useState } from "react";

import { hasGravity } from "@/games/charades/motion-sensor";

type TiltDirection = "down" | "up";

/** m/s² away from the calibrated pose before it counts as a tilt. */
const TILT_THRESHOLD = 5.5;
/** Ignore repeat tilts within this window (ms). */
const TILT_COOLDOWN_MS = 1100;
/** The tilt has to stay past the threshold this long to count (ms). */
const TILT_HOLD_MS = 120;
/** Re-arm only once the phone is back inside this share of the threshold. */
const TILT_RELEASE_RATIO = 0.4;

type TiltOptions = {
	enabled: boolean;
	onTilt: (direction: TiltDirection) => void;
};

/**
 * Tilt gestures for the forehead game.
 *
 * Uses `devicemotion.accelerationIncludingGravity.z`, i.e. how much the screen
 * faces the ceiling vs the floor. That axis is perpendicular to the screen, so
 * it behaves the same whether the phone is portrait or landscape — unlike
 * `deviceorientation.beta`, which rotates into `gamma` when the phone turns
 * sideways, which is exactly how the first implementation missed every tilt.
 *
 * Baseline is captured on the first sample after a round starts. On a forehead
 * mount the screen faces away from the head, so z is ~0. Nodding forward turns
 * the screen toward the floor, which drops z below the baseline → "down";
 * leaning back turns it toward the ceiling and raises z → "up".
 *
 * Spam guards: the tilt must hold for 120ms, the phone must return near neutral
 * (hysteresis at 40% of the threshold) before the next gesture, and two answers
 * are at least 1.1s apart.
 */
export const useTilt = ({ enabled, onTilt }: TiltOptions) => {
	const baseline = useRef<number | null>(null);
	/** `null` until the filter has seen a real sample, so the baseline is not
	 * captured from a value still sliding away from zero. */
	const smoothed = useRef<number | null>(null);
	const armed = useRef(true);
	const lastFire = useRef(0);
	const pastSince = useRef<number | null>(null);
	const pastDirection = useRef<TiltDirection | null>(null);
	const tiltHandler = useRef(onTilt);
	tiltHandler.current = onTilt;

	/** A ref too: the sensor fires ~60 times a second, one state write is enough. */
	const supportedRef = useRef(false);
	const [supported, setSupported] = useState(false);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const handle = (event: DeviceMotionEvent) => {
			if (!hasGravity(event)) {
				return;
			}

			const z = event.accelerationIncludingGravity?.z;
			if (z == null) {
				return;
			}

			if (!supportedRef.current) {
				supportedRef.current = true;
				setSupported(true);
			}

			// Low-pass: raw accelerometer data is noisy enough to fire on a twitch.
			smoothed.current =
				smoothed.current === null
					? z
					: smoothed.current + 0.25 * (z - smoothed.current);
			const value = smoothed.current;

			if (baseline.current === null) {
				baseline.current = value;
				return;
			}

			const difference = value - baseline.current;

			// Hysteresis: re-arm only once the phone is close to neutral again, so
			// jitter around the threshold cannot fire twice.
			if (Math.abs(difference) < TILT_THRESHOLD * TILT_RELEASE_RATIO) {
				armed.current = true;
				pastSince.current = null;
				pastDirection.current = null;
				return;
			}

			if (Math.abs(difference) < TILT_THRESHOLD) {
				pastSince.current = null;
				pastDirection.current = null;
				return;
			}

			const now = performance.now();
			const direction: TiltDirection = difference > 0 ? "up" : "down";

			// A deliberate tilt is held; a knock or a bump is not.
			if (pastSince.current === null || pastDirection.current !== direction) {
				pastSince.current = now;
				pastDirection.current = direction;
				return;
			}
			if (now - pastSince.current < TILT_HOLD_MS) {
				return;
			}

			if (!armed.current || now - lastFire.current < TILT_COOLDOWN_MS) {
				return;
			}

			armed.current = false;
			lastFire.current = now;
			pastSince.current = null;
			pastDirection.current = null;
			tiltHandler.current(direction);
		};

		window.addEventListener("devicemotion", handle);
		return () => window.removeEventListener("devicemotion", handle);
	}, [enabled]);

	const recalibrate = useCallback(() => {
		baseline.current = null;
		smoothed.current = null;
		armed.current = true;
		pastSince.current = null;
		pastDirection.current = null;
	}, []);

	return { supported, recalibrate };
};
