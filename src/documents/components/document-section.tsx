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
