import { Loader2Icon } from "lucide-react";
import type { MotionProbe } from "@/games/charades/use-motion-probe";
import type { Messages } from "@/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";

type GestureRow = { label: string; hint: string; accent: string };

const GestureRow = ({ row }: { row: GestureRow }) => (
	<div className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-card px-4 py-3">
		<span className="font-bold">{row.label}</span>
		<span
			className={cn(
				"rounded-full px-3 py-1 font-bold text-accent-ink text-xs uppercase",
				row.accent,
			)}
		>
			{row.hint}
		</span>
	</div>
);

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
	probe: MotionProbe;
	probing: boolean;
	canStart: boolean;
	isPending: boolean;
	onStart: () => void;
}) => {
	// The two ways to answer the same question: tap halves or a tilt.
	const rows: GestureRow[] =
		probe === "no"
			? [
					{
						label: m.charades.tapLeft,
						hint: m.charades.pass,
						accent: "bg-accent-fuchsia",
					},
					{
						label: m.charades.tapRight,
						hint: m.charades.correct,
						accent: "bg-accent-lime",
					},
				]
			: [
					{
						label: m.charades.tiltCorrect,
						hint: m.charades.tiltCorrectHint,
						accent: "bg-accent-lime",
					},
					{
						label: m.charades.tiltPass,
						hint: m.charades.tiltPassHint,
						accent: "bg-accent-fuchsia",
					},
				];

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
			) : (
				<div className="flex w-full flex-col gap-3 pt-2">
					{rows.map((row) => (
						<GestureRow key={row.label} row={row} />
					))}
					{probe === "no" ? (
						<p className="text-muted-foreground text-sm">
							{m.charades.noMotion}
						</p>
					) : null}
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
