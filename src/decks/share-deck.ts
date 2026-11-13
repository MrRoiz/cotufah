import { z } from "zod";

import { type CustomDeck, MAX_NAME, wordsSchema } from "@/decks/custom-decks";
import { deflateText, inflateText } from "@/decks/deflate";

/** Past this width a QR stops scanning reliably on a phone camera. */
export const MAX_SHARE_URL = 1200;

const shareSchema = z.object({
	v: z.literal(1),
	i: z.string().min(1).max(64),
	n: z.string().trim().min(1).max(MAX_NAME),
	w: wordsSchema,
});

/** New links deflate the JSON first; links without this prefix are legacy. */
const COMPRESSED_PREFIX = "2.";

const bytesToBase64Url = (bytes: Uint8Array): string => {
	let binary = "";
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary)
		.replaceAll("+", "-")
		.replaceAll("/", "_")
		.replace(/=+$/, "");
};

const base64UrlToBytes = (value: string): Uint8Array => {
	const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/"));
	return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

/**
 * The whole deck travels in the link: no server, no account. JSON is deflated
 * before base64url so even a 60 x 40-character deck fits a QR (~330 chars).
 */
export const encodeDeck = async (deck: CustomDeck): Promise<string> => {
	const json = JSON.stringify({
		v: 1,
		i: deck.id,
		n: deck.name,
		w: deck.words,
	});
	return COMPRESSED_PREFIX + bytesToBase64Url(await deflateText(json));
};

export const decodeDeck = async (
	payload: string,
): Promise<CustomDeck | null> => {
	if (!payload || payload.length > MAX_SHARE_URL * 2) {
		return null;
	}
	try {
		const compressed = payload.startsWith(COMPRESSED_PREFIX);
		const bytes = base64UrlToBytes(
			compressed ? payload.slice(COMPRESSED_PREFIX.length) : payload,
		);
		// Old links shipped plain base64url JSON; keep them readable.
		const json = compressed
			? await inflateText(bytes)
			: new TextDecoder().decode(bytes);
		const parsed = shareSchema.safeParse(JSON.parse(json));
		if (!parsed.success) {
			return null;
		}
		return {
			id: parsed.data.i,
			name: parsed.data.n,
			words: parsed.data.w,
		};
	} catch {
		return null;
	}
};
