import * as Phaser from "phaser";

class SideScrollerScene extends Phaser.Scene {
  CONSTANTS = {
    DEPTHS: {
      Background: 0,
      Foreground: 1,
      UIBackground: 10,
      UIForeground: 11,
    },
    KEYS: {
      SPRITES: {
        PLAYER: "player",
        PLAYER_JUMP: "cat_jump",
      },
      IMAGES: {
        OBSTACLE: "cactus",
      },
      ANIMATIONS: {
        WALK: "walk",
        JUMP: "cat_jump",
      },
    },
  };

  constructor() {
    super({ key: "SideScrollerScene" });
    this.groundGroup = null;
    this.obstacles = null;
    this.lastGroundX = 0;
    this.score = 0;
  }

  preload() {
    this.load.spritesheet(
      this.CONSTANTS.KEYS.SPRITES.PLAYER,
      "src/assets/images/cat_run.png",
      { frameWidth: 64, frameHeight: 64 }
    );

    this.load.spritesheet(
      this.CONSTANTS.KEYS.SPRITES.PLAYER_JUMP,
      "src/assets/images/cat_jump.png",
      { frameWidth: 64, frameHeight: 64 }
    );

    this.load.image(
      this.CONSTANTS.KEYS.IMAGES.OBSTACLE,
      "src/assets/images/cactus.png"
    );
  }

  create() {
    this.groundGroup = this.physics.add.staticGroup();
    this.obstacles = this.physics.add.group();

    for (let i = 0; i < 6; i++) {
      this.addGroundChunk(i * 200);
    }

    // Player
    this.player = this.physics.add.sprite(
      100,
      450,
      this.CONSTANTS.KEYS.SPRITES.PLAYER,
      0
    );
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.1);
    this.player.setSize(40, 50);
    this.player.setOffset(12, 10);
    this.player.setDepth(this.CONSTANTS.DEPTHS.Foreground);

    this.anims.create({
      key: this.CONSTANTS.KEYS.ANIMATIONS.WALK,
      frames: this.anims.generateFrameNumbers(
        this.CONSTANTS.KEYS.SPRITES.PLAYER,
        { start: 0, end: 5 }
      ),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: this.CONSTANTS.KEYS.ANIMATIONS.JUMP,
      frames: this.anims.generateFrameNumbers(
        this.CONSTANTS.KEYS.SPRITES.PLAYER_JUMP,
        { start: 0, end: 6 }
      ),
      frameRate: 6,
      repeat: -1,
    });

    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.handleDeath,
      null,
      this
    );

    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setLerp(1, 0);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, 600);

    this.scoreText = this.add
      .text(16, 16, "Score: 0", {
        fontSize: "24px",
        fill: "#fff",
      })
      .setScrollFactor(0);

    this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: this.spawnObstacle,
      callbackScope: this,
    });

    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        this.score++;
        this.scoreText.setText("Score: " + this.score);
      },
    });
  }

  update() {
    this.player.setVelocityX(200);

    if (this.player.y > 600) {
      this.handleDeath();
    }

    if (this.spacebar.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
    }

    if (this.player.body.touching.down) {
      this.player.anims.play(this.CONSTANTS.KEYS.ANIMATIONS.WALK, true);
    } else {
      this.player.anims.play(this.CONSTANTS.KEYS.ANIMATIONS.JUMP, true);
    }

    const rightEdge = this.cameras.main.scrollX + 800;
    if (this.lastGroundX < rightEdge + 200) {
      const shouldGap = Math.random() < 0.2;
      if (!shouldGap) {
        this.addGroundChunk(this.lastGroundX);
      } else {
        this.lastGroundX += 200;
      }
    }

    // Clean up off-screen ground
    this.groundGroup.getChildren().forEach((ground) => {
      if (ground.x + ground.displayWidth < this.cameras.main.scrollX - 100) {
        ground.destroy();
      }
    });

    // Clean up off-screen obstacles
    this.obstacles.getChildren().forEach((obstacle) => {
      if (obstacle.x + obstacle.width < this.cameras.main.scrollX - 100) {
        obstacle.destroy();
      }
    });
  }

  addGroundChunk(x) {
    const ground = this.groundGroup
      .create(x, 580, "white") // ✅ use built-in white texture
      .setDisplaySize(200, 40)
      .setTint(0x888888) // optional: give it a gray color
      .refreshBody();
    ground.setOrigin(0, 0);
    this.lastGroundX = x + 200;
  }

  spawnObstacle() {
    const spawnX = this.cameras.main.scrollX + 800;
    const obstacle = this.obstacles.create(
      spawnX,
      520,
      this.CONSTANTS.KEYS.IMAGES.OBSTACLE
    );
    obstacle.setVelocityX(-200);
    obstacle.setImmovable(true);
    obstacle.body.allowGravity = false;
  }

  handleDeath() {
    this.scene.restart();
  }
}

export default SideScrollerScene;
