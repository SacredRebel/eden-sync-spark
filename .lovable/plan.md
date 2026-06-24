# Placeholder Image Audit

I scanned every reference to `/placeholder.svg` and `/placeholder.jpg` in the project. Here's exactly how many real images you need and where each one goes.

## Total: 19 images needed

| # | Location | Count | Purpose | Suggested size |
|---|---|---|---|---|
| 1 | Home hero background (`src/routes/index.tsx`) | **1** | Full-width hero behind the headline | 1920×1080 (landscape) |
| 2 | "Eden Difference" cards (`src/data/services.ts` → `edenDifference`) | **6** | One image per differentiator card | 640×420 (landscape) |
| 3 | Project before/after pairs (`src/data/projects.ts`) | **12** | 6 projects × (before + after) | 800×600 (landscape) |

### Breakdown of the 6 project pairs (before + after each)

1. Overgrown Yard Cleanup
2. Fruit Tree Pruning & Mulching
3. Raised Garden Bed Setup
4. Soil & Compost Refresh
5. Water-Smart Planting Area
6. Natural Garden Corner

## What's NOT in the count (no images today, optional later)

- **Signature Projects** section (`signatureProjects` in `services.ts`) — currently text-only cards. Add images only if you want thumbnails (+3).
- **Project timeline steps** — each step has an empty `images: []` array. Optional process photos (up to 3 per project × 6 = 18 more if you want fully illustrated process timelines).
- **Service grid** — uses Lucide icons, no photos needed.
- **Form/input `placeholder=` attributes** — those are HTML text placeholders, not images.

## Replacement plan (when you're ready to build)

1. **You provide images** in any of three ways:
   - Upload real photos (drag into chat) — best for authenticity
   - Ask me to AI-generate them (I'll match the green/cream Eden palette)
   - Mix: real photos where you have them, AI for the rest
2. **I upload each to the Lovable CDN** via `lovable-assets` so they don't bloat the repo, and write `.asset.json` pointers under `src/assets/`.
3. **I wire them in:**
   - Hero: swap the `bg-[url('/placeholder.jpg')]` in `index.tsx`
   - Eden Difference: replace the 6 `image:` strings in `services.ts`
   - Projects: replace the 12 `src:` strings in `projects.ts` (and update `alt` + `caption` from "placeholder" text to real descriptions)
4. **Keep `/placeholder.svg`** as a fallback — the `|| "/placeholder.svg"` guards in the components are good to leave alone.

## Recommended first batch (if you want to start small)

The 1 hero + 6 Eden Difference cards = **7 images** covers the entire landing page above the portfolio. Project before/afters can come next as a separate batch (ideally real photos of your work).

---

**Tell me which route you want:** real uploads, AI-generated, or a mix — and whether to start with the 7 landing-page images or do all 19 in one go.
