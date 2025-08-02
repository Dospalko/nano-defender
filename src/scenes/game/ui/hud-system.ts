import type Phaser from "phaser"
import { COLORS } from "../config/game-config"
export class HUDSystem {
  private scene: Phaser.Scene

  // UI Elements
  public scoreText!: Phaser.GameObjects.Text
  public healthText!: Phaser.GameObjects.Text
  public buffText!: Phaser.GameObjects.Text
  public waveText!: Phaser.GameObjects.Text
  public enemiesLeftText!: Phaser.GameObjects.Text
  public playerNameText!: Phaser.GameObjects.Text
  public comboText!: Phaser.GameObjects.Text

  // UI Backgrounds
  private scoreBg!: Phaser.GameObjects.Rectangle
  private healthBg!: Phaser.GameObjects.Rectangle
  private waveBg!: Phaser.GameObjects.Rectangle
  private enemiesLeftBg!: Phaser.GameObjects.Rectangle

  // Health bar
  private healthBarBg!: Phaser.GameObjects.Rectangle
  private healthBar!: Phaser.GameObjects.Rectangle

  constructor(scene: Phaser.Scene, playerName: string) {
    this.scene = scene
    this.createHUD(playerName)
  }

  private createHUD(playerName: string) {
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

    this.createScorePanel(hudFont)
    this.createHealthPanel(hudFont)
    this.createWavePanel(hudFont)
    this.createEnemiesPanel(hudFont)
    this.createBuffText()
    this.createComboText()
    this.createPlayerNameText(playerName)
    this.addPulsingEffects()
  }

  private createScorePanel(hudFont: any) {
    this.scoreBg = this.scene.add.rectangle(120, 30, 200, 40, COLORS.DARK_BG, 0.9).setDepth(9)
    this.scoreBg.setStrokeStyle(2, COLORS.PRIMARY, 1)
    this.scoreText = this.scene.add.text(120, 30, "SCORE: 0", hudFont).setOrigin(0.5).setDepth(10)
  }

  private createHealthPanel(hudFont: any) {
    this.healthBg = this.scene.add.rectangle(this.scene.scale.width - 120, 30, 200, 40, COLORS.DARK_BG, 0.9).setDepth(9)
    this.healthBg.setStrokeStyle(2, COLORS.DANGER, 1)
    this.healthText = this.scene.add
      .text(this.scene.scale.width - 120, 30, "HEALTH: 3", hudFont)
      .setOrigin(0.5)
      .setDepth(10)

    // Health bar
    this.healthBarBg = this.scene.add.rectangle(this.scene.scale.width - 120, 55, 160, 8, 0x333333, 0.8).setDepth(9)
    this.healthBar = this.scene.add.rectangle(this.scene.scale.width - 120, 55, 160, 8, COLORS.PRIMARY, 1).setDepth(10)
  }

  private createWavePanel(hudFont: any) {
    this.waveBg = this.scene.add.rectangle(this.scene.scale.width / 2, 30, 150, 40, COLORS.DARK_BG, 0.9).setDepth(9)
    this.waveBg.setStrokeStyle(2, 0x3742fa, 1)
    this.waveText = this.scene.add
      .text(this.scene.scale.width / 2, 30, "WAVE: 1", hudFont)
      .setOrigin(0.5)
      .setDepth(10)
  }

  private createEnemiesPanel(hudFont: any) {
    this.enemiesLeftBg = this.scene.add
      .rectangle(this.scene.scale.width / 2, 70, 180, 35, COLORS.DARK_BG, 0.8)
      .setDepth(9)
    this.enemiesLeftBg.setStrokeStyle(2, COLORS.WARNING, 1)
    this.enemiesLeftText = this.scene.add
      .text(this.scene.scale.width / 2, 70, "ENEMIES: 0", {
        fontSize: "16px",
        color: "#ffa502",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(10)
  }

  private createBuffText() {
    this.buffText = this.scene.add
      .text(this.scene.scale.width / 2, 120, "", {
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
  }

  private createComboText() {
    this.comboText = this.scene.add
      .text(this.scene.scale.width - 50, 100, "", {
        fontSize: "24px",
        color: "#ffa502",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(1, 0.5)
      .setDepth(11)
  }

  private createPlayerNameText(playerName: string) {
    this.playerNameText = this.scene.add
      .text(0, 0, playerName, {
        fontSize: "18px",
        color: "#00ff88",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: "#00ff88",
          blur: 8,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setDepth(10)
  }

  private addPulsingEffects() {
    this.scene.tweens.add({
      targets: [this.scoreBg, this.healthBg, this.waveBg, this.enemiesLeftBg],
      alpha: { from: 0.9, to: 0.7 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })
  }

  updateScore(score: number) {
    const newScoreText = `SCORE: ${score}`
    if (this.scoreText.text !== newScoreText) {
      this.scoreText.setText(newScoreText)
      this.scene.tweens.add({
        targets: this.scoreText,
        scale: [1, 1.2, 1],
        duration: 200,
        ease: "Back.easeOut",
      })
    }
  }

  updateHealth(health: number, maxHealth: number) {
    this.healthText.setText(`HEALTH: ${health}`)

    const healthPercent = health / maxHealth
    const targetWidth = 160 * healthPercent

    this.scene.tweens.add({
      targets: this.healthBar,
      width: targetWidth,
      duration: 300,
      ease: "Quad.easeOut",
    })

    // Change color based on health
    if (healthPercent > 0.6) {
      this.healthBar.setFillStyle(COLORS.PRIMARY)
    } else if (healthPercent > 0.3) {
      this.healthBar.setFillStyle(COLORS.WARNING)
    } else {
      this.healthBar.setFillStyle(COLORS.DANGER)
    }
  }

  updateWave(wave: number) {
    this.waveText.setText(`WAVE: ${wave}`)
  }

  updateEnemiesLeft(count: number) {
    this.enemiesLeftText.setText(`ENEMIES: ${count}`)
  }

  updatePlayerNamePosition(x: number, y: number) {
    this.playerNameText.setPosition(x, y - 50)
  }

  showBuffText(text: string, color: number, duration: number, onEnd?: () => void) {
    this.buffText
      .setText(text)
      .setColor(`#${color.toString(16)}`)
      .setScale(0)

    this.scene.tweens.add({
      targets: this.buffText,
      scale: [0, 1.2, 1],
      duration: 400,
      ease: "Back.easeOut",
    })

    this.scene.time.delayedCall(duration, () => {
      if (onEnd) onEnd()
      this.scene.tweens.add({
        targets: this.buffText,
        alpha: { from: 1, to: 0 },
        scale: 0.8,
        duration: 300,
        ease: "Power2.easeIn",
        onComplete: () => {
          this.buffText.setText("").setAlpha(1).setScale(1)
        },
      })
    })
  }

  showCombo(count: number) {
    this.comboText.setText(`${count}x COMBO!`)
    this.scene.tweens.add({
      targets: this.comboText,
      scale: [1, 1.3, 1],
      duration: 200,
      ease: "Back.easeOut",
    })
  }

  clearCombo() {
    this.comboText.setText("")
  }

  hidePlayerName() {
    this.playerNameText.setVisible(false)
  }

  destroy() {
    // Clean up all UI elements
    this.scoreText?.destroy()
    this.healthText?.destroy()
    this.buffText?.destroy()
    this.waveText?.destroy()
    this.enemiesLeftText?.destroy()
    this.playerNameText?.destroy()
    this.comboText?.destroy()
    this.scoreBg?.destroy()
    this.healthBg?.destroy()
    this.waveBg?.destroy()
    this.enemiesLeftBg?.destroy()
    this.healthBarBg?.destroy()
    this.healthBar?.destroy()
  }
}
