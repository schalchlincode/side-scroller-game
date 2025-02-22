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
    frameWidth: 70, // Adjust this based on your sprite size
    frameHeight: 110,
  });
}

function create() {
  this.player = this.add.sprite(400, 300, "player", 0); // Display player
}

function update() {
  console.log("Game updating...");
}
