import {
	ArrowDownIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	type LucideIcon,
} from "lucide-react";

import type { Messages } from "@/i18n";
import { cn } from "@/lib/utils";

type Gesture = { icon: LucideIcon; label: string; hint: string; fill: string };

/** Tilt is the normal way to answer; tap halves are the no-sensor fallback. */
export type AnswerMode = "tilt" | "tap";

const gesturesFor = (m: Messages, mode: AnswerMode): Gesture[] =>
	mode === "tilt"
		? [
				{
					icon: ArrowDownIcon,
					label: m.charades.tiltCorrect,
					hint: m.charades.tiltCorrectHint,
					fill: "bg-accent-lime",
				},
				{
					icon: ArrowUpIcon,
					label: m.charades.tiltPass,
					hint: m.charades.tiltPassHint,
					fill: "bg-accent-fuchsia",
				},
			]
		: [
				{
					icon: ArrowLeftIcon,
					label: m.charades.tapLeft,
					hint: m.charades.pass,
					fill: "bg-accent-fuchsia",
				},
				{
					icon: ArrowRightIcon,
					label: m.charades.tapRight,
					hint: m.charades.correct,
					fill: "bg-accent-lime",
				},
			];

/** The two ways to answer, as two stickers: gesture on top, meaning below. */
export const GestureCards = ({
	m,
	mode,
}: {
	m: Messages;
	mode: AnswerMode;
}) => (
	<ul className="grid grid-cols-2 gap-2.5">
		{gesturesFor(m, mode).map((gesture) => {
			const Icon = gesture.icon;
			return (
				<li
					className={cn(
						"flex flex-col gap-1.5 rounded-xl border-2 border-foreground p-3.5 text-accent-ink",
						gesture.fill,
					)}
					key={gesture.label}
				>
					<Icon aria-hidden="true" className="size-7" strokeWidth={2.5} />
					<span className="font-extrabold leading-tight">{gesture.label}</span>
					<span className="font-semibold text-sm">{gesture.hint}</span>
				</li>
			);
		})}
	</ul>
);
