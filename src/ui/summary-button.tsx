import { Button } from "@/ui/button";

/**
 * A screen's main action with a second line that says what is about to
 * happen ("5 players · 1 spy · Mixed", "6 words · Animals") or what
 * is still missing.
 */
export const SummaryButton = ({
	label,
	summary,
	disabled = false,
	onClick,
}: {
	label: string;
	summary: string;
	disabled?: boolean;
	onClick: () => void;
}) => (
	<Button
		className="h-auto min-h-16 w-full flex-col gap-0 rounded-xl py-2"
		disabled={disabled}
		onClick={onClick}
		size="lg"
		type="button"
		variant={disabled ? "outline" : "sticker"}
	>
		<span className="font-extrabold text-lg leading-tight">{label}</span>
		<span className="font-bold text-sm leading-tight">{summary}</span>
	</Button>
);
