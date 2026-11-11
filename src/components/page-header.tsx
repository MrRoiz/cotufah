import { BackLink } from "@/components/back-link";
import { LocaleSwitch } from "@/components/locale-switch";
import { ModeToggle } from "@/components/mode-toggle";
import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";

/**
 * Header for the public document pages (legal, about): back, the other
 * language, and the theme toggle.
 */
export const PageHeader = ({
	lang,
	to,
}: {
	lang: Locale;
	to: "/$lang/legal" | "/$lang/about";
}) => {
	return (
		<header className="flex items-center justify-between gap-4 py-5">
			<BackLink label={getMessages(lang).common.back} lang={lang} />
			<div className="flex items-center gap-2">
				<LocaleSwitch
					className="rounded-full px-2 py-1 font-bold text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
					lang={lang}
					to={to}
				/>
				<ModeToggle className="rounded-full border-2" locale={lang} />
			</div>
		</header>
	);
};
