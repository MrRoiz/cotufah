/**
 * Draw `count` distinct items at random: pick a random index, then remove it
 * from the pool so a word can't repeat within the round.
 */
export const pick = <T>(items: readonly T[], count: number): T[] => {
	const pool = [...items];
	const picked: T[] = [];

	while (picked.length < count && pool.length > 0) {
		picked.push(...pool.splice(Math.floor(Math.random() * pool.length), 1));
	}

	return picked;
};
