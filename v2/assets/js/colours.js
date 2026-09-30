/* West Coast Finish colour collection: 100 colours in 10 families.
   Names and codes are our own (WCF), chosen to describe the colour, not a paint brand.
   On-screen colour is an approximation; we always test real samples on your walls. */
window.WCF_COLOURS = [
  // Whites (12)
  ["Point Grey Linen", "#EAE5D9", "Whites"], ["Chalk Cliff", "#F1EFE8", "Whites"], ["Fresh Snowfall", "#F5F5F1", "Whites"],
  ["Morning Cloud", "#EDEBE4", "Whites"], ["Seashell", "#F0E9DD", "Whites"], ["Rice Paper", "#EFE9DA", "Whites"],
  ["Coastal Mist", "#E7E8E3", "Whites"], ["Cream Soda", "#F1E8D2", "Whites"], ["Porcelain", "#EEEEE9", "Whites"],
  ["Lily White", "#F3F0E7", "Whites"], ["Warm Canvas", "#E9E1D0", "Whites"], ["Oyster", "#E3DED3", "Whites"],
  // Greys (12)
  ["English Bay Fog", "#C9CFCC", "Greys"], ["Harbour Pebble", "#B8BBB6", "Greys"], ["Silver Birch", "#D2D3CE", "Greys"],
  ["Rainy Day", "#A9ADAA", "Greys"], ["Concrete", "#9C9E9A", "Greys"], ["Storm Grey", "#7F8482", "Greys"],
  ["Slate Roof", "#5F6563", "Greys"], ["Charcoal", "#3F4341", "Greys"], ["Light Ash", "#DADAD5", "Greys"],
  ["Dove", "#C4C3BD", "Greys"], ["Pewter", "#8E918D", "Greys"], ["Grouse Slate", "#4A5663", "Greys"],
  // Greiges & beiges (12)
  ["Kitsilano Sand", "#D9C6A5", "Beiges"], ["Driftwood", "#C8BBA6", "Beiges"], ["Soft Greige", "#CFC8BB", "Beiges"],
  ["Oat Milk", "#E0D6C4", "Beiges"], ["Stone Path", "#BDB2A0", "Beiges"], ["Linen Closet", "#D8CFBF", "Beiges"],
  ["Warm Taupe", "#A89A88", "Beiges"], ["Mushroom", "#B5A796", "Beiges"], ["Latte", "#C2AE92", "Beiges"],
  ["Beach Grass", "#CDBF9E", "Beiges"], ["Pale Clay", "#D6C3AE", "Beiges"], ["Fawn", "#B8A284", "Beiges"],
  // Browns & tans (6)
  ["Cedar Bark", "#7A5C45", "Browns"], ["Coffee Bean", "#5A4435", "Browns"], ["Saddle", "#8C6A4E", "Browns"],
  ["Walnut", "#6B5140", "Browns"], ["Toffee", "#A07D5C", "Browns"], ["Cocoa", "#4A3A31", "Browns"],
  // Greens (14)
  ["Stanley Park Moss", "#8A9A80", "Greens"], ["Sage Leaf", "#A7B39C", "Greens"], ["Fern Gully", "#5E7355", "Greens"],
  ["Olive Grove", "#7B7D5A", "Greens"], ["Eucalyptus", "#9FB1A5", "Greens"], ["Pale Pistachio", "#CBD3BC", "Greens"],
  ["Forest Floor", "#3F4F3E", "Greens"], ["Seafoam", "#B9CEC3", "Greens"], ["Juniper", "#55685E", "Greens"],
  ["Lichen", "#B3B69A", "Greens"], ["Mint Frost", "#D3E0D6", "Greens"], ["Hunter", "#2F4236", "Greens"],
  ["Celery", "#D6DAB5", "Greens"], ["Laurel", "#6F7F66", "Greens"],
  // Blues (14)
  ["False Creek Blue", "#6E8A96", "Blues"], ["Sky Over Burrard", "#B7C9D3", "Blues"], ["Powder Blue", "#C9D6DD", "Blues"],
  ["Harbour Blue", "#58738A", "Blues"], ["Steel Blue", "#7C8F9E", "Blues"], ["Glacier", "#D5E0E3", "Blues"],
  ["Denim", "#4F6479", "Blues"], ["Rain Cloud Blue", "#8FA2AE", "Blues"], ["Deep Cove Navy", "#2E3A4D", "Blues"],
  ["Midnight", "#232B38", "Blues"], ["Cornflower", "#8FA7C4", "Blues"], ["Pacific Blue", "#3E5F7A", "Blues"],
  ["Duck Egg", "#B8CCC9", "Blues"], ["Ink", "#1F2733", "Blues"],
  // Teals (6)
  ["False Creek Teal", "#1F6F78", "Teals"], ["Lagoon", "#4F8C8C", "Teals"], ["Tidal Pool", "#79A5A2", "Teals"],
  ["Sea Glass", "#A9C8C2", "Teals"], ["Deep Teal", "#1D4B51", "Teals"], ["Spruce", "#34605F", "Teals"],
  // Yellows & golds (8)
  ["Marigold", "#E8A93A", "Yellows"], ["Butter", "#F1DFA6", "Yellows"], ["Honey", "#D9A74A", "Yellows"],
  ["Pale Lemon", "#F2E8BE", "Yellows"], ["Mustard", "#C99A34", "Yellows"], ["Golden Hour", "#E3BE6E", "Yellows"],
  ["Straw", "#E6D39B", "Yellows"], ["Ochre", "#B8873A", "Yellows"],
  // Reds, pinks & terracottas (10)
  ["Granville Clay", "#B7735C", "Reds & pinks"], ["Brick", "#A2503A", "Reds & pinks"], ["Terracotta", "#C27B5B", "Reds & pinks"],
  ["Cherry Blossom", "#E6C3C0", "Reds & pinks"], ["Dusty Rose", "#C9A09A", "Reds & pinks"], ["Blush", "#EBD5CE", "Reds & pinks"],
  ["Barn Red", "#7E3A2F", "Reds & pinks"], ["Peach Sorbet", "#EDC7AE", "Reds & pinks"], ["Rosewood", "#8F5B55", "Reds & pinks"],
  ["Coral Reef", "#D98E77", "Reds & pinks"],
  // Purples (6)
  ["Lavender Field", "#B7AEC4", "Purples"], ["Heather", "#9A8FA6", "Purples"], ["Plum", "#5C4458", "Purples"],
  ["Lilac Mist", "#D6D0DE", "Purples"], ["Mauve", "#A58C98", "Purples"], ["Aubergine", "#3E2F3C", "Purples"]
].map(([name, hex, family], i) => ({ name, hex, family, code: "WCF " + String(101 + i) }));
