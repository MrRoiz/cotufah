import { createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/config/seo";
import { getMessages } from "@/i18n";
import { SettingsScreen } from "@/settings/screens/settings-screen";

const SettingsRoute = () => {
	const { lang } = Route.useParams();

	return <SettingsScreen lang={lang} />;
};

export const Route = createFileRoute("/$lang/_app/settings")({
	head: ({ params }) => {
		const messages = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: messages.settings.title,
			description: messages.settings.subtitle,
			noindex: true,
		});
	},
	component: SettingsRoute,
});
