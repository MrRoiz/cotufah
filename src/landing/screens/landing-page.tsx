import { Link } from "@tanstack/react-router";

import { app, type Locale } from "@/config/app";
import { getMessages } from "@/i18n";
import { CustomDecks } from "@/landing/components/custom-decks";
import { Footer } from "@/landing/components/footer";
import { Games } from "@/landing/components/games";
import { Hero } from "@/landing/components/hero";
import { HowItWorks } from "@/landing/components/how-it-works";
import { PacksStrip } from "@/landing/components/packs-strip";
import { Quotes } from "@/landing/components/quotes";
import { Why } from "@/landing/components/why";
import { Button } from "@/ui/button";
import { LocaleSwitch } from "@/ui/locale-switch";
import { ModeToggle } from "@/ui/mode-toggle";

const navLinkClass = "font-bold hover:underline underline-offset-4";

/** The marketing page: a header, the sections in reading order, a footer. */
export const LandingPage = ({ lang }: { lang: Locale }) => {
	const messages = getMessages(lang);

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-5 md:px-8">
			<header className="flex items-center justify-between gap-4 py-5">
				<Link
					className="flex min-h-12 items-center gap-2.5 font-display font-extrabold text-2xl tracking-tight"
					params={{ lang }}
					to="/$lang"
				>
					<span
						aria-hidden="true"
						className="size-3.5 rounded-full border-2 border-foreground bg-accent-lime"
					/>
					{app.name}
				</Link>
				<nav
					aria-label={messages.home.sectionsLabel}
					className="hidden items-center gap-7 md:flex"
				>
					<a className={navLinkClass} href="#games">
						{messages.nav.games}
					</a>
					<a className={navLinkClass} href="#how-it-works">
						{messages.home.howTitle}
					</a>
					<a className={navLinkClass} href="#decks">
						{messages.nav.decks}
					</a>
				</nav>
				<div className="flex items-center gap-2">
					<LocaleSwitch lang={lang} to="/$lang" />
					<ModeToggle locale={lang} />
					<Button
						asChild
						className="hidden md:inline-flex"
						size="sm"
						variant="sticker"
					>
						<Link params={{ lang }} to="/$lang/games">
							{messages.home.cta}
						</Link>
					</Button>
				</div>
			</header>

			<main className="flex flex-1 flex-col">
				<Hero lang={lang} />
				<Games lang={lang} />
				<PacksStrip lang={lang} />
				<CustomDecks lang={lang} />
				<HowItWorks lang={lang} />
				<Quotes lang={lang} />
				<Why lang={lang} />
			</main>
			<Footer lang={lang} />
		</div>
	);
};
