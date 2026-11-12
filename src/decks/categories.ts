/**
 * Deck taxonomy, deliberately zod-free: the landing page and the setup screens
 * only need these constants, and importing them must not pull the schema
 * validator into the client bundle.
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
	"brands",
] as const;

export const packChoices = ["clasico", ...themedCategories] as const;

export const categoryChoices = ["mixed", ...packChoices] as const;

export const CUSTOM_PREFIX = "custom:";

/** The server caps a round at this many words; custom decks hold more. */
export const MAX_ROUND_WORDS = 40;

/** A deck the player wrote on their own phone, addressed as `custom:<id>`. */
export type CustomCategory = `${typeof CUSTOM_PREFIX}${string}`;

export type CategoryChoice = (typeof categoryChoices)[number] | CustomCategory;

/** What the server can resolve: custom decks never leave the phone. */
export type ServerCategory = (typeof categoryChoices)[number];

export const isCustomCategory = (value: string): value is CustomCategory =>
	value.startsWith(CUSTOM_PREFIX);

export const isCategoryChoice = (value: unknown): value is CategoryChoice =>
	typeof value === "string" &&
	((categoryChoices as readonly string[]).includes(value) ||
		isCustomCategory(value));

/** The deck a round falls back to when the URL or a removed deck says nothing. */
export const DEFAULT_CATEGORY = "clasico" as const;

/** Narrow a search param to a deck choice, or `undefined` when it is not one. */
export const toCategoryChoice = (value: unknown): CategoryChoice | undefined =>
	isCategoryChoice(value) ? value : undefined;
