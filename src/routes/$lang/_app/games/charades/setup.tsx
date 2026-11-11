import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppPageHeader } from "@/components/app-page-header";
import { CategoryField } from "@/components/category-field";
import { ChoiceButton } from "@/components/choice-button";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/config/seo";
import type { CategoryChoice } from "@/data/categories";
import { isCategoryChoice } from "@/data/categories";
import {
	DEFAULT_DURATION,
	DURATIONS,
	type Duration,
} from "@/games/charades/rules";
import { getMessages } from "@/i18n";

const CharadesSetup = () => {
	const { lang } = Route.useParams();
	const { category = "clasico" } = Route.useSearch();
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
export const Route = createFileRoute("/$lang/_app/games/charades/setup")({
	// In the URL so the deck survives a trip to "Manage decks" and back.
	validateSearch: (
		search: Record<string, unknown>,
	): { category?: CategoryChoice } => ({
		category: isCategoryChoice(search.category) ? search.category : undefined,
	}),
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.games.charades.name,
			description: m.charades.setupIntro,
			noindex: true,
		});
	},
	component: CharadesSetup,
});
