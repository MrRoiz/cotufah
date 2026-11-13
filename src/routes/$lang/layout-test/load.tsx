import { createFileRoute } from "@tanstack/react-router";

/** Throws while loading, so the boundary above the failing match handles it. */
export const Route = createFileRoute("/$lang/layout-test/load")({
	beforeLoad: () => {
		throw new Error("Fallo al cargar dentro de un layout");
	},
});
