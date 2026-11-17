/** The landing's section intro: display title plus one muted line. */
export const SectionHeading = ({
	title,
	subtitle,
}: {
	title: string;
	subtitle: string;
}) => {
	return (
		<div className="flex flex-col gap-2">
			<h2 className="font-display font-extrabold text-4xl uppercase leading-none tracking-tight md:text-5xl">
				{title}
			</h2>
			<p className="text-lg text-muted-foreground">{subtitle}</p>
		</div>
	);
};
