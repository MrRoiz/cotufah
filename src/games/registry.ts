import { type GameSlug, gameSlugs } from "@/config/games";

export type GameEntry = {
	slug: GameSlug;
	/** Typed route id for the setup screen. */
	setupTo: "/$lang/games/spy/setup" | "/$lang/games/charades/setup";
	/** Complete Tailwind classes: they must stay literal for the scanner. */
	gradient: string;
};

/** Keyed by slug so a missing game fails `typecheck` instead of the UI. */
const entries: Record<GameSlug, Omit<GameEntry, "slug">> = {
	spy: {
		setupTo: "/$lang/games/spy/setup",
		gradient: "from-game-spy-from to-game-spy-to text-game-spy-foreground",
	},
	charades: {
		setupTo: "/$lang/games/charades/setup",
		gradient:
			"from-game-charades-from to-game-charades-to text-game-charades-foreground",
	},
};

export const games: GameEntry[] = gameSlugs.map((slug) => ({
	slug,
	...entries[slug],
}));
