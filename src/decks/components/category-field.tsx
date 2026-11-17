import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import { DeckPickerSheet } from "@/decks/components/deck-picker-sheet";
import { useCategorySummary } from "@/decks/hooks/use-category-summary";
import { getMessages } from "@/i18n";

/**
 * The deck row shared by both setup screens: the deck in play and a way to
 * change it. Every choice lives in a bottom sheet so the form stays short.
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
	const messages = getMessages(locale);
	const [open, setOpen] = useState(false);
	const current = useCategorySummary(locale, category);
	const CurrentIcon = current.icon;

	const choose = (choice: CategoryChoice) => {
		onChange(choice);
		setOpen(false);
	};

	return (
		<section className="flex flex-col gap-3">
			<h2 className="font-bold text-lg">{messages.category.title}</h2>

			<button
				aria-expanded={open}
				aria-haspopup="dialog"
				className="flex items-center gap-3 rounded-xl border-2 border-foreground bg-card p-4 text-left shadow-sticker-sm"
				onClick={() => setOpen(true)}
				type="button"
			>
				<span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-accent-lime text-accent-ink">
					<CurrentIcon aria-hidden="true" className="size-5" />
				</span>
				<span className="flex min-w-0 flex-1 flex-col">
					<span className="truncate font-bold">{current.name}</span>
					<span className="truncate text-muted-foreground text-sm">
						{current.body}
					</span>
				</span>
				<span className="flex items-center gap-1 font-bold text-muted-foreground text-sm">
					{messages.category.change}
					<ChevronDownIcon aria-hidden="true" className="size-4" />
				</span>
			</button>

			<DeckPickerSheet
				category={category}
				locale={locale}
				onChoose={choose}
				onOpenChange={setOpen}
				open={open}
			/>
		</section>
	);
};
