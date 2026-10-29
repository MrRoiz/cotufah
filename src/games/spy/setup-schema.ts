import { z } from "zod";

import { MIN_PLAYERS } from "@/games/spy/use-spy-round";
import { interpolate } from "@/i18n";
import type { Messages } from "@/i18n/en";

export const MIN_NAME_LENGTH = 3;

/** Names are trimmed, at least three letters and unique for the round. */
export const createPlayersSchema = (m: Messages) =>
	z.object({
		players: z
			.array(
				z.object({
					id: z.number().int().positive(),
					name: z
						.string()
						.trim()
						.min(
							MIN_NAME_LENGTH,
							interpolate(m.spy.nameTooShort, { min: MIN_NAME_LENGTH }),
						),
				}),
			)
			.min(MIN_PLAYERS, m.spy.minPlayers)
			.superRefine((players, ctx) => {
				const counts = new Map<string, number>();
				for (const player of players) {
					const key = player.name.toLocaleLowerCase();
					counts.set(key, (counts.get(key) ?? 0) + 1);
				}
				players.forEach((player, index) => {
					if ((counts.get(player.name.toLocaleLowerCase()) ?? 0) > 1) {
						ctx.addIssue({
							code: "custom",
							message: m.spy.duplicateNames,
							path: [index, "name"],
						});
					}
				});
			}),
	});
