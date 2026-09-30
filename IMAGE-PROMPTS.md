# West Coast Finish: photo prompts

The site uses real Unsplash photographs, linked in `index.html`. The "before" photos are the same
pictures as the "after" photos, made to look old in the browser, so they are close but not true
before/after pairs.

The best upgrade is your own photos from real jobs: a phone photo of a wall when you arrive and
another after it's painted. AI-generated photos made with the prompts below also work. Put the
files in `assets/img/photos/` (create the folder), then replace the matching Unsplash link in
`index.html`, or send the photos to Claude to do it. When a before/after pair uses two real
photos, remove the `ba-shot--before` class from that "before" button so no effect is added.

## The look we want (based on your reference photos)

Your references are real before/after job photos: each pair is shot from **the same spot and angle**,
in **ordinary daylight**, with an ordinary phone. The room or house is the same; only the paint
changes. The "before" shows a dated or tired colour; the "after" is clean and fresh. Nothing is
staged or dramatic.

**Style line: add this to the end of every prompt:**

> Realistic smartphone photo, like a real before/after photo posted by a local painting company.
> Ordinary suburban home, natural daylight, eye-level, straight-on, slight lens distortion, normal
> phone sharpness and colour, not staged, not wide-angle luxury real-estate photography, not a
> render. No people, no hands, no text, no watermark, no logo.

Skip any result with people or hands, warped details, or a fancy house.

## Before & After (4 pairs), most important

Only the **walls** change. Floors, doors, windows, blinds, fixtures, cabinets and counters stay
the same.

1. Generate the **before** image.
2. In the same chat, ask: *"Now show this exact same room after a professional painter repainted
   only the walls [NEW COLOUR]. Same camera position and angle, same everything else, drop
   cloths removed, a little brighter daylight."*

**`ba-bedroom-before.jpg`** → then after in **soft grey-green** → **`ba-bedroom-after.jpg`**
(like your fourth reference)
> Empty bedroom in an ordinary house, walls painted a loud dated orange-red, white closet doors,
> two windows with white blinds, ceiling fan, dark laminate floor partly covered with a canvas drop
> cloth, taken from the doorway.

**`ba-living-before.jpg`** → then after in **light warm grey** → **`ba-living-after.jpg`**
(like your third reference, walls only)
> Ordinary two-storey entry and living area with walls painted a dated beige-tan, carpet, a wall
> vent, a light switch, afternoon daylight, taken from the front door.

**`ba-kitchen-before.jpg`** → then after in **clean warm white** → **`ba-kitchen-after.jpg`**
> Ordinary kitchen wall between plain cabinets, window over the sink, walls painted a yellowed
> builder beige with marks around the switch and outlet, eye-level, daylight.

**`ba-bathroom-before.jpg`** → then after in **soft sage green** → **`ba-bathroom-after.jpg`**
> Small ordinary bathroom, plain white vanity, simple mirror, towel bar, walls painted a dated
> peach colour with a few scuffs, overhead vanity light on.

### Exterior pair (optional, for the Exterior Painting card)

Like your first two references:
> Front of an ordinary two-storey suburban stucco house with a double garage, stucco painted a
> dull dated green-grey or tan, brown front door, daytime, taken from the sidewalk.

Then: *"Now show the same house after a professional exterior repaint: stucco in a crisp warm
white, fascia and gutters in black, garage door in white. Same camera position, same landscaping
and roof."* Save as `ext-before.jpg` and `ext-after.jpg`.

## Services

| File | Prompt |
|---|---|
| `service-interior.jpg` | Living room wall just repainted a light greige, window and baseboard, a few items moved to the middle of the room |
| `service-exterior.jpg` | Close-up of freshly painted grey-blue horizontal lap siding around a window on a house, overcast day |
| `living-room.jpg` | Living room wall after a fresh coat of paint, simple and a little empty |
| `kitchen.jpg` | Kitchen wall between cabinets freshly painted warm white |
| `bedroom.jpg` | Bedroom walls freshly painted a calm blue-grey, closet door, window |
| `bathroom.jpg` | Small bathroom walls freshly painted soft sage green, plain vanity and mirror |
| `home-office.jpg` | Spare room used as an office, one wall freshly painted a muted green, simple shelf and desk |
| `ceilings.jpg` | Looking up at a freshly painted flat white ceiling with a basic light fixture |
| `doors.jpg` | Hallway with two white interior panel doors freshly painted |
| `hallways.jpg` | Hallway wall freshly painted, doorway, light switch, a few coat hooks |

## About and Why Choose Us (job site, no people)

| File | Prompt |
|---|---|
| `about-main.jpg` (portrait 4:5) | Wall halfway through being repainted, new colour rolled on the left, old colour on the right, blue painter's tape along the baseboard, canvas drop cloth on the floor, roller tray and paint can |
| `about-inset.jpg` (square) | Close-up of a fresh cut-in line where new wall paint meets the white ceiling |
| `why-interior.jpg` | Room mid-repaint, new colour beside the old one, drop cloth and roller tray on the floor |

## Hero animation (light grey)

Two images of the **same room from the exact same spot**, used for the homepage painting animation:

**`hero-before.jpg`**
> Ordinary living room wall during a paint job, furniture moved away, walls in a dated tan-beige
> with scuffs and patched nail holes, blue painter's tape along the baseboard, canvas drop cloth
> on the floor, window with white blinds on one side, eye-level, straight-on, natural daylight.

Then: *"Now show this exact same image, same camera position, with the walls freshly painted a
clean **light grey** (like Benjamin Moore Stonington Gray or Sherwin-Williams Repose Gray), even
coverage, everything else identical."* Save as **`hero-after.jpg`**.
