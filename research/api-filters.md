# API filter support — research findings (issue #2)

## Question

Does the live Render backend at `https://dahechimmo-backend.onrender.com` let
`/api/properties/search` filter by status (sale/rent), price range, bedrooms,
area (m²), and sort the results?

## How this was answered

1. Read the frontend code (clone of `WissemJderi/hichimmo`).
2. Read the backend source directly — `WissemJderi/dahechimmo-backend` is
   **public**, so the search route was inspected in full (strongest evidence).
3. Probed the live API with read-only GETs (about 40 requests) to confirm the
   deployed behaviour matches the repo.

## What the frontend sends today

`src/services/propertiesService.ts:40-60` (`searchPaginated`) sends only:

- `page`, `limit` (always)
- `location` (only when set and not `"none"`)
- `type` (only when set and not `"none"`)

Responses are parsed as a raw array; the total comes from the
`x-total-count` header. `getPaginated` (`src/services/propertiesService.ts:9-20`)
hits `GET /api/properties` with only `page/limit`.

## What the backend actually accepts (source)

`src/schemas/propertySchemas.ts:20-23` — the search query schema is exactly:

```
location: enum(Location) | "none", optional
type:     enum(PropertyType) | "none", optional
```

Plus `pageParamsSchema` (`page`, `limit`, `limit` capped at 50).

`src/routes/propertiesRouter.ts:37-57` validates `req.query` against that
schema, then calls `propertiesService.searchProperties`, whose filter builder
(`src/services/propertiesService.ts:21-26`) only maps `location` →
`filter.location` and `type` → `filter.propertyType`. Sorting is hard-coded to
`{ _id: -1 }` (`propertiesService.ts:34`).

The OpenAPI spec (`src/openapi.json`) documents `search` with only
`location`, `type`, `page`, `limit`.

So: **no status, price, bedroom, area or sorting params exist in the code**.
The DB model does store `status` ("sale" | "rent"), `price`, `bedrooms`,
`area` — the data is there, the search endpoint just does not filter on it.

## Live probes (read-only, ~40 GETs)

Baseline and working filters:

| request | status | x-total-count |
|---|---|---|
| `search` (no params) | 200 | 133 |
| `search?location=sousse` | 200 | 36 |
| `search?type=appartement` | 200 | 52 |
| `search?location=sousse&type=appartement` | 200 | 13 |

Candidate filter params — all returned 200 with **x-total-count unchanged at
133 and the identical first row** (`_id 6ac747df...`, price 1150):

- status: `status=sale`, `status=rent`, `status=Sale`
- price: `priceMin`, `priceMax`, `minPrice`, `maxPrice`, `price[gte]`, `price_min`
- bedrooms: `bedrooms=3`, `bedrooms[gte]=2`, `chambres=3`
- area: `area`, `surface`, `areaMin`
- sorting: `sort=price`, `order=asc`, `sort=price&order=asc`, `orderBy=price&dir=asc`
- junk: `foo=bar`
- db field name: `propertyType=appartement`

The singular endpoint `GET /api/properties?status=sale` behaves the same
(`x-total-count: 133`, ignored).

Proof the deployed zod schema matches the repo: an invalid enum value is
rejected with 400 `{"error":"Invalid query parameters"}`
(`type=xyz`, `location=xyz`). A param the schema does not know is silently
stripped (zod's default non-strict object), which is why unknown filters
return 200 instead of an error — they are just ignored.

Side finding: `limit=999` (> 50 cap) crashes into a **500 with the raw zod
error body** instead of a clean 400 (`propertiesRouter.ts` routes to the error
handler; `pageParamsSchema.parse` in the search route throws). Only
`pageParamsSchema.safeParse` is used on the `GET /` route, so that one returns
a clean 400.

## Verdict

- **Works today:** `location`, `type` (+ `page`/`limit`), combined, with an
  `x-total-count` header. Sorting is fixed `_id` desc.
- **Not supported:** status, price range, bedrooms, area, and any sort
  parameter. Unknown params are silently ignored (200, same result).
- **Ambiguous:** none of the candidate spellings had any effect on any probe,
  so there is no server-side fallback to rediscover; the schema is explicit.
  The only real ambiguity is the `limit=999` → 500 crash (a hidden bug, not a
  filter feature).

## Implications for the filter-set plan

1. **Backend change is required** for any server-side filtering/sorting —
   the frontend cannot get status/price/bedrooms/area filtering or sorting
   from the current API at all. The scope question from issue #2 must be
   raised: extend the backend + OpenAPI + tests, or accept a client-side
   approach.
2. **Client-side fallback is feasible today at small scale** — the dataset is
   only 133 properties, and the data (status/price/bedrooms/area) is present
   in every row. The frontend would pull the full set in 3 paged requests
   (`limit=50`) and filter/sort in memory. This works now but does not scale
   and keeps pagination superficial.
3. **Fixing the backend is cheap**: add fields to `searchParamsSchema`, extend
   `buildFilter` (`status` → `filter.status`, price range → `price: { $gte, $lte }`,
   `minBedrooms` → `bedrooms: { $gte }`, area range), add a `sort` param
   whitelist, and fix `limit=999` to return a clean 400. The data model
   already stores every field the filters target.

## Files inspected

- Frontend: `src/services/propertiesService.ts`
- Backend: `src/routes/propertiesRouter.ts`, `src/services/propertiesService.ts`,
  `src/schemas/propertySchemas.ts`, `src/types.ts`, `src/models/property.ts`,
  `src/openapi.json`