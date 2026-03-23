# Eðalkaup — edalkaup.is

Modern Next.js website for Eðalkaup, an Icelandic car import business (subsidiary of Úranus ehf.).

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- Dark theme with gold accent

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `/` — Home with hero video, featured cars, about section
- `/bilar` — Car inventory with filters
- `/bilar/[slug]` — Individual car page with gallery, specs, sharing
- `/afhent` — Delivered cars gallery (social proof)
- `/um-okkur` — About page (company story, import process)
- `/hafa-samband` — Contact page with form

## Key Features

- **Open Graph meta tags** on every car page for Facebook sharing
- **Facebook share + copy link buttons** on car pages
- **JSON-LD structured data** (schema.org/Car) for SEO
- **301 redirects** from old WordPress URLs
- **Sitemap** auto-generated
- **Responsive** mobile-first design
- **Video support** — hero video + per-car YouTube/Vimeo embeds

## Data

Car data is currently in `src/data/cars.ts` (mock data). Replace with API/database connection when ready.

## Deployment

```bash
npm run build
npm start
```

## TODO

- [ ] Connect to car-sourcer SQLite database
- [ ] Add real hero video (`public/videos/hero.mp4`)
- [ ] Add real car photos
- [ ] Connect contact form to email backend (Formspree, Resend, etc.)
- [ ] Add real Google Maps embed coordinates
- [ ] Add logo SVG
- [ ] Add privacy policy page (`/personuvernd`)
