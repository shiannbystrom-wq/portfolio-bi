# portfolio-bi

Portfolio / CV site for **Shiann Lew Byström**, Business Intelligence Analyst student at Nackademin,
seeking a LIA placement December 2026 – April 2027.

The page is laid out as a BI report: a report navigation pane, a topbar with a theme picker, KPI tiles
and card grid. Three of the cards are live, interactive charts built from the sample data in
`src/app/data/chart-data.ts`.

## Stack

| | |
|---|---|
| Angular | 22.1 (standalone, zoneless, OnPush) |
| Tailwind CSS | 4.3 via PostCSS |
| i18n | ngx-translate 18 (Swedish + English, runtime toggle) |
| Charts | hand-written SVG — no charting library |
| Hosting | Cloudflare Workers static assets |

**Node 22.22.3+ or 24.15+ is required** by the Angular 22 CLI.

## Run it

```bash
npm install
npm start          # http://localhost:4200
npm run build      # -> dist/portfolio-bi/browser
npm test           # Vitest
```

## How it is put together

### Themes
Three themes — Varm (default), Kall, Midnatt — each one block of CSS custom properties in
`src/styles.css`, selected by `data-pal` on `<html>`. `ThemeService` writes the attribute and persists
the choice; a tiny inline script in `index.html` applies the stored value before first paint so the page
never flashes the wrong theme.

Tailwind reads the same tokens through `@theme inline`, so `bg-card` compiles to
`background-color: var(--card)` and follows the active theme. **Adding a fourth theme is one block of
variables — no component changes.**

### Charts
`ChartFrameDirective` measures its host with a `ResizeObserver` and exposes geometry as a signal. Charts
draw at the container's real pixel width, so one SVG user unit equals one CSS pixel and axis labels stay
legible on a phone instead of being scaled down with the viewBox. Below 430px the charts drop to
every-other axis label.

Each chart carries `role="img"` with a summarising label, real toggle buttons with `aria-pressed` for the
filters, an `aria-live` KPI row, and a visually hidden `<table>` with the same numbers.

### Content
- Facts (KPI values, project list, timeline, courses) — `src/app/data/site.ts`
- Chart data — `src/app/data/chart-data.ts`
- All prose — `public/i18n/sv.json` and `public/i18n/en.json`

## Placeholder content to replace

- **Project screenshots**: set `image` on an entry in `PROJECTS` to a path under `public/img/` and the
  empty slot is replaced. The slot is sized like the real image so nothing shifts. Shoot them at
  **2400 px wide, 16:9** — the card draws at ~360 px CSS, so anything under ~1500 px is soft on a
  phone or a retina laptop.
- **Chart data is simulated** and the UI says so. Replace the arrays in `chart-data.ts`; no chart code
  changes.
- **`EXAMPLE.se` in `src/index.html`** — the Open Graph tags need absolute URLs, so replace it with the
  real domain or social previews will not render.

## Numbers that derive themselves

Nothing on this page states a figure that someone has to remember to update:

- **"Klar %"** comes from `programmeProgress()` against `PROGRAMME.start`/`end`.
- **"Tidigare yrkesår"** is summed from `TIMELINE` by `priorWorkingYears()`, and the sentence above
  the experience table uses the same function, so the two can never disagree. It adds the spans of
  the roles; it does not measure start-to-end, and year labels hide months, so treat it as a round
  number rather than an exact one.
- **"Uppdaterad …"** formats `LAST_UPDATED` in `site.ts`. That one constant is the only thing to bump
  when the content changes.
- **The skills table** points each row at the project the tools were used in, instead of a self-rated
  bar. `site.spec.ts` fails the build if a row points at a project that no longer exists.

## Deploy

Static output, no server code.

```bash
npm run build
npx wrangler deploy          # first run opens a browser to authorise
```

`wrangler.jsonc` sets `not_found_handling: "single-page-application"`, which matters: without it, an
employer who refreshes on `/projekt` gets a 404.

For push-to-deploy, connect the repo in the Cloudflare dashboard (Workers → Builds):
build command `npm run build`, output directory `dist/portfolio-bi/browser`.

### Domain
Buy the `.se` from a Swedish registrar **separately from the host**, so the URL in already-sent emails
survives a hosting change. Registry fee is 92 kr/yr and identical for every registrar; expect
110–250 kr/yr all-in. Watch teaser pricing — 6 kr the first year renewing at 361 kr is worse over three
years than a flat 149 kr.

## Deliberately not here

No analytics (nothing to measure at this traffic, and it brings a cookie-banner obligation), no contact
form (a `mailto:` needs no backend), no CMS, no SSR. Fonts are self-hosted rather than pulled from Google
Fonts, so no visitor IP is sent to a third party.
