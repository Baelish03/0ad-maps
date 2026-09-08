/**
 * Heightmap image source:
 * https://tangrams.github.io/heightmapper/#2.92176/51.28/-99.37
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

	const tSnowedRocks = ["alpine_rock_02_snow", "path a"];
	const tWater = ["sand_wet_a", "sand_wet_b"];
	setBiome("generic/temperate");

	const heightScale = num => num * mapSettings.Size / 320;

	const heightSeaGround = heightScale(-6);
	const heightWaterLevel = heightScale(0);
	const heightShoreline = heightScale(1);
	const heightSnow = heightScale(30);

	globalThis.g_Map = new RandomMap(heightWaterLevel, g_Terrains.mainTerrain);
	const mapSize = g_Map.getSize();
	const mapCenter = g_Map.getCenter();
	const mapBounds = g_Map.getBounds();

	g_Map.LoadHeightmapImage("north_america_random.png", 0, 48);
	yield 15;

	initTileClasses([
		"shoreline",
		"Caribbean",
		"NorthCalifornia",
		"Mojave",
		"SouthLouisiana", // I mean Lousiana in 1800
		"EastCoast",
		"Oregon",
		"NorthLouisiana",
		"Quebec",
		"Taiga",
		"Tundra",
		"NorthEast"
	]);

	const CaribbeanLT = new Vector2D(mapBounds.left, fractionToTiles(1-850/1024));
	const CaribbeanRB = new Vector2D(mapBounds.right, mapBounds.bottom);

	const NorthCaliforniaLT = new Vector2D(mapBounds.left, fractionToTiles(1-660/1024));
	const NorthCaliforniaRB = new Vector2D(fractionToTiles(315/1024), CaribbeanLT.y);

	const MojaveLT = new Vector2D(NorthCaliforniaRB.x, fractionToTiles(1-575/1024));
	const MojaveRB = new Vector2D(fractionToTiles(455/1024), CaribbeanLT.y);

	const SouthLouisianaLT = new Vector2D(MojaveRB.x, MojaveLT.y);
	const SouthLouisianaRB = new Vector2D(fractionToTiles(560/1024), CaribbeanLT.y);
	
	const EastCoastLT = new Vector2D(SouthLouisianaRB.x, SouthLouisianaLT.y);
	const EastCoastRB = new Vector2D(mapBounds.right, CaribbeanLT.y);

	const OregonLT = new Vector2D(mapBounds.left, fractionToTiles(1-420/1024));
	const OregonRB = new Vector2D(NorthCaliforniaRB.x, NorthCaliforniaLT.y);

	const NorthLouisianaLT = new Vector2D(NorthCaliforniaRB.x, OregonLT.y);
	const NorthLouisianaRB = new Vector2D(fractionToTiles(520/1024), MojaveLT.y);

	const QuebecLT = new Vector2D(NorthCaliforniaRB.x, OregonLT.y);
	const QuebecRB = new Vector2D(mapBounds.right, SouthLouisianaLT.y);	

	const TaigaLT = new Vector2D(mapBounds.left, fractionToTiles(1-212/1024));
	const TaigaRB = new Vector2D(mapBounds.right, OregonLT.y);

	const TundraLT = new Vector2D(mapBounds.left, mapBounds.top);
	const TundraRB = new Vector2D(mapBounds.right, TaigaLT.y);

	const NorthEastLT = new Vector2D(fractionToTiles(488/1024), TaigaLT.y);
	const NorthEastRB = new Vector2D(mapBounds.right, fractionToTiles(1-325/1024));


	const climateZones = [
		{
			"tileClass": g_TileClasses.Caribbean,
			"position1": CaribbeanLT,
			"position2": CaribbeanRB,
			"biome": "generic/tropical",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.NorthCalifornia,
			"position1": NorthCaliforniaLT,
			"position2": NorthCaliforniaRB,
			"biome": "generic/mediterranean",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Mojave,
			"position1": MojaveLT,
			"position2": MojaveRB,
			"biome": "generic/sahara",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.SouthLouisiana,
			"position1": SouthLouisianaLT,
			"position2": SouthLouisianaRB,
			"biome": "generic/steppe",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.EastCoast,
			"position1": EastCoastLT,
			"position2": EastCoastRB,
			"biome": "generic/temperate",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Oregon,
			"position1": OregonLT,
			"position2": OregonRB,
			"biome": "generic/autumn",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.NorthLouisiana,
			"position1": NorthLouisianaLT,
			"position2": NorthLouisianaRB,
			"biome": "generic/steppe",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Quebec,
			"position1": QuebecLT,
			"position2": QuebecRB,
			"biome": "generic/autumn",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Taiga,
			"position1": TaigaLT,
			"position2": TaigaRB,
			"biome": "generic/taiga",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Tundra,
			"position1": TundraLT,
			"position2": TundraRB,
			"biome": "generic/tundra",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.NorthEast,
			"position1": NorthEastLT,
			"position2": NorthEastRB,
			"biome": "generic/tundra",
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
				avoidClasses(g_TileClasses.mountain, 5),
				stayClasses(g_TileClasses.land, scaleByMapSize(5, 35))
			]);

		g_Map.log("Flatten the initial CC area and placing playerbases");
		for (let i = 0; i < getNumPlayers(); ++i) {
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
					g_TileClasses.forest, 10,
					g_TileClasses.metal, 3,
					g_TileClasses.mountain, 1,
					g_TileClasses.player, 12,
					g_TileClasses.rock, 2,
					g_TileClasses.water, 2
				],
				"stay": [zone.tileClass, 0],
				"sizes": ["normal"],
				"mixes": ["normal"],
				"amounts": ["tons", "tons", "few", "normal", "tons", "tons", "normal", "tons", "tons", "few", "few"]
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
				"amounts": ["normal"]
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
				"amounts": ["many"]
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
				"amounts": ["few"]
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
	yield 70;

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
	yield 80;

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
	yield 90;

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

	setWindAngle(-Math.PI / 2);
	setWaterTint(0.28125, 0.69921875, 0.87890625);
	setWaterColor(0.140625, 0.3203125, 0.6171875);
	setWaterWaviness(6);
	setWaterMurkiness(0.87);
	setWaterType("ocean");

	setAmbientColor(0.447059, 0.509804, 0.54902);

	setSunColor(0.784314, 0.764706, 0.682353);
	setSunRotation(-Math.PI / 2);
	setSunElevation(Math.PI * 0.75);

	setSkySet("cumulus");
	setFogFactor(0);
	setFogThickness(0);
	setFogColor(0.8, 0.8, 0.898039);

	setPPEffect("hdr");
	setPPContrast(0.75);
	setPPSaturation(0.75);
	setPPBloom(0.1);

	return g_Map;
}
