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

	const heightSeaGround = heightScale(-5);
	const heightWaterLevel = heightScale(2);
	const heightShoreline = heightScale(2);
	const heightSnow = heightScale(135);

	globalThis.g_Map = new RandomMap(heightWaterLevel, g_Terrains.mainTerrain);
	const mapSize = g_Map.getSize();
	const mapCenter = g_Map.getCenter();
	const mapBounds = g_Map.getBounds();

	g_Map.LoadHeightmapImage("tamriel.png", -15, 200);
	yield 15;

	initTileClasses([
		"shoreline",

		"all",

		"NorthSkyrim",
		"SouthSkyrim",
		"NorthHighRock",
		"SouthHighRock",
		"Hammerfell",
		"WestCyrodiil",
		"EastCyrodiil",
		"Summerset_Valenwood_Argonia_SouthElsweyr",
		"Elsweyr",
		"Cyrodiil_Morrowind_mountains",
		"NorthVvardenfell",
		"CenterVvardenfell",
		"WestMorrowind",
		"EastMorrowind",
		"NorthMorrowind",
		"Argonia_Morrowind"
	]);

	const NorthSkyrimTL = new Vector2D(fractionToTiles(.35), mapBounds.top);
	const NorthSkyrimBR = new Vector2D(fractionToTiles(.73), fractionToTiles(.6));

	const SouthSkyrimTL = new Vector2D(fractionToTiles(.3), NorthSkyrimBR.y);
	const SouthSkyrimBR = new Vector2D(fractionToTiles(.67), fractionToTiles(.5));

	const NorthHighRockTL = new Vector2D(mapBounds.left, mapBounds.top);
	const NorthHighRockBR = new Vector2D(NorthSkyrimTL.x, fractionToTiles(.7));

	const SouthHighRockTL = new Vector2D(mapBounds.left, NorthHighRockBR.y);
	const SouthHighRockBR = new Vector2D(NorthSkyrimTL.x, fractionToTiles(.6));

	const HammerfellTL = new Vector2D(mapBounds.left, SouthHighRockBR.y);
	const HammerfellBR = new Vector2D(SouthSkyrimTL.x, fractionToTiles(.4));

	const WestCyrodiilTL = new Vector2D(SouthSkyrimTL.x, SouthSkyrimBR.y);
	const WestCyrodiilBR = new Vector2D(fractionToTiles(.45), fractionToTiles(.4));

	const EastCyrodiilTL = new Vector2D(WestCyrodiilBR.x, SouthSkyrimBR.y);
	const EastCyrodiilBR = new Vector2D(SouthSkyrimBR.x, WestCyrodiilBR.y);

	const Summerset_Valenwood_Argonia_SouthElsweyrTL = new Vector2D(mapBounds.left, HammerfellBR.y);
	const Summerset_Valenwood_Argonia_SouthElsweyrBR = new Vector2D(mapBounds.right, mapBounds.bottom);

	const ElsweyrTL = new Vector2D(fractionToTiles(.45), WestCyrodiilBR.y);
	const ElsweyrBR = new Vector2D(fractionToTiles(.55), fractionToTiles(.25));

	const Cyrodiil_Morrowind_mountainsTL = new Vector2D(SouthSkyrimBR.x, NorthSkyrimBR.y);
	const Cyrodiil_Morrowind_mountainsBR = new Vector2D(NorthSkyrimBR.x, Summerset_Valenwood_Argonia_SouthElsweyrTL.y);

	const NorthVvardenfellTL = new Vector2D(NorthSkyrimBR.x, mapBounds.top);
	const NorthVvardenfellBR = new Vector2D(mapBounds.right, fractionToTiles(.75));

	const CenterVvardenfellTL = new Vector2D(NorthSkyrimBR.x, NorthVvardenfellBR.y);
	const CenterVvardenfellBR = new Vector2D(fractionToTiles(.85), fractionToTiles(.6));

	const WestMorrowindTL = new Vector2D(NorthSkyrimBR.x, CenterVvardenfellBR.y);
	const WestMorrowindBR = new Vector2D(fractionToTiles(.8), fractionToTiles(.45));

	const EastMorrowindTL = new Vector2D(WestMorrowindBR.x, CenterVvardenfellBR.y);
	const EastMorrowindBR = new Vector2D(mapBounds.right, Summerset_Valenwood_Argonia_SouthElsweyrTL.y);

	const NorthMorrowindTL = new Vector2D(CenterVvardenfellBR.x, NorthVvardenfellBR.y);
	const NorthMorrowindBR = new Vector2D(mapBounds.right, EastMorrowindTL.y);

	const Argonia_MorrowindTL = new Vector2D(NorthSkyrimBR.x, WestMorrowindBR.y);
	const Argonia_MorrowindBR = new Vector2D(mapBounds.right, Summerset_Valenwood_Argonia_SouthElsweyrTL.y);

	const climateZones = [
		{
			"tileClass": g_TileClasses.NorthSkyrim,
			"position1": NorthSkyrimTL,
			"position2": NorthSkyrimBR,
			"biome": "generic/arctic",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.SouthSkyrim,
			"position1": SouthSkyrimTL,
			"position2": SouthSkyrimBR,
			"biome": "generic/alpine",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.NorthHighRock,
			"position1": NorthHighRockTL,
			"position2": NorthHighRockBR,
			"biome": "generic/alpine",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.SouthHighRock,
			"position1": SouthHighRockTL,
			"position2": SouthHighRockBR,
			"biome": "generic/temperate",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Hammerfell,
			"position1": HammerfellTL,
			"position2": HammerfellBR,
			"biome": "generic/sahara",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.WestCyrodiil,
			"position1": WestCyrodiilTL,
			"position2": WestCyrodiilBR,
			"biome": "generic/aegean",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.EastCyrodiil,
			"position1": EastCyrodiilTL,
			"position2": EastCyrodiilBR,
			"biome": "generic/temperate",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Summerset_Valenwood_Argonia_SouthElsweyr,
			"position1": Summerset_Valenwood_Argonia_SouthElsweyrTL,
			"position2": Summerset_Valenwood_Argonia_SouthElsweyrBR,
			"biome": "generic/india",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Elsweyr,
			"position1": ElsweyrTL,
			"position2": ElsweyrBR,
			"biome": "generic/sahara",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Cyrodiil_Morrowind_mountains,
			"position1": Cyrodiil_Morrowind_mountainsTL,
			"position2": Cyrodiil_Morrowind_mountainsBR,
			"biome": "generic/alpine",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.NorthVvardenfell,
			"position1": NorthVvardenfellTL,
			"position2": NorthVvardenfellBR,
			"biome": "generic/arctic",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.CenterVvardenfell,
			"position1": CenterVvardenfellTL,
			"position2": CenterVvardenfellBR,
			"biome": "generic/arctic",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.WestMorrowind,
			"position1": WestMorrowindTL,
			"position2": WestMorrowindBR,
			"biome": "generic/sahara",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.EastMorrowind,
			"position1": EastMorrowindTL,
			"position2": EastMorrowindBR,
			"biome": "generic/temperate",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.NorthMorrowind,
			"position1": NorthMorrowindTL,
			"position2": NorthMorrowindBR,
			"biome": "generic/temperate",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Argonia_Morrowind,
			"position1": Argonia_MorrowindTL,
			"position2": Argonia_MorrowindBR,
			"biome": "generic/temperate",
			"constraint": new NullConstraint()
		}
	];

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

	g_Map.log("Carving Elsweyr out of the India zone");
	createArea(
		new RectPlacer(ElsweyrTL, ElsweyrBR, Infinity),
		new TileClassUnPainter(g_TileClasses.Summerset_Valenwood_Argonia_SouthElsweyr)
	);
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


	if (!mapSettings.Nomad) {
		g_Map.log("Finding player positions");

		const { playerIDs, playerPosition } = playerPlacementRandom(
			sortAllPlayers(),
			[
				avoidClasses(g_TileClasses.mountain, 3),
				stayClasses(g_TileClasses.land, scaleByMapSize(1, 15))
			]);

		g_Map.log("Flatten the initial CC area and placing playerbases");
		for (let i = 0; i < getNumPlayers(); ++i) {
			g_Map.logger.printDuration();


			const zone = climateZones.find(zone => zone.tileClass.has(playerPosition[i]));
			setBiome(zone ? zone.biome : "generic/temperate"); // fallback
			
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
			stayClasses(g_TileClasses.land, 15),
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
