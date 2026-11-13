import { createFileRoute } from "@tanstack/react-router";

/** Throws while rendering, so React's boundary placement is what decides. */
const RenderBoom = () => {
	throw new Error("Fallo al renderizar dentro de un layout");
};

export const Route = createFileRoute("/$lang/layout-test/render")({
	component: RenderBoom,
});
