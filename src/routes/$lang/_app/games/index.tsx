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
		const messages = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: messages.games.title,
			description: messages.games.subtitle,
			noindex: true,
		});
	},
	component: GamesRoute,
});
