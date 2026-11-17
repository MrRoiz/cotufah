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
type AnswerMode = "tilt" | "tap";

const gesturesFor = (messages: Messages, mode: AnswerMode): Gesture[] =>
	mode === "tilt"
		? [
				{
					icon: ArrowDownIcon,
					label: messages.charades.tiltCorrect,
					hint: messages.charades.correct,
					fill: "bg-accent-lime",
				},
				{
					icon: ArrowUpIcon,
					label: messages.charades.tiltPass,
					hint: messages.charades.pass,
					fill: "bg-accent-fuchsia",
				},
			]
		: [
				{
					icon: ArrowLeftIcon,
					label: messages.charades.tapLeft,
					hint: messages.charades.pass,
					fill: "bg-accent-fuchsia",
				},
				{
					icon: ArrowRightIcon,
					label: messages.charades.tapRight,
					hint: messages.charades.correct,
					fill: "bg-accent-lime",
				},
			];

/** The two ways to answer, as two stickers: gesture on top, meaning below. */
export const GestureCards = ({
	messages,
	mode,
}: {
	messages: Messages;
	mode: AnswerMode;
}) => (
	<ul className="grid grid-cols-2 gap-2.5">
		{gesturesFor(messages, mode).map((gesture) => {
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
