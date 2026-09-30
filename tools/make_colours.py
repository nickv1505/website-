"""
Builds v2/assets/js/colours.js: the West Coast Finish collection of 1,000 colours.

Keeps the 100 hand-named colours, then fills 15 families (whites to blacks, every hue)
with evenly spread shades. Every colour gets a name, a WCF code, a family and search
tags (everyday colour words plus light/dark), so searches like "black", "orange",
"navy" or "dark green" all work.

Run: python3 tools/make_colours.py
"""
import colorsys
import json
import re
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "v2" / "assets" / "js" / "colours.js"

# family: (target count, hue range in degrees, saturation range, lightness range, nouns, search words)
FAMILIES = {
    "Whites": (50, (0, 360), (0.02, 0.30), (0.905, 0.975),
               ["Snow", "Chalk", "Porcelain", "Cotton", "Frost", "Cloud", "Pearl", "Linen", "Lily", "Paper"],
               "white off-white bright"),
    "Creams": (50, (30, 58), (0.20, 0.70), (0.80, 0.92),
               ["Cream", "Ivory", "Vanilla", "Buttermilk", "Custard", "Parchment", "Eggshell", "Candle", "Muslin", "Meringue"],
               "cream ivory off-white warm white"),
    "Greys": (80, (0, 360), (0.0, 0.08), (0.30, 0.86),
              ["Pebble", "Fog", "Slate", "Ash", "Granite", "Stone", "Mist", "Pewter", "Smoke", "Flint", "Harbour", "Concrete"],
              "grey gray silver"),
    "Blacks": (40, (0, 360), (0.0, 0.14), (0.07, 0.24),
               ["Onyx", "Jet", "Coal", "Ebony", "Ink", "Obsidian", "Raven", "Soot", "Night", "Tar"],
               "black charcoal dark"),
    "Beiges & taupes": (80, (25, 45), (0.10, 0.32), (0.52, 0.84),
                        ["Sand", "Oat", "Taupe", "Driftwood", "Wheat", "Linen", "Biscuit", "Latte", "Mushroom", "Burlap", "Fawn", "Greige"],
                        "beige taupe greige tan neutral sand"),
    "Browns": (70, (15, 38), (0.18, 0.48), (0.16, 0.50),
               ["Cedar", "Walnut", "Cocoa", "Coffee", "Chestnut", "Saddle", "Toffee", "Mocha", "Bark", "Umber", "Hazel", "Leather"],
               "brown tan chocolate wood"),
    "Reds": (70, (350, 368), (0.35, 0.72), (0.22, 0.60),
             ["Brick", "Cherry", "Cranberry", "Barn", "Ruby", "Garnet", "Poppy", "Wine", "Crimson", "Rosehip", "Chili", "Merlot"],
             "red burgundy maroon brick crimson"),
    "Oranges": (70, (14, 34), (0.45, 0.85), (0.40, 0.80),
                ["Pumpkin", "Tangerine", "Apricot", "Marmalade", "Rust", "Copper", "Clementine", "Papaya", "Ember", "Persimmon", "Peach", "Terracotta"],
                "orange peach coral apricot rust copper terracotta"),
    "Yellows": (70, (40, 58), (0.40, 0.85), (0.50, 0.90),
                ["Lemon", "Butter", "Honey", "Mustard", "Sunflower", "Straw", "Daffodil", "Ochre", "Canary", "Saffron", "Corn", "Goldenrod"],
                "yellow gold mustard lemon"),
    "Greens": (110, (70, 160), (0.12, 0.55), (0.18, 0.86),
               ["Sage", "Moss", "Fern", "Olive", "Pine", "Mint", "Juniper", "Basil", "Laurel", "Spruce", "Meadow", "Eucalyptus", "Cedar Leaf", "Lichen"],
               "green sage olive mint forest emerald"),
    "Teals": (50, (165, 195), (0.20, 0.60), (0.20, 0.80),
              ["Lagoon", "Sea Glass", "Tide", "Teal", "Aqua", "Reef", "Surf", "Kelp", "Cove", "Inlet"],
              "teal turquoise aqua sea green"),
    "Blues": (110, (195, 230), (0.15, 0.60), (0.30, 0.88),
              ["Sky", "Harbour", "Denim", "Glacier", "Rain", "Lake", "Bay", "Horizon", "Wave", "Cornflower", "Steel", "Chambray", "Pacific", "Mist"],
              "blue sky light blue powder blue"),
    "Navies": (30, (210, 235), (0.25, 0.55), (0.12, 0.30),
               ["Navy", "Midnight", "Sapphire", "Admiral", "Deep Sea", "Nightfall", "Indigo", "Marine"],
               "navy dark blue midnight"),
    "Purples": (60, (255, 300), (0.10, 0.45), (0.22, 0.86),
                ["Lavender", "Lilac", "Plum", "Heather", "Violet", "Iris", "Aubergine", "Orchid", "Wisteria", "Thistle", "Mauve", "Amethyst"],
                "purple lavender lilac violet plum mauve"),
    "Pinks": (60, (330, 358), (0.25, 0.70), (0.55, 0.92),
              ["Blush", "Rose", "Petal", "Cherry Blossom", "Flamingo", "Peony", "Coral", "Candy", "Dusty Rose", "Salmon", "Watermelon", "Magnolia"],
              "pink rose blush coral salmon"),
}
LIGHT = ["Pale", "Soft", "Whisper", "Morning", "Misty", "Light", "Airy", "Hushed", "Sunlit", "Gentle"]
MID = ["Coastal", "Classic", "Warm", "Harbour", "Quiet", "Country", "Garden", "Village", "Heritage", "True", "Cool", "Rustic"]
DARK = ["Deep", "Dark", "Midnight", "Smoky", "Stormy", "Evening", "Rich", "Forest", "Velvet", "Shadow"]


def hex_of(h, s, l):
    r, g, b = colorsys.hls_to_rgb((h % 360) / 360, l, s)
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))


def hsl_of(hexc):
    r, g, b = (int(hexc[i:i + 2], 16) / 255 for i in (1, 3, 5))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return h * 360, s, l


def family_of(hexc):
    """Best family for a hand-picked colour."""
    h, s, l = hsl_of(hexc)
    if l < 0.2 and s < 0.35: return "Blacks"
    if l > 0.9 and s < 0.35: return "Whites"
    if l > 0.8 and 28 <= h <= 60: return "Creams"
    if s < 0.1 or (s < 0.16 and l < 0.75 and not 20 <= h <= 50): return "Greys"
    if 15 <= h <= 42 and l < 0.5: return "Browns"
    if 18 <= h <= 52 and s < 0.38: return "Beiges & taupes"
    if 205 <= h <= 240 and l < 0.3: return "Navies"
    if h >= 330 and l > 0.55: return "Pinks"
    if h >= 345 or h < 14: return "Reds"
    if h < 40: return "Oranges"
    if h < 65: return "Yellows"
    if h < 165: return "Greens"
    if h < 195: return "Teals"
    if h < 245: return "Blues"
    if h < 330: return "Purples"
    return "Pinks"


def tags_for(family, l):
    t = FAMILIES[family][5]
    if l >= 0.72: t += " light pale"
    elif l <= 0.35: t += " dark deep"
    else: t += " medium"
    return t


def curated():
    src = (ROOT / "v2" / "assets" / "js" / "colours.js").read_text()
    if "curated" in src and "window.WCF_CURATED" in src:
        src = src.split("window.WCF_CURATED = ")[1]
    rows = re.findall(r'\["([^"]+)", "(#[0-9A-Fa-f]{6})", "[^"]+"\]', src)
    return rows[:100]


def main():
    rng = np.random.default_rng(42)
    colours, names, hexes = [], set(), set()
    for name, hexc in curated():
        fam = family_of(hexc)
        colours.append({"name": name, "hex": hexc.upper(), "family": fam})
        names.add(name); hexes.add(hexc.upper())
    for fam, (target, (h0, h1), (s0, s1), (l0, l1), nouns, _) in FAMILIES.items():
        have = sum(1 for c in colours if c["family"] == fam)
        need = max(0, target - have)
        # an even grid over hue x lightness x saturation, jittered, then trimmed to size
        cand = []
        n = int(np.ceil((need * 1.8) ** (1 / 3))) + (6 if l0 > 0.8 else 2)
        for h in np.linspace(h0, h1, n):
            for l in np.linspace(l0, l1, n + 2):
                for s in np.linspace(s0, s1, n):
                    cand.append((h + rng.normal(0, 1.5), float(np.clip(s + rng.normal(0, 0.01), 0, 1)), float(np.clip(l + rng.normal(0, 0.006), 0, 1))))
        rng.shuffle(cand)
        picked = []
        for (h, s, l) in cand:
            if len(picked) >= need: break
            hx = hex_of(h, s, l)
            if hx in hexes: continue
            rgb = np.array([int(hx[i:i + 2], 16) for i in (1, 3, 5)])
            if any(np.abs(rgb - p[1]).sum() < (6 if l0 > 0.8 else 12) for p in picked): continue
            picked.append((hx, rgb, l))
            hexes.add(hx)
        picked.sort(key=lambda p: -p[2])
        for k, (hx, rgb, l) in enumerate(picked):
            pool = LIGHT if l > 0.68 else DARK if l < 0.34 else MID
            nm = None
            for tries in range(len(pool) * len(nouns)):
                cand_name = f"{pool[(k + tries) % len(pool)]} {nouns[(k * 7 + tries) % len(nouns)]}"
                if cand_name not in names:
                    nm = cand_name; break
            if nm is None:
                nm = f"{pool[k % len(pool)]} {nouns[k % len(nouns)]} {k}"
            names.add(nm)
            colours.append({"name": nm, "hex": hx, "family": fam})
    order = list(FAMILIES)
    colours.sort(key=lambda c: (order.index(c["family"]), -hsl_of(c["hex"])[2]))
    for i, c in enumerate(colours):
        c["code"] = f"WCF {1001 + i}"
        c["tags"] = tags_for(c["family"], hsl_of(c["hex"])[2])
    rows = ",\n".join(json.dumps([c["name"], c["hex"], c["family"], c["tags"]]) for c in colours)
    OUT.write_text(
        "/* West Coast Finish colour collection: %d colours in %d families.\n"
        "   Generated by tools/make_colours.py. Names and codes are our own (WCF), not a paint brand.\n"
        "   On-screen colour is an approximation; we always test real samples on your walls. */\n"
        "window.WCF_COLOURS = [\n%s\n].map(([name, hex, family, tags], i) => ({ name, hex, family, tags, code: \"WCF \" + (1001 + i) }));\n"
        % (len(colours), len(FAMILIES), rows))
    from collections import Counter
    print(len(colours), "colours;", dict(Counter(c["family"] for c in colours)))


if __name__ == "__main__":
    main()
