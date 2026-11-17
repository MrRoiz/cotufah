import { ClockIcon, FingerprintIcon } from "lucide-react";
import type { Messages } from "@/i18n";
import { Button } from "@/ui/button";

/**
 * Pass-the-phone role card. The surface is identical for spy and word: only the
 * ink changes, so the screen's glow cannot give the spy away in a dark room.
 * The play screen also renders this phase in the dark tokens for that reason.
 */
export const DealPanel = ({
	messages,
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
	messages: Messages;
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
		<section className="flex flex-1 flex-col gap-4">
			{waiting ? (
				<div className="flex flex-1 items-center justify-center">
					<ClockIcon
						aria-hidden="true"
						className="size-8 animate-pulse text-muted-foreground"
					/>
				</div>
			) : (
				<button
					className="relative flex min-h-[22rem] flex-1 touch-none select-none flex-col items-center justify-center gap-5 rounded-[2rem] border-2 border-foreground bg-card p-6 pt-20 text-center shadow-sticker"
					onContextMenu={(event) => event.preventDefault()}
					onPointerCancel={onHoldEnd}
					onPointerDown={onHoldStart}
					onPointerLeave={onHoldEnd}
					onPointerUp={onHoldEnd}
					type="button"
				>
					<span className="absolute inset-x-6 top-6 flex justify-center">
						<span className="max-w-full truncate rounded-full border-2 border-accent-ink bg-accent-cyan px-5 py-1 font-display font-extrabold text-2xl text-accent-ink uppercase leading-tight">
							{player}
						</span>
					</span>

					{revealed ? (
						isSpy ? (
							<>
								<span className="font-display font-extrabold text-4xl text-accent-fuchsia uppercase leading-none">
									{messages.spy.youAreSpy}
								</span>
								<span className="text-muted-foreground">
									{messages.spy.spyHint}
								</span>
							</>
						) : (
							<>
								<span className="font-extrabold text-muted-foreground text-xs uppercase tracking-widest">
									{messages.spy.yourWord}
								</span>
								<span className="max-w-full break-words font-display font-extrabold text-5xl uppercase leading-none">
									{word}
								</span>
							</>
						)
					) : (
						<>
							<span className="flex size-28 items-center justify-center rounded-full border-2 border-muted-foreground border-dashed">
								<FingerprintIcon
									aria-hidden="true"
									className="size-14 text-accent-lime"
									strokeWidth={1.5}
								/>
							</span>
							<span className="flex flex-col gap-1">
								<span className="font-extrabold text-2xl">
									{messages.spy.holdTitle}
								</span>
								<span className="text-muted-foreground">
									{messages.spy.holdHint}
								</span>
							</span>
						</>
					)}
				</button>
			)}

			<p className="text-center text-muted-foreground text-sm">
				{messages.spy.dealBody}
			</p>

			<Button
				className="w-full"
				disabled={!peeked}
				onClick={onNext}
				size="lg"
				variant={peeked ? "sticker" : "outline"}
			>
				{position >= total ? messages.spy.startDiscussion : messages.spy.next}
			</Button>
		</section>
	);
};
