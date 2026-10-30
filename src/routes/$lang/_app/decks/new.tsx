import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { BackLink } from "@/components/back-link";
import { DeckForm } from "@/components/custom-decks/deck-form";
import { AppShell } from "@/components/layout/app-shell";
import { app } from "@/config/app";
import { useCustomDecks } from "@/hooks/use-custom-decks";
import { getMessages } from "@/i18n";

const NewDeckPage = () => {
	const { lang } = Route.useParams();
	const m = getMessages(lang);
	const navigate = useNavigate();
	const { save } = useCustomDecks();

	return (
		<AppShell>
			<header className="flex flex-col gap-3 pt-6 pb-6">
				<BackLink label={m.common.back} lang={lang} />
				<h1 className="font-display text-4xl uppercase">
					{m.decks.createTitle}
				</h1>
			</header>

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
	head: ({ params }) => ({
		meta: [
			{ name: "robots", content: "noindex" },
			{
				title: `${getMessages(params.lang).decks.createTitle} — ${app.name}`,
			},
		],
	}),
	component: NewDeckPage,
});
