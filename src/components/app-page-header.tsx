import type { ReactNode } from "react";

import { BackLink } from "@/components/back-link";
import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";

/**
 * Header for every app screen: back, title, optional subtitle, optional
 * trailing control. One place owns the app heading rhythm.
 */
export const AppPageHeader = ({
	lang,
	title,
	subtitle,
	backLabel,
	trailing,
}: {
	lang: Locale;
	title: string;
	subtitle?: string;
	backLabel?: string;
	trailing?: ReactNode;
}) => {
	const m = getMessages(lang);

	return (
		<header className="flex flex-col gap-3 pt-6 pb-6">
			<div className="flex items-start justify-between gap-4">
				<BackLink label={backLabel ?? m.common.back} lang={lang} />
				{trailing}
			</div>
			<h1 className="font-display text-4xl uppercase">{title}</h1>
			{subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
		</header>
	);
};
