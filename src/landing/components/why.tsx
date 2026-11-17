import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";
import { Button } from "@/ui/button";

/**
 * The closing band before the footer: why this app, and one last way in.
 * Light theme inverts it to ink. Dark theme uses the brand plum instead:
 * inverting there would make it a cream slab, the brightest thing on a dark page.
 */
export const Why = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<section className="my-10 flex flex-col gap-6 rounded-xl border-2 border-foreground bg-foreground p-8 text-background shadow-sticker md:flex-row md:items-center md:justify-between dark:bg-accent-plum dark:text-foreground">
			<div className="flex max-w-xl flex-col gap-2">
				<h2 className="font-display font-extrabold text-3xl uppercase leading-none tracking-tight md:text-4xl">
					{m.home.whyTitle}
				</h2>
				<p className="leading-relaxed opacity-90">{m.home.whyBody}</p>
			</div>
			<Button asChild className="w-fit shrink-0" size="lg" variant="sticker">
				<Link params={{ lang }} to="/$lang/games">
					{m.home.cta}
					<ArrowRightIcon aria-hidden="true" />
				</Link>
			</Button>
		</section>
	);
};
