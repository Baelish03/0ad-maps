/**
 * Heightmap image source:
 * https://tangrams.github.io/heightmapper/#8.807/40.2708/17.9344
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
	setBiome("generic/aegean");

	const heightScale = num => num * mapSettings.Size / 320;

	const heightSeaGround = heightScale(-6);
	const heightWaterLevel = heightScale(0);
	const heightShoreline = heightScale(1);
	const heightSnow = heightScale(64);

	globalThis.g_Map = new RandomMap(heightWaterLevel, g_Terrains.mainTerrain);
	const mapSize = g_Map.getSize();
	const mapCenter = g_Map.getCenter();
	const mapBounds = g_Map.getBounds();

	g_Map.LoadHeightmapImage("calabria.png", 0, 64);
	yield 15;

	initTileClasses([
		"medit",
		"shoreline",
		"southern_europe",
	]);

	const climateZones = [
		{
			"tileClass": g_TileClasses.southern_europe,
			"position1": new Vector2D(mapBounds.left, mapBounds.bottom),
			"position2": new Vector2D(mapBounds.right, mapBounds.top),
			"biome": "generic/aegean",
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

	g_Map.log("Placing olive trees");
	const num = scaleByMapSize(30, 120);
	createObjectGroups(
		new SimpleGroup(
			[new SimpleObject("gaia/tree/olive", 2, 5, 1, 4)],
			true,
			g_TileClasses.forest
		),
		0,
		[
			stayClasses(g_TileClasses.southern_europe, 0),
			avoidClasses(
				g_TileClasses.forest, 4,
				g_TileClasses.mountain, 2,
				g_TileClasses.player, 12,
				g_TileClasses.water, 3
			)
		],
		num
	);

	g_Map.log("Placing wolves");
	createObjectGroups(
		new SimpleGroup(
			[new SimpleObject("gaia/fauna_wolf", 1, 2, 2, 4)],
			true,
			g_TileClasses.animals
		),
		0,
		[
			stayClasses(g_TileClasses.southern_europe, 0),
			avoidClasses(
				g_TileClasses.animals, 8,
				g_TileClasses.mountain, 1,
				g_TileClasses.player, 20,
				g_TileClasses.water, 3
			)
		],
		scaleByMapSize(4, 12)
	);
	yield 50;

	if (!mapSettings.Nomad) {
		g_Map.log("Finding player positions");

		const { playerIDs, playerPosition } = playerPlacementRandom(
			sortAllPlayers(),
			[
				avoidClasses(g_TileClasses.mountain, 5),
				stayClasses(g_TileClasses.land, scaleByMapSize(8, 25))
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
				"amounts": ["normal"]
			}
		]);
	}
	yield 60;

	g_Map.log("Painting water");
	createArea(
		new MapBoundsPlacer(),
		new TerrainPainter(tWater),
		new HeightConstraint(-Infinity, heightWaterLevel));
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
