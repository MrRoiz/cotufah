import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { app } from "@/config/app";
import { getMessages, interpolate } from "@/i18n";
import {
	type CustomDeck,
	type DeckWriteFailure,
	decodeDeck,
	MAX_DECKS,
	saveCustomDeck,
} from "@/lib/custom-decks";

/** A write can only fail after mount, so its reason is part of the state. */
type ImportState = "loading" | "ok" | "invalid" | DeckWriteFailure;

const ImportPage = () => {
	const { lang } = Route.useParams();
	const { d } = Route.useSearch();
	const m = getMessages(lang);
	const [state, setState] = useState<ImportState>("loading");
	const [deck, setDeck] = useState<CustomDeck | null>(null);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			const parsed = d ? await decodeDeck(d) : null;
			if (cancelled) {
				return;
			}
			if (!parsed) {
				setState("invalid");
				return;
			}
			setDeck(parsed);
			setState(saveCustomDeck(parsed) ?? "ok");
		};

		run();
		return () => {
			cancelled = true;
		};
	}, [d]);

	const ok = state === "ok";
	const titles: Record<ImportState, string> = {
		loading: "",
		ok: m.decks.importedTitle,
		invalid: m.decks.importFailedTitle,
		limit: m.decks.importSaveTitle,
		storage: m.decks.importSaveTitle,
	};

	return (
		<AppShell>
			<div className="flex flex-1 flex-col justify-center gap-4 pb-16">
				<p className="w-fit -rotate-2 rounded-full border-2 border-foreground bg-accent-lime px-3 py-1 font-bold text-accent-ink text-xs uppercase tracking-widest shadow-sticker-sm">
					{app.name}
				</p>

				<h1 className="font-display text-4xl uppercase">{titles[state]}</h1>

				{ok && deck ? (
					<p className="text-muted-foreground">
						{interpolate(m.decks.importedBody, {
							name: deck.name,
							count: deck.words.length,
						})}
					</p>
				) : null}

				{state === "invalid" ? (
					<p className="text-muted-foreground">{m.decks.importFailedBody}</p>
				) : null}

				{state === "limit" ? (
					<p className="text-muted-foreground">
						{interpolate(m.decks.limitError, { max: MAX_DECKS })}
					</p>
				) : null}

				{state === "storage" ? (
					<p className="text-muted-foreground">{m.decks.saveError}</p>
				) : null}

				{state === "loading" ? null : (
					<div className="mt-2 flex flex-col gap-2">
						{ok ? (
							<Button asChild variant="sticker">
								<Link params={{ lang }} to="/$lang/decks">
									{m.decks.importSee}
								</Link>
							</Button>
						) : null}
						<Button asChild variant={ok ? "outline" : "sticker"}>
							<Link params={{ lang }} to="/$lang">
								{m.decks.importHome}
							</Link>
						</Button>
					</div>
				)}
			</div>
		</AppShell>
	);
};

export const Route = createFileRoute("/$lang/_app/decks/import")({
	ssr: false,
	validateSearch: (search: Record<string, unknown>) => ({
		d: typeof search.d === "string" ? search.d : "",
	}),
	head: ({ params }) => ({
		meta: [
			{ name: "robots", content: "noindex" },
			// The outcome is only known client-side, so the static title is generic.
			{
				title: `${getMessages(params.lang).decks.title} — ${app.name}`,
			},
		],
	}),
	component: ImportPage,
});
