import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const accents = {
	lime: "bg-accent-lime",
	fuchsia: "bg-accent-fuchsia",
	cyan: "bg-accent-cyan",
} as const;

/** The tilted sticker label used above page titles and hero copy. */
export const Kicker = ({
	children,
	accent = "lime",
	tilt = true,
}: {
	children: ReactNode;
	accent?: keyof typeof accents;
	/** Off for the gate, which is a full-screen overlay, not a page header. */
	tilt?: boolean;
}) => (
	<span
		className={cn(
			"w-fit rounded-full border-2 border-foreground px-3 py-1 font-bold text-accent-ink text-xs uppercase tracking-widest shadow-sticker-sm",
			tilt && "-rotate-2",
			accents[accent],
		)}
	>
		{children}
	</span>
);
