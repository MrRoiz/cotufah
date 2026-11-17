import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react";
import type { ReactNode } from "react";
import { app, type Locale, locales } from "@/config/app";
import { appVersion } from "@/config/version";
import { getMessages, interpolate, localeLabel } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { BottomNav } from "@/layout/bottom-nav";
import { playSound, setSoundMuted, useSoundMuted } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { themes, useTheme } from "@/providers/theme-provider";
import { SegmentedControl } from "@/ui/segmented-control";
import { Switch } from "@/ui/switch";
import { TabPageHeader } from "@/ui/tab-page-header";

const groupClass =
	"flex flex-col divide-y-2 divide-muted overflow-hidden rounded-xl border-2 bg-card";
const linkRowClass = "flex min-h-14 items-center gap-3 px-4 font-bold";

/**
 * One labelled setting inside a group: the label on top, its control below.
 * The visible label is hidden from screen readers: the control's own legend
 * already names it, and reading both would say it twice.
 */
const SettingRow = ({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) => (
	<div className="flex flex-col gap-2.5 px-4 py-3.5">
		<span aria-hidden="true" className="font-extrabold">
			{title}
		</span>
		{children}
	</div>
);

export const SettingsScreen = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);
	const navigate = useNavigate();
	const { theme, setTheme } = useTheme();
	const muted = useSoundMuted();

	const switchLocale = (next: Locale) => {
		if (next === lang) {
			return;
		}
		navigate({ to: "/$lang/settings", params: { lang: next } });
	};

	return (
		<AppShell footer={<BottomNav lang={lang} />}>
			<TabPageHeader subtitle={m.settings.subtitle} title={m.settings.title} />

			<div className="flex flex-col gap-4">
				<section className={cn(groupClass, "border-foreground")}>
					<SettingRow title={m.common.language}>
						<SegmentedControl
							label={m.common.language}
							onChange={switchLocale}
							options={locales.map((locale) => ({
								value: locale,
								label: localeLabel(locale),
							}))}
							value={lang}
						/>
					</SettingRow>

					<SettingRow title={m.common.theme}>
						<SegmentedControl
							label={m.common.theme}
							onChange={setTheme}
							options={themes.map((option) => ({
								value: option,
								label: m.common[option],
							}))}
							value={theme}
						/>
					</SettingRow>

					<div className="flex items-center gap-3 px-4 py-3.5">
						<div className="flex min-w-0 flex-1 flex-col gap-0.5">
							<span className="font-extrabold">{m.settings.soundTitle}</span>
							<span className="text-muted-foreground text-sm">
								{m.settings.soundBody}
							</span>
						</div>
						<Switch
							aria-label={m.settings.soundTitle}
							checked={!muted}
							onCheckedChange={(checked) => {
								setSoundMuted(!checked);
								if (checked) {
									playSound("correct");
								}
							}}
						/>
					</div>
				</section>

				<section className={cn(groupClass, "border-border")}>
					<Link className={linkRowClass} params={{ lang }} to="/$lang/about">
						<span className="flex-1">{m.common.about}</span>
						<ChevronRightIcon aria-hidden="true" className="size-5" />
					</Link>
					<Link className={linkRowClass} params={{ lang }} to="/$lang/legal">
						<span className="flex-1">{m.common.legal}</span>
						<ChevronRightIcon aria-hidden="true" className="size-5" />
					</Link>
					<a
						className={linkRowClass}
						href={app.repo}
						rel="noreferrer"
						target="_blank"
					>
						<span className="flex-1">{m.settings.openSource}</span>
						<ExternalLinkIcon aria-hidden="true" className="size-5" />
					</a>
				</section>

				<p className="text-center text-muted-foreground text-sm">
					{interpolate(m.settings.aboutBody, { version: appVersion })}
				</p>
			</div>
		</AppShell>
	);
};
