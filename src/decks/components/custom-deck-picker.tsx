import { Link } from "@tanstack/react-router";
import { PlusIcon, SparklesIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import type { CategoryChoice, CustomCategory } from "@/decks/categories";
import { DeckOption } from "@/decks/components/deck-option";
import { type CustomDeck, customCategoryId } from "@/decks/custom-decks";
import { getMessages, plural } from "@/i18n";
import { Button } from "@/ui/button";

/**
 * Decks written on this phone, listed under the themed packs. With none yet,
 * an invitation to write one replaces the list.
 */
export const CustomDeckPicker = ({
	decks,
	locale,
	selected,
	onChoose,
}: {
	decks: CustomDeck[];
	locale: Locale;
	selected: CategoryChoice;
	onChoose: (value: CustomCategory) => void;
}) => {
	const messages = getMessages(locale);
	const hasDecks = decks.length > 0;

	return (
		<section className="flex flex-col gap-3 border-border border-t-2 pt-3">
			<div className="flex min-h-11 items-center justify-between gap-2">
				<h3 className="font-extrabold text-xs uppercase tracking-widest">
					{messages.decks.pickerTitle}
				</h3>
				{hasDecks ? (
					<Link
						className="flex min-h-11 items-center font-extrabold text-sm"
						params={{ lang: locale }}
						to="/$lang/decks"
					>
						{messages.decks.manage}
					</Link>
				) : null}
			</div>

			{hasDecks ? (
				<div className="flex flex-col gap-2">
					{decks.map((deck) => {
						const value = customCategoryId(deck.id);
						return (
							<DeckOption
								className="min-h-15 items-center gap-3 px-3.5"
								key={deck.id}
								onClick={() => onChoose(value)}
								selected={selected === value}
							>
								<span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-accent-cyan text-accent-ink">
									<SparklesIcon aria-hidden="true" className="size-4" />
								</span>
								<span className="min-w-0 flex-1 truncate font-extrabold">
									{deck.name}
								</span>
								<span className="font-bold text-muted-foreground text-sm group-aria-pressed:text-accent-ink/75">
									{plural(locale, deck.words.length, messages.decks.wordCount)}
								</span>
							</DeckOption>
						);
					})}
					<Link
						className="flex min-h-13 items-center justify-center gap-2 rounded-xl border-2 border-input border-dashed font-extrabold text-muted-foreground"
						params={{ lang: locale }}
						to="/$lang/decks/new"
					>
						<PlusIcon aria-hidden="true" className="size-4" />
						{messages.decks.createTitle}
					</Link>
				</div>
			) : (
				<div className="flex flex-col items-start gap-3 rounded-xl border-2 border-foreground border-dashed p-4">
					<span
						aria-hidden="true"
						className="flex size-11 -rotate-6 items-center justify-center rounded-full border-2 border-foreground bg-accent-cyan text-accent-ink"
					>
						<SparklesIcon className="size-5" />
					</span>
					<span className="flex flex-col gap-1">
						<span className="font-extrabold text-lg">
							{messages.decks.pickerEmptyTitle}
						</span>
						<span className="text-muted-foreground text-sm">
							{messages.decks.pickerEmptyBody}
						</span>
					</span>
					<Button asChild variant="sticker">
						<Link params={{ lang: locale }} to="/$lang/decks/new">
							<PlusIcon aria-hidden="true" />
							{messages.decks.pickerCreate}
						</Link>
					</Button>
				</div>
			)}
		</section>
	);
};
