function collectItem(player, item) {
  item.destroy(); // Remove peanut from world
  this.gameState.inventory.push("Stuffed Peanut"); // Add to inventory
  this.UI.inventory.text.setText(
    "Inventory: " + this.gameState.inventory.join(", ")
  );
  console.log("Inventory:", this.gameState.inventory);
  console.log("Inventory Text Object:", this.inventoryText);
}

export default { collectItem };
