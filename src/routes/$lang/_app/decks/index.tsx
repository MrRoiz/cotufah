import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { DecksScreen } from "@/decks/decks-screen";
import { getMessages } from "@/i18n";

const DecksRoute = () => {
	const { lang } = Route.useParams();

	return <DecksScreen lang={lang} />;
};

export const Route = createFileRoute("/$lang/_app/decks/")({
	// Decks only exist in localStorage: SSR would paint the empty state first.
	ssr: false,
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.decks.title,
			description: m.decks.subtitle,
			noindex: true,
		});
	},
	component: DecksRoute,
});
