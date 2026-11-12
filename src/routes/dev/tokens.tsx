import { createFileRoute, notFound } from "@tanstack/react-router";

import { TokensPage } from "@/dev/tokens-page";

export const Route = createFileRoute("/dev/tokens")({
	beforeLoad: () => {
		if (!import.meta.env.DEV) {
			throw notFound();
		}
	},
	component: TokensPage,
});
