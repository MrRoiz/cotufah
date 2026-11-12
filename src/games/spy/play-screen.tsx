import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import { DealPanel } from "@/games/spy/panels/deal-panel";
import { DiscussPanel } from "@/games/spy/panels/discuss-panel";
import { HandoffPanel } from "@/games/spy/panels/handoff-panel";
import { RevealPanel } from "@/games/spy/panels/reveal-panel";
import { VotePanel } from "@/games/spy/panels/vote-panel";
import { parsePlayers } from "@/games/spy/rules";
import { useSpyRound } from "@/games/spy/use-round";
import { getMessages } from "@/i18n";
import { AppShell } from "@/layout/app-shell";

export const SpyPlayScreen = ({
	lang,
	category,
	playersParam,
	spyCount,
}: {
	lang: Locale;
	category: CategoryChoice;
	playersParam: string;
	spyCount: number;
}) => {
	const m = getMessages(lang);
	const navigate = useNavigate();

	// Stable identity: the round memoizes the spy list from these names.
	const players = useMemo(() => parsePlayers(playersParam), [playersParam]);
	const round = useSpyRound({ lang, players, spyCount, category });

	const changePlayers = () =>
		navigate({ to: "/$lang/games/spy/setup", params: { lang } });

	return (
		<AppShell>
			{round.phase === "deal" ? (
				<DealPanel
					isSpy={round.isSpy}
					m={m}
					onHoldEnd={() => round.setRevealed(false)}
					onHoldStart={() => {
						round.setRevealed(true);
						round.setPeeked(true);
					}}
					onNext={round.nextPlayer}
					peeked={round.peeked}
					player={round.currentPlayer}
					position={round.index + 1}
					revealed={round.revealed}
					total={players.length}
					waiting={round.waiting}
					word={round.word ?? ""}
				/>
			) : null}

			{round.phase === "handoff" ? (
				<HandoffPanel
					m={m}
					name={round.nextPlayerName}
					remainingMs={round.handoffMs}
				/>
			) : null}

			{round.phase === "discuss" ? (
				<DiscussPanel
					m={m}
					onTogglePause={() => round.setPaused((value) => !value)}
					onVote={() => round.setPhase("vote")}
					paused={round.paused}
					remainingMs={round.remainingMs}
				/>
			) : null}

			{round.phase === "vote" ? (
				<VotePanel
					accused={round.accused}
					m={m}
					onAccuse={round.setAccused}
					onReveal={() => round.setPhase("reveal")}
					players={players}
				/>
			) : null}

			{round.phase === "reveal" ? (
				<RevealPanel
					caught={round.caught}
					isFetching={round.isFetching}
					lang={lang}
					m={m}
					onAgain={round.again}
					onChangePlayers={changePlayers}
					spyCount={round.assignment.length}
					spyList={round.spyList}
					word={round.word ?? ""}
				/>
			) : null}
		</AppShell>
	);
};
