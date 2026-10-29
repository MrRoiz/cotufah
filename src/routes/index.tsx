import { createFileRoute, redirect } from "@tanstack/react-router";

import { detectLocale } from "@/fns/locale.functions";

export const Route = createFileRoute("/")({
	// Cookie first, then Accept-Language, then Spanish: resolved on the server.
	beforeLoad: async () => {
		const lang = await detectLocale();
		throw redirect({ to: "/$lang", params: { lang } });
	},
});
