import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AppPageHeader } from "@/components/app-page-header";
import { DeckForm } from "@/components/custom-decks/deck-form";
import { AppShell } from "@/components/layout/app-shell";
import { pageMeta } from "@/config/seo";
import { useCustomDecks } from "@/hooks/use-custom-decks";
import { getMessages } from "@/i18n";

const NewDeckPage = () => {
	const { lang } = Route.useParams();
	const m = getMessages(lang);
	const navigate = useNavigate();
	const { save } = useCustomDecks();

	return (
		<AppShell>
			<AppPageHeader lang={lang} title={m.decks.createTitle} />

			<DeckForm
				locale={lang}
				onSave={(deck) => {
					const failure = save(deck);
					if (!failure) {
						navigate({ to: "/$lang/decks", params: { lang } });
					}
					return failure;
				}}
			/>
		</AppShell>
	);
};

export const Route = createFileRoute("/$lang/_app/decks/new")({
	ssr: false,
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.decks.createTitle,
			noindex: true,
		});
	},
	component: NewDeckPage,
});
