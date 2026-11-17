import { CheckIcon } from "lucide-react";

import { PlayerAvatar } from "@/games/components/player-avatar";
import { interpolate, type Messages } from "@/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";

export const VotePanel = ({
	messages,
	players,
	accused,
	accusedName,
	onAccuse,
	onReveal,
}: {
	messages: Messages;
	players: string[];
	accused: number | null;
	accusedName: string;
	onAccuse: (index: number) => void;
	onReveal: () => void;
}) => {
	return (
		<section className="flex flex-1 flex-col gap-6">
			<div className="flex flex-col gap-1.5">
				<h1 className="font-display font-extrabold text-4xl uppercase leading-none">
					{messages.spy.voteTitle}
				</h1>
				<p className="text-muted-foreground">{messages.spy.voteBody}</p>
			</div>

			<ul className="grid grid-cols-2 gap-3">
				{players.map((name, seat) => {
					const isSelected = accused === seat;
					return (
						<li className="min-w-0" key={name}>
							<button
								aria-pressed={isSelected}
								className={cn(
									"relative flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 px-2 transition-colors",
									isSelected
										? "border-foreground bg-accent-lime text-accent-ink shadow-sticker"
										: "border-border bg-card",
								)}
								onClick={() => onAccuse(seat)}
								type="button"
							>
								{isSelected ? (
									<span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-accent-ink text-accent-lime">
										<CheckIcon
											aria-hidden="true"
											className="size-4"
											strokeWidth={3}
										/>
									</span>
								) : null}
								<PlayerAvatar
									className="size-11 text-lg"
									name={name}
									seat={seat}
								/>
								<span className="w-full truncate text-center font-bold">
									{name}
								</span>
							</button>
						</li>
					);
				})}
			</ul>

			<div className="mt-auto">
				{accused === null ? (
					<Button
						className="w-full border-dashed"
						disabled
						size="lg"
						variant="outline"
					>
						{messages.spy.pickFirst}
					</Button>
				) : (
					<Button
						className="w-full"
						onClick={onReveal}
						size="lg"
						variant="sticker"
					>
						<span className="truncate">
							{interpolate(messages.spy.revealAccused, { name: accusedName })}
						</span>
					</Button>
				)}
			</div>
		</section>
	);
};
