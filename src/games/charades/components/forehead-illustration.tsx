/**
 * A face with the phone held sideways on the forehead, drawn with plain boxes
 * so it follows the theme. Decorative: the title next to it says the same.
 */
export const ForeheadIllustration = () => (
	<div aria-hidden="true" className="relative h-48 w-56">
		<div className="absolute top-12 left-12 h-36 w-32 rounded-t-[4rem] rounded-b-[3.5rem] border-2 border-foreground bg-secondary" />
		<div className="absolute top-32 left-[5.25rem] size-2.5 rounded-full bg-foreground" />
		<div className="absolute top-32 left-[7.75rem] size-2.5 rounded-full bg-foreground" />
		<div className="absolute top-[9.5rem] left-24 h-2.5 w-7 rounded-b-full border-foreground border-b-[3px]" />
		<div className="absolute top-4 left-6 flex h-20 w-44 -rotate-3 items-center justify-center rounded-xl border-[3px] border-foreground bg-accent-lime font-display font-extrabold text-4xl text-accent-ink shadow-sticker">
			?
		</div>
	</div>
);
