import { clampSpyCount } from "@/games/spy/rules";
import { pick } from "@/lib/pick";

/** Random spy indices for one round. At least one player always keeps the word. */
export const assignSpies = (
	playerCount: number,
	spyCount: number,
): number[] => {
	const everyone = Array.from({ length: playerCount }, (_, index) => index);
	return pick(everyone, clampSpyCount(spyCount, playerCount)).sort(
		(a, b) => a - b,
	);
};
