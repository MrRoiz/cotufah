import { CheckIcon, XIcon } from "lucide-react";

import { TimerBar } from "@/components/timer-bar";
import type { Messages } from "@/i18n/en";
import { cn } from "@/lib/utils";

/**
 * The forehead stage: full viewport, word in the middle, timer and score at the
 * edges. Input is either tilt (no controls) or the two tap halves.
 */
export const CharadesPlayStage = ({
	m,
	word,
	remainingMs,
	totalMs,
	score,
	flash,
	zonesVisible,
	onAnswer,
}: {
	m: Messages;
	word: string;
	remainingMs: number;
	totalMs: number;
	score: number;
	flash: "correct" | "pass" | null;
	/** No sensor: the screen itself becomes the two tap halves. */
	zonesVisible: boolean;
	onAnswer: (correct: boolean) => void;
}) => {
	const remaining = Math.ceil(remainingMs / 1000);

	return (
		<div className="stage-landscape items-center justify-center gap-6 px-8 py-6">
			{flash ? (
				<div
					className={cn(
						"pointer-events-none fixed inset-0 z-50 flex animate-in items-center justify-center fade-in duration-100",
						flash === "correct"
							? "bg-accent-lime/95 text-accent-ink"
							: "bg-accent-fuchsia/95 text-accent-ink",
					)}
				>
					{flash === "correct" ? (
						<CheckIcon aria-hidden="true" className="size-40" />
					) : (
						<XIcon aria-hidden="true" className="size-40" />
					)}
				</div>
			) : null}

			<div className="flex w-full items-center justify-between gap-3">
				<span
					className={cn(
						"font-display text-3xl tabular-nums",
						remaining <= 10 && "text-destructive",
					)}
				>
					{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
				</span>
				<span className="rounded-full border-2 border-foreground px-3 py-1 font-bold">
					{score}
				</span>
			</div>

			<div className="flex flex-1 items-center justify-center">
				<span
					className="animate-in text-center font-display text-6xl uppercase leading-none fade-in slide-in-from-bottom-3 duration-150"
					key={word}
				>
					{word}
				</span>
			</div>

			<div className="flex w-full flex-col gap-3">
				<TimerBar
					className="h-2 w-full"
					remainingMs={remainingMs}
					totalMs={totalMs}
					urgent={remaining <= 10}
				/>
			</div>

			{zonesVisible ? (
				<div className="absolute inset-0 z-10 flex">
					<button
						aria-label={m.charades.pass}
						className="flex flex-1 items-end justify-center pb-10 active:bg-accent-fuchsia/15"
						onClick={() => onAnswer(false)}
						type="button"
					>
						<span className="inline-flex items-center gap-2 rounded-full border-2 border-border px-4 py-2 font-bold text-muted-foreground text-sm">
							<XIcon aria-hidden="true" />
							{m.charades.pass}
						</span>
					</button>
					<button
						aria-label={m.charades.correct}
						className="flex flex-1 items-end justify-center pb-10 active:bg-accent-lime/20"
						onClick={() => onAnswer(true)}
						type="button"
					>
						<span className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-accent-lime px-4 py-2 font-bold text-accent-ink text-sm">
							<CheckIcon aria-hidden="true" />
							{m.charades.correct}
						</span>
					</button>
				</div>
			) : null}
		</div>
	);
};
