import animations from "./animations/player";
import * as Phaser from "phaser";

function Game() {
  // Do not change constant values in other parts of the code
  const CONSTANTS = {
    DEPTHS: {
      Background: 0,
      Foreground: 1,
      UIBackground: 10,
      UIForeground: 11,
    },
  };

  // Always initialize new state, never set these values to undefined
  const state = {
    inventory: [],
    inventoryVisible: true,
  };

  // UI Elements - populated during phaser Create phase
  const ui = {
    inventory: {
      background: undefined,
      text: undefined,
    },
  };

  // Registered Inputs - populated during phaser Create phase, read during phaser Update phase
  const inputs = {
    cursors: undefined,
    toggleInventory: undefined,
  };

  // Interactive Elements - populated during phaser Create phase (see following events)
  const entities = {
    player: undefined,
    items: undefined,
  };

  // Methods around entity interactions (see  above entities)
  const events = {
    collectItem: (player, item) => {
      item.destroy(); // Remove peanut from world
      state.inventory.push("Stuffed Peanut"); // Add to inventory
      ui.inventory.text.setText("Inventory: " + state.inventory.join(", "));
      console.log("Inventory:", state.inventory);
      console.log("Inventory Text Object:", ui.inventory.text);
    },
  };

  /**
   * Phaser creation functions
   */
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
    backgroundLayer.setDepth(CONSTANTS.DEPTHS.Background); // Ensure it's the lowest layer
    // Load the Buildings layer
    const buildingsLayer = map.createLayer(
      "Buildings", // Layer name from Tiled
      buildingTileset,
      0,
      0
    );
    buildingsLayer.setDepth(CONSTANTS.DEPTHS.Foreground); // Ensure it's above the background
    console.log("Map loaded:", map);
    console.log("Background Layer:", backgroundLayer);
    console.log("Building Layer:", buildingsLayer);
  }

  function createEntities(phaser) {
    // Load at coordinates (100, 100) and force frame 0 of the sprite
    entities.player = phaser.physics.add.sprite(100, 100, "player", 0);
    entities.player.setCollideWorldBounds(true); // Prevents leaving the screen
    entities.player.setDepth(CONSTANTS.DEPTHS.Foreground); // Ensures the player appears above the background layer
    animations.configurePlayerAnimations(phaser);
    console.log("Player sprite created:", entities.player);
    console.log(
      "Loaded frames:",
      phaser.textures.get("player").getFrameNames()
    );

    entities.items = phaser.physics.add.group(); // Create a group for items
    const peanut = entities.items.create(150, 150, "stuffedPeanut"); // Spawn peanut at (150,150)
    peanut.setScale(2);
    peanut.setDepth(CONSTANTS.DEPTHS.Foreground); // Ensure it’s above the background

    // Define what happens when a player overlaps with an item, with the collectItem function
    phaser.physics.add.overlap(
      entities.player,
      entities.items,
      events.collectItem
    );
  }

  function createInventoryUI(phaser) {
    // Background panel
    ui.inventory.background = phaser.add.rectangle(
      100,
      100,
      300,
      200,
      0x000000,
      0.7
    ); // Semi-transparent black box
    ui.inventory.background.setOrigin(0, 0);
    ui.inventory.background.setDepth(CONSTANTS.DEPTHS.UIBackground);
    ui.inventory.background.setVisible(false); // Hide by default

    // Inventory text
    ui.inventory.text = phaser.add.text(110, 110, "Inventory:", {
      fontSize: "20px",
      fill: "#fff",
    });
    ui.inventory.text.setDepth(CONSTANTS.DEPTHS.UIForeground);
    ui.inventory.text.setVisible(false);
  }

  /**
   * Phaser update functions
   */
  function readInputs() {
    // Toggle inventory visibility when "I" is pressed
    if (Phaser.Input.Keyboard.JustDown(inputs.toggleInventory)) {
      state.inventoryVisible = !state.inventoryVisible;
      ui.inventory.background.setVisible(state.inventoryVisible);
      ui.inventory.text.setVisible(state.inventoryVisible);
    }

    // Diagonal Movement
    if (inputs.cursors.left.isDown && inputs.cursors.up.isDown) {
      entities.player.setVelocity(-200, -200);
      entities.player.anims.play("walk-up-left", true);
      return;
    } else if (inputs.cursors.right.isDown && inputs.cursors.up.isDown) {
      entities.player.setVelocity(200, -200);
      entities.player.anims.play("walk-up-right", true);
      return;
    } else if (inputs.cursors.left.isDown && inputs.cursors.down.isDown) {
      entities.player.setVelocity(-200, 200);
      entities.player.anims.play("walk-down-left", true);
      return;
    } else if (inputs.cursors.right.isDown && inputs.cursors.down.isDown) {
      entities.player.setVelocity(200, 200);
      entities.player.anims.play("walk-down-right", true);
      return;
    }

    // Regular movement
    if (inputs.cursors.left.isDown) {
      entities.player.setVelocityX(-200);
      entities.player.anims.play("walk-left", true);
    } else if (inputs.cursors.right.isDown) {
      entities.player.setVelocityX(200);
      entities.player.anims.play("walk-right", true);
    } else if (inputs.cursors.up.isDown) {
      entities.player.setVelocityY(-200);
      entities.player.anims.play("walk-up", true);
    } else if (inputs.cursors.down.isDown) {
      entities.player.setVelocityY(200);
      entities.player.anims.play("walk-down", true);
    } else {
      entities.player.anims.stop();
    }
  }

  return {
    configurationMethods: {
      preload: (phaser) => {
        console.log("Wizard sprite is loading...");
        phaser.load.spritesheet("player", "src/assets/images/wizard_run.png", {
          frameWidth: 64, // Adjust this based on your sprite size
          frameHeight: 64,
        });

        // Load assets into Phaser - loaded assets are still unused
        // The first argument passed to load methods are the identifiers used later to 'add' them to the game
        phaser.load.tilemapTiledJSON("map", "src/assets/tiles/map.json"); // Tilemap JSON file
        phaser.load.image("tiles", "src/assets/tiles/Tiles.png"); // The first tileset defined in the Tilemap JSON file
        phaser.load.image(
          "buildingTiles",
          "src/assets/tiles/building_tilemap.png"
        ); // The second tileset defined in the Tilemap JSON file
        phaser.load.image(
          "stuffedPeanut",
          "src/assets/images/stuffedPeanut.png"
        );
      },

      create: (phaser) => {
        createMap(phaser);
        createEntities(phaser);
        createInventoryUI(phaser);

        // Enable keyboard input
        inputs.cursors = phaser.input.keyboard.createCursorKeys();
        // TODO - consolidate keymap
        inputs.toggleInventory = phaser.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.I
        );
      },

      update: (phaser) => {
        entities.player.setVelocity(0); // Stop movement when no keys are pressed
        readInputs();
      },
    },
  };
}

export default Game;
