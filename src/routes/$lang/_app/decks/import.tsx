import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { DeckImportScreen } from "@/decks/import-screen";
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
		// The outcome is only known client-side, so the static title is generic.
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.decks.title,
			noindex: true,
		});
	},
	component: ImportRoute,
});
