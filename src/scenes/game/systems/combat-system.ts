import type Phaser from "phaser"
import type Player from "@/objects/Player"
import type Bullet from "@/objects/Bullet"
import type Enemy from "@/objects/Enemy"
import { VisualEffects } from "../effects/visual-effects"
import { ParticleSystem } from "../effects/particle-system"
import { GAME_CONFIG, COLORS } from "../config/game-config"

export class CombatSystem {
  private scene: Phaser.Scene
  private visualEffects: VisualEffects
  private particleSystem: ParticleSystem
  private onScoreUpdate: (points: number) => void
  private onComboUpdate: (count: number) => void
  private onEnemyDestroyed: () => void

  constructor(
    scene: Phaser.Scene,
    visualEffects: VisualEffects,
    particleSystem: ParticleSystem,
    callbacks: {
      onScoreUpdate: (points: number) => void
      onComboUpdate: (count: number) => void
      onEnemyDestroyed: () => void
    },
  ) {
    this.scene = scene
    this.visualEffects = visualEffects
    this.particleSystem = particleSystem
    this.onScoreUpdate = callbacks.onScoreUpdate
    this.onComboUpdate = callbacks.onComboUpdate
    this.onEnemyDestroyed = callbacks.onEnemyDestroyed
  }

  handleBulletHitEnemy(bullet: Bullet, enemy: Enemy, comboCount: number) {
    if (!bullet.active) return

    bullet.setActive(false).setVisible(false)

    // Visual effects
    this.particleSystem.explodeHit(enemy.x, enemy.y)
    this.visualEffects.createHitEffect(enemy.x, enemy.y)

    enemy.destroy()

    // Calculate score with combo
    let scoreGain = GAME_CONFIG.COMBO.BASE_SCORE
    if (comboCount > 1) {
      scoreGain = GAME_CONFIG.COMBO.BASE_SCORE + (comboCount - 1) * GAME_CONFIG.COMBO.BONUS_MULTIPLIER
      this.onComboUpdate(comboCount)
    }

    this.onScoreUpdate(scoreGain)
    this.visualEffects.createScorePopup(enemy.x, enemy.y - 30, `+${scoreGain}`)
    this.onEnemyDestroyed()
  }

  handlePlayerHitByEnemy(player: Player, enemy: Enemy, hasShield: boolean): boolean {
    // Enhanced destruction effect
    this.particleSystem.explodeDestruction(enemy.x, enemy.y)
    this.visualEffects.createExplosionRing(enemy.x, enemy.y)
    enemy.destroy()

    if (hasShield) {
      this.visualEffects.createShieldEffect(player.x, player.y)
      return false // No damage taken
    }

    // Damage effects
    this.visualEffects.createDamageEffect()
    this.visualEffects.shakeCamera(200, 0.02)
    return true // Damage taken
  }

  handlePlayerHitByBullet(bullet: Bullet, player: Player, hasShield: boolean): boolean {
    if (!bullet.active) return false

    bullet.setActive(false).setVisible(false)

    if (hasShield) {
      this.visualEffects.createShieldEffect(player.x, player.y)
      return false // No damage taken
    }

    // Damage effects
    this.visualEffects.createDamageEffect()
    this.visualEffects.shakeCamera(150, 0.015)
    return true // Damage taken
  }

  createMuzzleFlash(x: number, y: number) {
    this.visualEffects.createMuzzleFlash(x, y)
  }

  createGameOverEffect(x: number, y: number) {
    this.visualEffects.flashScreen(COLORS.DANGER, 0.5, 500)
    this.visualEffects.shakeCamera(500, 0.03)
    this.particleSystem.explodeDestruction(x, y)
  }
}
