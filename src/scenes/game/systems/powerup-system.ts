import Phaser from "phaser"
import PowerUp from "@/objects/PowerUp" // Declare PowerUp variable
import Player from "@/objects/Player"
import type { PowerType } from "@/objects/PowerUp"
import { VisualEffects } from "../effects/visual-effects"
import { ParticleSystem } from "../effects/particle-system"
import { GAME_CONFIG, COLORS } from "../config/game-config"
export class PowerUpSystem {
  private scene: Phaser.Scene
  private visualEffects: VisualEffects
  private particleSystem: ParticleSystem
  private powerUps: Phaser.Physics.Arcade.Group
  private onBuffUpdate: (text: string, color: number, duration: number, onEnd?: () => void) => void
  private onHealthUpdate: (health: number) => void

  // Power-up states
  public triple = false
  public speedBoost = false
  public shield = false

  constructor(
    scene: Phaser.Scene,
    powerUps: Phaser.Physics.Arcade.Group,
    visualEffects: VisualEffects,
    particleSystem: ParticleSystem,
    callbacks: {
      onBuffUpdate: (text: string, color: number, duration: number, onEnd?: () => void) => void
      onHealthUpdate: (health: number) => void
    },
  ) {
    this.scene = scene
    this.powerUps = powerUps
    this.visualEffects = visualEffects
    this.particleSystem = particleSystem
    this.onBuffUpdate = callbacks.onBuffUpdate
    this.onHealthUpdate = callbacks.onHealthUpdate
  }

  handlePowerUpCollection(player: Player, powerUp: PowerUp, currentHealth: number, maxHealth: number): number {
    // Enhanced collection effect
    this.particleSystem.explodePowerUp(powerUp.x, powerUp.y)
    this.visualEffects.createPowerUpCollectionEffect(powerUp.x, powerUp.y)
    this.visualEffects.flashScreen(COLORS.WARNING, 0.2, 150)

    powerUp.destroy()

    let newHealth = currentHealth

    switch (powerUp.ptype) {
      case "trip":
        this.activateTripleShot()
        break
      case "speed":
        this.activateSpeedBoost(player)
        break
      case "shield":
        this.activateShield(player)
        break
      case "heal":
        newHealth = this.activateHeal(currentHealth, maxHealth, player)
        break
    }

    return newHealth
  }

  private activateTripleShot() {
    this.triple = true
    this.onBuffUpdate("TRIPLE SHOT ACTIVATED!", COLORS.PRIMARY, GAME_CONFIG.POWERUPS.TRIPLE_SHOT_DURATION, () => {
      this.triple = false
    })
  }

  private activateSpeedBoost(player: Player) {
    if (!this.speedBoost) {
      this.speedBoost = true
      ;(player as any).speed *= 1.5
    }
    this.onBuffUpdate("SPEED BOOST ACTIVATED!", COLORS.SECONDARY, GAME_CONFIG.POWERUPS.SPEED_BOOST_DURATION, () => {
      this.speedBoost = false
      ;(player as any).speed /= 1.5
    })
  }

  private activateShield(player: Player) {
    this.shield = true
    this.onBuffUpdate("SHIELD ACTIVATED!", COLORS.SHIELD, GAME_CONFIG.POWERUPS.SHIELD_DURATION, () => {
      this.shield = false
    })

    this.visualEffects.createShieldActivationEffect(player.x, player.y)
  }

  private activateHeal(currentHealth: number, maxHealth: number, player: Player): number {
    let newHealth = currentHealth
    if (currentHealth < maxHealth) {
      newHealth = currentHealth + 1
      this.onHealthUpdate(newHealth)
      this.visualEffects.createHealEffect(player.x, player.y)
    }
    this.onBuffUpdate("HEALTH RESTORED!", COLORS.HEAL, GAME_CONFIG.POWERUPS.HEAL_DISPLAY_DURATION)
    return newHealth
  }

  spawnPowerUp() {
    const types: PowerType[] = ["trip", "speed", "shield", "heal"]
    const ptype = Phaser.Utils.Array.GetRandom(types)
    const x = Phaser.Math.Between(80, this.scene.scale.width - 80)
    const y = Phaser.Math.Between(80, this.scene.scale.height - 80)

    const powerUp = new PowerUp(this.scene, x, y, ptype) // Use declared PowerUp variable
    this.powerUps.add(powerUp)

    // Spawn effect
    this.particleSystem.explodePowerUp(x, y)
    this.visualEffects.createPowerUpSpawnEffect(x, y)
  }

  reset() {
    this.triple = false
    this.speedBoost = false
    this.shield = false
  }
}
