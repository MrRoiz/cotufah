import { DISCUSS_SECONDS } from "@/games/spy/rules";
import { TimerBar } from "@/games/timer-bar";
import { FINAL_SECONDS, formatClock, secondsLeft } from "@/games/use-countdown";
import type { Messages } from "@/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";

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
	const remaining = secondsLeft(remainingMs);

	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
			<h1 className="font-display text-3xl uppercase">{m.spy.discussTitle}</h1>
			<p className="text-muted-foreground">{m.spy.discussBody}</p>

			<div className="flex flex-col items-center gap-2">
				<div className="flex flex-col items-center gap-3">
					<span
						className={cn(
							"font-display text-7xl tabular-nums leading-none",
							remaining <= FINAL_SECONDS && "text-destructive",
						)}
					>
						{formatClock(remaining)}
					</span>
					<TimerBar
						className="h-2.5 w-56"
						remainingMs={remainingMs}
						totalMs={DISCUSS_SECONDS * 1000}
						urgent={remaining <= FINAL_SECONDS}
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
