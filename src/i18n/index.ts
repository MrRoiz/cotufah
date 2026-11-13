import { app, type Locale, locales } from "@/config/app";
import { en, type Messages } from "@/i18n/en";
import { es } from "@/i18n/es";

const messages: Record<Locale, Messages> = { en, es };

export type { Messages } from "@/i18n/en";

export const DEFAULT_LOCALE: Locale = app.defaultLocale;

export const isLocale = (value: unknown): value is Locale => {
	return (
		typeof value === "string" && (locales as readonly string[]).includes(value)
	);
};

export const getMessages = (locale: Locale): Messages => {
	return messages[locale];
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

export const localizedPath = (locale: Locale, path: string): string => {
	const clean = path.replace(/^\/+/, "");
	return clean ? `/${locale}/${clean}` : `/${locale}`;
};

export const interpolate = (
	template: string,
	vars: Record<string, string | number>,
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
const pluralRules = new Map<Locale, Intl.PluralRules>();

const pluralRuleFor = (locale: Locale): Intl.PluralRules => {
	const cached = pluralRules.get(locale);
	if (cached) {
		return cached;
	}
	const rules = new Intl.PluralRules(locale);
	pluralRules.set(locale, rules);
	return rules;
};

export const plural = (
	locale: Locale,
	count: number,
	forms: { one: string; other: string },
): string => {
	const rule = pluralRuleFor(locale).select(count);
	return interpolate(rule === "one" ? forms.one : forms.other, { count });
};

/** `A, B and C` in the reader's language, cached like the plural rules. */
const listFormatters = new Map<Locale, Intl.ListFormat>();

export const formatList = (locale: Locale, items: string[]): string => {
	let formatter = listFormatters.get(locale);
	if (!formatter) {
		formatter = new Intl.ListFormat(locale, {
			style: "long",
			type: "conjunction",
		});
		listFormatters.set(locale, formatter);
	}
	return formatter.format(items);
};
