import * as Phaser from "phaser";
import mainScene from "./scenes/mainScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  scene: mainScene,
};

const phaser = new Phaser.Game(config);
