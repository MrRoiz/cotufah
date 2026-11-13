import { createFileRoute, notFound } from "@tanstack/react-router";

/**
 * Throws on purpose so the error screen can be checked by hand. Development
 * only: in a production build it is a 404, never a route that ships broken.
 */
export const Route = createFileRoute("/$lang/boom")({
	beforeLoad: () => {
		if (!import.meta.env.DEV) {
			throw notFound();
		}
		throw new Error("Prueba de error: algo se rompió");
	},
});
