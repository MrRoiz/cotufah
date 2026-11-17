import { createLink } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";
import type { ComponentPropsWithRef } from "react";

/**
 * Back goes to the screen's parent (setup → games list, editor → decks), never
 * through browser history: history can hold a round that already ended, and
 * back must not walk into it. Typed like a router `Link`.
 */
const BackAnchor = ({
	label,
	...props
}: ComponentPropsWithRef<"a"> & { label: string }) => (
	<a
		{...props}
		className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-card"
		title={label}
	>
		<ChevronLeftIcon aria-hidden="true" className="size-6" />
		<span className="sr-only">{label}</span>
	</a>
);

export const BackLink = createLink(BackAnchor);
