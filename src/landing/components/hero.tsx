import { Link } from "@tanstack/react-router";
import { ArrowDownIcon, ArrowRightIcon, CheckIcon } from "lucide-react";

import { app, type Locale } from "@/config/app";
import { getMessages, interpolate, localizedPath } from "@/i18n";
import { PhoneMockup } from "@/landing/components/phone-mockup";
import { Button } from "@/ui/button";
import { Kicker } from "@/ui/kicker";
import { QrCode } from "@/ui/qr-code";
import { useAbsoluteUrl } from "@/ui/use-absolute-url";

/**
 * The pitch: what it is in one line, the two CTAs and three promises. On
 * desktop, the app drawn in a phone with the "open on your phone" QR beside it.
 */
export const Hero = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);
	const appPath = localizedPath(lang, "games");
	const appUrl = useAbsoluteUrl(appPath);

	return (
		<section className="grid items-center gap-10 py-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:py-14">
			<div className="flex flex-col items-start gap-5">
				<Kicker>{m.home.kicker}</Kicker>

				<h1 className="font-display font-extrabold text-5xl uppercase leading-[0.9] tracking-tight sm:text-6xl md:text-7xl">
					{m.home.headline}
				</h1>

				<p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
					{interpolate(m.home.intro, { app: app.name })}
				</p>

				<div className="flex flex-wrap items-center gap-3 pt-1">
					<Button asChild size="lg" variant="sticker">
						<Link params={{ lang }} to="/$lang/games">
							{m.home.cta}
							<ArrowRightIcon aria-hidden="true" />
						</Link>
					</Button>
					<Button
						asChild
						className="border-foreground"
						size="lg"
						variant="outline"
					>
						<a href="#how-it-works">
							<ArrowDownIcon aria-hidden="true" />
							{m.home.howTitle}
						</a>
					</Button>
				</div>

				<ul className="flex flex-wrap gap-2">
					{m.home.promises.map((promise) => (
						<li
							className="flex items-center gap-1.5 rounded-full border-2 border-border bg-card px-3 py-1 font-bold text-sm"
							key={promise}
						>
							<CheckIcon
								aria-hidden="true"
								className="size-4"
								strokeWidth={3}
							/>
							{promise}
						</li>
					))}
				</ul>
			</div>

			<div className="relative hidden h-[32rem] md:block">
				<PhoneMockup className="absolute top-0 left-4" lang={lang} />
				<aside className="absolute right-0 bottom-6 flex w-56 rotate-3 flex-col items-center gap-2.5 rounded-xl border-2 border-foreground bg-card p-4 text-center shadow-sticker">
					<h2 className="font-display font-extrabold text-lg uppercase leading-tight">
						{m.home.ctaDesktop}
					</h2>
					<div className="rounded-lg border-2 border-accent-ink bg-qr-paper p-2">
						<QrCode
							alt={interpolate(m.gate.qrAlt, { app: app.name })}
							className="size-36"
							path={appPath}
						/>
					</div>
					<p className="text-muted-foreground text-xs">{m.home.qrHint}</p>
					<p className="text-muted-foreground text-xs">{m.home.qrFallback}</p>
					<code className="break-all font-mono text-xs">
						{appUrl || appPath}
					</code>
				</aside>
			</div>
		</section>
	);
};
