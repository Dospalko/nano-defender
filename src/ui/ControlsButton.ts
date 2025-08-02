import Phaser from "phaser"

export function createControlsButton(scene: Phaser.Scene, centerX: number, centerY: number, onClick: () => void) {
  // Controls button background
  const controlsBtnBg = scene.add.rectangle(centerX, centerY + 140, 250, 70, 0x3742fa, 0.8)
  controlsBtnBg.setStrokeStyle(4, 0x3742fa, 1)

  const controlsBtn = scene.add
    .text(centerX, centerY + 140, "VIEW CONTROLS", {
      fontSize: "24px",
      color: "#ffffff",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#000000",
      strokeThickness: 3,
    })
    .setOrigin(0.5)

  // Make interactive
  controlsBtnBg.setInteractive({ useHandCursor: true })
  controlsBtn.setInteractive({ useHandCursor: true })

  ;[controlsBtnBg, controlsBtn].forEach((target) => {
    target.on("pointerover", () => {
      scene.tweens.add({
        targets: [controlsBtnBg, controlsBtn],
        scale: 1.1,
        duration: 200,
        ease: "Back.easeOut",
      })
      controlsBtnBg.setFillStyle(0x4c63d2)
    })
    target.on("pointerout", () => {
      scene.tweens.add({
        targets: [controlsBtnBg, controlsBtn],
        scale: 1,
        duration: 200,
        ease: "Quad.easeOut",
      })
      controlsBtnBg.setFillStyle(0x3742fa)
    })
    target.on("pointerdown", onClick)
  })

  // Entrance animation
  scene.tweens.add({
    targets: [controlsBtnBg, controlsBtn],
    alpha: { from: 0, to: 1 },
    y: { from: centerY + 180, to: centerY + 140 },
    duration: 1000,
    ease: "Back.easeOut",
    delay: 2000,
  })

  // Subtle pulse
  scene.tweens.add({
    targets: controlsBtnBg,
    alpha: { from: 0.8, to: 0.6 },
    duration: 2000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  })

  return { controlsBtn, controlsBtnBg }
}
