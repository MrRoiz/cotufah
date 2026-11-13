import type { ReactNode } from "react";

/** A titled block of document prose: one heading rhythm on every page. */
export const DocumentSection = ({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) => {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="font-display text-2xl uppercase">{title}</h2>
			{children}
		</section>
	);
};

/** The fuchsia-bulleted list the legal clauses use. */
export const DocumentList = ({ items }: { items: string[] }) => {
	return (
		<ul className="flex flex-col gap-2">
			{items.map((item) => (
				<li className="flex gap-2" key={item}>
					<span aria-hidden="true" className="font-bold text-accent-fuchsia">
						•
					</span>
					{item}
				</li>
			))}
		</ul>
	);
};
