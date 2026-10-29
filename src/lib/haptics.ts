/**
 * Haptics for gesture feedback. Android honours this; iOS Safari has no
 * vibration API, so on iPhone the visual flash is the only confirmation.
 */
export type HapticKind = "correct" | "pass";

const patterns: Record<HapticKind, number | number[]> = {
	correct: 60,
	// Two pulses, so "pass" feels different from "correct" without looking.
	pass: [40, 60, 40],
};

export const haptic = (kind: HapticKind) => {
	if (
		typeof navigator === "undefined" ||
		typeof navigator.vibrate !== "function"
	) {
		return;
	}
	navigator.vibrate(patterns[kind]);
};
