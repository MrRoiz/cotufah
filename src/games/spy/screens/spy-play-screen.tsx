import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import { saveLastRound } from "@/games/last-round";
import { SpyRoundBar } from "@/games/spy/components/spy-round-bar";
import { useSpyRound } from "@/games/spy/hooks/use-spy-round";
import { DealPanel } from "@/games/spy/panels/deal-panel";
import { DiscussPanel } from "@/games/spy/panels/discuss-panel";
import { HandoffPanel } from "@/games/spy/panels/handoff-panel";
import { RevealPanel } from "@/games/spy/panels/reveal-panel";
import { VotePanel } from "@/games/spy/panels/vote-panel";
import { parsePlayers } from "@/games/spy/rules";
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

	// Remembered for "play again" on the games list and for the setup form.
	useEffect(() => {
		saveLastRound({ game: "spy", category, players, spies: spyCount });
	}, [category, players, spyCount]);

	const changePlayers = () =>
		navigate({
			to: "/$lang/games/spy/setup",
			params: { lang },
			search: { category },
		});

	// The handoff names the next player; the card shows the one holding it.
	const position =
		round.phase === "handoff" ? round.index + 2 : round.index + 1;

	return (
		// The role card is read in dark rooms: a bright screen would light up
		// the face of whoever is holding it.
		<AppShell className={round.phase === "deal" ? "dark" : undefined}>
			<SpyRoundBar
				category={category}
				lang={lang}
				onBackToDiscussion={() => round.setPhase("discuss")}
				phase={round.phase}
				position={position}
				total={players.length}
			/>

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
					position={position}
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
					starter={round.starter}
				/>
			) : null}

			{round.phase === "vote" ? (
				<VotePanel
					accused={round.accused}
					accusedName={round.accusedName}
					m={m}
					onAccuse={round.setAccused}
					onReveal={() => round.setPhase("reveal")}
					players={players}
				/>
			) : null}

			{round.phase === "reveal" ? (
				<RevealPanel
					accusedName={round.accusedName}
					caught={round.caught}
					isFetching={round.isFetching}
					lang={lang}
					m={m}
					onAgain={round.again}
					onChangePlayers={changePlayers}
					spies={round.spies}
					word={round.word ?? ""}
				/>
			) : null}
		</AppShell>
	);
};
