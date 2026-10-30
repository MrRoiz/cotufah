import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/config/app";
import { getMessages, interpolate } from "@/i18n";
import {
	type CustomDeck,
	customDeckSchema,
	type DeckWriteFailure,
	MAX_DECKS,
	MAX_NAME,
	MAX_WORD,
	MAX_WORDS,
	MIN_WORDS,
	newDeckId,
} from "@/lib/custom-decks";

/** One textarea, one word per line: the least UI that can produce a deck. */
export const DeckForm = ({
	locale,
	deck,
	onSave,
}: {
	locale: Locale;
	/** The deck being edited; omitted when writing a new one. */
	deck?: CustomDeck;
	onSave: (deck: CustomDeck) => DeckWriteFailure | null;
}) => {
	const m = getMessages(locale);
	const [name, setName] = useState(deck?.name ?? "");
	const [words, setWords] = useState(deck?.words.join("\n") ?? "");
	const [error, setError] = useState<string | null>(null);

	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const lines = words
			.split("\n")
			.map((word) => word.trim())
			.filter(Boolean);

		// The count can be valid while a single word is too long, so say which.
		if (lines.some((word) => word.length > MAX_WORD)) {
			setError(interpolate(m.decks.wordLengthError, { max: MAX_WORD }));
			return;
		}

		const parsed = customDeckSchema.safeParse({
			// Editing keeps the id, so a re-shared QR updates the same deck.
			id: deck?.id ?? newDeckId(),
			name,
			words: lines,
		});

		if (!parsed.success) {
			setError(
				name.trim()
					? interpolate(m.decks.wordsError, {
							min: MIN_WORDS,
							max: MAX_WORDS,
						})
					: m.decks.nameError,
			);
			return;
		}

		const failure = onSave(parsed.data);
		if (failure) {
			setError(
				failure === "limit"
					? interpolate(m.decks.limitError, { max: MAX_DECKS })
					: m.decks.saveError,
			);
			return;
		}

		setName("");
		setWords("");
		setError(null);
	};

	return (
		<form className="flex flex-col gap-3" onSubmit={submit}>
			<div className="flex flex-col gap-1.5">
				<label className="font-bold text-sm" htmlFor="deck-name">
					{m.decks.nameLabel}
				</label>
				<Input
					id="deck-name"
					maxLength={MAX_NAME}
					onChange={(event) => setName(event.target.value)}
					placeholder={m.decks.namePlaceholder}
					value={name}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className="font-bold text-sm" htmlFor="deck-words">
					{m.decks.wordsLabel}
				</label>
				<textarea
					className="min-h-40 w-full rounded-lg border-2 border-input bg-card px-3 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
					id="deck-words"
					onChange={(event) => setWords(event.target.value)}
					placeholder={m.decks.wordsPlaceholder}
					value={words}
				/>
			</div>

			<p className="text-muted-foreground text-xs">
				{interpolate(m.decks.wordsHint, {
					min: MIN_WORDS,
					max: MAX_WORDS,
				})}
			</p>

			{error ? (
				<p className="font-bold text-destructive text-sm" role="alert">
					{error}
				</p>
			) : null}

			<Button className="mt-1" type="submit" variant="sticker">
				{deck ? m.decks.saveChanges : m.decks.save}
			</Button>
		</form>
	);
};
