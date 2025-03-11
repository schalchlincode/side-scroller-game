import * as Phaser from "phaser";
import mainScene from "./scenes/mainScene";
import insideScene from "./scenes/insideScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  scene: [mainScene, insideScene],
};

const phaser = new Phaser.Game(config);
