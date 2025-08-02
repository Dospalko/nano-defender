import Phaser from "phaser"

export function createParticleSystems(scene: Phaser.Scene) {
  // Main particle system for hits
  const particles = scene.add.particles(0, 0, "particle", {
    speed: { min: 50, max: 150 },
    angle: { min: 0, max: 360 },
    lifespan: 400,
    scale: { start: 1.2, end: 0 },
    blendMode: "ADD",
    quantity: 0,
    tint: 0x00ff88,
  })

  // Explosion particles
  const explosionParticles = scene.add.particles(0, 0, "particle", {
    speed: { min: 100, max: 300 },
    angle: { min: 0, max: 360 },
    lifespan: 600,
    scale: { start: 1.5, end: 0 },
    blendMode: "ADD",
    quantity: 0,
    tint: 0xff6b6b,
  })

  // Power-up particles
  const powerUpParticles = scene.add.particles(0, 0, "particle", {
    speed: { min: 30, max: 80 },
    angle: { min: 0, max: 360 },
    lifespan: 800,
    scale: { start: 0.8, end: 0 },
    blendMode: "ADD",
    quantity: 0,
    tint: 0xffa502,
  })

  return { particles, explosionParticles, powerUpParticles }
}
