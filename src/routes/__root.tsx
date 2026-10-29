import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { app } from "@/config/app";
import { localeFromPath } from "@/i18n";

import appCss from "@/styles.css?url";

// Open Graph requires absolute URLs; the card itself is language-neutral.
const ogImage = "https://cotufah.com/og.png";

const RootDocument = ({ children }: { children: React.ReactNode }) => {
	const { locale } = Route.useRouteContext();

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider defaultTheme="system" storageKey="app.theme">
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
			{ property: "og:image", content: ogImage },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:alt", content: app.name },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:image", content: ogImage },
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
