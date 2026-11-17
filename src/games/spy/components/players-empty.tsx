import { UsersRoundIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";
import { Empty, EmptyDescription } from "@/ui/empty";

/**
 * What the player list shows before anyone has joined, or right after
 * clearing it. Exactly one chip row tall, so the first name does not shift
 * the screen.
 */
export const PlayersEmpty = ({ lang }: { lang: Locale }) => {
	const messages = getMessages(lang);

	return (
		<Empty className="h-13 flex-row justify-start rounded-full px-4 py-0 text-left">
			<UsersRoundIcon
				aria-hidden="true"
				className="size-5 shrink-0 text-muted-foreground"
			/>
			<EmptyDescription className="truncate">
				{messages.spy.playersEmpty}
			</EmptyDescription>
		</Empty>
	);
};
