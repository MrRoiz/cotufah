import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import { app } from "@/config/app";
import { absoluteUrl } from "@/config/site";
import { getMessages, interpolate } from "@/i18n";

const AboutPage = () => {
	const { lang } = Route.useParams();
	const m = getMessages(lang);

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 md:px-8">
			<PageHeader lang={lang} to="/$lang/about" />

			<article className="flex flex-1 flex-col gap-8 pb-10">
				<header className="flex flex-col gap-3">
					<span className="w-fit -rotate-2 rounded-full border-2 border-foreground bg-accent-fuchsia px-3 py-1 font-bold text-accent-ink text-xs uppercase tracking-widest shadow-sticker-sm">
						{m.about.kicker}
					</span>
					<h1 className="font-display text-5xl uppercase leading-[0.9]">
						{m.about.title}
					</h1>
					<p>{m.about.intro}</p>
				</header>

				{m.about.sections.map((section) => (
					<section className="flex flex-col gap-3" key={section.title}>
						<h2 className="font-display text-2xl uppercase">
							{interpolate(section.title, { app: app.name })}
						</h2>
						<p>{interpolate(section.body, { app: app.name })}</p>
					</section>
				))}

				<footer className="mt-auto border-t-2 border-border pt-4 text-muted-foreground">
					{m.about.footer}
				</footer>
			</article>
		</div>
	);
};

export const Route = createFileRoute("/$lang/about")({
	head: ({ params }) => {
		const m = getMessages(params.lang);
		const canonical = absoluteUrl(`/${params.lang}/about`);

		return {
			meta: [
				{ title: `${m.about.title} — ${app.name}` },
				{ name: "description", content: m.about.intro },
				...(canonical ? [{ property: "og:url", content: canonical }] : []),
			],
			links: canonical ? [{ rel: "canonical", href: canonical }] : [],
		};
	},
	component: AboutPage,
});
