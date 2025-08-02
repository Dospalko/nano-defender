import type Phaser from "phaser"
import { COLORS, GAME_CONFIG } from "../config/game-config"
export class BackgroundSystem {
  private scene: Phaser.Scene
  private stars: Phaser.GameObjects.Arc[] = []
  private gridLines: Phaser.GameObjects.Rectangle[] = []
  private scanLines: Phaser.GameObjects.Rectangle[] = []

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createBackground()
  }

  private createBackground() {
    this.createStarfield()
    this.createGrid()
    this.createScanLines()
  }

  private createStarfield() {
    for (let i = 0; i < GAME_CONFIG.BACKGROUND.STAR_COUNT; i++) {
      const star = this.scene.add.circle(
        Math.random() * this.scene.scale.width,
        Math.random() * this.scene.scale.height,
        Math.random() * 2 + 0.5,
        COLORS.WHITE,
        Math.random() * 0.8 + 0.2,
      )
      this.stars.push(star)

      this.scene.tweens.add({
        targets: star,
        alpha: { from: 0.2, to: 1 },
        duration: 1000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      })
    }
  }

  private createGrid() {
    const gridSize = GAME_CONFIG.BACKGROUND.GRID_SIZE

    // Vertical lines
    for (let x = 0; x < this.scene.scale.width; x += gridSize) {
      const line = this.scene.add.rectangle(
        x,
        this.scene.scale.height / 2,
        1,
        this.scene.scale.height,
        COLORS.PRIMARY,
        0.1,
      )
      this.gridLines.push(line)
    }

    // Horizontal lines
    for (let y = 0; y < this.scene.scale.height; y += gridSize) {
      const line = this.scene.add.rectangle(
        this.scene.scale.width / 2,
        y,
        this.scene.scale.width,
        1,
        COLORS.PRIMARY,
        0.1,
      )
      this.gridLines.push(line)
    }

    this.scene.tweens.add({
      targets: this.gridLines,
      alpha: { from: 0.05, to: 0.15 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })
  }

  private createScanLines() {
    for (let i = 0; i < GAME_CONFIG.BACKGROUND.SCAN_LINE_COUNT; i++) {
      const scanLine = this.scene.add.rectangle(
        this.scene.scale.width / 2,
        -5,
        this.scene.scale.width,
        3,
        COLORS.PRIMARY,
        0.6,
      )
      this.scanLines.push(scanLine)

      this.scene.tweens.add({
        targets: scanLine,
        y: this.scene.scale.height + 5,
        duration: GAME_CONFIG.BACKGROUND.SCAN_DURATION,
        repeat: -1,
        ease: "Linear",
        delay: i * 3000,
      })
    }
  }

  destroy() {
    this.stars.forEach((star) => star.destroy())
    this.gridLines.forEach((line) => line.destroy())
    this.scanLines.forEach((line) => line.destroy())
  }
}
