import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { AppPageHeader } from "@/components/app-page-header";
import { DeckList } from "@/components/custom-decks/deck-list";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/config/seo";
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
			<AppPageHeader
				lang={lang}
				subtitle={m.decks.subtitle}
				title={m.decks.title}
			/>

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
		return pageMeta({
			lang: params.lang,
			title: m.decks.title,
			description: m.decks.subtitle,
			noindex: true,
		});
	},
	component: DecksPage,
});
