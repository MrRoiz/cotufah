import { ClipboardIcon, PlusIcon } from "lucide-react";
import { type KeyboardEvent, useRef, useState } from "react";
import type { Locale } from "@/config/app";
import { PasteWordsSheet } from "@/decks/components/paste-words-sheet";
import { WordChips } from "@/decks/components/word-chips";
import { MAX_NAME, MAX_WORDS, MIN_WORDS } from "@/decks/custom-decks";
import type { DeckDraft } from "@/decks/hooks/use-deck-draft";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

/**
 * The deck's name and its words as chips: type one and Enter, or paste a
 * whole list. Saving lives in the screen's footer, which reads the same draft.
 */
export const DeckForm = ({
	locale,
	draft,
}: {
	locale: Locale;
	draft: DeckDraft;
}) => {
	const m = getMessages(locale);
	const inputRef = useRef<HTMLInputElement>(null);
	const [word, setWord] = useState("");
	const [isPasting, setIsPasting] = useState(false);
	const hasEnough = draft.words.length >= MIN_WORDS;
	const fillPercent = Math.min(100, (draft.words.length / MAX_WORDS) * 100);

	const addTyped = () => {
		if (draft.addWord(word)) {
			setWord("");
		}
		// The + button takes focus on tap; give it back so the next word flows.
		inputRef.current?.focus();
	};

	const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== "Enter") {
			return;
		}
		event.preventDefault();
		addTyped();
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<label className="font-bold text-lg" htmlFor="deck-name">
					{m.decks.nameLabel}
				</label>
				<Input
					className="h-14 rounded-xl border-foreground px-4 font-bold text-lg"
					id="deck-name"
					maxLength={MAX_NAME}
					onChange={(event) => draft.setName(event.target.value)}
					placeholder={m.decks.namePlaceholder}
					value={draft.name}
				/>
			</div>

			<section className="flex flex-col gap-3">
				<div className="flex items-baseline justify-between gap-3">
					<h2 className="font-bold text-lg">{m.decks.wordsLabel}</h2>
					<span className="font-extrabold text-muted-foreground text-sm tabular-nums">
						{draft.words.length} / {MAX_WORDS}
					</span>
				</div>
				<div
					aria-hidden="true"
					className="h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-card"
				>
					<div
						className={cn(
							"h-full rounded-full transition-[width]",
							hasEnough ? "bg-accent-lime" : "bg-accent-fuchsia",
						)}
						style={{ width: `${fillPercent}%` }}
					/>
				</div>

				<WordChips m={m} onRemove={draft.removeWord} words={draft.words} />

				<div className="flex gap-2">
					<label className="sr-only" htmlFor="new-word">
						{m.decks.wordLabel}
					</label>
					<Input
						aria-describedby={draft.error ? "deck-error" : undefined}
						autoComplete="off"
						className="h-13 flex-1 rounded-xl px-4"
						disabled={draft.isFull}
						enterKeyHint="done"
						id="new-word"
						onChange={(event) => setWord(event.target.value)}
						onKeyDown={onKeyDown}
						placeholder={m.decks.wordPlaceholder}
						ref={inputRef}
						value={word}
					/>
					<Button
						aria-label={m.decks.addWord}
						className="size-13 rounded-xl"
						disabled={draft.isFull}
						onClick={addTyped}
						size="icon"
						type="button"
						variant="sticker"
					>
						<PlusIcon aria-hidden="true" />
					</Button>
				</div>

				<p className="-mt-1 flex flex-wrap items-center gap-x-1.5 text-muted-foreground text-sm">
					{m.decks.pasteHint}
					<button
						className="inline-flex min-h-11 items-center gap-1.5 px-1 font-extrabold text-foreground underline decoration-2 underline-offset-4"
						onClick={() => setIsPasting(true)}
						type="button"
					>
						<ClipboardIcon aria-hidden="true" className="size-4" />
						{m.decks.pasteOpen}
					</button>
				</p>

				{draft.error ? (
					<p
						className="font-bold text-destructive text-sm"
						id="deck-error"
						role="alert"
					>
						{draft.error}
					</p>
				) : null}
			</section>

			<PasteWordsSheet
				locale={locale}
				onOpenChange={setIsPasting}
				onPaste={draft.pasteWords}
				open={isPasting}
			/>
		</div>
	);
};
