import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { categorySearch, DEFAULT_CATEGORY } from "@/decks/categories";
import { CharadesSetup } from "@/games/charades/setup";
import { getMessages } from "@/i18n";

const CharadesSetupRoute = () => {
	const { lang } = Route.useParams();
	const { category = DEFAULT_CATEGORY } = Route.useSearch();

	return <CharadesSetup category={category} lang={lang} />;
};

export const Route = createFileRoute("/$lang/_app/games/charades/setup")({
	// In the URL so the deck survives a trip to "Manage decks" and back.
	validateSearch: categorySearch,
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.games.charades.name,
			description: m.charades.setupIntro,
			noindex: true,
		});
	},
	component: CharadesSetupRoute,
});
