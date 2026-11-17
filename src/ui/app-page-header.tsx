import type { Locale } from "@/config/app";
import { BackLink } from "@/ui/back-link";

/**
 * Header for the screens below a tab (setups, the deck editor): back, then the
 * title beside it. The tab screens themselves use `TabPageHeader`.
 */
export const AppPageHeader = ({
	lang,
	title,
	subtitle,
}: {
	lang: Locale;
	title: string;
	subtitle?: string;
}) => (
	<header className="flex items-center gap-3 pt-4 pb-6">
		<BackLink lang={lang} />
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
