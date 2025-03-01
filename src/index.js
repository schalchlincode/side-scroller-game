import * as Phaser from "phaser";
import animations from "./animations/animations";
import Game from "./Game";

const game = Game();

function preload() {
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
  createMap(this);
  createEntities(this);
  createInventoryUI(this);

  // Enable keyboard input
  game.inputs.cursors = this.input.keyboard.createCursorKeys();
  // TODO - consolidate keymap
  game.inputs.toggleInventory = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.I
  );
}

function update() {
  game.entities.player.setVelocity(0); // Stop movement when no keys are pressed

  // Toggle inventory visibility when "I" is pressed
  if (Phaser.Input.Keyboard.JustDown(game.inputs.toggleInventory)) {
    game.state.inventoryVisible = !game.state.inventoryVisible;
    game.ui.inventory.background.setVisible(game.state.inventoryVisible);
    game.ui.inventory.text.setVisible(game.state.inventoryVisible);
  }

  // Diagonal Movement
  if (game.inputs.cursors.left.isDown && game.inputs.cursors.up.isDown) {
    game.entities.player.setVelocity(-200, -200);
    game.entities.player.anims.play("walk-up-left", true);
    return;
  } else if (
    game.inputs.cursors.right.isDown &&
    game.inputs.cursors.up.isDown
  ) {
    game.entities.player.setVelocity(200, -200);
    game.entities.player.anims.play("walk-up-right", true);
    return;
  } else if (
    game.inputs.cursors.left.isDown &&
    game.inputs.cursors.down.isDown
  ) {
    game.entities.player.setVelocity(-200, 200);
    game.entities.player.anims.play("walk-down-left", true);
    return;
  } else if (
    game.inputs.cursors.right.isDown &&
    game.inputs.cursors.down.isDown
  ) {
    game.entities.player.setVelocity(200, 200);
    game.entities.player.anims.play("walk-down-right", true);
    return;
  }

  // Regular movement
  if (game.inputs.cursors.left.isDown) {
    game.entities.player.setVelocityX(-200);
    game.entities.player.anims.play("walk-left", true);
  } else if (game.inputs.cursors.right.isDown) {
    game.entities.player.setVelocityX(200);
    game.entities.player.anims.play("walk-right", true);
  } else if (game.inputs.cursors.up.isDown) {
    game.entities.player.setVelocityY(-200);
    game.entities.player.anims.play("walk-up", true);
  } else if (game.inputs.cursors.down.isDown) {
    game.entities.player.setVelocityY(200);
    game.entities.player.anims.play("walk-down", true);
  } else {
    game.entities.player.anims.stop();
  }
}

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
  backgroundLayer.setDepth(game.CONSTANTS.DEPTHS.Background); // Ensure it's the lowest layer
  // Load the Buildings layer
  const buildingsLayer = map.createLayer(
    "Buildings", // Layer name from Tiled
    buildingTileset,
    0,
    0
  );
  buildingsLayer.setDepth(game.CONSTANTS.DEPTHS.Foreground); // Ensure it's above the background
  console.log("Map loaded:", map);
  console.log("Background Layer:", backgroundLayer);
  console.log("Building Layer:", buildingsLayer);
}

function createEntities(phaser) {
  // Load at coordinates (100, 100) and force frame 0 of the sprite
  game.entities.player = phaser.physics.add.sprite(100, 100, "player", 0);
  game.entities.player.setCollideWorldBounds(true); // Prevents leaving the screen
  game.entities.player.setDepth(game.CONSTANTS.DEPTHS.Foreground); // Ensures the player appears above the background layer
  animations.configurePlayerAnimations(phaser);
  console.log("Player sprite created:", game.entities.player);
  console.log("Loaded frames:", phaser.textures.get("player").getFrameNames());

  game.entities.items = phaser.physics.add.group(); // Create a group for items
  const peanut = game.entities.items.create(150, 150, "stuffedPeanut"); // Spawn peanut at (150,150)
  peanut.setScale(2);
  peanut.setDepth(game.CONSTANTS.DEPTHS.Foreground); // Ensure it’s above the background

  // Define what happens when a player overlaps with an item, with the collectItem function
  phaser.physics.add.overlap(
    game.entities.player,
    game.entities.items,
    game.collectItem,
    null,
    game
  );
}

function createInventoryUI(phaser) {
  // Background panel
  game.ui.inventory.background = phaser.add.rectangle(
    100,
    100,
    300,
    200,
    0x000000,
    0.7
  ); // Semi-transparent black box
  game.ui.inventory.background.setOrigin(0, 0);
  game.ui.inventory.background.setDepth(game.CONSTANTS.DEPTHS.UIBackground);
  game.ui.inventory.background.setVisible(false); // Hide by default

  // Inventory text
  game.ui.inventory.text = phaser.add.text(110, 110, "Inventory:", {
    fontSize: "20px",
    fill: "#fff",
  });
  game.ui.inventory.text.setDepth(game.CONSTANTS.DEPTHS.UIForeground);
  game.ui.inventory.text.setVisible(false);
}

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

const phaser = new Phaser.Game(config);
