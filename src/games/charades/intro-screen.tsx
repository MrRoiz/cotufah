import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Messages } from "@/i18n/en";

type Probe = "unknown" | "yes" | "no";

/**
 * Pre-round screen. Teaches tilt or tap depending on what the sensor probe
 * found, and is the only place that explains the fallback.
 */
export const CharadesIntro = ({
	m,
	probe,
	probing,
	canStart,
	isPending,
	onStart,
}: {
	m: Messages;
	probe: Probe;
	probing: boolean;
	canStart: boolean;
	isPending: boolean;
	onStart: () => void;
}) => {
	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
			<h1 className="font-display text-3xl uppercase">
				{m.charades.introTitle}
			</h1>
			<p className="text-muted-foreground">{m.charades.introBody}</p>

			{probing ? (
				<div className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-card px-4 py-6 text-muted-foreground text-sm">
					<Loader2Icon aria-hidden="true" className="size-4 animate-spin" />
					{m.charades.checkingSensor}
				</div>
			) : probe === "no" ? (
				<div className="flex w-full flex-col gap-3 pt-2">
					<div className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-card px-4 py-3">
						<span className="font-bold">{m.charades.tapLeft}</span>
						<span className="rounded-full bg-accent-fuchsia px-3 py-1 font-bold text-accent-ink text-xs uppercase">
							{m.charades.pass}
						</span>
					</div>
					<div className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-card px-4 py-3">
						<span className="font-bold">{m.charades.tapRight}</span>
						<span className="rounded-full bg-accent-lime px-3 py-1 font-bold text-accent-ink text-xs uppercase">
							{m.charades.correct}
						</span>
					</div>
					<p className="text-muted-foreground text-sm">{m.charades.noMotion}</p>
				</div>
			) : (
				<div className="flex w-full flex-col gap-3 pt-2">
					<div className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-card px-4 py-3">
						<span className="font-bold">{m.charades.tiltCorrect}</span>
						<span className="rounded-full bg-accent-lime px-3 py-1 font-bold text-accent-ink text-xs uppercase">
							{m.charades.tiltCorrectHint}
						</span>
					</div>
					<div className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-card px-4 py-3">
						<span className="font-bold">{m.charades.tiltPass}</span>
						<span className="rounded-full bg-accent-fuchsia px-3 py-1 font-bold text-accent-ink text-xs uppercase">
							{m.charades.tiltPassHint}
						</span>
					</div>
				</div>
			)}

			<Button
				className="w-full"
				disabled={isPending || !canStart}
				onClick={onStart}
				size="lg"
				variant="sticker"
			>
				{isPending ? "…" : m.charades.startRound}
			</Button>
		</section>
	);
};
