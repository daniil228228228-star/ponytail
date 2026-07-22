# Kilim & Co. — rug storefront

Distinctive, non-templated marketing front page for a rug/carpet retailer. Built per `DESIGN_PROMPT.md` — read that first for the full creative brief (palette, type, motif, motion rationale).

## Stack

React + TypeScript + Tailwind + Vite. Fonts: Fraunces (display) + Public Sans (body), loaded via Google Fonts `<link>` in `index.html`.

## Photography

Product/hero photography is AI-generated via the Canva MCP connector (see `src/images.ts`). **These are temporary signed export URLs (valid ~18-20h from generation)** — they will 404 after that. Before any real deployment:

1. Download the 4 images from the URLs in `src/images.ts`
2. Commit them to `src/assets/` (or upload to permanent hosting/CDN)
3. Swap the URLs in `src/images.ts` — it's the only file that needs to change

## Structure

- `Hero` — full-bleed photo, scroll parallax (respects `prefers-reduced-motion`)
- `FeaturedWeaves` — asymmetric grid, hover crossfades to a detail/texture shot
- `KilimDivider` — the recurring signature motif (draws on scroll into view via `IntersectionObserver`) instead of a generic accent-bar/color-stripe
- `Craft` — the one section with numbered steps, because it's an actual real sequence
- `CareProvenance`, `CTABand` — closing sections

## Usage

```bash
npm install
npm run dev      # local preview
npm run build    # production build
```

## Scope note

This is the front-end storefront page only — no real checkout/payments (needs Shopify/Stripe), no product database/CMS. See `DESIGN_PROMPT.md`'s "Budget framing" section for what "$10k" means here.
