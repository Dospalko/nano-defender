import Phaser from "phaser"

export function createEnhancedHUD(scene: Phaser.Scene) {
  const hudFont = {
    fontSize: "20px",
    color: "#ffffff",
    fontFamily: "Arial Black, Arial, sans-serif",
    stroke: "#000000",
    strokeThickness: 3,
    shadow: {
      offsetX: 2,
      offsetY: 2,
      color: "#000000",
      blur: 4,
      fill: true,
    },
  }

  // Score panel
  const scoreBg = scene.add.rectangle(120, 30, 200, 40, 0x1a1a2e, 0.9).setDepth(9)
  scoreBg.setStrokeStyle(2, 0x00ff88, 1)
  const scoreText = scene.add.text(120, 30, "SCORE: 0", hudFont).setOrigin(0.5).setDepth(10)

  // Health panel with bar
  const healthBg = scene.add.rectangle(scene.scale.width - 120, 30, 200, 40, 0x1a1a2e, 0.9).setDepth(9)
  healthBg.setStrokeStyle(2, 0xff4757, 1)
  const healthText = scene.add
    .text(scene.scale.width - 120, 30, `HEALTH: 3`, hudFont)
    .setOrigin(0.5)
    .setDepth(10)

  // Health bar
  const healthBarBg = scene.add.rectangle(scene.scale.width - 120, 55, 160, 8, 0x333333, 0.8).setDepth(9)
  const healthBar = scene.add.rectangle(scene.scale.width - 120, 55, 160, 8, 0x00ff88, 1).setDepth(10)

  // Wave panel
  const waveBg = scene.add.rectangle(scene.scale.width / 2, 30, 150, 40, 0x1a1a2e, 0.9).setDepth(9)
  waveBg.setStrokeStyle(2, 0x3742fa, 1)
  const waveText = scene.add
    .text(scene.scale.width / 2, 30, "WAVE: 1", hudFont)
    .setOrigin(0.5)
    .setDepth(10)

  // Enemies left panel
  const enemiesLeftBg = scene.add.rectangle(scene.scale.width / 2, 70, 180, 35, 0x1a1a2e, 0.8).setDepth(9)
  enemiesLeftBg.setStrokeStyle(2, 0xffa502, 1)
  const enemiesLeftText = scene.add
    .text(scene.scale.width / 2, 70, "ENEMIES: 0", {
      ...hudFont,
      fontSize: "16px",
      color: "#ffa502",
    })
    .setOrigin(0.5)
    .setDepth(10)

  // Buff text with background
  const buffText = scene.add
    .text(scene.scale.width / 2, 120, "", {
      fontSize: "28px",
      color: "#00ff88",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#000000",
      strokeThickness: 4,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: "#00ff88",
        blur: 10,
        fill: true,
      },
    })
    .setOrigin(0.5)
    .setDepth(11)

  // Combo text
  const comboText = scene.add
    .text(scene.scale.width - 50, 100, "", {
      fontSize: "24px",
      color: "#ffa502",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#000000",
      strokeThickness: 3,
    })
    .setOrigin(1, 0.5)
    .setDepth(11)

  // Add pulsing effects to HUD elements
  scene.tweens.add({
    targets: [scoreBg, healthBg, waveBg, enemiesLeftBg],
    alpha: { from: 0.9, to: 0.7 },
    duration: 2000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  })

  return {
    scoreBg,
    scoreText,
    healthBg,
    healthText,
    healthBarBg,
    healthBar,
    waveBg,
    waveText,
    enemiesLeftBg,
    enemiesLeftText,
    buffText,
    comboText,
  }
}
