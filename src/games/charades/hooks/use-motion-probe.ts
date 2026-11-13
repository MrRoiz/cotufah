import { useEffect, useState } from "react";

import { hasGravity, isIosDevice } from "@/lib/motion-sensor";

export type MotionProbe = "unknown" | "yes" | "no";

/** How long the intro waits for a real sample before calling it unsupported. */
const PROBE_MS = 1200;

/**
 * Cheap sensor probe for the intro: if no motion event arrives shortly after
 * mount, the device/browser will not give us tilts, so the UI can teach the
 * tap zones instead. Skipped when the platform asks for permission first (iOS),
 * because there we cannot know until the user grants it.
 */
export const useMotionProbe = (enabled: boolean): MotionProbe => {
	const [state, setState] = useState<MotionProbe>("unknown");

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
		}, PROBE_MS);

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
 * wait for the user's answer instead of guessing. The answer cannot change
 * during a session, so it is read once.
 */
let reliable: boolean | null = null;

export const motionProbeReliable = (): boolean => {
	if (typeof navigator === "undefined") {
		return false;
	}
	reliable ??= !isIosDevice();
	return reliable;
};
