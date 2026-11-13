import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";
import { SectionHeading } from "@/ui/section-heading";

/** Testimonials; copy lives in `home.quotes` in both locales. */
export const Quotes = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<section className="flex flex-col gap-5 py-10">
			<SectionHeading
				title={m.home.quotesTitle}
				subtitle={m.home.quotesSubtitle}
			/>
			<div className="grid gap-6 md:grid-cols-3">
				{m.home.quotes.map((item) => (
					<blockquote
						className="relative flex flex-col justify-between gap-4 rounded-2xl border-2 border-foreground bg-card p-5 shadow-sticker-sm"
						key={item.quote}
					>
						<span
							aria-hidden="true"
							className="pointer-events-none absolute top-1 right-4 font-display text-6xl leading-none opacity-10"
						>
							”
						</span>
						<p className="relative font-display text-xl leading-tight">
							“{item.quote}”
						</p>
						<footer className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
							{item.author}
						</footer>
						<span
							aria-hidden="true"
							className="absolute -bottom-[9px] left-8 size-4 rotate-45 border-r-2 border-b-2 border-foreground bg-card"
						/>
					</blockquote>
				))}
			</div>
		</section>
	);
};
