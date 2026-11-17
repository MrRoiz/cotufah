import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import type { Locale } from "@/config/app";
import type { GameEntry } from "@/games/games";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";

/**
 * One game on the landing page. The CTA is a quiet outline so the marketing
 * page keeps the hero as its only filled call to action; the app list has its
 * own tile (`GameTile`).
 */
export const GameCard = ({ game, lang }: { game: GameEntry; lang: Locale }) => {
	const m = getMessages(lang);
	const copy = m.games[game.slug];

	return (
		<article className="flex flex-col overflow-hidden rounded-xl border-2 border-foreground bg-card">
			<div
				className={cn("flex flex-col gap-1 bg-linear-to-br p-5", game.gradient)}
			>
				<h3 className="font-display text-2xl uppercase">{copy.name}</h3>
				<p className="font-bold text-sm opacity-90">{copy.tagline}</p>
			</div>
			<div className="flex flex-1 flex-col gap-4 p-5">
				<p className="text-sm">{copy.body}</p>
				<div className="mt-auto flex flex-wrap items-center justify-between gap-3">
					<Badge className="border-2" variant="outline">
						{copy.players}
					</Badge>
					<Button asChild className="px-4" variant="outline">
						<Link params={{ lang }} to={game.setupTo}>
							{m.common.play}
							<ArrowRightIcon aria-hidden="true" />
						</Link>
					</Button>
				</div>
			</div>
		</article>
	);
};
