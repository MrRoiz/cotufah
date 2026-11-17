/**
 * 3-2-1 on the full-viewport stage; the word follows from the round hook.
 * Dark like the stage itself, so the screen does not flash bright in between.
 */
export const CharadesCountdown = ({
	countdown,
	go,
}: {
	countdown: number;
	go: string;
}) => (
	<div className="stage-landscape dark items-center justify-center text-foreground">
		<span
			className="animate-in zoom-in-50 font-display text-8xl tabular-nums duration-150"
			key={countdown}
		>
			{countdown > 0 ? countdown : go}
		</span>
	</div>
);
