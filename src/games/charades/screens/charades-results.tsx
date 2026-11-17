import { CheckIcon, RotateCcwIcon, SettingsIcon, XIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { getMessages, interpolate, plural } from "@/i18n";
import { Button } from "@/ui/button";

/** Score, the words that were guessed or skipped, and the one left on screen. */
export const CharadesResults = ({
	lang,
	correctWords,
	passedWords,
	finished,
	isFetching,
	pendingWord,
	onAgain,
	onChangeSettings,
}: {
	lang: Locale;
	correctWords: string[];
	passedWords: string[];
	finished: boolean;
	isFetching: boolean;
	pendingWord: string | null;
	onAgain: () => void;
	onChangeSettings: () => void;
}) => {
	const messages = getMessages(lang);
	const answered = correctWords.length + passedWords.length;

	return (
		<section className="flex flex-1 flex-col gap-5 pt-4">
			<h1 className="font-display font-extrabold text-3xl uppercase leading-none">
				{finished
					? messages.charades.wordsLeft
					: messages.charades.resultsTitle}
			</h1>

			{/* Number and label read as one phrase: "2 correct, out of 3 words". */}
			<div className="flex items-center gap-4">
				<span className="flex size-24 shrink-0 -rotate-3 items-center justify-center rounded-full border-2 border-foreground bg-accent-lime font-display font-extrabold text-5xl text-accent-ink tabular-nums shadow-sticker">
					{correctWords.length}
				</span>
				<p className="flex flex-col">
					<span className="font-display font-extrabold text-2xl leading-tight">
						{plural(lang, correctWords.length, messages.charades.scoreLabel)}
					</span>
					<span className="text-muted-foreground">
						{interpolate(messages.charades.scoreOf, { total: answered })}
					</span>
				</p>
			</div>

			{/* The word cut off by the clock belongs with the score, before the lists. */}
			{pendingWord ? (
				<div className="flex flex-col gap-0.5 rounded-xl border-2 border-foreground border-dashed px-4 py-3">
					<span className="font-bold text-muted-foreground text-sm">
						{messages.charades.resultsFinal}
					</span>
					<span className="break-words font-display font-extrabold text-xl uppercase leading-tight">
						{pendingWord}
					</span>
				</div>
			) : null}

			{correctWords.length > 0 ? (
				<section className="flex flex-col gap-2.5">
					<h2 className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-widest">
						<CheckIcon aria-hidden="true" className="size-4" strokeWidth={3} />
						{`${messages.charades.resultsCorrect} · ${correctWords.length}`}
					</h2>
					<ul className="flex flex-wrap gap-2">
						{correctWords.map((word) => (
							<li
								className="rounded-full border-2 border-foreground bg-accent-lime px-3 py-1 font-extrabold text-accent-ink"
								key={word}
							>
								{word}
							</li>
						))}
					</ul>
				</section>
			) : null}

			{passedWords.length > 0 ? (
				<section className="flex flex-col gap-2.5">
					<h2 className="flex items-center gap-2 font-extrabold text-muted-foreground text-xs uppercase tracking-widest">
						<XIcon aria-hidden="true" className="size-4" strokeWidth={3} />
						{`${messages.charades.resultsPassed} · ${passedWords.length}`}
					</h2>
					<ul className="flex flex-wrap gap-2">
						{passedWords.map((word) => (
							<li
								className="rounded-full border-2 border-input bg-card px-3 py-1 font-bold text-muted-foreground"
								key={word}
							>
								{word}
							</li>
						))}
					</ul>
				</section>
			) : null}

			<div className="mt-auto flex flex-col gap-2">
				<Button
					disabled={isFetching}
					onClick={onAgain}
					size="lg"
					variant="sticker"
				>
					<RotateCcwIcon aria-hidden="true" />
					{messages.charades.again}
				</Button>
				<Button
					className="border-foreground"
					onClick={onChangeSettings}
					variant="outline"
				>
					<SettingsIcon aria-hidden="true" />
					{messages.charades.changeSettings}
				</Button>
			</div>
		</section>
	);
};
