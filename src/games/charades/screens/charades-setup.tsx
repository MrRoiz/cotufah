import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import { CategoryField } from "@/decks/components/category-field";
import { useCategorySummary } from "@/decks/hooks/use-category-summary";
import { DurationField } from "@/games/charades/components/duration-field";
import { GestureCards } from "@/games/charades/components/gesture-cards";
import { durationLabel } from "@/games/charades/duration-label";
import { DEFAULT_DURATION, type Duration } from "@/games/charades/rules";
import { useLastRound } from "@/games/hooks/use-last-round";
import { getMessages } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { AppPageHeader } from "@/ui/app-page-header";
import { BackLink } from "@/ui/back-link";
import { SummaryButton } from "@/ui/summary-button";

export const CharadesSetup = ({
	lang,
	category,
}: {
	lang: Locale;
	category: CategoryChoice;
}) => {
	const messages = getMessages(lang);
	const navigate = useNavigate();
	const deck = useCategorySummary(lang, category);
	const lastRound = useLastRound();
	const [duration, setDuration] = useState<Duration>(DEFAULT_DURATION);

	// Back from a round ("change time or deck") the last length is kept.
	useEffect(() => {
		if (lastRound?.game !== "charades") {
			return;
		}
		setDuration(lastRound.duration);
	}, [lastRound]);

	const start = () =>
		navigate({
			to: "/$lang/games/charades/play",
			params: { lang },
			search: { category, duration },
		});

	return (
		<AppShell
			footer={
				<SummaryButton
					label={messages.charades.start}
					onClick={start}
					summary={`${durationLabel(messages, duration)} · ${deck.name}`}
				/>
			}
		>
			<AppPageHeader
				back={
					<BackLink
						label={messages.common.back}
						params={{ lang }}
						to="/$lang/games"
					/>
				}
				subtitle={messages.charades.setupIntro}
				title={messages.games.charades.name}
			/>

			<div className="flex flex-col gap-6">
				<DurationField
					duration={duration}
					messages={messages}
					onChange={setDuration}
				/>

				<CategoryField
					category={category}
					locale={lang}
					onChange={(value) =>
						navigate({
							to: "/$lang/games/charades/setup",
							params: { lang },
							search: { category: value },
							replace: true,
						})
					}
				/>

				<section className="flex flex-col gap-3">
					<h2 className="font-bold text-lg">{messages.charades.answerTitle}</h2>
					<GestureCards messages={messages} mode="tilt" />
				</section>
			</div>
		</AppShell>
	);
};
