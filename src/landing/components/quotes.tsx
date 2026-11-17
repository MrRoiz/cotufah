import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/ui/section-heading";

/** Testimonials as speech bubbles; copy lives in `home.quotes` in both locales. */
export const Quotes = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<section className="flex flex-col gap-6 py-12">
			<SectionHeading
				title={m.home.quotesTitle}
				subtitle={m.home.quotesSubtitle}
			/>
			<div className="grid gap-5 md:grid-cols-3">
				{m.home.quotes.map((item, index) => (
					<blockquote
						className={cn(
							"flex flex-col justify-between gap-4 rounded-xl rounded-bl-sm border-2 border-foreground p-6",
							// The middle bubble takes the accent so the row reads as a conversation.
							index === 1 ? "bg-accent-cyan text-accent-ink" : "bg-card",
						)}
						key={item.quote}
					>
						<p className="font-display font-bold text-xl leading-tight">
							“{item.quote}”
						</p>
						<footer className="font-extrabold text-xs uppercase tracking-widest">
							— {item.author}
						</footer>
					</blockquote>
				))}
			</div>
		</section>
	);
};
