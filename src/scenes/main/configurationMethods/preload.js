import mainSceneState from "../mainSceneState";

const keys = mainSceneState.CONSTANTS.KEYS;

export default (phaser) => {
  phaser.load.spritesheet(
    keys.SPRITES.PLAYER,
    "src/assets/images/wizard_run.png",
    {
      frameWidth: 64, // Adjust this based on your sprite size
      frameHeight: 64,
    }
  );

  // Load assets into Phaser - loaded assets are still unused
  // The first argument passed to load methods are the identifiers used later to 'add' them to the game
  phaser.load.tilemapTiledJSON(keys.TILE_MAP, "src/assets/tiles/map.json"); // Tilemap JSON file
  // The first tileset defined in the Tilemap JSON file
  phaser.load.image(keys.IMAGES.TILES, "src/assets/tiles/Tiles.png");
  // The second tileset defined in the Tilemap JSON file
  phaser.load.image(
    keys.IMAGES.BUILDING_TILES,
    "src/assets/tiles/building_tilemap.png"
  );
  phaser.load.image(
    keys.IMAGES.STUFFED_PEANUT,
    "src/assets/images/stuffedPeanut.png"
  );
};
