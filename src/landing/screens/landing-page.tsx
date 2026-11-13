import { Link } from "@tanstack/react-router";

import { app, type Locale } from "@/config/app";
import { CustomDecks } from "@/landing/components/custom-decks";
import { Footer } from "@/landing/components/footer";
import { Games } from "@/landing/components/games";
import { Hero } from "@/landing/components/hero";
import { HowItWorks } from "@/landing/components/how-it-works";
import { PacksMarquee } from "@/landing/components/packs-marquee";
import { Quotes } from "@/landing/components/quotes";
import { Why } from "@/landing/components/why";
import { LocaleSwitch } from "@/ui/locale-switch";
import { ModeToggle } from "@/ui/mode-toggle";

/** The marketing page: a header, the sections in reading order, a footer. */
export const LandingPage = ({ lang }: { lang: Locale }) => {
	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-5 md:px-8">
			<header className="flex items-center justify-between gap-4 py-5">
				<Link
					className="font-display text-xl uppercase tracking-tight"
					params={{ lang }}
					to="/$lang"
				>
					{app.name}
				</Link>
				<div className="flex items-center gap-2">
					<LocaleSwitch lang={lang} to="/$lang" />
					<ModeToggle locale={lang} />
				</div>
			</header>

			<main className="flex flex-1 flex-col">
				<Hero lang={lang} />
				<Games lang={lang} />
				<PacksMarquee lang={lang} />
				<CustomDecks lang={lang} />
				<HowItWorks lang={lang} />
				<Quotes lang={lang} />
				<Why lang={lang} />
			</main>
			<Footer lang={lang} />
		</div>
	);
};
