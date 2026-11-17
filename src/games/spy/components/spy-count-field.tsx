import { MinusIcon, PlusIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { clampSpyCount, MIN_PLAYERS, maxSpies } from "@/games/spy/rules";
import { getMessages, interpolate, plural } from "@/i18n";
import { Button } from "@/ui/button";

/**
 * The spy counter. It reads the player count, so the stepper and the round
 * agree on how many liars are possible, and says it out loud ("1 of 5").
 */
export const SpyCountField = ({
	lang,
	playerCount,
	spies,
	onChange,
}: {
	lang: Locale;
	playerCount: number;
	spies: number;
	onChange: (value: number) => void;
}) => {
	const m = getMessages(lang);
	const current = clampSpyCount(spies, playerCount);
	const max = maxSpies(playerCount);
	// "1 of 0 is lying" reads as a bug; the ratio only shows once a round exists.
	const hasRound = playerCount >= MIN_PLAYERS;
	const hint = interpolate(plural(lang, current, m.spy.spiesOf), {
		total: playerCount,
	});

	return (
		<section className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-card py-3 pr-3 pl-4">
			<div className="flex flex-col">
				<h2 className="font-bold text-lg">{m.spy.spiesTitle}</h2>
				{hasRound ? (
					<p className="text-muted-foreground text-sm">{hint}</p>
				) : null}
			</div>

			<div className="flex items-center gap-1">
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
				<span
					aria-live="polite"
					className="w-9 text-center font-display font-extrabold text-3xl tabular-nums"
				>
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
