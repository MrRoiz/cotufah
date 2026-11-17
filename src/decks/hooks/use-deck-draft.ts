import { useState } from "react";

import type { Locale } from "@/config/app";
import {
	type CustomDeck,
	customDeckSchema,
	type DeckWriteFailure,
	MAX_DECKS,
	MAX_WORD,
	MAX_WORDS,
	MIN_WORDS,
	newDeckId,
} from "@/decks/custom-decks";
import {
	mergeWords,
	splitWordList,
	type WordProblem,
} from "@/decks/merge-words";
import { getMessages, interpolate } from "@/i18n";

/**
 * The deck being written or edited: name, word chips, the add/paste/remove
 * rules and saving. Kept apart from the JSX so the form and the footer
 * button can read the same state.
 */
export const useDeckDraft = ({
	locale,
	deck,
	onSave,
}: {
	locale: Locale;
	/** The deck being edited; omitted when writing a new one. */
	deck?: CustomDeck;
	onSave: (deck: CustomDeck) => DeckWriteFailure | null;
}) => {
	const messages = getMessages(locale);
	const [name, setName] = useState(deck?.name ?? "");
	const [words, setWords] = useState<string[]>(deck?.words ?? []);
	const [error, setError] = useState<string | null>(null);

	const problemMessages: Record<WordProblem, string> = {
		tooLong: interpolate(messages.decks.wordLengthError, { max: MAX_WORD }),
		taken: messages.decks.wordTaken,
		full: interpolate(messages.decks.wordsFull, { max: MAX_WORDS }),
	};

	/** `true` when at least one word made it in, so the field can clear. */
	const add = (candidates: string[]): boolean => {
		const merged = mergeWords(words, candidates);
		const added = merged.words.length > words.length;
		setWords(merged.words);
		setError(merged.problem ? problemMessages[merged.problem] : null);
		return added;
	};

	const removeWord = (index: number) => {
		setWords(words.filter((_, position) => position !== index));
		setError(null);
	};

	const save = () => {
		const parsed = customDeckSchema.safeParse({
			// Editing keeps the id, so a re-shared QR updates the same deck.
			id: deck?.id ?? newDeckId(),
			name,
			words,
		});
		if (!parsed.success) {
			setError(messages.decks.nameError);
			return;
		}

		const failure = onSave(parsed.data);
		if (failure) {
			setError(
				failure === "limit"
					? interpolate(messages.decks.limitError, { max: MAX_DECKS })
					: messages.decks.saveError,
			);
		}
	};

	const missingWords = Math.max(0, MIN_WORDS - words.length);
	const hasName = name.trim().length > 0;

	return {
		name,
		setName,
		words,
		error,
		missingWords,
		hasName,
		canSave: hasName && missingWords === 0,
		isFull: words.length >= MAX_WORDS,
		addWord: (word: string) => add([word]),
		pasteWords: (text: string) => add(splitWordList(text)),
		removeWord,
		save,
	};
};

export type DeckDraft = ReturnType<typeof useDeckDraft>;
