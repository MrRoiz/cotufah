import type { Locale } from "@/config/app";
import { games } from "@/games/games";
import { getMessages } from "@/i18n";
import { ComingSoonCard } from "@/landing/components/coming-soon-card";
import { GameCard } from "@/landing/components/game-card";
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
					<GameCard game={game} key={game.slug} lang={lang} />
				))}
				<ComingSoonCard className="min-h-[120px] md:col-span-2" lang={lang} />
			</div>
		</section>
	);
};
