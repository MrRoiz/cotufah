import { QrCode, useAbsoluteUrl } from "@/components/qr-code";
import type { Locale } from "@/config/app";
import { app } from "@/config/app";
import { getMessages, interpolate, localizedPath } from "@/i18n";
import { cn } from "@/lib/utils";

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
export const PhoneGate = ({
	locale,
	className,
}: {
	locale: Locale;
	className?: string;
}) => {
	const m = getMessages(locale);
	const path = localizedPath(locale, "games");
	const target = useAbsoluteUrl(path);

	return (
		<div
			className={cn(
				"fixed inset-0 z-50 hidden flex-col items-center justify-center gap-6 bg-background px-8 text-center",
				"[@media(min-width:768px)_and_(min-height:500px)]:flex",
				className,
			)}
			data-gate=""
		>
			<span className="w-fit rounded-full border-2 border-foreground bg-accent-cyan px-3 py-1 font-bold text-accent-ink text-xs uppercase tracking-widest shadow-sticker-sm">
				{m.gate.badge}
			</span>

			<h1 className="max-w-md font-display text-4xl uppercase leading-none">
				{interpolate(m.gate.title, { app: app.name })}
			</h1>

			<p className="max-w-sm text-muted-foreground">{m.gate.body}</p>

			<div className="rounded-xl border-2 border-accent-ink bg-white p-4 shadow-sticker">
				<QrCode
					alt={interpolate(m.gate.qrAlt, { app: app.name })}
					className="size-44"
					path={path}
				/>
			</div>

			<div className="flex flex-col gap-1">
				<p className="text-muted-foreground text-sm">{m.gate.fallback}</p>
				<code className="break-all font-mono text-foreground text-sm">
					{target || path}
				</code>
			</div>

			<p className="text-muted-foreground text-xs">{m.gate.hint}</p>
		</div>
	);
};
