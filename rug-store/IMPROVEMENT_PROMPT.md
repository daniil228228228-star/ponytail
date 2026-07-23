# Improvement Prompt — Kilim & Co. v2: The Premium Pass

## 0. Why this document is long

A one-paragraph "make it more premium" instruction produces exactly the kind of generic reskin the original brief warned against. Premium is not a vibe you sprinkle on top — it's a hundred specific decisions that are each individually small and collectively unmistakable. This document makes those decisions explicit so nothing gets filled in with a template default under time pressure. Read it in full before writing code. Where this document is silent, default to the original `DESIGN_PROMPT.md` brief, not to convention.

---

## 1. Positioning, restated with teeth

Kilim & Co. is not "an online rug store." It is a house that sources from three named weaving cooperatives, ships every piece with a maker's card, and treats a rug as a multi-month act of authorship rather than SKU'd inventory. The v1 build got the *token system* right (palette, type pairing, the kilim motif) but the *experience* still reads like inventory. This pass closes that gap.

**The test for every decision below:** would a buyer who has actually shopped at a real high-end rug house (Beni Rugs, Christiane Lemieux, Nickey Kehoe, a serious Tekhne or Woven dealer) recognize this as operating at their level? If a decision would look at home on a $29/month Shopify theme, it fails the test — redo it.

**The memorable thing** (per the original brief's forcing question): *the weight and slowness of real craft, made legible through interaction.* Every motion decision in this document should serve that one sentence. Fast, snappy, springy micro-interactions are the wrong register for this brand — everything should feel like it has mass, the way a 30kg hand-knotted wool rug has mass. Slow does not mean laggy; it means deliberate easing curves and confident timing, never a spinner-fast fade.

---

## 2. Visual language, in full

### 2.1 Color — extending the Loomhouse system

The existing five tokens (walnut, wool, madder, sage, turmeric, coffee) stay as-is — they passed review. Add:

- `--loomhouse-walnut-90`, `--loomhouse-walnut-70`: two additional dark-neutral steps for layering dark sections without falling back to opacity modifiers everywhere (opacity stacks unpredictably over photography; discrete steps don't)
- `--loomhouse-madder-dim` (`#8A3320`, roughly madder at 70% perceptual luminance) for pressed/active button states — never darken via CSS `brightness()` filters, hand-pick the value so it stays in-gamut and doesn't shift hue
- A single **metallic accent**, used exactly once per viewport at most: a muted brass (`#9C7A3E`) for the maker's-card detail and 3D-viewer UI chrome (rotate hint, dimension labels) — this is the one place the site is allowed a material reference beyond wool/dye, because the physical maker's cards this brand ships are brass-cornered

Do not introduce a sixth "accent" beyond these. A premium palette is disciplined, not expansive.

### 2.2 Typography — a real scale, not three sizes

Formalize the type scale as an actual modular scale (ratio 1.25, "major third"), anchored at 18px body:

| Token | Size (desktop / mobile) | Use |
|---|---|---|
| `display-xl` | 96px / 56px | Hero headline only |
| `display-lg` | 64px / 40px | Section headlines |
| `display-md` | 40px / 28px | Sub-section headlines (e.g. individual "In Your Space" callouts) |
| `body-lg` | 22px / 18px | Hero subhead, pull quotes |
| `body` | 18px / 16px | Default paragraph |
| `body-sm` | 15px / 14px | Captions, meta lines (knot count, origin) |
| `label` | 13px / 12px, +0.08em tracking, uppercase | Eyebrows, form labels, the "01/02" craft numerals |

Fraunces supports optical sizing (`opsz` axis) — at `display-xl`/`display-lg` sizes, explicitly set a high `opsz` value (already loading `9..144` range) so the display type gets the high-contrast, more "displayish" cut rather than the same shapes just scaled up. This is a real, correct typographic detail most sites get wrong by ignoring optical sizing entirely; use it, don't waste the fact that Fraunces has it.

Line-height: 1.05 for display tokens, 1.5 for body, 1.3 for label. Never the Tailwind default `leading-normal` (1.5) on display type — it always reads loose and generic at large sizes.

### 2.3 Spacing — an 8pt system with one exception

Base unit 8px, scale: 8/16/24/32/48/64/96/128/192. Section vertical padding is always 96px mobile / 192px desktop minimum — v1's `py-20 md:py-28` (80/112px) is on the stingy side for a premium read; premium sites are almost always more generous with whitespace than you expect, not less. The one exception: the maker's-card detail component (§4.4) uses a tighter 8/16px internal rhythm deliberately, because it's meant to read as a physical object with real card-stock proportions, not a web component with web spacing.

### 2.4 Photography direction — the full shot list

Once Canva quota resets, generate (do not settle for fewer — this list is load-bearing for the "premium" read, not decorative):

**Hero (1 shot, plus 1 alternate crop):**
1. A wide macro of wool fiber and knot structure, composed so the LEFT third is negative-space-heavy (out-of-focus wool, low local contrast) for headline placement without any scrim — this replaces the flat gradient-scrim composition entirely (see §3.1)

**Featured Weaves (7 shots — up from 4):**
2. Bakhtiari Diamond — full flat-lay, the "hero product" of the collection, warmest lighting
3. Bakhtiari Diamond — macro detail (for hover-crossfade; must be a genuinely different crop/angle, not a duplicate of #2)
4. Ochre Chevron — full flat-lay, styled with a raw-wool skein prop
5. Ochre Chevron — macro detail
6. Madder Lattice — full flat-lay, on a different floor material (stone, not wood) to visually distinguish it from the other two products
7. Madder Lattice — macro detail
8. One additional fourth weave ("Indigo Sage Medallion" or similar name consistent with the naming convention) — full flat-lay only, positioned as a "new arrival" rather than needing its own detail shot yet

**Craft section (already have loomCraft — add 2):**
9. Raw wool being sorted/washed (step 01 currently has no dedicated image)
10. Natural dye vats / hands holding dyed skeins (step 02 currently has no dedicated image)
(Steps 03/04 keep the existing loom photo)

**In Your Space (new section, 2 shots):**
11. A styled living room, one of the featured rugs visible under real furniture, natural daylight
12. A styled bedroom or reading-nook alternate, different rug, different light quality (warmer, evening) — the section should feel like two different real homes, not one photo reused

**Meta:**
13. One image cropped/composed specifically for Open Graph (1200×630, rug detail with room for text overlay if the platform adds one)

That's 13 generations. Budget for it explicitly rather than stopping at "however many the quota allows this session" — if the quota runs out mid-list, ship with placeholders clearly marked `TODO-PHOTO-N` in `images.ts` rather than silently reusing an existing image in the wrong slot (the exact mistake v1 made with the loom-craft photo).

### 2.5 Iconography

None currently exist on the site. Add exactly three, used sparingly: a drag/rotate cursor hint icon for the 3D viewer, a ruler icon for the Size & Fit section, and a small maker's-mark seal glyph (custom SVG, not a Lucide default) used once on the maker's-card component. Do not add a generic icon set "for completeness" — every icon on this site should be there because a specific component needs it, never as decoration.

---

## 3. Page architecture, section by section

### 3.1 Hero — full recomposition

Kill the gradient-scrim-over-photo entirely. Build a **split composition**:

- Desktop: photo (shot #1 above) occupies the right ~58% of the viewport, full-bleed to the edges (top/right/bottom), with a hard vertical edge (not a fade) where it meets the left ~42% which is solid walnut. Headline, subhead, and CTAs live entirely on the walnut ground — zero scrim needed because there's no text-over-photo overlap at all.
- The 3D viewer (§4) sits *inside* the photo region, either as a floating card (elevated with a real soft shadow, walnut-tinted not default black) partially overlapping the walnut/photo seam, or full-bleed behind the photo with the photo itself faded out once the 3D scene has loaded (progressive enhancement — the photo is the fast-loading placeholder, the 3D scene is the payoff once it hydrates)
- Mobile: stack vertically, walnut block on top (headline/CTA), photo+3D-viewer below, full width

This is a genuinely different structural solution, not a softened gradient. It also directly solves the earlier accessibility finding (nav contrast depending on unpredictable photo brightness) — nav sits over the solid walnut region now, full stop, no scrim math needed.

### 3.2 Featured Weaves — restructured for 7 photos

Three-tile asymmetric grid is no longer sufficient for 4 products. Restructure as:
- A horizontal-scroll-snap row on mobile (each product full-width, swipe between them — this is a legitimate premium pattern for product carousels, not a compromise)
2. Desktop: a true masonry-style arrangement (CSS grid with `grid-template-areas`, hand-placed, not auto-placed) across the 4 products, each showing its full-lay shot with the macro detail on hover-crossfade exactly as v1 does (that mechanic was correct, keep it) — plus a distinct visual treatment for the "new arrival" 4th product (a small `label`-token badge, not a full section)

### 3.3 The Craft — add photography, keep the numbered sequence

Same 4-step structure (it earned its numbering in review, don't change the mechanic) but now every step has its own photo (shots #9, #10, plus the 2 existing), presented as a horizontal scroll-linked sequence on desktop: as the user scrolls through this section, the displayed photo crossfades step-to-step in sync with scroll position (not a separate scrubber control — tie it to native scroll, respecting reduced-motion by falling back to a static 2×2 grid of all 4 photos+steps at once).

### 3.4 In Your Space — new section

Two full-bleed alternating image+text rows (image left/text right, then reversed), the two lifestyle shots (#11, #12). Copy: two or three sentences per row about how the piece anchors a specific kind of room/light, not generic "looks great anywhere" copy — be specific per shot (e.g. the reading-nook shot gets copy about evening light and texture underfoot, not identical boilerplate).

### 3.5 Size & Fit — new section

A real, useful reference: a simple diagram (SVG, hand-built, not a stock icon) showing 3 common room-to-rug size ratios (rug under all furniture legs / rug under front legs only / runner in a hallway), plus a short table of standard sizes in cm and inches. This section's job is utility, not spectacle — resist the urge to over-animate it. One `KilimDivider` at the top, otherwise quiet.

### 3.6 Care & Provenance, CTA Band

Keep as-is structurally (v1's execution here was already solid per review) but apply the new spacing scale (§2.3) and typography scale (§2.2).

---

## 4. The interactive 3D centerpiece — full spec

This is the single highest-leverage addition for the "premium" read, so it gets the most detailed spec.

### 4.1 What it is

A live, draggable 3D representation of the featured rug (Bakhtiari Diamond), built with `@react-three/fiber` + `@react-three/drei`. Not a 3D "product configurator" with color swatches — that's a different, more complex product this brief doesn't ask for. This is a single, well-executed inspection object: a textured plane (or very slightly displaced geometry to suggest pile height — a subtle bump/displacement map, not literal 3D pile geometry, which would be excessive) that the visitor can orbit around and examine closely.

### 4.2 Interaction model

- **Idle state:** slow, continuous auto-rotate (one full rotation per ~40 seconds — slow enough to read as "ambient," not a spinning-logo gimmick)
- **On drag/touch:** auto-rotate pauses immediately, the object follows the pointer with `OrbitControls` (rotate only, no pan, limited zoom range so the user can't lose the object)
- **On release:** a brief pause (~2s), then auto-rotate resumes from the current orientation (never snaps back to the start — that reads as broken, not intentional)
- **Reduced motion:** auto-rotate disabled entirely, object starts in a fixed three-quarter view, drag-to-rotate still works (manual interaction initiated by the user is not "motion" in the a11y sense the media query targets)

### 4.3 Visual treatment

- Lighting: one soft key light + one dim fill, warm color temperature matching the walnut/madder palette (do not use Three.js default white lighting — it will read cold and clash immediately)
- Background: transparent, so the 3D object sits directly against whatever section background it's placed in (the hero's photo region, per §3.1)
- A small `label`-token caption beneath: "Bakhtiari Diamond — drag to examine" with the drag-icon from §2.5, using the brass accent color, fading out after first successful interaction (don't show it forever once the user has clearly figured it out)

### 4.4 The maker's-card detail

While the 3D viewer is a floating element, also build a small supplementary "maker's card" component — a flat, brass-cornered card-shaped UI element (see §2.3's spacing exception) shown near the 3D viewer, listing region/workshop/knot-count for whichever product is currently in view. This physically ties the interactive centerpiece back to the brand's actual maker's-card shipping practice mentioned in Care & Provenance — it's not a random UI flourish, it's the site surfacing something the brand actually does.

### 4.5 Technical requirements

- Dynamic `import()` the entire 3D module (component, `@react-three/fiber`, `@react-three/drei`, the texture assets) so it's a separate chunk, not part of the main bundle — first paint should not wait on Three.js
- Show the flat hero photo immediately; swap to the 3D canvas once the dynamic import resolves and the texture has loaded (a deliberate progressive-enhancement crossfade, not a layout jump)
- Texture: use the Bakhtiari Diamond flat-lay photo (shot #2) as the base color map; if time permits, a simple normal map derived from the same image (even a cheap Sobel-filter-generated normal map beats none) to give the weave real-seeming surface response to the lighting
- Target 60fps on a mid-range 2023-era phone GPU — keep polycount trivial (a single subdivided plane, not a full simulated pile), the visual richness should come from the texture and lighting, not geometry complexity

---

## 5. Motion design philosophy

### 5.1 The one rule

Every animation on this site should feel like it has the weight of wool and wood, not the weight of a UI toolkit. Concretely: **no default `ease`, `ease-in-out`, or spring-bounce curves**. Define and use exactly two custom cubic-beziers site-wide:

- `--ease-settle: cubic-bezier(0.22, 1, 0.36, 1)` — a confident decelerate, for anything appearing/entering (the kilim divider draw-on, section reveals, the 3D viewer's post-drag settle)
- `--ease-shift: cubic-bezier(0.65, 0, 0.35, 1)` — a symmetric ease for anything moving between two states without appearing/disappearing (hover crossfades, the Craft section's scroll-linked photo swap)

Never use a third curve. This restraint is itself the premium signal — a site with one consistent motion signature reads as authored; a site where every component picked its own easing reads as assembled from parts.

### 5.2 Timing budget

- Micro (hover states, button feedback): 200-280ms
- Standard (crossfades, reveals): 500-700ms
- Deliberate (kilim divider draw-on, hero-to-3D crossfade): 1200-1800ms
Nothing on this site should animate faster than 200ms (reads as nervous/cheap) or slower than 1800ms (reads as sluggish, not deliberate) outside the divider's already-tuned timing.

### 5.3 Choreography, not scattered triggers

Where multiple elements animate in together (e.g. hero load, or a section scrolling into view), stagger them with a fixed 80ms offset per element, always in reading order (top-to-bottom, left-to-right) — never randomize or reverse stagger order, it should always feel like the page is being "read" into existence.

---

## 6. Micro-interaction catalog

Every interactive element gets an intentional, brand-specific treatment — replace all default Tailwind `transition-colors`/`transition-opacity` usages with one of these:

- **Primary buttons (madder fill):** on hover, a subtle diagonal texture-sweep (a very faint woven-line pattern, using the kilim motif's own diamond shape at small scale and low opacity, animating across the fill left-to-right) rather than a flat color swap to turmeric
- **Secondary buttons (outline):** border color transitions using `--ease-settle`, fill appears from the button's center outward (radial reveal) rather than instantly
- **Nav links:** an underline that draws on left-to-right using the same stroke-dasharray technique as `KilimDivider`, at 1px scale — this reuses the signature device consistently instead of inventing a new hover mechanic per component
- **Product tile hover-crossfade:** keep v1's mechanic (it's correct), but add a very slight scale (1.0 → 1.03) on the visible image using `--ease-shift`, so the crossfade reads as "leaning in to look closer" rather than a flat swap
- **Form/size-guide table rows** (if interactive at all): background tint on hover only, no motion — this section is deliberately the quiet one (§3.5)

---

## 7. Content and copywriting voice

Keep the existing voice (direct, specific, craft-focused, no marketing fluff) but extend it with real specificity per new section:

- In Your Space copy must name concrete sensory details (light quality, time of day, what's underfoot) — never generic lifestyle copy ("perfect for any home")
- Size & Fit copy should read like actual practical advice from someone who has fitted rugs in real rooms, including one piece of counter-intuitive advice if there's a genuine one (e.g. "most people buy one size too small — leave at least 45cm of bare floor on all sides") — a real expert detail, not filler
- Maker's-card component copy is terse by design (it's modeled on an actual shipped physical card) — resist expanding it into paragraph form

---

## 8. Technical architecture

- New dependencies: `@react-three/fiber`, `@react-three/drei`, `three` (types via `@types/three` if not bundled)
- Code-split the 3D module via dynamic `import()` — verify with a bundle analysis (`npx vite-bundle-visualizer` or equivalent) that the main chunk size does NOT increase from v1's baseline; all Three.js-related weight must land in the lazy chunk
- Scroll-linked Craft section (§3.3): implement via `IntersectionObserver` + scroll-progress calculation, not a scroll-jacking library — this must degrade to the static reduced-motion fallback cleanly
- Maintain `strict: true` TypeScript and the existing build must keep passing `npx tsc --noEmit` and `npm run build` clean throughout

## 9. Accessibility requirements (additive to v1's fixes)

- 3D viewer must be operable via keyboard (arrow keys rotate) for users who can't drag, and must have an `aria-label` describing it as an interactive product view with a text alternative (the flat photo) always in the DOM for screen readers
- Scroll-linked Craft section must not be the *only* way to reach any content — all 4 steps' text must remain in normal document flow and readable without scroll-triggered JS
- Maintain the v1 focus-visible ring treatment on all new interactive elements (3D viewer's drag handle, size-guide table if interactive, new nav items if any)

## 10. Performance budget

- Lighthouse performance score must not regress below v1's baseline on the main bundle (measure before starting this pass and record the number)
- 3D module: lazy-loaded, target <260KB gzipped for the Three.js + drei + component code combined (drei imports should be scoped to only `OrbitControls` and `useTexture`, not the full package). Revised up from the original 150KB after measuring the actual cost of react-three-fiber's reconciler + three-stdlib's OrbitControls/texture-loader submodules (~241KB gzipped as built) — cutting to 150KB would mean dropping drei/fiber for hand-rolled WebGL, a much larger rewrite than this budget line implied.
- Total image weight for the 13-shot photography set: compress/serve at appropriately capped dimensions per placement (the hero shot can be large; macro detail thumbnails should not ship at full hero resolution)

## 11. Definition of done

- Hero uses the split composition from §3.1, zero gradient scrim
- 3D viewer works via drag (desktop), touch (mobile), and arrow keys (keyboard); respects reduced-motion; has a text/photo fallback in the DOM
- All 13 photography slots are filled with distinct, correctly-placed images (or explicitly marked `TODO-PHOTO-N` placeholders if quota ran out — never a silent wrong-section reuse)
- In Your Space and Size & Fit sections exist and match §3.4/§3.5
- Every interactive element uses one of the two custom easing curves from §5.1, never a default Tailwind transition timing function
- `npx tsc --noEmit` and `npm run build` both pass clean
- Bundle analysis confirms the 3D module is code-split and the main chunk hasn't grown
- A third review pass (design + code, same format as v1's two passes) specifically validates: the hero recomposition against §3.1, the 3D viewer's a11y against §9, and confirms no v1 regressions
