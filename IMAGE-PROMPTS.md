# West Coast Finish: photo prompts

The site's photos in `assets/img/photos/` are computer-rendered stand-ins made by
`tools/render_photos.py`. They show the right things (simple rooms, real drywall, before and
after wall painting, no people), but they are renders, not photographs.

To swap in more realistic images, generate them with an AI image tool (ChatGPT, Gemini,
Midjourney, Adobe Firefly…) using the prompts below. Save each one with the **exact file name**
shown and upload it to `assets/img/photos/`, replacing the old file. The site picks it up
automatically; no code changes are needed.

## The look we want

Photos a local painter took on their phone while on the job. They should not look like
real-estate marketing, stock photography or AI art.

**Style line: add this to the end of every prompt:**

> Casual smartphone photo taken by a house painter on the job, ordinary lived-in Canadian home,
> real drywall with slight texture, natural indoor light from a window plus ceiling light, uneven
> brightness, slightly crooked framing, a little soft focus and grain, not staged, not wide-angle,
> not luxury, not a stock photo. No people, no hands, no pets, no text, no watermark.

Skip any result that shows people or hands, looks too perfect or glossy, or shows a fancy house.

## Before & After (4 pairs), most important

Only the **walls** change between before and after. Floors, tile, counters, cabinets and
fixtures stay the same.

1. Generate the **before** image.
2. In the same chat, ask: *"Now show the same room after a professional painter repainted only
   the walls [NEW COLOUR]. Same room, same furniture, but take the photo from a slightly
   different spot and angle, with slightly different lighting, like a second phone photo taken
   at the end of the job. Keep the floor, fixtures, cabinets and counters exactly as they were."*

**`ba-bathroom-before.jpg`** → then after in **soft sage green** → **`ba-bathroom-after.jpg`**
> Small ordinary bathroom, wall above a plain white vanity with a simple mirror and a towel bar.
> Walls painted an old dated peach colour with scuff marks, a few small patched spots, slight
> yellowing near the ceiling and grime around the light switch.

**`ba-kitchen-before.jpg`** → then after in **clean warm white** → **`ba-kitchen-after.jpg`**
> Ordinary kitchen wall between upper cabinets, window over the sink, counter along the bottom.
> Walls painted a yellowed builder-beige with greasy discolouration near the stove side, marks
> around the outlet and switch.

**`ba-living-before.jpg`** → then after in **light greige** → **`ba-living-after.jpg`**
> Mostly empty living room during a paint job, one wall with a window and baseboard. Walls
> painted a tired tan colour with scuffs at furniture height, nail holes, a faded outline where a
> picture used to hang, and a couple of small dents.

**`ba-bedroom-before.jpg`** → then after in **calm blue-grey** → **`ba-bedroom-after.jpg`**
> Simple bedroom wall with a white closet door and a window with blinds, little furniture.
> Walls painted a faded dusty mauve colour with scuff marks, small patched spots and uneven,
> slightly blotchy old paint.

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

## Hero video

The video at the top of the page (`assets/video/hero-painting.mp4` and `.webm`) is rendered by
`python3 tools/render_photos.py video`, which also writes `hero-wall-before.jpg` (first frame) and
`hero-wall-after.jpg` (last frame). To use your own clip instead, film a short, steady phone video
of a roller putting a new colour on a wall (5–8 seconds, landscape) and replace both video files.
