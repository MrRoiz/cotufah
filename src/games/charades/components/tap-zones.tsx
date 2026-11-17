import { CheckIcon, XIcon } from "lucide-react";

import type { Messages } from "@/i18n";

/** No sensor: the screen itself becomes the two tap halves, pass and correct. */
export const TapZones = ({
	messages,
	onAnswer,
}: {
	messages: Messages;
	onAnswer: (correct: boolean) => void;
}) => (
	<div className="absolute inset-0 z-10 flex">
		<button
			aria-label={messages.charades.pass}
			className="flex flex-1 items-end justify-center pb-10 active:bg-accent-fuchsia/15"
			onClick={() => onAnswer(false)}
			type="button"
		>
			<span className="inline-flex items-center gap-2 rounded-full border-2 border-accent-fuchsia px-4 py-2 font-bold text-accent-fuchsia text-sm">
				<XIcon aria-hidden="true" />
				{messages.charades.pass}
			</span>
		</button>
		<button
			aria-label={messages.charades.correct}
			className="flex flex-1 items-end justify-center pb-10 active:bg-accent-lime/20"
			onClick={() => onAnswer(true)}
			type="button"
		>
			<span className="inline-flex items-center gap-2 rounded-full border-2 border-accent-ink bg-accent-lime px-4 py-2 font-bold text-accent-ink text-sm">
				<CheckIcon aria-hidden="true" />
				{messages.charades.correct}
			</span>
		</button>
	</div>
);
