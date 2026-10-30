import { Link } from "@tanstack/react-router";
import { SparklesIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import type { CustomCategory } from "@/data/schema";
import { getMessages, plural } from "@/i18n";
import { type CustomDeck, customCategoryId } from "@/lib/custom-decks";
import { cn } from "@/lib/utils";

/** Decks written on this phone, listed under the themed packs. */
export const CustomDeckPicker = ({
	decks,
	locale,
	selected,
	onChoose,
}: {
	decks: CustomDeck[];
	locale: Locale;
	selected: string;
	onChoose: (value: CustomCategory) => void;
}) => {
	const m = getMessages(locale);

	return (
		<div className="mt-2 flex flex-col gap-2 border-border border-t-2 pt-4">
			<div className="flex items-center justify-between gap-2">
				<span className="font-bold text-sm">{m.decks.pickerTitle}</span>
				<Link
					className="font-bold text-sm underline-offset-4 hover:underline"
					params={{ lang: locale }}
					to="/$lang/decks"
				>
					{m.decks.manage}
				</Link>
			</div>

			{decks.length === 0 ? (
				<p className="text-muted-foreground text-xs">{m.decks.pickerEmpty}</p>
			) : (
				decks.map((deck) => {
					const value = customCategoryId(deck.id);
					const isSelected = selected === value;
					return (
						<button
							aria-pressed={isSelected}
							className={cn(
								"flex min-h-14 w-full items-center gap-2 rounded-lg border-2 p-3 text-left",
								isSelected
									? "border-foreground bg-accent-lime text-accent-ink"
									: "border-border bg-card",
							)}
							key={deck.id}
							onClick={() => onChoose(value)}
							type="button"
						>
							<SparklesIcon aria-hidden="true" className="size-4 shrink-0" />
							<span className="flex flex-col">
								<span className="font-bold text-sm">{deck.name}</span>
								<span
									className={cn(
										"text-xs",
										isSelected ? "opacity-80" : "text-muted-foreground",
									)}
								>
									{plural(locale, deck.words.length, m.decks.wordCount)}
								</span>
							</span>
						</button>
					);
				})
			)}
		</div>
	);
};
