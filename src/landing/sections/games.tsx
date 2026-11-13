import type { Locale } from "@/config/app";
import { ComingSoonCard } from "@/games/coming-soon-card";
import { GameCard } from "@/games/game-card";
import { games } from "@/games/registry";
import { getMessages } from "@/i18n";
import { SectionHeading } from "@/ui/section-heading";

/** The game catalog: every registered game plus the "coming soon" slot. */
export const Games = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<section className="flex flex-col gap-5 py-10">
			<SectionHeading
				title={m.home.gamesTitle}
				subtitle={m.home.gamesSubtitle}
			/>

			<div className="grid gap-4 md:grid-cols-2">
				{games.map((game) => (
					<GameCard game={game} key={game.slug} lang={lang} variant="landing" />
				))}
				<ComingSoonCard className="min-h-[120px] md:col-span-2" lang={lang} />
			</div>
		</section>
	);
};
