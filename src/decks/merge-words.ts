import { MAX_WORD, MAX_WORDS } from "@/decks/custom-decks";

/** Why a word was left out; the editor turns it into a message. */
export type WordProblem = "tooLong" | "taken" | "full";

/**
 * Adds candidate words to a deck, one rule for typing one word and pasting a
 * list: trimmed, not blank, at most `MAX_WORD` characters, no repeats (any
 * case) and never past `MAX_WORDS`. Returns the new list and the first
 * reason a candidate was skipped, so the screen can say why.
 */
export const mergeWords = (
	existing: string[],
	candidates: string[],
): { words: string[]; problem: WordProblem | null } => {
	const words = [...existing];
	const seen = new Set(existing.map((word) => word.toLocaleLowerCase()));
	let problem: WordProblem | null = null;

	for (const candidate of candidates) {
		const word = candidate.trim();
		if (!word) {
			continue;
		}

		const key = word.toLocaleLowerCase();
		const skipped: WordProblem | null =
			words.length >= MAX_WORDS
				? "full"
				: word.length > MAX_WORD
					? "tooLong"
					: seen.has(key)
						? "taken"
						: null;

		if (skipped) {
			problem ??= skipped;
			continue;
		}
		words.push(word);
		seen.add(key);
	}

	return { words, problem };
};

/** A pasted list: one word per line, or separated by commas. */
export const splitWordList = (text: string): string[] => text.split(/[\n,]/);
