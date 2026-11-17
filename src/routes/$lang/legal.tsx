import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { LegalPage } from "@/documents/screens/legal-page";
import { getMessages } from "@/i18n";

const LegalRoute = () => {
	const { lang } = Route.useParams();

	return <LegalPage lang={lang} />;
};

export const Route = createFileRoute("/$lang/legal")({
	head: ({ params }) => {
		const messages = getMessages(params.lang);

		return pageMeta({
			lang: params.lang,
			path: "/legal",
			title: messages.legal.title,
			description: messages.legal.intro,
		});
	},
	component: LegalRoute,
});
