import { Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import type { Locale } from "@/config/app";
import { DeckList } from "@/decks/components/deck-list";
import { useCustomDecks } from "@/decks/use-custom-decks";
import { getMessages } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { AppPageHeader } from "@/ui/app-page-header";
import { Button } from "@/ui/button";

export const DecksScreen = ({ lang }: { lang: Locale }) => {
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
