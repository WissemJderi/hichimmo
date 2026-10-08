# Research: Performance & accessibility audit (issue #6)

Repo: `WissemJderi/hichimmo` — branch `research/perf-a11y`
Method: fresh clone, `npm ci && npm run build`, bundle analyzed with `rollup-plugin-visualizer` (throwaway, reverted), `dist/` inspected, live API queried read-only, static review of all 39 `src/**/*.tsx`. Baseline is green: `npm run lint` clean, `npm test` 27/27 pass.

Bundle output (real):

| asset | raw | gzip |
|---|---|---|
| `dist/assets/index-*.js` (main, all routes except 2 lazy) | 457.06 kB | 151.59 kB |
| `dist/assets/index-*.css` | 32.89 kB | 6.59 kB |
| `Listings-*.js` (lazy) | 1.61 kB | 0.89 kB |
| `PropertyDetailPage-*.js` (lazy) | 3.43 kB | 1.42 kB |

Module weight share of the main chunk (pre-minification, from visualizer):

| group | share |
|---|---|
| react-dom | 43.1 % |
| motion / framer-motion / motion-dom / motion-utils | **27.5 %** |
| axios (both fetch *and* xhr adapters) | 8.4 % |
| app code `src/` | 7.2 % (of which admin = 2.5 %) |
| react-router | 6.2 % |
| embla-carousel | 3.9 % |
| react + scheduler | 2.4 % |
| react-icons | 1.3 % |

---

## Ranked performance findings

| # | Finding | Where | Impact | Effort |
|---|---|---|---|---|
| P1 | **46 MB of dead images ship in every clone/deploy.** `public/images/` = 67 folders, 465 WebP, all tracked in git (`.git` pack = 45.3 MiB). Zero references in `src/` and zero from the live API: all 133 listings / 584 image URLs point at `res.cloudinary.com`, none at `/images/*`. The only file mentioning them is the also-unused `src/properties.json` (4031 lines, no importer anywhere — `grep '\.json'` in `src/` is empty). `src/data.ts` (28 lines) *is* legitimately used (`PropertyTypeLocationSection.tsx:7`), keep it. | `public/images/**`, `src/properties.json:1` | Clone/deploy time, repo hygiene, CI checkout cost. No runtime cost (they are never fetched). | S |
| P2 | **Cloudinary images served with no transformations.** Sampled 9 live property JPEGs: avg 199 kB, max 310 kB, original filenames, no `w_`/`q_`/`f_auto`, no `srcset`/`sizes`, no `decoding="async"` anywhere in `src/`. Listing grid = 9 cards visible at once; detail page = up to 10 slides. This is the dominant payload for the Tunisian mobile audience and drives LCP on both key templates. | `src/services/propertiesService.ts`, `src/components/items/PropertyCard.tsx:36`, `src/components/items/Embla/EmblaCarousel.tsx:38` | Very high — multi-MB page weight on 3G/4G. | M |
| P3 | **CSR-only shell delays LCP.** `hero.webp` (190 kB, 1600×1200) is the LCP candidate but only enters the DOM after the 151 kB gz JS parses and executes. `index.html` has no `<link rel=preload>`/`fetchpriority`, no `preconnect`, no prerender/SSG of the static home shell. | `src/components/Hero.tsx:22-28`, `index.html:1-14` | High — LCP likely 2-4 s on mid-tier Android. | M |
| P4 | **Google Fonts loaded through a render-blocking CSS `@import`, with no preconnect and far too many weights.** `Lato` requests 9 weights + italics, `Montserrat` the full `100..900` variable range, though only a handful are used. Serial chain: HTML → CSS → `fonts.googleapis.com` CSS → `fonts.gstatic.com` files. `src/css/base.css:1` carries a second, *unused* Inter `@import` (file is never imported) and `src/App.css` is likewise never imported. | `src/index.css:1`, `src/css/base.css:1` | High on slow networks — text render delayed by 2-3 extra RTTs. | S |
| P5 | **framer-motion is 27.5 % of the main chunk and is only used for opacity/translate reveals** (9 files: `Hero`, `FeaturedListings`, `AboutAgent`, `ServicesOffered`, `CTA`, `Footer`, `Listings`, `PropertyDetailPage`, `PropertyCard`). Extra risk: every file imports `framer-motion`, but `package.json` declares only `motion` — `framer-motion` resolves as a *transitive* dep (`npm ls framer-motion` → `motion → framer-motion`), so a dependency update can silently break the build. | `src/components/*.tsx`, `src/pages/*.tsx`, `package.json:17` | High — biggest single reducible chunk after react-dom; also a build-fragility bug. | M |
| P6 | **Lazy routes have no `<Suspense>` boundary → blank page.** `React.lazy` for `Listings`/`PropertyDetailPage` is wrapped nowhere. Verified experimentally: with no boundary the entire tree renders as empty HTML until the chunk resolves, so a direct load of `/listings` or `/listings/:id` shows a completely blank screen (nav and footer included). | `src/main.tsx:15-16`, `src/main.tsx:27-50` | High UX cost on first visit to the two money pages. | S |
| P7 | **Admin UI ships to every visitor.** `Dashboard`, `AddPropertyForm`, `LoginPage` are statically imported (unlike `Listings`). Admin code alone = 2.5 % of module weight (~33 kB pre-min) plus its axios/auth paths. | `src/main.tsx:11-13` | Medium — easy win, matches the existing lazy pattern. | S |
| P8 | **axios ships both the fetch and the xhr adapter** (8.4 % of module weight) and is used for plain public GETs that `fetch` would cover. | `src/services/*.ts`, `package.json` | Medium. | M |
| P9 | **`vercel.json` has no `headers`.** Compression is fine (Vercel applies brotli/gzip to text automatically), but every asset falls back to `must-revalidate` + ETag instead of an `immutable` long-cache for content-hashed `/assets/*`; no `Cache-Control` on images, no security headers. Only `rewrites` present. | `vercel.json:1-3` | Medium — repeat-visit latency, avoidable revalidations. | S |
| P10 | **`loading="lazy"` is on *every* carousel image, including the first/visible slide** — the detail page's main image is lazy-loaded. It is also the only `loading=` usage in the codebase (1 of 7 `<img>`), and uses `object-fill` (distorts aspect ratio). | `src/components/items/Embla/EmblaCarousel.tsx:39-45` | Medium — delays the detail-page LCP image for no gain. | S |

---

## Ranked accessibility findings

| # | Finding | Where | Impact | Effort |
|---|---|---|---|---|
| A1 | **Mobile nav drawer has no keyboard containment.** It is always mounted and merely translated off-screen (`-translate-x-full`), so its links stay in the tab order while invisible. No focus trap, no `Escape` handling (no `keydown` listener anywhere in `src/`), no `role="dialog"`/`aria-modal`, background not `inert`, focus not returned to the hamburger on close. Hamburger has `aria-label`/`aria-expanded` but no `aria-controls`; the backdrop is a click-only `<div>`. | `src/components/Navbar.tsx:62-127` | WCAG 2.1.2 / 2.4.3 / 4.1.2 — keyboard users tab into an invisible menu. | M |
| A2 | **No skip link.** First tab stops are logo → 4 nav links → burger on every page; `sr-only` appears only on the hero form labels. | site-wide (no match in `src/`) | WCAG 2.4.1, common audit failure. | S |
| A3 | **Embla prev/next buttons have no accessible name** — a bare `<button>` wrapping an untitled `<path>`; no `aria-label`, SVG not `aria-hidden`. | `src/components/items/Embla/EmblaCarouselArrowButtons.tsx:10-31`, `:32-53` | WCAG 4.1.2 — screen reader announces "button" with no name, on the property gallery. | S |
| A4 | **Alt coverage is 7/7 `<img>` but the content alts are placeholders.** Carousel: `alt={\`slide-${i}\`}` on the property photos (the site's core content); hero background gets descriptive text for a decorative image (`alt="Real estate background"` should be `alt=""`); admin previews are generic. | `src/components/items/Embla/EmblaCarousel.tsx:41`, `src/components/Hero.tsx:24` | WCAG 1.1.1 — real-estate photos carry no information for AT. | S |
| A5 | **Admin file input has no accessible name** — `<label>` has no `htmlFor` and does not wrap the input (input `id="images"` exists, unused). | `src/pages/admin/components/form-sections/ImagesSection.tsx:24-37` | WCAG 1.3.1 / 4.1.2. | S |
| A6 | **Delete-image button is invisible to keyboard users** — `opacity-0 group-hover:opacity-100` with no `focus-visible` rule, so it never becomes visible when focused. | `src/pages/admin/components/ImagePreviw.tsx:15-33` | WCAG 2.4.7 / 2.1.1. | S |
| A7 | **Loading/empty states are bare `<p>` with no `role="status"`/`aria-live`, and they replace the whole page body** (nav + main collapse to one text line, then jump) — no announcement, large layout shift. Includes the unreachable duplicate guard with a wrong message. | `FeaturedListings.tsx:26-29`, `Listings.tsx:53-57`, `PropertyDetailPage.tsx:54-58`, `:75-76` | WCAG 4.1.3 (status messages) + CLS. | S |
| A8 | **WhatsApp CTA fails contrast: white on `bg-green-500` (`#00c950`) = 2.2 : 1** (needs 4.5 : 1). Primary colour is fine: `#1c3b6b` on white and white on `#1c3b6b` are both **11.1 : 1**; footer `gray-400` on `gray-900` = 5.8 : 1 ✓. | `src/pages/PropertyDetailPage.tsx:152` | WCAG 1.4.3 on the main conversion button of the detail page. | S |
| A9 | **Focus indicators are inconsistent and one is invisible.** Only `Hero.tsx` uses `focus-visible`. CTA button: `focus:ring-2 focus:ring-white` on a blue button over a **white page** → indicator invisible (contrast 1 : 1). Hero selects: `ring-white/60` on `bg-white/90` ≈ 1.4 : 1. `embla.css` defines no focus style at all. | `src/components/CTA.tsx:45`, `src/components/Hero.tsx:91`, `:109`, `src/css/embla.css` | WCAG 2.4.7 / 2.4.11. | S |
| A10 | **Heading order breaks on key routes.** `/listings` starts at `h2` with no `h1` (and `aria-labelledby` points at it); `AddPropertyForm` starts at `h2`; `Dashboard` `h1` → `h3` skips `h2`. Home and property detail are correct (`h1` → `h2` → `h3`). | `src/pages/Listings.tsx:66`, `src/pages/admin/AddPropertyForm.tsx:176`, `src/pages/admin/Dashboard.tsx:99` | WCAG 1.3.1 + SEO/nav structure. | S |
| A11 | **No reduced-motion support anywhere.** Global `html { scroll-behavior: smooth }` plus framer-motion transforms/reveals in 9 files; no `prefers-reduced-motion`, no `MotionConfig reducedMotion`, no `useReducedMotion`. | `src/index.css:15`, 9 component files | WCAG 2.3.3 — vestibular-disorder users get forced animation. | S/M |
| A12 | **No 404/catch-all route.** `Routes` has no `path="*"`, so an unknown URL renders nav + footer with an empty `<main>` and a 200 status. | `src/main.tsx:27-50` | UX/SEO papercut, dead ends for mistyped/old links. | S |
| A13 | **Dead code + inconsistent copy on the detail page**: the commented-out "similar listings" block still references the removed `properties` binding, followed by a second, unreachable `if (!property._id)` guard that returns "Chargement…" where the first returns "Aucune propriété trouvée", plus untranslated "Property not found" English strings. | `src/pages/PropertyDetailPage.tsx:47-76` | Code health + confusing edge-case copy. | S |
| A14 | **Hard-coded hash anchors break off the home route.** Footer uses plain `<a href="/#services">` and `<a href="/#about">` → full page reload from `/listings`, and the browser scrolls before React has mounted the target, so the user lands at the top. Navbar's `#about` is a *relative* hash → from `/listings` it becomes `/listings#about`, which does not exist (and `tel:` links are rendered as `NavLink to="tel:…"` in the desktop list). | `src/components/Footer.tsx:70`, `:75`, `src/components/Navbar.tsx:10`, `:52-56` | Broken "À propos"/"Services" navigation for most entry points. | S |
| A15 | **Hero search papercuts**: a literal `;` is rendered as JSX text after the first `<option>` (`</option>;`), and the `<form>` has no accessible name (no `aria-label`/`role="search"`). Field labels themselves are correct (`sr-only` + `htmlFor`). | `src/components/Hero.tsx:93`, `:74-131` | Visible stray character; minor AT ambiguity. | S |
| A16 | **Dead style files** with their own Google Fonts `@import`: `src/App.css` (1 line, never imported) and `src/css/base.css` (102 lines, never imported — second unused `Inter` font request would ship if it ever were). | `src/App.css`, `src/css/base.css:1` | Cleanup; prevents a future double font payload. | S |

### Effort key
`S` = hours, one focused PR. `M` = 0.5–2 days. `L` = multi-day.

### Notes / non-findings
- `src/data.ts` is small (28 lines) and imported once — not a dead-weight problem; `src/properties.json` is.
- `vercel.json` rewrite fallback for the SPA is correct; `dist/` is properly gitignored.
- `<html lang="fr">`, breadcrumb `aria-label`/`aria-current`, footer icons `aria-hidden`, `Logo`/`ScrollToTopButton` `aria-label`, and the `Input.tsx` `htmlFor`/`id` pairs are all done right.
