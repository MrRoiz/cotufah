import { Link } from "@tanstack/react-router";
import {
	Gamepad2Icon,
	LayersIcon,
	type LucideIcon,
	SettingsIcon,
} from "lucide-react";

import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";

type Tab = {
	to: "/$lang/games" | "/$lang/decks" | "/$lang/settings";
	icon: LucideIcon;
	label: "games" | "decks" | "settings";
};

const tabs: Tab[] = [
	{ to: "/$lang/games", icon: Gamepad2Icon, label: "games" },
	{ to: "/$lang/decks", icon: LayersIcon, label: "decks" },
	{ to: "/$lang/settings", icon: SettingsIcon, label: "settings" },
];

const tabClass =
	"flex min-h-13 flex-col items-center justify-center gap-0.5 rounded-xl border-2 font-bold text-xs";

// Split so the two colour sets never sit on the element together.
const activeTabClass = "border-foreground bg-accent-lime text-accent-ink";
const inactiveTabClass = "border-transparent text-muted-foreground";

/**
 * The three top-level places of the app. It sits in the shell footer of the
 * tab screens only: a round or a setup form never shows it.
 */
export const BottomNav = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<nav aria-label={m.nav.label} className="grid grid-cols-3 gap-2">
			{tabs.map((tab) => {
				const Icon = tab.icon;
				return (
					<Link
						activeOptions={{ exact: true }}
						activeProps={{ className: activeTabClass }}
						className={tabClass}
						inactiveProps={{ className: inactiveTabClass }}
						key={tab.to}
						params={{ lang }}
						to={tab.to}
					>
						<Icon aria-hidden="true" className="size-5" />
						{m.nav[tab.label]}
					</Link>
				);
			})}
		</nav>
	);
};
