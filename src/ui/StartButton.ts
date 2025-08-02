import Phaser from "phaser"

export function createStartButton(scene: Phaser.Scene, centerX: number, centerY: number, onClick: () => void) {
  // Button background with glow
  const startBtnBg = scene.add.rectangle(centerX, centerY + 60, 250, 70, 0x00ff88, 0.3)
  startBtnBg.setStrokeStyle(4, 0x00ff88, 1)

  // Button text
  const startBtn = scene.add
    .text(centerX, centerY + 60, "LAUNCH MISSION", {
      fontSize: "24px",
      color: "#ffffff",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#ffffff",
      strokeThickness: 3,
    })
    .setOrigin(0.5)

  // Button animations
  scene.tweens.add({
    targets: [startBtnBg, startBtn],
    alpha: { from: 0, to: 1 },
    scale: { from: 0.8, to: 1 },
    duration: 1200,
    ease: "Back.easeOut",
    delay: 1500,
  })

  // Make interactive
  startBtnBg.setInteractive({ useHandCursor: true })
  startBtn.setInteractive({ useHandCursor: true })

  ;[startBtnBg, startBtn].forEach((target) => {
    target.on("pointerover", () => {
      scene.tweens.add({
        targets: [startBtnBg, startBtn],
        scale: 1.1,
        duration: 200,
        ease: "Back.easeOut",
      })
      startBtnBg.setFillStyle(0x00cc66)
    })
    target.on("pointerout", () => {
      scene.tweens.add({
        targets: [startBtnBg, startBtn],
        scale: 1,
        duration: 200,
        ease: "Quad.easeOut",
      })
      startBtnBg.setFillStyle(0x00ff88)
    })
    target.on("pointerdown", onClick)
  })

  // Pulsing glow
  scene.tweens.add({
    targets: startBtnBg,
    alpha: { from: 0.9, to: 0.6 },
    duration: 1000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  })

  return { startBtn, startBtnBg }
}
