import { cn } from "@/lib/utils";

type SegmentedOption<Value extends string> = {
	value: Value;
	label: string;
};

/**
 * A row of mutually exclusive options in one track (language, theme). The
 * legend is for screen readers; the screen shows its own heading above.
 */
export const SegmentedControl = <Value extends string>({
	label,
	options,
	value,
	onChange,
}: {
	label: string;
	options: SegmentedOption<Value>[];
	value: Value;
	onChange: (value: Value) => void;
}) => (
	<fieldset className="min-w-0">
		<legend className="sr-only">{label}</legend>
		<div className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-muted p-1">
			{options.map((option) => {
				const isSelected = option.value === value;
				return (
					<button
						aria-pressed={isSelected}
						className={cn(
							"min-h-12 rounded-lg border-2 font-bold",
							isSelected
								? "border-foreground bg-accent-lime text-accent-ink"
								: "border-transparent",
						)}
						key={option.value}
						onClick={() => onChange(option.value)}
						type="button"
					>
						{option.label}
					</button>
				);
			})}
		</div>
	</fieldset>
);
