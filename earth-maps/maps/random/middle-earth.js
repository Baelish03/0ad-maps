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
	const heightWaterLevel = heightScale(2);
	const heightShoreline = heightScale(2);
	const heightSnow = heightScale(35);

	globalThis.g_Map = new RandomMap(heightWaterLevel, g_Terrains.mainTerrain);
	const mapSize = g_Map.getSize();
	const mapCenter = g_Map.getCenter();
	const mapBounds = g_Map.getBounds();

	g_Map.LoadHeightmapImage("middle-earth.png", -40, 55);
	yield 15;

	initTileClasses([
		"shoreline",

		"Forodwaith",
		"Angmar",
		"Contea",
		"Contea_Lorien",
		"Lorien",
		"Rhun",
		"Rohan",
		"Gondor",
		"Mordor",
		"EstMordor",
		"NordHarad",
		"Harad"
	]);

	const ForodwaithLT = new Vector2D(mapBounds.left, mapBounds.top);
	const ForodwaithRB = new Vector2D(mapBounds.right, fractionToTiles(1 - .125));

	const AngmarLT = new Vector2D(mapBounds.left, ForodwaithRB.y);
	const AngmarRB = new Vector2D(mapBounds.right, fractionToTiles(1 - .2));

	const ConteaLT = new Vector2D(mapBounds.left, AngmarRB.y);
	const ConteaRB = new Vector2D(fractionToTiles(.39), fractionToTiles(1 - .537));

	const Contea_LorienLT = new Vector2D(ConteaRB.x, AngmarRB.y);
	const Contea_LorienRB = new Vector2D(fractionToTiles(.464), ConteaRB.y);

	const LorienLT = new Vector2D(Contea_LorienRB.x, AngmarRB.y);
	const LorienRB = new Vector2D(fractionToTiles(.707), fractionToTiles(1 - .388));

	const RhunLT = new Vector2D(LorienRB.x, AngmarRB.y);
	const RhunRB = new Vector2D(mapBounds.right, LorienRB.y);

	const RohanLT = new Vector2D(Contea_LorienRB.x, LorienRB.y);
	const RohanRB = new Vector2D(mapBounds.right, Contea_LorienRB.y);

	const GondorLT = new Vector2D(mapBounds.left, ConteaRB.y);
	const GondorRB = new Vector2D(fractionToTiles(.591), fractionToTiles(1 - .725));

	const MordorLT = new Vector2D(GondorRB.x, ConteaRB.y);
	const MordorRB = new Vector2D(fractionToTiles(.847), GondorRB.y);

	const EstMordorLT = new Vector2D(MordorRB.x, ConteaRB.y);
	const EstMordorRB = new Vector2D(mapBounds.right, GondorRB.y);

	const NordHaradLT = new Vector2D(mapBounds.left, GondorRB.y);
	const NordHaradRB = new Vector2D(mapBounds.right, fractionToTiles(1 - .88));

	const HaradLT = new Vector2D(mapBounds.left, NordHaradRB.y);
	const HaradRB = new Vector2D(mapBounds.right, mapBounds.bottom);


	const climateZones = [
		{
			"tileClass": g_TileClasses.Forodwaith,
			"position1": ForodwaithLT,
			"position2": ForodwaithRB,
			"biome": "generic/arctic",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Angmar,
			"position1": AngmarLT,
			"position2": AngmarRB,
			"biome": "generic/alpine",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Contea,
			"position1": ConteaLT,
			"position2": ConteaRB,
			"biome": "generic/temperate",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Contea_Lorien,
			"position1": Contea_LorienLT,
			"position2": Contea_LorienRB,
			"biome": "generic/alpine",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Lorien,
			"position1": LorienLT,
			"position2": LorienRB,
			"biome": "generic/temperate",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Rhun,
			"position1": RhunLT,
			"position2": RhunRB,
			"biome": "generic/steppe",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Rohan,
			"position1": RohanLT,
			"position2": RohanRB,
			"biome": "generic/steppe",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Gondor,
			"position1": GondorLT,
			"position2": GondorRB,
			"biome": "generic/aegean",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Mordor,
			"position1": MordorLT,
			"position2": MordorRB,
			"biome": "generic/sahara",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.EstMordor,
			"position1": EstMordorLT,
			"position2": EstMordorRB,
			"biome": "generic/steppe",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.NordHarad,
			"position1": NordHaradLT,
			"position2": NordHaradRB,
			"biome": "generic/steppe",
			"constraint": new NullConstraint()
		},
		{
			"tileClass": g_TileClasses.Harad,
			"position1": HaradLT,
			"position2": HaradRB,
			"biome": "generic/sahara",
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
				avoidClasses(g_TileClasses.mountain, 10),
				stayClasses(g_TileClasses.land, scaleByMapSize(10, 25))
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
