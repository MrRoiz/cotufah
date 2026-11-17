import { useNavigate } from "@tanstack/react-router";

import type { Locale } from "@/config/app";
import { DeckEditor } from "@/decks/components/deck-editor";
import { useCustomDecks } from "@/decks/hooks/use-custom-decks";
import { getMessages } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { AppPageHeader } from "@/ui/app-page-header";
import { BackLink } from "@/ui/back-link";

/** One editor for both `/decks/new` and `/decks/$deckId`. */
export const DeckEditorScreen = ({
	lang,
	deckId,
}: {
	lang: Locale;
	deckId?: string;
}) => {
	const messages = getMessages(lang);
	const navigate = useNavigate();
	const { decks, save } = useCustomDecks();
	const deck = deckId
		? decks.find((candidate) => candidate.id === deckId)
		: undefined;

	if (deckId && !deck) {
		return (
			<AppShell>
				<AppPageHeader
					back={
						<BackLink
							label={messages.common.back}
							params={{ lang }}
							to="/$lang/decks"
						/>
					}
					title={messages.decks.title}
				/>
				<p className="text-muted-foreground">{messages.decks.notFound}</p>
			</AppShell>
		);
	}

	return (
		<DeckEditor
			deck={deck}
			// Remounts if the id in the URL changes under the same route.
			key={deck?.id ?? "new"}
			lang={lang}
			onSave={(next) => {
				const failure = save(next);
				if (!failure) {
					navigate({ to: "/$lang/decks", params: { lang } });
				}
				return failure;
			}}
			title={deck ? messages.decks.editTitle : messages.decks.createTitle}
		/>
	);
};
