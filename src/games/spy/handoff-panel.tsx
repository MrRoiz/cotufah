import { TimerBar } from "@/components/timer-bar";
import { HANDOFF_SECONDS } from "@/games/spy/use-spy-round";
import type { Messages } from "@/i18n/en";

/** Five seconds between players, so the passer cannot see the next role. */
export const HandoffPanel = ({
	m,
	name,
	remainingMs,
}: {
	m: Messages;
	name: string;
	remainingMs: number;
}) => {
	const seconds = Math.ceil(remainingMs / 1000);

	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
			<div className="flex flex-col items-center gap-2">
				<span className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
					{m.spy.handoffLabel}
				</span>
				<span className="max-w-full truncate rounded-full border-2 border-foreground bg-accent-cyan px-5 py-1.5 font-display text-3xl text-accent-ink uppercase leading-tight shadow-sticker-sm">
					{name}
				</span>
			</div>

			<div className="flex flex-col items-center gap-4">
				<span
					className="flex size-28 animate-in items-center justify-center rounded-full border-2 border-foreground bg-card font-display text-6xl tabular-nums shadow-sticker zoom-in-75 duration-200"
					key={seconds}
				>
					{seconds}
				</span>

				<TimerBar
					className="h-2.5 w-48"
					remainingMs={remainingMs}
					totalMs={HANDOFF_SECONDS * 1000}
				/>
			</div>

			<p className="max-w-xs text-muted-foreground text-sm">{m.spy.dealBody}</p>
		</section>
	);
};
