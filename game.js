import * as Phaser from "phaser";

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

const game = new Phaser.Game(config);

function preload() {
  this.load.spritesheet("player", "assets/player_spritesheet.png", {
    frameWidth: 80, // Adjust this based on your sprite size
    frameHeight: 110,
  });

  this.load.image("Tiles", "assets/Tiles.png"); // Tileset image
  this.load.tilemapTiledJSON("map", "assets/map.json"); // Tilemap JSON file
  this.load.image("stuffedPeanut", "assets/stuffedPeanut.png");
}

function create() {
  this.inventory = []; // Store collected items
  this.inventoryVisible = true;

  // Load the tilemap
  const map = this.make.tilemap({ key: "map" });
  const tileset = map.addTilesetImage("Tiles", "Tiles"); // Match name in Tiled
  const backgroundLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);
  // Add player sprite at (400, 300) using the first frame of the spritesheet
  this.player = this.physics.add.sprite(400, 300, "player", 0);
  this.player.setCollideWorldBounds(true); // Prevents leaving the screen
  this.player.setDepth(1); // Ensures the player appears above other objects

  this.items = this.physics.add.group(); // Create a group for items
  let peanut = this.items.create(150, 150, "stuffedPeanut"); // Spawn peanut at (150,150)
  peanut.setScale(2);
  peanut.setDepth(1); // Ensure it’s above other objects

  // Define `collectItem()` inside `create()` to bind `this`
  this.collectItem = (player, item) => {
    item.destroy(); // Remove peanut from world
    this.inventory.push("Stuffed Peanut"); // Add to inventory

    this.inventoryText.setText("Inventory: " + this.inventory.join(", "));

    console.log("Inventory:", this.inventory);

    console.log("Inventory Text Object:", this.inventoryText);
  };

  this.physics.add.overlap(
    this.player,
    this.items,
    this.collectItem,
    null,
    this
  );

  // Define animations (adjust frame numbers if needed)
  this.anims.create({
    key: "walk-down",
    frames: this.anims.generateFrameNumbers("player", { start: 9, end: 10 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "walk-left",
    frames: this.anims.generateFrameNumbers("player", { start: 9, end: 10 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "walk-right",
    frames: this.anims.generateFrameNumbers("player", { start: 9, end: 10 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "walk-up",
    frames: this.anims.generateFrameNumbers("player", { start: 9, end: 10 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "walk-up-left",
    frames: this.anims.generateFrameNumbers("player", { start: 9, end: 10 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "walk-up-right",
    frames: this.anims.generateFrameNumbers("player", { start: 9, end: 10 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "walk-down-left",
    frames: this.anims.generateFrameNumbers("player", { start: 9, end: 10 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "walk-down-right",
    frames: this.anims.generateFrameNumbers("player", { start: 9, end: 10 }),
    frameRate: 10,
    repeat: -1,
  });

  // Enable keyboard input
  this.cursors = this.input.keyboard.createCursorKeys();

  console.log("Map loaded:", map);
  console.log("Tileset loaded:", tileset);
  console.log("Background Layer:", backgroundLayer);

  this.inventoryText = this.add.text(16, 16, "Inventory: ", {
    fontSize: "16px",
    fill: "#fff",
    backgroundColor: "#000",
    padding: { x: 10, y: 5 },
  });

  this.inventoryText.setDepth(10);
  this.inventoryText.setScrollFactor(0);

  this.toggleInventoryKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.I
  );
}

function update() {
  if (Phaser.Input.Keyboard.JustDown(this.toggleInventoryKey)) {
    this.inventoryVisible = !this.inventoryVisible; // Toggle visibility
    this.inventoryText.setVisible(this.inventoryVisible); // Show or hide text
  }

  this.player.setVelocity(0); // Stop movement when no keys are pressed

  if (this.cursors.left.isDown && this.cursors.up.isDown) {
    this.player.setVelocity(-200, -200);
    this.player.anims.play("walk-up-left", true);
    return;
  } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
    this.player.setVelocity(200, -200);
    this.player.anims.play("walk-up-right", true);
    return;
  } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
    this.player.setVelocity(-200, 200);
    this.player.anims.play("walk-down-left", true);
    return;
  } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
    this.player.setVelocity(200, 200);
    this.player.anims.play("walk-down-right", true);
    return;
  }

  // Regular movement
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-200);
    this.player.anims.play("walk-left", true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(200);
    this.player.anims.play("walk-right", true);
  } else if (this.cursors.up.isDown) {
    this.player.setVelocityY(-200);
    this.player.anims.play("walk-up", true);
  } else if (this.cursors.down.isDown) {
    this.player.setVelocityY(200);
    this.player.anims.play("walk-down", true);
  } else {
    this.player.anims.stop();
  }
}
