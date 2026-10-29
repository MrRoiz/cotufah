import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { app } from "@/config/app";
import { gameCopy, games } from "@/games/registry";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";

const GamesPage = () => {
	const { lang } = Route.useParams();
	const m = getMessages(lang);

	return (
		<AppShell>
			<header className="flex flex-col gap-3 pt-6 pb-6">
				<div className="flex items-start justify-between gap-4">
					<Link
						className="inline-flex w-fit items-center gap-1 font-bold text-muted-foreground text-sm"
						params={{ lang }}
						to="/$lang"
					>
						<ArrowLeftIcon aria-hidden="true" className="size-4" />
						{m.common.home}
					</Link>
					<ModeToggle className="rounded-full border-2" locale={lang} />
				</div>
				<h1 className="font-display text-4xl uppercase">{m.games.title}</h1>
				<p className="text-muted-foreground">{m.games.subtitle}</p>
			</header>

			<div className="flex flex-col gap-5">
				{games.map((game) => {
					const copy = gameCopy(m, game.slug);

					return (
						<article
							className="overflow-hidden rounded-xl border-2 border-foreground bg-card"
							key={game.slug}
						>
							<div
								className={cn(
									"flex flex-col gap-1 bg-linear-to-br p-4",
									game.gradient,
								)}
							>
								<h2 className="font-display text-2xl uppercase">{copy.name}</h2>
								<p className="font-bold text-sm opacity-90">{copy.tagline}</p>
							</div>
							<div className="flex flex-col gap-4 p-4">
								<p className="text-sm">{copy.body}</p>

								<div className="flex flex-wrap items-center gap-2">
									<Badge className="border-2" variant="outline">
										{copy.players}
									</Badge>
								</div>

								<Button asChild className="w-full" size="lg" variant="sticker">
									<Link params={{ lang }} to={game.setupTo}>
										{m.common.play}
									</Link>
								</Button>
							</div>
						</article>
					);
				})}

				<div className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-border border-dashed p-5 text-muted-foreground">
					<span className="flex size-10 items-center justify-center rounded-full border-2 border-border">
						<PlusIcon aria-hidden="true" className="size-5" />
					</span>
					<span className="font-bold text-xs uppercase tracking-widest">
						{m.common.soon}
					</span>
				</div>
			</div>
		</AppShell>
	);
};
export const Route = createFileRoute("/$lang/_app/games/")({
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return {
			meta: [
				{ name: "robots", content: "noindex" },
				{ title: `${m.games.title} — ${app.name}` },
				{ name: "description", content: m.games.subtitle },
			],
		};
	},
	component: GamesPage,
});

/**
 * Static screen: no network. Decks are only fetched once a round starts.
 */
