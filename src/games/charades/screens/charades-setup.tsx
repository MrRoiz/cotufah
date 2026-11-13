import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import { CategoryField } from "@/decks/components/category-field";
import {
	DEFAULT_DURATION,
	DURATIONS,
	type Duration,
} from "@/games/charades/rules";
import { getMessages } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { AppPageHeader } from "@/ui/app-page-header";
import { Button } from "@/ui/button";
import { ChoiceButton } from "@/ui/choice-button";

export const CharadesSetup = ({
	lang,
	category,
}: {
	lang: Locale;
	category: CategoryChoice;
}) => {
	const m = getMessages(lang);
	const navigate = useNavigate();
	const [duration, setDuration] = useState<Duration>(DEFAULT_DURATION);

	const labels: Record<Duration, string> = {
		60: m.charades.duration60,
		90: m.charades.duration90,
		120: m.charades.duration120,
	};

	return (
		<AppShell
			footer={
				<Button
					className="w-full"
					onClick={() =>
						navigate({
							to: "/$lang/games/charades/play",
							params: { lang },
							search: { category, duration },
						})
					}
					size="lg"
					variant="sticker"
				>
					{m.charades.start}
				</Button>
			}
		>
			<AppPageHeader
				lang={lang}
				subtitle={m.charades.setupIntro}
				title={m.games.charades.name}
			/>

			<section className="flex flex-col gap-3">
				<h2 className="font-bold text-lg">{m.charades.durationTitle}</h2>
				<div className="flex flex-col gap-2">
					{DURATIONS.map((seconds) => (
						<ChoiceButton
							className="w-full justify-start"
							key={seconds}
							onClick={() => setDuration(seconds)}
							selected={duration === seconds}
							size="lg"
						>
							{labels[seconds]}
						</ChoiceButton>
					))}
				</div>
			</section>

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
		</AppShell>
	);
};
