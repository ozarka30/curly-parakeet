#!/usr/bin/env python3
# Split a Gemini two-state character sheet (tame | wild on cream paper with a ground line)
# into two trimmed, transparent PNG sprites. Usage: split.py sheet.jpg name outdir
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi

src, name, out = sys.argv[1], sys.argv[2], sys.argv[3]
im = Image.open(src).convert('RGB')
a = np.asarray(im).astype(np.int16)
H, W = a.shape[:2]
bg = np.median(np.concatenate([a[:40].reshape(-1, 3), a[-40:].reshape(-1, 3)]), axis=0)
dist = np.abs(a - bg).sum(axis=2)                      # L1 distance from paper
paper = dist < 60                                        # paper-like pixels (grain passes)
lab, n = ndi.label(paper)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
border.discard(0)
outside = np.isin(lab, list(border))                     # paper reachable from the edge
inside = ~outside

# ground line: rows that are ink across (almost) the whole width
frac = inside.mean(axis=1)
rows = np.where(frac > 0.85)[0]
if len(rows):
    top, bot = rows.min() - 2, rows.max() + 2
    keep = inside[top - 3] | inside[bot + 3]             # columns where a foot continues past the band
    band = inside[top:bot + 1].copy()
    band[:, ~keep] = False
    inside[top:bot + 1] = band
    # re-run the outside fill so the paper below the old line joins the outside
    paper2 = ~inside
    lab, n = ndi.label(paper2)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))); border.discard(0)
    inside = ~np.isin(lab, list(border))

# split at the emptiest column run in the middle third
cols = inside.sum(axis=0)
mid = slice(W // 3, 2 * W // 3)
empty = np.where(cols[mid] == 0)[0] + W // 3
cut = int(np.median(empty)) if len(empty) else W // 2

# alpha: inside = 255, soften 1px rim by paper distance
alpha = (inside * 255).astype(np.uint8)
rim = inside & ~ndi.binary_erosion(inside, iterations=1)
alpha[rim] = np.clip(dist[rim] * 255 / 120, 60, 255).astype(np.uint8)

rgba = np.dstack([a.astype(np.uint8), alpha])
for state, (x0, x1) in (('tame', (0, cut)), ('wild', (cut, W))):
    sub = rgba[:, x0:x1]
    m = sub[:, :, 3] > 0
    ys, xs = np.where(m)
    y0, y1, xa, xb = ys.min(), ys.max(), xs.min(), xs.max()
    pad = 8
    crop = sub[max(0, y0 - pad):y1 + pad, max(0, xa - pad):xb + pad]
    img = Image.fromarray(crop, 'RGBA')
    s = 360 / img.height
    img = img.resize((round(img.width * s), 360), Image.LANCZOS)
    img.save(f"{out}/{name}-{state}.webp", quality=84, method=6)
    print(name, state, img.size)
