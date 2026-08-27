# Flag Removal Map — visual system

## Direction: field cartography for code archaeology

Flag removal is less like deleting a switch and more like surveying a landscape before taking down a bridge. The site therefore uses the language of a working topographic field map: contour lines for reach, square survey markers for evidence, a vermilion route for the removal path, and margin notes for cautions. It should feel precise, calm, and operational—not outdoorsy decoration and not a generic developer gradient.

## Palette

The light treatment is a sun-warmed paper map; the dark treatment is a night survey board. Both are encoded as CSS tokens.

| Token | Light | Dark | Meaning |
| --- | --- | --- | --- |
| Background | `#F3F0E6` | `#111815` | map stock / night field board |
| Surface | `#FCFAF3` | `#19231F` | annotation panel |
| Text | `#18231E` | `#F2EFE4` | carbon ink |
| Muted | `#57635D` | `#AEBBB4` | secondary survey notes |
| Accent | `#B8402A` | `#FF8B70` | marked removal route |
| Accent contrast | `#FFFFFF` | `#24120E` | copy on route marker |
| Success | `#276549` | `#72C89A` | corroborated evidence |
| Warning | `#8B5C10` | `#F2BE62` | human review required |
| Danger | `#9E2C2C` | `#FF8A83` | scan/input failure |
| Contour | `#C8C4B6` | `#34443D` | terrain/reference texture |

No gradients. Status is always paired with text or shape, never color alone. The primary treatments were checked against their backgrounds at WCAG AA body-text contrast.

## Type and spacing

- Headings: Georgia, `Times New Roman`, serif. Its engraved, field-journal character differentiates the product without adding a font payload.
- Interface and code: ui-monospace, SFMono-Regular, Consolas, monospace. It makes commands and evidence coordinates feel native to engineering work.
- Scale: 14 / 16 / 20 / 28 / 44 / 64 px with 1.5 body leading and tabular numerals.
- Spacing follows an 8 px survey grid, with 4 px used only for tight label relationships. Reading measures stop at 72 characters.

## Interaction grammar

Links and buttons behave like map annotations: square edges, inset keylines, and a small coordinate-style label. Hover raises the mark by 2 px; active presses it back into the page. Focus uses a 3 px vermilion outline with a 3 px offset. The demo moves through three explicit stations—inventory, evidence, route—so the hierarchy mirrors the CLI output.

## Motion policy

Only the removal route draws on entry (600 ms), result markers settle once (220 ms), and controls move 2 px on hover (160 ms). Nothing loops. Under `prefers-reduced-motion: reduce`, drawing and movement are removed and state changes are immediate; opacity is not required to understand any result.

## Asset plan and provenance

- `site/public/topographic-route.webp`: original raster hero illustration generated for this product with `/opt/fleet/lib/gen-image.sh` (`factory-image` deployment), then converted to WebP and kept below 300 KB. Prompt: “Editorial topographic survey map of an abstract software repository landscape, fine ink contour lines on warm ivory paper, three small square evidence markers connected by one vermilion route, subtle coordinate ticks and field-note texture, no words, no letters, no logos, no UI screenshot, flat printmaking style, wide 3:2 composition, high negative space, restrained forest green charcoal and vermilion palette.” License/provenance: generated original, 2026-08-27; no third-party source material.
- Icons and contour overlays are hand-authored CSS/SVG primitives created in-repository and contain no third-party assets.

## Responsive intent

At 390 px the map remains visible but becomes a shallow orientation panel, commands wrap in scrollable code blocks, and the three-station process stacks into one trail. Desktop-only coordinate ticks are hidden. All actions retain at least 44 × 44 px targets and safe-area padding.
