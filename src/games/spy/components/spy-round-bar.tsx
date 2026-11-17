import { Link } from "@tanstack/react-router";
import { ChevronLeftIcon, XIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import { DealProgress } from "@/games/spy/components/deal-progress";
import type { SpyPhase } from "@/games/spy/rules";
import { getMessages, interpolate } from "@/i18n";

const roundButtonClass =
	"flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card";

/**
 * The strip above every spy phase: a way out on the left, where the round is
 * in the middle. Voting gets "back to the discussion" instead of "leave".
 */
export const SpyRoundBar = ({
	lang,
	category,
	phase,
	position,
	total,
	onBackToDiscussion,
}: {
	lang: Locale;
	category: CategoryChoice;
	phase: SpyPhase;
	/** 1-based seat of the player holding (or about to hold) the phone. */
	position: number;
	total: number;
	onBackToDiscussion: () => void;
}) => {
	const messages = getMessages(lang);
	const isDealing = phase === "handoff" || phase === "deal";
	const phaseLabel: Partial<Record<SpyPhase, string>> = {
		discuss: messages.spy.discussLabel,
		vote: messages.spy.voteLabel,
	};

	return (
		<div className="flex items-center justify-between gap-3 pt-2 pb-4">
			{phase === "vote" ? (
				<button
					aria-label={messages.spy.backToDiscussion}
					className={roundButtonClass}
					onClick={onBackToDiscussion}
					type="button"
				>
					<ChevronLeftIcon aria-hidden="true" className="size-6" />
				</button>
			) : (
				<Link
					aria-label={messages.spy.exitRound}
					className={roundButtonClass}
					params={{ lang }}
					search={{ category }}
					to="/$lang/games/spy/setup"
				>
					<XIcon aria-hidden="true" className="size-5" />
				</Link>
			)}

			{isDealing ? (
				<DealProgress
					label={interpolate(messages.spy.progress, { n: position, total })}
					position={position}
					total={total}
				/>
			) : (
				<span className="font-extrabold text-muted-foreground text-xs uppercase tracking-widest">
					{phaseLabel[phase]}
				</span>
			)}

			{/* Balances the left button so the middle stays centred. */}
			<span aria-hidden="true" className="size-12 shrink-0" />
		</div>
	);
};
