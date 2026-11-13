/**
 * Spy's fixed rules: limits that the setup form, the play route and the round
 * hook all have to agree on. Kept apart from the hook so panels and schemas do
 * not import React state just to read a number.
 */
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 12;
export const HANDOFF_SECONDS = 5;
export const DISCUSS_SECONDS = 120;

/** The timers and their bars read one total, so the fill cannot drift. */
export const HANDOFF_MS = HANDOFF_SECONDS * 1000;
export const DISCUSS_MS = DISCUSS_SECONDS * 1000;

export type SpyPhase = "deal" | "handoff" | "discuss" | "vote" | "reveal";

/** At least one player keeps the word, so there is always one clear spy fewer. */
export const maxSpies = (playerCount: number): number =>
	Math.max(1, playerCount - 1);

/** One spy at least, and never so many that nobody is left with the word. */
export const clampSpyCount = (spyCount: number, playerCount: number): number =>
	Math.min(Math.max(1, Math.trunc(spyCount)), maxSpies(playerCount));

/** Search params are a trust boundary: never let a hand-typed URL break a round. */
export const parseSpyCount = (value: unknown, playerCount: number): number => {
	const parsed = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(parsed)) {
		return 1;
	}
	return clampSpyCount(parsed, playerCount);
};

/** Players travel in the URL, encoded so `|` and `%` inside a name survive. */
export const parsePlayers = (value: string): string[] => {
	return value
		.split("|")
		.map((name) => decodeURIComponent(name))
		.filter(Boolean);
};

export const serializePlayers = (names: string[]): string =>
	names.map(encodeURIComponent).join("|");
