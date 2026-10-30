import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { QrCode, useAbsoluteUrl } from "@/components/qr-code";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { Locale } from "@/config/app";
import { getMessages, interpolate } from "@/i18n";
import { type CustomDeck, encodeDeck, MAX_SHARE_URL } from "@/lib/custom-decks";

/**
 * The deck travels inside the URL, so the other phone needs no account: scan,
 * it lands on /decks/import, the words are stored locally and the QR is never needed
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

	useEffect(() => {
		let cancelled = false;
		encodeDeck(deck).then((payload) => {
			if (!cancelled) {
				setPath(`/${locale}/decks/import?d=${payload}`);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [deck, locale]);

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
			setTimeout(() => setCopied(false), 2000);
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
							className="rounded-xl"
							path={path}
							size={240}
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
