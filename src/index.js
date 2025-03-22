import * as Phaser from "phaser";
import mainScene from "./scenes/mainScene";
import insideScene from "./scenes/insideScene";
import sideScrollerScene from "./scenes/sideScrollerScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 },
      debug: true,
    },
  },

  scene: [sideScrollerScene], // or [mainScene, sideScrollerScene] if you wanna keep both
};

const phaser = new Phaser.Game(config);
phaser.scene.start("SideScrollerScene");
