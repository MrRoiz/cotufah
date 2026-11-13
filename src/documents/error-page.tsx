import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link, useRouterState } from "@tanstack/react-router";
import { HouseIcon, RotateCcwIcon, TriangleAlertIcon } from "lucide-react";

import { getMessages, localeFromPath } from "@/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";

/**
 * Covers the layout that caught the error: the boundary sits inside the route,
 * so an error must paint over the app instead of appearing under a header.
 *
 * TEST SWITCH: flip to `false` to render the error page in flow again and
 * compare the two behaviours. Nothing else needs to change.
 */
const COVER_LAYOUT = true;

const pageClass = cn(
	"mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-8 bg-background px-5 py-10 text-center",
	{ "fixed inset-0 z-50 overflow-y-auto": COVER_LAYOUT },
);

/**
 * The boundary a broken screen lands on. It reads the locale from the URL
 * instead of route context: it has to render even when a route failed before
 * producing any context. The message stays visible on purpose — a screenshot
 * with the real error is what makes a report actionable.
 */
export const ErrorPage = ({ error, reset }: ErrorComponentProps) => {
	const locale = useRouterState({
		select: (state) => localeFromPath(state.location.pathname),
	});
	const m = getMessages(locale);
	const message = error instanceof Error ? error.message : String(error);

	return (
		<main className={pageClass}>
			<span
				aria-hidden="true"
				className="grid size-24 -rotate-6 place-items-center rounded-xl border-2 border-foreground bg-accent-fuchsia text-accent-ink shadow-sticker"
			>
				<TriangleAlertIcon className="size-12" />
			</span>

			<div className="flex flex-col items-center gap-3">
				<h1 className="font-display text-4xl uppercase leading-[0.9]">
					{m.error.title}
				</h1>
				<p className="max-w-sm text-muted-foreground">{m.error.body}</p>
				{message ? (
					<p className="max-w-sm break-words font-mono text-muted-foreground text-xs">
						{message}
					</p>
				) : null}
			</div>

			<div className="flex w-full max-w-xs flex-col gap-2">
				<Button onClick={reset} size="lg" variant="sticker">
					<RotateCcwIcon aria-hidden="true" />
					{m.error.retry}
				</Button>
				<Button asChild size="lg" variant="outline">
					<Link params={{ lang: locale }} to="/$lang">
						<HouseIcon aria-hidden="true" />
						{m.error.home}
					</Link>
				</Button>
			</div>
		</main>
	);
};
