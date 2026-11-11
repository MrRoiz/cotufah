import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AppPageHeader } from "@/components/app-page-header";
import { DeckForm } from "@/components/custom-decks/deck-form";
import { AppShell } from "@/components/layout/app-shell";
import { pageMeta } from "@/config/seo";
import { useCustomDecks } from "@/hooks/use-custom-decks";
import { getMessages } from "@/i18n";

const EditDeckPage = () => {
	const { lang, deckId } = Route.useParams();
	const m = getMessages(lang);
	const navigate = useNavigate();
	const { decks, save } = useCustomDecks();
	const deck = decks.find((candidate) => candidate.id === deckId);

	return (
		<AppShell>
			<AppPageHeader
				lang={lang}
				title={deck ? m.decks.editTitle : m.decks.title}
			/>

			{deck ? (
				<DeckForm
					deck={deck}
					// Remounts if the id in the URL changes under the same route.
					key={deck.id}
					locale={lang}
					onSave={(next) => {
						const failure = save(next);
						if (!failure) {
							navigate({ to: "/$lang/decks", params: { lang } });
						}
						return failure;
					}}
				/>
			) : (
				<p className="text-muted-foreground">{m.decks.notFound}</p>
			)}
		</AppShell>
	);
};

export const Route = createFileRoute("/$lang/_app/decks/$deckId")({
	ssr: false,
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.decks.editTitle,
			noindex: true,
		});
	},
	component: EditDeckPage,
});
