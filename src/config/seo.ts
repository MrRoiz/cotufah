import { app, type Locale } from "@/config/app";
import { absoluteUrl } from "@/config/site";
import { getMessages, otherLocale } from "@/i18n";

/** The card changes with the language, so it belongs to the dynamic metadata. */
export const ogImageMeta = (lang: Locale) => {
	const image = absoluteUrl(`/og-${lang}.png`);
	if (!image) {
		return [];
	}

	return [
		{ property: "og:image", content: image },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		{ property: "og:image:alt", content: `${app.name} — ${app.tagline[lang]}` },
		{ name: "twitter:image", content: image },
	];
};

/**
 * Dynamic per-route metadata: title, description, canonical/`og:url`, locale
 * and the noindex flag. Search and social tags share one title and summary, so
 * a page can never ship with one and not the other.
 *
 * Static site-wide tags (`og:type`, `og:site_name`, `twitter:card`) live in
 * `src/routes/__root.tsx`. Never repeat them here: the root applies to every
 * route, so a second copy would emit two tags with the same property.
 *
 * `path` is for the indexable pages only: it adds the canonical URL and
 * `og:url`. App screens pass `noindex` instead, and never a path, because their
 * URLs carry per-device state (player names) that must not become canonical.
 */
export const pageMeta = ({
	lang,
	title,
	description,
	path,
	noindex = false,
}: {
	lang: Locale;
	title: string;
	description?: string;
	/** Path below the locale, e.g. `/legal`. */
	path?: string;
	/** Keep the screen out of search results without hiding its link preview. */
	noindex?: boolean;
}) => {
	const fullTitle = `${title} — ${app.name}`;
	const summary = description ?? app.description[lang];
	const canonical = path ? absoluteUrl(`/${lang}${path}`) : null;

	return {
		meta: [
			...(noindex ? [{ name: "robots", content: "noindex" }] : []),
			{ title: fullTitle },
			{ name: "description", content: summary },
			{ property: "og:title", content: fullTitle },
			{ property: "og:description", content: summary },
			{ property: "og:locale", content: lang === "es" ? "es_CO" : "en_US" },
			...ogImageMeta(lang),
			...(canonical ? [{ property: "og:url", content: canonical }] : []),
		],
		links: canonical ? [{ rel: "canonical", href: canonical }] : [],
	};
};

/**
 * The landing is the one indexable page: brand-first title, hreflang
 * alternates and the JSON-LD block live with the rest of the metadata.
 */
export const landingMeta = (lang: Locale) => {
	const m = getMessages(lang);
	const canonical = absoluteUrl(`/${lang}`);
	const alternate = absoluteUrl(`/${otherLocale(lang)}`);
	const title = `${app.name} — ${m.common.appTagline}`;

	return {
		meta: [
			{ title },
			{ name: "description", content: app.description[lang] },
			{ property: "og:title", content: title },
			{ property: "og:description", content: app.description[lang] },
			{ property: "og:locale", content: lang === "es" ? "es_CO" : "en_US" },
			...ogImageMeta(lang),
			...(canonical ? [{ property: "og:url", content: canonical }] : []),
		],
		links: [
			...(canonical ? [{ rel: "canonical", href: canonical }] : []),
			...(alternate
				? [{ rel: "alternate", hrefLang: otherLocale(lang), href: alternate }]
				: []),
			...(canonical
				? [{ rel: "alternate", hrefLang: lang, href: canonical }]
				: []),
		],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "SoftwareApplication",
					name: app.name,
					description: app.description[lang],
					applicationCategory: "GameApplication",
					operatingSystem: "iOS, Android",
					inLanguage: lang,
					offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
				}),
			},
		],
	};
};
