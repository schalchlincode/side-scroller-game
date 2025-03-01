function Game() {
  // Do not change these values in other parts of the code
  const CONSTANTS = {
    DEPTHS: {
      Background: 0,
      Foreground: 1,
      UIBackground: 10,
      UIForeground: 11,
    },
  };

  // UI Phaser Elements
  const ui = {
    inventory: {
      background: undefined,
      text: undefined,
    },
  };

  // Phaser Elements that take part in interactions
  const entities = {
    player: undefined,
    items: undefined,
  };

  const state = {
    inventory: [],
    inventoryVisible: true,
  };

  const inputs = {
    cursors: undefined,
    toggleInventory: undefined,
  };

  function collectItem(player, item) {
    item.destroy(); // Remove peanut from world
    state.inventory.push("Stuffed Peanut"); // Add to inventory
    ui.inventory.text.setText("Inventory: " + state.inventory.join(", "));
    console.log("Inventory:", state.inventory);
    console.log("Inventory Text Object:", ui.inventory.text);
  }

  return { CONSTANTS, ui, entities, state, inputs, collectItem };
}

export default Game;
