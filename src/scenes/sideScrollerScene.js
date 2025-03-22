import * as Phaser from "phaser";

class SideScrollerScene extends Phaser.Scene {
  CONSTANTS = {
    KEYS: {
      SPRITES: {
        PLAYER: "player",
        JUMP: "cat_jump",
      },
      ANIMATIONS: {
        WALK: "walk",
        JUMP: "cat_jump",
      },
    },
  };

  inputs = {
    cursors: undefined,
    jump: undefined,
  };

  entities = {
    player: undefined,
    ground: undefined,
  };

  constructor() {
    super({ key: "SideScrollerScene" });
  }

  preload() {
    this.load.spritesheet(
      this.CONSTANTS.KEYS.SPRITES.PLAYER,
      "src/assets/images/cat_run.png",
      { frameWidth: 64, frameHeight: 64 }
    );

    this.load.spritesheet(
      this.CONSTANTS.KEYS.SPRITES.JUMP,
      "src/assets/images/cat_jump.png",
      { frameWidth: 64, frameHeight: 64 }
    );
  }

  create() {
    this.#createGround();
    this.#createPlayer();
    this.#createAnimations();
    this.#createInputs();
    this.#createCamera();
  }

  update() {
    const player = this.entities.player;
    const onGround = player.body.touching.down;

    if (onGround) {
      player.setVelocityX(0);
    }

    if (!onGround) {
      player.anims.play(this.CONSTANTS.KEYS.ANIMATIONS.JUMP, true);
      return;
    }

    if (this.inputs.cursors.left.isDown) {
      player.setVelocityX(-200);
      player.anims.play(this.CONSTANTS.KEYS.ANIMATIONS.WALK, true);
      player.setFlipX(true);
    } else if (this.inputs.cursors.right.isDown) {
      player.setVelocityX(200);
      player.anims.play(this.CONSTANTS.KEYS.ANIMATIONS.WALK, true);
      player.setFlipX(false);
    } else {
      player.anims.stop();
    }

    if (this.inputs.jump.isDown && onGround) {
      player.setVelocityY(-400);
      player.anims.play(this.CONSTANTS.KEYS.ANIMATIONS.JUMP, true);
    }
  }

  #createGround() {
    this.entities.ground = this.physics.add.staticGroup();
    this.entities.ground
      .create(400, 580, null)
      .setDisplaySize(800, 40)
      .refreshBody();
  }

  #createPlayer() {
    this.entities.player = this.physics.add.sprite(
      100,
      450,
      this.CONSTANTS.KEYS.SPRITES.PLAYER,
      0
    );
    this.entities.player.setCollideWorldBounds(true);
    this.entities.player.setBounce(0.1);

    this.physics.add.collider(this.entities.player, this.entities.ground);
  }

  #createAnimations() {
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
        this.CONSTANTS.KEYS.SPRITES.JUMP,
        { start: 0, end: 6 }
      ),
      frameRate: 6,
      repeat: -1,
    });
  }

  #createInputs() {
    this.inputs.cursors = this.input.keyboard.createCursorKeys();
    this.inputs.jump = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  #createCamera() {
    this.cameras.main.startFollow(this.entities.player);
    this.cameras.main.setBounds(0, 0, 2000, 600);
  }
}

export default SideScrollerScene;
