import { CheckIcon } from "lucide-react";

/** "The short version": the three things that matter, for everyone who skims. */
export const LegalSummary = ({
	title,
	items,
}: {
	title: string;
	items: string[];
}) => (
	<section className="flex flex-col gap-3 rounded-xl border-2 border-foreground bg-accent-lime p-5 text-accent-ink shadow-sticker">
		<h2 className="font-display font-extrabold text-2xl uppercase">{title}</h2>
		<ul className="flex flex-col gap-2.5">
			{items.map((item) => (
				<li className="flex gap-2.5 font-bold" key={item}>
					<CheckIcon
						aria-hidden="true"
						className="mt-0.5 size-5 shrink-0"
						strokeWidth={3}
					/>
					{item}
				</li>
			))}
		</ul>
	</section>
);
