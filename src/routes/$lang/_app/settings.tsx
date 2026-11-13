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
		const m = getMessages(params.lang);
		return pageMeta({
			lang: params.lang,
			title: m.settings.title,
			description: m.settings.subtitle,
			noindex: true,
		});
	},
	component: SettingsRoute,
});
