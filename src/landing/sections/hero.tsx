import { Link } from "@tanstack/react-router";
import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";

import { app, type Locale } from "@/config/app";
import { getMessages, interpolate, localizedPath } from "@/i18n";
import { Button } from "@/ui/button";
import { Kicker } from "@/ui/kicker";
import { QrCode } from "@/ui/qr-code";
import { useAbsoluteUrl } from "@/ui/use-absolute-url";

/** The pitch: kicker, wordmark, CTAs, and the "open on your phone" QR aside. */
export const Hero = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);
	const appPath = localizedPath(lang, "games");
	const appUrl = useAbsoluteUrl(appPath);

	return (
		<section className="grid items-center gap-10 py-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:py-16">
			<div className="flex flex-col items-start gap-5">
				<Kicker>{m.home.kicker}</Kicker>

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
						<a href="#how-it-works">
							<ArrowDownIcon aria-hidden="true" />
							{m.home.howTitle}
						</a>
					</Button>
				</div>
			</div>

			<aside className="hidden flex-col items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-6 text-center shadow-sticker md:flex">
				<h2 className="font-display text-xl uppercase">{m.home.ctaDesktop}</h2>
				<div className="rounded-xl border-2 border-accent-ink bg-qr-paper p-3">
					<QrCode
						alt={interpolate(m.gate.qrAlt, { app: app.name })}
						className="size-40"
						path={appPath}
					/>
				</div>
				<p className="text-muted-foreground text-sm">{m.home.qrHint}</p>
				<p className="text-muted-foreground text-xs">{m.home.qrFallback}</p>
				<code className="break-all font-mono text-xs">{appUrl || appPath}</code>
			</aside>
		</section>
	);
};
