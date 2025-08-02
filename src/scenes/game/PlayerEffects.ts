import Phaser from "phaser"
import type Player from "@/objects/Player"

export function createMuzzleFlash(scene: Phaser.Scene, player: Player) {
  const flash = scene.add.circle(player.x, player.y, 15, 0xffffff, 0.8).setDepth(5)
  scene.tweens.add({
    targets: flash,
    scale: { from: 1, to: 2 },
    alpha: { from: 0.8, to: 0 },
    duration: 100,
    ease: "Power2.easeOut",
    onComplete: () => flash.destroy(),
  })
}

export function createShieldEffect(scene: Phaser.Scene, player: Player) {
  const shield = scene.add.circle(player.x, player.y, 40, 0xffd93c, 0).setDepth(8)
  shield.setStrokeStyle(3, 0xffd93c, 0.8)
  scene.tweens.add({
    targets: shield,
    scale: { from: 0.5, to: 1.5 },
    alpha: { from: 0.8, to: 0 },
    duration: 300,
    ease: "Power2.easeOut",
    onComplete: () => shield.destroy(),
  })
}

export function createShieldActivationEffect(scene: Phaser.Scene, player: Player) {
  for (let i = 0; i < 3; i++) {
    const ring = scene.add.circle(player.x, player.y, 30 + i * 10, 0xffd93c, 0).setDepth(7)
    ring.setStrokeStyle(2, 0xffd93c, 0.6 - i * 0.2)
    scene.tweens.add({
      targets: ring,
      scale: { from: 0.5, to: 2 },
      alpha: { from: 0.6, to: 0 },
      duration: 1000,
      ease: "Power2.easeOut",
      delay: i * 200,
      onComplete: () => ring.destroy(),
    })
  }
}

export function createHealEffect(scene: Phaser.Scene, player: Player) {
  const healRing = scene.add.circle(player.x, player.y, 35, 0xff4a4a, 0).setDepth(7)
  healRing.setStrokeStyle(3, 0xff4a4a, 0.8)
  scene.tweens.add({
    targets: healRing,
    scale: { from: 0.3, to: 1.5 },
    alpha: { from: 0.8, to: 0 },
    duration: 600,
    ease: "Power2.easeOut",
    onComplete: () => healRing.destroy(),
  })
}
