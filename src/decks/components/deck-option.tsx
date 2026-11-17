import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * One choice in the deck picker. The deck in play turns lime with a check
 * badge, the same language as the spy vote. Muted text inside uses
 * `group-aria-pressed:` to switch to ink on lime, where grey would not read.
 */
export const DeckOption = ({
	selected,
	onClick,
	className,
	children,
}: {
	selected: boolean;
	onClick: () => void;
	/** Layout of the content: a column card or a row. */
	className?: string;
	children: ReactNode;
}) => (
	<button
		aria-pressed={selected}
		className={cn(
			"group relative flex min-w-0 rounded-xl border-2 text-left",
			selected
				? "border-foreground bg-accent-lime text-accent-ink shadow-sticker-sm"
				: "border-border bg-card",
			className,
		)}
		onClick={onClick}
		type="button"
	>
		{children}
		{selected ? (
			<span
				aria-hidden="true"
				className="absolute -top-2 -right-1.5 flex size-6 items-center justify-center rounded-full border-2 border-background bg-accent-ink text-accent-lime"
			>
				<CheckIcon className="size-3.5" strokeWidth={3.5} />
			</span>
		) : null}
	</button>
);
