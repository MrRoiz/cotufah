import { app, type Locale, locales } from "@/config/app";
import { en, type Messages } from "@/i18n/en";
import { es } from "@/i18n/es";

const messages: Record<Locale, Messages> = { en, es };

/** Brand-free on purpose: a rename must not reset anyone's language. */
export const LOCALE_COOKIE = "app.locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const DEFAULT_LOCALE: Locale = app.defaultLocale;

export const isLocale = (value: unknown): value is Locale => {
	return (
		typeof value === "string" && (locales as readonly string[]).includes(value)
	);
};

export const getMessages = (locale: Locale): Messages => {
	return messages[locale] ?? messages[DEFAULT_LOCALE];
};

export const otherLocale = (locale: Locale): Locale => {
	return locale === "es" ? "en" : "es";
};

/** `Español` / `English`: always written in their own language. */
export const localeLabel = (locale: Locale): string => {
	return locale === "es" ? "Español" : "English";
};

/** First path segment, so `<html lang>` and `/$lang` never disagree. */
export const localeFromPath = (pathname: string): Locale => {
	const first = pathname.split("/")[1] ?? "";
	return isLocale(first) ? first : DEFAULT_LOCALE;
};

export const localizedPath = (locale: Locale, path = ""): string => {
	const clean = path.replace(/^\/+/, "");
	return clean ? `/${locale}/${clean}` : `/${locale}`;
};

export const writeLocaleCookie = (locale: Locale): void => {
	if (typeof document === "undefined") {
		return;
	}
	// biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API is not available on iOS Safari, our primary target.
	document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
};

export const interpolate = (
	template: string,
	vars: Record<string, string | number> = {},
): string => {
	return template.replace(/\{(\w+)\}/g, (match, key: string) => {
		const value = vars[key];
		return value === undefined ? match : String(value);
	});
};

/**
 * Spanish plurals are not English plurals ("1 jugador" / "2 jugadores"), so
 * counts go through Intl rather than string concatenation.
 */
export const plural = (
	locale: Locale,
	count: number,
	forms: { one: string; other: string },
): string => {
	const rule = new Intl.PluralRules(locale).select(count);
	return interpolate(rule === "one" ? forms.one : forms.other, { count });
};
