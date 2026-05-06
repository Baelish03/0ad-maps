/* 
Capisco perfettamente la frustrazione. Gestire coordinate decimali e proiezioni geografiche a mente è una ricetta perfetta per il mal di testa.

Ecco la "Tabella Excel" definitiva. Ho diviso il mondo in una griglia **6x7**. Per usarla nel codice, ogni cella rappresenta un `RectPlacer` con i valori X e Y indicati nei titoli di colonna e riga.

### Griglia Biomi Mondiale (Riferimento 512x512)

| Y | **0.00 - 0.35** (Americhe) | **0.35 - 0.45** (Atlantico) | **0.45 - 0.65** (EMEA: EU/Afr) | **0.65 - 0.90** (Asia/Oceania) | **0.90 - 1.00** (Pacifico E) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **0.80 - 1.00** | `tundra` | `arctic` | `tundra` | `arctic` | `arctic` |
| **0.60 - 0.80** | `autumn` | `water` | `temperate` | `steppe` | `water` |
| **0.5 - 0.60** | `desert` | `water` | **`aegean`** (Nord) / **`desert`** (Sud) | `steppe` | `water` |
| **0.45 - 0.60** | `savanna` | `water` | `savanna` | `savanna` | `water` |
| **0.25 - 0.45** | `savanna` | `water` | `savanna` | `savanna` | `water` |
| **0.05 - 0.25** | `temperate` | `water` | **`savanna`** (Sud Afr) | **`desert`** (Aus) | `water` |
| **0.00 - 0.05** | `alpine` | `water` | `water` | `temperate` | `water` |

---

### Note rapide per la configurazione:

1.  **EMEA (0.45 - 0.65) / Y 0.60 - 0.75**: Qui hai sia il Mediterraneo che il Sahara. Ti consiglio di dividere questa cella a metà: la parte alta (**Y 0.68 - 0.75**) falla `aegean`, la parte bassa (**Y 0.60 - 0.68**) falla `desert`.
2.  **Sud Africa / Australia**: Come vedi, la fascia **Y 0.15 - 0.30** gestisce entrambi.
	*   Per il Sudafrica usa `savanna` (molto più realistico del deserto puro).
	*   Per l'Australia usa `desert` o `steppe` (il bioma `generic/steppe` di *0 A.D.* ha quegli arbusti bassi che ricordano molto l'outback).
3.  **Il Bug delle Risorse**: Se usi questa tabella, il trucco per non far fallire lo script è:
	*   Pitturare **prima** tutta la mappa di `water`.
	*   Pitturare i rettangoli della tabella sopra l'acqua.
	*   **Fondamentale**: Quando aggiungi le risorse, usa sempre `stayClasses(g_TileClasses.land)`. Se il generatore prova a mettere un cervo in una cella che è 90% oceano (come il Pacifico), fallirà se non ha abbastanza spazio "terra" calcolato.

### Come leggere le coordinate per il codice
Se vuoi riempire la cella "Americhe Temperate":
*   `X_min = 0.15`, `X_max = 0.40`
*   `Y_min = 0.75`, `Y_max = 0.90`

Trasformale in tile con `mapBounds.left + (mapBounds.width() * valore)`. 
*/

import {
	addAnimals, addBerries, addDecoration, addFish, addForests, addLayeredPatches, addMetal,
	addSmallMetal, addStone, addStragglerTrees
} from "maps/random/rmgen2/gaia.js";
import { addElements, createBase, initTileClasses } from "maps/random/rmgen2/setup.js";

Engine.LoadLibrary("rmgen");
Engine.LoadLibrary("rmgen-common");
Engine.LoadLibrary("rmbiome");

export function* generateMap(mapSettings) {
	TILE_CENTERED_HEIGHT_MAP = true;

	const tWater = "medit_sand_wet";
	const tSnowedRocks = ["alpine_rock_02_snow", "path a"];
	setBiome("generic/temperate");

	const heightScale = num => num * mapSettings.Size / 320;

	const heightSeaGround = heightScale(-6);
	const heightWaterLevel = heightScale(.15);
	const heightShoreline = heightScale(.7);
	const heightSnow = heightScale(35);

	globalThis.g_Map = new RandomMap(heightWaterLevel, g_Terrains.mainTerrain);
	const mapSize = g_Map.getSize();
	const mapCenter = g_Map.getCenter();
	const mapBounds = g_Map.getBounds();

	g_Map.LoadHeightmapImage("world.png", 0, 50);
	yield 15;

	initTileClasses([
		"shoreline",

		"north_pole",
		"north_america",
		"mexico",
		"equatorial_america",
		"brasil_savanna",
		"argentina",
		"land_fire",
		"mittel",
		"medit",
		"sahara",
		"equatorial_africa",
		"nubia",
		"africa_savanna",
		"south_africa_desert",
		"ukranian_steppe",
		"iran",
		"himalaya",
		"southeast_asia",
		"mongolia",
		"far_east",
		"australian_savanna",
		"australian_desert"
	]);

	const NorthPole = fractionToTiles(0.8);
	const AmericaRight = fractionToTiles(.35);
	const NorthAmericaBottomRight = new Vector2D(AmericaRight, fractionToTiles(.6));
	const MexicoBottomRight = new Vector2D(AmericaRight, fractionToTiles(.5));
	const TropicalAmericaBottomRight = new Vector2D(AmericaRight, fractionToTiles(.2));
	const BrasilianSavanna = new Vector2D(AmericaRight, fractionToTiles(.2));
	const ArgentinaBottomRight = new Vector2D(AmericaRight, fractionToTiles(.05));

	const MittelEuropeBottomRight = new Vector2D(fractionToTiles(.6), fractionToTiles(.62));
	const MeditBottomRight = new Vector2D(fractionToTiles(.62), fractionToTiles(.52));
	const SaharaBottomRight = new Vector2D(fractionToTiles(.68), fractionToTiles(.41));
	const EquatorialAfricaBottomRight = new Vector2D(fractionToTiles(.58), fractionToTiles(.3));
	const NubiaBottomRight = new Vector2D(fractionToTiles(.68), fractionToTiles(.3));
	const AfricaSavannaBottomRight = new Vector2D(fractionToTiles(.7), mapBounds.bottom);
	const SouthAfricaDesertTop = fractionToTiles(.23);
	const SouthAfricaDesertRight = fractionToTiles(.57);

	const AsiaRight = fractionToTiles(.85);
	const UkranianSteppeBottomRight = new Vector2D(AsiaRight, MittelEuropeBottomRight.y);
	const IranTopLeft = new Vector2D(MeditBottomRight.x, fractionToTiles(.7));
	const IranBottomRight = new Vector2D(fractionToTiles(.7), SaharaBottomRight.y);
	const HimalayaBottomRight = new Vector2D(AsiaRight, fractionToTiles(.5));
	const SouthEastAsiaBottomRight = new Vector2D(mapBounds.right, fractionToTiles(.23));
	const MongolianSteppeBottomRight = new Vector2D(mapBounds.right, fractionToTiles(.7));
	const FarEastBottomRight = new Vector2D(mapBounds.right, fractionToTiles(.5));

	const AustralianSavannaTopLeft = new Vector2D(fractionToTiles(.7), SouthEastAsiaBottomRight.y);
	const AustralianSavannaBottomRight = new Vector2D(mapBounds.right, mapBounds.bottom);
	const AustralianDesertTopLeft = new Vector2D(fractionToTiles(.9), fractionToTiles(.2));
	const AustralianDesertBottomRight = new Vector2D(fractionToTiles(.97), fractionToTiles(.12));

	const climateZones = [
		{
			"tileClass": g_TileClasses.north_pole,
			"position1": new Vector2D(mapBounds.left, mapBounds.top),
			"position2": new Vector2D(mapBounds.right, NorthPole),
			"biome": "generic/arctic",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.north_america,
			"position1": new Vector2D(mapBounds.left, NorthPole),
			"position2": NorthAmericaBottomRight,
			"biome": "generic/autumn",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.mexico,
			"position1": new Vector2D(mapBounds.left, NorthAmericaBottomRight.y),
			"position2": MexicoBottomRight,
			"biome": "generic/sahara",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.equatorial_america,
			"position1": new Vector2D(mapBounds.left, MexicoBottomRight.y),
			"position2": TropicalAmericaBottomRight,
			"biome": "generic/india",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.brasil_savanna,
			"position1": new Vector2D(fractionToTiles(.3), fractionToTiles(.25)),
			"position2": BrasilianSavanna,
			"biome": "generic/savanna",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.equatorial_america,
			"position1": new Vector2D(mapBounds.left, BrasilianSavanna.y),
			"position2": ArgentinaBottomRight,
			"biome": "generic/temperate",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.land_fire,
			"position1": new Vector2D(mapBounds.left, ArgentinaBottomRight.y),
			"position2": new Vector2D(AmericaRight, mapBounds.bottom),
			"biome": "generic/arctic",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.mittel,
			"position1": new Vector2D(AmericaRight, NorthPole),
			"position2": MittelEuropeBottomRight,
			"biome": "generic/temperate",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.medit,
			"position1": new Vector2D(AmericaRight, MittelEuropeBottomRight.y),
			"position2": MeditBottomRight,
			"biome": "generic/aegean",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.sahara,
			"position1": new Vector2D(AmericaRight, MeditBottomRight.y),
			"position2": SaharaBottomRight,
			"biome": "generic/sahara",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.equatorial_africa,
			"position1": new Vector2D(AmericaRight, SaharaBottomRight.y),
			"position2": EquatorialAfricaBottomRight,
			"biome": "generic/india",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.nubia,
			"position1": new Vector2D(EquatorialAfricaBottomRight.x, fractionToTiles(.41)),
			"position2": NubiaBottomRight,
			"biome": "generic/nubia",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.africa_savanna,
			"position1": new Vector2D(AmericaRight, NubiaBottomRight.y),
			"position2": AfricaSavannaBottomRight,
			"biome": "generic/savanna",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.south_africa_desert,
			"position1": new Vector2D(AmericaRight, SouthAfricaDesertTop),
			"position2": new Vector2D(SouthAfricaDesertRight, mapBounds.bottom),
			"biome": "generic/sahara",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.ukranian_steppe,
			"position1": new Vector2D(MeditBottomRight.x, NorthPole),
			"position2": UkranianSteppeBottomRight,
			"biome": "generic/steppe",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.iran,
			"position1": IranTopLeft,
			"position2": IranBottomRight,
			"biome": "generic/sahara",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.himalaya,
			"position1": new Vector2D(IranBottomRight.x, UkranianSteppeBottomRight.y),
			"position2": HimalayaBottomRight,
			"biome": "generic/alpine",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.southeast_asia,
			"position1": new Vector2D(IranBottomRight.x, HimalayaBottomRight.y),
			"position2": SouthEastAsiaBottomRight,
			"biome": "generic/india",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.mongolia,
			"position1": new Vector2D(UkranianSteppeBottomRight.x, NorthPole),
			"position2": MongolianSteppeBottomRight,
			"biome": "generic/steppe",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.far_east,
			"position1": new Vector2D(UkranianSteppeBottomRight.x, MongolianSteppeBottomRight.y),
			"position2": FarEastBottomRight,
			"biome": "generic/temperate",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.australian_savanna,
			"position1": AustralianSavannaTopLeft,
			"position2": AustralianSavannaBottomRight,
			"biome": "generic/savanna",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.australian_desert,
			"position1": AustralianDesertTopLeft,
			"position2": AustralianDesertBottomRight,
			"biome": "generic/sahara",
			"constraint": new NullConstraint()
		}
	]

	g_Map.log("Lowering sea ground");
	createArea(
		new MapBoundsPlacer(),
		new SmoothElevationPainter(ELEVATION_SET, heightSeaGround, 2),
		new HeightConstraint(-Infinity, heightWaterLevel));
	yield 20;

	g_Map.log("Smoothing heightmap");
	createArea(
		new MapBoundsPlacer(),
		new SmoothingPainter(1, scaleByMapSize(0.3, 0.8), 1));
	yield 25;

	g_Map.log("Marking water");
	createArea(
		new MapBoundsPlacer(),
		new TileClassPainter(g_TileClasses.water),
		new HeightConstraint(-Infinity, heightWaterLevel));
	yield 30;

	g_Map.log("Marking land");
	createArea(
		new DiskPlacer(fractionToTiles(0.5), mapCenter),
		new TileClassPainter(g_TileClasses.land),
		avoidClasses(g_TileClasses.water, 0));
	yield 35;


	g_Map.log("Marking climate zones");
	for (const zone of climateZones) {
		setBiome(zone.biome);
		createArea(
			new RectPlacer(zone.position1, zone.position2, Infinity),
			new TileClassPainter(zone.tileClass),
			zone.constraint);

		createArea(
			new RectPlacer(zone.position1, zone.position2, Infinity),
			new TerrainPainter(g_Terrains.mainTerrain),
			[
				new HeightConstraint(heightWaterLevel, Infinity),
				zone.constraint
			]);
	}
	yield 40;

	g_Map.log("Fuzzing biome borders");
	for (const zone of climateZones) {
		setBiome(zone.biome);

		createLayeredPatches(
			// 3, 6, 5, 10, 8, 21
			[scaleByMapSize(3, 6), scaleByMapSize(5, 10), scaleByMapSize(8, 16)],
			[
				[g_Terrains.mainTerrain, g_Terrains.tier1Terrain],
				[g_Terrains.tier1Terrain, g_Terrains.tier2Terrain],
				[g_Terrains.tier2Terrain, g_Terrains.tier3Terrain]
			],
			[1, 1],
			[
				avoidClasses(
					g_TileClasses.water, 2,
					g_TileClasses.mountain, 2,
					g_TileClasses.dirt, 5),
				borderClasses(zone.tileClass, 2, 7),
			],
			scaleByMapSize(20, 60),
			g_TileClasses.dirt);
	}
	yield 45;


	if (!mapSettings.Nomad)
	{
		g_Map.log("Finding player positions");

		const { playerIDs, playerPosition } = playerPlacementRandom(
			sortAllPlayers(),
			[
				avoidClasses(g_TileClasses.mountain, 3,
					g_TileClasses.himalaya, 1
				),
				stayClasses(g_TileClasses.land, scaleByMapSize(1, 15))
			]);

		g_Map.log("Flatten the initial CC area and placing playerbases");
		for (let i = 0; i < getNumPlayers(); ++i)
		{
			g_Map.logger.printDuration();
			setBiome(climateZones.find(zone => zone.tileClass.has(playerPosition[i])).biome);

			createArea(
				new ClumpPlacer(diskArea(defaultPlayerBaseRadius() * 0.8), 0.95, 0.6, Infinity,
					playerPosition[i]),
				new SmoothElevationPainter(ELEVATION_SET, g_Map.getHeight(playerPosition[i]), 6));

			createBase(playerIDs[i], playerPosition[i], mapSize >= 384);
		}
	}
	yield 50;


	for (const zone of climateZones) {
		setBiome(zone.biome);

		g_Map.log("Painting shoreline");
		createArea(
			new MapBoundsPlacer(),
			[
				new TerrainPainter(g_Terrains.shore),
				new TileClassPainter(g_TileClasses.shoreline)
			],
			[
				stayClasses(zone.tileClass, 0),
				new HeightConstraint(-Infinity, heightShoreline)
			]);

		g_Map.log("Painting cliffs");
		createArea(
			new MapBoundsPlacer(),
			[
				new TerrainPainter(g_Terrains.cliff),
				new TileClassPainter(g_TileClasses.mountain),
			],
			[
				stayClasses(zone.tileClass, 0),
				avoidClasses(g_TileClasses.water, 2),
				new SlopeConstraint(2, Infinity)
			]);

		g_Map.log("Placing resources");
		addElements([
			{
				"func": addMetal,
				"avoid": [
					g_TileClasses.berries, 5,
					g_TileClasses.forest, 3,
					g_TileClasses.mountain, 2,
					g_TileClasses.player, 30,
					g_TileClasses.rock, 10,
					g_TileClasses.metal, 25,
					g_TileClasses.water, 4
				],
				"stay": [zone.tileClass, 0],
				"sizes": ["normal"],
				"mixes": ["same"],
				"amounts": ["many"]
			},
			{
				"func": addStone,
				"avoid": [
					g_TileClasses.berries, 5,
					g_TileClasses.forest, 3,
					g_TileClasses.mountain, 2,
					g_TileClasses.player, 30,
					g_TileClasses.rock, 10,
					g_TileClasses.metal, 25,
					g_TileClasses.water, 4
				],
				"stay": [zone.tileClass, 0],
				"sizes": ["normal"],
				"mixes": ["same"],
				"amounts": ["many"]
			},
			{
				"func": addForests,
				"avoid": [
					g_TileClasses.berries, 3,
					g_TileClasses.forest, 15,
					g_TileClasses.metal, 3,
					g_TileClasses.mountain, 2,
					g_TileClasses.player, 12,
					g_TileClasses.rock, 2,
					g_TileClasses.water, 2
				],
				"stay": [zone.tileClass, 0],
				"sizes": ["normal"],
				"mixes": ["normal"],
				"amounts": ["normal"]
			},
			{
				"func": addSmallMetal,
				"avoid": [
					g_TileClasses.berries, 5,
					g_TileClasses.forest, 3,
					g_TileClasses.mountain, 2,
					g_TileClasses.player, 30,
					g_TileClasses.rock, 10,
					g_TileClasses.metal, 15,
					g_TileClasses.water, 4
				],
				"stay": [zone.tileClass, 0],
				"sizes": ["normal"],
				"mixes": ["same"],
				"amounts": ["few", "normal", "many"]
			},
			{
				"func": addBerries,
				"avoid": [
					g_TileClasses.berries, 30,
					g_TileClasses.forest, 2,
					g_TileClasses.metal, 4,
					g_TileClasses.mountain, 2,
					g_TileClasses.player, 20,
					g_TileClasses.rock, 4,
					g_TileClasses.water, 2
				],
				"stay": [zone.tileClass, 0],
				"sizes": ["normal"],
				"mixes": ["normal"],
				"amounts": ["many"]
			},
			{
				"func": addAnimals,
				"avoid": [
					g_TileClasses.animals, 10,
					g_TileClasses.forest, 1,
					g_TileClasses.metal, 2,
					g_TileClasses.mountain, 1,
					g_TileClasses.player, 15,
					g_TileClasses.rock, 2,
					g_TileClasses.water, 3
				],
				"stay": [zone.tileClass, 0],
				"sizes": ["normal"],
				"mixes": ["normal"],
				"amounts": ["many"]
			},
			{
				"func": addAnimals,
				"avoid": [
					g_TileClasses.animals, 10,
					g_TileClasses.forest, 1,
					g_TileClasses.metal, 2,
					g_TileClasses.mountain, 1,
					g_TileClasses.player, 15,
					g_TileClasses.rock, 2,
					g_TileClasses.water, 1
				],
				"stay": [zone.tileClass, 0],
				"sizes": ["small"],
				"mixes": ["normal"],
				"amounts": ["tons"]
			},
			{
				"func": addStragglerTrees,
				"avoid": [
					g_TileClasses.berries, 5,
					g_TileClasses.forest, 5,
					g_TileClasses.metal, 2,
					g_TileClasses.mountain, 1,
					g_TileClasses.player, 12,
					g_TileClasses.rock, 2,
					g_TileClasses.water, 3
				],
				"stay": [zone.tileClass, 0],
				"sizes": ["normal"],
				"mixes": ["normal"],
				"amounts": ["some"]
			},
			{
				"func": addLayeredPatches,
				"avoid": [
					g_TileClasses.dirt, 5,
					g_TileClasses.forest, 2,
					g_TileClasses.mountain, 2,
					g_TileClasses.player, 12,
					g_TileClasses.water, 3
				],
				"stay": [zone.tileClass, 0],
				"sizes": ["normal"],
				"mixes": ["normal"],
				"amounts": ["tons"]
			},
			{
				"func": addDecoration,
				"avoid": [
					g_TileClasses.forest, 2,
					g_TileClasses.mountain, 2,
					g_TileClasses.player, 12,
					g_TileClasses.water, 4
				],
				"stay": [zone.tileClass, 0],
				"sizes": ["small"],
				"mixes": ["same"],
				"amounts": ["tons"]
			}
		]);
	}
	yield 60;

	g_Map.log("Painting water");
	createArea(
		new MapBoundsPlacer(),
		new TerrainPainter(tWater),
		new HeightConstraint(-Infinity, heightWaterLevel));

	
	g_Map.log("Painting snow on mountains");
	createArea(
		new MapBoundsPlacer(),
		new TerrainPainter(tSnowedRocks),
		[
			new HeightConstraint(heightSnow, Infinity),
			avoidClasses(
				g_TileClasses.player, 6)
		]);
	
	yield 70;
	

	g_Map.log("Placing fish");
	g_Gaia.fish = "gaia/fish/generic";
	addElements([
		{
			"func": addFish,
			"avoid": [
				g_TileClasses.fish, 10,
			],
			"stay": [g_TileClasses.water, 4],
			"sizes": ["normal"],
			"mixes": ["similar"],
			"amounts": ["many"]
		}
	]);
	yield 85;

	g_Map.log("Placing whale");
	g_Gaia.fish = "gaia/fauna_whale_fin";
	addElements([
		{
			"func": addFish,
			"avoid": [
				g_TileClasses.fish, 15,
			],
			"stay": [g_TileClasses.water, 7],
			"sizes": ["small"],
			"mixes": ["same"],
			"amounts": ["scarce"]
		}
	]);
	yield 95;
	
	
	placePlayersNomad(
		g_Map.createTileClass(),
		[
			stayClasses(g_TileClasses.land, 5),
			avoidClasses(
				g_TileClasses.forest, 2,
				g_TileClasses.rock, 4,
				g_TileClasses.metal, 4,
				g_TileClasses.berries, 2,
				g_TileClasses.animals, 2,
				g_TileClasses.mountain, 2)
		]);


	setWindAngle(-0.589049);
	setWaterTint(0.556863, 0.615686, 0.643137);
	setWaterColor(0.494118, 0.639216, 0.713726);
	setWaterWaviness(8);
	setWaterMurkiness(0.87);
	setWaterType("ocean");

	setAmbientColor(0.72, 0.72, 0.82);

	setSunColor(0.733, 0.746, 0.574);
	setSunRotation(Math.PI * 0.95);
	setSunElevation(Math.PI / 6);

	setSkySet("cumulus");
	setFogFactor(0);
	setFogThickness(0);
	setFogColor(0.69, 0.616, 0.541);

	setPPEffect("hdr");
	setPPContrast(0.67);
	setPPSaturation(0.42);
	setPPBloom(0.23);

	return g_Map;
}
