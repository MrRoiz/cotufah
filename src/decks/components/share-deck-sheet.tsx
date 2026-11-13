import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/config/app";
import type { CustomDeck } from "@/decks/custom-decks";
import { encodeDeck, MAX_SHARE_URL } from "@/decks/share-deck";
import { getMessages, interpolate, localizedPath } from "@/i18n";
import { Button } from "@/ui/button";
import { QrCode } from "@/ui/qr-code";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/ui/sheet";
import { useAbsoluteUrl } from "@/ui/use-absolute-url";

/**
 * The deck travels inside the URL, so the other phone needs no account: scan,
 * it lands on /decks/import, the player confirms, the words are stored locally and the QR is never needed
 * again.
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
	const m = getMessages(locale);
	// Encoding is async (deflate stream), so the link lands in an effect.
	const [path, setPath] = useState("");
	const [copied, setCopied] = useState(false);
	const copyTimer = useRef<number | null>(null);

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

	useEffect(
		() => () => {
			if (copyTimer.current !== null) {
				window.clearTimeout(copyTimer.current);
			}
		},
		[],
	);

	// Measured after mount: the origin is not known during SSR.
	const url = useAbsoluteUrl(path);
	const ready = path.length > 0;
	const tooLong = ready && url.length > MAX_SHARE_URL;

	const copy = async () => {
		if (!ready || !url) {
			return;
		}
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard blocked: the QR is still on screen.
		}
	};

	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent className="max-h-[85dvh] overflow-y-auto" side="bottom">
				<SheetHeader>
					<SheetTitle className="font-display text-xl uppercase">
						{interpolate(m.decks.shareTitle, { name: deck.name })}
					</SheetTitle>
					<SheetDescription>{m.decks.shareBody}</SheetDescription>
				</SheetHeader>

				<div className="flex flex-col items-center gap-4 px-4 pb-6">
					{!ready ? (
						<div className="size-60" />
					) : tooLong ? (
						<p className="text-center text-muted-foreground text-sm">
							{m.decks.shareTooBig}
						</p>
					) : (
						<QrCode
							alt={interpolate(m.decks.shareTitle, { name: deck.name })}
							className="size-60 rounded-xl"
							path={path}
						/>
					)}
					<Button
						className="w-full"
						disabled={!ready || tooLong}
						onClick={copy}
						type="button"
						variant="outline"
					>
						{copied ? (
							<CheckIcon aria-hidden="true" />
						) : (
							<CopyIcon aria-hidden="true" />
						)}
						{copied ? m.decks.copied : m.decks.copy}
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
};
