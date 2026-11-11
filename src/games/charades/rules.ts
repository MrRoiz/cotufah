/** Charades' fixed rules: the round lengths the setup offers and the state the
 *  round moves through. Shared by the route validators and the round hook. */
export const DURATIONS = [60, 90, 120] as const;

export type Duration = (typeof DURATIONS)[number];

export const DEFAULT_DURATION: Duration = 90;

export type CharadesPhase = "intro" | "countdown" | "playing" | "results";

export type CharadesAnswer = { word: string; correct: boolean };

/** Search params are a trust boundary: a hand-typed URL gets a real duration. */
export const parseDuration = (value: unknown): Duration => {
	const parsed = typeof value === "number" ? value : Number(value);
	return (DURATIONS as readonly number[]).includes(parsed)
		? (parsed as Duration)
		: DEFAULT_DURATION;
};
