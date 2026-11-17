import { XIcon } from "lucide-react";

import { interpolate, type Messages } from "@/i18n";

/** A deck's words as removable chips; renders nothing for an empty deck. */
export const WordChips = ({
	m,
	words,
	onRemove,
}: {
	m: Messages;
	words: string[];
	onRemove: (index: number) => void;
}) => {
	if (words.length === 0) {
		return null;
	}

	return (
		<ul className="flex flex-wrap gap-2">
			{words.map((word, index) => (
				<li
					className="flex max-w-full items-center rounded-full border-2 border-foreground bg-card pl-4"
					key={word}
				>
					<span className="truncate font-bold">{word}</span>
					<button
						aria-label={interpolate(m.decks.removeWord, { word })}
						className="flex size-12 shrink-0 items-center justify-center rounded-full"
						onClick={() => onRemove(index)}
						type="button"
					>
						<XIcon aria-hidden="true" className="size-4" />
					</button>
				</li>
			))}
		</ul>
	);
};
