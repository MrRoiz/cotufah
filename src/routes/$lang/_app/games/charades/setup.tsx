import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BackLink } from "@/components/back-link";
import { CategoryField } from "@/components/category-field";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { app } from "@/config/app";
import { type CategoryChoice, isCategoryChoice } from "@/data/schema";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";

const DURATIONS = [60, 90, 120] as const;

const CharadesSetup = () => {
	const { lang } = Route.useParams();
	const { category = "clasico" } = Route.useSearch();
	const m = getMessages(lang);
	const navigate = useNavigate();
	const [duration, setDuration] = useState<(typeof DURATIONS)[number]>(90);

	const labels: Record<(typeof DURATIONS)[number], string> = {
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
			<header className="flex flex-col gap-3 pt-6 pb-6">
				<BackLink label={m.common.back} lang={lang} />
				<h1 className="font-display text-4xl uppercase">
					{m.games.charades.name}
				</h1>
				<p className="text-muted-foreground">{m.charades.setupIntro}</p>
			</header>

			<section className="flex flex-col gap-3">
				<h2 className="font-bold text-lg">{m.charades.durationTitle}</h2>
				<div className="flex flex-col gap-2">
					{DURATIONS.map((seconds) => (
						<Button
							className={cn(
								"w-full justify-start border-2",
								duration === seconds && "border-foreground",
							)}
							key={seconds}
							onClick={() => setDuration(seconds)}
							size="lg"
							variant={duration === seconds ? "default" : "outline"}
						>
							{labels[seconds]}
						</Button>
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
		return {
			meta: [
				{ name: "robots", content: "noindex" },
				{ title: `${m.games.charades.name} — ${app.name}` },
				{ name: "description", content: m.charades.setupIntro },
			],
		};
	},
	component: CharadesSetup,
});
