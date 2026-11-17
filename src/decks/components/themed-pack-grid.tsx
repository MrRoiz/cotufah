import type { Locale } from "@/config/app";
import { type CategoryChoice, themedCategories } from "@/decks/categories";
import { DeckOption } from "@/decks/components/deck-option";
import { packIcons } from "@/decks/pack-icons";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";

/** Complete Tailwind classes: they must stay literal for the scanner. */
const PACK_DOTS = [
	"bg-accent-cyan",
	"bg-accent-lime",
	"bg-accent-fuchsia",
] as const;

/** The themed packs, counted and in two columns, each with its icon and one line. */
export const ThemedPackGrid = ({
	locale,
	category,
	onChoose,
}: {
	locale: Locale;
	category: CategoryChoice;
	onChoose: (value: CategoryChoice) => void;
}) => {
	const m = getMessages(locale);

	return (
		<>
			<div className="flex items-baseline justify-between">
				<h3 className="font-extrabold text-xs uppercase tracking-widest">
					{m.category.themedTitle}
				</h3>
				<span className="font-bold text-muted-foreground text-sm">
					{themedCategories.length}
				</span>
			</div>

			<div className="grid grid-cols-2 gap-2">
				{themedCategories.map((pack, index) => {
					const Icon = packIcons[pack];
					const copy = m.category.packs[pack];
					return (
						<DeckOption
							className="min-h-16 items-center gap-2.5 px-3 py-2.5"
							key={pack}
							onClick={() => onChoose(pack)}
							selected={category === pack}
						>
							<span
								className={cn(
									"flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-accent-ink",
									PACK_DOTS[index % PACK_DOTS.length],
								)}
							>
								<Icon aria-hidden="true" className="size-4" />
							</span>
							<span className="flex min-w-0 flex-col">
								<span className="truncate font-extrabold">{copy.name}</span>
								<span className="truncate text-muted-foreground text-xs group-aria-pressed:text-accent-ink/75">
									{copy.body}
								</span>
							</span>
						</DeckOption>
					);
				})}
			</div>
		</>
	);
};
