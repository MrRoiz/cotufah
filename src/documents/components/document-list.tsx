import type { LucideIcon } from "lucide-react";

/** A clause list; the icon says what kind (a check for "we do", an X for "we don't"). */
export const DocumentList = ({
	items,
	icon: Icon,
}: {
	items: string[];
	icon: LucideIcon;
}) => {
	return (
		<ul className="flex flex-col gap-2.5">
			{items.map((item) => (
				<li className="flex gap-2.5 text-muted-foreground" key={item}>
					<Icon
						aria-hidden="true"
						className="mt-0.5 size-5 shrink-0 text-foreground"
						strokeWidth={3}
					/>
					{item}
				</li>
			))}
		</ul>
	);
};
