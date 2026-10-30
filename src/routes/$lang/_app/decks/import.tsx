import { createFileRoute, Link } from "@tanstack/react-router";
import { SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { app } from "@/config/app";
import { getMessages, interpolate, plural } from "@/i18n";
import {
	type CustomDeck,
	customCategoryId,
	type DeckWriteFailure,
	decodeDeck,
	findCustomDeck,
	MAX_DECKS,
	saveCustomDeck,
} from "@/lib/custom-decks";
import { cn } from "@/lib/utils";

/** The link is decoded on mount; nothing is stored until the player agrees. */
type ImportState = "loading" | "confirm" | "ok" | "invalid" | DeckWriteFailure;

const ImportPage = () => {
	const { lang } = Route.useParams();
	const { d } = Route.useSearch();
	const m = getMessages(lang);
	const [state, setState] = useState<ImportState>("loading");
	const [deck, setDeck] = useState<CustomDeck | null>(null);
	const [exists, setExists] = useState(false);

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
			setExists(findCustomDeck(customCategoryId(parsed.id)) !== undefined);
			setState("confirm");
		};

		run();
		return () => {
			cancelled = true;
		};
	}, [d]);

	const add = () => {
		if (!deck) {
			return;
		}
		setState(saveCustomDeck(deck) ?? "ok");
	};

	const ok = state === "ok";
	const titles: Record<ImportState, string> = {
		loading: "",
		confirm: m.decks.importConfirmTitle,
		ok: m.decks.importedTitle,
		invalid: m.decks.importFailedTitle,
		limit: m.decks.importSaveTitle,
		storage: m.decks.importSaveTitle,
	};

	return (
		<AppShell
			footer={
				state === "confirm" ? (
					<div className="flex flex-col gap-2">
						<Button onClick={add} size="lg" variant="sticker">
							{m.decks.importAdd}
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link params={{ lang }} to="/$lang">
								{m.decks.importCancel}
							</Link>
						</Button>
					</div>
				) : undefined
			}
		>
			<div
				className={cn(
					"flex flex-1 flex-col gap-4",
					state === "confirm" ? "pt-6" : "justify-center pb-16",
				)}
			>
				<p className="w-fit -rotate-2 rounded-full border-2 border-foreground bg-accent-lime px-3 py-1 font-bold text-accent-ink text-xs uppercase tracking-widest shadow-sticker-sm">
					{app.name}
				</p>

				<h1 className="font-display text-4xl uppercase">{titles[state]}</h1>

				{state === "confirm" && deck ? (
					<>
						<div className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-card p-4 shadow-sticker-sm">
							<div className="min-w-0">
								<p className="break-words font-bold">{deck.name}</p>
								<p className="text-muted-foreground text-xs">
									{plural(lang, deck.words.length, m.decks.wordCount)}
								</p>
							</div>
							<SparklesIcon
								aria-hidden="true"
								className="size-5 shrink-0 text-accent-lime"
							/>
						</div>

						<p className="text-muted-foreground">{m.decks.importConfirmBody}</p>

						<div className="flex flex-col gap-2">
							<p className="font-bold text-sm">{m.decks.wordsLabel}</p>
							<div className="max-h-56 overflow-y-auto overscroll-contain rounded-lg border-2 border-border bg-card p-3">
								<div className="flex flex-wrap gap-1.5">
									{[...new Set(deck.words)].map((word) => (
										<span
											className="rounded-full border-2 border-border bg-background px-2 py-0.5 text-xs"
											key={word}
										>
											{word}
										</span>
									))}
								</div>
							</div>
						</div>

						{exists ? (
							<p className="rounded-lg border-2 border-border bg-card p-3 text-muted-foreground text-sm">
								{m.decks.importExists}
							</p>
						) : null}
					</>
				) : null}

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

				{state === "loading" || state === "confirm" ? null : (
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
