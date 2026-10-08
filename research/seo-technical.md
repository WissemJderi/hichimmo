# Research: Free per-route SEO for this Vite React SPA (issue #3)

Scope: titles/meta, sitemap, prerendering, JSON-LD. Research only, no decision — this
feeds the later grilling ticket.

## Ground truth (read from the clone)

| Fact | Value |
|---|---|
| Build | Vite 7.3, `tsc -b && vite build`, no SSR/prerender plugins |
| Router | `react-router` 7.12 in **declarative mode**: `BrowserRouter` + `<Routes>` in `src/main.tsx` (not even data mode, not framework mode) |
| Routes | `/`, `/listings`, `/listings/:id`, `/admin/login`, `/admin/dashboard`, `/admin/new-property` (last three behind `ProtectedRoute`) |
| Entry HTML | `index.html` has one `<title>`, one description, `robots: index,follow`. **No OG, no canonical, no JSON-LD anywhere** (`grep` over `src/`, `index.html`, `public/` = zero hits) |
| Hosting | Vercel, `vercel.json` = catch-all rewrite `/(.*) -> /index.html`. No `api/` dir, no `robots.txt`, no `sitemap.xml` |
| Data | REST API `https://dahechimmo-backend.onrender.com/api` (Render free). Verified live: `GET /properties` returns `_id` per listing, `x-total-count: 133` |
| Linking | `PropertyCard` uses react-router `<Link to={/listings/${_id}}>` → real `<a href>`, crawlable **after** JS renders |
| Brand | "Dahech Immo", French/Arabic content, Tunisia |

Vercel routing detail that matters: docs state "precedence is given to the filesystem
prior to rewrites being applied" — so a static `dist/robots.txt` / `dist/sitemap.xml`
is served fine despite the catch-all rewrite. A Vercel Function under `/api` also
works ("for `other` frameworks … Vercel will deploy any file in the /api directory");
if the catch-all shadows it, add an earlier explicit rewrite or `handle: filesystem`.

## What search engines actually see from an SPA today (2026)

- **Googlebot renders JS.** Google queues 200-status pages for rendering and indexes
  the rendered HTML; titles/descriptions set by JS are read. But: render queue delays
  (seconds to much longer), no hard SLA, and Google explicitly still recommends
  prerendering because "not all bots can run JavaScript."
- **Social/AI crawlers do not render JS.** Facebook/WhatsApp/LinkedIn/X, GPTBot,
  ClaudeBot, PerplexityBot fetch raw HTML only (Vercel measured: they download JS
  files but never execute them; Gemini is the exception, it rides Googlebot). So
  OG/Twitter tags, canonical, and JSON-LD that exist only after hydration are
  invisible to them.
- **Google reads canonical both before and after JS** (confirmed in Google's March
  2026 "Inside Googlebot" post). Meta in the initial response is still the safe bet.
- Practical read for this repo: Google *can* index it, but every URL currently serves
  the same shell, so titles/descriptions/canonicals are undifferentiated until render,
  and share previews + AI crawlers see nothing.

## Area A — per-route title/meta in a react-router v7 SPA

| Approach | Verdict |
|---|---|
| **react-router v7 `meta` export / `<Meta />`** | **Framework mode only.** The official modes table shows `Meta` ✅ framework, blank for data/declarative. This repo is declarative mode; no `meta` API without migrating. |
| **React 19 native hoisting** (render `<title>`, `<meta>`, `<link>` in components; React puts them in `<head>`) | Works in this exact stack, zero dependencies (React 19.2.3 already installed). Works for client-side routing; title updates on navigation. Still only exists **after** JS runs. react.dev, Vercel blog, EpicWeb all confirm. |
| **react-helmet-async v3.0.0** (Mar 2026) | Actively maintained again (Snyk: sustainable, 2.4M weekly), explicitly React-19-aware — on React 19 `<Helmet>` just renders tags and lets React hoist. Its own README says: if you don't need `titleTemplate`/`htmlAttributes`/SSR serialization, "React 19's built-in metadata handling may be sufficient." Adds a dependency for near-zero benefit here. |
| **`document.title = ...` in `useEffect`** | Works, no deps, but title-only; OG/canonical/JSON-LD still manual DOM hacks. Fine for a 3-route app, gets messy at 10. |
| **Standalone libs** (`react-helmet`, `@dr.pogodin/react-helmet`, `power-seo`, `@unhead/react`) | All CSR-only head management; same fundamental limit as React 19 hoisting (post-JS). `react-helmet` itself is long dead; forks exist but none change the "crawlers that don't run JS see nothing" fact. |

**Bottom line A:** in declarative mode the only free per-route options are React 19
hoisting (recommended baseline, zero-dep) or a helmet lib (marginal). Real "meta in
the initial HTML" requires either prerendering or a framework `meta` export.

## Area B — prerendering / SSG without a framework migration (names verified 2026)

| Tool | Status 2026 | Notes |
|---|---|---|
| **`vite-prerender-plugin`** (preactjs org) | **Maintained** — v0.5.13, ~500k weekly downloads, Vite 4–7 | Framework-agnostic: you export `prerender()` from a script, return `{ html, links }`, optionally set `head` (title, `og:*`) per route. Can `fetch()` the API inside `prerender()`. Good fit for "static shell + correct head, content still client-rendered." |
| **`react-snap`** | **Dead** — last release 2018 (7y), Snyk "Inactive", 153 open issues; built around `ReactDOM.render/hydrate`, APIs removed in React 19 | Does not fit this stack. |
| **`vite-plugin-prerender`** | **Dead** — v1.0.8 four years ago, Snyk "Inactive" | No. |
| **`vite-plugin-prerender-static`** (new, Jan 2026) | Brand new, 0 stars, 5 commits | Untested ecosystem risk. |
| **Vike (ex `vite-plugin-ssr`)** | Maintained (renamed; vite-plugin-ssr sites say "use Vike"); vike-react extension, in Vite's ecosystem CI | Real SSG/SSR/SPA per page, but file-based `pages/` restructure = architecture migration (L). Dynamic-route prerender on static hosts is a documented pain point (vike.dev/prerender, discussion #1476). |
| **React Router 7 framework mode** | Maintained; `@react-router/dev` + `react-router.config.ts`; **Vercel has first-class docs + `@vercel/react-router` preset** | Gives `meta` exports, loaders, and `prerender: [...]` (paths or async `getStaticPaths` that can fetch the API for the 133 ids), or `ssr:false` SPA mode. With `ssr:false + prerender` you get static HTML per route + an SPA fallback. Migration from declarative `BrowserRouter` → `routes.ts` route modules: M/L. Free on Vercel Hobby (functions included). Note: RR v8 is current (upgrade guide live), so migration lands on a moving-but-supported line. |
| **Astro / Next.js migration** | Both free-tier friendly on Vercel | Full rewrite of layout/routing/auth; L/X for a site with 6 routes + an admin. Listed only for completeness. |

## Area C — sitemap.xml + robots.txt for an SPA with API-driven ids

Facts:
- Static `public/robots.txt` with `Sitemap: https://…/sitemap.xml` just works
  (filesystem beats the catch-all rewrite).
- Sitemap **can** list `/listings/:id` only if ids are known where the sitemap is
  generated. Ids are not in the build, but the API is public and live (verified:
  `GET /properties` → `_id`, `x-total-count: 133`). So:

| Sitemap strategy | Free? | Upside | Downside |
|---|---|---|---|
| **Build-time fetch** (a small script/vite plugin runs `GET /properties` during `npm run build`, writes `public/sitemap.xml`) | Yes | One static file, no runtime cost, includes all detail URLs | Stale until next deploy; Render free-tier cold start can fail the build → fetch must be non-fatal (fall back to static routes only) |
| **`vite-plugin-sitemap`** (jbaubree; v0.8.2, 3 months ago, maintained) | Yes | Handles `dynamicRoutes`, `exclude` (`/admin`), robots.txt generation | In a SPA `dist/` contains only `index.html`, so it still needs the API-fed `dynamicRoutes` array from somewhere |
| **Vercel Function** (`api/sitemap.xml.ts` fetches API per request) | Yes (Hobby functions) | Always fresh as listings change | Adds a function + caching concern; each hit proxies a possibly-cold Render API; needs an explicit `/api` rewrite ahead of the catch-all if shadowed |
| **Omit detail URLs** (sitemap = `/`, `/listings` only) | Yes | Trivial | Detail pages rely on link discovery from `/listings` — works (React Router renders real anchors) but weaker; 133 URLs are cheap to list |
| Scheduled rebuild (GitHub Action cron → push to trigger Vercel build) | Yes | Keeps build-time sitemap fresh | CI complexity for marginal gain |

robots.txt gotchas: `Disallow: /admin` blocks crawling but **does not deindex**
(already-URLs can appear without content). Proper deindex = `noindex` meta or
`X-Robots-Tag: noindex` response header — the header can be set in `vercel.json`
`headers` for `/admin/*` today, no code change, and it works pre-JS. Don't combine
disallow + noindex on the same URL (Google says pick one; noindex is the right one).

Also missing today: **canonical**. `/listings?page=2&location=sousse` variants exist;
without per-route canonicals Google picks its own. Canonical needs to be in the
initial HTML (Google processes it before *and* after render).

## Area D — JSON-LD: what's valid and what's useful

| Type | Valid? | Google rich result? | Notes for this site |
|---|---|---|---|
| **`RealEstateAgent`** (subtype of `LocalBusiness`) | Yes, schema.org; Google's LocalBusiness docs accept the most specific subtype | **Yes — Local Business rich result** (name required; address/url/telephone/`openingHoursSpecification`/`areaServed` recommended). Knowledge panel not guaranteed | Best single piece of JSON-LD for a one-agent agency: one block on the homepage (site identity). Marked-up content must be visible on the page (Google guideline) — the homepage `AboutAgent` section qualifies. `areaServed` (Tunisia / Sousse) matters for local intent |
| **`RealEstateListing`** | Yes, schema.org (10K–100K domains per Google's own index); `WebPage` subtype with `offers` (price, priceCurrency TND), `datePosted`, `primaryImageOfPage` | **No dedicated Google rich-result type** (not in Google's supported list; the lodging ones — Hotels, Vacation rentals — don't fit general sale/rent listings) | Still worth it for Bing/AI engines (ChatGPT/Perplexity/Google AI parse JSON-LD heavily) and entity understanding. Goes on `/listings/:id` built from the fetched listing. Client-injected → invisible to non-rendering crawlers unless prerendered |
| **`BreadcrumbList`** | Yes | **Yes — Breadcrumbs rich result** | App already has a `Breadcrumb` component on detail pages; markup mirrors visible UI. Cheap win |
| `Organization` alone | Yes | Yes (Organization) | Redundant if `RealEstateAgent` is used (LocalBusiness is an Organization subtype) |
| `WebSite` + `SearchAction` (Sitelinks searchbox) | Valid | **No** — Google dropped the sitelinks searchbox in Sept 2024 | Skip |
| `AggregateRating` / reviews on listings | — | Only for reviews of *other* businesses; self-serving reviews are ineligible | Skip (also issue #12 territory: no testimonials) |

## Options table

| # | Option | Fits this stack? | Effort | Free? | Notable downside |
|---|---|---|---|---|---|
| 1 | React 19 native `<title>/<meta>` hoisting per route (zero deps) | Yes, exactly (React 19.2, declarative RR) | **S** | Yes | Meta exists only after JS; social/AI crawlers see nothing; no static canonical/OG |
| 2 | react-helmet-async v3 | Yes (React-19 aware) | S | Yes | Near-redundant with #1; extra dep; same post-JS limit |
| 3 | `document.title` in effects | Yes | S | Yes | Title-only; manual bookkeeping |
| 4 | react-router v7 framework mode (`meta` export + `prerender` + loaders) | Partial — needs mode migration (`routes.ts`, `@react-router/dev`, Vercel preset) | **M/L** | Yes (Vercel Hobby) | Architecture change touches entry, admin guards, lazy routes; largest of the SPA-preserving options |
| 5 | `vite-prerender-plugin` — build-time static shell + per-route head for `/` and `/listings` | Yes (Vite 7) | **M** | Yes | You write the `prerender()` script; detail routes need API ids at build; page content stays client-rendered unless you also render data |
| 6 | react-snap | **No** — dead since 2018, incompatible React 19 APIs | M | Yes | Unmaintained |
| 7 | `vite-plugin-prerender` (Rudeus3Greyrat) | **No** — 4 years stale, Snyk inactive | M | Yes | Unmaintained |
| 8 | Vike (ex vite-plugin-ssr) | Vite-native but file-based restructure | **L** | Yes | Framework-ish migration; dynamic-route prerender on static hosts is fiddly |
| 9 | Astro or Next.js rewrite | Works on Vercel | **L/X** | Yes | Rewrites a working app; overkill for 6 routes |
| 10 | Custom per-route HTML shells (script copies `index.html`, injects head, hydrates same bundle) | Yes | M | Yes | You own the hack; no framework support |
| 11 | Static sitemap via build-time API fetch + static `robots.txt` | Yes | **S** | Yes | Stale between deploys; API cold start must not fail the build |
| 12 | `vite-plugin-sitemap` | Yes (maintained) | S | Yes | SPA `dist` has one HTML file → `dynamicRoutes` still need API ids |
| 13 | Vercel Function `api/sitemap.xml` (fresh ids on request) | Yes (Vercel deploys `/api` for Vite) | S/M | Yes (Hobby) | New runtime surface; cold Render API; possible catch-all rewrite ordering fix |
| 14 | Sitemap lists only `/` + `/listings` (skip detail URLs) | Yes | S | Yes | Weaker discovery signal for 133 detail pages |
| 15 | `X-Robots-Tag: noindex` on `/admin/*` via `vercel.json` headers | Yes | **S** | Yes | Header-based, not visible in code review of React; keep in sync if admin moves |
| 16 | JSON-LD `RealEstateAgent` on homepage | Yes | S | Yes | Requires visible matching content; no guaranteed rich result |
| 17 | JSON-LD `RealEstateListing` on `/listings/:id` | Yes | S/M | Yes | No Google rich result; client-injected = invisible to non-JS crawlers unless prerendered |
| 18 | JSON-LD `BreadcrumbList` on detail pages | Yes | S | Yes | Needs markup to mirror visible breadcrumbs |

## Candidates to surface for the decision (not a recommendation)

1. **Stay SPA, ship the free basics.** React 19 native head tags per route +
   static `robots.txt` (with admin noindex header) + build-time sitemap from the API
   + `RealEstateAgent` JSON-LD. Effort S–M, no architecture change. Downsides:
   everything interesting still lives post-JS, so OG previews, AI crawlers and
   canonicals in the first byte stay weak.
2. **Stay SPA + build-time prerender of shells.** Everything in (1) plus
   `vite-prerender-plugin` (or a small custom script) emitting real HTML for `/`,
   `/listings` and ideally `/listings/:id` with baked title/description/OG/canonical/
   JSON-LD. Effort M. Downsides: prerender script to maintain, listing content still
   hydrates client-side, ids captured only as of build time.
3. **Migrate to react-router v7 framework mode** (`ssr:false` + `prerender`,
   `meta` exports, API-fetched `getStaticPaths` for the 133 ids). Effort M/L.
   Downsides: real refactor of entry/routing/admin; biggest change for a SEO-only
   ticket. Astro/Next are variants of the same trade (L).

The grilling ticket should also pin down two things that cut across all three:
per-route canonical policy for `/listings?...` query variants, and whether OG
share previews are actually a goal (if yes, option 1 alone can't deliver).

## Sources

- React Router modes table + `Meta` API (framework only): reactrouter.com `start/modes`, `api/components/Meta`
- React Router pre-rendering + SPA mode: reactrouter.com `how-to/pre-rendering`, `how-to/spa`
- Vercel React Router guide (`@vercel/react-router`, `ssr`, preset): vercel.com/docs/frameworks/frontend/react-router
- React 19 metadata hoisting: react.dev/reference/react-dom/components/meta, react.dev blog "React 19", Vercel "What's new in React 19"
- react-helmet-async 3.0.0 React 19 behavior: npm/github staylor/react-helmet-async README, Snyk health page
- JS rendering today: Google "Understand JavaScript SEO Basics"; Search Engine Land "No-JavaScript fallbacks in 2026"; Google "Inside Googlebot" (2026); Nuxt SEO "SPA SEO" (AI crawlers don't execute JS)
- Prerender tooling status: npm + Snyk pages for react-snap, vite-plugin-prerender; GitHub preactjs/vite-prerender-plugin; vike.dev
- Sitemap tooling: npm/github jbaubree/vite-plugin-sitemap; Vercel vercel.json docs ("precedence given to the filesystem prior to rewrites"); Vercel Functions API reference ("/api … for other frameworks")
- Structured data: schema.org/RealEstateListing, schema.org/RealEstateAgent, Google "Local business structured data", Google Search Console supported rich-result reports, Search Engine Land (2025/2026 rich-result retirements)
- API verified live 2026-10-08: `GET https://dahechimmo-backend.onrender.com/api/properties` (133 items, `_id`, `x-total-count`)
