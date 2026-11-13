import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

/**
 * Test fixture: a visible layout between the root and a failing route, so the
 * error boundary's placement can be checked by hand. Children live under
 * `/layout-test`; the whole subtree is a 404 in production.
 */
const LayoutTest = () => {
	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<header
				className="border-b-2 border-foreground bg-accent-cyan px-4 py-3 text-center font-bold text-accent-ink"
				data-test-layout="header"
			>
				LAYOUT DE PRUEBA
			</header>
			<div className="flex flex-1 flex-col">
				<Outlet />
			</div>
			<footer
				className="border-t-2 border-foreground bg-accent-lime px-4 py-3 text-center font-bold text-accent-ink"
				data-test-layout="footer"
			>
				PIE DEL LAYOUT
			</footer>
		</div>
	);
};

export const Route = createFileRoute("/$lang/layout-test")({
	beforeLoad: () => {
		if (!import.meta.env.DEV) {
			throw notFound();
		}
	},
	component: LayoutTest,
});
