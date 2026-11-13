import { Link } from "@tanstack/react-router";

import { app, type Locale } from "@/config/app";
import { appVersion } from "@/config/version";
import { getMessages } from "@/i18n";
import { ExternalLink } from "@/ui/external-link";
import { LocaleSwitch } from "@/ui/locale-switch";
import { textLinkClass } from "@/ui/text-link";

export const Footer = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<footer className="mt-auto flex flex-col gap-3 border-t-2 border-border py-6 text-muted-foreground text-sm md:flex-row md:items-center md:justify-between">
			<p className="flex flex-wrap items-center gap-2">
				{m.home.footerNote}
				<span className="rounded-full border border-border px-1.5 py-0.5 font-mono text-[0.65rem] leading-none">
					v{appVersion}
				</span>
			</p>
			<div className="flex items-center gap-4">
				<LocaleSwitch className={textLinkClass} lang={lang} to="/$lang" />
				<Link className={textLinkClass} params={{ lang }} to="/$lang/settings">
					{m.common.settings}
				</Link>
				<Link className={textLinkClass} params={{ lang }} to="/$lang/about">
					{m.common.about}
				</Link>
				<Link className={textLinkClass} params={{ lang }} to="/$lang/legal">
					{m.common.legal}
				</Link>
				<ExternalLink href={app.repo}>GitHub</ExternalLink>
			</div>
		</footer>
	);
};
