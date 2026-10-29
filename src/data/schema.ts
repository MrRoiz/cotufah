import { z } from "zod";

import { locales } from "@/config/app";

/**
 * Decks come in two shapes: each game owns its classic list (`data/<game>/`),
 * and the themed packs are shared by both games per locale (`data/packs/`).
 * "mixed" is a selection, not a file: it draws from the classic list and every
 * themed pack.
 */
export const themedCategories = [
	"movies",
	"disney",
	"actors",
	"objects",
	"kitchen",
	"gaming",
	"animals",
	"music",
	"sports",
	"food",
	"places",
] as const;

export type ThemedCategory = (typeof themedCategories)[number];

export const packChoices = ["clasico", ...themedCategories] as const;

export const categoryChoices = ["mixed", ...packChoices] as const;

export type CategoryChoice = (typeof categoryChoices)[number];

export const isCategoryChoice = (value: unknown): value is CategoryChoice =>
	typeof value === "string" &&
	(categoryChoices as readonly string[]).includes(value);

const words = z.array(z.string().trim().min(1)).min(8);

export const deckSchema = z.object({
	id: z.string().min(1),
	game: z.enum(["spy", "charades"]),
	locale: z.enum(locales),
	label: z.string().min(1),
	items: words,
});

export const packSchema = z.object({
	locale: z.enum(locales),
	label: z.string().min(1),
	categories: z.object({
		movies: words,
		disney: words,
		actors: words,
		objects: words,
		kitchen: words,
		gaming: words,
		animals: words,
		music: words,
		sports: words,
		food: words,
		places: words,
	}),
});

export type Deck = z.infer<typeof deckSchema>;
export type Pack = z.infer<typeof packSchema>;
