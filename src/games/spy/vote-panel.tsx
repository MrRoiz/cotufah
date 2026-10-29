import { Button } from "@/components/ui/button";
import type { Messages } from "@/i18n/en";
import { cn } from "@/lib/utils";

export const VotePanel = ({
	m,
	players,
	accused,
	onAccuse,
	onReveal,
}: {
	m: Messages;
	players: string[];
	accused: number | null;
	onAccuse: (index: number) => void;
	onReveal: () => void;
}) => {
	return (
		<section className="flex flex-1 flex-col justify-center gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-display text-3xl uppercase">{m.spy.voteTitle}</h1>
				<p className="text-muted-foreground text-sm">{m.spy.voteBody}</p>
			</div>

			<ul className="flex flex-wrap justify-center gap-3">
				{players.map((name, playerIndex) => {
					const selected = accused === playerIndex;
					return (
						<li className="w-[calc(50%-0.375rem)]" key={name}>
							<button
								aria-pressed={selected}
								className={cn(
									"flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 px-2 py-3 transition-colors",
									selected
										? "border-foreground bg-accent-lime text-accent-ink shadow-sticker-sm"
										: "border-border bg-card",
								)}
								onClick={() => onAccuse(playerIndex)}
								type="button"
							>
								<span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-current font-display text-xl uppercase">
									{name.slice(0, 1)}
								</span>
								<span className="w-full truncate text-center font-bold text-sm">
									{name}
								</span>
							</button>
						</li>
					);
				})}
			</ul>

			<Button
				className="w-full"
				disabled={accused === null}
				onClick={onReveal}
				size="lg"
				variant="sticker"
			>
				{m.spy.reveal}
			</Button>
		</section>
	);
};
