import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { type CategoryChoice, isCustomCategory } from "@/data/schema";
import { getRoundFn } from "@/fns/decks.functions";
import { pick } from "@/games/pick";
import { findCustomDeck } from "@/lib/custom-decks";

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
	game: "spy" | "charades";
	lang: "es" | "en";
	category: CategoryChoice;
	count: number;
}) => {
	// The source is fixed when the round mounts: a deck created or deleted in
	// another tab must not swap the words while a round is running.
	const [deckWords] = useState<string[] | null>(
		() => findCustomDeck(category)?.words ?? null,
	);
	const local = deckWords !== null;
	const serverCategory = isCustomCategory(category) ? "clasico" : category;
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
