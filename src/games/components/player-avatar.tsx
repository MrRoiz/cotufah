import { cn } from "@/lib/utils";

/**
 * One fill per seat, by position: a player keeps the same colour from the
 * setup chips to the vote grid and the reveal. Literal classes for Tailwind.
 */
const seatFills = [
	"bg-accent-cyan text-accent-ink",
	"bg-accent-lime text-accent-ink",
	"bg-accent-fuchsia text-accent-ink",
	"bg-secondary text-secondary-foreground",
] as const;

/** Decorative initial bubble; the name is always written next to it. */
export const PlayerAvatar = ({
	name,
	seat,
	className,
}: {
	name: string;
	seat: number;
	className?: string;
}) => (
	<span
		aria-hidden="true"
		className={cn(
			"flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-foreground font-extrabold text-sm uppercase",
			seatFills[seat % seatFills.length],
			className,
		)}
	>
		{Array.from(name)[0] ?? ""}
	</span>
);
