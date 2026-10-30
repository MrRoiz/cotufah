import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { BackLink } from "@/components/back-link";
import { DeckForm } from "@/components/custom-decks/deck-form";
import { AppShell } from "@/components/layout/app-shell";
import { app } from "@/config/app";
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
			<header className="flex flex-col gap-3 pt-6 pb-6">
				<BackLink label={m.common.back} lang={lang} />
				<h1 className="font-display text-4xl uppercase">
					{deck ? m.decks.editTitle : m.decks.title}
				</h1>
			</header>

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
	head: ({ params }) => ({
		meta: [
			{ name: "robots", content: "noindex" },
			{ title: `${getMessages(params.lang).decks.editTitle} — ${app.name}` },
		],
	}),
	component: EditDeckPage,
});
