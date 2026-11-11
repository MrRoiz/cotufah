import { app, type Locale } from "@/config/app";
import { absoluteUrl } from "@/config/site";

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
			...(canonical ? [{ property: "og:url", content: canonical }] : []),
		],
		links: canonical ? [{ rel: "canonical", href: canonical }] : [],
	};
};
