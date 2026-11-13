import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { DEFAULT_CATEGORY, toCategoryChoice } from "@/decks/categories";
import { parseDuration } from "@/games/charades/rules";
import { CharadesPlayScreen } from "@/games/charades/screens/charades-play-screen";
import { getMessages } from "@/i18n";

const CharadesPlayRoute = () => {
	const { lang } = Route.useParams();
	const { category, duration } = Route.useSearch();

	return (
		<CharadesPlayScreen category={category} duration={duration} lang={lang} />
	);
};

export const Route = createFileRoute("/$lang/_app/games/charades/play")({
	ssr: false,
	validateSearch: (search: Record<string, unknown>) => ({
		category: toCategoryChoice(search.category) ?? DEFAULT_CATEGORY,
		duration: parseDuration(search.duration),
	}),
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.games.charades.name,
			noindex: true,
		});
	},
	component: CharadesPlayRoute,
});
