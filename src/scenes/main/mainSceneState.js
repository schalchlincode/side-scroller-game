function MainSceneState() {
  // Do not change constant values in other parts of the code
  const CONSTANTS = {
    DEPTHS: {
      Background: 0,
      Foreground: 1,
      UIBackground: 10,
      UIForeground: 11,
    },
    // Keys are string references to anything phaser has created
    // A poor system, imo, but you can treat this as an index
    KEYS: {
      TILED: { // these values come from the Tiled map file directly
        MAP: "map",
        TILE_SETS: {
          TILES: "Tiles",
          BUILDING_TILES: "building_tilemap",
        },
        LAYERS: {
          TILE_LAYER: "Tile Layer 1",
          BUILDING_LAYER: "Buildings"
        }
      },
      SPRITES: {
        PLAYER: "player",
      },
      TILE_MAP: "map",
      IMAGES: {
        TILES: "tiles",
        BUILDING_TILES: "buildingTiles",
        STUFFED_PEANUT: "stuffedPeanut",
      },
      ANIMATIONS: {
        WALK: "walk"
      }
    }
  };

  // Always initialize new state, never set these values to undefined
  const state = {
    inventory: [],
    inventoryVisible: true,
  };

  // Layers imported into phaser from Tiled
  const layers = {
    background: undefined,
    building: undefined
  }

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

  // Methods around entity interactions (see above entities)
  const events = {
    collectItem: (player, item) => {
      item.destroy(); // Remove peanut from world
      state.inventory.push("Stuffed Peanut"); // Add to inventory
      ui.inventory.text.setText("Inventory: " + state.inventory.join(", "));
    },
  };

  return { CONSTANTS, state, ui, inputs, entities, events, layers };
}

export default MainSceneState();
