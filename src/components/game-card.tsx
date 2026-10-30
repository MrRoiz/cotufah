import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/config/app";
import { type GameEntry, gameCopy } from "@/games/registry";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * One game, one card: the landing and the app list render the same block, so
 * a new game only has to land in the registry to appear on both. The variant
 * only changes the action — the header, copy and badge stay identical, or this
 * becomes two cards wearing one name.
 */
export const GameCard = ({
	game,
	lang,
	variant = "app",
	className,
}: {
	game: GameEntry;
	lang: Locale;
	/**
	 * `app`: h2 plus the full-width sticker button the phone list needs.
	 * `landing`: h3 plus a quiet outline CTA, so the marketing page keeps only
	 * the hero as a filled call to action.
	 */
	variant?: "app" | "landing";
	className?: string;
}) => {
	const m = getMessages(lang);
	const copy = gameCopy(m, game.slug);
	const Heading = variant === "app" ? "h2" : "h3";

	return (
		<article
			className={cn(
				"flex flex-col overflow-hidden rounded-xl border-2 border-foreground bg-card",
				className,
			)}
		>
			<div
				className={cn("flex flex-col gap-1 bg-linear-to-br p-5", game.gradient)}
			>
				<Heading className="font-display text-2xl uppercase">
					{copy.name}
				</Heading>
				<p className="font-bold text-sm opacity-90">{copy.tagline}</p>
			</div>
			<div className="flex flex-1 flex-col gap-4 p-5">
				<p className="text-sm">{copy.body}</p>
				<div
					className={cn(
						"mt-auto gap-4",
						variant === "app"
							? "flex flex-col"
							: "flex flex-wrap items-center justify-between gap-3",
					)}
				>
					<Badge
						className={cn("border-2", variant === "app" && "w-fit")}
						variant="outline"
					>
						{copy.players}
					</Badge>
					{variant === "app" ? (
						<Button asChild className="w-full" size="lg" variant="sticker">
							<Link params={{ lang }} to={game.setupTo}>
								{m.common.play}
								<ArrowRightIcon aria-hidden="true" />
							</Link>
						</Button>
					) : (
						<Button asChild className="px-4" variant="outline">
							<Link params={{ lang }} to={game.setupTo}>
								{m.common.play}
								<ArrowRightIcon aria-hidden="true" />
							</Link>
						</Button>
					)}
				</div>
			</div>
		</article>
	);
};
