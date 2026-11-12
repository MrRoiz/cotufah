import { useSyncExternalStore } from "react";

import {
	getCustomDecksServerSnapshot,
	getCustomDecksSnapshot,
	removeCustomDeck,
	saveCustomDeck,
	subscribeCustomDecks,
} from "@/decks/custom-decks";

/**
 * Local-only decks. `useSyncExternalStore` keeps every mounted consumer in
 * sync (and across tabs through the `storage` event) without a state library.
 */
export const useCustomDecks = () => ({
	decks: useSyncExternalStore(
		subscribeCustomDecks,
		getCustomDecksSnapshot,
		getCustomDecksServerSnapshot,
	),
	save: saveCustomDeck,
	remove: removeCustomDeck,
});
