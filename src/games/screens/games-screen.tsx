import type { Locale } from "@/config/app";
import { ComingSoonCard } from "@/games/components/coming-soon-card";
import { GameCard } from "@/games/components/game-card";
import { games } from "@/games/games";
import { getMessages } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { AppPageHeader } from "@/ui/app-page-header";
import { ModeToggle } from "@/ui/mode-toggle";

/**
 * Static screen: no network. Decks are only fetched once a round starts.
 */
export const GamesScreen = ({ lang }: { lang: Locale }) => {
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
				<ComingSoonCard className="min-h-[140px]" lang={lang} />
			</div>
		</AppShell>
	);
};
