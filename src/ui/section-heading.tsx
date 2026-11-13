/** The landing's section intro: display title plus one muted line. */
export const SectionHeading = ({
	title,
	subtitle,
}: {
	title: string;
	subtitle: string;
}) => {
	return (
		<div className="flex flex-col gap-1">
			<h2 className="font-display text-3xl uppercase">{title}</h2>
			<p className="text-muted-foreground">{subtitle}</p>
		</div>
	);
};
