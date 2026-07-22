# Development Prompt — "Kilim & Co." Rug & Carpet Storefront

## The brief

Build a distinctive, non-templated marketing/storefront front page for a rug and carpet retailer. The subject is **textile craft**: hand-knotted wool, natural dyes, loom-woven pattern, generations of technique. The design should feel like it was made by people who love rugs, not by a generic SaaS design system reused for a different vertical.

**Reject by default** (unless the user asks for one of these specifically): warm cream (#F4F1EA) + serif + terracotta combo, purple-to-blue gradient hero, Inter/Space Grotesk as the safe sans, rounded-lg cards everywhere, accent stripes/color bars down the side of cards, centered-everything layout, emoji section markers, numbered 01/02/03 markers where there's no real sequence.

## Visual direction (token system)

**Color** — "Loomhouse" palette, drawn from natural dye pigments, not a generic brand palette:
- `#241914` — near-black walnut (background, dark sections)
- `#F7F0E4` — undyed wool (light ground — NOT the AI-cliché cream, warmer/greyer)
- `#B5432A` — madder root red (primary accent — rug-red, not corporate red)
- `#7A8B6F` — indigo-resist sage (secondary, cool counterweight)
- `#D9A441` — turmeric gold (sparing highlight, e.g. price tags, hover states)
- `#3A2E27` — coffee-bean text on light ground

**Type** — pair a characterful slab/humanist serif for display (evokes woodblock-printed pattern books) with a plain, quiet grotesk for body/UI. Do not use Inter for display type. Suggested pairing: **Fraunces** (display, high-contrast, warm) + **Public Sans** or **IBM Plex Sans** (body/UI, neutral workhorse). Set a real type scale (not just "big/medium/small"): display 64–96px, section head 32–40px, body 16–18px, caption 13px with letter-spacing.

**Motif** — the recurring device is **woven pattern**, not a color bar. Use actual geometric kilim-motif SVG borders/dividers (diamond lattice, stepped chevron) as section transitions instead of straight hairlines. Repeat one specific motif shape across the page (in the nav, in a footer border, in a loading/hover micro-interaction) so it reads as a signature, not decoration-of-the-week.

**Layout** — composition-first. Hero is a full-bleed macro photograph of wool fiber/knot detail with the headline set INTO the negative space of the weave, not stacked on a flat color block. Product grid breaks the uniform-card monotony: vary tile sizes (one large "featured weave" tile against smaller square tiles), matching how rugs are actually displayed folded/hung/rolled in a real showroom.

## Content sections (in order)

1. **Hero** — full-bleed photo (hand-knotting close-up or a styled room shot), one-line thesis ("Every knot is a decision"), primary CTA "Shop the Collection", secondary "Our Craft"
2. **Featured weaves** — asymmetric grid, 5–6 real rug photos with region/material/knot-count as captions (specificity over stock-photo vagueness)
3. **The Craft** — a horizontal scroll or stepped reveal showing raw wool → dyed yarn → loom → finished knot (this is a REAL sequence, so numbered steps are earned here, unlike most AI-generated pages)
4. **Care & provenance** — two-column: washing/care instructions (utilitarian, real information) beside origin map or maker's-mark detail
5. **CTA band** — dark section, one large woven-border framed offer, no gradient

## Motion

- Hero photo: slow parallax drift (2–3% translate) on scroll, not a spinning/bouncing gimmick
- Section transitions: the kilim-motif divider "weaves in" (stroke-dashoffset draw-on) as it scrolls into view — ties motion to the motif, not a generic fade-up
- Product tiles: on hover, a second detail-shot (macro texture) crossfades in — feels like handling the rug, not a UI convention
- Respect `prefers-reduced-motion`: fall back to instant state, no parallax

## Stack

React + TypeScript + Tailwind + Vite (matches this repo's existing `site/` project pattern). Real photography generated via the Canva MCP connector (already live in this session) rather than placeholder gradients. Self-contained, both light and dark sections handled explicitly (this is a single committed visual direction — dark hero/CTA, light product sections — not a prefers-color-scheme toggle).

## Budget framing

"$10k budget" is treated here as a **scope/quality bar** (this is the level of craft and photography a real $10k freelance design engagement would produce), not a literal payment — I can't process real payments or hire real photographers. What's actually deliverable in this session: the full front-end storefront page (hero, product showcase, craft story, CTA), AI-generated product photography via Canva, and real CSS/JS animation — a polished, launch-ready static front end. What's out of scope without further setup: real checkout/payments (needs a Shopify/Stripe account), a real product database/CMS, and real photographer-shot images (I'll generate photorealistic AI renders instead, clearly good enough for a launch page, not for a print catalog).
