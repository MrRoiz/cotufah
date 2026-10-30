import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { BackLink } from "@/components/back-link";
import { DeckList } from "@/components/custom-decks/deck-list";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { app } from "@/config/app";
import { useCustomDecks } from "@/hooks/use-custom-decks";
import { getMessages } from "@/i18n";

const DecksPage = () => {
	const { lang } = Route.useParams();
	const m = getMessages(lang);
	const navigate = useNavigate();
	const { decks, remove } = useCustomDecks();

	return (
		<AppShell
			footer={
				<Button asChild className="w-full" size="lg" variant="sticker">
					<Link params={{ lang }} to="/$lang/decks/new">
						<PlusIcon aria-hidden="true" />
						{m.decks.createTitle}
					</Link>
				</Button>
			}
		>
			<header className="flex flex-col gap-3 pt-6 pb-6">
				<BackLink label={m.common.back} lang={lang} />
				<h1 className="font-display text-4xl uppercase">{m.decks.title}</h1>
				<p className="text-muted-foreground">{m.decks.subtitle}</p>
			</header>

			{decks.length > 0 ? (
				<DeckList
					decks={decks}
					locale={lang}
					onEdit={(deck) =>
						navigate({
							to: "/$lang/decks/$deckId",
							params: { lang, deckId: deck.id },
						})
					}
					onRemove={remove}
				/>
			) : (
				<p className="text-muted-foreground text-sm">{m.decks.empty}</p>
			)}
		</AppShell>
	);
};

export const Route = createFileRoute("/$lang/_app/decks/")({
	// Decks only exist in localStorage: SSR would paint the empty state first.
	ssr: false,
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return {
			meta: [
				{ name: "robots", content: "noindex" },
				{ title: `${m.decks.title} — ${app.name}` },
				{ name: "description", content: m.decks.subtitle },
			],
		};
	},
	component: DecksPage,
});
