import type { Locale } from "@/config/app";
import { DeckForm } from "@/decks/components/deck-form";
import type { CustomDeck, DeckWriteFailure } from "@/decks/custom-decks";
import { useDeckDraft } from "@/decks/hooks/use-deck-draft";
import { getMessages, plural } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { AppPageHeader } from "@/ui/app-page-header";
import { SummaryButton } from "@/ui/summary-button";

/**
 * Writing or editing one deck: the form, plus a footer button that says what
 * saving will do ("6 words · Animals") or what is still missing.
 */
export const DeckEditor = ({
	lang,
	title,
	deck,
	onSave,
}: {
	lang: Locale;
	title: string;
	deck?: CustomDeck;
	onSave: (deck: CustomDeck) => DeckWriteFailure | null;
}) => {
	const m = getMessages(lang);
	const draft = useDeckDraft({ locale: lang, deck, onSave });

	const summary = !draft.hasName
		? m.decks.nameError
		: draft.missingWords > 0
			? plural(lang, draft.missingWords, m.decks.missingWords)
			: `${plural(lang, draft.words.length, m.decks.wordCount)} · ${draft.name.trim()}`;

	return (
		<AppShell
			footer={
				<SummaryButton
					disabled={!draft.canSave}
					label={deck ? m.decks.saveChanges : m.decks.save}
					onClick={draft.save}
					summary={summary}
				/>
			}
		>
			<AppPageHeader
				lang={lang}
				subtitle={m.decks.editorSubtitle}
				title={title}
			/>
			<DeckForm draft={draft} locale={lang} />
		</AppShell>
	);
};
