import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { app, type Locale } from "@/config/app";
import { localeLabel, otherLocale, writeLocaleCookie } from "@/i18n";

/**
 * Header for the public document pages (legal, about): back to the landing,
 * the other language, and the theme toggle.
 */
export const PageHeader = ({
	lang,
	to,
}: {
	lang: Locale;
	to: "/$lang/legal" | "/$lang/about";
}) => {
	const other = otherLocale(lang);

	return (
		<header className="flex items-center justify-between gap-4 py-5">
			<Link
				className="inline-flex items-center gap-1 font-bold text-muted-foreground text-sm"
				params={{ lang }}
				to="/$lang"
			>
				<ArrowLeftIcon aria-hidden="true" className="size-4" />
				{app.name}
			</Link>
			<div className="flex items-center gap-2">
				<Link
					className="rounded-full px-2 py-1 font-bold text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
					onClick={() => writeLocaleCookie(other)}
					params={{ lang: other }}
					to={to}
				>
					{localeLabel(other)}
				</Link>
				<ModeToggle className="rounded-full border-2" locale={lang} />
			</div>
		</header>
	);
};
