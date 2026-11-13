import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { GamesScreen } from "@/games/screens/games-screen";
import { getMessages } from "@/i18n";

const GamesRoute = () => {
	const { lang } = Route.useParams();

	return <GamesScreen lang={lang} />;
};

export const Route = createFileRoute("/$lang/_app/games/")({
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.games.title,
			description: m.games.subtitle,
			noindex: true,
		});
	},
	component: GamesRoute,
});
