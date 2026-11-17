import type { ReactNode } from "react";

import type { Locale } from "@/config/app";
import { Kicker } from "@/ui/kicker";
import { PageHeader } from "@/ui/page-header";

/**
 * The frame every public document shares: the same column, header and title
 * block, so about and legal cannot drift apart. Each page brings its own
 * intro and closing, because they say different things (a card vs. a note).
 */
export const DocumentPage = ({
	lang,
	to,
	accent,
	kicker,
	title,
	children,
}: {
	lang: Locale;
	to: "/$lang/about" | "/$lang/legal";
	accent: "cyan" | "fuchsia";
	kicker: string;
	title: string;
	children: ReactNode;
}) => {
	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 md:px-8">
			<PageHeader lang={lang} to={to} />

			<main className="flex flex-1 flex-col">
				<article className="flex flex-1 flex-col gap-6 pb-10">
					<header className="flex flex-col gap-4">
						<Kicker accent={accent}>{kicker}</Kicker>
						<h1 className="font-display font-extrabold text-5xl uppercase leading-[0.9] tracking-tight md:text-6xl">
							{title}
						</h1>
					</header>

					{children}
				</article>
			</main>
		</div>
	);
};
