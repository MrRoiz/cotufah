import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { app } from "@/config/app";
import { localeFromPath } from "@/i18n";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import appCss from "@/styles.css?url";
import { Toaster } from "@/ui/sonner";

const RootDocument = ({ children }: { children: React.ReactNode }) => {
	const { locale } = Route.useRouteContext();

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					<QueryProvider>
						{children}
						<Toaster />
						{import.meta.env.DEV ? <Devtools /> : null}
					</QueryProvider>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
};
export const Route = createRootRoute({
	// Locale comes from the first path segment, so `<html lang>` and `/$lang`
	// can never disagree — no client-only detection, no hydration mismatch.
	beforeLoad: ({ location }) => ({ locale: localeFromPath(location.pathname) }),
	// Static, site-wide metadata: only og:type, og:site_name and twitter:card.
	// Everything per-route or per-language (title, description, the OG card)
	// lives in `config/seo.ts` and must not be repeated here.
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover",
			},
			// Routes override this with a localized title.
			{ title: app.name },
			{ name: "theme-color" },
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: app.name },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "apple-mobile-web-app-capable", content: "yes" },
			{ name: "apple-mobile-web-app-status-bar-style", content: "default" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "manifest", href: "/manifest.webmanifest" },
			{
				rel: "icon",
				href: "/icons/favicon-32.png",
				type: "image/png",
				sizes: "32x32",
			},
			{
				rel: "icon",
				href: "/icons/favicon-192.png",
				type: "image/png",
				sizes: "192x192",
			},
			{
				rel: "apple-touch-icon",
				href: "/icons/apple-touch-icon.png",
				sizes: "180x180",
			},
		],
	}),
	shellComponent: RootDocument,
});

const Devtools = () => {
	return (
		<TanStackDevtools
			config={{ position: "bottom-right" }}
			plugins={[
				{ name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> },
			]}
		/>
	);
};
