import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import { CategoryField } from "@/decks/components/category-field";
import { useCategorySummary } from "@/decks/hooks/use-category-summary";
import { useLastRound } from "@/games/hooks/use-last-round";
import { PlayersField } from "@/games/spy/components/players-field";
import { SpyCountField } from "@/games/spy/components/spy-count-field";
import {
	clampSpyCount,
	MIN_PLAYERS,
	serializePlayers,
} from "@/games/spy/rules";
import { getMessages, plural } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { AppPageHeader } from "@/ui/app-page-header";
import { SummaryButton } from "@/ui/summary-button";

export const SpySetup = ({
	lang,
	category,
}: {
	lang: Locale;
	category: CategoryChoice;
}) => {
	const m = getMessages(lang);
	const navigate = useNavigate();
	const lastRound = useLastRound();
	const deck = useCategorySummary(lang, category);
	const [players, setPlayers] = useState<string[]>([]);
	const [spies, setSpies] = useState(1);

	// Back from a round ("change players") the crew is still there to edit.
	useEffect(() => {
		if (lastRound?.game !== "spy") {
			return;
		}
		setPlayers(lastRound.players);
		setSpies(lastRound.spies);
	}, [lastRound]);

	const spyCount = clampSpyCount(spies, players.length);
	const missing = MIN_PLAYERS - players.length;
	const canStart = missing <= 0;
	const summary = canStart
		? [
				plural(lang, players.length, m.spy.playerCount),
				plural(lang, spyCount, m.spy.spyCount),
				deck.name,
			].join(" · ")
		: plural(lang, missing, m.spy.missingPlayers);

	const start = () =>
		navigate({
			to: "/$lang/games/spy/play",
			params: { lang },
			search: {
				category,
				players: serializePlayers(players),
				spies: spyCount,
			},
		});

	return (
		<AppShell
			footer={
				<SummaryButton
					disabled={!canStart}
					label={m.spy.start}
					onClick={start}
					summary={summary}
				/>
			}
		>
			<AppPageHeader
				lang={lang}
				subtitle={m.spy.setupIntro}
				title={m.games.spy.name}
			/>

			<div className="flex flex-col gap-6">
				<PlayersField lang={lang} onChange={setPlayers} players={players} />
				<SpyCountField
					lang={lang}
					onChange={setSpies}
					playerCount={players.length}
					spies={spies}
				/>
				<CategoryField
					category={category}
					locale={lang}
					onChange={(value) =>
						navigate({
							to: "/$lang/games/spy/setup",
							params: { lang },
							search: { category: value },
							replace: true,
						})
					}
				/>
			</div>
		</AppShell>
	);
};
