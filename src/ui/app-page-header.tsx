import type { ReactNode } from "react";

/**
 * Header for the screens below a tab (setups, the deck editor): back to the
 * screen's parent (a `BackLink`), then the title beside it. The tab screens themselves use `TabPageHeader`.
 */
export const AppPageHeader = ({
	back,
	title,
	subtitle,
}: {
	back: ReactNode;
	title: string;
	subtitle?: string;
}) => (
	<header className="flex items-center gap-3 pt-4 pb-6">
		{back}
		<div className="flex min-w-0 flex-col">
			<h1 className="font-display font-extrabold text-3xl uppercase leading-none">
				{title}
			</h1>
			{subtitle ? (
				<p className="text-muted-foreground text-sm">{subtitle}</p>
			) : null}
		</div>
	</header>
);
