import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";
import { type Theme, themes, useTheme } from "@/providers/theme-provider";
import { Button } from "@/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

const icons: Record<Theme, typeof SunIcon> = {
	light: SunIcon,
	dark: MoonIcon,
	system: MonitorIcon,
};

export const ModeToggle = ({
	locale,
	className,
}: {
	locale: Locale;
	className?: string;
}) => {
	const { setTheme } = useTheme();
	const m = getMessages(locale);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label={m.common.theme}
					className={className}
					size="icon"
					title={m.common.theme}
					variant="outline"
				>
					<SunIcon className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<MoonIcon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{themes.map((option) => {
					const Icon = icons[option];
					return (
						<DropdownMenuItem key={option} onClick={() => setTheme(option)}>
							<Icon aria-hidden="true" />
							{m.common[option]}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
