import { CheckIcon, CopyIcon, Share2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import type { Messages } from "@/i18n";
import { Button } from "@/ui/button";

/** How long "Link copied" stays before the button reads "Copy link" again. */
const COPIED_MS = 2000;

/**
 * The two ways to send the link without the QR: copy it, or hand it to the
 * phone's own share menu. Only phones (and a few browsers) have that menu;
 * elsewhere copying is the one action and takes the full row.
 */
export const ShareActions = ({
	m,
	title,
	url,
	disabled,
}: {
	m: Messages;
	title: string;
	url: string;
	disabled: boolean;
}) => {
	const [copied, setCopied] = useState(false);
	const canShareNatively =
		typeof navigator !== "undefined" && typeof navigator.share === "function";

	useEffect(() => {
		if (!copied) {
			return;
		}
		const timer = setTimeout(() => setCopied(false), COPIED_MS);
		return () => clearTimeout(timer);
	}, [copied]);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
		} catch {
			// Clipboard blocked: the QR is still on screen.
		}
	};

	const shareNatively = async () => {
		try {
			await navigator.share({ title, url });
		} catch {
			// The player closed the share menu: nothing to undo.
		}
	};

	return (
		<div className="grid w-full auto-cols-fr grid-flow-col gap-2.5">
			<Button
				className="border-foreground"
				disabled={disabled}
				onClick={copy}
				size="lg"
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
			{canShareNatively ? (
				<Button
					disabled={disabled}
					onClick={shareNatively}
					size="lg"
					type="button"
					variant="sticker"
				>
					<Share2Icon aria-hidden="true" />
					{m.decks.shareNative}
				</Button>
			) : null}
		</div>
	);
};
