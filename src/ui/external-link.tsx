import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { textLinkClass } from "@/ui/text-link-class";

type ExternalLinkProps = {
	href: string;
	children: ReactNode;
	className?: string;
};

/**
 * One treatment for links that leave the app, so the repo link looks the same
 * on the landing, the about page and the legal page.
 */
export const ExternalLink = ({
	href,
	children,
	className,
}: ExternalLinkProps) => (
	<a
		className={cn(textLinkClass, className)}
		href={href}
		rel="noreferrer"
		target="_blank"
	>
		{children}
	</a>
);
