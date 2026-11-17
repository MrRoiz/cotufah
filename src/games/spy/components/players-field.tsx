import { PlusIcon, XIcon } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";

import type { Locale } from "@/config/app";
import { PlayerAvatar } from "@/games/components/player-avatar";
import { MAX_PLAYERS } from "@/games/spy/rules";
import { validatePlayerName } from "@/games/spy/validate-player-name";
import { getMessages, interpolate, plural } from "@/i18n";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

/**
 * The round's players as chips plus one name field: type, Enter, next. A name
 * is checked before it becomes a chip, so there are no half-filled rows.
 */
export const PlayersField = ({
	lang,
	players,
	onChange,
}: {
	lang: Locale;
	players: string[];
	onChange: (players: string[]) => void;
}) => {
	const m = getMessages(lang);
	const inputRef = useRef<HTMLInputElement>(null);
	const [draft, setDraft] = useState("");
	const [error, setError] = useState<string | null>(null);
	const isFull = players.length >= MAX_PLAYERS;

	const add = (event: FormEvent) => {
		event.preventDefault();
		const name = draft.trim();
		const problem = validatePlayerName({ m, name, players });
		if (problem) {
			setError(problem);
			return;
		}
		onChange([...players, name]);
		setDraft("");
		setError(null);
		// The + button takes focus on tap; give it back so the next name flows.
		inputRef.current?.focus();
	};

	const remove = (index: number) => {
		onChange(players.filter((_, position) => position !== index));
		setError(null);
	};

	return (
		<section className="flex flex-col gap-3">
			<div className="flex items-baseline justify-between gap-3">
				<h2 className="font-bold text-lg">{m.spy.playersTitle}</h2>
				<span className="font-bold text-muted-foreground text-sm">
					{plural(lang, players.length, m.spy.playerCount)}
				</span>
			</div>

			{players.length > 0 ? (
				<ul className="flex flex-wrap gap-2">
					{players.map((name, index) => (
						<li
							className="flex max-w-full items-center gap-2 rounded-full border-2 border-foreground bg-card pl-2"
							key={name}
						>
							<PlayerAvatar name={name} seat={index} />
							<span className="truncate font-bold">{name}</span>
							<button
								aria-label={interpolate(m.spy.removePlayer, { name })}
								className="flex size-12 shrink-0 items-center justify-center rounded-full"
								onClick={() => remove(index)}
								type="button"
							>
								<XIcon aria-hidden="true" className="size-4" />
							</button>
						</li>
					))}
				</ul>
			) : null}

			<form className="flex gap-2" noValidate onSubmit={add}>
				<Label className="sr-only" htmlFor="new-player">
					{m.spy.nameLabel}
				</Label>
				<Input
					aria-describedby={error ? "new-player-error" : undefined}
					aria-invalid={error !== null}
					autoComplete="off"
					className="h-13 flex-1 rounded-xl px-4"
					disabled={isFull}
					enterKeyHint="done"
					id="new-player"
					onChange={(event) => setDraft(event.target.value)}
					placeholder={m.spy.namePlaceholder}
					ref={inputRef}
					value={draft}
				/>
				<Button
					aria-label={m.spy.addPlayer}
					className="size-13 rounded-xl"
					disabled={isFull}
					size="icon"
					type="submit"
					variant="sticker"
				>
					<PlusIcon aria-hidden="true" />
				</Button>
			</form>

			{error ? (
				<p
					className="font-bold text-destructive text-sm"
					id="new-player-error"
					role="alert"
				>
					{error}
				</p>
			) : null}
			{isFull ? (
				<p className="text-muted-foreground text-sm">
					{interpolate(m.spy.maxPlayers, { max: MAX_PLAYERS })}
				</p>
			) : null}
		</section>
	);
};
