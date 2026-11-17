import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { accentFill } from "@/ui/accent-fill";

/**
 * A titled block of document prose as a card, with a round marker (a number
 * on legal, "?" on about) whose colour cycles down the page.
 */
export const DocumentSection = ({
	id,
	title,
	marker,
	index,
	children,
}: {
	/** Anchor for the legal page's index. */
	id?: string;
	title: string;
	marker: string;
	/** Position on the page; picks the marker colour. */
	index: number;
	children: ReactNode;
}) => {
	return (
		<section
			className="flex scroll-mt-6 flex-col gap-3 rounded-xl border-2 border-border bg-card p-5"
			id={id}
		>
			<h2 className="flex items-center gap-3 font-display font-extrabold text-xl uppercase leading-tight">
				<span
					aria-hidden="true"
					className={cn(
						"flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-accent-ink text-base",
						accentFill(index),
					)}
				>
					{marker}
				</span>
				{title}
			</h2>
			{children}
		</section>
	);
};
