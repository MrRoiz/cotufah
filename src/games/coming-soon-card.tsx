import { PlusIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";

/** The empty slot for the next game, on the landing and the app list. */
export const ComingSoonCard = ({
	lang,
	className,
}: {
	lang: Locale;
	className?: string;
}) => {
	const m = getMessages(lang);

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-border border-dashed p-5 text-muted-foreground",
				className,
			)}
		>
			<span className="flex size-10 items-center justify-center rounded-full border-2 border-border">
				<PlusIcon aria-hidden="true" className="size-5" />
			</span>
			<span className="font-bold text-xs uppercase tracking-widest">
				{m.common.soon}
			</span>
		</div>
	);
};
