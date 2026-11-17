import type { Locale } from "@/config/app";
import { games } from "@/games/games";
import { getMessages } from "@/i18n";
import { GameCard } from "@/landing/components/game-card";
import { SectionHeading } from "@/ui/section-heading";

/** The game catalog: every registered game plus the "coming soon" strip. */
export const Games = ({ lang }: { lang: Locale }) => {
	const messages = getMessages(lang);

	return (
		<section className="flex flex-col gap-6 py-12" id="games">
			<SectionHeading
				title={messages.home.gamesTitle}
				subtitle={messages.home.gamesSubtitle}
			/>

			<div className="grid gap-5 md:grid-cols-2">
				{games.map((game) => (
					<GameCard game={game} key={game.slug} lang={lang} />
				))}
			</div>

			<p className="flex min-h-14 items-center justify-center rounded-xl border-2 border-input border-dashed px-4 text-center font-bold text-muted-foreground">
				{messages.games.comingSoon}
			</p>
		</section>
	);
};
