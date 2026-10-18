# basalt-site

The marketing site for [Basalt](https://basalt.navalm.com), a local-first personal finance app
for macOS that keeps your money in a folder of plain files.

A single static page (Astro, no client framework) served by one Cloudflare Worker, which also
handles the waitlist form (`POST /api/waitlist` → a D1 table). The app itself is closed source
and lives elsewhere; this repo only has the site.

```
src/pages/index.astro        the page: hero, files-over-app, speed, features, CLI teaser, install, FAQ
src/components/FileDemo.astro the hero animation (a CSV edit flowing into the app)
src/components/Features.astro feature rows: screenshot ⇄ "the file behind it" (CSS-only toggle)
src/components/Waitlist.astro the email form (works without JavaScript)
src/styles/global.css        design tokens, mirrored from the app's theme
worker/index.js              static assets + /api/waitlist
worker/schema.sql            the waitlist table
public/shots/*.webp          app screenshots (demo data), from scripts/shots.sh
scripts/og.html              source of public/og.png (the social card)
```

## Develop

```sh
npm install
npm run dev                # http://localhost:4321 (static pages only, no /api)
npm run db:init:local      # once: create the local waitlist table
npm run preview            # build + wrangler dev: site and /api/waitlist on http://localhost:8787
```

Budget: no client framework, under 10 KB of JavaScript, images lazy-loaded with explicit sizes,
every animation honors `prefers-reduced-motion`.

## Deploy (Cloudflare)

`navalm.com` is already on Cloudflare, so the Worker can claim `basalt.navalm.com` itself.

```sh
npx wrangler login
# (done) the D1 database basalt-waitlist exists; its id is in wrangler.jsonc
npm run db:init                          # create the table in the remote database
npm run deploy                           # astro build && wrangler deploy (also sets up basalt.navalm.com)
```

To move to another domain later: add it to `routes` in `wrangler.jsonc`, update `site` in
`astro.config.mjs`, deploy, then redirect the old hostname (Cloudflare → Rules → Redirect Rules).

## Waitlist

Stores only `email` and `created_at`; no IP addresses, no user agent. Rate-limited to 5
submissions per minute per IP, with a honeypot field for bots, and every valid address gets the
same reply whether or not it was already on the list.

```sh
npm run waitlist:export     # JSON dump of every signup
```

When 1.0 ships, send the announcement through any mail service (import the export), then
delete the table or keep it for the next announcement as you prefer.

## Screenshots

`scripts/shots.sh` drives the app repo's `scripts/shot.sh` (demo data, both themes) for every
entry in `scripts/shots.tsv`, writes PNG masters to `shots-src/` (gitignored) and WebP to
`public/shots/`. Needs the app repo checked out next to this one (or `BASALT_REPO=/path`) and
`cwebp` (`brew install webp`).

```sh
scripts/shots.sh                   # everything
THEMES=dark scripts/shots.sh graph # one shot, one theme
```

The social card: edit `scripts/og.html`, then `npm i --no-save playwright && npx playwright
install chromium && node scripts/og.mjs`.

## Facts on the page

Keep them true. The speed numbers come from the app repo's `tests/perf.rs` (release build,
Apple M4, generated 100,000-transaction vault); re-measure before changing them. The demo rows,
totals and the LLM/CLI examples are computed from the app's demo vault as of 2026-09-28.
