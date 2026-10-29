import type { Messages } from "@/i18n/en";

export type GameSlug = "spy" | "charades";

export type GameEntry = {
	slug: GameSlug;
	/** Typed route id for the setup screen. */
	setupTo: "/$lang/games/spy/setup" | "/$lang/games/charades/setup";
	/** Complete Tailwind classes: they must stay literal for the scanner. */
	gradient: string;
};

export const games: GameEntry[] = [
	{
		slug: "spy",
		setupTo: "/$lang/games/spy/setup",
		gradient: "from-game-spy-from to-game-spy-to text-game-spy-foreground",
	},
	{
		slug: "charades",
		setupTo: "/$lang/games/charades/setup",
		gradient:
			"from-game-charades-from to-game-charades-to text-game-charades-foreground",
	},
];

export const gameCopy = (messages: Messages, slug: GameSlug) => {
	return messages.games[slug];
};
