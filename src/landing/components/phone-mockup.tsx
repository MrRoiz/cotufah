import { app, type Locale } from "@/config/app";
import { games } from "@/games/games";
import { getMessages } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * A drawing of the app's games screen inside a phone outline, built from the
 * real catalog and copy so it cannot drift from the app. Decorative only.
 */
export const PhoneMockup = ({
	lang,
	className,
}: {
	lang: Locale;
	className?: string;
}) => {
	const m = getMessages(lang);

	return (
		<div
			aria-hidden="true"
			className={cn(
				"flex h-[30rem] w-60 flex-col gap-2.5 overflow-hidden rounded-[2.5rem] border-[3px] border-foreground bg-background px-3.5 py-5 shadow-sticker",
				className,
			)}
		>
			<span className="flex items-center gap-1.5 font-extrabold text-xs">
				<span className="size-2.5 rounded-full border-2 border-foreground bg-accent-lime" />
				{app.name}
			</span>
			<span className="font-display font-extrabold text-2xl leading-none tracking-tight">
				{m.games.heading}
			</span>
			{games.map((game) => (
				<span
					className={cn(
						"flex h-24 items-end rounded-xl border-2 border-foreground bg-linear-to-br p-3 font-display font-extrabold text-xl uppercase",
						game.gradient,
					)}
					key={game.slug}
				>
					{m.games[game.slug].name}
				</span>
			))}
			<span className="mt-auto grid grid-cols-3 gap-1.5">
				<span className="h-7 rounded-lg border-2 border-foreground bg-accent-lime" />
				<span className="h-7 rounded-lg bg-muted" />
				<span className="h-7 rounded-lg bg-muted" />
			</span>
		</div>
	);
};
