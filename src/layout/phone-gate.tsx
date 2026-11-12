import { useParams, useRouterState } from "@tanstack/react-router";
import { app } from "@/config/app";
import { getMessages, interpolate } from "@/i18n";
import { Kicker } from "@/ui/kicker";
import { QrCode } from "@/ui/qr-code";
import { useAbsoluteUrl } from "@/ui/use-absolute-url";

/**
 * The app is phone-only. This overlay only exists under a desktop-ish media
 * query, so it is pure CSS until the QR needs to render — no user-agent
 * sniffing, no layout shift on the phone.
 *
 * Gate = wide AND tall: 1280x800 (laptop) or 768x1024 (tablet) match, while a
 * landscape phone (844x390) does not — which is exactly the distinction we
 * want. `pointer: fine` is deliberately avoided: it reports `none` in headless
 * browsers and on touchscreen laptops, so it would let desktops through.
 */
export const PhoneGate = () => {
	// Everything the overlay needs comes from the app it is covering: the locale
	// for its copy and the location for the QR, so the layout stays a plain
	// `PhoneGate + Outlet`.
	const { lang } = useParams({ from: "/$lang" });
	const m = getMessages(lang);
	// "Open this on your phone" is the gate's own job, so the target is read
	// here: path and search, so a laptop that clicked a game card hands the
	// phone that exact game and setup instead of the games list.
	const href = useRouterState({ select: (state) => state.location.href });
	const target = useAbsoluteUrl(href);

	return (
		<div
			className="fixed inset-0 z-50 hidden flex-col items-center justify-center gap-6 bg-background px-8 text-center [@media(min-width:768px)_and_(min-height:500px)]:flex"
			data-gate=""
		>
			<Kicker accent="cyan" tilt={false}>
				{m.gate.badge}
			</Kicker>

			<h1 className="max-w-md font-display text-4xl uppercase leading-none">
				{interpolate(m.gate.title, { app: app.name })}
			</h1>

			<p className="max-w-sm text-muted-foreground">{m.gate.body}</p>

			<div className="rounded-xl border-2 border-accent-ink bg-qr-paper p-4 shadow-sticker">
				<QrCode
					alt={interpolate(m.gate.qrAlt, { app: app.name })}
					className="size-44"
					path={href}
				/>
			</div>

			<div className="flex flex-col gap-1">
				<p className="text-muted-foreground text-sm">{m.gate.fallback}</p>
				<code className="break-all font-mono text-foreground text-sm">
					{target || href}
				</code>
			</div>

			<p className="text-muted-foreground text-xs">{m.gate.hint}</p>
		</div>
	);
};
