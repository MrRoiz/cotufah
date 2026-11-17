import { Undo2Icon } from "lucide-react";

import type { Locale } from "@/config/app";
import { getMessages, plural } from "@/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";

const ACTION_CLASS = "-mr-3 font-bold text-sm";

/**
 * "Players · 5 players" plus the list's one action: clear everyone, or, right
 * after clearing, undo in the same spot so it stays under the same thumb.
 */
export const PlayersHeader = ({
	lang,
	count,
	isUndoable,
	undoTimeLeft,
	onClear,
	onUndo,
}: {
	lang: Locale;
	count: number;
	isUndoable: boolean;
	/** 1 right after clearing, 0 when undo expires. */
	undoTimeLeft: number;
	onClear: () => void;
	onUndo: () => void;
}) => {
	const messages = getMessages(lang);
	const showsClear = !isUndoable && count > 1;

	return (
		<div className="flex min-h-12 items-center justify-between gap-3">
			<div className="flex items-baseline gap-2">
				<h2 className="font-bold text-lg">{messages.spy.playersTitle}</h2>
				<span className="font-bold text-muted-foreground text-sm">
					{plural(lang, count, messages.spy.playerCount)}
				</span>
			</div>

			{isUndoable ? (
				<Button
					className={cn(ACTION_CLASS, "relative")}
					onClick={onUndo}
					type="button"
					variant="ghost"
				>
					<Undo2Icon aria-hidden="true" className="size-4" />
					{messages.spy.undoClear}
					{/* The underline is the undo timer: it drains as the window closes. */}
					<span
						aria-hidden="true"
						className="absolute inset-x-5 bottom-2 h-0.75 overflow-hidden rounded-full bg-muted"
					>
						<span
							className="block h-full bg-foreground transition-[width] duration-100 ease-linear"
							style={{ width: `${undoTimeLeft * 100}%` }}
						/>
					</span>
				</Button>
			) : null}
			{showsClear ? (
				<Button
					className={cn(
						ACTION_CLASS,
						"text-muted-foreground underline underline-offset-4",
					)}
					onClick={onClear}
					type="button"
					variant="ghost"
				>
					{messages.spy.clearPlayers}
				</Button>
			) : null}
		</div>
	);
};
