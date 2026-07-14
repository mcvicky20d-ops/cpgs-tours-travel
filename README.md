# CPGS Tours & Travels Website

Animated, multi-page, dependency-free static website for CPGS Tours & Travels with a
WhatsApp-first booking flow and full on-page SEO.

## Pages

| File | URL (production) | Purpose |
| --- | --- | --- |
| `index.html` | `/` | Home — hero, stats, featured destinations, packages, fleet, testimonials |
| `packages.html` | `/packages` | All tour packages with per-package WhatsApp booking |
| `destinations.html` | `/destinations` | Destination guides (temples, hills, backwaters) |
| `fleet.html` | `/fleet` | Vehicles + indicative tariff table |
| `about.html` | `/about` | Story, values, testimonials |
| `contact.html` | `/contact` | Booking form → WhatsApp, phones, FAQ |

Shared assets: `styles.css` (design system + animations), `script.js` (nav, scroll
reveal, counters, WhatsApp form).

## Booking system (WhatsApp CTA)

- Floating WhatsApp button on every page.
- Every package/destination/vehicle card has a "Book on WhatsApp" link with a
  pre-filled message.
- The contact-page form composes the trip details into a WhatsApp message and opens
  `wa.me` — no backend needed.
- **WhatsApp number** is set in two places:
  - `script.js` → `WHATSAPP_NUMBER` constant (used by the form)
  - `wa.me/919487411599` links in each HTML file (find & replace to change)

## Animations

Scroll-reveal (IntersectionObserver), staggered card entrances, animated stat
counters, hero Ken Burns zoom, destination marquee, card hover lifts and a pulsing
WhatsApp button. All animations respect `prefers-reduced-motion`.

## SEO

- Unique title/description/canonical + Open Graph/Twitter tags per page.
- JSON-LD structured data: `TravelAgency` (home), `TouristTrip`/`TouristDestination`
  lists, `BreadcrumbList` on inner pages, `FAQPage` on contact.
- `sitemap.xml` + `robots.txt` (URLs point at `https://cpgstoursandtravels.in` —
  update if the production domain changes).
- Lazy-loaded images, semantic HTML, descriptive alt text.

## Things to customize

- **Prices** in `packages.html` and `fleet.html` are indicative placeholders marked
  "from ₹…" — replace with real rates.
- **Stats** (years, travellers, rating) in `index.html` / `about.html` — set real
  numbers in the `data-count` attributes.
- **Testimonials** are illustrative — replace with real customer reviews.
- **Base city / address**: add it to the footer and to the `TravelAgency` JSON-LD in
  `index.html` (an `address` field) for stronger local SEO.

## Run locally

Open `index.html` in a browser, or `python3 -m http.server` in this folder.
Deployed on Vercel with `cleanUrls` (see `vercel.json`).

## Source Contact Details

- Phone: +91 94874 11599 (also the WhatsApp booking number)
- Phone: +91 94863 65972
- Phone: +91 94434 25972
- Email: cpgstoursandtravels24@gmail.com
- Source: https://cpgstoursandtravels.in/contact-us/
