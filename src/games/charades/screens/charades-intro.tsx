import { Loader2Icon } from "lucide-react";
import type { Locale } from "@/config/app";
import { ForeheadIllustration } from "@/games/charades/components/forehead-illustration";
import { GestureCards } from "@/games/charades/components/gesture-cards";
import type { MotionProbe } from "@/games/charades/hooks/use-motion-probe";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";
import { BackLink } from "@/ui/back-link";
import { SummaryButton } from "@/ui/summary-button";

/**
 * Pre-round screen. Teaches tilt or tap depending on what the sensor probe
 * found, and is the only place that explains the fallback.
 */
export const CharadesIntro = ({
	lang,
	probe,
	probing,
	canStart,
	isPending,
	onStart,
}: {
	lang: Locale;
	probe: MotionProbe;
	probing: boolean;
	canStart: boolean;
	isPending: boolean;
	onStart: () => void;
}) => {
	const m = getMessages(lang);
	const hasNoSensor = probe === "no";
	const sensorLabel = probing
		? m.charades.checkingSensor
		: hasNoSensor
			? m.charades.sensorMissing
			: m.charades.sensorReady;

	return (
		<section className="flex flex-1 flex-col gap-5">
			<div className="flex items-center justify-between gap-3 pt-2">
				<BackLink lang={lang} />
				<span className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-3 py-1.5 font-extrabold text-sm">
					{probing ? (
						<Loader2Icon aria-hidden="true" className="size-4 animate-spin" />
					) : (
						<span
							aria-hidden="true"
							className={cn(
								"size-2.5 rounded-full border-2 border-foreground",
								hasNoSensor ? "bg-accent-fuchsia" : "bg-accent-lime",
							)}
						/>
					)}
					{sensorLabel}
				</span>
			</div>

			<div className="flex flex-col gap-1.5 text-center">
				<h1 className="font-display font-extrabold text-4xl uppercase leading-none">
					{m.charades.introTitle}
				</h1>
				<p className="text-muted-foreground">{m.charades.introBody}</p>
			</div>

			<div className="flex justify-center">
				<ForeheadIllustration />
			</div>

			{probing ? null : (
				<div className="flex flex-col gap-2">
					<GestureCards m={m} mode={hasNoSensor ? "tap" : "tilt"} />
					{hasNoSensor ? (
						<p className="text-center text-muted-foreground text-sm">
							{m.charades.noMotion}
						</p>
					) : null}
				</div>
			)}

			<div className="mt-auto">
				<SummaryButton
					disabled={isPending || !canStart}
					label={isPending ? "…" : m.charades.startRound}
					onClick={onStart}
					summary={m.charades.startHint}
				/>
			</div>
		</section>
	);
};
