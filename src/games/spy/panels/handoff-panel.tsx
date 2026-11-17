import { secondsLeft } from "@/games/hooks/use-countdown";
import { TimerRing } from "@/games/spy/components/timer-ring";
import { HANDOFF_MS } from "@/games/spy/rules";
import type { Messages } from "@/i18n";

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
	const seconds = secondsLeft(remainingMs);

	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-9 text-center">
			<div className="flex flex-col items-center gap-3">
				<span className="font-extrabold text-muted-foreground text-xs uppercase tracking-widest">
					{m.spy.handoffLabel}
				</span>
				<span className="max-w-full -rotate-2 truncate rounded-full border-2 border-foreground bg-accent-cyan px-6 py-2 font-display font-extrabold text-4xl text-accent-ink uppercase leading-none shadow-sticker">
					{name}
				</span>
			</div>

			<TimerRing
				className="size-40"
				remainingMs={remainingMs}
				totalMs={HANDOFF_MS}
			>
				<span
					className="animate-in font-display font-extrabold text-6xl tabular-nums leading-none zoom-in-75 duration-200"
					key={seconds}
				>
					{seconds}
				</span>
			</TimerRing>

			<p className="max-w-64 text-muted-foreground">{m.spy.dealBody}</p>
		</section>
	);
};
