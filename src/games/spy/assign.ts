import { pick } from "@/games/pick";
import { maxSpies } from "@/games/spy/rules";

/** Random spy indices for one round. At least one player always keeps the word. */
export const assignSpies = (
	playerCount: number,
	spyCount: number,
): number[] => {
	const everyone = Array.from({ length: playerCount }, (_, index) => index);
	const liars = Math.min(Math.max(1, spyCount), maxSpies(playerCount));
	return pick(everyone, liars).sort((a, b) => a - b);
};
