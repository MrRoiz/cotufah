import { RotateCcwIcon, SettingsIcon } from "lucide-react";

import type { Messages } from "@/i18n";
import { Button } from "@/ui/button";

/** Score, the words that were guessed or skipped, and the one left on screen. */
export const CharadesResults = ({
	m,
	correctWords,
	passedWords,
	correctCount,
	finished,
	isFetching,
	pendingWord,
	onAgain,
	onChangeSettings,
}: {
	m: Messages;
	correctWords: string[];
	passedWords: string[];
	correctCount: number;
	finished: boolean;
	isFetching: boolean;
	pendingWord: string | null;
	onAgain: () => void;
	onChangeSettings: () => void;
}) => {
	return (
		<section className="flex flex-1 flex-col justify-center gap-5">
			<div className="flex flex-col items-center gap-1 text-center">
				<h1 className="font-display text-3xl uppercase">
					{finished ? m.charades.wordsLeft : m.charades.resultsTitle}
				</h1>
				<span className="font-display text-6xl">{correctCount}</span>
			</div>

			{pendingWord ? (
				<div className="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-foreground bg-card px-4 py-3 text-center shadow-sticker-sm">
					<h2 className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
						{m.charades.resultsFinal}
					</h2>
					<span className="font-display text-2xl uppercase leading-none">
						{pendingWord}
					</span>
				</div>
			) : null}

			<div className="flex flex-col gap-2">
				<h2 className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
					{m.charades.resultsCorrect}
				</h2>
				<ul className="flex flex-wrap gap-2">
					{correctWords.map((word) => (
						<li
							className="rounded-full border-2 border-foreground bg-accent-lime px-3 py-1 font-bold text-accent-ink text-sm"
							key={word}
						>
							{word}
						</li>
					))}
				</ul>

				<h2 className="mt-2 font-bold text-muted-foreground text-xs uppercase tracking-widest">
					{m.charades.resultsPassed}
				</h2>
				<ul className="flex flex-wrap gap-2">
					{passedWords.map((word) => (
						<li
							className="rounded-full border-2 border-border px-3 py-1 text-muted-foreground text-sm"
							key={word}
						>
							{word}
						</li>
					))}
				</ul>
			</div>

			<div className="mt-2 flex w-full flex-col gap-2">
				<Button
					disabled={isFetching}
					onClick={onAgain}
					size="lg"
					variant="sticker"
				>
					<RotateCcwIcon aria-hidden="true" />
					{m.charades.again}
				</Button>
				<Button onClick={onChangeSettings} variant="outline">
					<SettingsIcon aria-hidden="true" />
					{m.charades.changeSettings}
				</Button>
			</div>
		</section>
	);
};
