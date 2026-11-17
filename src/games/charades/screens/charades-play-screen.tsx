import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import { useCharadesRound } from "@/games/charades/hooks/use-charades-round";
import type { Duration } from "@/games/charades/rules";
import { CharadesCountdown } from "@/games/charades/screens/charades-countdown";
import { CharadesIntro } from "@/games/charades/screens/charades-intro";
import { CharadesPlayStage } from "@/games/charades/screens/charades-play-stage";
import { CharadesResults } from "@/games/charades/screens/charades-results";
import { saveLastRound } from "@/games/last-round";
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

	// Remembered for "play again" on the games list.
	useEffect(() => {
		saveLastRound({ game: "charades", category, duration });
	}, [category, duration]);

	if (round.phase === "countdown") {
		return <CharadesCountdown countdown={round.countdown} go={m.charades.go} />;
	}

	if (round.phase === "playing") {
		return (
			<CharadesPlayStage
				flash={round.flash}
				lang={lang}
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
					canStart={round.hasWords}
					isPending={round.isPending}
					lang={lang}
					onStart={round.startRound}
					probe={round.probe}
					probing={round.probing}
				/>
			) : null}

			{round.phase === "results" ? (
				<CharadesResults
					correctWords={round.correctWords}
					finished={round.finished}
					isFetching={round.isFetching}
					lang={lang}
					onAgain={round.restart}
					onChangeSettings={() =>
						navigate({
							to: "/$lang/games/charades/setup",
							params: { lang },
							search: { category },
						})
					}
					passedWords={round.passedWords}
					pendingWord={round.pendingWord}
				/>
			) : null}
		</AppShell>
	);
};
