import { PencilIcon, Share2Icon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import { ShareDeckSheet } from "@/components/custom-decks/share-deck-sheet";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Locale } from "@/config/app";
import { getMessages, plural } from "@/i18n";
import type { CustomDeck, DeckWriteFailure } from "@/lib/custom-decks";

/** Two taps must land close together; the armed trash disarms itself. */
const CONFIRM_TIMEOUT_MS = 2500;

export const DeckList = ({
	decks,
	locale,
	onEdit,
	onRemove,
}: {
	decks: CustomDeck[];
	locale: Locale;
	onEdit: (deck: CustomDeck) => void;
	onRemove: (id: string) => DeckWriteFailure | null;
}) => {
	const m = getMessages(locale);
	const [sharingId, setSharingId] = useState<string | null>(null);
	const [confirmingId, setConfirmingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const sharing = decks.find((deck) => deck.id === sharingId);

	// The armed trash disarms itself, so a tap made seconds later can't delete.
	useEffect(() => {
		if (!confirmingId) {
			return;
		}
		const timer = setTimeout(() => setConfirmingId(null), CONFIRM_TIMEOUT_MS);
		return () => clearTimeout(timer);
	}, [confirmingId]);

	const requestRemove = (id: string) => {
		if (confirmingId !== id) {
			setConfirmingId(id);
			return;
		}
		setError(onRemove(id) ? m.decks.removeError : null);
		setConfirmingId(null);
	};

	return (
		<TooltipProvider>
			<div className="flex flex-col gap-3">
				{decks.map((deck) => (
					<div
						className="rounded-xl border-2 border-foreground bg-card p-4 shadow-sticker-sm"
						key={deck.id}
					>
						<div className="flex items-center justify-between gap-3">
							<div className="min-w-0">
								<p className="break-words font-bold">{deck.name}</p>
								<p className="text-muted-foreground text-xs">
									{plural(locale, deck.words.length, m.decks.wordCount)}
								</p>
							</div>
							<div className="flex shrink-0 items-center gap-2">
								<Button
									aria-label={m.decks.edit}
									className="border-accent-lime bg-accent-lime/20 hover:bg-accent-lime/30"
									onClick={() => {
										setConfirmingId(null);
										onEdit(deck);
									}}
									size="icon"
									type="button"
									variant="outline"
								>
									<PencilIcon aria-hidden="true" />
								</Button>
								<Button
									aria-label={m.decks.share}
									className="border-accent-cyan bg-accent-cyan/20 hover:bg-accent-cyan/30"
									onClick={() => {
										setConfirmingId(null);
										setSharingId(deck.id);
									}}
									size="icon"
									type="button"
									variant="outline"
								>
									<Share2Icon aria-hidden="true" />
								</Button>
								<span className="relative">
									<Tooltip open={confirmingId === deck.id}>
										<TooltipTrigger asChild>
											<Button
												aria-label={
													confirmingId === deck.id
														? m.decks.removeConfirm
														: m.decks.remove
												}
												className={
													confirmingId === deck.id
														? "border-foreground bg-destructive text-destructive-foreground hover:bg-destructive/90"
														: "border-destructive/70 bg-destructive/10 text-destructive hover:bg-destructive/20"
												}
												onClick={() => requestRemove(deck.id)}
												size="icon"
												type="button"
												variant="outline"
											>
												<Trash2Icon aria-hidden="true" />
											</Button>
										</TooltipTrigger>
										<TooltipContent align="end" side="top" sideOffset={6}>
											{m.decks.removeConfirm}
										</TooltipContent>
									</Tooltip>
								</span>
							</div>
						</div>
					</div>
				))}

				{error ? (
					<p className="font-bold text-destructive text-sm" role="alert">
						{error}
					</p>
				) : null}

				{sharing ? (
					<ShareDeckSheet
						deck={sharing}
						locale={locale}
						onOpenChange={(open) => setSharingId(open ? sharing.id : null)}
						open
					/>
				) : null}
			</div>
		</TooltipProvider>
	);
};
