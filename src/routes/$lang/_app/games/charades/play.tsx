import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";
import { app } from "@/config/app";
import { isCategoryChoice } from "@/data/schema";
import { CharadesIntro } from "@/games/charades/intro-screen";
import { CharadesPlayStage } from "@/games/charades/play-stage";
import { CharadesResults } from "@/games/charades/results-screen";
import { useCharadesRound } from "@/games/charades/use-charades-round";
import { getMessages } from "@/i18n";

const CharadesPlay = () => {
	const { lang } = Route.useParams();
	const { category, duration } = Route.useSearch();
	const m = getMessages(lang);
	const navigate = useNavigate();
	const round = useCharadesRound({ lang, duration, category });

	if (round.phase === "countdown") {
		return (
			<div className="stage-landscape items-center justify-center">
				<span
					className="animate-in zoom-in-50 font-display text-8xl tabular-nums duration-150"
					key={round.countdown}
				>
					{round.countdown > 0 ? round.countdown : "¡Ya!"}
				</span>
			</div>
		);
	}

	if (round.phase === "playing") {
		return (
			<CharadesPlayStage
				flash={round.flash}
				m={m}
				onAnswer={round.answer}
				remainingMs={round.remainingMs}
				score={round.correctCount}
				totalMs={round.totalMs}
				word={round.words[round.index] ?? ""}
				zonesVisible={round.zonesVisible}
			/>
		);
	}

	return (
		<AppShell>
			{round.phase === "intro" ? (
				<CharadesIntro
					canStart={!round.isPending && round.words.length > 0}
					isPending={round.isPending}
					m={m}
					onStart={round.startRound}
					probe={round.probe}
					probing={round.probing}
				/>
			) : null}

			{round.phase === "results" ? (
				<CharadesResults
					answers={round.answers}
					correctCount={round.correctCount}
					finished={round.finished}
					isFetching={round.isFetching}
					m={m}
					onAgain={round.restart}
					onChangeSettings={() =>
						navigate({ to: "/$lang/games/charades/setup", params: { lang } })
					}
				/>
			) : null}
		</AppShell>
	);
};
export const Route = createFileRoute("/$lang/_app/games/charades/play")({
	ssr: false,
	validateSearch: (search: Record<string, unknown>) => ({
		category: isCategoryChoice(search.category) ? search.category : "clasico",
		duration: Number(search.duration ?? 90),
	}),
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return {
			meta: [
				{ name: "robots", content: "noindex" },
				{ title: `${m.games.charades.name} — ${app.name}` },
			],
		};
	},
	component: CharadesPlay,
});
