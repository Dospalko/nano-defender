import type Phaser from "phaser"
import { COLORS } from "../config/game-config"

export class ParticleSystem {
  private scene: Phaser.Scene
  public hitParticles!: Phaser.GameObjects.Particles.ParticleEmitter
  public explosionParticles!: Phaser.GameObjects.Particles.ParticleEmitter
  public powerUpParticles!: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createParticleSystems()
  }

  private createParticleSystems() {
    // Hit particles
    this.hitParticles = this.scene.add.particles(0, 0, "particle", {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      lifespan: 400,
      scale: { start: 1.2, end: 0 },
      blendMode: "ADD",
      quantity: 0,
      tint: COLORS.PRIMARY,
    })

    // Explosion particles
    this.explosionParticles = this.scene.add.particles(0, 0, "particle", {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      lifespan: 600,
      scale: { start: 1.5, end: 0 },
      blendMode: "ADD",
      quantity: 0,
      tint: COLORS.EXPLOSION,
    })

    // Power-up particles
    this.powerUpParticles = this.scene.add.particles(0, 0, "particle", {
      speed: { min: 30, max: 80 },
      angle: { min: 0, max: 360 },
      lifespan: 800,
      scale: { start: 0.8, end: 0 },
      blendMode: "ADD",
      quantity: 0,
      tint: COLORS.WARNING,
    })
  }

  explodeHit(x: number, y: number) {
    this.hitParticles.explode(12, x, y)
  }

  explodeDestruction(x: number, y: number) {
    this.explosionParticles.explode(15, x, y)
  }

  explodePowerUp(x: number, y: number) {
    this.powerUpParticles.explode(20, x, y)
  }

  destroy() {
    this.hitParticles.destroy()
    this.explosionParticles.destroy()
    this.powerUpParticles.destroy()
  }
}
