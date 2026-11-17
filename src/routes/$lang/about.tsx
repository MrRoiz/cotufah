import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { AboutPage } from "@/documents/screens/about-page";
import { getMessages } from "@/i18n";

const AboutRoute = () => {
	const { lang } = Route.useParams();

	return <AboutPage lang={lang} />;
};

export const Route = createFileRoute("/$lang/about")({
	head: ({ params }) => {
		const messages = getMessages(params.lang);

		return pageMeta({
			lang: params.lang,
			path: "/about",
			title: messages.about.title,
			description: messages.about.intro,
		});
	},
	component: AboutRoute,
});
