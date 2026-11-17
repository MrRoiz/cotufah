import { z } from "zod";

import { type CategoryChoice, toCategoryChoice } from "@/decks/categories";
import { DURATIONS, type Duration } from "@/games/charades/rules";
import { MAX_PLAYERS, MIN_PLAYERS } from "@/games/spy/rules";

/** Brand-free key, like the theme and the decks: a rename keeps it. */
const STORAGE_KEY = "app.lastRound";

const categorySchema = z.custom<CategoryChoice>(
	(value) => toCategoryChoice(value) !== undefined,
);

const durationSchema = z.custom<Duration>((value) =>
	(DURATIONS as readonly unknown[]).includes(value),
);

/** Storage is a trust boundary: anything that fails this is ignored. */
const lastRoundSchema = z.discriminatedUnion("game", [
	z.object({
		game: z.literal("spy"),
		category: categorySchema,
		players: z
			.array(z.string().trim().min(1))
			.min(MIN_PLAYERS)
			.max(MAX_PLAYERS),
		spies: z.number().int().positive(),
	}),
	z.object({
		game: z.literal("charades"),
		category: categorySchema,
		duration: durationSchema,
	}),
]);

/** The setup of the last round started on this phone, for "play again". */
export type LastRound = z.infer<typeof lastRoundSchema>;

export const readLastRound = (): LastRound | null => {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return null;
		}
		const parsed = lastRoundSchema.safeParse(JSON.parse(raw));
		return parsed.success ? parsed.data : null;
	} catch {
		// Blocked storage or a corrupt entry only costs the shortcut.
		return null;
	}
};

export const saveLastRound = (round: LastRound) => {
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(round));
	} catch {
		// Private mode can refuse writes; the round itself must still play.
	}
};
