import { DURATIONS, type Duration } from "@/games/charades/rules";
import type { Messages } from "@/i18n";
import { cn } from "@/lib/utils";

/** Below two minutes a round reads better in seconds ("90"), above in minutes. */
const MINUTES_FROM = 120;

/** The three round lengths as big tiles: the number is what people scan for. */
export const DurationField = ({
	messages,
	duration,
	onChange,
}: {
	messages: Messages;
	duration: Duration;
	onChange: (duration: Duration) => void;
}) => (
	<section className="flex flex-col gap-3">
		<h2 className="font-bold text-lg">{messages.charades.durationTitle}</h2>
		<div className="grid grid-cols-3 gap-2.5">
			{DURATIONS.map((seconds) => {
				const isSelected = duration === seconds;
				const inMinutes = seconds >= MINUTES_FROM;
				return (
					<button
						aria-pressed={isSelected}
						className={cn(
							"flex h-24 flex-col items-center justify-center rounded-xl border-2",
							isSelected
								? "border-foreground bg-accent-lime text-accent-ink shadow-sticker-sm"
								: "border-border bg-card",
						)}
						key={seconds}
						onClick={() => onChange(seconds)}
						type="button"
					>
						<span className="font-display font-extrabold text-4xl tabular-nums leading-none">
							{inMinutes ? seconds / 60 : seconds}
						</span>
						<span
							className={cn(
								"font-bold text-sm",
								!isSelected && "text-muted-foreground",
							)}
						>
							{inMinutes
								? messages.charades.minutes
								: messages.charades.seconds}
						</span>
					</button>
				);
			})}
		</div>
	</section>
);
