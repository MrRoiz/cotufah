import { Link, useNavigate } from "@tanstack/react-router";
import {
	LanguagesIcon,
	LayersIcon,
	type LucideIcon,
	MoonIcon,
	PaletteIcon,
	Volume2Icon,
} from "lucide-react";
import type { ReactNode } from "react";
import { app, type Locale, locales } from "@/config/app";
import { appVersion } from "@/config/version";
import { getMessages, interpolate, localeLabel } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { playSound, setSoundMuted, useSoundMuted } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { themes, useTheme } from "@/providers/theme-provider";
import { AppPageHeader } from "@/ui/app-page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { ChoiceButton } from "@/ui/choice-button";
import { Switch } from "@/ui/switch";
import { textLinkClass } from "@/ui/text-link";

/** One settings block: icon, title, optional body and a control on the right. */
const SettingsCard = ({
	icon: Icon,
	title,
	body,
	trailing,
	children,
}: {
	icon: LucideIcon;
	title: ReactNode;
	body?: string;
	/** A control that belongs on the title row (the sound switch). */
	trailing?: ReactNode;
	children?: ReactNode;
}) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between gap-4">
					<div className="flex min-w-0 flex-col gap-1">
						<CardTitle className="flex items-center gap-2">
							<Icon aria-hidden="true" className="size-5" />
							{title}
						</CardTitle>
						{body ? (
							<p className="text-muted-foreground text-sm">{body}</p>
						) : null}
					</div>
					{trailing}
				</div>
			</CardHeader>
			{children ? <CardContent>{children}</CardContent> : null}
		</Card>
	);
};

const optionRow = "flex gap-2";

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
		<AppShell>
			<AppPageHeader
				backLabel={m.common.home}
				lang={lang}
				subtitle={m.settings.subtitle}
				title={m.settings.title}
			/>

			<div className="flex flex-col gap-4">
				<SettingsCard
					body={m.settings.languageBody}
					icon={LanguagesIcon}
					title={m.common.language}
				>
					<div className={optionRow}>
						{locales.map((locale) => (
							<ChoiceButton
								className="flex-1"
								key={locale}
								onClick={() => switchLocale(locale)}
								selected={locale === lang}
							>
								{localeLabel(locale)}
							</ChoiceButton>
						))}
					</div>
				</SettingsCard>

				<SettingsCard
					body={m.settings.themeBody}
					icon={MoonIcon}
					title={m.common.theme}
				>
					<div className={optionRow}>
						{themes.map((option) => (
							<ChoiceButton
								className="flex-1"
								key={option}
								onClick={() => setTheme(option)}
								selected={theme === option}
								size="sm"
							>
								{m.common[option]}
							</ChoiceButton>
						))}
					</div>
				</SettingsCard>

				<SettingsCard
					body={m.settings.soundBody}
					icon={Volume2Icon}
					title={m.settings.soundTitle}
					trailing={
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
					}
				/>

				<SettingsCard icon={LayersIcon} title={m.settings.decksTitle}>
					<p className="text-muted-foreground text-sm">
						{m.settings.decksBody}
					</p>
					<div className="mt-3">
						<Link
							className={cn("inline-flex text-sm", textLinkClass)}
							params={{ lang }}
							to="/$lang/decks"
						>
							{m.decks.manage}
						</Link>
					</div>
				</SettingsCard>

				<SettingsCard
					icon={PaletteIcon}
					title={
						<>
							{m.settings.aboutTitle}
							<span className="ml-auto rounded-full border border-border px-2 py-0.5 font-mono font-normal text-muted-foreground text-xs">
								v{appVersion}
							</span>
						</>
					}
				>
					<p className="text-muted-foreground text-sm">
						{interpolate(m.settings.aboutBody, { app: app.name })}
					</p>
					<div className="mt-3 flex gap-4">
						<Link
							className={cn("inline-flex text-sm", textLinkClass)}
							params={{ lang }}
							to="/$lang/about"
						>
							{m.common.about}
						</Link>
						<Link
							className={cn("inline-flex text-sm", textLinkClass)}
							params={{ lang }}
							to="/$lang/legal"
						>
							{m.common.legal}
						</Link>
					</div>
				</SettingsCard>
			</div>
		</AppShell>
	);
};
