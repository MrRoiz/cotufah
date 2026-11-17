import { CheckIcon, XIcon } from "lucide-react";
import { app, type Locale } from "@/config/app";
import { DocumentList } from "@/documents/components/document-list";
import { DocumentPage } from "@/documents/components/document-page";
import { DocumentSection } from "@/documents/components/document-section";
import { LegalSummary } from "@/documents/components/legal-summary";
import { getMessages } from "@/i18n";
import { ExternalLink } from "@/ui/external-link";

/** Reading order of the sections; the index chips and the numbers both follow it. */
const SECTION_ORDER = [
	"terms",
	"liability",
	"privacy",
	"data",
	"cookies",
	"faq",
	"changes",
	"openSource",
] as const;

type SectionId = (typeof SECTION_ORDER)[number];

export const LegalPage = ({ lang }: { lang: Locale }) => {
	const messages = getMessages(lang);

	// Each section knows its anchor, its number and its colour from one place.
	const sectionProps = (id: SectionId) => {
		const index = SECTION_ORDER.indexOf(id);
		return { id, index, marker: String(index + 1) };
	};

	return (
		<DocumentPage
			accent="cyan"
			kicker={messages.legal.kicker}
			lang={lang}
			title={messages.legal.title}
			to="/$lang/legal"
		>
			<p className="text-lg text-muted-foreground leading-relaxed">
				{messages.legal.intro}
			</p>

			<LegalSummary
				items={messages.legal.summary}
				title={messages.legal.summaryTitle}
			/>

			<p className="rounded-xl border-2 border-foreground border-dashed px-4 py-3">
				{messages.legal.notLawyers}
			</p>

			<nav
				aria-label={messages.legal.indexLabel}
				className="flex flex-wrap gap-2"
			>
				{SECTION_ORDER.map((id) => (
					<a
						className="flex min-h-11 items-center rounded-full border-2 border-border bg-card px-4 font-bold text-sm"
						href={`#${id}`}
						key={id}
					>
						{messages.legal.sections[id]}
					</a>
				))}
			</nav>

			<DocumentSection
				{...sectionProps("terms")}
				title={messages.legal.termsTitle}
			>
				<p>{messages.legal.termsBody}</p>
			</DocumentSection>

			<DocumentSection
				{...sectionProps("liability")}
				title={messages.legal.liabilityTitle}
			>
				<p>{messages.legal.termsWarranty}</p>
				<p>{messages.legal.liabilityBody}</p>
			</DocumentSection>

			<DocumentSection
				{...sectionProps("privacy")}
				title={messages.legal.privacyTitle}
			>
				<p className="font-bold">{messages.legal.privacyIntro}</p>
				<DocumentList icon={CheckIcon} items={messages.legal.privacyList} />
			</DocumentSection>

			<DocumentSection
				{...sectionProps("data")}
				title={messages.legal.dataTitle}
			>
				<DocumentList icon={XIcon} items={messages.legal.dataList} />
			</DocumentSection>

			<DocumentSection
				{...sectionProps("cookies")}
				title={messages.legal.cookiesTitle}
			>
				<p>{messages.legal.cookiesBody}</p>
			</DocumentSection>

			<DocumentSection {...sectionProps("faq")} title={messages.legal.faqTitle}>
				<dl className="flex flex-col gap-3">
					{messages.legal.faq.map((item) => (
						<div
							className="flex flex-col gap-1 rounded-xl rounded-bl-sm border-2 border-foreground px-4 py-3"
							key={item.q}
						>
							<dt className="font-extrabold">{item.q}</dt>
							<dd className="text-muted-foreground">{item.a}</dd>
						</div>
					))}
				</dl>
			</DocumentSection>

			<DocumentSection
				{...sectionProps("changes")}
				title={messages.legal.changesTitle}
			>
				<p>{messages.legal.changesBody}</p>
			</DocumentSection>

			<DocumentSection
				{...sectionProps("openSource")}
				title={messages.legal.openSourceTitle}
			>
				<p>{messages.legal.openSourceBody}</p>
				<ExternalLink className="w-fit" href={app.repo}>
					GitHub
				</ExternalLink>
			</DocumentSection>

			<footer className="mt-auto border-border border-t-2 pt-4 text-muted-foreground text-sm">
				{messages.legal.footer}
			</footer>
		</DocumentPage>
	);
};
