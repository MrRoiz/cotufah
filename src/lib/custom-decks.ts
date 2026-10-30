import { z } from "zod";

import {
	CUSTOM_PREFIX,
	type CustomCategory,
	isCustomCategory,
} from "@/data/schema";
import { deflateText, inflateText } from "@/lib/deflate";

/** Brand-free key: a rename must not lose anyone's decks. */
const STORAGE_KEY = "app.decks";

export const MAX_DECKS = 20;
export const MIN_WORDS = 4;
export const MAX_WORDS = 60;
export const MAX_NAME = 40;
export const MAX_WORD = 40;
/** Past this width a QR stops scanning reliably on a phone camera. */
export const MAX_SHARE_URL = 1200;

export const customDeckSchema = z.object({
	id: z.string().min(1).max(64),
	name: z.string().trim().min(1).max(MAX_NAME),
	words: z
		.array(z.string().trim().min(1).max(MAX_WORD))
		.min(MIN_WORDS)
		.max(MAX_WORDS),
});

export type CustomDeck = z.infer<typeof customDeckSchema>;

export const customCategoryId = (id: string): CustomCategory =>
	`${CUSTOM_PREFIX}${id}`;

const deckIdFor = (category: CustomCategory): string =>
	category.slice(CUSTOM_PREFIX.length);

export const newDeckId = (): string =>
	typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const storage = (): Storage | null =>
	typeof window === "undefined" ? null : window.localStorage;

const EMPTY: CustomDeck[] = [];
let cached: CustomDeck[] | null = null;
const listeners = new Set<() => void>();

/** Invalidate the cache and let every mounted consumer re-render. */
const emit = () => {
	cached = null;
	for (const listener of listeners) {
		listener();
	}
};

/** Same-tab writes emit; other tabs arrive through the `storage` event. */
export const subscribeCustomDecks = (listener: () => void): (() => void) => {
	listeners.add(listener);
	if (listeners.size === 1) {
		window.addEventListener("storage", emit);
	}
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0) {
			window.removeEventListener("storage", emit);
		}
	};
};

export const getCustomDecksSnapshot = (): CustomDeck[] => {
	cached ??= readCustomDecks();
	return cached;
};

/** Stable empty array: the server has no decks and must not allocate one. */
export const getCustomDecksServerSnapshot = (): CustomDeck[] => EMPTY;

/**
 * Anything malformed in storage is skipped entry by entry: one bad deck must
 * not hide the rest, and a write after a partial loss would make it permanent.
 */
export const readCustomDecks = (): CustomDeck[] => {
	const store = storage();
	if (!store) {
		return [];
	}
	try {
		const raw = store.getItem(STORAGE_KEY);
		const entries = z.array(z.unknown()).safeParse(raw ? JSON.parse(raw) : []);
		if (!entries.success) {
			return [];
		}
		const decks: CustomDeck[] = [];
		for (const entry of entries.data) {
			const parsed = customDeckSchema.safeParse(entry);
			if (parsed.success) {
				decks.push(parsed.data);
			}
			if (decks.length === MAX_DECKS) {
				break;
			}
		}
		return decks;
	} catch {
		return [];
	}
};

/** `null` when the write landed; otherwise the screen explains why not. */
export type DeckWriteFailure = "limit" | "storage";

const writeDecks = (decks: CustomDeck[]): DeckWriteFailure | null => {
	const store = storage();
	if (!store) {
		return "storage";
	}
	try {
		store.setItem(STORAGE_KEY, JSON.stringify(decks));
	} catch {
		return "storage";
	}
	emit();
	return null;
};

export const saveCustomDeck = (deck: CustomDeck): DeckWriteFailure | null => {
	const decks = readCustomDecks();
	const exists = decks.some((candidate) => candidate.id === deck.id);
	// Refuse at the cap instead of silently dropping someone else's deck.
	if (!exists && decks.length >= MAX_DECKS) {
		return "limit";
	}
	return writeDecks(
		exists
			? decks.map((candidate) => (candidate.id === deck.id ? deck : candidate))
			: [deck, ...decks],
	);
};

export const removeCustomDeck = (id: string): DeckWriteFailure | null =>
	writeDecks(readCustomDecks().filter((deck) => deck.id !== id));

export const findCustomDeck = (category: string): CustomDeck | undefined => {
	if (!isCustomCategory(category)) {
		return undefined;
	}
	const id = deckIdFor(category);
	return getCustomDecksSnapshot().find((deck) => deck.id === id);
};

const shareSchema = z.object({
	v: z.literal(1),
	i: z.string().min(1).max(64),
	n: z.string().trim().min(1).max(MAX_NAME),
	w: z
		.array(z.string().trim().min(1).max(MAX_WORD))
		.min(MIN_WORDS)
		.max(MAX_WORDS),
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
