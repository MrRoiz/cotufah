import { cn } from "@/lib/utils";

/** Complete Tailwind classes: they must stay literal for the scanner. */
const STEP_FILLS = [
	"bg-accent-cyan",
	"bg-accent-lime",
	"bg-accent-fuchsia",
] as const;

/** What happens on the other phone, in three numbered stickers. */
export const ShareSteps = ({ steps }: { steps: string[] }) => (
	<ol className="grid w-full grid-cols-3 gap-2">
		{steps.map((step, index) => (
			<li
				className="flex flex-col items-center gap-1.5 text-center font-bold text-sm leading-tight"
				key={step}
			>
				<span
					aria-hidden="true"
					className={cn(
						"flex size-8 items-center justify-center rounded-full border-2 border-foreground font-extrabold text-accent-ink",
						STEP_FILLS[index % STEP_FILLS.length],
					)}
				>
					{index + 1}
				</span>
				{step}
			</li>
		))}
	</ol>
);
