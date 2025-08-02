import Phaser from "phaser"

export function createHitEffect(scene: Phaser.Scene, x: number, y: number) {
  const flash = scene.add.circle(x, y, 20, 0xffffff, 0.8).setDepth(6)
  scene.tweens.add({
    targets: flash,
    scale: { from: 0.5, to: 2 },
    alpha: { from: 0.8, to: 0 },
    duration: 200,
    ease: "Power2.easeOut",
    onComplete: () => flash.destroy(),
  })
}

export function createExplosionRing(scene: Phaser.Scene, x: number, y: number) {
  const ring = scene.add.circle(x, y, 30, 0xff6b6b, 0).setDepth(6)
  ring.setStrokeStyle(4, 0xff6b6b, 1)
  scene.tweens.add({
    targets: ring,
    scale: { from: 0.2, to: 2 },
    alpha: { from: 1, to: 0 },
    duration: 400,
    ease: "Power2.easeOut",
    onComplete: () => ring.destroy(),
  })
}

export function createPowerUpCollectionEffect(scene: Phaser.Scene, x: number, y: number) {
  for (let i = 0; i < 8; i++) {
    const spark = scene.add.circle(x, y, 3, 0xffa502, 1).setDepth(6)
    const angle = (i / 8) * Math.PI * 2
    const distance = 60
    scene.tweens.add({
      targets: spark,
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      alpha: 0,
      scale: 0,
      duration: 500,
      ease: "Power2.easeOut",
      onComplete: () => spark.destroy(),
    })
  }
}

export function createScorePopup(scene: Phaser.Scene, x: number, y: number, text: string) {
  const popup = scene.add
    .text(x, y, text, {
      fontSize: "16px",
      color: "#ffa502",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#000000",
      strokeThickness: 2,
    })
    .setOrigin(0.5)
    .setDepth(11)
  scene.tweens.add({
    targets: popup,
    y: y - 50,
    alpha: { from: 1, to: 0 },
    scale: { from: 1, to: 1.2 },
    duration: 1000,
    ease: "Power2.easeOut",
    onComplete: () => popup.destroy(),
  })
}

export function createPowerUpSpawnEffect(scene: Phaser.Scene, x: number, y: number) {
  const glow = scene.add.circle(x, y, 50, 0xffa502, 0.3).setDepth(4)
  scene.tweens.add({
    targets: glow,
    scale: { from: 0, to: 1.5 },
    alpha: { from: 0.5, to: 0 },
    duration: 800,
    ease: "Power2.easeOut",
    onComplete: () => glow.destroy(),
  })
}
