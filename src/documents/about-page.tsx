import { app, type Locale } from "@/config/app";
import { DocumentPage } from "@/documents/document-page";
import { DocumentSection } from "@/documents/document-section";
import { getMessages, interpolate } from "@/i18n";
import { ExternalLink } from "@/ui/external-link";

export const AboutPage = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<DocumentPage
			accent="fuchsia"
			footer={m.about.footer}
			intro={m.about.intro}
			kicker={m.about.kicker}
			lang={lang}
			title={m.about.title}
			to="/$lang/about"
		>
			{m.about.sections.map((section, index) => (
				<DocumentSection
					key={section.title}
					title={interpolate(section.title, { app: app.name })}
				>
					<p>{interpolate(section.body, { app: app.name })}</p>
					{/* The last section is "how do I reach you": the repo link belongs there. */}
					{index === m.about.sections.length - 1 ? (
						<ExternalLink className="w-fit" href={app.repo}>
							GitHub
						</ExternalLink>
					) : null}
				</DocumentSection>
			))}
		</DocumentPage>
	);
};
