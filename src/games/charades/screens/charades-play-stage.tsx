import { ArrowDownIcon, ArrowUpIcon, CheckIcon, XIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { TimerBar } from "@/games/components/timer-bar";
import {
	FINAL_SECONDS,
	formatClock,
	secondsLeft,
} from "@/games/hooks/use-countdown";
import { getMessages, plural } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * The forehead stage: full viewport, word in the middle, timer and score at the
 * edges. Always in the dark tokens: light text on a dark screen reads from
 * across the room and does not glare. Input is tilt (with the gestures as a
 * reminder) or the two tap halves.
 */
export const CharadesPlayStage = ({
	lang,
	word,
	remainingMs,
	totalMs,
	score,
	flash,
	zonesVisible,
	onAnswer,
}: {
	lang: Locale;
	word: string;
	remainingMs: number;
	totalMs: number;
	score: number;
	flash: "correct" | "pass" | null;
	/** No sensor: the screen itself becomes the two tap halves. */
	zonesVisible: boolean;
	onAnswer: (correct: boolean) => void;
}) => {
	const m = getMessages(lang);
	const remaining = secondsLeft(remainingMs);
	const isUrgent = remaining <= FINAL_SECONDS;

	return (
		<div className="stage-landscape dark gap-3 text-foreground">
			{flash ? (
				<div
					className={cn(
						"pointer-events-none fixed inset-0 z-50 flex animate-in items-center justify-center text-accent-ink fade-in duration-100",
						flash === "correct" ? "bg-accent-lime/95" : "bg-accent-fuchsia/95",
					)}
				>
					{flash === "correct" ? (
						<CheckIcon aria-hidden="true" className="size-40" />
					) : (
						<XIcon aria-hidden="true" className="size-40" />
					)}
				</div>
			) : null}

			<div className="flex w-full items-center gap-5">
				<span
					className={cn(
						"font-display font-extrabold text-4xl tabular-nums leading-none",
						isUrgent && "text-destructive",
					)}
					role="timer"
				>
					{formatClock(remaining)}
				</span>
				<TimerBar
					className="h-3 flex-1"
					remainingMs={remainingMs}
					totalMs={totalMs}
					urgent={isUrgent}
				/>
				<span className="flex items-center gap-1.5 rounded-full border-2 border-accent-ink bg-accent-lime px-3.5 py-0.5 font-display font-extrabold text-2xl text-accent-ink tabular-nums">
					<CheckIcon aria-hidden="true" className="size-5" strokeWidth={3} />
					<span aria-hidden="true">{score}</span>
					<span className="sr-only">
						{plural(lang, score, m.charades.score)}
					</span>
				</span>
			</div>

			<div className="flex min-h-0 flex-1 items-center justify-center">
				<span
					className="max-w-full animate-in break-words text-center font-display font-extrabold text-7xl uppercase leading-[0.9] tracking-tight fade-in slide-in-from-bottom-3 duration-150"
					key={word}
				>
					{word}
				</span>
			</div>

			{zonesVisible ? (
				<div className="absolute inset-0 z-10 flex">
					<button
						aria-label={m.charades.pass}
						className="flex flex-1 items-end justify-center pb-10 active:bg-accent-fuchsia/15"
						onClick={() => onAnswer(false)}
						type="button"
					>
						<span className="inline-flex items-center gap-2 rounded-full border-2 border-accent-fuchsia px-4 py-2 font-bold text-accent-fuchsia text-sm">
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
						<span className="inline-flex items-center gap-2 rounded-full border-2 border-accent-ink bg-accent-lime px-4 py-2 font-bold text-accent-ink text-sm">
							<CheckIcon aria-hidden="true" />
							{m.charades.correct}
						</span>
					</button>
				</div>
			) : (
				<div className="flex w-full items-center justify-between gap-3">
					<span className="inline-flex items-center gap-2 rounded-full border-2 border-accent-fuchsia px-3.5 py-1.5 font-extrabold text-accent-fuchsia text-sm">
						<ArrowUpIcon aria-hidden="true" className="size-4" />
						{`${m.charades.tiltPass}: ${m.charades.tiltPassHint}`}
					</span>
					<span className="inline-flex items-center gap-2 rounded-full border-2 border-accent-lime px-3.5 py-1.5 font-extrabold text-accent-lime text-sm">
						<ArrowDownIcon aria-hidden="true" className="size-4" />
						{`${m.charades.tiltCorrect}: ${m.charades.tiltCorrectHint}`}
					</span>
				</div>
			)}
		</div>
	);
};
