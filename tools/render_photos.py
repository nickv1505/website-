"""
Renders the site's wall-painting photos (assets/img/photos/*.jpg).

The images are procedurally generated so they stay on-message: ordinary rooms,
real drywall, before/after wall painting, job-site details, no people.
Each scene is built as a flat wall "elevation", then shot through a simulated
phone camera (slight tilt, uneven framing, grain, softness, JPEG).

Run:  python3 tools/render_photos.py            (all images)
      python3 tools/render_photos.py bathroom   (names containing "bathroom")
Needs: numpy, scipy, pillow
"""
import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter, map_coordinates

W, H = 2400, 1800
OUT = Path(__file__).resolve().parent.parent / "assets" / "img" / "photos"

TRIM = (0.92, 0.905, 0.87)
CEIL = (0.94, 0.935, 0.91)


def rgb(c):
    return np.array(c, dtype=np.float32)


# ---------------------------------------------------------------- scene -----
class Scene:
    def __init__(self, seed, corner=None, ceil_y=170, floor_y=1540,
                 ceil_slope=0.22, floor_slope=0.30):
        self.rng = np.random.default_rng(seed)
        self.yy, self.xx = np.mgrid[0:H, 0:W].astype(np.float32)
        self.cx = corner
        xs = np.arange(W, dtype=np.float32)
        side = np.clip(xs - corner, 0, None) if corner is not None else np.zeros(W, np.float32)
        self.C = ceil_y - side * ceil_slope          # ceiling line per column
        self.F = floor_y + side * floor_slope        # floor line per column
        self.img = np.zeros((H, W, 3), np.float32)
        self.light = np.ones((H, W), np.float32)
        self.emit = np.zeros((H, W), np.float32)     # 1 = self-lit (window glass)
        self.emit_col = np.zeros((H, W, 3), np.float32)
        self.wall = (self.yy >= self.C[None]) & (self.yy <= self.F[None])
        self.sidewall = self.wall & (self.xx > corner) if corner is not None else np.zeros((H, W), bool)

    # -- helpers
    def noise(self, sigma, amp, aniso=None):
        n = self.rng.standard_normal((H, W)).astype(np.float32)
        n = gaussian_filter(n, aniso if aniso else sigma)
        return n / (n.std() + 1e-9) * amp

    def mask(self, fn, blur=0.8):
        m = Image.new("L", (W, H), 0)
        fn(ImageDraw.Draw(m))
        a = np.asarray(m, np.float32) / 255.0
        return gaussian_filter(a, blur) if blur else a

    def put(self, m, col):
        col = rgb(col) if not isinstance(col, np.ndarray) or col.ndim == 1 else col
        if col.ndim == 1:
            col = col[None, None, :]
        self.img = self.img * (1 - m[..., None]) + col * m[..., None]

    def shadow(self, m, dx, dy, sigma, strength):
        s = np.roll(np.roll(m, dy, 0), dx, 1)
        s = gaussian_filter(s, sigma) * (1 - m)
        self.light *= 1 - strength * s

    # -- base room
    def room(self, wall_col, floor="wood", floor_col=(0.52, 0.38, 0.26), ceil_col=CEIL,
             trim_col=TRIM, bb=64, light_side=-1, roller=True):
        yy, xx = self.yy, self.xx
        C, F = self.C[None], self.F[None]
        # ceiling
        ceil = yy < C
        self.img[ceil] = rgb(ceil_col)
        # walls: paint + drywall texture
        tex = 1 + self.noise(1.0, 0.011) + self.noise(3, 0.004) + self.noise(90, 0.016)
        if roller:
            tex += self.noise(0, 0.0035, aniso=(30, 5))
        wall = self.wall
        self.img[wall] = (rgb(wall_col)[None, :] * tex[wall][:, None])
        # floor
        fl = yy > F
        d = np.clip(yy - F, 0, None)
        if floor == "wood" or floor == "laminate":
            v = (d / 260.0) ** 0.8 * 3.2
            idx = np.floor(v).astype(int)
            tints = 1 + self.rng.normal(0, 0.07, 64).astype(np.float32)
            grain = 1 + self.noise(0, 0.06, aniso=(1.2, 30))
            gap = 1 - 0.35 * (np.mod(v, 1) < 0.025)
            joints = np.ones((H, W), np.float32)
            for k in range(12):
                jx = self.rng.uniform(0, W, 3)
                for x0 in jx:
                    joints[(idx == k) & (np.abs(xx - x0) < 2.2)] = 0.7
            col = rgb(floor_col)[None, None] * (tints[np.clip(idx, 0, 63)] * grain * gap * joints)[..., None]
            self.img[fl] = col[fl]
        elif floor == "carpet":
            t = 1 + self.noise(0.7, 0.05) + self.noise(30, 0.03)
            self.img[fl] = rgb(floor_col)[None] * t[fl][:, None]
        elif floor == "vinyl":
            t = 1 + self.noise(0.9, 0.02) + self.noise(50, 0.03)
            self.img[fl] = rgb(floor_col)[None] * t[fl][:, None]
        # baseboard
        if bb:
            bbm = (yy > F - bb) & (yy <= F)
            shade = 1 - 0.10 * ((yy - (F - bb)) / bb)
            topline = (yy > F - bb) & (yy < F - bb + 5)
            col = rgb(trim_col)[None, None] * shade[..., None]
            self.img[bbm] = col[bbm]
            self.img[topline] = rgb(trim_col) * 1.03
            self.light[(yy > F - bb - 10) & (yy <= F - bb)] *= 0.93
        # lighting
        L = 0.80 + 0.22 * light_side * -((xx / W) - 0.5) * 2
        L = L * (1 + self.noise(260, 0.075)) * (1 - 0.10 * ((yy - H * 0.45) / H) ** 2 * 4)
        ao_c = 1 - 0.16 * np.exp(-np.clip(yy - C, 0, None) / 60.0)
        ao_f = 1 - 0.10 * np.exp(-np.clip(F - yy, 0, None) / 45.0)
        L = L * np.where(wall, ao_c * ao_f, 1)
        L = np.where(ceil, 0.86 - 0.10 * np.clip((C - yy) / 200.0, 0, 1), L)
        L = np.where(fl, 0.78 + 0.1 * np.clip(d / 400.0, 0, 1), L)
        if self.cx is not None:
            side = self.sidewall
            L = np.where(side, L * 0.80, L)
            L *= 1 - 0.10 * np.exp(-np.abs(xx - self.cx) / 35.0) * wall
            L = np.where(ceil & (xx > self.cx), L * 0.92, L)
        self.light *= L.astype(np.float32)

    def sun_patch(self, pts, period=26.0, amt=0.55, warm=(1.0, 0.94, 0.82), blur=6):
        """Striped patch of sunlight coming through blinds (floor or wall)."""
        m = self.mask(lambda d: d.polygon(pts, fill=255), blur=blur)
        stripes = (np.mod(self.yy, period) / period < 0.62).astype(np.float32)
        stripes = gaussian_filter(stripes, 1.6)
        m = m * (0.25 + 0.75 * stripes)
        self.light *= 1 + amt * m
        self.img = self.img * (1 + 0.5 * amt * m[..., None] * (rgb(warm)[None, None] - 1))

    def nail_pops(self, n=4):
        for _ in range(n):
            x0 = self.rng.uniform(200, W - 200)
            y0 = self.rng.uniform(self.C.min() + 200, self.F.min() - 200)
            hi = self.mask(lambda d: d.ellipse([x0 - 9, y0 - 9, x0 + 5, y0 + 5], fill=255), blur=2.5)
            lo = self.mask(lambda d: d.ellipse([x0 - 5, y0 - 5, x0 + 9, y0 + 9], fill=255), blur=2.5)
            self.light *= (1 + 0.06 * hi) * (1 - 0.10 * lo)

    def seams(self, xs, amt=0.012):
        for x0 in xs:
            b = np.exp(-((self.xx - x0) / 40.0) ** 2) * self.wall
            self.light *= 1 + amt * b

    def glow(self, x, y, sx, sy, amt):
        g = np.exp(-(((self.xx - x) / sx) ** 2 + ((self.yy - y) / sy) ** 2) / 2)
        self.light *= 1 + amt * g

    # -- wear on old paint (before photos)
    def wear(self, amount=1.0, ghosts=(), grime=(), patches=3, scuffs=26, crack=None):
        rng, yy, xx = self.rng, self.yy, self.xx
        wall = self.wall
        # uneven yellowing / discolouration, stronger near the ceiling
        b = self.noise(110, 1.0)
        top = np.exp(-np.clip(yy - self.C[None], 0, None) / 260.0)
        disc = np.clip(0.05 * b + 0.06 * top + 0.03, 0, None) * amount
        for (gx, gy, gw, gh) in ghosts:            # cleaner rectangle where a frame hung
            gm = self.mask(lambda d: d.rectangle([gx, gy, gx + gw, gy + gh], fill=255), blur=2.5)
            disc = disc * (1 - 0.85 * gm)
        tint = np.stack([1 - 0.35 * disc, 1 - 0.55 * disc, 1 - 1.2 * disc], -1)
        self.img = np.where(wall[..., None], self.img * tint, self.img)
        # hand grime around switches / door edges
        for (gx, gy, r) in grime:
            g = np.exp(-(((xx - gx) / r) ** 2 + ((yy - gy) / (r * 1.4)) ** 2) / 2)
            g = g * (1 + 0.35 * self.noise(28, 1.0))
            self.img *= (1 - 0.10 * amount * np.clip(g, 0, 1) * wall)[..., None]
        # spackled spots: small, flat, slightly paler dabs with a sanded halo
        for _ in range(patches):
            px, py = rng.uniform(250, W - 350), rng.uniform(self.C.min() + 300, self.F.min() - 300)
            def blob(d, px=px, py=py):
                for _ in range(4):
                    r = rng.uniform(6, 15)
                    ox, oy = rng.normal(0, 8, 2)
                    d.ellipse([px + ox - r, py + oy - r * 0.8, px + ox + r, py + oy + r * 0.8], fill=255)
            core = self.mask(blob, blur=2.0) * wall
            halo = gaussian_filter(core, 14) * wall
            pale = self.img * 0.55 + rgb((0.93, 0.92, 0.89))[None, None] * 0.45
            self.img = self.img * (1 - 0.35 * halo[..., None]) + pale * 0.35 * halo[..., None]
            self.img = self.img * (1 - 0.7 * core[..., None]) + pale * 0.7 * core[..., None]
        # nail holes
        for (gx, gy, gw, gh) in ghosts:
            for hx, hy in [(gx + gw / 2, gy - 18)]:
                m = self.mask(lambda d: d.ellipse([hx - 3, hy - 3, hx + 3, hy + 3], fill=255), blur=0.6)
                self.img *= (1 - 0.55 * m)[..., None]
        for _ in range(int(5 * amount)):
            hx, hy = rng.uniform(150, W - 150), rng.uniform(self.C.min() + 200, self.F.min() - 300)
            m = self.mask(lambda d: d.ellipse([hx - 2.5, hy - 2.5, hx + 2.5, hy + 2.5], fill=255), blur=0.6)
            self.img *= (1 - 0.5 * m * wall)[..., None]
        # scuffs: soft grey rub marks at furniture height, a few dark shoe marks low down
        fl = self.F.min()
        def rubs(d):
            for _ in range(int(scuffs * amount)):
                x0 = rng.uniform(120, W - 160)
                y0 = rng.uniform(fl - 650, fl - 220)
                ang = rng.normal(0, 0.25)
                for k in range(rng.integers(2, 5)):
                    L = rng.uniform(30, 110)
                    oy = k * rng.uniform(4, 9)
                    d.line([(x0, y0 + oy), (x0 + L * np.cos(ang), y0 + oy + L * np.sin(ang))],
                           fill=int(rng.uniform(80, 200)), width=int(rng.uniform(3, 8)))
        m = self.mask(rubs, blur=3.2) * wall
        self.img *= (1 - 0.22 * amount * m)[..., None]
        def shoe(d):
            for _ in range(int(scuffs * 0.35 * amount)):
                x0 = rng.uniform(120, W - 160)
                y0 = rng.uniform(fl - 150, fl - 72)
                L = rng.uniform(8, 34)
                d.line([(x0, y0), (x0 + L, y0 + rng.normal(0, 3))], fill=int(rng.uniform(150, 255)), width=int(rng.uniform(2, 5)))
        m = self.mask(shoe, blur=1.3) * wall
        self.img *= (1 - 0.5 * amount * m)[..., None]
        # faint grey smudges
        sm = np.clip(self.noise(22, 1.0) - 2.0, 0, None) * wall
        self.img *= (1 - 0.09 * amount * np.clip(sm, 0, 1))[..., None]

    # -- objects
    def window(self, x, y, w, h, frame=TRIM, blinds=0.8, **_):
        c = 34
        outer = self.mask(lambda d: d.rectangle([x - c, y - c, x + w + c, y + h + c], fill=255))
        self.shadow(outer, 6, 10, 10, 0.22)
        self.put(outer, frame)
        inner = self.mask(lambda d: d.rectangle([x - 6, y - 6, x + w + 6, y + h + 6], fill=255), blur=1.5)
        self.light *= 1 - 0.18 * inner
        sill = self.mask(lambda d: d.rectangle([x - c - 22, y + h + c - 4, x + w + c + 22, y + h + c + 22], fill=255))
        self.put(sill, rgb(frame) * 1.02)
        self.light *= 1 - 0.25 * self.mask(lambda d: d.rectangle([x - c - 22, y + h + c + 22, x + w + c + 22, y + h + c + 32], fill=255), blur=4)
        glass = self.mask(lambda d: d.rectangle([x, y, x + w, y + h], fill=255), blur=0.8)
        yy, xx = self.yy, self.xx
        sky = rgb((1.35, 1.38, 1.42))[None, None] * (1.02 - 0.06 * np.clip((yy - y) / h, 0, 1))[..., None]
        col = np.broadcast_to(sky, (H, W, 3)).copy()
        emit = glass.copy()
        if blinds:
            bh = y + h * blinds                     # blinds lowered to this height
            period = 21.0
            ph = np.mod(yy - y, period) / period
            slat = (ph < 0.78) & (yy < bh)
            shade = 0.88 + 0.07 * np.cos(ph * np.pi)          # curved slat, lit from behind
            slat_col = rgb((0.93, 0.92, 0.89))[None, None] * shade[..., None]
            col = np.where(slat[..., None], slat_col, col)
            emit = glass * np.where(slat, 0.75, 1.0)
            rail = self.mask(lambda d: d.rectangle([x - 4, y - 4, x + w + 4, y + 26], fill=255))
            self.put(rail, rgb(frame) * 0.97)
            emit *= 1 - rail
            bottom = self.mask(lambda d: d.rectangle([x, bh - 4, x + w, bh + 12], fill=255))
            col = col * (1 - bottom[..., None]) + rgb((0.9, 0.89, 0.86))[None, None] * bottom[..., None]
            cord = self.mask(lambda d: d.line([(x + w - 40, y + 26), (x + w - 40, bh + 160)], fill=255, width=3), blur=0.8)
            self.put(cord, (0.85, 0.84, 0.8))
        # bars between sashes
        bar = self.mask(lambda d: d.rectangle([x + w / 2 - 10, y, x + w / 2 + 10, y + h], fill=255))
        col = col * (1 - bar[..., None]) + rgb(frame)[None, None] * 0.9 * bar[..., None]
        self.emit = np.maximum(self.emit, emit * (1 - bar))
        self.emit_col = self.emit_col * (1 - glass[..., None]) + col * glass[..., None]
        self.img = self.img * (1 - glass[..., None]) + col * glass[..., None]
        self.glow(x + w / 2, y + h / 2, w * 1.9, h * 1.5, 0.42)
        # light pooling on the floor under the window
        self.glow(x + w / 2, self.F.min() + 160, w * 0.9, 120, 0.25)

    def plate(self, x, y, kind="outlet"):
        w, h = (46, 74) if kind == "outlet" else (48, 80)
        m = self.mask(lambda d: d.rounded_rectangle([x, y, x + w, y + h], 5, fill=255))
        self.shadow(m, 2, 3, 2.5, 0.35)
        self.put(m, (0.93, 0.92, 0.88))
        if kind == "outlet":
            for oy in (y + 16, y + 44):
                s = self.mask(lambda d, oy=oy: (d.rectangle([x + 13, oy, x + 16, oy + 9], fill=255),
                                                 d.rectangle([x + 29, oy, x + 32, oy + 9], fill=255)), blur=0.5)
                self.img *= (1 - 0.7 * s)[..., None]
        else:
            t = self.mask(lambda d: d.rounded_rectangle([x + 18, y + 26, x + 30, y + 54], 3, fill=255))
            self.put(t, (0.97, 0.96, 0.93))
            self.light *= 1 - 0.3 * self.mask(lambda d: d.rectangle([x + 18, y + 54, x + 30, y + 58], fill=255), blur=1.5)

    def door(self, x, y, w, h, col=TRIM):
        c = 30
        casing = self.mask(lambda d: d.rectangle([x - c, y - c, x + w + c, y + h], fill=255))
        self.shadow(casing, 5, 6, 8, 0.2)
        self.put(casing, col)
        slab = self.mask(lambda d: d.rectangle([x, y, x + w, y + h], fill=255))
        self.put(slab, rgb(col) * 0.985)
        self.light *= 1 - 0.18 * self.mask(lambda d: d.rectangle([x, y, x + 8, y + h], fill=255), blur=3)
        pw, gap = (w - 3 * 28) / 2, 28
        rows = [(y + 34, y + 34 + h * 0.18), (y + 34 + h * 0.18 + 30, y + h * 0.55), (y + h * 0.55 + 30, y + h - 40)]
        for (y0, y1) in rows:
            for i in range(2):
                px = x + gap + i * (pw + gap)
                hi = self.mask(lambda d: d.line([(px, y1), (px, y0), (px + pw, y0)], fill=255, width=5), blur=1.2)
                lo = self.mask(lambda d: d.line([(px, y1), (px + pw, y1), (px + pw, y0)], fill=255, width=5), blur=1.2)
                self.light *= (1 + 0.06 * hi) * (1 - 0.14 * lo)
        kx, ky = x + w - 60, y + h * 0.52
        k = self.mask(lambda d: d.ellipse([kx - 18, ky - 18, kx + 18, ky + 18], fill=255))
        self.shadow(k, 3, 5, 4, 0.4)
        self.put(k, (0.62, 0.60, 0.56))
        self.put(self.mask(lambda d: d.ellipse([kx - 10, ky - 12, kx, ky - 2], fill=255), blur=2) * 0.6, (0.95, 0.95, 0.93))

    def frame_pic(self, x, y, w, h, frame=(0.12, 0.11, 0.1), art=None):
        m = self.mask(lambda d: d.rectangle([x, y, x + w, y + h], fill=255))
        self.shadow(m, 8, 12, 9, 0.35)
        self.put(m, frame)
        mat = self.mask(lambda d: d.rectangle([x + 16, y + 16, x + w - 16, y + h - 16], fill=255))
        self.put(mat, (0.93, 0.92, 0.9))
        inner = self.mask(lambda d: d.rectangle([x + 60, y + 60, x + w - 60, y + h - 60], fill=255))
        a1, a2 = art or ((0.55, 0.62, 0.66), (0.78, 0.72, 0.6))
        t = np.clip((self.yy - y) / h, 0, 1)[..., None]
        col = rgb(a1)[None, None] * (1 - t) + rgb(a2)[None, None] * t
        col = col * (1 + self.noise(25, 0.08))[..., None]
        self.put(inner, col)

    def mirror(self, x, y, w, h, wall_col):
        m = self.mask(lambda d: d.rectangle([x - 12, y - 12, x + w + 12, y + h + 12], fill=255))
        self.shadow(m, 5, 8, 7, 0.3)
        self.put(m, (0.35, 0.34, 0.33))
        glass = self.mask(lambda d: d.rectangle([x, y, x + w, y + h], fill=255))
        refl = rgb(wall_col)[None, None] * 0.78 * (1 + self.noise(40, 0.05))[..., None]
        t = np.clip((self.xx - x) / w, 0, 1)
        refl = refl * (0.9 + 0.2 * t)[..., None]
        door = ((self.xx > x + w * 0.55) & (self.xx < x + w * 0.8) & (self.yy > y + h * 0.25)).astype(np.float32)
        refl = refl * (1 - door[..., None]) + rgb((0.8, 0.79, 0.76))[None, None] * door[..., None] * 0.9
        streak = np.exp(-(((self.xx - x) - (self.yy - y) * 0.6 - w * 0.25) / 40) ** 2)
        refl = refl + 0.06 * streak[..., None]
        self.put(glass, refl)

    def vanity(self, x, y, w, h, col=(0.9, 0.89, 0.86), top=(0.8, 0.79, 0.76)):
        m = self.mask(lambda d: d.rectangle([x, y, x + w, y + h], fill=255))
        self.put(m, col)
        t = self.mask(lambda d: d.rectangle([x - 12, y - 26, x + w + 12, y], fill=255))
        self.put(t, top)
        self.light *= 1 - 0.2 * self.mask(lambda d: d.rectangle([x, y, x + w, y + 14], fill=255), blur=4)
        for i in range(1, 3):
            lx = x + w * i / 3
            ln = self.mask(lambda d: d.line([(lx, y + 30), (lx, y + h - 10)], fill=255, width=3), blur=1)
            self.light *= 1 - 0.2 * ln
            for hx in (lx - 30, lx + 22):
                hm = self.mask(lambda d, hx=hx: d.rounded_rectangle([hx, y + 60, hx + 8, y + 120], 3, fill=255))
                self.put(hm, (0.55, 0.55, 0.55))

    def light_bar(self, x, y, w, n=3):
        bar = self.mask(lambda d: d.rectangle([x, y, x + w, y + 14], fill=255))
        self.put(bar, (0.6, 0.58, 0.55))
        for i in range(n):
            gx = x + w * (i + 0.5) / n
            g = self.mask(lambda d, gx=gx: d.ellipse([gx - 34, y + 6, gx + 34, y + 70], fill=255), blur=1.5)
            self.emit = np.maximum(self.emit, g)
            self.emit_col = self.emit_col * (1 - g[..., None]) + rgb((1.0, 0.96, 0.88))[None, None] * g[..., None]
            self.glow(gx, y + 40, 150, 120, 0.22)

    def towel(self, x, y, w, h, col):
        rod = self.mask(lambda d: d.rectangle([x - 40, y - 6, x + w + 40, y + 6], fill=255))
        self.put(rod, (0.7, 0.7, 0.7))
        m = self.mask(lambda d: d.rounded_rectangle([x, y, x + w, y + h], 10, fill=255))
        self.shadow(m, 6, 8, 9, 0.35)
        folds = 1 + self.noise(0, 0.06, aniso=(60, 6)) + self.noise(0.8, 0.04)
        self.put(m, rgb(col)[None, None] * folds[..., None])

    def bed(self, x, y_floor, w, head_h=520, head_col=(0.42, 0.40, 0.38), duvet=(0.9, 0.89, 0.86)):
        hy = y_floor - 760
        head = self.mask(lambda d: d.rounded_rectangle([x, hy, x + w, hy + head_h + 300], 26, fill=255))
        self.shadow(head, 10, 10, 16, 0.3)
        self.put(head, rgb(head_col)[None, None] * (1 + self.noise(1, 0.03))[..., None])
        for i in range(2):
            px = x + 70 + i * (w / 2 - 20)
            p = self.mask(lambda d, px=px: d.rounded_rectangle([px, hy + 250, px + w / 2 - 100, hy + 430], 60, fill=255), blur=2)
            self.put(p, rgb((0.95, 0.94, 0.92))[None, None] * (1 - 0.1 * np.clip((self.yy - hy - 250) / 180, 0, 1))[..., None])
        du = self.mask(lambda d: d.rounded_rectangle([x - 40, hy + 390, x + w + 40, H + 100], 30, fill=255), blur=2)
        folds = 1 + self.noise(0, 0.05, aniso=(80, 14))
        self.put(du, rgb(duvet)[None, None] * folds[..., None])

    def nightstand(self, x, y_floor, w=230, h=300, col=(0.45, 0.33, 0.24), lamp=True):
        m = self.mask(lambda d: d.rectangle([x, y_floor - h, x + w, y_floor + 40], fill=255))
        self.shadow(m, 8, 0, 10, 0.3)
        self.put(m, rgb(col)[None, None] * (1 + self.noise(0, 0.05, aniso=(1, 20)))[..., None])
        self.light *= 1 - 0.2 * self.mask(lambda d: d.line([(x + 10, y_floor - h + 110), (x + w - 10, y_floor - h + 110)], fill=255, width=4), blur=1)
        if lamp:
            bx = x + w / 2
            base = self.mask(lambda d: d.rectangle([bx - 14, y_floor - h - 170, bx + 14, y_floor - h], fill=255))
            self.put(base, (0.8, 0.78, 0.72))
            shade = self.mask(lambda d: d.polygon([(bx - 70, y_floor - h - 150), (bx + 70, y_floor - h - 150),
                                                   (bx + 50, y_floor - h - 290), (bx - 50, y_floor - h - 290)], fill=255))
            self.put(shade, (0.95, 0.92, 0.85))
            self.glow(bx, y_floor - h - 220, 180, 200, 0.12)

    def sofa(self, x, y_floor, w, col=(0.45, 0.46, 0.47)):
        top = y_floor - 470
        back = self.mask(lambda d: d.rounded_rectangle([x, top, x + w, y_floor + 60], 40, fill=255))
        self.shadow(back, 0, 6, 22, 0.35)
        fab = 1 + self.noise(0.9, 0.035) + self.noise(40, 0.03)
        self.put(back, rgb(col)[None, None] * fab[..., None])
        for i in range(3):
            cx0 = x + 80 + i * (w - 160) / 3
            ln = self.mask(lambda d, cx0=cx0: d.line([(cx0, top + 40), (cx0, top + 300)], fill=255, width=6), blur=4)
            self.light *= 1 - 0.18 * ln * (i > 0)
        seat = self.mask(lambda d: d.rectangle([x, top + 300, x + w, y_floor + 60], fill=255), blur=5)
        self.light *= 1 - 0.12 * seat
        for sx in (x - 40, x + w - 110):
            arm = self.mask(lambda d, sx=sx: d.rounded_rectangle([sx, top + 170, sx + 150, y_floor + 60], 40, fill=255))
            self.put(arm, rgb(col)[None, None] * 1.05 * fab[..., None])
        pl = self.mask(lambda d: d.rounded_rectangle([x + 130, top + 150, x + 390, top + 380], 40, fill=255), blur=2)
        self.put(pl, (0.78, 0.74, 0.66))

    def kitchen(self, wall_col, counter_y, uppers=((0, 640), (1720, 2400)), upper_bottom=820,
                cab=(0.9, 0.89, 0.86), top=(0.25, 0.24, 0.23), kettle=None):
        F = self.F.min()
        base = self.mask(lambda d: d.rectangle([0, counter_y + 40, W, F + 200], fill=255))
        self.put(base, cab)
        for bx in range(0, W, 300):
            ln = self.mask(lambda d, bx=bx: d.line([(bx, counter_y + 60), (bx, H)], fill=255, width=3), blur=1)
            self.light *= 1 - 0.2 * ln
            hm = self.mask(lambda d, bx=bx: d.rounded_rectangle([bx + 230, counter_y + 110, bx + 238, counter_y + 190], 3, fill=255))
            self.put(hm, (0.5, 0.5, 0.5))
        ct = self.mask(lambda d: d.rectangle([0, counter_y, W, counter_y + 44], fill=255))
        self.put(ct, rgb(top)[None, None] * (1 + self.noise(2, 0.12))[..., None])
        self.light *= 1 - 0.25 * self.mask(lambda d: d.rectangle([0, counter_y + 44, W, counter_y + 70], fill=255), blur=6)
        self.light *= 1 - 0.18 * self.mask(lambda d: d.rectangle([0, counter_y - 40, W, counter_y], fill=255), blur=12)
        for (x0, x1) in uppers:
            u = self.mask(lambda d, x0=x0, x1=x1: d.rectangle([x0, 0, x1, upper_bottom], fill=255))
            self.shadow(u, 0, 16, 18, 0.3)
            self.put(u, cab)
            for bx in np.arange(x0, x1, 330):
                ln = self.mask(lambda d, bx=bx: d.line([(bx, 0), (bx, upper_bottom)], fill=255, width=3), blur=1)
                self.light *= 1 - 0.2 * ln
                pn = self.mask(lambda d, bx=bx: d.rectangle([bx + 50, 60, bx + 280, upper_bottom - 60], outline=255, width=4), blur=1.5)
                self.light *= 1 - 0.1 * pn
        if kettle:
            kx = kettle
            k = self.mask(lambda d: d.rounded_rectangle([kx, counter_y - 190, kx + 150, counter_y + 2], 40, fill=255))
            self.shadow(k, 10, 4, 10, 0.3)
            self.put(k, (0.75, 0.75, 0.74))
            self.put(self.mask(lambda d: d.rectangle([kx + 20, counter_y - 170, kx + 45, counter_y - 20], fill=255), blur=5) * 0.5, (0.95, 0.95, 0.95))

    def faucet(self, x, counter_y):
        m = self.mask(lambda d: d.arc([x - 70, counter_y - 260, x + 70, counter_y - 20], 180, 360, fill=255, width=18))
        m2 = self.mask(lambda d: d.rectangle([x - 79, counter_y - 140, x - 61, counter_y], fill=255))
        self.put(np.maximum(m, m2), (0.72, 0.72, 0.72))

    def shelf(self, x, y, w, books=True):
        m = self.mask(lambda d: d.rectangle([x, y, x + w, y + 26], fill=255))
        self.shadow(m, 0, 10, 8, 0.4)
        self.put(m, (0.5, 0.37, 0.26))
        if books:
            bx = x + 20
            while bx < x + w - 60:
                bw, bh = self.rng.uniform(22, 44), self.rng.uniform(130, 190)
                col = self.rng.choice([(0.3, 0.35, 0.45), (0.6, 0.25, 0.2), (0.85, 0.82, 0.74), (0.25, 0.3, 0.25), (0.7, 0.6, 0.4)])
                b = self.mask(lambda d, bx=bx, bw=bw, bh=bh: d.rectangle([bx, y - bh, bx + bw, y], fill=255))
                self.put(b, rgb(col) * self.rng.uniform(0.85, 1.05))
                bx += bw + 3

    def ceiling_light(self, x, y, r=120):
        m = self.mask(lambda d: d.ellipse([x - r, y - r * 0.35, x + r, y + r * 0.35], fill=255), blur=1.5)
        self.emit = np.maximum(self.emit, m)
        self.emit_col = self.emit_col * (1 - m[..., None]) + rgb((1, 0.97, 0.9))[None, None] * m[..., None]
        self.glow(x, y, r * 3, r * 2, 0.25)

    def render(self):
        img = self.img * self.light[..., None]
        img = img * (1 - self.emit[..., None]) + self.emit_col * self.emit[..., None]
        return np.clip(img, 0, 1.8).astype(np.float32)


# ------------------------------------------------------------- camera -----
def _coeffs(dst, src):
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.array(A, float), np.array(B, float))


def shoot(scene_img, out=(1200, 900), cx=W / 2, cy=H / 2, view=2000, yaw=0.0, pitch=0.0, roll=0.0,
          exposure=1.0, wb=(1, 1, 1), vignette=0.42, noise=0.018, barrel=0.035, bloom=0.9, seed=0, quality=74):
    """Simulated phone photo of an HDR scene elevation."""
    ow, oh = out
    hw, hh = view / 2, view * oh / ow / 2
    corners = [(-hw * (1 + pitch), -hh * (1 - yaw)), (hw * (1 + pitch), -hh * (1 + yaw)),
               (hw * (1 - pitch), hh * (1 + yaw)), (-hw * (1 - pitch), hh * (1 - yaw))]
    a = np.deg2rad(roll)
    src = [(cx + x * np.cos(a) - y * np.sin(a), cy + x * np.sin(a) + y * np.cos(a)) for x, y in corners]
    k = _coeffs([(0, 0), (ow, 0), (ow, oh), (0, oh)], src)
    yy, xx = np.mgrid[0:oh, 0:ow].astype(np.float32)
    # barrel distortion of a wide phone lens
    nx, ny = (xx - ow / 2) / (ow / 2), (yy - oh / 2) / (ow / 2)
    r2 = nx * nx + ny * ny
    f_ = 1 + barrel * r2
    dx, dy = ow / 2 + nx * f_ * ow / 2 / (1 + barrel * 0.6), oh / 2 + ny * f_ * ow / 2 / (1 + barrel * 0.6)
    den = k[6] * dx + k[7] * dy + 1
    sx = (k[0] * dx + k[1] * dy + k[2]) / den
    sy = (k[3] * dx + k[4] * dy + k[5]) / den
    if sx.min() < 0 or sy.min() < 0 or sx.max() > W - 1 or sy.max() > H - 1:
        print("  warning: camera sees past the scene edge", round(float(sx.min())), round(float(sy.min())), round(float(sx.max())), round(float(sy.max())))
    # a touch of lateral chromatic aberration toward the edges
    f = np.empty((oh, ow, 3), np.float32)
    for ch, sc in zip(range(3), (1.0012, 1.0, 0.9988)):
        cxs, cys = (sx - cx) * sc + cx, (sy - cy) * sc + cy
        f[..., ch] = map_coordinates(scene_img[..., ch], [cys, cxs], order=1, mode="nearest")
    rng = np.random.default_rng(seed)
    f = f * exposure * rgb(wb)[None, None]
    # bloom / halation around bright windows and lights
    hl = np.clip(f.mean(-1, keepdims=True) - 0.9, 0, None)
    f = f + bloom * (gaussian_filter(hl, (22, 22, 0)) * 0.9 + gaussian_filter(hl, (5, 5, 0)) * 0.5)
    # phone HDR tone curve: lifted shadows, soft highlight shoulder
    f = np.where(f < 0.78, f, 0.78 + 0.22 * (1 - np.exp(-(f - 0.78) / 0.22)))
    f = f + 0.035 * (1 - f) ** 3
    lum = f.mean(-1, keepdims=True)
    f = lum + (f - lum) * 1.07
    f = f * (1 - vignette * r2 / 2)[..., None]
    # sensor noise, smeared by noise reduction, then over-sharpened like phone processing
    f = f + rng.normal(0, 1, (oh, ow, 1)) * noise * (1.25 - lum)
    f = f + gaussian_filter(rng.normal(0, 1, (oh, ow, 3)), (1.5, 1.5, 0)) * noise
    f = gaussian_filter(f, (0.85, 0.85, 0))
    f = f + 0.6 * (f - gaussian_filter(f, (1.4, 1.4, 0)))
    f = np.clip(f, 0, 1)
    im = Image.fromarray((f * 255 + 0.5).astype(np.uint8))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=90)          # phone saves once, upload/resize saves again
    buf.seek(0)
    return Image.open(buf).convert("RGB")


WARM = (1.06, 1.0, 0.88)     # incandescent-ish
COOL = (0.97, 1.0, 1.04)     # daylight / LED
NEUTRAL = (1.0, 1.0, 0.98)


# ------------------------------------------------------------- scenes -----
def bathroom(state):
    before = state == "before"
    wall = (0.86, 0.72, 0.60) if before else (0.64, 0.71, 0.63)   # dated peach -> soft sage
    s = Scene(11, corner=1900, ceil_y=150, floor_y=1600)
    s.room(wall, floor="vinyl", floor_col=(0.66, 0.65, 0.62), light_side=1)
    if before:
        s.wear(1.0, ghosts=[(1420, 470, 200, 260)], grime=[(1560, 820, 70)], patches=2, scuffs=10)
        s.nail_pops(3)
        s.seams([1500], 0.015)
    s.glow(1000, 350, 700, 500, 0.12)
    s.glow(1950, 900, 300, 600, -0.18)
    s.mirror(620, 420, 700, 560, wall)
    s.light_bar(640, 300, 660)
    s.vanity(560, 1090, 820, 520)
    s.plate(1530, 780, "switch")
    s.plate(1440, 1010, "outlet")
    s.towel(1680 if before else 1640, 700, 180, 380, (0.55, 0.6, 0.66) if before else (0.93, 0.92, 0.9))
    return s.render()


def kitchen(state):
    before = state == "before"
    wall = (0.87, 0.81, 0.60) if before else (0.92, 0.91, 0.87)   # builder yellow -> clean warm white
    s = Scene(22, corner=None, ceil_y=0, floor_y=1750)
    s.room(wall, floor=None, bb=0, light_side=-1)
    if before:
        s.wear(1.1, grime=[(1560, 930, 80), (760, 1150, 120)], patches=2, scuffs=6)
        s.nail_pops(2)
    s.window(900, 330, 620, 520, blinds=0.55)
    s.sun_patch([(1560, 700), (1720, 640), (1720, 1230), (1560, 1250)], amt=0.35 if before else 0.5)
    s.plate(1560, 900, "switch")
    s.plate(700, 1100, "outlet")
    s.kitchen(wall, 1260, kettle=(1840 if before else 480))
    s.faucet(1210, 1260)
    return s.render()


def living(state):
    before = state == "before"
    wall = (0.75, 0.63, 0.48) if before else (0.80, 0.78, 0.73)   # tired tan -> light greige
    s = Scene(33, corner=2050, ceil_y=160, floor_y=1560)
    s.room(wall, floor="wood", floor_col=(0.52, 0.39, 0.27), light_side=-1)
    if before:
        s.wear(1.0, ghosts=[(1250, 470, 420, 300)], grime=[(430, 900, 70)], patches=3, scuffs=26)
        s.nail_pops(4)
        s.seams([900, 1600])
    s.window(240, 330, 560, 700, blinds=0.45 if before else 0.3)
    if before:
        s.sun_patch([(330, 1575), (820, 1575), (1180, 1800), (560, 1800)], amt=0.5)
    else:
        s.sun_patch([(260, 1575), (760, 1575), (980, 1800), (420, 1800)], amt=0.7)
    s.plate(430, 880, "switch")
    s.plate(1760, 1410, "outlet")
    if not before:
        s.frame_pic(1220, 430, 460, 330, art=((0.52, 0.6, 0.62), (0.76, 0.7, 0.58)))
    return s.render()


def bedroom(state):
    before = state == "before"
    wall = (0.80, 0.67, 0.68) if before else (0.62, 0.69, 0.74)   # faded mauve -> calm blue-grey
    s = Scene(44, corner=None, ceil_y=150, floor_y=1600)
    s.room(wall, floor="carpet", floor_col=(0.62, 0.58, 0.53), light_side=1)
    if before:
        s.wear(1.0, ghosts=[(1000, 420, 320, 240)], grime=[(630, 900, 70), (1990, 850, 60)], patches=3, scuffs=22)
        s.nail_pops(4)
        s.seams([1150])
    s.door(200, 330, 420, 1270)                       # closet door
    s.window(1640, 330, 480, 640, blinds=0.7 if before else 0.5)
    s.sun_patch([(1560, 1610), (2060, 1610), (1880, 1800), (1300, 1800)], amt=0.45 if before else 0.6)
    s.plate(700, 860, "switch")
    s.plate(1300, 1450, "outlet")
    if not before:
        s.frame_pic(1020, 440, 300, 220, art=((0.8, 0.78, 0.72), (0.6, 0.66, 0.7)))
    return s.render()


def hero(state):
    """Plain wall used by the hero animation: same camera for both states."""
    before = state == "before"
    wall = (0.80, 0.72, 0.58) if before else (0.64, 0.70, 0.66)
    s = Scene(55, corner=1850, ceil_y=140, floor_y=1640)
    s.room(wall, floor="wood", floor_col=(0.5, 0.38, 0.27), light_side=-1)
    if before:
        s.wear(0.9, ghosts=[(820, 520, 420, 300)], grime=[(1500, 900, 70)], patches=3, scuffs=24)
    s.window(250, 360, 420, 640, blinds=0.5)
    s.plate(1500, 860, "switch")
    s.plate(1150, 1470, "outlet")
    return s.render()


def roller_edge(s, x0, spread=70):
    """Coverage map for new paint rolled on to the left of a ragged, streaky vertical edge."""
    wob = gaussian_filter(s.rng.normal(0, 1, (H, 1)), (60, 0)) * 90 + gaussian_filter(s.rng.normal(0, 1, (H, 1)), (9, 0)) * 14
    streaks = s.noise(0, 1.0, aniso=(45, 2.2))
    cov = np.clip((x0 + wob - s.xx) / spread + 0.5 + 0.45 * streaks * np.exp(-((s.xx - x0 - wob) / spread) ** 2), 0, 1)
    return cov.astype(np.float32)


def in_progress(seed=66, left=(0.72, 0.76, 0.72), right=(0.84, 0.78, 0.62), split=1150, tray_x=1500):
    """Wall half repainted: tape on the baseboard, drop cloth, roller tray."""
    s = Scene(seed, corner=None, ceil_y=160, floor_y=1350)
    s.room(right, floor="wood", light_side=-1)
    s.wear(0.7, patches=3, scuffs=16)
    cov = roller_edge(s, split) * (s.wall & (s.yy < s.F[None] - 64))
    tex = 1 + s.noise(0, 0.012, aniso=(30, 2)) + s.noise(1, 0.01)
    s.put(cov, rgb(left)[None, None] * tex[..., None])
    # slight wet sheen on the fresh coat
    s.light *= 1 + 0.035 * cov
    # painter's tape along the top of the baseboard
    F = s.F.min()
    tape = s.mask(lambda d: d.rectangle([0, F - 70, W, F - 40], fill=255))
    s.put(tape, (0.30, 0.52, 0.78))
    # drop cloth over the floor
    cloth = s.mask(lambda d: d.polygon([(0, F + 20), (W, F + 10), (W, H), (0, H)], fill=255), blur=3)
    folds = 1 + s.noise(0, 0.06, aniso=(12, 90)) + s.noise(1, 0.03)
    s.put(cloth, rgb((0.82, 0.77, 0.66))[None, None] * folds[..., None])
    s.light *= 1 - 0.3 * s.mask(lambda d: d.rectangle([0, F + 10, W, F + 40], fill=255), blur=8)
    # roller tray with paint + roller
    tx, ty = tray_x, F + 120
    tray = s.mask(lambda d: d.polygon([(tx, ty), (tx + 420, ty), (tx + 470, ty + 190), (tx - 40, ty + 190)], fill=255))
    s.shadow(tray, 12, 14, 12, 0.4)
    s.put(tray, (0.55, 0.56, 0.58))
    well = s.mask(lambda d: d.polygon([(tx + 20, ty + 90), (tx + 400, ty + 90), (tx + 430, ty + 170), (tx - 10, ty + 170)], fill=255))
    s.put(well, rgb(left) * 0.95)
    rx, ry = tx + 60, ty - 30
    roller = s.mask(lambda d: d.rounded_rectangle([rx, ry, rx + 300, ry + 80], 36, fill=255))
    s.shadow(roller, 8, 12, 8, 0.4)
    nap = 1 + s.noise(0.8, 0.08)
    s.put(roller, rgb(left)[None, None] * 0.9 * nap[..., None])
    handle = s.mask(lambda d: (d.line([(rx + 300, ry + 40), (rx + 360, ry + 40), (rx + 360, ry - 60), (rx + 560, ry - 120)], fill=255, width=12),
                                d.line([(rx + 560, ry - 120), (rx + 720, ry - 170)], fill=255, width=34)))
    s.put(handle, (0.2, 0.2, 0.22))
    # paint can
    cx0 = 480
    can = s.mask(lambda d: d.rectangle([cx0, F - 10, cx0 + 230, F + 250], fill=255))
    s.shadow(can, 12, 10, 12, 0.35)
    shade = 0.75 + 0.35 * np.sin(np.clip((s.xx - cx0) / 230, 0, 1) * np.pi)
    s.put(can, rgb((0.78, 0.78, 0.78))[None, None] * shade[..., None])
    rim = s.mask(lambda d: d.ellipse([cx0, F - 40, cx0 + 230, F + 20], fill=255))
    s.put(rim, (0.7, 0.7, 0.71))
    label = s.mask(lambda d: d.rectangle([cx0, F + 60, cx0 + 230, F + 190], fill=255))
    s.put(label * 0.9, rgb(left) * 0.95)
    s.plate(1700, 850, "switch")
    return s.render()


def cutline_closeup():
    """Close-up of a fresh cut-in line where a new colour meets the ceiling."""
    s = Scene(77, corner=None, ceil_y=640, floor_y=H + 10)
    s.room((0.86, 0.80, 0.63), floor=None, bb=0, light_side=-1)
    s.wear(0.8, patches=1, scuffs=4)
    cov = roller_edge(s, 1250, spread=110) * s.wall
    tex = 1 + s.noise(1.0, 0.014)
    s.put(cov, rgb((0.70, 0.75, 0.72))[None, None] * tex[..., None])
    brush = s.noise(0, 0.025, aniso=(1.5, 40)) * np.exp(-np.clip(s.yy - s.C[None], 0, None) / 90.0)
    s.light *= 1 + brush * s.wall
    return s.render()


def siding(state="after"):
    """Exterior lap siding with a window, freshly painted."""
    col = (0.55, 0.60, 0.62)
    s = Scene(88, corner=None, ceil_y=260, floor_y=H + 10)
    yy = s.yy
    s.room(col, floor=None, bb=0, ceil_col=(0.9, 0.9, 0.88), roller=False)
    board = 96
    ph = np.mod(yy - 260, board) / board
    lap = 1 - 0.28 * np.exp(-ph / 0.07) + 0.05 * ph
    grain = 1 + s.noise(0, 0.03, aniso=(1, 60))
    s.light *= np.where(s.wall, lap * grain, 1)
    s.light *= np.where(yy < 260, 0.62, 1)
    s.window(900, 560, 620, 760, frame=(0.93, 0.93, 0.91), sky=(0.7, 0.75, 0.8), greenery=False)
    return s.render()


def ceiling_view():
    s = Scene(99, corner=1700, ceil_y=900, floor_y=H + 10, ceil_slope=0.45)
    s.room((0.80, 0.78, 0.73), floor=None, bb=0, light_side=-1)
    s.light *= np.where(s.yy < s.C[None], 0.88 + 0.12 * (s.yy / 900.0), 1)
    rim = s.mask(lambda d: d.ellipse([800, 380, 1200, 520], fill=255), blur=2)
    s.shadow(rim, 0, 14, 16, 0.25)
    s.put(rim, (0.78, 0.77, 0.74))
    s.ceiling_light(1000, 445, 170)
    s.window(260, 1000, 520, 640, blinds=0.6)
    return s.render()


def doors():
    s = Scene(111, corner=None, ceil_y=120, floor_y=1640)
    s.room((0.80, 0.78, 0.73), floor="wood", light_side=-1)
    s.door(420, 330, 520, 1310)
    s.door(1480, 330, 520, 1310)
    s.plate(1120, 850, "switch")
    return s.render()


def hallway():
    s = Scene(122, corner=1500, ceil_y=160, floor_y=1560, ceil_slope=0.3, floor_slope=0.4)
    s.room((0.84, 0.82, 0.77), floor="wood", floor_col=(0.56, 0.42, 0.3), light_side=-1)
    s.door(1650, 360, 420, 1200)
    s.plate(1320, 860, "switch")
    s.frame_pic(420, 520, 380, 280)
    for hx in (1000, 1110, 1220):
        hk = s.mask(lambda d, hx=hx: d.ellipse([hx - 14, 760, hx + 14, 788], fill=255))
        s.shadow(hk, 3, 4, 3, 0.4)
        s.put(hk, (0.2, 0.2, 0.2))
    return s.render()


def office():
    s = Scene(133, corner=None, ceil_y=150, floor_y=1600)
    wall = (0.56, 0.62, 0.60)
    s.room(wall, floor="wood", light_side=1)
    s.window(1700, 340, 460, 660)
    s.shelf(420, 640, 760)
    desk = s.mask(lambda d: d.rectangle([300, 1150, 1450, 1190], fill=255))
    s.shadow(desk, 0, 14, 14, 0.4)
    s.put(desk, (0.55, 0.42, 0.3))
    for lx in (330, 1400):
        leg = s.mask(lambda d, lx=lx: d.rectangle([lx, 1190, lx + 24, 1640], fill=255))
        s.put(leg, (0.2, 0.2, 0.2))
    mon = s.mask(lambda d: d.rectangle([700, 860, 1080, 1090], fill=255))
    s.shadow(mon, 6, 10, 10, 0.35)
    s.put(mon, (0.13, 0.13, 0.14))
    scr = s.mask(lambda d: d.rectangle([714, 874, 1066, 1076], fill=255))
    s.put(scr, rgb((0.2, 0.22, 0.25))[None, None] * (1 + 0.25 * np.clip((s.xx - 714) / 352, 0, 1))[..., None])
    stand = s.mask(lambda d: (d.rectangle([878, 1090, 902, 1135], fill=255), d.rectangle([820, 1135, 960, 1150], fill=255)))
    s.put(stand, (0.25, 0.25, 0.26))
    s.plate(1500, 1420, "outlet")
    return s.render()


# ------------------------------------------------------------- video ------
def _hero_scene(wall, old=None):
    """Plain wall mid-job: tape on the baseboard, drop cloth on the floor."""
    s = Scene(55, corner=1850, ceil_y=150, floor_y=1560)
    s.room(old or wall, floor="wood", floor_col=(0.5, 0.38, 0.27), light_side=-1)
    if old:
        s.wear(0.9, ghosts=[(1100, 470, 380, 280)], grime=[(1520, 860, 60)], patches=3, scuffs=22)
        s.nail_pops(3)
    s.window(260, 360, 440, 640, blinds=0.5)
    s.sun_patch([(320, 1575), (760, 1575), (1060, 1800), (500, 1800)], amt=0.45)
    F = s.F.min()
    tape = s.mask(lambda d: d.rectangle([0, F - 70, W, F - 44], fill=255))
    s.put(tape, (0.30, 0.52, 0.78))
    cloth = s.mask(lambda d: d.polygon([(0, F + 60), (W, F + 30), (W, H), (0, H)], fill=255), blur=3)
    folds = 1 + s.noise(0, 0.06, aniso=(12, 90)) + s.noise(1, 0.03)
    s.put(cloth, rgb((0.82, 0.77, 0.66))[None, None] * folds[..., None])
    s.light *= 1 - 0.25 * s.mask(lambda d: d.rectangle([0, F + 30, W, F + 70], fill=255), blur=8)
    s.plate(1520, 830, "switch")
    s.plate(1380, 1380, "outlet")
    plates = s.mask(lambda d: (d.rectangle([1520, 830, 1568, 910], fill=255), d.rectangle([1380, 1380, 1426, 1454], fill=255)), blur=1)
    return s, plates


preview_dir = "/tmp"


def hero_video(fps=24, out=(960, 720), preview=None):
    import subprocess
    import imageio_ffmpeg
    old, new = (0.80, 0.72, 0.58), (0.64, 0.70, 0.66)
    sa, plates = _hero_scene(new)
    A = sa.render()
    sb, _ = _hero_scene(new, old=old)
    B = sb.render()
    rng = np.random.default_rng(7)
    xx, yy, C, F = sa.xx, sa.yy, sa.C[None], sa.F[None]
    win = sa.mask(lambda d: d.rectangle([260 - 34, 360 - 34, 700 + 34, 1000 + 34], fill=255), blur=0)
    # brushed cut-in band along ceiling, corner, window casing and taped baseboard (already done)
    from scipy.ndimage import distance_transform_edt
    edges = (yy < C + 2) | (xx > 1848) | (win > 0.5) | (yy > F - 72)
    dist = distance_transform_edt(~edges)
    band = 62 + gaussian_filter(rng.normal(0, 1, (H, W)), 30) * 40
    brush = sa.noise(0, 1.0, aniso=(2, 30))
    cut = np.clip((band - dist) / 18 + 0.4 * brush, 0, 1).astype(np.float32)
    rollable = sa.wall & (win < 0.5) & (yy < F - 70)
    # narrow spots beside and above the window are brushed in during the cut-in
    brushed = ((xx < 205) | ((yy < 335) & (xx < 800))).astype(np.float32)
    cut = np.maximum(cut, brushed * np.clip(1 + 0.3 * brush, 0, 1))
    cut *= rollable
    # roller strokes (up, down, up, down), overlapping, paint thinning toward each stroke's end
    RW = 300
    y_top, y_bot = float(sa.C.min() + 40), float(sa.F.min() - 110)
    plan = [(190, True, 1100, y_bot, 0.6), (490, False, 1100, y_bot, 0.6)] + \
           [(780 + i * 262, i % 2 == 0, y_top, y_bot, 0.95) for i in range(4)]
    strokes = []
    t = 0.7
    for (x0, up, ya, yb, dur) in plan:
        strokes.append((x0, up, t, dur, ya, yb))
        t += dur + 0.24
    total = t + 1.2
    sgrid = np.linspace(0, 1, 512)
    ease = sgrid * sgrid * (3 - 2 * sgrid)
    S, T = [], []
    for (x0, up, t0, dur, ya, yb) in strokes:
        wob = gaussian_filter(rng.normal(0, 1, (H, 1)), (25, 0)) * 9
        inside = np.clip(np.minimum(xx - (x0 + wob), (x0 + RW + wob) - xx) / 5 + 0.5, 0, 1)
        frac = (yy - ya) / (yb - ya)
        prog = np.clip(frac if not up else 1 - frac, 0, 1)            # 0 at stroke start
        streak = sa.noise(0, 1.0, aniso=(55, 2.0))
        dens = np.clip(0.99 - 0.13 * prog ** 1.6 + 0.05 * streak, 0.78, 1)
        vert = np.clip(np.minimum(yy - (ya - 60), (yb + 60) - yy) / 25, 0, 1)
        S.append((inside * dens * vert * rollable).astype(np.float32))
        tt = t0 + dur * np.interp(np.clip(prog, 0, 1), ease, sgrid)
        T.append(tt.astype(np.float32))
    ridge = np.zeros((H, W), np.float32)
    for (x0, up, t0, dur, ya, yb) in strokes:
        for xe in (x0, x0 + RW):
            ridge = np.maximum(ridge, np.exp(-((xx - xe) / 3.0) ** 2) * ((yy > ya - 40) & (yy < yb + 40)))
    # roller cover texture (nap), scrolled as it rolls
    nap = gaussian_filter(rng.normal(0, 1, (400, RW + 40)), 1.2)
    nap = (nap / nap.std()).astype(np.float32)

    def roller_pos(t):
        for i, (x0, up, t0, dur, ya, yb) in enumerate(strokes):
            ys = yb if up else ya                       # where this stroke starts
            if t < t0:
                prev = strokes[i - 1] if i else None
                gap = 0.24 if prev else t0
                u = np.clip((t - (t0 - gap)) / gap, 0, 1)
                u = u * u * (3 - 2 * u)
                if prev:
                    px0, pup, pya, pyb = prev[0], prev[1], prev[4], prev[5]
                    pe = pya if pup else pyb            # where the previous stroke ended
                    return px0 + (x0 - px0) * u + RW / 2, pe + (ys - pe) * u, 0.6
                return x0 + RW / 2, H + 200 + (ys - H - 200) * u, 0.6
            if t <= t0 + dur:
                u = (t - t0) / dur
                u = u * u * (3 - 2 * u)
                a, b = (yb, ya) if up else (ya, yb)
                return x0 + RW / 2, a + (b - a) * u, 1.0
        x0, up, t0, dur, ya, yb = strokes[-1]
        u = np.clip((t - (t0 + dur)) / 0.6, 0, 1)
        ye = ya if up else yb
        return x0 + RW / 2, ye + (H + 400 - ye) * u * u, 0.6

    ff = imageio_ffmpeg.get_ffmpeg_exe()
    vdir = OUT.parent.parent / "video"
    vdir.mkdir(parents=True, exist_ok=True)
    frames_dir = Path("/tmp") / "wcf_frames"
    frames_dir.mkdir(exist_ok=True)
    n = int(total * fps)
    shake = gaussian_filter(rng.normal(0, 1, (n + 50, 3)), (6, 0)) * np.array([14, 10, 0.35])
    prev_y = None
    todo = [int(p * fps) for p in preview] if preview else range(n)
    for fi in todo:
        t = fi / fps
        if preview:
            prev_y = roller_pos(t - 1 / fps)[1]
        cov = np.zeros((H, W), np.float32)
        keep = np.ones((H, W), np.float32)
        for Si, Ti in zip(S, T):
            keep *= 1 - Si * np.clip((t - Ti) / 0.05, 0, 1)
        cov = 1 - keep
        cov = np.maximum(cov, cut)
        # fresh paint looks a little darker and glossier while wet
        wet = np.zeros((H, W), np.float32)
        for Si, Ti in zip(S, T):
            age = t - Ti
            wet = np.maximum(wet, Si * np.clip(1 - age / 4.0, 0, 1) * (age > 0))
        wet *= 1 - plates
        Ap = A * (1 - 0.05 * wet)[..., None] * (1 - 0.025 * ridge * (cov > 0.3) * (1 - plates))[..., None]
        img = B * (1 - cov[..., None]) + Ap * cov[..., None]
        # the roller
        rx, ry, press = roller_pos(t)
        speed = 0 if prev_y is None else abs(ry - prev_y)
        prev_y = ry
        if ry < H + 150:
            x0r, x1r = int(rx - RW / 2 - 20), int(rx + RW / 2 + 20)
            y0r, y1r = int(ry - 48), int(ry + 48)
            layer = np.zeros((H, W, 3), np.float32)
            alpha = np.zeros((H, W), np.float32)
            sh = np.zeros((H, W), np.float32)
            ys0, ys1 = max(y0r, 0), min(y1r, H)
            xs0, xs1 = max(x0r, 0), min(x1r, W)
            if ys1 > ys0 and xs1 > xs0:
                vy = (np.arange(ys0, ys1) - ry)[:, None] / 48.0
                cyl = np.clip(np.sqrt(np.clip(1 - vy ** 2, 0, 1)), 0, 1)
                off = int(ry * 0.8) % 300
                tex = nap[off:off + (ys1 - ys0), (xs0 - x0r):(xs1 - x0r)]
                if tex.shape[0] < ys1 - ys0:
                    tex = np.resize(tex, (ys1 - ys0, xs1 - xs0))
                shade = (0.55 + 0.6 * cyl) * (1 + 0.10 * tex)
                ends = np.clip(np.minimum(np.arange(xs0, xs1) - x0r, x1r - np.arange(xs0, xs1)) / 14.0, 0, 1)[None, :]
                col = rgb(new)[None, None] * 0.88 * (shade * (0.7 + 0.3 * ends))[..., None]
                layer[ys0:ys1, xs0:xs1] = col
                alpha[ys0:ys1, xs0:xs1] = np.clip(cyl * 3, 0, 1) * np.clip(ends * 3, 0, 1)
            # wire frame and extension pole
            frame = Image.new("L", (W, H), 0)
            d = ImageDraw.Draw(frame)
            d.line([(x1r - 8, ry), (x1r + 22, ry), (x1r + 22, ry + 170), (rx + 70, ry + 330)], fill=255, width=11)
            pole = Image.new("L", (W, H), 0)
            ImageDraw.Draw(pole).line([(rx + 70, ry + 320), (rx + 150, H + 400)], fill=255, width=46)
            fm = gaussian_filter(np.asarray(frame, np.float32) / 255, 1.2)
            pm = gaussian_filter(np.asarray(pole, np.float32) / 255, 1.5)
            layer = layer * (1 - fm[..., None]) + rgb((0.62, 0.62, 0.60))[None, None] * fm[..., None]
            alpha = np.maximum(alpha, fm)
            pole_shade = 0.16 + 0.08 * np.clip((xx - rx) / 200, 0, 1)
            layer = layer * (1 - pm[..., None]) + (rgb((1, 1, 1))[None, None] * pole_shade[..., None]) * pm[..., None]
            alpha = np.maximum(alpha, pm)
            if speed > 2:
                k = min(speed / 3.0, 12)
                layer = gaussian_filter(layer, (k, 0.3, 0))
                alpha = gaussian_filter(alpha, (k, 0.3))
            sh = gaussian_filter(np.roll(np.roll(alpha, 26, 0), 18, 1), 18) * (1 - alpha)
            img = img * (1 - (0.35 if press > 0.9 else 0.22) * sh)[..., None]
            img = img * (1 - alpha[..., None]) + layer * alpha[..., None]
        sx, sy, sr = shake[fi]
        frame_im = shoot(img, out=out, cx=1150 + sx, cy=890 + sy, view=2000, yaw=0.05, pitch=-0.03, roll=-0.6 + sr,
                         exposure=0.97, wb=NEUTRAL, noise=0.012, bloom=0.8, seed=100 + fi)
        if preview:
            frame_im.save(Path(preview_dir) / f"preview-{fi:04d}.jpg", quality=90)
            continue
        frame_im.save(frames_dir / f"f{fi:04d}.jpg", quality=92)
        if fi == 0:
            frame_im.save(OUT / "hero-wall-before.jpg", quality=80, optimize=True, progressive=True)
        if fi == n - 1:
            frame_im.save(OUT / "hero-wall-after.jpg", quality=80, optimize=True, progressive=True)
        if fi % 24 == 0:
            print("  frame", fi, "/", n)
    if preview:
        return
    src = str(frames_dir / "f%04d.jpg")
    subprocess.run([ff, "-y", "-loglevel", "error", "-framerate", str(fps), "-i", src, "-c:v", "libx264", "-pix_fmt", "yuv420p",
                    "-crf", "25", "-preset", "slow", "-movflags", "+faststart", "-an", str(vdir / "hero-painting.mp4")], check=True)
    subprocess.run([ff, "-y", "-loglevel", "error", "-framerate", str(fps), "-i", src, "-c:v", "libvpx-vp9", "-b:v", "0",
                    "-crf", "36", "-row-mt", "1", "-an", str(vdir / "hero-painting.webm")], check=True)
    print("wrote video/hero-painting.mp4 and .webm")


# ------------------------------------------------------------- shots ------
SHOTS = {
    # Before / after pairs: deliberately different framing, exposure and white balance
    "ba-bathroom-before.jpg": lambda: shoot(bathroom("before"), cx=1150, cy=930, view=1700, yaw=0.10, pitch=-0.05, roll=-1.8, exposure=0.9, wb=WARM, seed=1),
    "ba-bathroom-after.jpg": lambda: shoot(bathroom("after"), cx=1060, cy=880, view=1800, yaw=0.04, pitch=-0.04, roll=1.1, exposure=1.0, wb=COOL, seed=2),
    "ba-kitchen-before.jpg": lambda: shoot(kitchen("before"), cx=1230, cy=860, view=1750, yaw=-0.09, pitch=-0.04, roll=1.6, exposure=0.9, wb=WARM, seed=3),
    "ba-kitchen-after.jpg": lambda: shoot(kitchen("after"), cx=1150, cy=880, view=1850, yaw=0.06, pitch=-0.04, roll=-0.8, exposure=0.9, wb=NEUTRAL, seed=4),
    "ba-living-before.jpg": lambda: shoot(living("before"), cx=1150, cy=1010, view=1850, yaw=0.12, pitch=-0.05, roll=-1.4, exposure=0.88, wb=WARM, seed=5),
    "ba-living-after.jpg": lambda: shoot(living("after"), cx=1250, cy=1010, view=1800, yaw=-0.05, pitch=-0.05, roll=0.9, exposure=0.98, wb=COOL, seed=6),
    "ba-bedroom-before.jpg": lambda: shoot(bedroom("before"), cx=1250, cy=1030, view=1850, yaw=-0.10, pitch=-0.05, roll=1.5, exposure=0.9, wb=WARM, seed=7),
    "ba-bedroom-after.jpg": lambda: shoot(bedroom("after"), cx=1180, cy=990, view=1900, yaw=0.07, pitch=-0.05, roll=-0.6, exposure=0.98, wb=NEUTRAL, seed=8),
    # Services
    "service-interior.jpg": lambda: shoot(living("after"), cx=1300, cy=800, view=1700, yaw=-0.03, roll=0.8, wb=NEUTRAL, seed=10),
    "service-exterior.jpg": lambda: shoot(siding(), cx=1200, cy=900, view=1900, yaw=0.05, pitch=-0.04, roll=-1.0, wb=COOL, exposure=1.02, seed=11),
    "living-room.jpg": lambda: shoot(living("after"), out=(900, 675), cx=1150, cy=950, view=2100, yaw=0.02, roll=-0.7, wb=NEUTRAL, seed=12),
    "kitchen.jpg": lambda: shoot(kitchen("after"), out=(900, 675), cx=1200, cy=820, view=1800, roll=0.9, exposure=0.93, wb=NEUTRAL, seed=13),
    "bedroom.jpg": lambda: shoot(bedroom("after"), out=(900, 675), cx=1200, cy=900, view=1900, yaw=-0.02, roll=0.5, wb=NEUTRAL, seed=14),
    "bathroom.jpg": lambda: shoot(bathroom("after"), out=(900, 675), cx=1100, cy=850, view=1900, roll=-0.8, wb=NEUTRAL, seed=15),
    "home-office.jpg": lambda: shoot(office(), out=(900, 675), cx=1200, cy=900, view=2100, yaw=0.03, roll=0.6, wb=NEUTRAL, seed=16),
    "ceilings.jpg": lambda: shoot(ceiling_view(), out=(900, 675), cx=1150, cy=820, view=2000, pitch=0.10, roll=1.0, exposure=0.95, wb=NEUTRAL, seed=17),
    "doors.jpg": lambda: shoot(doors(), out=(900, 675), cx=1200, cy=950, view=2200, yaw=0.03, roll=-0.6, wb=NEUTRAL, seed=18),
    "hallways.jpg": lambda: shoot(hallway(), out=(900, 675), cx=1150, cy=930, view=2100, roll=0.8, wb=WARM, exposure=1.02, seed=19),
    # About / Why (job-site shots, no people)
    "about-main.jpg": lambda: shoot(in_progress(), out=(800, 1000), cx=1200, cy=1060, view=1150, yaw=0.02, roll=-0.9, wb=NEUTRAL, seed=26),
    "about-inset.jpg": lambda: shoot(cutline_closeup(), out=(600, 600), cx=1250, cy=900, view=1100, roll=1.5, wb=NEUTRAL, seed=27),
    "why-interior.jpg": lambda: shoot(in_progress(seed=67, left=(0.80, 0.78, 0.73), right=(0.76, 0.66, 0.52), split=1300, tray_x=1250),
                                      out=(1000, 690), cx=1200, cy=1030, view=2100, yaw=-0.03, roll=0.7, wb=WARM, seed=28),
}

if __name__ == "__main__":
    only = sys.argv[1:]
    OUT.mkdir(parents=True, exist_ok=True)
    if "video" in only:
        hero_video()
    if "preview" in only:
        preview_dir = sys.argv[-1]
        hero_video(preview=[1.0, 2.3, 4.2, 6.6, 8.2])
        sys.exit()
        only = [o for o in only if o != "video"]
        if not only:
            sys.exit()
    for name, fn in SHOTS.items():
        if only and not any(o in name for o in only):
            continue
        fn().save(OUT / name, quality=74, optimize=True, progressive=True)
        print("wrote", name)
