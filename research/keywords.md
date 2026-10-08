# What people search for in Sousse real estate — keywords, pages, and SERP reality

Research for issue #4. Sources used (all free, no login): Google autocomplete
(`complete/search`, geo TN, French) on ~95 stems, direct fetches of Tunisian
portals (tayara.tn, mubawab.tn, tecnocasa.tn, immobilier.tn, limmobilier.tn,
tunisie-annonce.com, bigimmo.tn, manzili.online, stesit.net), and a fallback
web search for SERP sanity. Raw autocomplete dumps: `research/data/autocomplete1.json`,
`research/data/autocomplete2.json`.

## What I could NOT check (tool limits, be honest)

- **Google Trends**: the anonymous API answered the first call then hard
  rate-limited (HTTP 401/429) for the rest of the run. No relative volumes,
  no seasonality curves, no city comparisons. Retried after cool-downs, no luck.
- **People Also Ask**: Google blocks anonymous SERP scraping from this box;
  Brave/Bing SERPs returned bot-bait and France/Morocco-biased results, so PAA
  boxes could not be read reliably.
- **Keyword volume tools** (Google Keyword Planner, free Ahrefs/Semrush tiers):
  all need a sign-in or a card. Not used.
- **Exact Google SERP order from Tunisia**: not verifiable from here. What we
  can confirm is *which platforms index Sousse queries* (direct fetches) and
  that single-agency sites do rank for niche queries (tecnocasa.tn, stesit.net,
  bigimmo.tn, manzili.online all appear in results).
- Arabic autocomplete checked as a side note (see the last section) since it is
  free, but the ticket scopes French.

## Volume-signal legend

- **VERY HIGH** — long autocomplete lists, whole query families, portal
  category pages exist for the stem.
- **HIGH** — several neighborhood/attribute completions, but fewer stems.
- **MEDIUM** — recognisable autocomplete but sparse; few portals index it.
- **LOW** — bare/empty autocomplete (these queries effectively do not exist).

---

## 1. Buy intent — appartements (VERY HIGH)

Queries Google completes, in French:
`appartement à vendre sousse` | `vente appartement sousse` | `achat appartement sousse`
+ attributes/completions: **kantaoui, khezama, corniche, chott meriem, sahloul 4,
sahloul, 9annas, vue mer, tayara** and national `appartement à vendre tunisie`
(pas cher, par facilité, bord de mer).

Neighbourhood completions found: Kantaoui, Khezama/Khzema, Corniche, Chott
Meriem, Sahloul (4), 9annas. This is the deepest cluster in the whole study —
the default "what do people type" answer is *appartement + à vendre + Sousse*.

**Target page:** `/listings` (existing search page) plus one detail page per
property (`/listings/:id`) whose title/H1 mirrors the query. Head terms are
portal-owned (tayara, mubawab) — see SERP note.

**SERP:** tayara.tn (`/listing/c/immobilier/?location=sousse`) and mubawab.tn
dominate; tecnocasa.tn franchise pages rank for `appartement à vendre sousse`.
A one-page SPA cannot win the head term; it should take the *quartier long-tail*
(`appartement à vendre sousse khezama`) and the individual-property slug.

---

## 2. Buy intent — maisons & villas (HIGH)

`maison à vendre sousse` + **pas cher, vue mer, corniche, riadh, 9annas, médina,
sahloul**; `villa à vendre sousse` + **tayara, el kantaoui, avec piscine,
khezama**; `achat maison sousse`.

`villa el kantaoui` (tourist belt) and `maison à vendre sousse riadh` stand out
as neighbourhood-specific completions.

**Target page:** `/listings` filtered (type=Maison/Villa) + quartier pages
(see cluster 8). The `maison à vendre sousse pas cher` / `maison à vendre sousse
riadh` long-tail is winnable on a single-property/quartier basis.

**SERP:** tayara + agency sites (bigimmo.tn lists "Maisons / Villas" as its
first banner category). Medium-weak head competition — a small site with a
handful of good villa listings + a quartier page can realistically appear on
page 2 and grow.

---

## 3. Buy intent — terrains (MEDIUM-HIGH)

`terrain à vendre sousse` + **sahloul, khezama, mall, kantaoui, tayara, chott
meriem, hammam sousse, terrain agricole, pas cher**. National: `terrain à vendre
tunisie bord de mer`.

Sousse is a *construction* market: land in Sahloul/Khezama is a real query
family (tayara lists `terrains-et-fermes/sousse/...` items, Kalaa Kebira and
Sidi Bou Ali included — those are already in `src/data.ts`).

**Target page:** `/listings` filtered (type=Terrain) — flag that `data.ts` lacks
the "Terrain" neighbourhood pairs found here (`terrain sahloul`, `terrain
khezama`, `terrain chott meriem`) as filter combos worth testing.

**SERP:** tayara + tunisie-annonce hold the ground. Winnable only by listing
*exclusive* plots; otherwise low priority.

**Commercial variants (MEDIUM/LOW):** `fonds de commerce à vendre sousse`,
`local commercial à vendre sousse` (+ `jawhara`, `9annas`, `sahloul` for
locations), `bureau à vendre sousse`, `magasin à louer sousse`. Autocomplete is
narrow but real; bigimmo and manzili (both Sousse agencies) already serve this
segment. **Flag as a not-yet-planned route: a "commercial" category page**,
only if the agent actually handles locaux/bureaux/fonds de commerce
(`src/data.ts` already lists Local, Bureau, Depot, Usine so the data model
supports it).

---

## 4. Rent intent — annual / long-term (VERY HIGH for apartments)

`appartement à louer sousse` + **khezama (top suggestion), sans meuble, par
nuit, sahloul 4, jawhara, sahloul, tayara**; `location appartement sousse` +
**par jour, à l'année, khezama, sahloul, particulier, vue mer, 9annas, riadh**;
`studio à louer sousse` + **jawhara, par mois, par jour, hay riadh, sahloul,
corniche, khezama**; `maison à louer sousse` + **bouhsina, khezama, sans meuble,
kantaoui, par mois**; `villa à louer sousse` + **tayara, avec piscine**;
`appartement meublé à louer sousse`; `location longue durée sousse`.

Rental demand in Sousse is apartment-led and neighbourhood-precise: Khezama,
Sahloul 4, Jawhara and Riadh dominate. Bent toward foreign residents/students
and long-lease ("à l'année", "sans meuble" vs "meublé").

**Target page:** `/listings` filtered (type=Appartement + status=Loué) backed by
the `Location` service card. Currently the site has *no* rent/buy status filter
in the hero, and `/listings` only differentiates by type+location — a rent vs
buy toggle is the cheapest high-value change for SEO and UX here.

**SERP:** tayara and agency sites rank; `studio à louer sousse khezama tayara`
is literally a completed query, meaning the user expects tayara. A single-agency
site should not fight the word "tayara"; it should instead rank its own
neighbourhood rent pages.

---

## 5. Rent intent — saisonnière / vacances (HIGH volume, LOW competition)

`location saisonnière sousse` | `location vacances sousse (particulier)`
+ **chott meriem, kantaoui, tayara**; `studio à louer sousse par nuit`; `studio
meublé à louer sousse par nuit`; `appartement à louer sousse par jour`. Arabic
check confirms `شقق للبيع بوحسينة` (Bouhsina) as a seasonal hotspot on top.

**The biggest SERP surprise of this study:** this cluster is NOT held by the
real-estate portals. What actually ranks: ancient owner-built static pages
(`*.vadif.com`, hotel-style apartment pages), i.e. **legacy single-property
sites**. That is exactly the model a small single-agent site can out-seo.

**Target page:** **NOT-yet-planned — `/locations-saisonnieres-sousse`**
(chott meriem / kantaoui / bouhsina / corniche sub-sections) + a listing status
"Saisonnier". This is the cheapest win on the board: diffuse competition,
clear demand, prices in TND/night that a local agent can price sensibly.

---

## 6. Agent / agency intent (MEDIUM-HIGH)

`agence immobilière sousse` + **khezama, sahloul, location, kantaoui, riadh,
tunisie**; `agent immobilier sousse`; `société immobilière sousse`; `promoteur
immobilier sousse` + `projet en cours 2025`, `agence immobilier sousse`.

The completion list proves buyers type the *quartier + agence* pair
(`agence immobilière sousse khezama`, `... sahloul`), so the site should echo
the agent's neighbourhoods explicitly. **Tecnocasa sousse** (franchise),
**NEW WAY** (Facebook-first Sousse agency) and **bigimmo.tn** / **manzili.online**
(tiny SPA sites) rank or surface here — proof a single agent can be found.

**Target page:** `/a-propos` (currently a homepage anchor only — **flag: make it
a real route** for the people who type "agence immobilière sousse") plus
homepage H1/H2. Note Facebook is where Sousse agencies actually live; the site's
footer already links a FB page — that channel should feed listings into the site
for the Google entry point.

**SERP:** mixed portals + Facebook + small agency sites. Winnable locally via a
Google Business Profile + about page. This is the tract-question of "how do I
belong to the agence SERP" and the answer is: yes, but competition is FB-first,
not website-first, so budget SEO effort low.

---

## 7. Estimation / price intent (MEDIUM, but mysteriously worded)

Google autocomplete *rewrites* "estimation" queries into price queries: typing
`estimation immobilier sousse` returns completions **prix immobilier sousse,
prix appartement sousse, prix maison sousse**. Likewise `estimation bien
immobilier tunisie` → **simulateur estimation, expert évaluation bien
immobilier**. `prix m2 sousse` (+ hammam sousse), `cote immobilière sousse`
(empty — no volume), `estimer mon bien immobilier tunisie`.

So the intent exists, but Tunisians mostly type **"prix immobilier sousse"** /
**"prix m2 sousse"** rather than "estimation". The planned estimation page
should be *styled as a price guide* to catch these.

**Competition:** `aqari.tn` (estimation IA + prix pages), `limmobilier.tn`
("Estimer" tab), `immobilier.com.tn`, and — decisively — **stesit.net, a small
single-agency site (Agence S, Tunis) that ranks for "prix immobilier tunisie
2026" with a per-quartier price article**. A small site can beat this class of
competitor with real Sousse data. Mubawab's published Sahel anchors (2023) to
seed it: **Sahloul ≈ 2 370 TND/m², El Kantaoui ≈ 3 270, Hammam Sousse ≈ 2 200,
Hergla ≈ 2 190** (plus Properstar 2025: Sousse apartment median ≈ 315-317
TND/sq ft, coastline Hammam Sousse highest).

**Target page:** planned estimation page, renamed around the query: something
like `/estimation-prix-immobilier-sousse` with per-quartier and per-type price
bands + a real estimation form (the site's data model has `area` and `price`,
so a m²-based estimator is buildable).

---

## 8. Neighbourhood-level intent (VERY HIGH; this is where the long-tail pays)

Autocomplete rank order per quartier (strength by number & precision of
completions):

| Quartier | Evidence from autocomplete | Buy/rent flavour |
|---|---|---|
| **Sahloul** (1/2/3/4, `sahloul 4` dominant) | `appartement sahloul 4`, `terrain sahloul`, `appart à louer sahloul 4`, `agence immobilière sousse sahloul` | strongest overall; buy + rent + terrain |
| **Khezama / Khzema** (est/ouest, `khezama west`) | `appart à louer khezama`, `appart à vendre khezama`, `agence sousse khezama`, tayara pages | strongest for rent + agency |
| **Kantaoui** (`el kantaoui`, bay) | `villa el kantaoui`, `appart kantaoui`, `terrain kantaoui`, saisonnière | tourist buy + seasonal |
| **Chott Meriem / Chatt Mariem** | `appart à vendre chott meriem`, `terrain chott meriem`, `location vacances chott meriem` | buy + seasonal (site spells it "Chatt Mariem" — keep one spelling) |
| **Corniche** (`sousse corniche`) | `appart à vendre corniche`, `maison à vendre corniche`, `location ... par jour` | buy + daily rent |
| **Riadh** (`sousse riadh`, `hay riadh`) | `maison à vendre sousse riadh`, `studio à louer ... hay riadh`, `agence sousse riadh`, `cité riadh 5` (bigimmo listings) | buy + rent |
| **Jawhara** (`sousse jawhara`) | `studio à louer sousse jawhara`, `appart à louer jawhara`, local commercial jawhara | tourist rent |
| **9annas / Gannas** | `appart à vendre sousse 9annas`, `maison à vendre sousse 9annas`, local commercial 9annas | new-build buy (near Hammam Sousse) |
| **Bouhsina** | `maison à louer sousse bouhsina`, Arabic `بوحسينة`, bigimmo/newway addresses | rental; agency hub |
| **Médina** | `maison à vendre sousse médina` | buy heritage |
| **Hammam Sousse** | `terrain à vendre hammam sousse`, `prix m2 hammam sousse`, `location longue durée hammam sousse`, Arabic `بحمام سوسة على البحر` | buy + rent + price |
| Already in `data.ts` with little autocomplete: Hergla, Akouda, Kalaa Kebira, Kalaa Sghira, Zaouiet, Sidi Abdelhamid, Sidi Bou Ali, Messaadine (discovered) | portal listings exist (tayara item paths name Kalaa Kebira, Sidi Bou Ali, Chatt Mariem, Sahloul, Sousse Jawhara, Sousse) | lower query volume but present |

**Target page:** **NOT-yet-planned — one landing page per quartier**
(`/sahloul`, `/khezama`, `/kantaoui`, `/hammam-sousse`, `/chott-meriem`, …)
titled `Appartement à vendre/à louer à {quartier} — Sousse`, each embedding the
live `/listings` filter for that quartier. This is where a single-agent SPA can
realistically rank: the quartier long-tail is multi-word, low-competition, and
feeds directly into inventory. `data.ts` locations already cover most; the pages
just don't exist yet.

---

## 9. National / expat intent (MEDIUM, second niche)

`acheter une maison (en) tunisie pour un français / un étranger`,
`appartement à vendre tunisie par facilité`, `acheter un appartement neuf en
tunisie`, `crédit immobilier tunisie` (+ `tunisien résident france`,
`pour étranger`), `achat immobilier tunisie expat`.

**Target page:** `/services` (currently an anchor — **flag: make it a real
route**) with an "acheter en Tunisie depuis l'étranger / TRE" service block, and
keep the estimation page bilingual-friendly. The TRE/diaspora angle is a niche
national portals serve poorly with real content; a local agent can own it with
one good page + WhatsApp (the site already links `wa.me` in the footer).

---

## Route mapping summary

| Candidate route | Existing now? | Clusters it should own |
|---|---|---|
| Homepage `/` | yes (Hero/Featured/About/Services + **anchors** `#about`, `#services`) | generic `immobilier sousse`, `agence immobilière sousse` (local SEO via GBP) |
| `/listings` | yes | **buy + annual-rent clusters**, all four types; add a rent/buy status filter |
| `/listings/:id` | yes | long-tail `appartement à vendre sousse {quartier}` via per-property titles |
| `/services` | **anchor only** — make a route | vente/achat pitch, TRE/expat block, investissement |
| `/a-propos` | **anchor only** — make a route | `agence immobilière sousse` + quartier/agency pair queries |
| Estimation page | planned | **rename around "prix"** per cluster 7 |
| **NEW: quartier pages** (`/sahloul`, `/khezama`, `/kantaoui`…) | **not planned** | cluster 8 — the most winnable layer |
| **NEW: `/locations-saisonnieres-sousse`** | **not planned** | cluster 5 — lowest competition |
| **NEW: price guide `/prix-immobilier-sousse`** | **not planned** | merges into the estimation page if preferred |
| **NEW: commercial category** | **not planned** | finds de commerce, locaux, bureaux — only if the agent serves it |

## Decision points this feeds (for the roadmap)

1. **French-only is a real strategic bet.** Arabic autocomplete shows genuine
   demand (`شقق للبيع سوسة سهلول`, `بوحسينة`, `حمام سوسة`, `خزامة`). The ticket
   scopes French; flag Arabic as a future decision, not an afterthought.
2. Two misspellings of one neighborhood (`Khezama`/`Khzema`, `Chott Meriem`/
   `Chatt Mariem`) — the site should pick canonical slugs and let the detail
   pages cover the variant.
3. `sahloul 4` and `khezama` deserve the first quartier pages; they carry almost
   every cluster.
4. The estimation page competes best as a *price guide*, not a form-first page.