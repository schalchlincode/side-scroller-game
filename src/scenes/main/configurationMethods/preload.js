import mainSceneState from "../mainSceneState";

const keys = mainSceneState.CONSTANTS.KEYS;

export default (phaser) => {
  /**
   * Load assets into Phaser - loaded assets are still unused until the create method adds them into phaser
   */

  // Player Sprite
  phaser.load.spritesheet(
    keys.SPRITES.PLAYER,
    "src/assets/images/wizard_run.png",
    { frameWidth: 64, frameHeight: 64 } // Adjust this based on your sprite size
  );

  // Tiled map JSON file
  phaser.load.tilemapTiledJSON(keys.TILED.MAP, "src/assets/tiles/map.json"); 

  // The first tileset defined in the Tilemap JSON file
  phaser.load.image(keys.IMAGES.TILES, "src/assets/tiles/Tiles.png");

  // The second tileset defined in the Tilemap JSON file
  phaser.load.image(
    keys.IMAGES.BUILDING_TILES,
    "src/assets/tiles/building_tilemap.png"
  );

  // Items
  phaser.load.image(
    keys.IMAGES.STUFFED_PEANUT,
    "src/assets/images/stuffedPeanut.png"
  );
};
