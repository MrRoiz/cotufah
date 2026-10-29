import { TimerBar } from "@/components/timer-bar";
import { Button } from "@/components/ui/button";
import { DISCUSS_SECONDS } from "@/games/spy/use-spy-round";
import type { Messages } from "@/i18n/en";
import { cn } from "@/lib/utils";

export const DiscussPanel = ({
	m,
	remainingMs,
	paused,
	onTogglePause,
	onVote,
}: {
	m: Messages;
	remainingMs: number;
	paused: boolean;
	onTogglePause: () => void;
	onVote: () => void;
}) => {
	const remaining = Math.ceil(remainingMs / 1000);

	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
			<h1 className="font-display text-3xl uppercase">{m.spy.discussTitle}</h1>
			<p className="text-muted-foreground">{m.spy.discussBody}</p>

			<div className="flex flex-col items-center gap-2">
				<div className="flex flex-col items-center gap-3">
					<span
						className={cn(
							"font-display text-7xl tabular-nums leading-none",
							remaining <= 10 && "text-destructive",
						)}
					>
						{Math.floor(remaining / 60)}:
						{String(remaining % 60).padStart(2, "0")}
					</span>
					<TimerBar
						className="h-2.5 w-56"
						remainingMs={remainingMs}
						totalMs={DISCUSS_SECONDS * 1000}
						urgent={remaining <= 10}
					/>
				</div>
				{remaining <= 0 ? (
					<span className="font-bold text-destructive">{m.spy.timeUp}</span>
				) : (
					<Button onClick={onTogglePause} variant="ghost">
						{paused ? m.spy.resume : m.spy.pause}
					</Button>
				)}
			</div>

			<Button className="w-full" onClick={onVote} size="lg" variant="sticker">
				{m.spy.voteTitle}
			</Button>
		</section>
	);
};
