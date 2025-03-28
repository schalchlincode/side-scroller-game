import * as Phaser from "phaser";

class MainScene extends Phaser.Scene {
  // Do not change constant values in other parts of the code
  CONSTANTS = {
    DEPTHS: {
      Background: 0,
      Foreground: 1,
      UIBackground: 10,
      UIForeground: 11,
    },
    // Keys are string references to anything phaser has created
    // A poor system, imo, but you can treat this as an index
    KEYS: {
      TILED: {
        // these values come from the Tiled map file directly
        MAP: "map",
        TILE_SETS: {
          TILES: "Tiles",
          BUILDING_TILES: "building_tilemap",
        },
        LAYERS: {
          TILE_LAYER: "Tile Layer 1",
          BUILDING_LAYER: "Buildings",
        },
      },
      SPRITES: {
        PLAYER: "player",
        NPC: "catSprite",
      },
      IMAGES: {
        TILES: "tiles",
        BUILDING_TILES: "buildingTiles",
        STUFFED_PEANUT: "stuffedPeanut",
        PHOTO_FRAME: "photoFrame",
      },
      ANIMATIONS: {
        WALK: "walk",
      },
    },
  };

  // Game variables that are likely to change values over time
  state = {
    inventory: [], // Right now this array just holds string values
    inventoryVisible: true,
  };

  // Layers imported into phaser from Tiled - populated during phaser Create phase
  // https://docs.phaser.io/api-documentation/class/tilemaps-tilemaplayer
  layers = {
    background: undefined,
    building: undefined,
  };

  // UI Elements - populated during phaser Create phase
  ui = {
    inventory: {
      background: undefined, // Phaser.GameObjects.Rectangle: https://docs.phaser.io/api-documentation/class/gameobjects-rectangle
      text: undefined, // Phaser.GameObjects.Text: https://docs.phaser.io/api-documentation/class/gameobjects-text
    },
  };

  // Registered Inputs - populated during phaser Create phase, read during phaser Update phase
  // https://docs.phaser.io/api-documentation/class/input-keyboard-key
  inputs = {
    cursors: undefined,
    toggleInventory: undefined,
  };

  // Interactive Elements - populated during phaser Create phase (see below)
  entities = {
    player: undefined, // Phaser.Types.Physics.Arcade.SpriteWithDynamicBody: https://docs.phaser.io/api-documentation/class/physics-arcade-sprite
    items: undefined, // Phaser.Physics.Arcade.Group: https://docs.phaser.io/api-documentation/class/physics-arcade-group
  };

  // Interactions that occur between interactive elements (see above)
  interactions = {
    collectItem: (player, item) => {
      item.destroy(); // Remove item from world

      let itemName = "Unknown Item";

      if (item.texture.key === this.CONSTANTS.KEYS.IMAGES.STUFFED_PEANUT) {
        itemName = "Stuffed Peanut";
      } else if (item.texture.key === this.CONSTANTS.KEYS.IMAGES.PHOTO_FRAME) {
        itemName = "Picture Frame";
      }

      this.state.inventory.push(itemName); // Add to inventory

      this.ui.inventory.text.setText(
        "Inventory: " + this.state.inventory.join(", ")
      );
    },
  };

  // Singleton pattern to be able to use the same instance of this class at all times wherever its imported.
  // Will be useful in the future if we switch away from this scene and back to it, to be able to preserve its previous state!
  static getInstance() {
    if (!this.instance) {
      this.instance = new MainScene();
    }
    return this.instance;
  }

  /**
   * Phaser scene configuration methods
   */
  preload() {
    // Player Sprite
    this.load.spritesheet(
      this.CONSTANTS.KEYS.SPRITES.PLAYER,
      "src/assets/images/wizard_run.png",
      { frameWidth: 64, frameHeight: 64 } // Adjust this based on your sprite size
    );

    this.load.spritesheet(
      this.CONSTANTS.KEYS.SPRITES.NPC,
      "src/assets/images/cat_spritesheet.png",
      { frameWidth: 64, frameHeight: 64 }
    );

    // Tiled map JSON file
    this.load.tilemapTiledJSON(
      this.CONSTANTS.KEYS.TILED.MAP,
      "src/assets/tiles/map.json"
    );

    // The first tileset defined in the Tilemap JSON file
    this.load.image(
      this.CONSTANTS.KEYS.IMAGES.TILES,
      "src/assets/tiles/Tiles.png"
    );

    // The second tileset defined in the Tilemap JSON file
    this.load.image(
      this.CONSTANTS.KEYS.IMAGES.BUILDING_TILES,
      "src/assets/tiles/building_tilemap.png"
    );

    // Items
    this.load.image(
      this.CONSTANTS.KEYS.IMAGES.STUFFED_PEANUT,
      "src/assets/images/stuffedPeanut.png"
    );

    this.load.image(
      this.CONSTANTS.KEYS.IMAGES.PHOTO_FRAME,
      "src/assets/images/photo_frame.png"
    );
  }

  create() {
    this.#createMap();
    this.#createEntities();
    this.#createInventoryUI();
    this.#createPhysics();
    this.#createInputs();
  }

  update() {
    this.entities.player.setVelocity(0); // Stop movement when no keys are pressed
    this.#readInputs();
  }

  /**
   * 'Private' methods that are only used inside this class, denoted by the leading hashtag
   * The leading hashtag is actual vanilla js syntax for private methods, not just convention.
   */
  #createMap() {
    // Creates the tilemap from the tiled JSON file loaded in preload
    const map = this.make.tilemap({ key: this.CONSTANTS.KEYS.TILED.MAP });

    // The first argument, in the below function calls, is the name of the tileset from the tiled map file
    // The second argument is the key used in the preload function to load the file into phaser
    // Essentially we are linking information about the 'tilesets' loaded from tiled and adding them into phaser
    const tileSet = map.addTilesetImage(
      this.CONSTANTS.KEYS.TILED.TILE_SETS.TILES,
      this.CONSTANTS.KEYS.IMAGES.TILES
    );
    const buildingTileSet = map.addTilesetImage(
      this.CONSTANTS.KEYS.TILED.TILE_SETS.BUILDING_TILES,
      this.CONSTANTS.KEYS.IMAGES.BUILDING_TILES
    );

    // Load the background layer
    this.layers.background = map.createLayer(
      this.CONSTANTS.KEYS.TILED.LAYERS.TILE_LAYER,
      tileSet,
      0,
      0
    );
    this.layers.background.setDepth(this.CONSTANTS.DEPTHS.Background);

    // Load the Buildings layer
    this.layers.building = map.createLayer(
      this.CONSTANTS.KEYS.TILED.LAYERS.BUILDING_LAYER,
      buildingTileSet,
      0,
      0
    );
    this.layers.building.setDepth(this.CONSTANTS.DEPTHS.Foreground); // Ensure it's above the background
  }

  #createEntities() {
    // Load at coordinates (100, 100) and force frame 0 of the sprite
    this.entities.player = this.physics.add.sprite(
      100,
      100,
      this.CONSTANTS.KEYS.SPRITES.PLAYER,
      0
    );
    this.entities.player.setCollideWorldBounds(true); // Prevents leaving the screen

    this.entities.player.setSize(32, 48); // Adjust width and height as needed
    this.entities.player.setOffset(16, 22); // Adjust offset to center the hitbox

    this.entities.player.setDepth(this.CONSTANTS.DEPTHS.Foreground);

    this.entities.cat = this.physics.add.sprite(
      300,
      300,
      this.CONSTANTS.KEYS.SPRITES.NPC,
      0
    );
    this.entities.cat.setDepth(this.CONSTANTS.DEPTHS.Foreground);

    this.anims.create({
      key: "catSleep",
      frames: this.anims.generateFrameNumbers(this.CONSTANTS.KEYS.SPRITES.NPC, {
        start: 8,
        end: 11,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.entities.cat.anims.play("catSleep", true);

    this.anims.create({
      key: this.CONSTANTS.KEYS.ANIMATIONS.WALK,
      frames: this.anims.generateFrameNumbers(
        this.CONSTANTS.KEYS.SPRITES.PLAYER,
        { start: 0, end: 5 }
      ), // Using all frames
      frameRate: 10,
      repeat: -1,
    });

    this.entities.items = this.physics.add.group(); // Create a group for items

    const peanut = this.entities.items.create(
      150,
      150,
      this.CONSTANTS.KEYS.IMAGES.STUFFED_PEANUT
    );
    peanut.setScale(0.1);
    peanut.setDepth(this.CONSTANTS.DEPTHS.Foreground); // Ensure it’s above the background

    const photoFrame = this.entities.items.create(
      200,
      200,
      this.CONSTANTS.KEYS.IMAGES.PHOTO_FRAME
    );
    photoFrame.setScale(0.1);
    photoFrame.setDepth(this.CONSTANTS.DEPTHS.Foreground);

    // ADD THE DOOR ENTITY (Trigger Zone)
    this.entities.door = this.physics.add.staticSprite(400, 400, null);
    this.entities.door.setSize(50, 50).setVisible(false); // Invisible trigger area
  }

  #createInventoryUI() {
    // Background panel
    //ADD: dynamic inventory background
    this.ui.inventory.background = this.add.rectangle(
      100,
      100,
      300,
      200,
      0x000000,
      0.7
    ); // Semi-transparent black box
    this.ui.inventory.background.setOrigin(0, 0);
    this.ui.inventory.background.setDepth(this.CONSTANTS.DEPTHS.UIBackground);
    this.ui.inventory.background.setVisible(false); // Hide by default

    // Inventory text
    this.ui.inventory.text = this.add.text(110, 110, "Inventory:", {
      fontSize: "20px",
      fill: "#fff",
    });
    this.ui.inventory.text.setDepth(this.CONSTANTS.DEPTHS.UIForeground);
    this.ui.inventory.text.setVisible(false);
  }

  #createPhysics() {
    // Building Layer Collision
    this.physics.add.collider(this.entities.player, this.layers.building);
    this.layers.building.setCollisionByProperty({ collides: true });

    // Items Overlap Behavior
    this.physics.add.overlap(
      this.entities.player,
      this.entities.items,
      this.interactions.collectItem
    );

    // ADD DOOR COLLISION DETECTION
    this.physics.add.overlap(this.entities.player, this.entities.door, () => {
      this.scene.start("InsideSceneKey", { state: this.state });
      // Switch to the inside scene
    });
  }

  #createInputs() {
    this.inputs.cursors = this.input.keyboard.createCursorKeys();
    this.inputs.toggleInventory = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.I
    );
  }

  #readInputs() {
    // Toggle inventory visibility when "I" is pressed
    if (Phaser.Input.Keyboard.JustDown(this.inputs.toggleInventory)) {
      this.state.inventoryVisible = !this.state.inventoryVisible;
      this.ui.inventory.background.setVisible(this.state.inventoryVisible);
      this.ui.inventory.text.setVisible(this.state.inventoryVisible);
    }

    // Diagonal Movement
    if (this.inputs.cursors.left.isDown && this.inputs.cursors.up.isDown) {
      this.entities.player.setVelocity(-200, -200);
      this.entities.player.anims.play(
        this.CONSTANTS.KEYS.ANIMATIONS.WALK,
        true
      );
    } else if (
      this.inputs.cursors.right.isDown &&
      this.inputs.cursors.up.isDown
    ) {
      this.entities.player.setVelocity(200, -200);
      this.entities.player.anims.play(
        this.CONSTANTS.KEYS.ANIMATIONS.WALK,
        true
      );
    } else if (
      this.inputs.cursors.left.isDown &&
      this.inputs.cursors.down.isDown
    ) {
      this.entities.player.setVelocity(-200, 200);
      this.entities.player.anims.play(
        this.CONSTANTS.KEYS.ANIMATIONS.WALK,
        true
      );
    } else if (
      this.inputs.cursors.right.isDown &&
      this.inputs.cursors.down.isDown
    ) {
      this.entities.player.setVelocity(200, 200);
      this.entities.player.anims.play(
        this.CONSTANTS.KEYS.ANIMATIONS.WALK,
        true
      );
    }

    // Regular movement
    else if (this.inputs.cursors.left.isDown) {
      this.entities.player.setVelocityX(-200);
      this.entities.player.anims.play(
        this.CONSTANTS.KEYS.ANIMATIONS.WALK,
        true
      );
    } else if (this.inputs.cursors.right.isDown) {
      this.entities.player.setVelocityX(200);
      this.entities.player.anims.play(
        this.CONSTANTS.KEYS.ANIMATIONS.WALK,
        true
      );
    } else if (this.inputs.cursors.up.isDown) {
      this.entities.player.setVelocityY(-200);
      this.entities.player.anims.play(
        this.CONSTANTS.KEYS.ANIMATIONS.WALK,
        true
      );
    } else if (this.inputs.cursors.down.isDown) {
      this.entities.player.setVelocityY(200);
      this.entities.player.anims.play(
        this.CONSTANTS.KEYS.ANIMATIONS.WALK,
        true
      );
    } else {
      this.entities.player.anims.stop();
    }
  }
}

export default MainScene.getInstance();
