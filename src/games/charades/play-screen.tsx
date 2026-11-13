import { useNavigate } from "@tanstack/react-router";
import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import type { Duration } from "@/games/charades/rules";
import { CharadesCountdown } from "@/games/charades/screens/countdown-screen";
import { CharadesIntro } from "@/games/charades/screens/intro-screen";
import { CharadesPlayStage } from "@/games/charades/screens/play-stage";
import { CharadesResults } from "@/games/charades/screens/results-screen";
import { useCharadesRound } from "@/games/charades/use-round";
import { getMessages } from "@/i18n";
import { AppShell } from "@/layout/app-shell";

export const CharadesPlayScreen = ({
	lang,
	category,
	duration,
}: {
	lang: Locale;
	category: CategoryChoice;
	duration: Duration;
}) => {
	const m = getMessages(lang);
	const navigate = useNavigate();
	const round = useCharadesRound({ lang, duration, category });

	if (round.phase === "countdown") {
		return <CharadesCountdown countdown={round.countdown} go={m.charades.go} />;
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
				word={round.word}
				zonesVisible={round.zonesVisible}
			/>
		);
	}

	return (
		<AppShell>
			{round.phase === "intro" ? (
				<CharadesIntro
					canStart={!round.isPending && round.hasWords}
					isPending={round.isPending}
					m={m}
					onStart={round.startRound}
					probe={round.probe}
					probing={round.probing}
				/>
			) : null}

			{round.phase === "results" ? (
				<CharadesResults
					correctCount={round.correctCount}
					correctWords={round.correctWords}
					finished={round.finished}
					isFetching={round.isFetching}
					m={m}
					onAgain={round.restart}
					onChangeSettings={() =>
						navigate({ to: "/$lang/games/charades/setup", params: { lang } })
					}
					passedWords={round.passedWords}
					pendingWord={round.pendingWord}
				/>
			) : null}
		</AppShell>
	);
};
