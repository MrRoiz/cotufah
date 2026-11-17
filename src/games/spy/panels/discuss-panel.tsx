import { PauseIcon, PlayIcon } from "lucide-react";

import {
	FINAL_SECONDS,
	formatClock,
	secondsLeft,
} from "@/games/hooks/use-countdown";
import { TimerRing } from "@/games/spy/components/timer-ring";
import { DISCUSS_MS, DISCUSS_SECONDS } from "@/games/spy/rules";
import { interpolate, type Messages } from "@/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";

export const DiscussPanel = ({
	m,
	starter,
	remainingMs,
	paused,
	onTogglePause,
	onVote,
}: {
	m: Messages;
	/** Picked at random each round, so nobody has to volunteer first. */
	starter: string;
	remainingMs: number;
	paused: boolean;
	onTogglePause: () => void;
	onVote: () => void;
}) => {
	const remaining = secondsLeft(remainingMs);
	const isUrgent = remaining <= FINAL_SECONDS;

	return (
		<section className="flex flex-1 flex-col items-center gap-5 text-center">
			<h1 className="font-display font-extrabold text-4xl uppercase leading-none">
				{m.spy.discussTitle}
			</h1>

			<p className="flex max-w-full items-center gap-2 rounded-full border-2 border-foreground bg-card py-1.5 pr-1.5 pl-4">
				<span className="font-bold text-sm">{m.spy.starter}</span>
				<span className="truncate rounded-full border-2 border-foreground bg-accent-fuchsia px-3 py-0.5 font-extrabold text-accent-ink uppercase">
					{starter}
				</span>
			</p>

			<div className="flex flex-1 flex-col items-center justify-center gap-4">
				<TimerRing
					className="size-60"
					remainingMs={remainingMs}
					totalMs={DISCUSS_MS}
					urgent={isUrgent}
				>
					<span
						className={cn(
							"font-display font-extrabold text-6xl tabular-nums leading-none",
							isUrgent && "text-destructive",
						)}
						role="timer"
					>
						{formatClock(remaining)}
					</span>
					<span className="font-bold text-muted-foreground text-sm">
						{interpolate(m.spy.clockOf, {
							total: formatClock(DISCUSS_SECONDS),
						})}
					</span>
				</TimerRing>

				{remaining <= 0 ? (
					<span className="font-bold text-destructive">{m.spy.timeUp}</span>
				) : (
					<Button
						className="border-foreground"
						onClick={onTogglePause}
						variant="outline"
					>
						{paused ? (
							<PlayIcon aria-hidden="true" />
						) : (
							<PauseIcon aria-hidden="true" />
						)}
						{paused ? m.spy.resume : m.spy.pause}
					</Button>
				)}
			</div>

			<p className="text-muted-foreground">{m.spy.discussBody}</p>

			<Button className="w-full" onClick={onVote} size="lg" variant="sticker">
				{m.spy.toVote}
			</Button>
		</section>
	);
};
