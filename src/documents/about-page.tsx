import { app, type Locale } from "@/config/app";
import { getMessages, interpolate } from "@/i18n";
import { ExternalLink } from "@/ui/external-link";
import { Kicker } from "@/ui/kicker";
import { PageHeader } from "@/ui/page-header";

export const AboutPage = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 md:px-8">
			<PageHeader lang={lang} to="/$lang/about" />

			<article className="flex flex-1 flex-col gap-8 pb-10">
				<header className="flex flex-col gap-3">
					<Kicker accent="fuchsia">{m.about.kicker}</Kicker>
					<h1 className="font-display text-5xl uppercase leading-[0.9]">
						{m.about.title}
					</h1>
					<p>{m.about.intro}</p>
				</header>

				{m.about.sections.map((section, index) => (
					<section className="flex flex-col gap-3" key={section.title}>
						<h2 className="font-display text-2xl uppercase">
							{interpolate(section.title, { app: app.name })}
						</h2>
						<p>{interpolate(section.body, { app: app.name })}</p>
						{/* The last section is "how do I reach you": the repo link belongs there. */}
						{index === m.about.sections.length - 1 ? (
							<ExternalLink className="w-fit" href={app.repo}>
								GitHub
							</ExternalLink>
						) : null}
					</section>
				))}

				<footer className="mt-auto border-t-2 border-border pt-4 text-muted-foreground">
					{m.about.footer}
				</footer>
			</article>
		</div>
	);
};
