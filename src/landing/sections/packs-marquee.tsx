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

/** The pack strip: every themed deck sliding in an infinite loop. */
export const PacksMarquee = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<div className="flex flex-col gap-3 rounded-xl border-2 border-foreground bg-card p-4 shadow-sticker-sm">
			<div className="flex flex-col gap-1">
				<p className="font-display text-xl uppercase">
					{interpolate(m.home.packsTitle, { count: packChoices.length })}
				</p>
				<p className="text-muted-foreground text-xs">
					{interpolate(m.home.packsBody, {
						themed: packChoices.length - 1,
					})}
				</p>
			</div>
			<div className="pack-marquee -mx-4">
				<div className="pack-marquee-track flex w-max">
					{/* Two identical rows make the loop seamless. */}
					{[0, 1].map((copy) => (
						<ul
							aria-hidden={copy === 1 ? true : undefined}
							className={cn(
								"flex shrink-0 gap-2 pr-2",
								copy === 1 && "motion-reduce:hidden",
							)}
							key={copy}
						>
							{packChoices.map((pack, index) => {
								const Icon = packIcons[pack];
								return (
									<li
										className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-border bg-background py-1 pr-2.5 pl-1 font-bold text-xs"
										key={pack}
									>
										<span
											className={cn(
												"flex size-6 items-center justify-center rounded-full",
												PACK_ACCENTS[index % PACK_ACCENTS.length],
											)}
										>
											<Icon
												aria-hidden="true"
												className="size-3.5 text-accent-ink"
											/>
										</span>
										{m.category.packs[pack].name}
									</li>
								);
							})}
						</ul>
					))}
				</div>
			</div>
		</div>
	);
};
