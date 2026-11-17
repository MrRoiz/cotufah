import { CheckIcon, ShuffleIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import { CustomDeckPicker } from "@/decks/components/custom-deck-picker";
import { DeckOption } from "@/decks/components/deck-option";
import { ThemedPackGrid } from "@/decks/components/themed-pack-grid";
import { useCategorySummary } from "@/decks/hooks/use-category-summary";
import { useCustomDecks } from "@/decks/hooks/use-custom-decks";
import { packIcons } from "@/decks/pack-icons";
import { getMessages } from "@/i18n";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/ui/sheet";

/**
 * Every deck a round can use, in one sheet: the one in play on top, then
 * the two basics, the themed packs and the player's own. Tapping one picks
 * it and closes the sheet.
 */
export const DeckPickerSheet = ({
	locale,
	category,
	open,
	onOpenChange,
	onChoose,
}: {
	locale: Locale;
	category: CategoryChoice;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onChoose: (value: CategoryChoice) => void;
}) => {
	const m = getMessages(locale);
	const { decks } = useCustomDecks();
	const current = useCategorySummary(locale, category);

	// The two decks that are not a theme: everything mixed, or the classic list.
	const basics = [
		{
			value: "mixed",
			icon: ShuffleIcon,
			name: m.category.mixed,
			body: m.category.mixedBody,
		},
		{ value: "clasico", icon: packIcons.clasico, ...m.category.packs.clasico },
	] as const;

	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent className="max-h-[88dvh] overflow-y-auto" side="bottom">
				<SheetHeader>
					<SheetTitle className="font-display font-extrabold text-2xl uppercase">
						{m.category.sheetTitle}
					</SheetTitle>
					<SheetDescription>{m.category.body}</SheetDescription>
				</SheetHeader>

				<div className="flex flex-col gap-4 px-4 pb-6">
					<div className="flex items-center gap-3 rounded-xl border-2 border-foreground border-dashed px-3.5 py-3">
						<span
							aria-hidden="true"
							className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
						>
							<CheckIcon className="size-4" strokeWidth={3.5} />
						</span>
						<span className="flex min-w-0 flex-col">
							<span className="font-extrabold text-muted-foreground text-xs uppercase tracking-widest">
								{m.category.current}
							</span>
							<span className="truncate font-extrabold text-lg leading-tight">
								{current.name}
							</span>
							<span className="truncate text-muted-foreground text-sm">
								{current.body}
							</span>
						</span>
					</div>

					<div className="grid grid-cols-2 gap-2.5">
						{basics.map((basic) => (
							<DeckOption
								className="min-h-26 flex-col items-start gap-2 p-3.5"
								key={basic.value}
								onClick={() => onChoose(basic.value)}
								selected={category === basic.value}
							>
								<span className="flex size-9 items-center justify-center rounded-full border-2 border-foreground bg-background text-foreground">
									<basic.icon aria-hidden="true" className="size-4" />
								</span>
								<span className="font-extrabold text-lg leading-tight">
									{basic.name}
								</span>
								<span className="text-muted-foreground text-xs group-aria-pressed:text-accent-ink/75">
									{basic.body}
								</span>
							</DeckOption>
						))}
					</div>

					<ThemedPackGrid
						category={category}
						locale={locale}
						onChoose={onChoose}
					/>

					<CustomDeckPicker
						decks={decks}
						locale={locale}
						onChoose={onChoose}
						selected={category}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
};
