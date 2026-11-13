import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";

/** The closing "why this app" banner before the footer. */
export const Why = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<section className="py-10">
			<div className="flex flex-col gap-2 rounded-xl border-2 border-foreground bg-accent-lime p-5 text-accent-ink shadow-sticker">
				<h2 className="font-bold text-lg">{m.home.whyTitle}</h2>
				<p className="text-sm">{m.home.whyBody}</p>
			</div>
		</section>
	);
};
