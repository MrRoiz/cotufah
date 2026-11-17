import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { DecksScreen } from "@/decks/screens/decks-screen";
import { getMessages } from "@/i18n";

const DecksRoute = () => {
	const { lang } = Route.useParams();

	return <DecksScreen lang={lang} />;
};

export const Route = createFileRoute("/$lang/_app/decks/")({
	// Decks only exist in localStorage: SSR would paint the empty state first.
	ssr: false,
	head: ({ params }) => {
		const messages = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: messages.decks.title,
			description: messages.decks.subtitle,
			noindex: true,
		});
	},
	component: DecksRoute,
});
