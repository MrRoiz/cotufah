import { MinusIcon, PlusIcon } from "lucide-react";
import { clampSpyCount, maxSpies } from "@/games/spy/rules";
import type { Messages } from "@/i18n";
import { Button } from "@/ui/button";

/**
 * The spy counter. It reads the player count, so the stepper and the round
 * agree on how many liars are possible.
 */
export const SpyCountField = ({
	m,
	playerCount,
	spies,
	onChange,
}: {
	m: Messages;
	playerCount: number;
	spies: number;
	onChange: (value: number) => void;
}) => {
	const current = clampSpyCount(spies, playerCount);
	const max = maxSpies(playerCount);

	return (
		<section className="mt-8 flex flex-col gap-3">
			<h2 className="font-bold text-lg">{m.spy.spiesTitle}</h2>
			<p className="text-muted-foreground text-sm">{m.spy.spiesHint}</p>

			<div className="flex items-center gap-4 rounded-xl border-2 border-border p-3">
				<Button
					aria-label={m.spy.fewerSpies}
					disabled={current <= 1}
					onClick={() => onChange(clampSpyCount(current - 1, playerCount))}
					size="icon"
					type="button"
					variant="outline"
				>
					<MinusIcon aria-hidden="true" />
				</Button>
				<span className="flex-1 text-center font-display text-3xl">
					{current}
				</span>
				<Button
					aria-label={m.spy.moreSpies}
					disabled={current >= max}
					onClick={() => onChange(clampSpyCount(current + 1, playerCount))}
					size="icon"
					type="button"
					variant="outline"
				>
					<PlusIcon aria-hidden="true" />
				</Button>
			</div>
		</section>
	);
};
