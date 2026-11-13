import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { DeckEditorScreen } from "@/decks/screens/deck-editor-screen";
import { getMessages } from "@/i18n";

const EditDeckRoute = () => {
	const { lang, deckId } = Route.useParams();

	return <DeckEditorScreen deckId={deckId} lang={lang} />;
};

export const Route = createFileRoute("/$lang/_app/decks/$deckId")({
	ssr: false,
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.decks.editTitle,
			noindex: true,
		});
	},
	component: EditDeckRoute,
});
