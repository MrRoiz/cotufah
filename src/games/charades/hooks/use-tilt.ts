import { useCallback, useEffect, useRef, useState } from "react";

import { hasGravity } from "@/lib/motion-sensor";

type TiltDirection = "down" | "up";

/** m/s² away from the calibrated pose before it counts as a tilt. */
const TILT_THRESHOLD = 5.5;
/** Ignore repeat tilts within this window (ms). */
const TILT_COOLDOWN_MS = 1100;
/** The tilt has to stay past the threshold this long to count (ms). */
const TILT_HOLD_MS = 120;
/** Re-arm only once the phone is back inside this share of the threshold. */
const TILT_RELEASE_RATIO = 0.4;
/** The starting baseline averages this long of samples, so one jolt at "go"
 *  cannot skew it (ms). */
const CALIBRATION_MS = 250;
/** A phone held still this long is resting: that pose becomes neutral (ms). */
const REST_MS = 400;
/** m/s² the reading may wander and still count as resting. */
const REST_TOLERANCE = 0.6;

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
 * Baseline is the average of the first 250ms after a round starts. On a
 * forehead mount the screen faces away from the head, so z is ~0. Nodding
 * forward turns the screen toward the floor, which drops z below the baseline
 * → "down"; leaning back turns it toward the ceiling and raises z → "up".
 *
 * Neutral follows the player: whenever the phone rests (still for 400ms) short
 * of the threshold, that pose becomes the baseline and the next gesture is
 * armed. Without it, a player whose posture drifted after a tilt stayed locked
 * out until they found the exact starting angle again.
 *
 * Spam guards: the tilt must hold for 120ms, the phone must return near neutral
 * (hysteresis at 40% of the threshold) or come to rest before the next gesture,
 * and two answers are at least 1.1s apart.
 */
export const useTilt = ({ enabled, onTilt }: TiltOptions) => {
	const baseline = useRef<number | null>(null);
	/** `null` until the filter has seen a real sample, so the baseline is not
	 * captured from a value still sliding away from zero. */
	const smoothed = useRef<number | null>(null);
	const calibrationStart = useRef<number | null>(null);
	const calibrationSum = useRef(0);
	const calibrationCount = useRef(0);
	const restAnchor = useRef<number | null>(null);
	const restSince = useRef(0);
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
			const now = performance.now();

			if (baseline.current === null) {
				if (calibrationStart.current === null) {
					calibrationStart.current = now;
				}
				calibrationSum.current += value;
				calibrationCount.current += 1;

				const isCalibrated = now - calibrationStart.current >= CALIBRATION_MS;
				if (isCalibrated) {
					baseline.current = calibrationSum.current / calibrationCount.current;
				}
				return;
			}

			// Rest: the reading has stayed inside a small band for a while.
			const hasMoved =
				restAnchor.current === null ||
				Math.abs(value - restAnchor.current) > REST_TOLERANCE;
			if (hasMoved) {
				restAnchor.current = value;
				restSince.current = now;
			}
			const isResting = now - restSince.current >= REST_MS;
			const isShortOfThreshold =
				Math.abs(value - baseline.current) < TILT_THRESHOLD;
			if (isResting && isShortOfThreshold) {
				baseline.current = value;
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
		calibrationStart.current = null;
		calibrationSum.current = 0;
		calibrationCount.current = 0;
		restAnchor.current = null;
		restSince.current = 0;
		armed.current = true;
		pastSince.current = null;
		pastDirection.current = null;
	}, []);

	return { supported, recalibrate };
};
