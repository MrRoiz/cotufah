import { Link } from "@tanstack/react-router";

import type { Locale } from "@/config/app";
import { localeLabel, otherLocale } from "@/i18n";

/** "Switch to the other language" in one place: same path, other locale. */
export const LocaleSwitch = ({
	lang,
	to,
	className = "rounded-full px-2 py-1 font-bold text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline",
}: {
	lang: Locale;
	to: "/$lang" | "/$lang/legal" | "/$lang/about";
	className?: string;
}) => {
	const other = otherLocale(lang);

	return (
		<Link className={className} params={{ lang: other }} to={to}>
			{localeLabel(other)}
		</Link>
	);
};
