import type { Duration } from "@/games/charades/rules";
import type { Messages } from "@/i18n";

/** "90 seconds" / "2 minutes": the one spelling of a round length. */
export const durationLabel = (m: Messages, duration: Duration): string => {
	const labels: Record<Duration, string> = {
		60: m.charades.duration60,
		90: m.charades.duration90,
		120: m.charades.duration120,
	};
	return labels[duration];
};
