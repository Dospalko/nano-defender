import type Phaser from "phaser"
import { COLORS, GAME_CONFIG } from "../config/game-config"
export class VisualEffects {
  private scene: Phaser.Scene
  private screenFlash?: Phaser.GameObjects.Rectangle
  private damageOverlay?: Phaser.GameObjects.Rectangle

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createScreenEffects()
  }

  private createScreenEffects() {
    this.screenFlash = this.scene.add
      .rectangle(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        this.scene.scale.width,
        this.scene.scale.height,
        COLORS.WHITE,
        0,
      )
      .setDepth(100)

    this.damageOverlay = this.scene.add
      .rectangle(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        this.scene.scale.width,
        this.scene.scale.height,
        COLORS.DANGER,
        0,
      )
      .setDepth(99)
  }

  flashScreen(color: number, alpha: number, duration: number) {
    if (!this.screenFlash) return

    this.screenFlash.setFillStyle(color, alpha)
    this.scene.tweens.add({
      targets: this.screenFlash,
      alpha: { from: alpha, to: 0 },
      duration,
      ease: "Power2.easeOut",
    })
  }

  createDamageEffect() {
    if (!this.damageOverlay) return

    this.damageOverlay.setAlpha(0.3)
    this.scene.tweens.add({
      targets: this.damageOverlay,
      alpha: 0,
      duration: 200,
      ease: "Power2.easeOut",
    })
  }

  createMuzzleFlash(x: number, y: number) {
    const flash = this.scene.add.circle(x, y, 15, COLORS.WHITE, 0.8).setDepth(5)

    this.scene.tweens.add({
      targets: flash,
      scale: { from: 1, to: 2 },
      alpha: { from: 0.8, to: 0 },
      duration: GAME_CONFIG.EFFECTS.MUZZLE_FLASH_DURATION,
      ease: "Power2.easeOut",
      onComplete: () => flash.destroy(),
    })
  }

  createHitEffect(x: number, y: number) {
    const flash = this.scene.add.circle(x, y, 20, COLORS.WHITE, 0.8).setDepth(6)

    this.scene.tweens.add({
      targets: flash,
      scale: { from: 0.5, to: 2 },
      alpha: { from: 0.8, to: 0 },
      duration: 200,
      ease: "Power2.easeOut",
      onComplete: () => flash.destroy(),
    })
  }

  createExplosionRing(x: number, y: number) {
    const ring = this.scene.add.circle(x, y, 30, COLORS.EXPLOSION, 0).setDepth(6)
    ring.setStrokeStyle(4, COLORS.EXPLOSION, 1)

    this.scene.tweens.add({
      targets: ring,
      scale: { from: 0.2, to: 2 },
      alpha: { from: 1, to: 0 },
      duration: GAME_CONFIG.EFFECTS.EXPLOSION_DURATION,
      ease: "Power2.easeOut",
      onComplete: () => ring.destroy(),
    })
  }

  createShieldEffect(x: number, y: number) {
    const shield = this.scene.add.circle(x, y, 40, COLORS.SHIELD, 0).setDepth(8)
    shield.setStrokeStyle(3, COLORS.SHIELD, 0.8)

    this.scene.tweens.add({
      targets: shield,
      scale: { from: 0.5, to: 1.5 },
      alpha: { from: 0.8, to: 0 },
      duration: 300,
      ease: "Power2.easeOut",
      onComplete: () => shield.destroy(),
    })
  }

  createShieldActivationEffect(x: number, y: number) {
    for (let i = 0; i < 3; i++) {
      const ring = this.scene.add.circle(x, y, 30 + i * 10, COLORS.SHIELD, 0).setDepth(7)
      ring.setStrokeStyle(2, COLORS.SHIELD, 0.6 - i * 0.2)

      this.scene.tweens.add({
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

  createHealEffect(x: number, y: number) {
    const healRing = this.scene.add.circle(x, y, 35, COLORS.HEAL, 0).setDepth(7)
    healRing.setStrokeStyle(3, COLORS.HEAL, 0.8)

    this.scene.tweens.add({
      targets: healRing,
      scale: { from: 0.3, to: 1.5 },
      alpha: { from: 0.8, to: 0 },
      duration: 600,
      ease: "Power2.easeOut",
      onComplete: () => healRing.destroy(),
    })
  }

  createPowerUpCollectionEffect(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const spark = this.scene.add.circle(x, y, 3, COLORS.WARNING, 1).setDepth(6)
      const angle = (i / 8) * Math.PI * 2
      const distance = 60

      this.scene.tweens.add({
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

  createPowerUpSpawnEffect(x: number, y: number) {
    const glow = this.scene.add.circle(x, y, 50, COLORS.WARNING, 0.3).setDepth(4)

    this.scene.tweens.add({
      targets: glow,
      scale: { from: 0, to: 1.5 },
      alpha: { from: 0.5, to: 0 },
      duration: 800,
      ease: "Power2.easeOut",
      onComplete: () => glow.destroy(),
    })
  }

  createScorePopup(x: number, y: number, text: string) {
    const popup = this.scene.add
      .text(x, y, text, {
        fontSize: "16px",
        color: "#ffa502",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(11)

    this.scene.tweens.add({
      targets: popup,
      y: y - 50,
      alpha: { from: 1, to: 0 },
      scale: { from: 1, to: 1.2 },
      duration: 1000,
      ease: "Power2.easeOut",
      onComplete: () => popup.destroy(),
    })
  }

  shakeCamera(
    duration: number = GAME_CONFIG.EFFECTS.SCREEN_SHAKE_DURATION,
    intensity: number = GAME_CONFIG.EFFECTS.SCREEN_SHAKE_INTENSITY,
  ) {
    this.scene.cameras.main.shake(duration, intensity)
  }

  destroy() {
    this.screenFlash?.destroy()
    this.damageOverlay?.destroy()
  }
}
