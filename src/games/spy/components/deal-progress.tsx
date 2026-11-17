import { cn } from "@/lib/utils";

/**
 * Who has seen their role and who is next: one dot per player, the current
 * one stretched into a pill. Purely visual; the label carries the meaning.
 */
export const DealProgress = ({
	label,
	position,
	total,
}: {
	label: string;
	/** 1-based seat of the player holding (or about to hold) the phone. */
	position: number;
	total: number;
}) => (
	<div className="flex items-center gap-3">
		<span aria-label={label} className="flex items-center gap-1.5" role="img">
			{Array.from({ length: total }, (_, index) => {
				const seat = index + 1;
				return (
					<span
						className={cn(
							"h-2.5 rounded-full",
							seat === position && "w-6 bg-accent-cyan",
							seat < position && "w-2.5 bg-foreground",
							seat > position && "w-2.5 bg-input",
						)}
						key={seat}
					/>
				);
			})}
		</span>
		<span
			aria-hidden="true"
			className="font-extrabold text-muted-foreground text-sm tabular-nums"
		>
			{position}/{total}
		</span>
	</div>
);
