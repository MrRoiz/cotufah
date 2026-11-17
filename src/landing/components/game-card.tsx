import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import type { Locale } from "@/config/app";
import type { GameEntry } from "@/games/games";
import { getMessages, interpolate } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * One game on the landing page, drawn like the app's own tile (gradient,
 * icon, players) so the page shows what opening the app looks like.
 */
export const GameCard = ({ game, lang }: { game: GameEntry; lang: Locale }) => {
	const m = getMessages(lang);
	const copy = m.games[game.slug];
	const Icon = game.icon;

	return (
		<article
			className={cn(
				"flex flex-col gap-4 rounded-xl border-2 border-foreground bg-linear-to-br p-6 shadow-sticker",
				game.gradient,
			)}
		>
			<div className="flex items-center justify-between gap-3">
				<Icon aria-hidden="true" className="size-11" />
				<span className="rounded-full border-2 border-current px-3 py-0.5 font-extrabold text-sm">
					{copy.players}
				</span>
			</div>
			<h3 className="font-display font-extrabold text-5xl uppercase leading-[0.9] tracking-tight">
				{copy.name}
			</h3>
			<p className="font-bold text-lg">{copy.tagline}</p>
			<p className="leading-relaxed">{copy.body}</p>
			<Link
				className="mt-auto inline-flex min-h-12 w-fit items-center gap-2 rounded-full border-2 border-foreground bg-card px-5 font-extrabold text-card-foreground"
				params={{ lang }}
				to={game.setupTo}
			>
				{interpolate(m.home.gamePlay, { game: copy.name })}
				<ArrowRightIcon aria-hidden="true" className="size-5" />
			</Link>
		</article>
	);
};
