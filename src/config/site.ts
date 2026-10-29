/**
 * Public origin, used only for absolute URLs (canonical, hreflang, OG).
 * Leave unset locally: the tags are omitted rather than pointing at localhost.
 */
export const siteOrigin = (import.meta.env.VITE_APP_ORIGIN ?? "").replace(
	/\/+$/,
	"",
);

export const absoluteUrl = (path: string): string | null => {
	return siteOrigin ? `${siteOrigin}${path}` : null;
};
