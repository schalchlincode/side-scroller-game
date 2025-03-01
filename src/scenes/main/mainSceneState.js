function MainSceneState() {
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
    },
  };

  return { CONSTANTS, state, ui, inputs, entities, events };
}

export default MainSceneState();
