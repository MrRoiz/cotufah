import { RotateCcwIcon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Messages } from "@/i18n/en";

export const RevealPanel = ({
	m,
	caught,
	spyList,
	spyCount,
	word,
	isFetching,
	onAgain,
	onChangePlayers,
}: {
	m: Messages;
	caught: boolean;
	spyList: string;
	spyCount: number;
	word: string;
	isFetching: boolean;
	onAgain: () => void;
	onChangePlayers: () => void;
}) => {
	return (
		<section className="flex flex-1 flex-col justify-center gap-5">
			<h1 className="text-center font-display text-4xl uppercase leading-tight">
				{caught ? m.spy.caught : m.spy.escaped}
			</h1>

			<div className="flex flex-col gap-3">
				<div className="rounded-xl border-2 border-foreground bg-accent-fuchsia px-4 py-3 text-accent-ink">
					<span className="font-bold text-xs uppercase tracking-widest opacity-75">
						{spyCount === 1 ? m.spy.spyLabelOne : m.spy.spyLabelMany}
					</span>
					<p className="font-display text-3xl uppercase leading-tight">
						{spyList}
					</p>
				</div>

				<div className="rounded-xl border-2 border-foreground bg-card px-4 py-3">
					<span className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
						{m.spy.theWordWas}
					</span>
					<p className="font-display text-3xl uppercase leading-tight">
						{word}
					</p>
				</div>
			</div>

			<div className="mt-2 flex w-full flex-col gap-2">
				<Button
					disabled={isFetching}
					onClick={onAgain}
					size="lg"
					variant="sticker"
				>
					<RotateCcwIcon aria-hidden="true" />
					{m.spy.again}
				</Button>
				<Button onClick={onChangePlayers} variant="outline">
					<UsersIcon aria-hidden="true" />
					{m.spy.changePlayers}
				</Button>
			</div>
		</section>
	);
};
