import { pick } from "@/games/pick";

/**
 * Random spy indices for one round. At least one player always keeps the word,
 * so `spyCount` is clamped to `playerCount - 1`.
 */
export const assignSpies = (
	playerCount: number,
	spyCount: number,
): number[] => {
	const everyone = Array.from({ length: playerCount }, (_, index) => index);
	const liars = Math.max(1, Math.min(spyCount, playerCount - 1));
	return pick(everyone, liars).sort((a, b) => a - b);
};
