/**
 * Single source of truth for the app's identity.
 *
 * Renaming the product should be a one-file change: everything user-visible
 * (titles, PWA manifest, wordmark, share text) reads from here. The only
 * allowed literals elsewhere are inside deck content.
 *
 * Internal identifiers (cookies, storage keys, env vars) are deliberately
 * brand-free so a rename never invalidates anyone's session or theme.
 */
export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

type Localized = Record<Locale, string>;

export const app = {
	name: "Cotufah",
	tagline: {
		es: "juegos pa' tu parche",
		en: "party games for your crew",
	} satisfies Localized,
	description: {
		es: "Juegos de fiesta para tu parche: espía y charadas. Sin cuentas, sin base de datos, directo en tu celular.",
		en: "Party games for your crew: spy and charades. No accounts, no database, straight on your phone.",
	} satisfies Localized,
	defaultLocale: "es" satisfies Locale,
	repo: "https://github.com/MrRoiz/cotufah",
} as const;
