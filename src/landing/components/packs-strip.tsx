import type { Locale } from "@/config/app";
import { packChoices } from "@/decks/categories";
import { packIcons } from "@/decks/pack-icons";
import { getMessages, interpolate } from "@/i18n";
import { cn } from "@/lib/utils";

/** Complete Tailwind classes: they must stay literal for the scanner. */
const PACK_ACCENTS = [
	"bg-accent-lime",
	"bg-accent-cyan",
	"bg-accent-fuchsia",
] as const;

/** Every deck a round can draw from, as one wrap of chips. */
export const PacksStrip = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<section className="flex flex-col gap-4 rounded-xl border-2 border-foreground bg-card p-6 shadow-sticker-sm">
			<div className="flex flex-wrap items-baseline justify-between gap-2">
				<h2 className="font-display font-extrabold text-2xl uppercase tracking-tight">
					{interpolate(m.home.packsTitle, { count: packChoices.length })}
				</h2>
				<p className="text-muted-foreground">
					{interpolate(m.home.packsBody, {
						themed: packChoices.length - 1,
					})}
				</p>
			</div>
			<ul className="flex flex-wrap gap-2">
				{packChoices.map((pack, index) => {
					const Icon = packIcons[pack];
					return (
						<li
							className="flex items-center gap-2 rounded-full border-2 border-border bg-background py-1 pr-3.5 pl-1 font-bold text-sm"
							key={pack}
						>
							<span
								className={cn(
									"flex size-7 items-center justify-center rounded-full border-2 border-foreground text-accent-ink",
									PACK_ACCENTS[index % PACK_ACCENTS.length],
								)}
							>
								<Icon aria-hidden="true" className="size-3.5" />
							</span>
							{m.category.packs[pack].name}
						</li>
					);
				})}
			</ul>
		</section>
	);
};
