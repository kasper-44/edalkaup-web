# Eðalkaup — edalkaup.is

Modern Next.js website for Eðalkaup, an Icelandic car import business
(subsidiary of Úranus ehf.). Imports vehicles from North America (US/Canada)
and lists them for sale in Iceland.

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Supabase** (Postgres) — car inventory database
- **Resend** — transactional email (contact form + daily summary)
- **Auto.dev API** — North American vehicle listings source
- Dark theme with gold accent
- Deployed on **Vercel**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- `/` — Home with vehicle photography, inventory search, featured cars and import enquiry
- `/bilar` — Car inventory with filters (reads `status='live'` from Supabase)
- `/bilar/[slug]` — Individual car page with gallery, specs, sharing
- `/afhent` — Delivered cars gallery (social proof)
- `/um-okkur` — About page
- `/hafa-samband` — Contact page with form (emails via Resend)
- `/stjorn` — **Admin dashboard** (password-gated, see below)

---

## How the inventory works

Cars live in the Supabase `cars` table. Each car has a `status`:

| status  | meaning                                  | shown on site? |
|---------|------------------------------------------|----------------|
| `draft` | newly imported, not yet priced           | no (hidden)    |
| `live`  | priced and published                     | **yes**        |
| `sold`  | sold in the US, auto-hidden (reversible) | no (hidden)    |

The public `/bilar` page only shows `status='live'`. Original North American
price is stored in `price_original` + `price_currency`; you set the Icelandic
sale price in `price_isk` yourself.

### Daily sync pipeline (`scripts/`)

Runs every morning (08:00) via a Hermes cron job. Pulls fresh listings from
Auto.dev, adds new cars as hidden `draft`s, and marks sold cars as `sold`.

| script | purpose |
|--------|---------|
| `sync_inventory.py` | main job: fetch target models from Auto.dev (year ≥ 2024, ≤ 35k mi, premium trims), insert new cars as `draft`, mark missing VINs `sold` |
| `transform_maps.py` | English→Icelandic colour + per-model spec maps |
| `_supa.py` | Supabase REST + Auto.dev helpers (reads secrets from `~/.hermes/.env`) |
| `email_summary.py` | emails the daily run summary via Resend |
| `schema_update.sql` | one-time DB migration (price_original, price_currency, vin, last_seen_at columns; status CHECK; default draft) |

Target models are defined in `TARGETS` in `sync_inventory.py`. Sold-detection
works by re-querying each car's VIN on Auto.dev — if `totalCount==0`, it's gone.

Run manually:
```bash
python3 scripts/sync_inventory.py --dry-run   # no writes, just report
python3 scripts/sync_inventory.py --limit 5   # cap new inserts (testing)
python3 scripts/sync_inventory.py             # full run
```

### Daily workflow (you)

1. Get the morning summary email (added / sold / scanned).
2. Open `/stjorn`, review each draft's original USD/CAD price.
3. Enter your ISK price → click **Birta** (publish). It goes live instantly.

---

## Admin dashboard — `/stjorn`

Password-gated UI to review drafts, set ISK prices, and publish/hide/mark-sold.
Tabs for Drög (draft) / Í sölu (live) / Seldir (sold).

- Browser → `/api/admin/cars` (server-side) → Supabase. The **service-role key
  never reaches the browser** — only server API routes use it.
- Auth is a shared secret sent in the `x-admin-password` header, checked against
  the `ADMIN_PASSWORD` env var.

---

## Environment variables

Secrets are **not** committed. Two locations:

- **Local pipeline/cron** → `~/.hermes/.env` (on the machine running the cron)
- **Vercel** (the deployed site) → Project Settings → Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | public Supabase URL (read-only client) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | public anon key (RLS-protected reads) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel + `~/.hermes/.env` | server-side writes (admin API + pipeline). **Secret.** |
| `ADMIN_PASSWORD` | Vercel | password for `/stjorn` |
| `RESEND_API_KEY` | Vercel + `~/.hermes/.env` | email sending (contact form + daily summary) |
| `CONTACT_EMAIL_TO` | Vercel (optional) | Inbox for `/api/contact`. Defaults to `sigurdur@edalkaup.is` when unset. No secrets belong in the repo. |
| `AUTO_DEV_API_KEY` | `~/.hermes/.env` | Auto.dev listings API |
| `EDALKAUP_EMAIL_TO` | `~/.hermes/.env` (optional) | daily-summary recipient (defaults to `sigurdur@edalkaup.is`) |
| `NEXT_PUBLIC_CALL_TRACKING_TEL` | Vercel (optional) | TODO: set to a `tel:+354…` URI when a call-tracking line exists. Until then every call button dials `tel:+3546992011` and the visible number stays 699 2011. |
| `NEXT_PUBLIC_GA_ID` | Vercel (optional) | GA4 (`G-…`) or Google Ads (`AW-…`). Leave unset until the id exists — do not invent one. `click_to_call` still reaches Vercel Analytics and `dataLayer`. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Vercel (optional) | Meta Pixel id. The pixel script renders only when this is set. |

Email sends from `fyrirspurn@edalkaup.is` (Resend domain `edalkaup.is`,
verified via DKIM/SPF DNS records at Domeneshop/hyp.net).

## Conversion events

| Event | Where | Notes |
|-------|--------|--------|
| `click_to_call` | Vercel Analytics custom event, plus `dataLayer` / `gtag` | Fired from header, sticky mobile bar, hero, homepage CTA, footer, car page, and contact page. Property: `placement`. If `NEXT_PUBLIC_GA_ID` is missing, a gtag stub only queues the event — it does not load Google. |
| `generate_lead` | `gtag`, when the Google tag is loaded | Existing form-success event in `ContactForm`. |
| `Lead` | Meta Pixel, when the pixel is loaded | Existing form-success event. |

Homepage and car pages post to `POST /api/contact`. A compact form may send name, phone, and message without email. The full contact form still sends email.

## Deployment

Push to `main` → Vercel auto-deploys. After changing env vars in Vercel,
trigger a redeploy (Deployments → ⋯ → Redeploy).

```bash
npm run build && npm start   # local production build
```

## TODO

- [ ] Add real hero video (`public/videos/hero.mp4`)
- [ ] Add real Google Maps embed coordinates
- [x] Logo SVG for schema (`public/logo.svg`)
- [ ] Add privacy policy page (`/personuvernd`)
- [ ] Tune `MAX_PAGES_PER_MODEL` / `TARGETS` in `sync_inventory.py` as needed
