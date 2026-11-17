import { useEffect, useState } from "react";
import type { Locale } from "@/config/app";
import { ShareActions } from "@/decks/components/share-actions";
import { ShareSteps } from "@/decks/components/share-steps";
import type { CustomDeck } from "@/decks/custom-decks";
import { encodeDeck, MAX_SHARE_URL } from "@/decks/share-deck";
import { getMessages, interpolate, localizedPath, plural } from "@/i18n";
import { QrCode } from "@/ui/qr-code";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/ui/sheet";
import { useAbsoluteUrl } from "@/ui/use-absolute-url";

const PREVIEW_WORDS = 3;

/**
 * The deck travels inside the URL, so the other phone needs no account: scan,
 * it lands on /decks/import, the player confirms, the words are stored locally
 * and the QR is never needed again.
 */
export const ShareDeckSheet = ({
	deck,
	locale,
	open,
	onOpenChange,
}: {
	deck: CustomDeck;
	locale: Locale;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const messages = getMessages(locale);
	// Encoding is async (deflate stream), so the link lands in an effect.
	const [path, setPath] = useState("");

	useEffect(() => {
		let cancelled = false;
		encodeDeck(deck).then((payload) => {
			if (!cancelled) {
				setPath(localizedPath(locale, `decks/import?d=${payload}`));
			}
		});
		return () => {
			cancelled = true;
		};
	}, [deck, locale]);

	// Measured after mount: the origin is not known during SSR.
	const url = useAbsoluteUrl(path);
	const ready = path.length > 0 && url.length > 0;
	const tooLong = ready && url.length > MAX_SHARE_URL;
	const preview = deck.words.slice(0, PREVIEW_WORDS).join(", ");

	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent className="max-h-[90dvh] overflow-y-auto" side="bottom">
				<SheetHeader>
					<span className="font-extrabold text-muted-foreground text-xs uppercase tracking-widest">
						{messages.decks.shareKicker}
					</span>
					<SheetTitle className="font-display font-extrabold text-2xl leading-none">
						{deck.name}
					</SheetTitle>
					<SheetDescription>
						{`${plural(locale, deck.words.length, messages.decks.wordCount)} · ${preview}…`}
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-col items-center gap-5 px-4 pb-6">
					<div className="flex flex-col items-center gap-2 rounded-xl border-2 border-foreground bg-qr-paper p-4 text-accent-ink shadow-sticker">
						{!ready ? (
							<div className="size-60" />
						) : tooLong ? (
							<p className="max-w-60 py-6 text-center text-sm">
								{messages.decks.shareTooBig}
							</p>
						) : (
							<QrCode
								alt={interpolate(messages.decks.shareTitle, {
									name: deck.name,
								})}
								className="size-60"
								path={path}
							/>
						)}
					</div>

					<ShareSteps steps={messages.decks.shareSteps} />

					<ShareActions
						disabled={!ready || tooLong}
						messages={messages}
						title={deck.name}
						url={url}
					/>

					<p className="text-center text-muted-foreground text-sm">
						{messages.decks.sharePrivacy}
					</p>
				</div>
			</SheetContent>
		</Sheet>
	);
};
