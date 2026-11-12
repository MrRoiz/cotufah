/**
 * The games the app ships. One tuple feeds the types, the zod schemas and the
 * catalog, so adding a game is a compile error until every consumer agrees.
 */
export const gameSlugs = ["spy", "charades"] as const;

export type GameSlug = (typeof gameSlugs)[number];
