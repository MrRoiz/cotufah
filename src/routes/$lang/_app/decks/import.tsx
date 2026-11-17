import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { DeckImportScreen } from "@/decks/screens/deck-import-screen";
import { getMessages } from "@/i18n";

const ImportRoute = () => {
	const { lang } = Route.useParams();
	const { d } = Route.useSearch();

	return <DeckImportScreen lang={lang} payload={d} />;
};

export const Route = createFileRoute("/$lang/_app/decks/import")({
	ssr: false,
	validateSearch: (search: Record<string, unknown>) => ({
		d: typeof search.d === "string" ? search.d : "",
	}),
	head: ({ params }) => {
		// This is the link people paste into chats, so its preview invites them in.
		// It stays generic: decoding the deck here would put its words through the
		// server, which the share sheet promises never happens.
		const messages = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: messages.decks.importPreviewTitle,
			description: messages.decks.importPreviewBody,
			noindex: true,
		});
	},
	component: ImportRoute,
});
