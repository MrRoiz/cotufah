import { Link } from "@tanstack/react-router";
import { ChevronRightIcon, LayersIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { packChoices } from "@/decks/categories";
import { useCustomDecks } from "@/decks/hooks/use-custom-decks";
import { getMessages, interpolate, plural } from "@/i18n";

/** How many decks a round can draw from, and the way to the player's own. */
export const DecksRow = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);
	const { decks } = useCustomDecks();

	const packs = interpolate(m.games.decksTitle, { count: packChoices.length });
	const title =
		decks.length > 0
			? `${packs} ${plural(lang, decks.length, m.games.decksCustom)}`
			: packs;

	return (
		<Link
			className="flex min-h-16 items-center gap-3 rounded-xl border-2 border-border bg-card px-4 py-3"
			params={{ lang }}
			to="/$lang/decks"
		>
			<LayersIcon aria-hidden="true" className="size-6 shrink-0" />
			<span className="flex min-w-0 flex-1 flex-col">
				<span className="font-extrabold">{title}</span>
				<span className="truncate text-muted-foreground text-sm">
					{m.games.decksBody}
				</span>
			</span>
			<ChevronRightIcon aria-hidden="true" className="size-5 shrink-0" />
		</Link>
	);
};
