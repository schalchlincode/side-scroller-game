import * as Phaser from "phaser";
import main from "./scenes/main/mainScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  scene: main
};

const phaser = new Phaser.Game(config);
