import { useState } from "react";
import type { Locale } from "@/config/app";
import { DeckCard } from "@/decks/components/deck-card";
import { ShareDeckSheet } from "@/decks/components/share-deck-sheet";
import type { CustomDeck, DeckWriteFailure } from "@/decks/custom-decks";
import { getMessages } from "@/i18n";

/** The player's decks, plus the one share sheet and the delete error they share. */
export const DeckList = ({
	decks,
	locale,
	onEdit,
	onRemove,
}: {
	decks: CustomDeck[];
	locale: Locale;
	onEdit: (deck: CustomDeck) => void;
	onRemove: (id: string) => DeckWriteFailure | null;
}) => {
	const m = getMessages(locale);
	const [sharingId, setSharingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const sharing = decks.find((deck) => deck.id === sharingId);

	return (
		<div className="flex flex-col gap-3">
			<ul className="flex flex-col gap-3">
				{decks.map((deck) => (
					<DeckCard
						deck={deck}
						key={deck.id}
						locale={locale}
						onEdit={() => onEdit(deck)}
						onRemove={() =>
							setError(onRemove(deck.id) ? m.decks.removeError : null)
						}
						onShare={() => setSharingId(deck.id)}
					/>
				))}
			</ul>

			{error ? (
				<p className="font-bold text-destructive text-sm" role="alert">
					{error}
				</p>
			) : null}

			{sharing ? (
				<ShareDeckSheet
					deck={sharing}
					locale={locale}
					onOpenChange={(open) => setSharingId(open ? sharing.id : null)}
					open
				/>
			) : null}
		</div>
	);
};
