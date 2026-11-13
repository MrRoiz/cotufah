import { app, type Locale } from "@/config/app";
import { DocumentList } from "@/documents/components/document-list";
import { DocumentPage } from "@/documents/components/document-page";
import { DocumentSection } from "@/documents/components/document-section";
import { getMessages } from "@/i18n";
import { ExternalLink } from "@/ui/external-link";

export const LegalPage = ({ lang }: { lang: Locale }) => {
	const m = getMessages(lang);

	return (
		<DocumentPage
			accent="cyan"
			footer={m.legal.footer}
			intro={m.legal.intro}
			kicker={m.legal.kicker}
			lang={lang}
			note={m.legal.notLawyers}
			title={m.legal.title}
			to="/$lang/legal"
		>
			<DocumentSection title={m.legal.termsTitle}>
				<p>{m.legal.termsBody}</p>
			</DocumentSection>

			<DocumentSection title={m.legal.liabilityTitle}>
				<p>{m.legal.termsWarranty}</p>
				<p>{m.legal.liabilityBody}</p>
			</DocumentSection>

			<DocumentSection title={m.legal.privacyTitle}>
				<p className="font-bold">{m.legal.privacyIntro}</p>
				<DocumentList items={m.legal.privacyList} />
			</DocumentSection>

			<DocumentSection title={m.legal.dataTitle}>
				<DocumentList items={m.legal.dataList} />
			</DocumentSection>

			<DocumentSection title={m.legal.cookiesTitle}>
				<p>{m.legal.cookiesBody}</p>
			</DocumentSection>

			<DocumentSection title={m.legal.faqTitle}>
				<dl className="flex flex-col gap-3">
					{m.legal.faq.map((item) => (
						<div className="flex flex-col gap-1" key={item.q}>
							<dt className="font-bold">{item.q}</dt>
							<dd className="text-muted-foreground">{item.a}</dd>
						</div>
					))}
				</dl>
			</DocumentSection>

			<DocumentSection title={m.legal.changesTitle}>
				<p>{m.legal.changesBody}</p>
			</DocumentSection>

			<DocumentSection title={m.legal.openSourceTitle}>
				<p>{m.legal.openSourceBody}</p>
				<ExternalLink className="w-fit" href={app.repo}>
					GitHub
				</ExternalLink>
			</DocumentSection>
		</DocumentPage>
	);
};
