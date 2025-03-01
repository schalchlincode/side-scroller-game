import * as Phaser from "phaser";
import gameState from "./state/gameState";
import gameEntities from "./entities/gameEntities";
import events from "./events/events";
import animations from "./animations/animations";
import UI from "./UI/UI";

const DEPTHS = {
  Background: 0,
  Foreground: 1,
  UIBackground: 10,
  UIForeground: 11,
};

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  scene: {
    preload,
    create,
    update,
  },
};

// TODO - try replacing all instances of 'this' with the game variable
const game = new Phaser.Game(config);

function preload() {
  // Objects that will be bound to 'this' - which opaquely refers to the phaser library
  this.gameState = gameState;
  this.gameEntities = gameEntities;
  this.UI = UI;

  console.log("Wizard sprite is loading...");
  this.load.spritesheet("player", "src/assets/images/wizard_run.png", {
    frameWidth: 64, // Adjust this based on your sprite size
    frameHeight: 64,
  });

  // Load assets into Phaser - loaded assets are still unused
  // The first argument passed to load methods are the identifiers used later to 'add' them to the game
  this.load.tilemapTiledJSON("map", "src/assets/tiles/map.json"); // Tilemap JSON file
  this.load.image("tiles", "src/assets/tiles/Tiles.png"); // The first tileset defined in the Tilemap JSON file
  this.load.image("buildingTiles", "src/assets/tiles/building_tilemap.png"); // The second tileset defined in the Tilemap JSON file
  this.load.image("stuffedPeanut", "src/assets/images/stuffedPeanut.png");
}

function create() {
  createMap.call(this);
  createEntities.call(this);
  createInventoryUI.call(this);

  // Enable keyboard input
  this.cursors = this.input.keyboard.createCursorKeys();
  this.toggleInventoryKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.I
  );
}

function update() {
  this.gameEntities.player.setVelocity(0); // Stop movement when no keys are pressed

  // Toggle inventory visibility when "I" is pressed
  if (Phaser.Input.Keyboard.JustDown(this.toggleInventoryKey)) {
    this.gameState.inventoryVisible = !this.gameState.inventoryVisible;

    // Toggle visibility for inventory UI elements
    this.UI.inventory.background.setVisible(this.gameState.inventoryVisible);
    this.UI.inventory.text.setVisible(this.gameState.inventoryVisible);

    // TODO - I don't think this works?
    // Ensure all item icons follow visibility state
    if (this.inventoryIcons) {
      this.inventoryIcons.forEach((icon) => {
        icon.setVisible(this.gameState.inventoryVisible);
      });
    }
  }

  if (this.cursors.left.isDown && this.cursors.up.isDown) {
    this.gameEntities.player.setVelocity(-200, -200);
    this.gameEntities.player.anims.play("walk-up-left", true);
    return;
  } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
    this.gameEntities.player.setVelocity(200, -200);
    this.gameEntities.player.anims.play("walk-up-right", true);
    return;
  } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
    this.gameEntities.player.setVelocity(-200, 200);
    this.gameEntities.player.anims.play("walk-down-left", true);
    return;
  } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
    this.gameEntities.player.setVelocity(200, 200);
    this.gameEntities.player.anims.play("walk-down-right", true);
    return;
  }

  // Regular movement
  if (this.cursors.left.isDown) {
    this.gameEntities.player.setVelocityX(-200);
    this.gameEntities.player.anims.play("walk-left", true);
  } else if (this.cursors.right.isDown) {
    this.gameEntities.player.setVelocityX(200);
    this.gameEntities.player.anims.play("walk-right", true);
  } else if (this.cursors.up.isDown) {
    this.gameEntities.player.setVelocityY(-200);
    this.gameEntities.player.anims.play("walk-up", true);
  } else if (this.cursors.down.isDown) {
    this.gameEntities.player.setVelocityY(200);
    this.gameEntities.player.anims.play("walk-down", true);
  } else {
    this.gameEntities.player.anims.stop();
  }
}

function createMap() {
  // Creates the tilemap from the previously loaded JSON
  const map = this.make.tilemap({ key: "map" });
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
  backgroundLayer.setDepth(DEPTHS.Background); // Ensure it's the lowest layer
  // Load the Buildings layer
  const buildingsLayer = map.createLayer(
    "Buildings", // Layer name from Tiled
    buildingTileset,
    0,
    0
  );
  buildingsLayer.setDepth(DEPTHS.Foreground); // Ensure it's above the background
  console.log("Map loaded:", map);
  console.log("Background Layer:", backgroundLayer);
  console.log("Building Layer:", buildingsLayer);
}

function createEntities() {
  // Load at coordinates (100, 100) and force frame 0 of the sprite
  this.gameEntities.player = this.physics.add.sprite(100, 100, "player", 0);
  this.gameEntities.player.setCollideWorldBounds(true); // Prevents leaving the screen
  this.gameEntities.player.setDepth(DEPTHS.Foreground); // Ensures the player appears above the background layer
  animations.configurePlayerAnimations(this);
  console.log("Player sprite created:", this.gameEntities.player);
  console.log("Loaded frames:", this.textures.get("player").getFrameNames());

  this.gameEntities.items = this.physics.add.group(); // Create a group for items
  const peanut = this.gameEntities.items.create(150, 150, "stuffedPeanut"); // Spawn peanut at (150,150)
  peanut.setScale(2);
  peanut.setDepth(DEPTHS.Foreground); // Ensure it’s above the background

  // Define what happens when a player overlaps with an item, with the collectItem function
  this.physics.add.overlap(
    this.gameEntities.player,
    this.gameEntities.items,
    events.collectItem,
    null,
    this
  );
}

function createInventoryUI() {
  // Background panel
  this.UI.inventory.background = this.add.rectangle(
    100,
    100,
    300,
    200,
    0x000000,
    0.7
  ); // Semi-transparent black box
  this.UI.inventory.background.setOrigin(0, 0);
  this.UI.inventory.background.setDepth(DEPTHS.UIBackground);
  this.UI.inventory.background.setVisible(false); // Hide by default

  // Inventory text
  this.UI.inventory.text = this.add.text(110, 110, "Inventory:", {
    fontSize: "20px",
    fill: "#fff",
  });
  this.UI.inventory.text.setDepth(DEPTHS.UIForeground);
  this.UI.inventory.text.setVisible(false);
}
