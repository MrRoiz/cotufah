import { Link } from "@tanstack/react-router";
import {
	EllipsisIcon,
	PencilIcon,
	PlayIcon,
	QrCodeIcon,
	Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { Locale } from "@/config/app";
import { type CustomDeck, customCategoryId } from "@/decks/custom-decks";
import { games } from "@/games/games";
import { getMessages, interpolate, plural } from "@/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

/** Two taps must land close together; the armed delete disarms itself. */
const CONFIRM_TIMEOUT_MS = 2500;
const PREVIEW_WORDS = 4;

const menuClass = "w-auto min-w-52 rounded-xl border-2 border-foreground p-1.5";
const itemClass = "min-h-12 gap-3 rounded-lg px-3 font-bold text-base";

/**
 * One custom deck: what is in it at a glance, the two things people do most
 * (play it, share it) as buttons, and edit/delete behind "⋯".
 */
export const DeckCard = ({
	deck,
	locale,
	onEdit,
	onShare,
	onRemove,
}: {
	deck: CustomDeck;
	locale: Locale;
	onEdit: () => void;
	onShare: () => void;
	onRemove: () => void;
}) => {
	const m = getMessages(locale);
	const [isArmed, setIsArmed] = useState(false);
	const category = customCategoryId(deck.id);
	const preview = deck.words.slice(0, PREVIEW_WORDS).join(", ");

	// A tap made seconds later must not delete.
	useEffect(() => {
		if (!isArmed) {
			return;
		}
		const timer = setTimeout(() => setIsArmed(false), CONFIRM_TIMEOUT_MS);
		return () => clearTimeout(timer);
	}, [isArmed]);

	const requestRemove = (event: Event) => {
		if (isArmed) {
			onRemove();
			return;
		}
		// Keep the menu open so the confirming tap lands on the same item.
		event.preventDefault();
		setIsArmed(true);
	};

	return (
		<li className="flex flex-col gap-3 rounded-xl border-2 border-foreground bg-card py-3.5 pr-3.5 pl-4">
			<div className="flex items-start gap-3">
				<div className="flex min-w-0 flex-1 flex-col">
					<p className="truncate font-extrabold text-lg">{deck.name}</p>
					<p className="truncate text-muted-foreground text-sm">
						{`${plural(locale, deck.words.length, m.decks.wordCount)} · ${preview}`}
					</p>
				</div>

				<DropdownMenu onOpenChange={() => setIsArmed(false)}>
					<DropdownMenuTrigger asChild>
						<Button
							aria-label={interpolate(m.decks.moreOptions, { name: deck.name })}
							size="icon"
							variant="outline"
						>
							<EllipsisIcon aria-hidden="true" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className={menuClass}>
						<DropdownMenuItem className={itemClass} onSelect={onEdit}>
							<PencilIcon aria-hidden="true" />
							{m.decks.edit}
						</DropdownMenuItem>
						<DropdownMenuItem
							className={cn(
								itemClass,
								isArmed
									? "bg-destructive text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground"
									: "text-destructive focus:text-destructive",
							)}
							onSelect={requestRemove}
						>
							<Trash2Icon aria-hidden="true" />
							{isArmed ? m.decks.removeConfirm : m.decks.remove}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="grid grid-cols-2 gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="border-foreground" variant="outline">
							<PlayIcon aria-hidden="true" className="size-4 fill-current" />
							{m.common.play}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className={menuClass}>
						{games.map((game) => (
							<DropdownMenuItem asChild className={itemClass} key={game.slug}>
								<Link
									params={{ lang: locale }}
									search={{ category }}
									to={game.setupTo}
								>
									<game.icon aria-hidden="true" />
									{m.games[game.slug].name}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<Button
					className="border-foreground bg-accent-cyan text-accent-ink hover:bg-accent-cyan/85 hover:text-accent-ink"
					onClick={onShare}
					variant="outline"
				>
					<QrCodeIcon aria-hidden="true" className="size-4" />
					{m.decks.share}
				</Button>
			</div>
		</li>
	);
};
