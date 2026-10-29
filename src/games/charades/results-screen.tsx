import { RotateCcwIcon, SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Messages } from "@/i18n/en";

export type CharadesAnswer = { word: string; correct: boolean };

/** Score plus the words that were guessed and skipped. */
export const CharadesResults = ({
	m,
	answers,
	correctCount,
	finished,
	isFetching,
	onAgain,
	onChangeSettings,
}: {
	m: Messages;
	answers: CharadesAnswer[];
	correctCount: number;
	finished: boolean;
	isFetching: boolean;
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

			<div className="flex flex-col gap-2">
				<h2 className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
					{m.charades.resultsCorrect}
				</h2>
				<ul className="flex flex-wrap gap-2">
					{answers
						.filter((entry) => entry.correct)
						.map((entry) => (
							<li
								className="rounded-full border-2 border-foreground bg-accent-lime px-3 py-1 font-bold text-accent-ink text-sm"
								key={entry.word}
							>
								{entry.word}
							</li>
						))}
				</ul>

				<h2 className="mt-2 font-bold text-muted-foreground text-xs uppercase tracking-widest">
					{m.charades.resultsPassed}
				</h2>
				<ul className="flex flex-wrap gap-2">
					{answers
						.filter((entry) => !entry.correct)
						.map((entry) => (
							<li
								className="rounded-full border-2 border-border px-3 py-1 text-muted-foreground text-sm"
								key={entry.word}
							>
								{entry.word}
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
