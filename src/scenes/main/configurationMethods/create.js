import mainSceneState from "../mainSceneState";
import playerAnimations from "../../../animations/playerAnimations";
import * as Phaser from "phaser";

function createMap(phaser) {
  // Creates the tilemap from the JSON loaded in preload
  const map = phaser.make.tilemap({ key: "map" });
  // The first argument is the name of the tileset in the map file
  // The second argument is the identifier used in the preload function to load the file into phaser
  // Essentially we are linking information about the tileset from the map file to the loaded asset
  const ground = map.addTilesetImage("Tiles", "tiles");
  const buildingTileset = map.addTilesetImage(
    "building_tilemap",
    "buildingTiles"
  );
  // Load the background layer
  const backgroundLayer = map.createLayer(
    "Tile Layer 1", // Layer name from Tiled
    ground,
    0,
    0
  );
  backgroundLayer.setDepth(mainSceneState.CONSTANTS.DEPTHS.Background); // Ensure it's the lowest layer
  // Load the Buildings layer
  const buildingsLayer = map.createLayer(
    "Buildings", // Layer name from Tiled
    buildingTileset,
    0,
    0
  );
  buildingsLayer.setDepth(mainSceneState.CONSTANTS.DEPTHS.Foreground); // Ensure it's above the background
}

function createEntities(phaser) {
  // Load at coordinates (100, 100) and force frame 0 of the sprite
  mainSceneState.entities.player = phaser.physics.add.sprite(
    100,
    100,
    "player",
    0
  );
  mainSceneState.entities.player.setCollideWorldBounds(true); // Prevents leaving the screen
  mainSceneState.entities.player.setDepth(
    mainSceneState.CONSTANTS.DEPTHS.Foreground
  ); // Ensures the player appears above the background layer
  playerAnimations.configure(phaser);

  mainSceneState.entities.items = phaser.physics.add.group(); // Create a group for items
  const peanut = mainSceneState.entities.items.create(
    150,
    150,
    "stuffedPeanut"
  ); // Spawn peanut at (150,150)
  peanut.setScale(2);
  peanut.setDepth(mainSceneState.CONSTANTS.DEPTHS.Foreground); // Ensure it’s above the background

  // Define what happens when a player overlaps with an item, with the collectItem function
  phaser.physics.add.overlap(
    mainSceneState.entities.player,
    mainSceneState.entities.items,
    mainSceneState.events.collectItem
  );
}

function createInventoryUI(phaser) {
  // Background panel
  mainSceneState.ui.inventory.background = phaser.add.rectangle(
    100,
    100,
    300,
    200,
    0x000000,
    0.7
  ); // Semi-transparent black box
  mainSceneState.ui.inventory.background.setOrigin(0, 0);
  mainSceneState.ui.inventory.background.setDepth(
    mainSceneState.CONSTANTS.DEPTHS.UIBackground
  );
  mainSceneState.ui.inventory.background.setVisible(false); // Hide by default

  // Inventory text
  mainSceneState.ui.inventory.text = phaser.add.text(110, 110, "Inventory:", {
    fontSize: "20px",
    fill: "#fff",
  });
  mainSceneState.ui.inventory.text.setDepth(
    mainSceneState.CONSTANTS.DEPTHS.UIForeground
  );
  mainSceneState.ui.inventory.text.setVisible(false);
}

export default (phaser) => {
  createMap(phaser);
  createEntities(phaser);
  createInventoryUI(phaser);

  mainSceneState.inputs.cursors = phaser.input.keyboard.createCursorKeys();
  mainSceneState.inputs.toggleInventory = phaser.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.I
  );
};
