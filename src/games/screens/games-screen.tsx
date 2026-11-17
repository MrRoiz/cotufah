import { Link } from "@tanstack/react-router";

import { app, type Locale } from "@/config/app";
import { DecksRow } from "@/games/components/decks-row";
import { GameTile } from "@/games/components/game-tile";
import { LastRoundCard } from "@/games/components/last-round-card";
import { games } from "@/games/games";
import { useLastRound } from "@/games/hooks/use-last-round";
import { getMessages } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { BottomNav } from "@/layout/bottom-nav";
import { TabPageHeader } from "@/ui/tab-page-header";

/**
 * Static screen: no network. Decks are only fetched once a round starts; the
 * "play again" card appears after mount, once storage can be read.
 */
export const GamesScreen = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);
	const lastRound = useLastRound();

	return (
		<AppShell footer={<BottomNav lang={lang} />}>
			<Link
				className="flex min-h-12 w-fit items-center gap-2 font-display font-extrabold text-xl tracking-tight"
				params={{ lang }}
				to="/$lang"
			>
				<span
					aria-hidden="true"
					className="size-3.5 rounded-full border-2 border-foreground bg-accent-lime"
				/>
				{app.name}
			</Link>

			<TabPageHeader subtitle={m.games.subtitle} title={m.games.heading} />

			<div className="flex flex-col gap-4">
				{lastRound ? <LastRoundCard lang={lang} round={lastRound} /> : null}

				{games.map((game) => (
					<GameTile game={game} key={game.slug} lang={lang} />
				))}

				<DecksRow lang={lang} />

				<p className="flex min-h-12 items-center justify-center rounded-xl border-2 border-input border-dashed px-4 text-center font-bold text-muted-foreground text-sm">
					{m.games.comingSoon}
				</p>
			</div>
		</AppShell>
	);
};
