import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { locales } from "@/config/app";
import { categoryChoices } from "@/data/schema";
import { getRoundWords } from "@/server/decks.server";

/**
 * Client-safe wrappers. Anything imported from `server/` must stay behind
 * these handlers — that boundary is what keeps decks out of the bundle.
 */
export const getRoundFn = createServerFn({ method: "GET" })
	.validator(
		z.object({
			game: z.enum(["spy", "charades"]),
			locale: z.enum(locales),
			count: z.number().int().min(1).max(40).default(12),
			category: z.enum(categoryChoices).default("mixed"),
		}),
	)
	.handler(({ data }) =>
		getRoundWords(data.game, data.locale, data.count, data.category),
	);
