import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { AppPageHeader } from "@/components/app-page-header";
import { GameCard } from "@/components/game-card";
import { AppShell } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/mode-toggle";
import { pageMeta } from "@/config/seo";
import { games } from "@/games/registry";
import { getMessages } from "@/i18n";

/**
 * Static screen: no network. Decks are only fetched once a round starts.
 */
const GamesPage = () => {
	const { lang } = Route.useParams();
	const m = getMessages(lang);

	return (
		<AppShell>
			<AppPageHeader
				backLabel={m.common.home}
				lang={lang}
				subtitle={m.games.subtitle}
				title={m.games.title}
				trailing={
					<ModeToggle className="rounded-full border-2" locale={lang} />
				}
			/>

			<div className="flex flex-col gap-5">
				{games.map((game) => (
					<GameCard game={game} key={game.slug} lang={lang} />
				))}

				<div className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-border border-dashed p-5 text-muted-foreground">
					<span className="flex size-10 items-center justify-center rounded-full border-2 border-border">
						<PlusIcon aria-hidden="true" className="size-5" />
					</span>
					<span className="font-bold text-xs uppercase tracking-widest">
						{m.common.soon}
					</span>
				</div>
			</div>
		</AppShell>
	);
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
	component: GamesPage,
});
