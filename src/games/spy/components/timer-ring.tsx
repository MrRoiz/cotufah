import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** In viewBox units: the ring sits inside a 100×100 box, the track inside it. */
const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * A countdown drawn as a ring that empties clockwise, with the number in the
 * middle. Same millisecond source as `TimerBar`, so both drain identically.
 */
export const TimerRing = ({
	remainingMs,
	totalMs,
	urgent = false,
	className,
	children,
}: {
	remainingMs: number;
	totalMs: number;
	urgent?: boolean;
	/** Sets the size (`size-40`); the drawing scales with it. */
	className?: string;
	children: ReactNode;
}) => {
	const fraction = Math.min(1, Math.max(0, remainingMs / totalMs));
	const offset = CIRCUMFERENCE * (1 - fraction);

	return (
		<div className={cn("relative", className)}>
			<svg
				aria-hidden="true"
				className="absolute inset-0 size-full -rotate-90"
				viewBox="0 0 100 100"
			>
				<circle
					className="fill-card stroke-foreground"
					cx="50"
					cy="50"
					r="48"
					strokeWidth="1.5"
				/>
				<circle
					className="fill-none stroke-muted"
					cx="50"
					cy="50"
					r={RADIUS}
					strokeWidth="8"
				/>
				<circle
					className={cn(
						"fill-none transition-[stroke-dashoffset] duration-100 ease-linear",
						urgent ? "stroke-destructive" : "stroke-accent-lime",
					)}
					cx="50"
					cy="50"
					r={RADIUS}
					strokeDasharray={CIRCUMFERENCE}
					strokeDashoffset={offset}
					strokeLinecap="round"
					strokeWidth="8"
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				{children}
			</div>
		</div>
	);
};
