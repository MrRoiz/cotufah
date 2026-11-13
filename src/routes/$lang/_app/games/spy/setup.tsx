import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { categorySearch, DEFAULT_CATEGORY } from "@/decks/categories";
import { SpySetup } from "@/games/spy/screens/spy-setup";
import { getMessages } from "@/i18n";

const SpySetupRoute = () => {
	const { lang } = Route.useParams();
	const { category = DEFAULT_CATEGORY } = Route.useSearch();

	return <SpySetup category={category} lang={lang} />;
};

export const Route = createFileRoute("/$lang/_app/games/spy/setup")({
	// In the URL so the deck survives a trip to "Manage decks" and back.
	validateSearch: categorySearch,
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.games.spy.name,
			description: m.spy.setupIntro,
			noindex: true,
		});
	},
	component: SpySetupRoute,
});
