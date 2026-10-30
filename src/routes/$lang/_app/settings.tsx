import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	LanguagesIcon,
	LayersIcon,
	MoonIcon,
	PaletteIcon,
	Volume2Icon,
} from "lucide-react";

import { BackLink } from "@/components/back-link";
import { AppShell } from "@/components/layout/app-shell";
import { type Theme, useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { app, type Locale, locales } from "@/config/app";
import { appVersion } from "@/config/version";
import { useSoundMuted } from "@/hooks/use-sound";
import {
	getMessages,
	interpolate,
	localeLabel,
	writeLocaleCookie,
} from "@/i18n";
import { playSound, setSoundMuted } from "@/lib/sound";
import { cn } from "@/lib/utils";

const SettingsPage = () => {
	const { lang } = Route.useParams();
	const m = getMessages(lang);
	const navigate = useNavigate();
	const { theme, setTheme } = useTheme();
	const muted = useSoundMuted();

	const themeLabels: Record<Theme, string> = {
		light: m.common.light,
		dark: m.common.dark,
		system: m.common.system,
	};

	const switchLocale = (next: Locale) => {
		if (next === lang) {
			return;
		}
		writeLocaleCookie(next);
		navigate({ to: "/$lang/settings", params: { lang: next } });
	};

	return (
		<AppShell>
			<header className="flex flex-col gap-3 pt-6 pb-6">
				<BackLink label={m.common.home} lang={lang} />
				<h1 className="font-display text-4xl uppercase">{m.settings.title}</h1>
				<p className="text-muted-foreground">{m.settings.subtitle}</p>
			</header>

			<div className="flex flex-col gap-4">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<LanguagesIcon aria-hidden="true" className="size-5" />
							{m.common.language}
						</CardTitle>
						<p className="text-muted-foreground text-sm">
							{m.settings.languageBody}
						</p>
					</CardHeader>
					<CardContent>
						<div className="flex gap-2">
							{locales.map((locale) => (
								<Button
									className={cn(
										"flex-1 border-2",
										locale === lang && "border-foreground",
									)}
									key={locale}
									onClick={() => switchLocale(locale)}
									variant={locale === lang ? "default" : "outline"}
								>
									{localeLabel(locale)}
								</Button>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MoonIcon aria-hidden="true" className="size-5" />
							{m.common.theme}
						</CardTitle>
						<p className="text-muted-foreground text-sm">
							{m.settings.themeBody}
						</p>
					</CardHeader>
					<CardContent>
						<div className="flex gap-2">
							{(["light", "dark", "system"] as const).map((option) => (
								<Button
									className={cn(
										"flex-1 border-2",
										theme === option && "border-foreground",
									)}
									key={option}
									onClick={() => setTheme(option)}
									size="sm"
									variant={theme === option ? "default" : "outline"}
								>
									{themeLabels[option]}
								</Button>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center justify-between gap-4">
							<div className="flex min-w-0 flex-col gap-1">
								<CardTitle className="flex items-center gap-2">
									<Volume2Icon aria-hidden="true" className="size-5" />
									{m.settings.soundTitle}
								</CardTitle>
								<p className="text-muted-foreground text-sm">
									{m.settings.soundBody}
								</p>
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
					</CardHeader>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<LayersIcon aria-hidden="true" className="size-5" />
							{m.settings.decksTitle}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">
							{m.settings.decksBody}
						</p>
						<div className="mt-3">
							<Link
								className="inline-flex font-bold text-sm underline-offset-4 hover:underline"
								params={{ lang }}
								to="/$lang/decks"
							>
								{m.decks.manage}
							</Link>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<PaletteIcon aria-hidden="true" className="size-5" />
							{m.settings.aboutTitle}
							<span className="ml-auto rounded-full border border-border px-2 py-0.5 font-mono font-normal text-muted-foreground text-xs">
								v{appVersion}
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">
							{interpolate(m.settings.aboutBody, { app: app.name })}
						</p>
						<div className="mt-3 flex gap-4">
							<Link
								className="inline-flex font-bold text-sm underline-offset-4 hover:underline"
								params={{ lang }}
								to="/$lang/about"
							>
								{m.common.about}
							</Link>
							<Link
								className="inline-flex font-bold text-sm underline-offset-4 hover:underline"
								params={{ lang }}
								to="/$lang/legal"
							>
								{m.common.legal}
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</AppShell>
	);
};
export const Route = createFileRoute("/$lang/_app/settings")({
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return {
			meta: [
				{ name: "robots", content: "noindex" },
				{ title: `${m.settings.title} — ${app.name}` },
				{ name: "description", content: m.settings.subtitle },
			],
		};
	},
	component: SettingsPage,
});
