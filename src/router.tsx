import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { ErrorPage } from "@/documents/error-page";
import { NotFoundPage } from "@/documents/not-found-page";
import { routeTree } from "@/routeTree.gen";

export const getRouter = () => {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		// Every match falls back to this, so a child that fails in beforeLoad or
		// in render shows the branded page instead of the framework fallback.
		defaultErrorComponent: ErrorPage,
		// Same rule for a missing route: one registration for the whole tree.
		defaultNotFoundComponent: NotFoundPage,
	});

	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
