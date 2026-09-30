"""
Image assets for the v2 site (v2/assets/img/):

  room-base.jpg    realistic room photo with plain white walls (phone-camera look)
  room-mask.png    where the walls are, so the browser can repaint them in any colour
                   (multiply blend keeps the real light and shadow on the wall)
  paint-texture.png  tileable roller texture, multiplied over flat colour for a real paint look
  paint-edge.png   ragged roller edge mask used by the opening animation
  roller.png       paint roller (transparent background) for the opening animation

Run: python3 tools/make_v2_assets.py   (needs numpy, scipy, pillow; uses tools/render_photos.py)
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter, map_coordinates

sys.path.insert(0, str(Path(__file__).resolve().parent))
import render_photos as rp  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / "v2" / "assets" / "img"
W, H = rp.W, rp.H
CAM = dict(out=(1200, 900), cx=1180, cy=960, view=1900, yaw=0.06, pitch=-0.04, roll=-0.8, barrel=0.035)


def warp(img, out, cx, cy, view, yaw, pitch, roll, barrel):
    """Same geometry as render_photos.shoot, with no photo effects (for masks)."""
    ow, oh = out
    hw, hh = view / 2, view * oh / ow / 2
    corners = [(-hw * (1 + pitch), -hh * (1 - yaw)), (hw * (1 + pitch), -hh * (1 + yaw)),
               (hw * (1 - pitch), hh * (1 + yaw)), (-hw * (1 - pitch), hh * (1 - yaw))]
    a = np.deg2rad(roll)
    src = [(cx + x * np.cos(a) - y * np.sin(a), cy + x * np.sin(a) + y * np.cos(a)) for x, y in corners]
    k = rp._coeffs([(0, 0), (ow, 0), (ow, oh), (0, oh)], src)
    yy, xx = np.mgrid[0:oh, 0:ow].astype(np.float32)
    nx, ny = (xx - ow / 2) / (ow / 2), (yy - oh / 2) / (ow / 2)
    f_ = 1 + barrel * (nx * nx + ny * ny)
    dx, dy = ow / 2 + nx * f_ * ow / 2 / (1 + barrel * 0.6), oh / 2 + ny * f_ * ow / 2 / (1 + barrel * 0.6)
    den = k[6] * dx + k[7] * dy + 1
    sx = (k[0] * dx + k[1] * dy + k[2]) / den
    sy = (k[3] * dx + k[4] * dy + k[5]) / den
    return map_coordinates(img, [sy, sx], order=1, mode="nearest")


def room():
    white = (0.93, 0.93, 0.92)
    s = rp.Scene(501, corner=1880, ceil_y=150, floor_y=1560)
    s.room(white, floor="wood", floor_col=(0.52, 0.39, 0.27), light_side=-1)
    s.window(300, 360, 520, 680, blinds=0.42)
    s.sun_patch([(380, 1575), (900, 1575), (1240, 1800), (600, 1800)], amt=0.6)
    s.frame_pic(1180, 470, 420, 300, art=((0.55, 0.6, 0.58), (0.8, 0.74, 0.62)))
    s.plate(1720, 1400, "outlet")
    s.plate(990, 860, "switch")
    img = s.render()
    # paintable wall area: walls minus window, picture, plates and baseboard
    objs = s.mask(lambda d: (
        d.rectangle([300 - 60, 360 - 40, 820 + 60, 1040 + 70], fill=255),     # window, casing and sill
        d.rectangle([1180, 470, 1600, 770], fill=255),                        # picture
        d.rectangle([1720, 1400, 1766, 1474], fill=255),                      # outlet
        d.rectangle([990, 860, 1038, 940], fill=255),                         # switch
    ), blur=0.8)
    paint = (s.wall & (s.yy < s.F[None] - 64)).astype(np.float32) * (1 - objs)
    photo = rp.shoot(img, exposure=0.98, wb=rp.NEUTRAL, seed=5, **CAM)
    photo.save(OUT / "room-base.jpg", quality=84, optimize=True, progressive=True)
    m = warp(gaussian_filter(paint, 0.8), **CAM)
    m = np.clip(m, 0, 1)
    a = (m * 255 + 0.5).astype(np.uint8)
    rgba = np.zeros((a.shape[0], a.shape[1], 4), np.uint8)
    rgba[..., 3] = a
    Image.fromarray(rgba, "RGBA").save(OUT / "room-mask.png", optimize=True)


def paint_texture(n=400):
    rng = np.random.default_rng(9)
    def tn(sig):
        z = gaussian_filter(rng.normal(0, 1, (n, n)), sig, mode="wrap")
        return z / z.std()
    t = 1 - 0.022 * np.abs(tn(0.8)) - 0.006 * tn((20, 3)) - 0.012 * tn(30)
    t = np.clip(t, 0.9, 1)
    Image.fromarray((t * 255 + 0.5).astype(np.uint8), "L").save(OUT / "paint-texture.png", optimize=True)


def paint_edge(w=320, h=1600):
    rng = np.random.default_rng(3)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    wob = gaussian_filter(rng.normal(0, 1, (1, w)), (0, 22)) * 20 + gaussian_filter(rng.normal(0, 1, (1, w)), (0, 6)) * 4
    st = gaussian_filter(rng.normal(0, 1, (h, w)), (30, 7)); st /= st.std()
    edge = h / 2 + wob
    a = np.clip((edge - yy) / 30 + 0.5 + 0.12 * st * np.exp(-((yy - edge) / 40) ** 2), 0, 1)
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[..., :3] = 255
    rgba[..., 3] = (a * 255 + 0.5).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(OUT / "paint-edge.png", optimize=True)


def roller(col=(0.13, 0.38, 0.41), w=420, h=620):
    """Loaded roller seen from the front: cover on top, frame and handle going down."""
    rng = np.random.default_rng(4)
    S = 2  # supersample
    W2, H2 = w * S, h * S
    yy, xx = np.mgrid[0:H2, 0:W2].astype(np.float32)
    img = np.zeros((H2, W2, 3), np.float32)
    alpha = np.zeros((H2, W2), np.float32)
    # cover (cylinder)
    x0, x1, y0, y1 = 20 * S, (w - 20) * S, 20 * S, 130 * S
    cy, r = (y0 + y1) / 2, (y1 - y0) / 2
    inside = (xx >= x0) & (xx <= x1) & (np.abs(yy - cy) <= r)
    v = np.clip((yy - cy) / r, -1, 1)
    shade = 0.45 + 0.75 * np.sqrt(np.clip(1 - v ** 2, 0, 1)) - 0.18 * v
    nap = gaussian_filter(rng.normal(0, 1, (H2, W2)), 1.4)
    nap /= nap.std()
    ends = np.clip(np.minimum(xx - x0, x1 - xx) / (18 * S), 0, 1)
    c = np.array(col, np.float32)[None, None] * (shade * (1 + 0.05 * nap) * (0.75 + 0.25 * ends))[..., None]
    img = np.where(inside[..., None], c, img)
    alpha = np.maximum(alpha, inside.astype(np.float32))
    # wet highlight
    hl = inside & (np.abs(v + 0.45) < 0.12)
    img = np.where(hl[..., None], np.clip(img + 0.10, 0, 1), img)
    # frame + handle
    m = Image.new("L", (W2, H2), 0)
    d = ImageDraw.Draw(m)
    d.line([(x1 - 6 * S, cy), (x1 + 8 * S, cy), (x1 + 8 * S, cy + 120 * S), (w / 2 * S + 40 * S, cy + 230 * S)], fill=255, width=12 * S)
    frame = np.asarray(m, np.float32) / 255
    hm = Image.new("L", (W2, H2), 0)
    ImageDraw.Draw(hm).rounded_rectangle([w / 2 * S + 18 * S, cy + 220 * S, w / 2 * S + 62 * S, H2 - 6 * S], radius=20 * S, fill=255)
    handle = np.asarray(hm, np.float32) / 255
    metal = 0.55 + 0.35 * np.clip(1 - np.abs(((xx % (24 * S)) - 12 * S) / (12 * S)), 0, 1)
    img = img * (1 - frame[..., None]) + (np.array([0.66, 0.66, 0.64])[None, None] * metal[..., None]) * frame[..., None]
    hx = (xx - (w / 2 * S + 40 * S)) / (22 * S)
    hshade = 0.10 + 0.14 * np.clip(1 - hx ** 2, 0, 1)
    img = img * (1 - handle[..., None]) + np.repeat(hshade[..., None], 3, -1) * handle[..., None]
    alpha = np.maximum(alpha, np.maximum(frame, handle))
    im = np.concatenate([np.clip(img, 0, 1), alpha[..., None]], -1)
    Image.fromarray((im * 255 + 0.5).astype(np.uint8), "RGBA").resize((w, h), Image.LANCZOS).save(OUT / "roller.png", optimize=True)


def door_tile():
    """Close-up of a freshly painted white six-panel door in a light grey wall."""
    s = rp.Scene(611, corner=None, ceil_y=60, floor_y=1650)
    s.room((0.70, 0.71, 0.69), floor="wood", floor_col=(0.5, 0.38, 0.27), light_side=-1)
    s.glow(600, 700, 900, 900, 0.18)
    s.door(760, 260, 760, 1390, col=(0.95, 0.945, 0.93))
    s.plate(1720, 860, "switch")
    img = s.render()
    rp.shoot(img, out=(640, 480), cx=1180, cy=1000, view=1450, yaw=0.06, pitch=-0.05, roll=-1.0,
             exposure=0.9, wb=rp.NEUTRAL, seed=21).save(OUT / "tile-door.jpg", quality=84, optimize=True, progressive=True)


def ceiling_tile():
    """Looking up at a freshly painted flat white ceiling with a light and pot lights."""
    s = rp.Scene(612, corner=1500, ceil_y=1380, floor_y=H + 10, ceil_slope=0.55)
    s.room((0.84, 0.83, 0.80), floor=None, bb=0, ceil_col=(0.96, 0.955, 0.94), light_side=-1)
    # soft falloff across the ceiling plane
    s.light *= np.where(s.yy < s.C[None], 0.80 + 0.2 * np.clip(s.yy / 1380.0, 0, 1) + 0.06 * np.exp(-((s.xx - 700) / 700) ** 2), 1)
    rim = s.mask(lambda d: d.ellipse([560, 560, 1000, 780], fill=255), blur=2)
    s.shadow(rim, 0, 18, 22, 0.22)
    s.put(rim, (0.85, 0.84, 0.81))
    s.ceiling_light(780, 670, 190)
    for (x0, y0) in [(260, 1120), (1250, 1180), (1250, 330)]:
        pot = s.mask(lambda d, x0=x0, y0=y0: d.ellipse([x0 - 46, y0 - 22, x0 + 46, y0 + 22], fill=255), blur=1.2)
        s.put(pot, (0.78, 0.77, 0.75))
        inner = s.mask(lambda d, x0=x0, y0=y0: d.ellipse([x0 - 32, y0 - 14, x0 + 32, y0 + 14], fill=255), blur=1.5)
        s.emit = np.maximum(s.emit, inner)
        s.emit_col = s.emit_col * (1 - inner[..., None]) + rp.rgb((1.05, 1.0, 0.92))[None, None] * inner[..., None]
    s.window(200, 1480, 520, 600, blinds=0.5)
    img = s.render()
    rp.shoot(img, out=(640, 480), cx=1000, cy=900, view=1850, yaw=0.03, pitch=0.16, roll=2.0,
             exposure=0.9, wb=rp.NEUTRAL, seed=22).save(OUT / "tile-ceiling.jpg", quality=84, optimize=True, progressive=True)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    only = sys.argv[1:]
    for name, fn in [("texture", paint_texture), ("edge", paint_edge), ("roller", roller), ("room", room), ("door", door_tile), ("ceiling", ceiling_tile)]:
        if not only or name in only:
            fn()
    print("done")
