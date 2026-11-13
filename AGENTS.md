# AGENTS.md

Instructions for AI agents working in this repo. Read this before touching code.

## What this is

**Cotufah** — phone-only party games (Espía / Charadas), Spanish-first with English
support. No accounts, no database: word decks are TS modules served through typed server
functions. Built on TanStack Start, React 19, Tailwind 4 and shadcn/ui.

Status: M0–M5 committed; M6 (Charadas) and M7 (sound + haptics) are awaiting a
device test — see [Roadmap](#roadmap).

## Read these first

| File | Why |
|---|---|
| `src/config/app.ts` | Brand identity. The only place the app name appears. |
| `src/styles.css` | The entire palette, in oklch. The only file allowed to contain colors. |
| `src/providers/theme-provider.tsx` | Light/dark/system, `ScriptOnce` pre-paint script. |
| `components.json` | shadcn config (radix base, `nova` style, `@/` alias). |
| `src/config/site.ts` | Public origin for canonical/OG URLs (`VITE_APP_ORIGIN`). |
| `src/config/seo.ts` | Per-route title/description/OG, including the per-language card. Static tags (`og:type`, `og:site_name`, `twitter:card`) live in `__root.tsx`. |
| `src/games/<game>/` | One game: rules, round hook, panels and screens. |
| `vite.config.ts` | Cloudflare Workers + the manifest plugin that keeps the PWA rename-safe. |

## Commands

```bash
pnpm dev            # vite dev; falls back to :3001+ if 3000 is taken
pnpm typecheck      # tsc --noEmit
pnpm check          # biome check (format + lint + import order)
pnpm build          # vite build -> dist/ (Cloudflare Worker)
pnpm run deploy     # vite build + wrangler deploy
pnpm preview        # serve the built Worker locally
```

`pnpm check --write` fixes formatting. There are no custom build guards — the rules
below are conventions, reviewed by hand.

## Non-negotiables

1. **Colors live in `src/styles.css` only.** No hex, no `bg-red-500`, no inline styles
   for color. Use tokens (`bg-background`, `text-muted-foreground`, `bg-accent-lime`).
   The one sanctioned exception is `src/dev/**`, where showing values is the
   point.
2. **Text on an accent fill uses `text-accent-ink`**, never `text-foreground` — cream
   on lime is 1.2:1 in dark mode. Every accent pair is contrast-tested.
3. **The brand name exists once**, in `src/config/app.ts`. Never hardcode "Cotufah"
   in a component or message; a rename must stay a one-file change (config, package
   name, docs).
4. **Code is English; product copy is Spanish.** Identifiers, files, routes
   (`/games/spy/setup`), params, comments, commits: English. Product text lives in
   `src/i18n/{en,es}.ts`; only `es.ts`, `src/data/**` and `src/dev/**` may
   contain Spanish.
5. **Phone-only, mobile-first.** App surfaces are `max-w-[430px]`, `min-h-dvh`, with
   safe-area padding (`pb-safe`, `pt-safe`, `px-safe`). 48px minimum targets, 16px
   minimum input font, no hover-only affordances. Desktop gets the landing page and a
   QR — never a stretched app. The gate is `(min-width:768px) and (min-height:500px)`:
   wide *and* tall, so landscape phones pass through and touchscreen laptops don't.
   **Only `/$lang/_app/**` is gated**; the landing at `/$lang` is the desktop surface.
6. **Aliases only.** `@/...` everywhere; `biome.json` has `noRestrictedImports` set to
   reject `./`, `../`, `./**` and `../**`.
7. **No database, no auth, no backend service.** Decks are typed TS modules; the server does
   filtering, seeding and signing only.
8. **Decks never reach the client bundle.** Word lists are imported only from
   `server/*.server.ts` and delivered one round at a time through a server
   function; a component that imports a deck file is a bug.
9. **No theme library.** The provider follows the shadcn TanStack Start recipe
   (`ScriptOnce` + `localStorage`). Do not add `next-themes` or any Next-branded
   package — this is not a Next app.
10. **Never commit on your own.** Wait for an explicit "commit" from the developer. A
    finished milestone, a green build or a passing test is not permission. Leave the work in
    the tree and report what is ready.
11. **Everything is type-safe.** `strict` is on, Biome rejects explicit `any`, and
    `pnpm typecheck` must pass. No `@ts-ignore` or casts to silence a real error: validate
    the boundary with zod and narrow the type instead.

## Architecture

```
src/
├─ games/                 # one folder per game, plus the shared round plumbing
│  ├─ registry.ts         # catalog: slugs, gradients, setup routes
│  ├─ game-card.tsx       # card shared by the landing and the app list
│  ├─ games-screen.tsx    # /games list
│  ├─ timer-bar.tsx       # round bar shared by both games
│  ├─ use-countdown.ts    # ms countdown + clock helpers
│  ├─ use-round-cues.ts   # last-seconds ticks + end cue, shared by both games
│  ├─ use-wake-lock.ts    # screen stays awake during a round
│  ├─ haptics.ts          # navigator.vibrate patterns
│  ├─ spy/
│  │  ├─ setup.tsx        # names + spy count form
│  │  ├─ play-screen.tsx  # handoff → deal → discuss → vote → reveal
│  │  ├─ rules.ts         # limits, phases, player encoding
│  │  ├─ use-round.ts     # round state, cues and handlers
│  │  ├─ assign.ts        # assignSpies
│  │  ├─ setup-schema.ts  # player validation
│  │  ├─ components/spy-count-field.tsx
│  │  └─ panels/{deal,handoff,discuss,vote,reveal}-panel.tsx
│  └─ charades/
│     ├─ setup.tsx        # duration + deck
│     ├─ play-screen.tsx  # intro → countdown → stage → results
│     ├─ rules.ts         # durations, phases, answer type
│     ├─ use-round.ts     # round state, cues and handlers
│     ├─ motion-sensor.ts # gravity check, permission, iOS detection
│     ├─ use-motion-probe.ts  # can this device give us tilts?
│     ├─ use-tilt.ts      # tilt gesture
│     └─ screens/{intro,countdown,results}-screen.tsx + play-stage.tsx
├─ decks/                 # where round words come from: server packs,
│                         # the shared picker, and the player's own decks (at /decks)
│  ├─ categories.ts       # zod-free taxonomy + search-param validator (client-safe)
│  ├─ contract.ts         # zod schemas for the word banks
│  ├─ custom-decks.ts     # localStorage store
│  ├─ share-deck.ts       # deflate + base64url share payload
│  ├─ deflate.ts          # deflate/inflate helpers
│  ├─ functions.ts        # getRoundFn server function (client-safe)
│  ├─ pick.ts             # random index + remove from pool
│  ├─ use-custom-decks.ts
│  ├─ use-round-words.ts  # server or local words for one round
│  ├─ pack-icons.ts
│  ├─ decks-screen.tsx    # list, share, delete
│  ├─ deck-editor-screen.tsx  # create + edit
│  ├─ import-screen.tsx   # shared link -> localStorage
│  └─ components/{category-field,deck-form,deck-list,picker-section,share-deck-sheet}.tsx
├─ landing/{landing-page,sections/*}.tsx
├─ settings/settings-screen.tsx
├─ documents/{about-page,error-page,legal-page,not-found-page,document-page,document-section}.tsx
├─ ui/                    # shadcn primitives + app-wide visuals and small UI hooks
├─ providers/{query,theme}-provider.tsx
├─ layout/{app-shell,phone-gate}.tsx
├─ config/{app,games,seo,site,version}.ts
├─ i18n/{en,es,index}.ts
├─ data/{spy,charades,packs}/  # server-only word banks — the client-bundle
│                         # boundary; imported only by server/decks.server.ts
├─ server/decks.server.ts      # server-only deck registry (zod-validated)
├─ lib/{sound,utils}.ts
├─ dev/tokens-page.tsx    # dev-only styleguide body
├─ styles.css             # tokens (@theme inline) + utilities + base layer
├─ routes/                # thin adapters only: config, search, head, screen
│  ├─ __root.tsx          # document shell, <html lang>, providers
│  ├─ index.tsx           # / -> /es
│  ├─ $lang.tsx           # validates lang, renders Outlet
│  ├─ $lang/index.tsx     # landing (all devices, indexable)
│  ├─ $lang/about.tsx
│  ├─ $lang/legal.tsx
│  ├─ $lang/_app.tsx      # pathless layout: phone gate for app routes only
│  ├─ $lang/_app/games/…  # list + <game>/{setup,play}
│  ├─ $lang/_app/decks/…  # list, new, edit, import
│  ├─ $lang/_app/settings.tsx
│  └─ dev/tokens.tsx      # adapter for /dev/tokens; 404 in production
└─ router.tsx
```

Also: `public/icons/**`, `public/robots.txt`, `public/sitemap.xml` and `public/og-{es,en}.png`
(static assets); the PWA manifest is
generated from `app.name` by a Vite plugin — never commit a manifest with the name in it.

The rule the tree expresses: **domain folders hold the product; `routes/` is
the URL map; `data/` + `server/` are the server-only boundary.**

### Where to look

| I want to… | go to |
|---|---|
| change a spy screen | `games/spy/panels/*` (`play-screen.tsx` for phase flow) |
| change a charades screen | `games/charades/screens/*` |
| tweak a round's timing or limits | `games/<game>/rules.ts` |
| change round state or cues | `games/<game>/use-round.ts` |
| add words to a themed pack | `data/packs/{es,en}.ts` |
| add a themed pack | `data/packs/{es,en}.ts` + `decks/categories.ts` (the only pack list) + `i18n/{en,es}.ts` + `decks/pack-icons.ts`. The zod pack schema derives its keys from the taxonomy. |
| fix the deck share QR | `decks/components/share-deck-sheet.tsx` |
| fix custom deck storage | `decks/custom-decks.ts` |
| change what a URL renders | `routes/**` (each adapter imports its screen) |
| add game three | `games/<slug>/` + `data/<slug>/{es,en}.ts` + `config/games.ts` (the slug tuple) + `games/registry.ts` (entry + gradient) + `styles.css` (three `--game-<slug>-*` tokens) + `server/decks.server.ts` + i18n `games.<slug>` + two route files. The zod game enums in `decks/contract.ts` and `decks/functions.ts` derive from the tuple. |
| edit the marketing page | `landing/sections/*` |
| tweak a shared visual | `ui/*` |
| change OG or canonical tags | `config/seo.ts` (static tags in `routes/__root.tsx`) |

**Sound (M7):** Web Audio only, no audio assets — noise ticks in the last 10 seconds, three
beeps plus a descending tail for the end cue, a deflating glide for "pass" and a rising
arpeggio for "correct", all through one compressor so they carry in a loud room, plus
`navigator.vibrate` on Android. The AudioContext is installed once by the app shell on the first interaction. A mute toggle
persists in `localStorage` under the brand-free key `app.sound`. iOS honours the hardware
silent switch, so sound is reinforcement, never the only cue — the visual countdown stays.

Spy round state lives in `games/spy/use-round.ts`: assignment (`assignSpies`) and the
word (`getRoundFn`, count 1) are created once when the round starts. `ssr: false` on the play
route is deliberate — dealing roles on the server would leak the spy through the payload and
mismatch on hydration.

Custom decks are the one exception to the server path: they live in
`localStorage` under `app.decks`, are picked on the phone by `useRoundWords`, and are shared
as a whole deck inside a URL (`/decks/import?d=<deflate-raw + base64url>`) that the receiving phone
decodes, validates with zod and only stores after the player confirms. The JSON is deflated
before base64url so even a full 60-word deck fits a QR (~330 chars); links without the `2.`
prefix are the old plain-base64 format and still import. Nothing about them reaches the server
or the client bundle; the QR is generated from that same link.

The role card looks the same for spy and word (same surface, same border): only the ink
changes, so the phone's glow cannot give the spy away in a dark room. Every role is preceded
by a 5s hand-off (including the first player and after "Otra ronda") so whoever is holding
the phone when they tap "siguiente" never sees the next role.

Charadas plays on a full-viewport `stage-landscape` layer (it leaves the 430px column): the
phone sits horizontally on the forehead. If the device is rotation-locked the stage is rotated
90° so the word still reads upright; flip the `rotate: 90deg` in `styles.css` if a device reads
upside down. Tilt uses `devicemotion.accelerationIncludingGravity.z` against a baseline captured
at round start, with a latch that requires returning near the baseline before the next gesture.

Data flow — no DB:

```
TS deck -> server/decks.server.ts -> getRoundWords(game, locale, count, category) -> useQuery
```

Screens are static until a round starts. The games list does **no** network work; the
round fetches exactly `count` words for that game + locale, never the whole deck and never
a deck id. Client fetches use **TanStack Query** so a screen can show its own `isPending`
state (a spinner rendered while `isPending`) instead of blocking navigation on a loader.
The router has no pending config: screens own their own loading UI.

Game state lives in **validated search params** (`category`, `players`, `spies`, `duration`). No seed: words (and later roles) are picked once when the round starts, so a
reload starts a fresh round — that is the intended behaviour, not a bug. Play routes are
`ssr: false` because they need sensors, timers and wake lock.

Deck data has two shapes (`decks/contract.ts`): each game owns a classic list
(`data/<game>/<locale>.ts`, `{ id, game, locale, label, items[] }`), and the themed packs
are shared by both games per locale (`data/packs/<locale>.ts`, `movies`, `disney`,
`actors`, `objects`, `kitchen`, `gaming`, `animals`, `music`, `sports`, `food`, `places`,
`brands`).
Word banks are TS modules that `satisfies DeckInput` / `satisfies PackInput`, so a typo or a
missing pack fails `typecheck`; zod still parses them at server boot as a last guard. They
live only in `server/decks.server.ts`; the client asks for a round by `game` + `locale` +
`category` (`mixed` draws from the classic list and every pack) and gets back `count` words.

## Principles

**KISS.** The smallest thing that works, in the fewest places. One obvious code path beats
three configurable ones. If a feature needs a flag to be safe, the flag is usually the
design bug — delete the flag and pick one behaviour.

**YAGNI.** No parameters, options, tokens, abstractions or exports for a case that does not
exist yet. Unused exports, message keys and CSS tokens are debt, not preparation: delete
them. Do not build M8 while in M6 (no room/online code, no second deploy target, no theming
API until something asks for it).

**Small units.** A component should read in one screen: aim for **~120 lines max**, and split
by responsibility, not by line count alone. Route files stay thin — route config, state and
effects — with the screen they render living in its domain (e.g. `src/games/charades/*`).
Extract a hook when state logic outgrows the JSX, and a subcomponent when a block has its own
props or its own conditional. One job per file, named for the job.

**Deleting is progress.** When a milestone lands, remove what it made obsolete (scaffold
placeholders, dead copy, superseded helpers) in the same change.

## Conventions

- Tabs, double quotes, semicolons — enforced by Biome. Run `pnpm check --write`.
- **Braces are mandatory**: `useBlockStatements` rejects `if (x) return;`. No single-line ifs.
- **Arrow functions only**: `const Foo = () => {}`, never `function Foo()`. Biome's
  `useArrowFunction` only covers function *expressions* (declarations are not linted yet), so
  keep the shape by hand; route components are declared before `createFileRoute` because
  arrows are not hoisted.
- Kebab-case filenames; named exports (`export const AppShell = ...`), not default exports.
- Route files export `Route = createFileRoute(...)`; components are arrow consts.
- Comments explain *why*, especially where a choice is non-obvious (e.g. the
  `system` theme branch, `accent-ink`). No narration of what the code does.
- Prefer `Sheet` (bottom sheet) over `Dialog` for overlays; `AlertDialog` only for
  destructive confirms.
- **Playful, never busy.** The UI is stickers on a table: thick borders, `shadow-sticker*`,
  display-font headings and one accent fill per block. A tilted element (a `-rotate-2`
  sticker, a hand-placed label) adds energy, but keep it to one or two per screen — never
  rotate body copy, inputs or anything tappable.
- **Too many options go in a sheet.** Chips work up to two rows; past that, show the chosen
  value in a summary row and put the full list in a bottom sheet with described cards
  (the deck picker is the reference).
- Spanish copy is written for Colombia — casual, funny, no Spain-Spanish. Never
  machine-translate deck words; slang is the product.

## i18n

- `en.ts` is the source of truth; `es.ts` is typed `Messages`, so a missing or renamed
  key fails `typecheck`. Never read `en` directly in a component.
- A route gets its copy with `const m = getMessages(lang)`; `lang` comes from
  `Route.useParams()` on a `/$lang` route.
- Values use `{placeholders}` and `interpolate(m.some.key, { app: app.name })`.
- Counts go through `plural(locale, count, { one, other })` — `Intl.PluralRules`,
  never string concatenation.
- Switching language navigates to the same path in the other locale. Losing the
  cookie is deliberate: the bare domain always enters at Spanish.
- `/$lang` parses with `z`-style validation: anything that is not `es`/`en` throws
  `notFound()` (a real 404, not a redirect).

## Adding a shadcn component

**Check what is already vendored first.** `src/ui` holds the source of every primitive we use;
grep it (and `package.json`) before installing anything. If the primitive exists but the part a
screen needs is missing, extend that file instead of installing a second copy. Only install when
nothing in `src/ui` does the job, and validate the new file before using it:

```bash
pnpm dlx shadcn@latest add <component> -y < /dev/null
```

The CLI's `init` needs a TTY and will hang; it is already configured, so only `add`
is used. After adding, always check the new file:

- the CLI writes to `src/ui` (aliases in `components.json`);
- imports must be `@/lib/utils`, not `cn` (the registry leaks a `cn` package that
  must not stay in `package.json`);
- strip `"use client"` directives (not a Next app);
- the registry may add `cn`/`next-themes` back to `package.json` — remove them;
- keep only what the screens use: unused exports, variants nobody selects and props fixed at
  one value are dead code. `Field`, `DropdownMenu` and `Card` were trimmed this way; add the
  prop back when a second real caller needs it.

Some primitives are vendored for the styleguide only (`Dialog`, `Tabs`, `Skeleton` and
`Separator`); prefer composing the ones a screen already uses over adding another.
When a screen would otherwise hand-roll a control that the registry ships, say which component
you would add and why before installing it.

Then `pnpm check --write && pnpm typecheck`.

## Verification before handing anything off

1. `pnpm typecheck && pnpm check` — clean.
2. `pnpm build` — succeeds; confirm the styleguide still 404s in production.
3. Smoke the built Worker: `pnpm build && pnpm preview`.
4. Check SSR HTML: real content (not an empty shell), `<html lang>` matches the URL,
   title/description localized, `theme-color` resolves from the token.
5. Check the locale entry: `/` always 307s to `/es`, whatever the headers or
   cookies; `/en` still renders the English landing.

Known noise: Rolldown prints `MODULE_LEVEL_DIRECTIVE` warnings for `"use client"` in
`lucide-react`. Pre-existing and harmless.

## Gotchas

- **Port 3000 is often taken by another app.** Vite moves to 3001; read the log instead
  of assuming.
- `src/routeTree.gen.ts` is generated by dev/build — don't hand-edit it.
- Hydration mismatches come from anything computed at render time (`matchMedia`,
  `document`, `localStorage`). Read browser APIs in effects; the theme class is applied
  by `ScriptOnce` before paint, deliberately.
- `--force-dark-mode` in headless Chromium fakes dark mode; it does **not** prove our
  tokens. Set `localStorage['app.theme']` instead.
- The dev styleguide ships as a lazy chunk in production (404s at runtime). It will be
  removed in M8.
- **Restart the built server after every `pnpm build`.** The running process keeps the
  old asset manifest, so the HTML points at hashed files that no longer exist: every
  script 404s, nothing hydrates, and components look broken (empty QR, dead buttons)
  when the bug is the harness.
- Canonical/hreflang/OG URLs only appear when `VITE_APP_ORIGIN` is set at build time.
  Empty is correct for dev; set it for the deploy.
- Headless screenshots with `captureBeyondViewport` show page content *below* the fixed
  gate overlay. That is a capture artifact, not a layout bug.
- `pointer: fine` cannot be tested headlessly (it reports `none`) and is unreliable on
  touchscreen laptops — that is why the gate keys off viewport size instead.

## Roadmap

| # | Milestone | State |
|---|---|---|
| M0 | Scaffold (TanStack Start, biome, nitro, tailwind) | committed |
| M1 | Tokens, light/dark, shadcn foundation, styleguide | committed |
| M2 | i18n (`/$lang`), home, games list, settings, phone QR gate | committed |
| M3 | Landing at `/$lang`, gate moved to `_app`, SEO, manifest, icons, robots | committed |
| M4 | Deck contract, ES/EN banks, shuffling, `getRoundWords` | committed |
| M5 | Spy end-to-end: setup, hold-to-reveal deal, timer, vote, reveal, another round | committed |
| M6 | Charadas: setup, countdown, tilt correct/pass, tap fallback, results | awaiting test |
| M7 | Timer sound + haptics (Web Audio, mute toggle) | awaiting test |
| M8 | Streamed home, a11y, bilingual Playwright, screenshots, deploy notes | |

Each milestone ends with the verification list above, then a handoff asking the user to
test — do not roll into the next milestone unprompted.
