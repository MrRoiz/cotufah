import { RotateCcwIcon, UsersIcon } from "lucide-react";
import type { Locale } from "@/config/app";
import { PlayerAvatar } from "@/games/components/player-avatar";
import { formatList, interpolate, type Messages, plural } from "@/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";

type Spy = { name: string; seat: number };

/** Verdict first, then who it was and the word, then the way back in. */
export const RevealPanel = ({
	lang,
	messages,
	caught,
	accusedName,
	spies,
	word,
	isFetching,
	onAgain,
	onChangePlayers,
}: {
	lang: Locale;
	messages: Messages;
	caught: boolean;
	accusedName: string;
	spies: Spy[];
	word: string;
	isFetching: boolean;
	onAgain: () => void;
	onChangePlayers: () => void;
}) => {
	const spyList = formatList(
		lang,
		spies.map((spy) => spy.name),
	);

	return (
		<section className="flex flex-1 flex-col gap-5">
			<div className="flex flex-1 flex-col justify-center gap-5">
				<div className="flex flex-col items-center gap-3 text-center">
					<span className="font-bold text-muted-foreground">
						{interpolate(messages.spy.accusedLine, { name: accusedName })}
					</span>
					<h1
						className={cn(
							"-rotate-2 rounded-xl border-2 border-foreground px-6 py-3 font-display font-extrabold text-4xl text-accent-ink uppercase leading-none shadow-sticker",
							caught ? "bg-accent-lime" : "bg-accent-fuchsia",
						)}
					>
						{plural(
							lang,
							spies.length,
							caught ? messages.spy.caught : messages.spy.escaped,
						)}
					</h1>
				</div>

				<div className="flex items-center gap-4 rounded-xl border-2 border-foreground bg-accent-fuchsia p-4 text-accent-ink">
					<span className="flex shrink-0 -space-x-3">
						{spies.map((spy) => (
							<PlayerAvatar
								className="size-14 border-accent-ink text-2xl"
								key={spy.seat}
								name={spy.name}
								seat={spy.seat}
							/>
						))}
					</span>
					<span className="flex min-w-0 flex-col">
						<span className="font-extrabold text-xs uppercase tracking-widest">
							{plural(lang, spies.length, messages.spy.spyLabel)}
						</span>
						<span className="break-words font-display font-extrabold text-3xl uppercase leading-tight">
							{spyList}
						</span>
					</span>
				</div>

				<div className="rounded-xl border-2 border-foreground bg-card p-4">
					<span className="font-extrabold text-muted-foreground text-xs uppercase tracking-widest">
						{messages.spy.theWordWas}
					</span>
					<p className="break-words font-display font-extrabold text-3xl uppercase leading-tight">
						{word}
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Button
					disabled={isFetching}
					onClick={onAgain}
					size="lg"
					variant="sticker"
				>
					<RotateCcwIcon aria-hidden="true" />
					{messages.spy.again}
				</Button>
				<Button
					className="border-foreground"
					onClick={onChangePlayers}
					variant="outline"
				>
					<UsersIcon aria-hidden="true" />
					{messages.spy.changePlayers}
				</Button>
			</div>
		</section>
	);
};
