# GA4 setup plan — Dahech Immo (hichimmo)

Research ticket #5. Frontend-only Vite + React 19 SPA on Vercel, zero analytics today,
leads convert off-site (WhatsApp `wa.me`, `tel:`). One agent, Sousse.

Scope: this is a research plan, not an implementation. It feeds a task ticket and a
later grilling ticket. Nothing was installed.

---

## 1. Install path

### Recommendation: gtag.js snippet in `index.html` + one tiny event helper module

Put the Google tag in `index.html` (the official snippet from Admin > Data streams),
then add a ~20-line `src/services/analytics.ts` that wraps `gtag('event', ...)` with a
type-safe `trackEvent(name, params)` helper.

Why over a React wrapper package (`react-ga4`):

- `react-ga4` is a thin, lightly maintained wrapper around the same `gtag` global. It
  was dormant 2022–2025 and only resumed publishing in 2026; it adds a dependency for
  zero behavior we need.
- Google's own docs and community 2026 practice for plain React SPA is: load gtag.js
  once, call `gtag()` directly. A helper module keeps the calls out of `dataLayer`
  plumbing and gives one testable seam.
- Google Tag Manager is Google's recommended path when non-engineers will manage tags
  later. It's a heavier setup (another container, same events in UI instead of code)
  and not needed for a single-agent site. Revisit only if the owner gets a Meta Pixel
  or paid-ads loops later. Do not adopt now.

### SPA page views: manual `page_view` on route change

Two viable options:

- **Option A (recommended): manual `page_view`.** In the gtag config,
  `gtag('config', ID, { send_page_view: false })`, and turn off "Page changes based on
  browser history events" in Enhanced Measurement (Data stream settings). Then send the
  event from a small component using `useLocation()`:

  ```ts
  // components/AnalyticsPageView.tsx (concept)
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;   // keep admin out of the data
    window.gtag("config", MEASUREMENT_ID, { page_path: pathname + search });
  }, [pathname, search]);
  ```

  Deterministic, testable, lets us exclude `/admin/*`, works with the lazy-loaded
  routes in `main.tsx`.
- **Option B (zero code): Enhanced Measurement history tracking.** New web data
  streams have "Page loads" + "Page changes based on browser history events" on by
  default; GA4 then autofires `page_view` on `pushState` (react-router uses it). Zero
  JS. Downside: can't exclude admin routes, and behaviour is implicit.

Either is correct; pick one. **Never both**: enabling history tracking while also
sending manual `page_view` double-counts every navigation.

Note: `ScrollToTop.tsx` already resets scroll position on route change. Keep it — GA4
scroll events and engagement time are attributed per virtual page correctly only when
the viewport resets on navigation.

### Consent / Tunisia law — the honest picture

Two laws get conflated. They are not the same:

- **Decree-Law 2022-54** is Tunisia's *cybercrime* law (information-system offences).
  It does not regulate cookies or analytics consent. It is mostly irrelevant to a GA4
  tag, except general "don't intercept / don't defraud" conduct.
- The personal-data law is **Organic Law 2004-63** (enforced by the INPDP). It uses
  *informed, express consent* as the primary legal basis for processing personal data,
  and Articles 47-52 require INPDP authorization plus consent to *transfer data
  abroad* (which is what sending analytics pings to Google is, arguably).

There is no EU-style ePrivacy directive in Tunisia, no cookie-specific rule, and
enforcement against small sites is nascent. Whether a Tunisian visitor must be asked
before GA4 fires is genuinely uncertain (not a settled question). So:

**Cautious stance (recommended, cheap):** ship with Google Consent Mode v2.

- In `index.html`, set consent defaults before the tag loads:
  `gtag('consent','default',{ ad_storage:'denied', ad_user_data:'denied',
  ad_personalization:'denied', analytics_storage:'denied' })`.
- Add a minimal one-bar consent banner ("Mesurer mon audience ? Accepter / Refuser")
  whose choice flips `analytics_storage` to `granted`/`denied`.
- Add a short privacy page ("Confidentialité") stating Google Analytics is used and what
  it collects. Consent Mode v2 keeps measurement working when denied, so this costs
  little data quality and it is exactly the change you would want before any future
  ad-platform integration. It does not close off the EU path either.
- No PII in event parameters (see §2) and GA4 strips IP server-side by default. Those
  two choices shrink the "personal data" surface the law cares about.

If the owner wants zero friction and zero consent UI: run GA4 cookieless with Consent
Mode defaults denied and never open Admin dashboards to the public. The banner is the
safer, still-cheap option. Flag this for the grilling ticket — it's a business choice,
not a code choice.

### Free tier — confirmed fine

- GA4 Standard (free, no card) is well beyond this scale. Single agent, Sousse:
  realistically hundreds to low thousands of sessions/month, far under the ~10M
  events/month order of magnitude where Standard gets stressed and far under the 1M
  events/day BigQuery export cap (not needed anyway).
- Relevant Standard caps: 50 event-scoped custom dimensions, 25 params/event, 40-char
  event and param names, 100-char param values, 30 key events, data retention 2 or 14
  months.
- **Action:** set retention to 14 months in Admin > Data settings > Data retention
  (factory default is 2 months). Cheap and it stops day-one regrets.
- Note: "conversions" was renamed **key events** in GA4. The term below is
  "key events".

---

## 2. Event spec

Files read for anchors: `src/pages/PropertyDetailPage.tsx`, `src/components/Footer.tsx`,
`src/components/Navbar.tsx`, `src/components/Hero.tsx`, `src/components/AboutAgent.tsx`,
`src/components/CTA.tsx`, `src/pages/Listings.tsx`, `src/components/items/PropertyCard.tsx`,
`src/utils.ts` (`createWhatsappUrl`), `src/main.tsx`, `src/ScrollToTop.tsx`.

Keep it to six manual events. No `listing_click`, no `hero_impression`, no scroll-depth
vanity events. Every event below feeds one of the two funnels or the seller's
inventory/ads decisions.

| # | Event | Trigger (code anchor) | Parameters | Notes |
|---|-------|----------------------|------------|-------|
| 1 | `page_view` | Route change, via `useLocation` hook (or Enhanced Measurement) | (auto: `page_location`, `page_title`, `page_referrer`) | Skips `/admin/*`. Not manual-prefixed, it's a reserved name — must go through the config call shown in §1, not `trackEvent`. |
| 2 | `listing_view` | `PropertyDetailPage.tsx`, once a property is loaded (`property.ref` available) | `listing_ref`, `listing_title`, `property_type`, `listing_location`, `listing_status` (sale/rent), `listing_price` | One per property load, not per image swipe. Title already exists in data; trim to 100 chars (GA4 cap). |
| 3 | `search_submit` | `Hero.tsx`, the "Rechercher" button's `onClick` (`navigate` to `/listings?...`) | `search_type`, `search_location` | The button calls `preventDefault`, so Enhanced Measurement never fires a form event here. Manual is the only way. |
| 4 | `whatsapp_click` | `PropertyDetailPage.tsx` WhatsApp link (listing-specific, via `createWhatsappUrl`); `Footer.tsx` generic `wa.me` link | `cta_source` (`listing_detail` / `home_footer`), `listing_ref`, `listing_title` (only when present) | `listing_ref` present ⇒ buyer/renter funnel; absent ⇒ generic intent (could be seller). Same event, disambiguated by parameter. |
| 5 | `phone_click` | `tel:` links in `Hero.tsx` (hero), `AboutAgent.tsx` (about), `CTA.tsx` (cta), `Navbar.tsx` (navbar), `Footer.tsx` (footer) | `cta_source` (`hero`/`about`/`cta`/`navbar`/`footer`) | The CTA block is the closest thing to a seller/estimation entry point that exists today (text: "estimation gratuite ou une visite personnalisée"). |
| 6 | `estimation_click` | **BLOCKED — no element exists today** | — | See §3. Do not fake it by re-labelling the CTA `tel:` click. Either add a real "Estimation gratuite" WhatsApp CTA (then wire event 6, params `cta_source` + optional `listing_ref`), or don't ship it. Open decision. |

### Why not more

- `listing_click` (card → detail) is redundant with `page_view` on `/listings/:id`.
  Adding it just splits two numbers that answer the same question.
- Scroll depth on a landing page tells a one-agent site nothing it can act on.
- `user_engagement` / `scroll` / `outbound_click` / `click` arrive free via Enhanced
  Measurement — no custom code, ignore them except as context.
- GA4 limit is 500 event names on web but each named event costs report real estate and
  owner attention. Six events, six rows.

---

## 3. Conversions (key events) and the two funnels

GA4 Standard allows 30 key events; use **two**, toggled in UI after collection starts
(Admin > Data display > Events, then toggle, or create in Key events). No `key_events`
config param needed in code.

| Key event | Counts as | Funnel |
|-----------|-----------|--------|
| `whatsapp_click` | 1 per click, no session dedupe (default `once_per_event`) | Both. Split in reports/Explore by presence of `listing_ref`. |
| `phone_click` | 1 per click | Secondary, buyer and seller. |

**Funnel A — buyer/renter lead:** `page_view(/listings/:id)` → `listing_view`
(input funnels: sessions or `listing_view`) → `whatsapp_click` where `listing_ref` is
set. Most valuable report shape in GA4 Explore: `Funnel exploration` with steps
sessions → `listing_view` → `whatsapp_click`, split by `listing_ref`. Answers "which
listings convert, which just get viewed".

**Funnel B — seller/landlord lead:** estate owner lands (probably on `/` from a poster,
a referral, or a WhatsApp-forwarded link), picks up the phone or WhatsApps with no ref.
Steps: sessions → `phone_click` (source `cta`/`about`) or `whatsapp_click` (no
`listing_ref`). This funnel is thin today because the site has **no estimation
entry point** — the only "estimation gratuite" in the code is copy inside the CTA
(`CTA.tsx`), wired to a `tel:` link. Whatever number it produces, treat it as
approximate. If the owner decides sellers matter, add a dedicated estimation WhatsApp
CTA (home page, services section) and wire `estimation_click`; then make it key event
#3. That is the real unlock, and it is a product decision, not an analytics one.

---

## 4. Baseline reading

### Minimum accumulation window

- **Bare minimum: 2 weeks.** **Recommended: 4 weeks** before setting any target.
  At single-agent volume (expect single digits to low tens of sessions/day) daily
  numbers are noise; weekly and 4-week aggregates are honest units.
- Start the clock the day the tag goes live in production. The first 24–48h are testing
  time (DebugView), not baseline time.
- Re-read monthly, not daily. Targets sit on 4-week rolling values.

### Numbers to snapshot (weekly, 4-week lookback)

| Number | Where in GA4 |
|--------|--------------|
| Users, sessions, engaged sessions, engagement rate | Reports > Acquisition > Traffic acquisition |
| `whatsapp_click` count & rate, by `cta_source` and `listing_ref` | Reports > Engagement > Events; Explore table split by `listing_ref` |
| `phone_click` count, by `cta_source` | Reports > Engagement > Events |
| `listing_view` count, top `listing_ref` | Reports > Engagement > Events / Explore |
| Conversions (`whatsapp_click`, `phone_click`) and conversion rate vs sessions | Reports > (key event reports); Explore |
| `search_submit` top `search_type` × `search_location` pairs (what people look for) | Explore |
| Sessions by default channel group (organic/direct/etc.) | Acquisition > Traffic acquisition |

**Funnel baselines, not just counts** (this is the frame issue #13 later needs):
- `whatsapp_click / listing_view` = "listing → lead conversion rate", the north-star
  ratio for the buyer funnel.
- `phone_click / sessions` and `whatsapp_click(no ref) / sessions` for seller intent.
- 4-week view of these ratios is what targets should be set from — not raw counts,
  which drift with whatever the owner posts that month.

### UTM for later off-site promotion (do not paint into a corner)

- GA4 scrapes `utm_source/medium/campaign` into attribution automatically. Nothing to
  build now. When the owner promotes listings on Facebook/Instagram streets or in
  local WhatsApp groups, links are just `https://…/listings/<ref>?utm_source=facebook&utm_medium=social&utm_campaign=...`.
- Two rules to respect today:
  1. Use `cta_source` (not `source`) for the in-page button-context parameter, because
     `source` collides with GA4's reserved `utm_source` param and would corrupt the
     attribution dimension.
  2. Register `listing_ref`, `listing_location`, `property_type`, `listing_status`,
     `cta_source`, `search_type`, `search_location` as event-scoped custom dimensions
     now (Admin > Custom definitions). Registering later loses historical breakout.
     Seven of 50 slots — cheap insurance.
- Deep links are already clean: detail pages are `/<ref>`-free but stable at
  `/listings/:id`, and `createWhatsappUrl` lands on WhatsApp with a prefilled message
  carrying the ref and title — so off-site campaigns are per-listing attributable end
  to end without any code change.

---

## 5. Pitfalls

1. **SPA page views.** A raw gtag snippet counts one pageview forever (no reloads).
   Use §1 Option A or B, never both. Double-counting on first load happens when
   `send_page_view` is left `true` and a manual event also fires.
2. **That obnoxious owner-tests button.** Owner + friends poking around inflate every
   number. Add a GA4 data filter for internal traffic (Admin > Data settings > Data
   filters) — best practical option: filter on `page_location` containing e.g.
   `?owner=1`, and the owner bookmarks the site with that param. IP filters break the
   moment the owner checks from a phone on mobile data.
3. **Ad-blockers / tracking protection.** gtag.js is blocked by uBlock, Brave,
   Firefox enhanced tracking, and several in-app browsers common in Tunisia. Expect
   undercount in the 10–30% range and *accept it*. If the owner wants a correction
   factor later, compare GA4 `whatsapp_click` counts against actual WhatsApp-message
   receipts in the app for a month. Do not try to defeat blockers.
4. **WhatsApp click semantics.** Don't fire `whatsapp_click` twice. `trackEvent` on
   the anchor click, once; Enhanced Measurement separately emits `click` /
   `outbound_click` for `wa.me` — ignore those events, they're a different name and a
   different question. When the WhatsApp app opens and navigates the browser away,
   gtag's beacon keeps the event moving; don't use `e.preventDefault()` + manual
   delay patterns that can drop it.
5. **`tel:` links in React Router.** `Hero.tsx`, `CTA.tsx`, `AboutAgent.tsx` render
   `tel:` links through react-router's `<Link>`. Router `<Link>` with a non-route
   target can behave like a client-side navigation attempt and never hand the URL to
   the OS → **the tap may do nothing**, and no outbound tracking fires either. If manual
   `phone_click` appears with no corresponding `page_view`, that's a router issue, not
   analytics. (Fix later: swap those to plain `<a>`.)
6. **StrictMode double-fire in dev.** `main.tsx` wraps the app in React `StrictMode`,
   which double-invokes effects in development. If manual `page_view` is in a `useEffect`,
   dev shows double sends; production doesn't. Don't "fix" it. Verify with DebugView on
   a production preview build.
7. **Lazy-loaded routes** (`React.lazy` in `main.tsx`) mean the detail page renders
   after a fetch; fire `listing_view` from the component once `property.ref` exists,
   not from a route listener (ref isn't in the URL; the id is — `ref` is the stable
   key, use it).
8. **Admin paths leak into reporting.** `Navbar` Contact, dashboard, form. Exclude
   `/admin/*` from both `page_view` and events (guard the helper), and block the login
   page. The owner's own CMS work must never look like site traffic.
9. **Data thresholds at low volume.** GA4 suppresses small counts via privacy
   thresholding. At this scale some reports will show "--" or rounded values. That's
   normal; work with ratios and weekly buckets rather than expecting gapless daily
   precision.
10. **Value caps.** 40-char event names, 40-char param names, 100-char param values.
    Listing titles already fit, but if a title is long, GA4 truncates — harmless as
    long as `listing_ref` stays ≤40.
11. **Reserved-name collisions.** Don't name a custom event `page_view`, `click`,
    `scroll`, `user_engagement`, `first_visit`, `session_start`, or anything with a
    `google_`/`gtm_` prefix. `listing_view`, `whatsapp_click`, `phone_click`,
    `search_submit`, `estimation_click` are all free.

---

## Install checklist (ordered)

**Before code**
1. [ ] Create GA4 property + web data stream in Google Analytics (free). Copy
       measurement ID (`G-XXXXXXX`, note it's also the Google tag).
2. [ ] Data settings: set data retention to **14 months**.
3. [ ] Custom definitions: register the 7 event-scoped dimensions from §4 (right
       after first events start arriving, or now — registration takes effect going
       forward).
4. [ ] Decide owner-internal-traffic filter param (`?owner=1`) and set the data filter
       up (enable in production once tag is live).
5. [ ] Decide consent stance: banner + Consent Mode v2 (recommended) or cookieless
       defaults. Owner call → grilling ticket.
6. [ ] Decide `estimation_click` fate: add an estimation WhatsApp CTA now (wire event
       6) or skip. Owner call → grilling ticket.

**Code (frontend only)**
7. [ ] `index.html`: add gtag.js snippet with `send_page_view: false`,
       `gtag('consent','default',…)` if banner chosen.
8. [ ] Add `src/services/analytics.ts` (`trackEvent` guard + non-admin check, typed
       params).
9. [ ] Add `src/components/AnalyticsPageView.tsx` (`useLocation` → `page_view`,
       skips `/admin`). Mount inside `BrowserRouter` in `main.tsx`.
10. [ ] Wire `listing_view` in `PropertyDetailPage.tsx` (after property loads).
11. [ ] Wire `search_submit` in `Hero.tsx` (in the existing `onClick`).
12. [ ] Wire `whatsapp_click` in `PropertyDetailPage.tsx` and `Footer.tsx`.
13. [ ] Wire `phone_click` at all five `tel:` sites (Hero, AboutAgent, CTA, Navbar,
        Footer).
14. [ ] `npm run build && npm run lint && npm test` — keep existing tests green
        (`utils.test.ts`, `PropertyCard.test.tsx`, `PropertyDetailPage.test.tsx`).
15. [ ] Deploy to Vercel; verify 48h in DebugView/Realtime; then start the 4-week
        baseline clock.

**After 2–4 weeks**
16. [ ] In Admin > Key events, toggle `whatsapp_click` and `phone_click` as key events.
17. [ ] Snapshot the baseline table (§4); share with the owner in plain French; feed
        targets to issue #13 later.