import mainSceneState from "../mainSceneState";

export default (phaser) => {
  phaser.load.spritesheet("player", "src/assets/images/wizard_run.png", {
    frameWidth: 64, // Adjust this based on your sprite size
    frameHeight: 64,
  });

  // Load assets into Phaser - loaded assets are still unused
  // The first argument passed to load methods are the identifiers used later to 'add' them to the game
  phaser.load.tilemapTiledJSON("map", "src/assets/tiles/map.json"); // Tilemap JSON file
  phaser.load.image("tiles", "src/assets/tiles/Tiles.png"); // The first tileset defined in the Tilemap JSON file
  phaser.load.image("buildingTiles", "src/assets/tiles/building_tilemap.png"); // The second tileset defined in the Tilemap JSON file
  phaser.load.image("stuffedPeanut", "src/assets/images/stuffedPeanut.png");
};
