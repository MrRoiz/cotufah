import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { LegalPage } from "@/documents/legal-page";
import { getMessages } from "@/i18n";

const LegalRoute = () => {
	const { lang } = Route.useParams();

	return <LegalPage lang={lang} />;
};

export const Route = createFileRoute("/$lang/legal")({
	head: ({ params }) => {
		const m = getMessages(params.lang);

		return pageMeta({
			lang: params.lang,
			path: "/legal",
			title: m.legal.title,
			description: m.legal.intro,
		});
	},
	component: LegalRoute,
});
