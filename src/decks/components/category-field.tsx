import { CheckIcon, ChevronDownIcon, ShuffleIcon } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/config/app";
import { type CategoryChoice, packChoices } from "@/decks/categories";
import { CustomDeckPicker } from "@/decks/components/custom-deck-picker";
import { useCategorySummary } from "@/decks/hooks/use-category-summary";
import { useCustomDecks } from "@/decks/hooks/use-custom-decks";
import { packIcons } from "@/decks/pack-icons";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/ui/sheet";

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
	const current = useCategorySummary(locale, category);
	const CurrentIcon = current.icon;

	const choose = (choice: CategoryChoice) => {
		onChange(choice);
		setOpen(false);
	};

	return (
		<section className="flex flex-col gap-3">
			<h2 className="font-bold text-lg">{m.category.title}</h2>

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
								"flex min-h-14 w-full items-center gap-3 rounded-xl border-2 p-3 text-left",
								category === "mixed"
									? "border-foreground bg-accent-lime text-accent-ink shadow-sticker-sm"
									: "border-border bg-card",
							)}
							onClick={() => choose("mixed")}
							type="button"
						>
							<ShuffleIcon aria-hidden="true" className="size-5 shrink-0" />
							<span className="flex flex-1 flex-col">
								<span className="font-bold">{m.category.mixed}</span>
								<span className="text-sm">{m.category.mixedBody}</span>
							</span>
							{category === "mixed" ? (
								<CheckIcon aria-hidden="true" className="size-5 shrink-0" />
							) : null}
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
