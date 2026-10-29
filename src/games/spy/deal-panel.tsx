import { CheckIcon, ClockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Messages } from "@/i18n/en";

/**
 * Pass-the-phone role card. The surface is identical for spy and word: only the
 * ink changes, so the screen's glow cannot give the spy away in a dark room.
 */
export const DealPanel = ({
	m,
	player,
	position,
	total,
	word,
	waiting,
	isSpy,
	revealed,
	peeked,
	onHoldStart,
	onHoldEnd,
	onNext,
}: {
	m: Messages;
	player: string;
	position: number;
	total: number;
	word: string;
	waiting: boolean;
	isSpy: boolean;
	revealed: boolean;
	peeked: boolean;
	onHoldStart: () => void;
	onHoldEnd: () => void;
	onNext: () => void;
}) => {
	return (
		<section className="flex flex-1 flex-col gap-4 pt-4">
			{waiting ? (
				<div className="flex flex-1 items-center justify-center">
					<ClockIcon
						aria-hidden="true"
						className="size-8 animate-pulse text-muted-foreground"
					/>
				</div>
			) : (
				<button
					className="relative flex min-h-[18rem] flex-1 touch-none select-none flex-col items-center justify-center gap-5 rounded-2xl border-2 border-foreground bg-card p-6 text-center"
					onContextMenu={(event) => event.preventDefault()}
					onPointerCancel={onHoldEnd}
					onPointerDown={onHoldStart}
					onPointerLeave={onHoldEnd}
					onPointerUp={onHoldEnd}
					type="button"
				>
					<span className="absolute inset-x-0 top-5 text-center font-bold text-muted-foreground text-xs uppercase tracking-widest">
						{position} / {total}
					</span>

					<span className="max-w-full truncate rounded-full border-2 border-foreground bg-accent-cyan px-4 py-1 font-display text-2xl text-accent-ink uppercase leading-tight">
						{player}
					</span>

					{revealed ? (
						isSpy ? (
							<>
								<span className="font-display text-3xl text-accent-fuchsia uppercase">
									{m.spy.youAreSpy}
								</span>
								<span className="text-muted-foreground text-sm">
									{m.spy.spyHint}
								</span>
							</>
						) : (
							<>
								<span className="font-bold text-sm uppercase tracking-widest">
									{m.spy.yourWord}
								</span>
								<span className="font-display text-4xl uppercase">{word}</span>
							</>
						)
					) : (
						<span className="font-bold text-lg">{m.spy.holdToSee}</span>
					)}
				</button>
			)}

			<p className="text-center text-muted-foreground text-sm">
				{m.spy.dealBody}
			</p>

			<Button
				disabled={!peeked}
				onClick={onNext}
				size="lg"
				variant={peeked ? "sticker" : "outline"}
			>
				<CheckIcon aria-hidden="true" />
				{position >= total ? m.spy.startDiscussion : m.spy.next}
			</Button>
		</section>
	);
};
