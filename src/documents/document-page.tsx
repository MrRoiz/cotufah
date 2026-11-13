import type { ReactNode } from "react";

import type { Locale } from "@/config/app";
import { Kicker } from "@/ui/kicker";
import { PageHeader } from "@/ui/page-header";

/**
 * The frame every public document shares: the same column, header, intro block
 * and footer, so about and legal cannot drift apart.
 */
export const DocumentPage = ({
	lang,
	to,
	accent,
	kicker,
	title,
	intro,
	note,
	footer,
	children,
}: {
	lang: Locale;
	to: "/$lang/about" | "/$lang/legal";
	accent: "cyan" | "fuchsia";
	kicker: string;
	title: string;
	intro: string;
	/** Highlighted sticker under the intro (legal's "we are not lawyers"). */
	note?: string;
	footer: string;
	children: ReactNode;
}) => {
	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 md:px-8">
			<PageHeader lang={lang} to={to} />

			<main className="flex flex-1 flex-col">
				<article className="flex flex-1 flex-col gap-8 pb-10">
					<header className="flex flex-col gap-3">
						<Kicker accent={accent}>{kicker}</Kicker>
						<h1 className="font-display text-5xl uppercase leading-[0.9]">
							{title}
						</h1>
						<p>{intro}</p>
						{note ? (
							<p className="rounded-xl border-2 border-foreground bg-accent-lime px-4 py-3 text-accent-ink shadow-sticker-sm">
								{note}
							</p>
						) : null}
					</header>

					{children}

					<footer className="mt-auto border-t-2 border-border pt-4 text-muted-foreground">
						{footer}
					</footer>
				</article>
			</main>
		</div>
	);
};
