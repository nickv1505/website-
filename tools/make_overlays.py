"""
Makes the image assets the site uses to turn a real photo into its "before" version:

  assets/img/wear-1.jpg, wear-2.jpg  scuffs, patched spots, nail holes and uneven, yellowed
                                     paint on a white background; blended over a photo with
                                     mix-blend-mode: multiply (white = no change)

Run: python3 tools/make_overlays.py   (needs numpy, scipy, pillow)
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter

OUT = Path(__file__).resolve().parent.parent / "assets" / "img"


def noise(rng, shape, sigma):
    n = gaussian_filter(rng.standard_normal(shape).astype(np.float32), sigma)
    return n / (n.std() + 1e-9)


def mask(shape, fn, blur):
    m = Image.new("L", (shape[1], shape[0]), 0)
    fn(ImageDraw.Draw(m), m)
    return gaussian_filter(np.asarray(m, np.float32) / 255.0, blur)


def wear(seed, w=1200, h=900):
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    img = np.ones((h, w, 3), np.float32)
    # uneven, yellowed old paint: stronger toward the top of the frame
    b = noise(rng, (h, w), 70)
    disc = np.clip(0.05 * b + 0.05 * np.exp(-yy / 260.0) + 0.03, 0, None)
    # a cleaner rectangle where a picture used to hang
    gx, gy = rng.uniform(0.5, 0.7) * w, rng.uniform(0.18, 0.3) * h
    ghost = mask((h, w), lambda d, m: d.rectangle([gx, gy, gx + 0.2 * w, gy + 0.16 * h], fill=255), 1.6)
    disc *= 1 - 0.8 * ghost
    img *= np.stack([1 - 0.35 * disc, 1 - 0.55 * disc, 1 - 1.15 * disc], -1)
    # grime smudges
    for _ in range(3):
        cx, cy, r = rng.uniform(0.1, 0.9) * w, rng.uniform(0.35, 0.75) * h, rng.uniform(25, 45)
        g = np.exp(-(((xx - cx) / r) ** 2 + ((yy - cy) / (r * 1.4)) ** 2) / 2) * (1 + 0.3 * noise(rng, (h, w), 14))
        img *= (1 - 0.07 * np.clip(g, 0, 1))[..., None]

    # scuffs at furniture height and shoe marks low down
    def rubs(d, m):
        for _ in range(26):
            x0, y0 = rng.uniform(0.05, 0.95) * w, rng.uniform(0.45, 0.8) * h
            ang = rng.normal(0, 0.25)
            for k in range(rng.integers(2, 5)):
                L, oy = rng.uniform(15, 60), k * rng.uniform(2, 5)
                d.line([(x0, y0 + oy), (x0 + L * np.cos(ang), y0 + oy + L * np.sin(ang))],
                       fill=int(rng.uniform(80, 200)), width=int(rng.uniform(2, 5)))
    img *= (1 - 0.22 * mask((h, w), rubs, 1.8))[..., None]

    def shoe(d, m):
        for _ in range(12):
            x0, y0 = rng.uniform(0.05, 0.95) * w, rng.uniform(0.82, 0.93) * h
            d.line([(x0, y0), (x0 + rng.uniform(5, 20), y0 + rng.normal(0, 2))], fill=int(rng.uniform(150, 255)), width=int(rng.uniform(2, 4)))
    img *= (1 - 0.45 * mask((h, w), shoe, 0.9))[..., None]

    # nail holes (with one above the ghost rectangle)
    def holes(d, m):
        pts = [(gx + 0.1 * w, gy - 10)] + [(rng.uniform(0.1, 0.9) * w, rng.uniform(0.15, 0.6) * h) for _ in range(4)]
        for (hx, hy) in pts:
            d.ellipse([hx - 2, hy - 2, hx + 2, hy + 2], fill=255)
    img *= (1 - 0.55 * mask((h, w), holes, 0.5))[..., None]
    # unpainted spackle patches read slightly grey-white through a multiply blend
    def patches(d, m):
        for _ in range(3):
            px, py = rng.uniform(0.15, 0.85) * w, rng.uniform(0.3, 0.7) * h
            for _ in range(4):
                r = rng.uniform(4, 9)
                ox, oy = rng.normal(0, 5, 2)
                d.ellipse([px + ox - r, py + oy - r * 0.8, px + ox + r, py + oy + r * 0.8], fill=255)
    pm = mask((h, w), patches, 1.5)
    img *= (1 - 0.05 * pm)[..., None]
    img = np.clip(img, 0, 1)
    Image.fromarray((img * 255 + 0.5).astype(np.uint8)).save(OUT / f"wear-{seed}.jpg", quality=86, optimize=True)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    wear(1)
    wear(2)
    print("wrote wear-1.jpg, wear-2.jpg")
