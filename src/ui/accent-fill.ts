/** Complete Tailwind classes: they must stay literal for the scanner. */
const ACCENT_FILLS = [
	"bg-accent-cyan",
	"bg-accent-lime",
	"bg-accent-fuchsia",
] as const;

/** The accent fill for the item at `index` in a list that cycles the palette. */
export const accentFill = (index: number) =>
	ACCENT_FILLS[index % ACCENT_FILLS.length];
