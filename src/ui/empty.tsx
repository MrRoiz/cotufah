import type * as React from "react";
import { cn } from "@/lib/utils";

const Empty = ({ className, ...props }: React.ComponentProps<"div">) => {
	return (
		<div
			data-slot="empty"
			className={cn(
				"flex w-full min-w-0 flex-col items-center justify-center gap-2 text-balance rounded-xl border-2 border-input border-dashed p-5 text-center",
				className,
			)}
			{...props}
		/>
	);
};

const EmptyDescription = ({
	className,
	...props
}: React.ComponentProps<"p">) => {
	return (
		<p
			data-slot="empty-description"
			className={cn("text-muted-foreground text-sm/relaxed", className)}
			{...props}
		/>
	);
};

export { Empty, EmptyDescription };
