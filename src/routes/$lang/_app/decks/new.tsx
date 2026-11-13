import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { DeckEditorScreen } from "@/decks/screens/deck-editor-screen";
import { getMessages } from "@/i18n";

const NewDeckRoute = () => {
	const { lang } = Route.useParams();

	return <DeckEditorScreen lang={lang} />;
};

export const Route = createFileRoute("/$lang/_app/decks/new")({
	ssr: false,
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.decks.createTitle,
			noindex: true,
		});
	},
	component: NewDeckRoute,
});
