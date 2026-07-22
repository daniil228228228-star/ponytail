# Improvement Prompt — Kilim & Co. v2

## Where v1 falls short of a $10k engagement

The design review (see git history) confirmed the token system holds up — palette, type, the kilim motif, reduced-motion handling are all genuinely correct. What's missing is everything that separates "well-tokenized template" from "someone spent real budget on this":

1. **Hero is still a template shape.** Gradient scrim + bottom-left text + two buttons over a photo is the single most common hero pattern on the web. The brief asked for the headline "set into the negative space of the weave" — a scrim is not that, it's the same pattern with a softer edge.
2. **No interactivity beyond hover/scroll.** Everything is static photography. A $10k site for a *tactile, textural product* should let the visitor manipulate something.
3. **Only 4 photos, one page, one path.** A real storefront has a product to examine from multiple angles, a way to imagine it in your own space, and more than one screen's worth of content.
4. **Micro-interactions are default-Tailwind.** `transition-colors`, `transition-opacity` — nothing here is authored specifically for this brand.

## What to build

### 1. Interactive 3D rug viewer (the centerpiece ask)
Add a real, live, in-browser 3D object — not a Remotion-rendered video, an actual interactive `@react-three/fiber` scene the visitor can rotate/inspect:
- A rug rendered as a textured plane (or slightly-displaced geometry for pile thickness) with the product photography mapped as the texture
- Orbit-style rotation on drag (mouse) / touch (mobile), gentle auto-rotate when idle
- Placed either as the hero's centerpiece (replacing the flat photo-with-scrim) or as a dedicated "Examine this weave" module in Featured Weaves — pick whichever reads less like a gimmick and more like genuine product inspection
- Respect `prefers-reduced-motion`: disable auto-rotate, keep manual drag
- Lazy-load the 3D scene (dynamic import) so it doesn't block first paint — this is added weight and should be justified by being genuinely useful, not just "because we can"

### 2. Hero recomposition
Replace the gradient-scrim-over-photo with one of:
- A split composition: 3D viewer or macro photo on one side, headline set directly against the wool/walnut ground on the other (no scrim needed at all)
- Or: headline text as a mask cut into the photo itself (background-clip/mix-blend-mode technique) so the weave literally shows through the letterforms
Either is a compositionally distinct solution, not a softened version of the same one.

### 3. Photography (once Canva quota resets)
Generate 5-6 distinct finished-rug shots (not 4, not reusing craft-process photos as product photos) plus:
- 2-3 detail/macro texture shots specifically for the hover-crossfade (currently reusing whole-rug photos as "details")
- 1 styled interior/lifestyle shot (rug in a real room) for a new "In Your Space" section
- 1 image sized for Open Graph/social preview

### 4. New sections
- **"In Your Space"** — the lifestyle photo, brief copy about how a hand-knotted rug anchors a room
- **Size & fit guide** — real information (common sizes, how to measure a room), styled consistently, not an afterthought
- **A second scroll-triggered choreography** beyond the kilim divider — e.g. Featured Weaves' large tile image doing a slow Ken Burns zoom while in view, tied to scroll position rather than just a hover state

### 5. Authored micro-interactions
Replace default Tailwind transitions where they're load-bearing for brand feel:
- Buttons: a subtle woven-texture hover fill (animate a pattern sweep, not just a color swap)
- Nav links: an underline that draws on like the kilim divider's own stroke technique, reusing that signature device at small scale instead of a plain color change

## Stack additions

`@react-three/fiber` + `@react-three/drei` (for `OrbitControls`, `useTexture`) — install in `rug-store/`, dynamic-import the 3D module so it's code-split from the main bundle.

## What stays out of scope

Same as v1: no real checkout/payments, no CMS. This pass is entirely front-end craft and interactivity — the goal is closing the gap between "correct" and "feels expensive," not adding backend infrastructure.

## Definition of done

- 3D viewer works on desktop (drag) and mobile (touch), degrades gracefully with `prefers-reduced-motion`
- Hero no longer uses a flat gradient-scrim-over-photo composition
- At least 2 new sections added (In Your Space, Size & Fit)
- `npm run build` and `npx tsc --noEmit` both still pass clean
- A second review pass (design + code, same as v1) confirms no regressions and validates the new interactive pieces specifically
