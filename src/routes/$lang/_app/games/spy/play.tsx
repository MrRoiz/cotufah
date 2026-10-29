import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";
import { app } from "@/config/app";
import { isCategoryChoice } from "@/data/schema";
import { DealPanel } from "@/games/spy/deal-panel";
import { DiscussPanel } from "@/games/spy/discuss-panel";
import { HandoffPanel } from "@/games/spy/handoff-panel";
import { RevealPanel } from "@/games/spy/reveal-panel";
import {
	MIN_PLAYERS,
	parsePlayers,
	useSpyRound,
} from "@/games/spy/use-spy-round";
import { VotePanel } from "@/games/spy/vote-panel";
import { getMessages } from "@/i18n";

const SpyPlay = () => {
	const { lang } = Route.useParams();
	const {
		category,
		players: playersParam,
		spies: spyCount,
	} = Route.useSearch();
	const m = getMessages(lang);
	const navigate = useNavigate();

	const players = parsePlayers(playersParam);
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
					m={m}
					onAgain={round.again}
					onChangePlayers={changePlayers}
					spyCount={round.assignment.length}
					spyList={round.spyList}
					word={round.word ?? "—"}
				/>
			) : null}
		</AppShell>
	);
};
export const Route = createFileRoute("/$lang/_app/games/spy/play")({
	// Roles are dealt in the browser; rendering them on the server would hand
	// everyone the same notification and a hydration mismatch for the spy.
	ssr: false,
	validateSearch: (search: Record<string, unknown>) => ({
		category: isCategoryChoice(search.category) ? search.category : "mixed",
		players: typeof search.players === "string" ? search.players : "",
		spies: Number(search.spies ?? 1),
	}),
	beforeLoad: ({ params, search }) => {
		if (parsePlayers(search.players).length < MIN_PLAYERS) {
			throw redirect({ to: "/$lang/games/spy/setup", params });
		}
	},
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return {
			meta: [
				{ name: "robots", content: "noindex" },
				{ title: `${m.games.spy.name} — ${app.name}` },
			],
		};
	},
	component: SpyPlay,
});
