# Continental Maps for 0 A.D.
## Index
- [North and Central America](./docs/North_America.md)
- [South America](./docs/South_America.md)
- [World](./docs/World.md)
- [Asia](./docs/Asia.md)
- [Guide](#guide-to-create-real-world-heightmap-maps-for-0-ad)


## Guide to Create Real-World Heightmap Maps for 0 A.D.

### Prerequisites

Make sure you have the following tools installed before starting:

- **A modern browser** (Chrome, Edge, Firefox, or any browser with DevTools mobile emulation)
- **GIMP 2.10+** — for image processing and curve adjustments
- **0 A.D. Alpha** (any recent release) — with the Atlas map editor accessible

No GIS or cartography experience is required, but familiarity with GIMP's basic interface is assumed.


### Step 1 — Capture the Heightmap with Tangram Heightmapper

1. Open [Tangram Heightmapper](https://tangrams.github.io/heightmapper/) in any modern browser.
2. Open **DevTools** (`F12` or `Ctrl+Shift+I`), then switch to **mobile emulation mode** (the device icon in the toolbar). <br>
In **Firefox** you can directlty open mobile mode with `Ctrl+Shift+M`.
3. Set the viewport resolution to **512 × 512** pixels.
![](/images/contribute/Step1.png)
4. Navigate the map to the geographic region you want to recreate.
5. Press `H` to **hide the UI overlay**, frame your area precisely, then press `H` again to **show the UI**.
6. Click **Export**. The tool will save a **2048 × 2048** grayscale PNG.

> **Naming tip:** Name the file using the format `scale_lat_lon` (e.g. `4_44.5_12.3`). These values are visible in the URL, so you can always reproduce the exact same export later.


### Step 2 — Rescale to 1024 × 1024 in GIMP

0 A.D. heightmaps work best at 1024 × 1024. Downscaling with cubic interpolation preserves terrain detail well.

1. Open the exported PNG in GIMP.
2. Go to **Image → Scale Image**.
3. Set both dimensions to **1024 × 1024**.
4. Set the interpolation method to **Cubic**.
5. Click **Scale**.


### Step 3 — Adjust the Elevation Curve

Raw heightmapper exports tend to have very dark low-elevation areas, which makes coastlines nearly flat and difficult to work with in-game. On the other mountains are too high and. The goal here is to lift the dark tones (low elevations) and drop light one (too high mountains), using a square-root-based curve.

#### Target curve formula

The desired remapping for pixel intensity is:

$$
y = \sqrt{32 \cdot x} 
$$

Where `x` is the input brightness (0–255) and `y` is the output brightness (0–255). This compresses the highlights slightly and lifts the shadows, raising sea-level terrain enough for ports and coastal buildings to be viable.

### How to apply it in GIMP

1. Go to **Colors → Curves**.
2. Set the **Channel** to **Value** (the white/luminosity channel).
3. Switch the view to **non-linear** and the histogram to **logarithmic** — this makes low-value detail much easier to see and adjust.
4. Set the **Curve type** to **Smooth**.
5. Add control points along the curve to approximate the formula. Use at least **6–8 points**, with **3 or 4 concentrated below x = 32** to accurately lift the darkest tones (the sea floor and coastline). Suggested reference values:

| Input $(x)$ | Output $y = \sqrt{32 \cdot x}$ |
|-----------|--------------------------|
| 0         | 0                        |
| 4         | 11                       |
| 8         | 16                       |
| 16        | 23                       |
| 32        | 32                       |
| 64        | 45                       |
| 128       | 64                       |
| 192       | 78                       |
| 255       | 90                       |

![](/images/contribute/Step3.png)

> **Why this matters:** The darkest pixels represent sea floor. If they stay near zero, the coastline will be too flat and units won't be able to navigate near shore. Lifting them ensures the coast has enough elevation relief for docks and port structures.


### Step 4 — Soften the Coastline for Port Placement

The sea-coast boundary is usually a sharp edge after the curve adjustment. To make it buildable (especially for docks), you need to slightly lower the coastal pixels so they blend smoothly into the terrain.

1. Use **Select by Color** (`Shift+O`) with a **threshold of 3** and click on any pure black pixel (hex `000000`) to select the sea.
2. Go to **Select → Grow** and enter **3 pixels**. This expands the selection to include the sea plus a narrow coastal strip.
3. Go to **Colors → Curves** again.
4. Apply a gentle darkening to the selection using this linear remap:

$$
y = \frac{3}{4} \cdot  x
$$

This reduces the brightness of the coastal band to 75% of its current value, creating a gradual transition at the waterline that is low enough for port placement.

5. Deselect (`Select → None` or `Shift+Ctrl+A`).


### Step 5 — Apply Gaussian Blur for Terrain Smoothness

Real terrain is never pixel-sharp. A light blur reduces jagged heightmap artifacts and makes the final in-game terrain look natural.

1. Go to **Filters → Blur → Gaussian Blur**.
2. Set both **X** and **Y radius to 2.5**.
3. Set the **abyss policy** (edge handling) to **Black** (abysso nero / extend with black).
4. Apply.

> This step also smooths out any hard edges introduced by the curve adjustments in the previous steps.


### Next Steps

Once you have the final processed PNG:

- Export it from GIMP as a **grayscale PNG** (`File → Export As`, make sure the color mode is Grayscale: **Image → Mode → Grayscale** before exporting).
- Open **0 A.D. Atlas** and import the heightmap through the terrain tools.
- Adjust water level in Atlas to match the elevation floor you established with the curve.


### Tips

- **Reproduce any map:** Because you named the file with scale, latitude, and longitude from the Heightmapper URL, you can always go back and re-export the same region at a different scale or with different processing settings.
- **Coastal detail:** The 3-pixel coast selection in Step 4 is a minimum. For maps with complex coastlines (fjords, islands, deltas), consider growing by 5–6 pixels instead.
- **Sea level:** We choose on Step 4 a threshold of 3. Now you can color a small square in the map with color `030303`, to use it as guide.

