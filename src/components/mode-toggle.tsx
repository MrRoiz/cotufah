import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";

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
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<SunIcon aria-hidden="true" />
					{m.common.light}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<MoonIcon aria-hidden="true" />
					{m.common.dark}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<MonitorIcon aria-hidden="true" />
					{m.common.system}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
