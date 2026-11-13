import { createFileRoute } from "@tanstack/react-router";

import { landingMeta } from "@/config/seo";
import { LandingPage } from "@/landing/screens/landing-page";

const LandingRoute = () => {
	const { lang } = Route.useParams();

	return <LandingPage lang={lang} />;
};

export const Route = createFileRoute("/$lang/")({
	head: ({ params }) => landingMeta(params.lang),
	component: LandingRoute,
});
