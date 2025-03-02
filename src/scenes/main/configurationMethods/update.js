import mainSceneState from "../mainSceneState";
import * as Phaser from "phaser";

const KEYS = mainSceneState.CONSTANTS.KEYS

function readInputs() {
  // Toggle inventory visibility when "I" is pressed
  if (Phaser.Input.Keyboard.JustDown(mainSceneState.inputs.toggleInventory)) {
    mainSceneState.state.inventoryVisible =
      !mainSceneState.state.inventoryVisible;
    mainSceneState.ui.inventory.background.setVisible(
      mainSceneState.state.inventoryVisible
    );
    mainSceneState.ui.inventory.text.setVisible(
      mainSceneState.state.inventoryVisible
    );
  }

  // Diagonal Movement
  if (
    mainSceneState.inputs.cursors.left.isDown &&
    mainSceneState.inputs.cursors.up.isDown
  ) {
    mainSceneState.entities.player.setVelocity(-200, -200);
    mainSceneState.entities.player.anims.play(KEYS.ANIMATIONS.WALK, true);
  } else if (
    mainSceneState.inputs.cursors.right.isDown &&
    mainSceneState.inputs.cursors.up.isDown
  ) {
    mainSceneState.entities.player.setVelocity(200, -200);
    mainSceneState.entities.player.anims.play(KEYS.ANIMATIONS.WALK, true);
  } else if (
    mainSceneState.inputs.cursors.left.isDown &&
    mainSceneState.inputs.cursors.down.isDown
  ) {
    mainSceneState.entities.player.setVelocity(-200, 200);
    mainSceneState.entities.player.anims.play(KEYS.ANIMATIONS.WALK, true);
  } else if (
    mainSceneState.inputs.cursors.right.isDown &&
    mainSceneState.inputs.cursors.down.isDown
  ) {
    mainSceneState.entities.player.setVelocity(200, 200);
    mainSceneState.entities.player.anims.play(KEYS.ANIMATIONS.WALK, true);
  }

  // Regular movement
  else if (mainSceneState.inputs.cursors.left.isDown) {
    mainSceneState.entities.player.setVelocityX(-200);
    mainSceneState.entities.player.anims.play(KEYS.ANIMATIONS.WALK, true);
  } else if (mainSceneState.inputs.cursors.right.isDown) {
    mainSceneState.entities.player.setVelocityX(200);
    mainSceneState.entities.player.anims.play(KEYS.ANIMATIONS.WALK, true);
  } else if (mainSceneState.inputs.cursors.up.isDown) {
    mainSceneState.entities.player.setVelocityY(-200);
    mainSceneState.entities.player.anims.play(KEYS.ANIMATIONS.WALK, true);
  } else if (mainSceneState.inputs.cursors.down.isDown) {
    mainSceneState.entities.player.setVelocityY(200);
    mainSceneState.entities.player.anims.play(KEYS.ANIMATIONS.WALK, true);
  } else {
    mainSceneState.entities.player.anims.stop();
  }
}

export default (phaser) => {
  mainSceneState.entities.player.setVelocity(0); // Stop movement when no keys are pressed
  readInputs();
};
