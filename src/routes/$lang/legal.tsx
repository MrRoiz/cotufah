import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import { app } from "@/config/app";
import { absoluteUrl } from "@/config/site";
import { getMessages } from "@/i18n";

const LegalPage = () => {
	const { lang } = Route.useParams();
	const m = getMessages(lang);

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 md:px-8">
			<PageHeader lang={lang} to="/$lang/legal" />

			<article className="flex flex-1 flex-col gap-8 pb-10">
				<header className="flex flex-col gap-3">
					<span className="w-fit -rotate-2 rounded-full border-2 border-foreground bg-accent-cyan px-3 py-1 font-bold text-accent-ink text-xs uppercase tracking-widest shadow-sticker-sm">
						{m.legal.kicker}
					</span>
					<h1 className="font-display text-5xl uppercase leading-[0.9]">
						{m.legal.title}
					</h1>
					<p>{m.legal.intro}</p>
					<p className="rounded-xl border-2 border-foreground bg-accent-lime px-4 py-3 text-accent-ink shadow-sticker-sm">
						{m.legal.notLawyers}
					</p>
				</header>

				<section className="flex flex-col gap-3">
					<h2 className="font-display text-2xl uppercase">
						{m.legal.termsTitle}
					</h2>
					<p>{m.legal.termsBody}</p>
				</section>

				<section className="flex flex-col gap-3">
					<h2 className="font-display text-2xl uppercase">
						{m.legal.liabilityTitle}
					</h2>
					<p>{m.legal.termsWarranty}</p>
					<p>{m.legal.liabilityBody}</p>
				</section>

				<section className="flex flex-col gap-3">
					<h2 className="font-display text-2xl uppercase">
						{m.legal.privacyTitle}
					</h2>
					<p className="font-bold">{m.legal.privacyIntro}</p>
					<ul className="flex flex-col gap-2">
						{m.legal.privacyList.map((item) => (
							<li className="flex gap-2" key={item}>
								<span
									aria-hidden="true"
									className="font-bold text-accent-fuchsia"
								>
									•
								</span>
								{item}
							</li>
						))}
					</ul>
				</section>

				<section className="flex flex-col gap-3">
					<h2 className="font-display text-2xl uppercase">
						{m.legal.dataTitle}
					</h2>
					<ul className="flex flex-col gap-2">
						{m.legal.dataList.map((item) => (
							<li className="flex gap-2" key={item}>
								<span
									aria-hidden="true"
									className="font-bold text-accent-fuchsia"
								>
									•
								</span>
								{item}
							</li>
						))}
					</ul>
				</section>

				<section className="flex flex-col gap-3">
					<h2 className="font-display text-2xl uppercase">
						{m.legal.cookiesTitle}
					</h2>
					<p>{m.legal.cookiesBody}</p>
				</section>

				<section className="flex flex-col gap-3">
					<h2 className="font-display text-2xl uppercase">
						{m.legal.faqTitle}
					</h2>
					<dl className="flex flex-col gap-3">
						{m.legal.faq.map((item) => (
							<div className="flex flex-col gap-1" key={item.q}>
								<dt className="font-bold">{item.q}</dt>
								<dd className="text-muted-foreground">{item.a}</dd>
							</div>
						))}
					</dl>
				</section>

				<section className="flex flex-col gap-3">
					<h2 className="font-display text-2xl uppercase">
						{m.legal.changesTitle}
					</h2>
					<p>{m.legal.changesBody}</p>
				</section>

				<section className="flex flex-col gap-3">
					<h2 className="font-display text-2xl uppercase">
						{m.legal.openSourceTitle}
					</h2>
					<p>{m.legal.openSourceBody}</p>
				</section>

				<footer className="mt-auto border-t-2 border-border pt-4 text-muted-foreground">
					{m.legal.footer}
				</footer>
			</article>
		</div>
	);
};

export const Route = createFileRoute("/$lang/legal")({
	head: ({ params }) => {
		const m = getMessages(params.lang);
		const canonical = absoluteUrl(`/${params.lang}/legal`);

		return {
			meta: [
				{ title: `${m.legal.title} — ${app.name}` },
				{ name: "description", content: m.legal.intro },
				...(canonical ? [{ property: "og:url", content: canonical }] : []),
			],
			links: canonical ? [{ rel: "canonical", href: canonical }] : [],
		};
	},
	component: LegalPage,
});
