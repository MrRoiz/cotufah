import { Link, useRouterState } from "@tanstack/react-router";

import { getMessages, localeFromPath } from "@/i18n";
import { Button } from "@/ui/button";

/**
 * The one screen a bad URL lands on. It reads the locale from the URL, like the
 * error screen, so it never depends on route context being there.
 */
export const NotFoundPage = () => {
	const lang = useRouterState({
		select: (state) => localeFromPath(state.location.pathname),
	});
	const m = getMessages(lang);

	return (
		<main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-8 px-5 py-10 text-center">
			<div aria-hidden="true" className="flex items-center gap-2">
				<span className="grid size-16 -rotate-6 place-items-center rounded-xl border-2 border-foreground bg-accent-cyan font-display text-4xl text-accent-ink shadow-sticker">
					4
				</span>
				<span className="grid size-24 rotate-2 place-items-center rounded-xl border-2 border-foreground bg-accent-lime font-display text-6xl text-accent-ink shadow-sticker">
					0
				</span>
				<span className="grid size-16 rotate-6 place-items-center rounded-xl border-2 border-foreground bg-accent-fuchsia font-display text-4xl text-accent-ink shadow-sticker">
					4
				</span>
			</div>

			<div className="flex flex-col items-center gap-3">
				<h1 className="font-display text-4xl uppercase leading-[0.9]">
					{m.notFound.title}
				</h1>
				<p className="max-w-sm text-muted-foreground">{m.notFound.body}</p>
			</div>

			<Button asChild size="lg" variant="sticker">
				<Link params={{ lang }} to="/$lang">
					{m.notFound.home}
				</Link>
			</Button>
		</main>
	);
};
