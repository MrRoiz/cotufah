import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** One "selected option" treatment for settings rows and duration pickers. */
export const ChoiceButton = ({
	selected,
	onClick,
	children,
	className,
	size,
}: {
	selected: boolean;
	onClick: () => void;
	children: ReactNode;
	className?: string;
	size?: React.ComponentProps<typeof Button>["size"];
}) => (
	<Button
		className={cn("border-2", selected && "border-foreground", className)}
		onClick={onClick}
		size={size}
		variant={selected ? "default" : "outline"}
	>
		{children}
	</Button>
);
