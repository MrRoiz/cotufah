import { Link } from "@tanstack/react-router";
import { QrCodeIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/ui/section-heading";

/** Complete Tailwind classes: they must stay literal for the scanner. */
const WORD_FILLS = [
	"bg-accent-lime",
	"bg-accent-cyan",
	"bg-accent-fuchsia",
] as const;

/**
 * "Write your own words": the pitch, a link to the editor, and an example
 * deck drawn from the editor's own placeholders so the two always agree.
 */
export const CustomDecks = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);
	const exampleWords = m.decks.wordsPlaceholder.split("\n");

	return (
		<section
			className="grid items-center gap-8 py-12 md:grid-cols-2"
			id="decks"
		>
			<div className="flex flex-col items-start gap-5">
				<SectionHeading
					subtitle={m.home.customBody}
					title={m.home.customTitle}
				/>
				<Link
					className="inline-flex min-h-12 items-center rounded-full border-2 border-foreground bg-card px-5 font-extrabold"
					params={{ lang }}
					to="/$lang/decks/new"
				>
					{m.home.customCta}
				</Link>
			</div>

			<div
				aria-hidden="true"
				className="flex items-center gap-4 rounded-xl border-2 border-foreground bg-muted p-5"
			>
				<span className="flex size-28 shrink-0 items-center justify-center rounded-lg border-2 border-foreground bg-qr-paper text-accent-ink">
					<QrCodeIcon className="size-16" strokeWidth={1.5} />
				</span>
				<span className="flex min-w-0 flex-col gap-2">
					<span className="font-extrabold text-lg">
						{m.decks.namePlaceholder}
					</span>
					<span className="flex flex-wrap gap-1.5">
						{exampleWords.map((word, index) => (
							<span
								className={cn(
									"rounded-full border-2 border-foreground px-2.5 py-0.5 font-extrabold text-accent-ink text-sm",
									WORD_FILLS[index % WORD_FILLS.length],
								)}
								key={word}
							>
								{word}
							</span>
						))}
					</span>
				</span>
			</div>
		</section>
	);
};
