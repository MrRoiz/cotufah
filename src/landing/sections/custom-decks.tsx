import { SparklesIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";

/** The "write your own words" teaser card. */
export const CustomDecks = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<section className="py-10">
			<div className="flex flex-col gap-4 rounded-xl border-2 border-foreground bg-card p-6 shadow-sticker-sm md:flex-row md:items-center">
				<span className="flex size-14 shrink-0 -rotate-3 items-center justify-center rounded-2xl border-2 border-foreground bg-accent-lime text-accent-ink shadow-sticker-sm">
					<SparklesIcon aria-hidden="true" className="size-7" />
				</span>
				<div className="flex flex-col gap-1">
					<h2 className="font-display text-2xl uppercase">
						{m.home.customTitle}
					</h2>
					<p className="text-muted-foreground text-sm">{m.home.customBody}</p>
				</div>
			</div>
		</section>
	);
};
