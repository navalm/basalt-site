# Basalt site — plan

## Decisions (2026-10-18)

- Alpha is **free**; the app is **closed source** (the FAQ says so; the pitch rests on open
  *formats*, not open code).
- Install: `brew install --cask navalm/tap/basalt` (Apple silicon, unsigned alpha: "Open Anyway").
- **Waitlist** for 1.0: one email when the signed public release ships. Stored in Cloudflare D1.
- Hosted at **basalt.navalm.com** on a Cloudflare Worker (static assets + `/api/waitlist`);
  a dedicated domain may come later (see README, "Deploy").
- Astro static output, hand-written CSS mirroring the app's tokens, no client framework.

## Page (built)

1. Hero: "Your money is a folder." + install command + the file → app demo (a row typed into
   `Ledger/Amex Gold/2026.csv` shows up in Spending; Basalt writes the row's id back).
2. Files over app: you own it · back up/sync with anything (git diff) · ready for local LLMs.
3. Fast: measured numbers (85 ms open of 100k transactions, <13 ms view switches, 6 ms edit →
   frame) + the ledger screenshot.
4. Power-user features, each with a "show the file behind it" toggle: ```basalt blocks, graph,
   subscriptions, investments, Rules.csv, budgets; then a grid of smaller features.
5. Coming later: a `basalt` CLI (same engine and query language; JSON for agents).
6. Install steps + waitlist card. 7. FAQ. 8. Footer.

## Next

- [ ] Deploy (README → Deploy): `wrangler login`, create D1, paste its id, `npm run deploy`.
- [ ] In the app repo, point the cask's `homepage` at https://basalt.navalm.com (next release).
- [ ] Retina (2×) screenshots: `scripts/shots.sh` on a Retina display.
- [ ] A short screen recording of fast inline ledger edits for the Speed section
      (`screencapture -v -l <window id>` + `BASALT_LEDGER_EDIT`), < 600 KB WebM/MP4, lazy.
- [ ] Optional: Cloudflare Web Analytics (cookieless) if page counts are wanted; footer says
      "No cookies, no tracking", keep it true.
- [ ] When 1.0 ships: export the waitlist, send one email, update the hero + FAQ.
