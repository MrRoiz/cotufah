import { type LucideIcon, ShuffleIcon, SparklesIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { type CategoryChoice, isCustomCategory } from "@/decks/categories";
import { customCategoryId } from "@/decks/custom-decks";
import { useCustomDecks } from "@/decks/hooks/use-custom-decks";
import { packIcons } from "@/decks/pack-icons";
import { getMessages, plural } from "@/i18n";

type CategorySummary = { icon: LucideIcon; name: string; body: string };

/** Icon, name and one-line description of a deck choice, custom ones included. */
export const useCategorySummary = (
	locale: Locale,
	category: CategoryChoice,
): CategorySummary => {
	const m = getMessages(locale);
	// Read the subscribed list, not localStorage: the store gives the server
	// snapshot while hydrating, so the summary cannot flash.
	const { decks } = useCustomDecks();

	if (category === "mixed") {
		return {
			icon: ShuffleIcon,
			name: m.category.mixed,
			body: m.category.mixedBody,
		};
	}

	if (isCustomCategory(category)) {
		const deck = decks.find(
			(candidate) => customCategoryId(candidate.id) === category,
		);
		if (deck) {
			return {
				icon: SparklesIcon,
				name: deck.name,
				body: plural(locale, deck.words.length, m.decks.wordCount),
			};
		}
		// Deleted after being picked: show the classic deck instead.
		return { icon: packIcons.clasico, ...m.category.packs.clasico };
	}

	return { icon: packIcons[category], ...m.category.packs[category] };
};
