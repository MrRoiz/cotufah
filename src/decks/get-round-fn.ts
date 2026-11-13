import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { locales } from "@/config/app";
import { gameSlugs } from "@/config/games";
import { categoryChoices, MAX_ROUND_WORDS } from "@/decks/categories";
import { getRoundWords } from "@/server/decks.server";

/**
 * Client-safe wrappers. Anything imported from `server/` must stay behind
 * these handlers — that boundary is what keeps decks out of the bundle.
 */
export const getRoundFn = createServerFn({ method: "GET" })
	.validator(
		z.object({
			game: z.enum(gameSlugs),
			locale: z.enum(locales),
			count: z.number().int().min(1).max(MAX_ROUND_WORDS),
			category: z.enum(categoryChoices),
		}),
	)
	.handler(({ data }) => getRoundWords(data));
