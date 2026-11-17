import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, ExternalLinkIcon, UserIcon } from "lucide-react";
import { app, type Locale } from "@/config/app";
import { DocumentPage } from "@/documents/components/document-page";
import { DocumentSection } from "@/documents/components/document-section";
import { getMessages, interpolate } from "@/i18n";
import { Button } from "@/ui/button";

export const AboutPage = ({ lang }: { lang: Locale }) => {
	const messages = getMessages(lang);
	const lastSection = messages.about.sections.length - 1;

	return (
		<DocumentPage
			accent="fuchsia"
			kicker={messages.about.kicker}
			lang={lang}
			title={messages.about.title}
			to="/$lang/about"
		>
			<div className="flex gap-4 rounded-xl border-2 border-foreground bg-card p-5 shadow-sticker">
				<span
					aria-hidden="true"
					className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-accent-lime text-accent-ink"
				>
					<UserIcon className="size-7" />
				</span>
				<p className="text-lg leading-relaxed">{messages.about.intro}</p>
			</div>

			{messages.about.sections.map((section, index) => (
				<DocumentSection
					index={index}
					key={section.title}
					marker="?"
					title={interpolate(section.title, { app: app.name })}
				>
					<p className="text-muted-foreground leading-relaxed">
						{interpolate(section.body, { app: app.name })}
					</p>
					{/* The last section is "how do I reach you": the repo link belongs there. */}
					{index === lastSection ? (
						<Button
							asChild
							className="w-fit border-foreground"
							variant="outline"
						>
							<a href={app.repo} rel="noreferrer" target="_blank">
								<ExternalLinkIcon aria-hidden="true" />
								{messages.about.contactCta}
							</a>
						</Button>
					) : null}
				</DocumentSection>
			))}

			<footer className="mt-auto flex flex-col gap-4 rounded-xl border-2 border-foreground bg-accent-lime p-5 text-accent-ink">
				<p className="font-bold text-lg leading-snug">
					{messages.about.footer}
				</p>
				<Button
					asChild
					className="w-fit border-accent-ink bg-accent-ink text-accent-lime hover:bg-accent-ink/90"
				>
					<Link params={{ lang }} to="/$lang/games">
						{messages.home.cta}
						<ArrowRightIcon aria-hidden="true" />
					</Link>
				</Button>
			</footer>
		</DocumentPage>
	);
};
