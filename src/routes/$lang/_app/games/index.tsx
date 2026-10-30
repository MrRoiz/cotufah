import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { BackLink } from "@/components/back-link";
import { GameCard } from "@/components/game-card";
import { AppShell } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/mode-toggle";
import { app } from "@/config/app";
import { games } from "@/games/registry";
import { getMessages } from "@/i18n";

const GamesPage = () => {
	const { lang } = Route.useParams();
	const m = getMessages(lang);

	return (
		<AppShell>
			<header className="flex flex-col gap-3 pt-6 pb-6">
				<div className="flex items-start justify-between gap-4">
					<BackLink label={m.common.home} lang={lang} />
					<ModeToggle className="rounded-full border-2" locale={lang} />
				</div>
				<h1 className="font-display text-4xl uppercase">{m.games.title}</h1>
				<p className="text-muted-foreground">{m.games.subtitle}</p>
			</header>

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
		return {
			meta: [
				{ name: "robots", content: "noindex" },
				{ title: `${m.games.title} — ${app.name}` },
				{ name: "description", content: m.games.subtitle },
			],
		};
	},
	component: GamesPage,
});

/**
 * Static screen: no network. Decks are only fetched once a round starts.
 */
