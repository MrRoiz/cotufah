import { createFileRoute, Outlet } from "@tanstack/react-router";

import { PhoneGate } from "@/components/phone-gate";

/**
 * Pathless layout for everything that is the *app* (games, play, settings).
 * The landing page lives outside it, so a laptop can read about the game —
 * but it cannot play, because the gate covers every route below this point.
 */
const AppLayout = () => {
	const { lang } = Route.useParams();

	return (
		<>
			<PhoneGate locale={lang} />
			<Outlet />
		</>
	);
};
export const Route = createFileRoute("/$lang/_app")({
	component: AppLayout,
});
