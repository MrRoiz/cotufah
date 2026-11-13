import { z } from "zod";

import { locales } from "@/config/app";
import { gameSlugs } from "@/config/games";
import { type ThemedCategory, themedCategories } from "@/decks/categories";

/**
 * Deck contract, validated at server boot. The client-safe taxonomy lives in
 * `decks/categories.ts`; only the server and local-deck storage import this file.
 *
 * Decks come in two shapes: each game owns its classic list (`data/<game>/`),
 * and the themed packs are shared by both games per locale (`data/packs/`).
 */
const words = z.array(z.string().trim().min(1)).min(8);

export const deckSchema = z.object({
	id: z.string().min(1),
	game: z.enum(gameSlugs),
	locale: z.enum(locales),
	label: z.string().min(1),
	items: words,
});

// One key per themed pack, so the taxonomy is the only list of packs to edit.
const packCategories = Object.fromEntries(
	themedCategories.map((category) => [category, words]),
) as Record<ThemedCategory, typeof words>;

export const packSchema = z.object({
	locale: z.enum(locales),
	label: z.string().min(1),
	categories: z.object(packCategories),
});

export type Deck = z.infer<typeof deckSchema>;
export type Pack = z.infer<typeof packSchema>;

/** Shapes the word banks must satisfy at compile time (`satisfies`). */
export type DeckInput = z.input<typeof deckSchema>;
export type PackInput = z.input<typeof packSchema>;
