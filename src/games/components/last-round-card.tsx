import { Link } from "@tanstack/react-router";
import { PlayIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { useCategorySummary } from "@/decks/hooks/use-category-summary";
import { durationLabel } from "@/games/charades/duration-label";
import { PlayerAvatar } from "@/games/components/player-avatar";
import type { LastRound } from "@/games/last-round";
import { serializePlayers } from "@/games/spy/rules";
import { getMessages, plural } from "@/i18n";

const SHOWN_PLAYERS = 3;

const cardClass =
	"sticker-press flex items-center gap-3 rounded-xl border-2 border-foreground bg-card py-3.5 pr-3.5 pl-4 shadow-sticker";

/** Starts the last round again, same setup, straight into play. */
export const LastRoundCard = ({
	lang,
	round,
}: {
	lang: Locale;
	round: LastRound;
}) => {
	const messages = getMessages(lang);
	const deck = useCategorySummary(lang, round.category);

	const body = (detail: string) => (
		<span className="flex min-w-0 flex-1 flex-col gap-1">
			<span className="font-extrabold text-muted-foreground text-xs uppercase tracking-widest">
				{messages.games.playAgain}
			</span>
			<span className="truncate font-extrabold">
				{[messages.games[round.game].name, detail, deck.name].join(" · ")}
			</span>
			{round.game === "spy" ? <CrewPreview players={round.players} /> : null}
		</span>
	);

	const playBadge = (
		<span className="flex size-13 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-accent-lime text-accent-ink">
			<PlayIcon aria-hidden="true" className="size-6 fill-current" />
		</span>
	);

	if (round.game === "spy") {
		return (
			<Link
				className={cardClass}
				params={{ lang }}
				search={{
					category: round.category,
					players: serializePlayers(round.players),
					spies: round.spies,
				}}
				to="/$lang/games/spy/play"
			>
				{body(plural(lang, round.players.length, messages.spy.playerCount))}
				{playBadge}
			</Link>
		);
	}

	return (
		<Link
			className={cardClass}
			params={{ lang }}
			search={{ category: round.category, duration: round.duration }}
			to="/$lang/games/charades/play"
		>
			{body(durationLabel(messages, round.duration))}
			{playBadge}
		</Link>
	);
};

/** The first few faces and names, "+2" for the rest. */
const CrewPreview = ({ players }: { players: string[] }) => {
	const shown = players.slice(0, SHOWN_PLAYERS);
	const hidden = players.length - shown.length;
	const names =
		hidden > 0 ? `${shown.join(", ")} +${hidden}` : shown.join(", ");

	return (
		<span className="flex min-w-0 items-center gap-2">
			<span className="flex shrink-0 -space-x-1.5">
				{shown.map((name, seat) => (
					<PlayerAvatar
						className="size-6 text-xs"
						key={name}
						name={name}
						seat={seat}
					/>
				))}
			</span>
			<span className="truncate font-bold text-muted-foreground text-sm">
				{names}
			</span>
		</span>
	);
};
