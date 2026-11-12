import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	'group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-5',
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/85",
				outline:
					"border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:border-input",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/85 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
				link: "text-primary underline-offset-4 hover:underline",
				/** The party CTA: outline, hard shadow, sinks on press. */
				sticker:
					"border-foreground bg-accent-lime text-accent-ink font-bold shadow-sticker sticker-press hover:bg-accent-lime/90",
			},
			size: {
				default: "h-12 px-5 text-base",
				sm: "h-10 px-3.5 text-sm",
				lg: "h-14 px-6 text-lg",
				icon: "size-12",
				"icon-sm": "size-10",
				"icon-lg": "size-14",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const Button = ({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) => {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
};

export { Button, buttonVariants };
