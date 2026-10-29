import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownIcon, ArrowRightIcon, PlusIcon } from "lucide-react";

import { ExternalLink } from "@/components/external-link";
import { ModeToggle } from "@/components/mode-toggle";
import { QrCode, useAbsoluteUrl } from "@/components/qr-code";
import { Button } from "@/components/ui/button";
import { app } from "@/config/app";
import { absoluteUrl } from "@/config/site";
import { appVersion } from "@/config/version";
import { packChoices } from "@/data/schema";
import { packIcons } from "@/games/pack-icons";
import { gameCopy, games } from "@/games/registry";
import {
	getMessages,
	interpolate,
	localeLabel,
	localizedPath,
	otherLocale,
	writeLocaleCookie,
} from "@/i18n";
import { cn } from "@/lib/utils";

const PACK_ACCENTS = [
	"bg-accent-lime",
	"bg-accent-cyan",
	"bg-accent-fuchsia",
] as const;

const STEP_BADGES = [
	"bg-accent-cyan -rotate-3",
	"bg-accent-lime rotate-2",
	"bg-accent-fuchsia -rotate-2",
] as const;

const LandingPage = () => {
	const { lang } = Route.useParams();
	const m = getMessages(lang);
	const other = otherLocale(lang);
	const appPath = localizedPath(lang, "games");
	const appUrl = useAbsoluteUrl(appPath);

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
					<Link
						className="rounded-full px-2 py-1 font-bold text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
						onClick={() => writeLocaleCookie(other)}
						params={{ lang: other }}
						to="/$lang"
					>
						{localeLabel(other)}
					</Link>
					<ModeToggle className="rounded-full border-2" locale={lang} />
				</div>
			</header>

			<section className="grid items-center gap-10 py-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:py-16">
				<div className="flex flex-col items-start gap-5">
					<span className="w-fit -rotate-2 rounded-full border-2 border-foreground bg-accent-lime px-3 py-1 font-bold text-accent-ink text-xs uppercase tracking-widest shadow-sticker-sm">
						{m.home.kicker}
					</span>

					<h1 className="font-display text-5xl uppercase leading-[0.85] sm:text-6xl md:text-8xl">
						{app.name}
					</h1>

					<p className="font-bold text-muted-foreground text-xl md:text-2xl">
						{m.common.appTagline}
					</p>

					<p className="max-w-xl text-lg leading-relaxed">
						{interpolate(m.home.intro, { app: app.name })}
					</p>

					<div className="flex flex-wrap items-center gap-3 pt-1">
						<Button asChild size="lg" variant="sticker">
							<Link params={{ lang }} to="/$lang/games">
								{m.home.cta}
								<ArrowRightIcon aria-hidden="true" />
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<a href="#como-se-juega">
								<ArrowDownIcon aria-hidden="true" />
								{m.home.howTitle}
							</a>
						</Button>
					</div>
				</div>

				<aside className="hidden flex-col items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-6 text-center shadow-sticker md:flex">
					<h2 className="font-display text-xl uppercase">
						{m.home.ctaDesktop}
					</h2>
					<div className="rounded-xl border-2 border-accent-ink bg-white p-3">
						<QrCode
							alt={interpolate(m.gate.qrAlt, { app: app.name })}
							className="size-40"
							path={appPath}
						/>
					</div>
					<p className="text-muted-foreground text-sm">{m.home.qrHint}</p>
					<p className="text-muted-foreground text-xs">{m.home.qrFallback}</p>
					<code className="break-all font-mono text-xs">
						{appUrl || appPath}
					</code>
				</aside>
			</section>

			<section className="flex flex-col gap-5 py-10" id="juegos">
				<div className="flex flex-col gap-1">
					<h2 className="font-display text-3xl uppercase">
						{m.home.gamesTitle}
					</h2>
					<p className="text-muted-foreground">{m.home.gamesSubtitle}</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					{games.map((game) => {
						const copy = gameCopy(m, game.slug);
						return (
							<article
								className="flex flex-col overflow-hidden rounded-xl border-2 border-foreground bg-card"
								key={game.slug}
							>
								<div
									className={cn(
										"flex flex-col gap-1 bg-linear-to-br p-5",
										game.gradient,
									)}
								>
									<h3 className="font-display text-2xl uppercase">
										{copy.name}
									</h3>
									<p className="font-bold text-sm opacity-90">{copy.tagline}</p>
								</div>
								<div className="flex flex-1 flex-col gap-3 p-5">
									<p className="text-sm">{copy.body}</p>
									<div className="mt-auto flex flex-wrap items-center justify-between gap-2">
										<p className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
											{copy.players}
										</p>
									</div>
								</div>
							</article>
						);
					})}
					<div className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-border border-dashed p-5 text-muted-foreground md:col-span-2">
						<span className="flex size-10 items-center justify-center rounded-full border-2 border-border">
							<PlusIcon aria-hidden="true" className="size-5" />
						</span>
						<span className="font-bold text-xs uppercase tracking-widest">
							{m.common.soon}
						</span>
					</div>
				</div>

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
					<ul className="flex flex-wrap gap-2">
						{packChoices.map((pack, index) => {
							const Icon = packIcons[pack];
							return (
								<li
									className="flex items-center gap-1.5 rounded-full border-2 border-border bg-background py-1 pr-2.5 pl-1 font-bold text-xs"
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
				</div>
			</section>

			<section className="flex flex-col gap-5 py-10" id="como-se-juega">
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

			<section className="flex flex-col gap-5 py-10">
				<div className="flex flex-col gap-1">
					<h2 className="font-display text-3xl uppercase">
						{m.home.quotesTitle}
					</h2>
					<p className="text-muted-foreground">{m.home.quotesSubtitle}</p>
				</div>
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

			<section className="py-10">
				<div className="flex flex-col gap-2 rounded-xl border-2 border-foreground bg-accent-lime p-5 text-accent-ink shadow-sticker">
					<h2 className="font-bold text-lg">{m.home.whyTitle}</h2>
					<p className="text-sm">{m.home.whyBody}</p>
				</div>
			</section>

			<footer className="mt-auto flex flex-col gap-3 border-t-2 border-border py-6 text-muted-foreground text-sm md:flex-row md:items-center md:justify-between">
				<p className="flex flex-wrap items-center gap-2">
					{m.home.footerNote}
					<span className="rounded-full border border-border px-1.5 py-0.5 font-mono text-[0.65rem] leading-none">
						v{appVersion}
					</span>
				</p>
				<div className="flex items-center gap-4">
					<Link
						className="font-bold underline-offset-4 hover:text-foreground hover:underline"
						onClick={() => writeLocaleCookie(other)}
						params={{ lang: other }}
						to="/$lang"
					>
						{localeLabel(other)}
					</Link>
					<Link
						className="font-bold underline-offset-4 hover:text-foreground hover:underline"
						params={{ lang }}
						to="/$lang/settings"
					>
						{m.common.settings}
					</Link>
					<Link
						className="font-bold underline-offset-4 hover:text-foreground hover:underline"
						params={{ lang }}
						to="/$lang/about"
					>
						{m.common.about}
					</Link>
					<Link
						className="font-bold underline-offset-4 hover:text-foreground hover:underline"
						params={{ lang }}
						to="/$lang/legal"
					>
						{m.common.legal}
					</Link>
					<ExternalLink href={app.repo}>GitHub</ExternalLink>
				</div>
			</footer>
		</div>
	);
};
export const Route = createFileRoute("/$lang/")({
	head: ({ params }) => {
		const lang = params.lang;
		const m = getMessages(lang);
		const canonical = absoluteUrl(`/${lang}`);
		const alternate = absoluteUrl(`/${otherLocale(lang)}`);
		const title = `${app.name} — ${m.common.appTagline}`;

		return {
			meta: [
				{ title },
				{ name: "description", content: app.description[lang] },
				{ property: "og:title", content: title },
				{ property: "og:description", content: app.description[lang] },
				{ property: "og:locale", content: lang === "es" ? "es_CO" : "en_US" },
				...(canonical ? [{ property: "og:url", content: canonical }] : []),
			],
			links: [
				...(canonical ? [{ rel: "canonical", href: canonical }] : []),
				...(alternate
					? [{ rel: "alternate", hrefLang: otherLocale(lang), href: alternate }]
					: []),
				...(canonical
					? [{ rel: "alternate", hrefLang: lang, href: canonical }]
					: []),
			],
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: app.name,
						description: app.description[lang],
						applicationCategory: "GameApplication",
						operatingSystem: "iOS, Android",
						inLanguage: lang,
						offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
					}),
				},
			],
		};
	},
	component: LandingPage,
});
