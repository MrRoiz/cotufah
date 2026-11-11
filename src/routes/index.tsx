import { createFileRoute, redirect } from "@tanstack/react-router";

import { DEFAULT_LOCALE } from "@/i18n";

export const Route = createFileRoute("/")({
	// Deterministic entry point: the bare domain always lands on Spanish, so a
	// shared link and its preview never depend on the crawler's language.
	beforeLoad: () => {
		throw redirect({ to: "/$lang", params: { lang: DEFAULT_LOCALE } });
	},
});
