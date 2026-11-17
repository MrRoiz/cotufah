import { Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import type { Locale } from "@/config/app";
import { DeckList } from "@/decks/components/deck-list";
import { useCustomDecks } from "@/decks/hooks/use-custom-decks";
import { getMessages } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { BottomNav } from "@/layout/bottom-nav";
import { Button } from "@/ui/button";
import { Empty, EmptyDescription } from "@/ui/empty";
import { TabPageHeader } from "@/ui/tab-page-header";

export const DecksScreen = ({ lang }: { lang: Locale }) => {
	const messages = getMessages(lang);
	const navigate = useNavigate();
	const { decks, remove } = useCustomDecks();

	return (
		<AppShell footer={<BottomNav lang={lang} />}>
			<TabPageHeader
				subtitle={messages.decks.subtitle}
				title={messages.decks.title}
			/>

			<div className="flex flex-col gap-4">
				<Button
					asChild
					className="w-full rounded-xl"
					size="lg"
					variant="sticker"
				>
					<Link params={{ lang }} to="/$lang/decks/new">
						<PlusIcon aria-hidden="true" />
						{messages.decks.createTitle}
					</Link>
				</Button>

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
					<Empty>
						<EmptyDescription className="text-base">
							{messages.decks.empty}
						</EmptyDescription>
					</Empty>
				)}
			</div>
		</AppShell>
	);
};
