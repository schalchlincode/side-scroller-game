import * as Phaser from "phaser";
import Game from "./Game";

const game = Game();

function preload() {
  game.configurationMethods.preload(this);
}

function create() {
  game.configurationMethods.create(this);
}

function update() {
  game.configurationMethods.update(this);
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
