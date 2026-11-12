import { cn } from "@/lib/utils";

/**
 * The round timer bar. Width comes from the same millisecond countdown as the
 * clock, and the transition only covers the gap between two ticks, so the fill
 * drains continuously and is empty at 0:00 instead of a second later.
 */
export const TimerBar = ({
	remainingMs,
	totalMs,
	urgent = false,
	className,
}: {
	remainingMs: number;
	totalMs: number;
	urgent?: boolean;
	className?: string;
}) => {
	const width = Math.min(100, Math.max(0, (remainingMs / totalMs) * 100));

	return (
		<div
			className={cn(
				"overflow-hidden rounded-full border-2 border-foreground bg-card",
				className,
			)}
		>
			<div
				className={cn(
					"h-full rounded-full transition-[width] duration-100 ease-linear",
					urgent ? "bg-destructive" : "bg-accent-lime",
				)}
				style={{ width: `${width}%` }}
			/>
		</div>
	);
};
