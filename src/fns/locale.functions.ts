import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestHeader } from "@tanstack/react-start/server";

import type { Locale } from "@/config/app";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from "@/i18n";

/**
 * Locale for the entry redirect: explicit choice first, then the browser's
 * language, then Spanish. Runs on the server, so `/` never flashes.
 */
export const detectLocale = createServerFn({ method: "GET" }).handler(
	async (): Promise<Locale> => {
		const fromCookie = getCookie(LOCALE_COOKIE);
		if (isLocale(fromCookie)) {
			return fromCookie;
		}

		const header = getRequestHeader("accept-language") ?? "";
		for (const part of header.split(",")) {
			const tag = part.split(";")[0]?.trim().toLowerCase() ?? "";
			const base = tag.split("-")[0];
			if (isLocale(base)) {
				return base;
			}
		}

		return DEFAULT_LOCALE;
	},
);
