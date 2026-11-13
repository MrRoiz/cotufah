import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import type { Locale } from "@/config/app";
import type { GameSlug } from "@/config/games";
import {
	type CategoryChoice,
	DEFAULT_CATEGORY,
	isCustomCategory,
} from "@/decks/categories";
import { findCustomDeck } from "@/decks/custom-decks";
import { getRoundFn } from "@/decks/get-round-fn";
import { pick } from "@/lib/pick";

/**
 * Words for a round, wherever they live: the server decks or a custom deck in
 * localStorage. Custom words never leave the phone, so they are picked here.
 */
export const useRoundWords = ({
	game,
	lang,
	category,
	count,
}: {
	game: GameSlug;
	lang: Locale;
	category: CategoryChoice;
	count: number;
}) => {
	// The source is fixed when the round mounts: a deck created or deleted in
	// another tab must not swap the words while a round is running.
	const [deckWords] = useState<string[] | null>(
		() => findCustomDeck(category)?.words ?? null,
	);
	const local = deckWords !== null;
	const serverCategory = isCustomCategory(category)
		? DEFAULT_CATEGORY
		: category;
	const [localWords, setLocalWords] = useState<string[]>(() =>
		deckWords ? pick(deckWords, count) : [],
	);

	const query = useQuery({
		queryKey: [game, lang, serverCategory, count],
		queryFn: () =>
			getRoundFn({
				data: { game, locale: lang, count, category: serverCategory },
			}),
		enabled: !local,
		staleTime: 0,
	});

	return {
		words: local ? localWords : (query.data ?? []),
		isPending: local ? false : query.isPending,
		isFetching: query.isFetching,
		refetch: () => {
			if (deckWords) {
				setLocalWords(pick(deckWords, count));
				return;
			}
			query.refetch();
		},
	};
};
