import { useNavigate } from "@tanstack/react-router";

import type { Locale } from "@/config/app";
import { DeckForm } from "@/decks/components/deck-form";
import { useCustomDecks } from "@/decks/hooks/use-custom-decks";
import { getMessages } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { AppPageHeader } from "@/ui/app-page-header";

/** One editor for both `/decks/new` and `/decks/$deckId`. */
export const DeckEditorScreen = ({
	lang,
	deckId,
}: {
	lang: Locale;
	deckId?: string;
}) => {
	const m = getMessages(lang);
	const navigate = useNavigate();
	const { decks, save } = useCustomDecks();
	const deck = deckId
		? decks.find((candidate) => candidate.id === deckId)
		: undefined;

	const title =
		deckId === undefined
			? m.decks.createTitle
			: deck
				? m.decks.editTitle
				: m.decks.title;

	return (
		<AppShell>
			<AppPageHeader lang={lang} title={title} />

			{deckId && !deck ? (
				<p className="text-muted-foreground">{m.decks.notFound}</p>
			) : (
				<DeckForm
					deck={deck}
					// Remounts if the id in the URL changes under the same route.
					key={deck?.id ?? "new"}
					locale={lang}
					onSave={(next) => {
						const failure = save(next);
						if (!failure) {
							navigate({ to: "/$lang/decks", params: { lang } });
						}
						return failure;
					}}
				/>
			)}
		</AppShell>
	);
};
