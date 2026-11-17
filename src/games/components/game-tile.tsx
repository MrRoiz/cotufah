import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import type { GameEntry } from "@/games/games";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";

/** One game in the app list: the whole tile is the link to its setup. */
export const GameTile = ({ game, lang }: { game: GameEntry; lang: Locale }) => {
	const m = getMessages(lang);
	const copy = m.games[game.slug];
	const Icon = game.icon;

	return (
		<Link
			className={cn(
				"sticker-press flex min-h-28 items-center gap-4 rounded-xl border-2 border-foreground bg-linear-to-br p-4 shadow-sticker",
				game.gradient,
			)}
			params={{ lang }}
			to={game.setupTo}
		>
			<Icon aria-hidden="true" className="size-10 shrink-0" />
			<span className="flex min-w-0 flex-1 flex-col items-start gap-1">
				<span className="font-display font-extrabold text-3xl uppercase leading-none">
					{copy.name}
				</span>
				<span className="font-semibold text-sm leading-snug">
					{copy.tagline}
				</span>
				<span className="mt-1 rounded-full border-2 border-current px-2.5 py-0.5 font-extrabold text-xs">
					{copy.players}
				</span>
			</span>
			<ArrowRightIcon aria-hidden="true" className="size-6 shrink-0" />
		</Link>
	);
};
