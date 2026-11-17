import { Link } from "@tanstack/react-router";
import { SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { app, type Locale } from "@/config/app";
import {
	type CustomDeck,
	customCategoryId,
	type DeckWriteFailure,
	findCustomDeck,
	MAX_DECKS,
	saveCustomDeck,
} from "@/decks/custom-decks";
import { decodeDeck } from "@/decks/share-deck";
import { getMessages, interpolate, plural } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Kicker } from "@/ui/kicker";

/** The link is decoded on mount; nothing is stored until the player agrees. */
type ImportState = "loading" | "confirm" | "ok" | "invalid" | DeckWriteFailure;

export const DeckImportScreen = ({
	lang,
	payload,
}: {
	lang: Locale;
	payload: string;
}) => {
	const messages = getMessages(lang);
	const [state, setState] = useState<ImportState>("loading");
	const [deck, setDeck] = useState<CustomDeck | null>(null);
	const [exists, setExists] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			const parsed = payload ? await decodeDeck(payload) : null;
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
	}, [payload]);

	const add = () => {
		if (!deck) {
			return;
		}
		setState(saveCustomDeck(deck) ?? "ok");
	};

	const ok = state === "ok";
	const settled = state !== "loading" && state !== "confirm";
	const titles: Record<ImportState, string> = {
		loading: "",
		confirm: messages.decks.importConfirmTitle,
		ok: messages.decks.importedTitle,
		invalid: messages.decks.importFailedTitle,
		limit: messages.decks.importSaveTitle,
		storage: messages.decks.importSaveTitle,
	};

	return (
		<AppShell
			footer={
				state === "confirm" ? (
					<div className="flex flex-col gap-2">
						<Button onClick={add} size="lg" variant="sticker">
							{messages.decks.importAdd}
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link params={{ lang }} to="/$lang">
								{messages.decks.importCancel}
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
				<Kicker>{app.name}</Kicker>

				<h1 className="font-display text-4xl uppercase">{titles[state]}</h1>

				{state === "confirm" && deck ? (
					<>
						<div className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-card p-4 shadow-sticker-sm">
							<div className="min-w-0">
								<p className="break-words font-bold">{deck.name}</p>
								<p className="text-muted-foreground text-xs">
									{plural(lang, deck.words.length, messages.decks.wordCount)}
								</p>
							</div>
							<SparklesIcon
								aria-hidden="true"
								className="size-5 shrink-0 text-accent-lime"
							/>
						</div>

						<p className="text-muted-foreground">
							{messages.decks.importConfirmBody}
						</p>

						<div className="flex flex-col gap-2">
							<p className="font-bold text-sm">{messages.decks.wordsLabel}</p>
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
								{messages.decks.importExists}
							</p>
						) : null}
					</>
				) : null}

				{ok && deck ? (
					<p className="text-muted-foreground">
						{interpolate(messages.decks.importedBody, {
							name: deck.name,
							count: deck.words.length,
						})}
					</p>
				) : null}

				{state === "invalid" ? (
					<p className="text-muted-foreground">
						{messages.decks.importFailedBody}
					</p>
				) : null}

				{state === "limit" ? (
					<p className="text-muted-foreground">
						{interpolate(messages.decks.limitError, { max: MAX_DECKS })}
					</p>
				) : null}

				{state === "storage" ? (
					<p className="text-muted-foreground">{messages.decks.saveError}</p>
				) : null}

				{settled ? (
					<div className="mt-2 flex flex-col gap-2">
						{ok ? (
							<Button asChild variant="sticker">
								<Link params={{ lang }} to="/$lang/decks">
									{messages.decks.importSee}
								</Link>
							</Button>
						) : null}
						<Button asChild variant={ok ? "outline" : "sticker"}>
							<Link params={{ lang }} to="/$lang">
								{messages.decks.importHome}
							</Link>
						</Button>
					</div>
				) : null}
			</div>
		</AppShell>
	);
};
