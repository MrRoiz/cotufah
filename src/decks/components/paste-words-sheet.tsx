import { useState } from "react";

import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";
import { Button } from "@/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/ui/sheet";

/**
 * Bulk entry for a list that already exists somewhere else. A textarea rather
 * than reading the clipboard: it needs no permission prompt and works on
 * every phone.
 */
export const PasteWordsSheet = ({
	locale,
	open,
	onOpenChange,
	onPaste,
}: {
	locale: Locale;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onPaste: (text: string) => void;
}) => {
	const m = getMessages(locale);
	const [text, setText] = useState("");

	// Always close: if some words were skipped, the reason shows on the form,
	// which a sheet left open would hide.
	const submit = () => {
		onPaste(text);
		setText("");
		onOpenChange(false);
	};

	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent className="max-h-[85dvh] overflow-y-auto" side="bottom">
				<SheetHeader>
					<SheetTitle className="font-display text-xl uppercase">
						{m.decks.pasteTitle}
					</SheetTitle>
					<SheetDescription>{m.decks.pasteBody}</SheetDescription>
				</SheetHeader>

				<div className="flex flex-col gap-3 px-4 pb-6">
					<label className="sr-only" htmlFor="paste-words">
						{m.decks.wordsLabel}
					</label>
					<textarea
						className="min-h-48 w-full rounded-xl border-2 border-input bg-card px-4 py-3 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
						id="paste-words"
						onChange={(event) => setText(event.target.value)}
						placeholder={m.decks.wordsPlaceholder}
						value={text}
					/>
					<Button
						disabled={!text.trim()}
						onClick={submit}
						size="lg"
						type="button"
						variant="sticker"
					>
						{m.decks.pasteAdd}
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
};
