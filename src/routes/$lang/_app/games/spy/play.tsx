import { createFileRoute, redirect } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { DEFAULT_CATEGORY, toCategoryChoice } from "@/decks/categories";
import { SpyPlayScreen } from "@/games/spy/play-screen";
import { MIN_PLAYERS, parsePlayers, parseSpyCount } from "@/games/spy/rules";
import { getMessages } from "@/i18n";

const SpyPlayRoute = () => {
	const { lang } = Route.useParams();
	const { category, players, spies } = Route.useSearch();

	return (
		<SpyPlayScreen
			category={category}
			lang={lang}
			playersParam={players}
			spyCount={spies}
		/>
	);
};

export const Route = createFileRoute("/$lang/_app/games/spy/play")({
	// Roles are dealt in the browser; rendering them on the server would hand
	// everyone the same notification and a hydration mismatch for the spy.
	ssr: false,
	validateSearch: (search: Record<string, unknown>) => {
		const players = typeof search.players === "string" ? search.players : "";
		return {
			category: toCategoryChoice(search.category) ?? DEFAULT_CATEGORY,
			players,
			spies: parseSpyCount(search.spies, parsePlayers(players).length),
		};
	},
	beforeLoad: ({ params, search }) => {
		if (parsePlayers(search.players).length < MIN_PLAYERS) {
			throw redirect({ to: "/$lang/games/spy/setup", params });
		}
	},
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.games.spy.name,
			noindex: true,
		});
	},
	component: SpyPlayRoute,
});
