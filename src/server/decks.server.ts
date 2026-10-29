import { charadesEn } from "@/data/charades/en";
import { charadesEs } from "@/data/charades/es";
import { packsEn } from "@/data/packs/en";
import { packsEs } from "@/data/packs/es";
import {
	type CategoryChoice,
	type Deck,
	deckSchema,
	type Pack,
	packSchema,
	themedCategories,
} from "@/data/schema";
import { spyEn } from "@/data/spy/en";
import { spyEs } from "@/data/spy/es";
import { pick } from "@/games/pick";

/**
 * Server-only deck registry. Imported exclusively from `fns/*.functions.ts`,
 * which is what keeps word lists out of the client bundle. Zod validation runs
 * at module load: a malformed deck fails the boot, not a round.
 */
const decks: Deck[] = [spyEs, spyEn, charadesEs, charadesEn].map((deck) =>
	deckSchema.parse(deck),
);

const packs: Pack[] = [packsEs, packsEn].map((pack) => packSchema.parse(pack));

const findDeck = (game: Deck["game"], locale: Deck["locale"]): Deck => {
	const deck = decks.find(
		(candidate) => candidate.game === game && candidate.locale === locale,
	);
	if (!deck) {
		throw new Error(`No deck for ${game}/${locale}`);
	}
	return deck;
};

const findPack = (locale: Deck["locale"]): Pack => {
	const pack = packs.find((candidate) => candidate.locale === locale);
	if (!pack) {
		throw new Error(`No themed packs for ${locale}`);
	}
	return pack;
};

const itemsFor = (deck: Deck, category: CategoryChoice): string[] => {
	if (category === "clasico") {
		return deck.items;
	}
	const pack = findPack(deck.locale);
	if (category === "mixed") {
		// Classic words can repeat inside a pack (playa, parque, cine); a Set
		// keeps a round from dealing the same word twice.
		return [
			...new Set([
				...deck.items,
				...themedCategories.flatMap((key) => pack.categories[key]),
			]),
		];
	}
	return pack.categories[category];
};

/** Words for one round. Fetched once, when the round starts. */
export const getRoundWords = (
	game: Deck["game"],
	locale: Deck["locale"],
	count: number,
	category: CategoryChoice = "clasico",
): string[] => {
	return pick(itemsFor(findDeck(game, locale), category), count);
};
