function configurePlayerAnimations(phaser) {
  // Define animations (adjust frame numbers if needed)
  phaser.anims.create({
    key: "walk-down",
    frames: phaser.anims.generateFrameNumbers("player", { start: 0, end: 5 }), // Using all frames
    frameRate: 10,
    repeat: -1,
  });

  phaser.anims.create({
    key: "walk-left",
    frames: phaser.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1,
  });

  phaser.anims.create({
    key: "walk-right",
    frames: phaser.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1,
  });

  phaser.anims.create({
    key: "walk-up",
    frames: phaser.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1,
  });

  phaser.anims.create({
    key: "walk-up-left",
    frames: phaser.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1,
  });

  phaser.anims.create({
    key: "walk-up-right",
    frames: phaser.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1,
  });

  phaser.anims.create({
    key: "walk-down-left",
    frames: phaser.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1,
  });

  phaser.anims.create({
    key: "walk-down-right",
    frames: phaser.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1,
  });
}

export default {
  configurePlayerAnimations,
};
