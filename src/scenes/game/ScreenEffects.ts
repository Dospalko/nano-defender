import Phaser from "phaser"

export function createScreenEffects(scene: Phaser.Scene) {
  // Screen flash for various effects
  const screenFlash = scene.add
    .rectangle(scene.scale.width / 2, scene.scale.height / 2, scene.scale.width, scene.scale.height, 0xffffff, 0)
    .setDepth(100)

  // Damage overlay
  const damageOverlay = scene.add
    .rectangle(scene.scale.width / 2, scene.scale.height / 2, scene.scale.width, scene.scale.height, 0xff0000, 0)
    .setDepth(99)

  return { screenFlash, damageOverlay }
}
