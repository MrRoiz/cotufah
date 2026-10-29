# Cotufah

Phone-only party games for one phone passed hand to hand. Spanish first (Colombia),
English supported. No accounts, no database, no ads: word decks live on the server and
only the words for the current round ever reach the browser.

## Games

- **Espía** — everyone gets the same word except the spies. Talk, lie, vote, reveal.
- **Charadas** — phone on the forehead; tilt down to score, tilt up to pass.

Each game ships a **classic deck** plus eleven **themed packs** (movies, Disney, actors,
objects, kitchen, gaming, animals, music, sports, food, places) and a **mixed** draw that
pulls from all of them.

## Stack

- [TanStack Start](https://tanstack.com/start) + React 19
- Vite 8, TypeScript 7
- Tailwind CSS 4 + shadcn/ui (radix base)
- Biome (format + lint), Husky, semantic-release
- pnpm 12, Node 26 (`.nvmrc`)

## Requirements

- Node 26 (`nvm use` reads `.nvmrc`)
- pnpm 12 (also declared as `packageManager` in `package.json`)

## Getting started

```bash
nvm use
pnpm install
pnpm dev
```

Vite usually serves on <http://localhost:3000> and moves to the next free port if that one
is taken — read the log instead of assuming.

The phone surfaces live under `/<lang>/_app/**`; a desktop browser gets the landing page
with a QR code. To play on a phone over your network you need HTTPS: screen wake lock and
motion sensors are secure-context APIs. `localhost` counts as secure, a LAN IP does not.

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Vite dev server |
| `pnpm build` | Production build (Nitro output in `.output/`) |
| `pnpm preview` | Preview the build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm check` | Biome check (format + lint) |
| `pnpm check --write` | Fix formatting and safe lint issues |
| `pnpm lint` / `pnpm format` | Biome lint / format only |
| `pnpm generate-routes` | Regenerate `src/routeTree.gen.ts` (usually automatic) |

There is no test runner yet: verification is Biome, `tsc` and a production build.

## Production

```bash
pnpm build
PORT=3110 node .output/server/index.mjs
```

Set `VITE_APP_ORIGIN` at build time to get canonical, hreflang and OG URLs; leaving it empty
is correct for local development. Deploy behind HTTPS, otherwise wake lock and tilt fall back
to their no-sensor behaviour.

## Project layout

```
src/
├─ config/            # app identity, public origin, version
├─ i18n/              # en (source of truth), es, interpolation
├─ fns/               # createServerFn wrappers (client-safe)
├─ server/            # server-only deck registry, zod-validated
├─ data/              # classic decks per game and shared themed packs
├─ games/             # spy and charades state, panels, picker icons
├─ components/        # shadcn primitives and shared UI
└─ routes/            # landing, legal, about, app screens
```

## How the decks work

```
JSON deck -> server/decks.server.ts -> getRound(game, locale, count, category) -> useQuery
```

- `src/data/<game>/<locale>.json` holds each game's classic list.
- `src/data/packs/<locale>.json` holds the themed packs shared by both games.
- Both are parsed with zod at server boot and imported only from server code, so word lists
  never enter the client bundle.
- A round asks for a game, a locale, a count and a category (`mixed` draws from the classic
  list and every pack); it gets back exactly those words.
- Game state lives in validated search params, so a reload starts a fresh round by design.

## Versioning and release

Commits follow Conventional Commits. On every push to `master`, GitHub Actions runs Biome and
typecheck first; only if both pass, semantic-release computes the next version, updates
`package.json`, commits `chore(release): x.y.z [skip ci]` and pushes the tag. Nothing is
published to npm. The current version is shown in Settings.

Locally, Husky runs the same two checks before a commit is created.

## Contributing

Issues and pull requests are welcome. Read [`AGENTS.md`](./AGENTS.md) first — it documents the
non-negotiables (alias imports, colors only in `styles.css`, decks stay server-side, phone-first
layout) and the project conventions.

Product copy lives in `src/i18n/{en,es}.ts`; English is the source of truth and Spanish is
written for Colombia, not machine-translated.
