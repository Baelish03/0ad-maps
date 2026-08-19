## Middle Earth

![](../images/Middle%20Earth/screenshot0011.png)

### Biomes

This map reconstructs the geography of Middle-earth on a real heightmap, divided into twelve climate zones that follow Tolkien's continental layout from north to south and west to east: Forodwaith (arctic), Angmar and the transitional Shire–Lothlórien border (alpine), the Shire and Lothlórien proper (temperate), Rhûn and Rohan (steppe), Gondor (Aegean/Mediterranean), Mordor and East Mordor, and North Harad and Harad (savanna and desert) to the south.

Each zone is painted with its own biome, giving the continent genuinely different terrain textures, vegetation, and wildlife rather than a single palette reused everywhere: pine-covered alpine slopes around Angmar, temperate forest and farmland in the Shire, open steppe grassland across Rohan and Rhûn, Mediterranean scrubland in Gondor, and a dedicated custom biome for Mordor itself, distinguishing it visually and ecologically from the surrounding desert and steppe zones.

Player starting positions are placed avoiding deliberately Mordor, keeping it a hostile, resource-marginal region rather than a viable base location, in keeping with its role in the source material.

Visually, the map uses a warm, slightly desaturated sun tone against cool blue-green water, cumulus skies, and a light HDR tonemap with reduced saturation and moderate bloom, aiming for a muted, epic tone rather than the high-saturation look of the default temperate presets.

### Source materials

Thanks to u/enpremi for his heightmap: 

https://www.reddit.com/r/lotr/comments/1avfmuw/high_resolution_middleearth_heightmap_link_in/

and to u/William_MM for the climate division

https://www.reddit.com/r/imaginarymaps/comments/c5mzt9/oc_climate_map_of_middleearth/

This is my rielaboration for 0 A.D.

![](../images/Middle%20Earth/base-1000.svg)

It is a
1000×1000 Inkscape overlay traced on top of the source heightmap, with one
labeled rectangle per region (Forodwaith, Angmar, Shire, Lorien, Rhûn, Rohan,
Gondor, Mordor, East Mordor, North/South Harad).

Pixel coordinates read off this overlay were converted to the fractional
`Vector2D` bounds (`fractionToTiles(...)`) hardcoded in `middle-earth.js`.
It has no in-game role. Labels in .svg and in the .js script are informal working notes (a few are Italian).