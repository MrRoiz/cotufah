import { ChevronDownIcon, ShuffleIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";

import { CustomDeckPicker } from "@/components/custom-decks/picker-section";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { Locale } from "@/config/app";
import {
	type CategoryChoice,
	isCustomCategory,
	packChoices,
} from "@/data/schema";
import { packIcons } from "@/games/pack-icons";
import { useCustomDecks } from "@/hooks/use-custom-decks";
import { getMessages, plural } from "@/i18n";
import { findCustomDeck } from "@/lib/custom-decks";
import { cn } from "@/lib/utils";

/**
 * Deck picker shared by both setup screens. The setup only carries the chosen
 * deck; the twelve packs live in a bottom sheet so the form stays short and
 * each card has room for a description.
 */
export const CategoryField = ({
	locale,
	category,
	onChange,
}: {
	locale: Locale;
	category: CategoryChoice;
	onChange: (value: CategoryChoice) => void;
}) => {
	const m = getMessages(locale);
	const [open, setOpen] = useState(false);
	const { decks } = useCustomDecks();

	const current = (() => {
		if (category === "mixed") {
			return {
				icon: ShuffleIcon,
				name: m.category.mixed,
				body: m.category.mixedBody,
			};
		}
		if (isCustomCategory(category)) {
			const deck = findCustomDeck(category);
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
	})();
	const CurrentIcon = current.icon;

	const choose = (choice: CategoryChoice) => {
		onChange(choice);
		setOpen(false);
	};

	return (
		<section className="mt-8 flex flex-col gap-3">
			<h2 className="font-bold text-lg">{m.category.title}</h2>
			<p className="text-muted-foreground text-sm">{m.category.body}</p>

			<button
				aria-expanded={open}
				aria-haspopup="dialog"
				className="flex items-center gap-3 rounded-xl border-2 border-foreground bg-card p-4 text-left shadow-sticker-sm"
				onClick={() => setOpen(true)}
				type="button"
			>
				<span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-accent-lime text-accent-ink">
					<CurrentIcon aria-hidden="true" className="size-5" />
				</span>
				<span className="flex flex-1 flex-col">
					<span className="font-bold">{current.name}</span>
					<span className="text-muted-foreground text-xs">{current.body}</span>
				</span>
				<span className="flex items-center gap-1 font-bold text-muted-foreground text-xs">
					{m.category.change}
					<ChevronDownIcon aria-hidden="true" className="size-4" />
				</span>
			</button>

			<Sheet onOpenChange={setOpen} open={open}>
				<SheetContent className="max-h-[85dvh] overflow-y-auto" side="bottom">
					<SheetHeader>
						<SheetTitle className="font-display text-xl uppercase">
							{m.category.sheetTitle}
						</SheetTitle>
						<SheetDescription>{m.category.body}</SheetDescription>
					</SheetHeader>

					<div className="flex flex-col gap-2 px-4 pb-4">
						<button
							aria-pressed={category === "mixed"}
							className={cn(
								"flex w-full items-center gap-2 rounded-lg border-2 p-3 text-left font-bold",
								category === "mixed"
									? "border-foreground bg-accent-lime text-accent-ink"
									: "border-border bg-card",
							)}
							onClick={() => choose("mixed")}
							type="button"
						>
							<ShuffleIcon aria-hidden="true" className="size-4" />
							{m.category.mixed}
						</button>

						<div className="grid grid-cols-2 gap-2">
							{packChoices.map((choice) => {
								const Icon = packIcons[choice];
								const pack = m.category.packs[choice];
								const selected = category === choice;
								return (
									<button
										aria-pressed={selected}
										className={cn(
											"flex min-h-20 flex-col items-start gap-1 rounded-lg border-2 p-3 text-left",
											selected
												? "border-foreground bg-accent-lime text-accent-ink"
												: "border-border bg-card",
										)}
										key={choice}
										onClick={() => choose(choice)}
										type="button"
									>
										<span className="flex items-center gap-1.5 font-bold text-sm">
											<Icon aria-hidden="true" className="size-4 shrink-0" />
											{pack.name}
										</span>
										<span
											className={cn(
												"text-xs leading-tight",
												selected ? "opacity-80" : "text-muted-foreground",
											)}
										>
											{pack.body}
										</span>
									</button>
								);
							})}
						</div>

						<CustomDeckPicker
							decks={decks}
							locale={locale}
							onChoose={choose}
							selected={category}
						/>
					</div>
				</SheetContent>
			</Sheet>
		</section>
	);
};
