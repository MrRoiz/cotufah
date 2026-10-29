import { useCallback, useEffect, useRef, useState } from "react";

export type TiltDirection = "down" | "up";

/** |g| ≈ 9.8 on a real accelerometer; browsers with no sensor emit zeros. */
const hasGravity = (event: DeviceMotionEvent): boolean => {
	const gravity = event.accelerationIncludingGravity;
	if (!gravity) {
		return false;
	}
	const magnitude = Math.hypot(gravity.x ?? 0, gravity.y ?? 0, gravity.z ?? 0);
	return magnitude > 3;
};

type TiltOptions = {
	enabled: boolean;
	/** m/s² away from the calibrated pose before it counts as a tilt. */
	threshold?: number;
	/** Ignore repeat tilts within this window (ms). */
	cooldownMs?: number;
	/** The tilt has to stay past the threshold this long to count (ms). */
	holdMs?: number;
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
 * Baseline is captured on the first sample after a round starts. Tilting the
 * screen toward the floor (nodding forward) is negative z → "down".
 *
 * Spam guards: the tilt must hold for 120ms, the phone must return near neutral
 * (hysteresis at 40% of the threshold) before the next gesture, and two answers
 * are at least 1.1s apart.
 */
export const useTilt = ({
	enabled,
	threshold = 5.5,
	cooldownMs = 1100,
	holdMs = 120,
	onTilt,
}: TiltOptions) => {
	const baseline = useRef<number | null>(null);
	const smoothed = useRef(0);
	const armed = useRef(true);
	const lastFire = useRef(0);
	const pastSince = useRef<number | null>(null);
	const pastDirection = useRef<TiltDirection | null>(null);
	const tiltHandler = useRef(onTilt);
	tiltHandler.current = onTilt;

	const [delta, setDelta] = useState(0);
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

			setSupported(true);

			// Low-pass: raw accelerometer data is noisy enough to fire on a twitch.
			smoothed.current = smoothed.current + 0.25 * (z - smoothed.current);
			const value = smoothed.current;

			if (baseline.current === null) {
				baseline.current = value;
				return;
			}

			const difference = value - baseline.current;
			setDelta(difference);

			// Hysteresis: re-arm only once the phone is close to neutral again, so
			// jitter around the threshold cannot fire twice.
			if (Math.abs(difference) < threshold * 0.4) {
				armed.current = true;
				pastSince.current = null;
				pastDirection.current = null;
				return;
			}

			if (Math.abs(difference) < threshold) {
				pastSince.current = null;
				pastDirection.current = null;
				return;
			}

			const now = performance.now();
			const direction: TiltDirection = difference < 0 ? "down" : "up";

			// A deliberate tilt is held; a knock or a bump is not.
			if (pastSince.current === null || pastDirection.current !== direction) {
				pastSince.current = now;
				pastDirection.current = direction;
				return;
			}
			if (now - pastSince.current < holdMs) {
				return;
			}

			if (!armed.current || now - lastFire.current < cooldownMs) {
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
	}, [enabled, threshold, cooldownMs, holdMs]);

	const recalibrate = useCallback(() => {
		baseline.current = null;
		smoothed.current = 0;
		armed.current = true;
		pastSince.current = null;
		pastDirection.current = null;
	}, []);

	return { delta, supported, recalibrate };
};

type PermissionRequester = {
	requestPermission?: () => Promise<"granted" | "denied" | "default">;
};

/**
 * iOS 13+ gates motion sensors behind a user gesture. Must be called from a
 * tap; returns true when we may listen (or when no gate exists).

 */
export const requestMotionPermission = async (): Promise<boolean> => {
	if (typeof DeviceMotionEvent === "undefined") {
		return false;
	}

	const requester = DeviceMotionEvent as unknown as PermissionRequester;
	if (typeof requester.requestPermission !== "function") {
		return true;
	}

	try {
		return (await requester.requestPermission()) === "granted";
	} catch {
		return false;
	}
};

/**
 * Cheap sensor probe for the intro: if no motion event arrives shortly after
 * mount, the device/browser will not give us tilts, so the UI can teach the
 * tap zones instead. Skipped when the platform asks for permission first (iOS),
 * because there we cannot know until the user grants it.
 */
export const useMotionProbe = (enabled: boolean): "unknown" | "yes" | "no" => {
	const [state, setState] = useState<"unknown" | "yes" | "no">("unknown");

	useEffect(() => {
		if (!enabled) {
			return;
		}

		let settled = false;
		const onMotion = (event: DeviceMotionEvent) => {
			// Browsers with no sensor still emit events, just with zeros, so the
			// probe checks for a plausible gravity vector instead of any event.
			if (settled || !hasGravity(event)) {
				return;
			}
			settled = true;
			setState("yes");
		};

		window.addEventListener("devicemotion", onMotion);
		const timer = setTimeout(() => {
			if (settled) {
				return;
			}
			settled = true;
			setState("no");
		}, 1200);

		return () => {
			window.removeEventListener("devicemotion", onMotion);
			clearTimeout(timer);
		};
	}, [enabled]);

	return state;
};

/**
 * Whether the sensor probe can be trusted on the intro screen. Only iOS gates
 * motion behind a prompt before any events can arrive, so only there we have to
 * wait for the user's answer instead of guessing.
 */
export const motionProbeReliable = (): boolean => {
	if (typeof navigator === "undefined") {
		return false;
	}
	const ua = navigator.userAgent;
	const ios =
		/iPad|iPhone|iPod/.test(ua) ||
		(/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
	return !ios;
};
