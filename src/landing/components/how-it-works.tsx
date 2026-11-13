import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";

/** Complete Tailwind classes: they must stay literal for the scanner. */
const STEP_BADGES = [
	"bg-accent-cyan -rotate-3",
	"bg-accent-lime rotate-2",
	"bg-accent-fuchsia -rotate-2",
] as const;

/** The three-step explainer; the hero CTA anchors here. */
export const HowItWorks = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<section className="flex flex-col gap-5 py-10" id="how-it-works">
			<h2 className="font-display text-3xl uppercase">{m.home.howTitle}</h2>
			<ol className="grid gap-x-4 gap-y-6 md:grid-cols-3">
				{[
					[m.home.step1Title, m.home.step1Body],
					[m.home.step2Title, m.home.step2Body],
					[m.home.step3Title, m.home.step3Body],
				].map(([title, body], index) => (
					<li
						className="relative flex flex-col gap-2 rounded-xl border-2 border-foreground bg-card p-5 pt-7 shadow-sticker-sm"
						key={title}
					>
						<span
							className={cn(
								"absolute -top-4 left-4 flex size-10 items-center justify-center rounded-full border-2 border-foreground font-display text-lg text-accent-ink",
								STEP_BADGES[index],
							)}
						>
							{index + 1}
						</span>
						<span className="font-bold">{title}</span>
						<span className="text-muted-foreground text-sm">{body}</span>
					</li>
				))}
			</ol>
		</section>
	);
};
