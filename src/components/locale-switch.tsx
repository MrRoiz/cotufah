import { Link } from "@tanstack/react-router";

import type { Locale } from "@/config/app";
import { localeLabel, otherLocale } from "@/i18n";

/** "Switch to the other language" in one place: same path, other locale. */
export const LocaleSwitch = ({
	lang,
	to,
	className,
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
