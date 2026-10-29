import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

import { isLocale } from "@/i18n";

const LangLayout = () => {
	return <Outlet />;
};
export const Route = createFileRoute("/$lang")({
	params: {
		parse: (raw) => {
			if (!isLocale(raw.lang)) {
				throw notFound();
			}
			return { lang: raw.lang };
		},
		stringify: (params) => ({ lang: params.lang }),
	},
	component: LangLayout,
});
