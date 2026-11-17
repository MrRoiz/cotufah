/** Title block for the bottom-nav screens, which have no back button. */
export const TabPageHeader = ({
	title,
	subtitle,
}: {
	title: string;
	subtitle: string;
}) => (
	<header className="flex flex-col gap-1.5 pt-4 pb-5">
		<h1 className="font-display font-extrabold text-4xl leading-none tracking-tight">
			{title}
		</h1>
		<p className="text-muted-foreground">{subtitle}</p>
	</header>
);
