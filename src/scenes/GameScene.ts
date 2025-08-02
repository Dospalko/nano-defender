import Phaser from "phaser"
import Player from "@/objects/Player"
import Bullet from "@/objects/Bullet"
import Enemy from "@/objects/Enemy"
import PowerUp, { type PowerType } from "@/objects/PowerUp"
import WaveManager from "@/objects/WaveManager"
import { createAnimatedBackground } from "./game/Background"
import { createEnhancedHUD } from "./game/HUD"
import { createScreenEffects } from "./game/ScreenEffects"
import { createParticleSystems } from "./game/Particles"

export default class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  player!: Player
  bullets!: Phaser.Physics.Arcade.Group
  enemies!: Phaser.Physics.Arcade.Group
  powerUps!: Phaser.Physics.Arcade.Group
  enemyBullets!: Phaser.Physics.Arcade.Group
  particles!: Phaser.GameObjects.Particles.ParticleEmitter
  explosionParticles!: Phaser.GameObjects.Particles.ParticleEmitter
  powerUpParticles!: Phaser.GameObjects.Particles.ParticleEmitter

  // Background elements
  stars: Phaser.GameObjects.Arc[] = []
  gridLines: Phaser.GameObjects.Rectangle[] = []
  scanLines: Phaser.GameObjects.Rectangle[] = []

  // Screen effects
  screenFlash?: Phaser.GameObjects.Rectangle
  damageOverlay?: Phaser.GameObjects.Rectangle

  // Game state
  lastEnemy = 0
  lastPower = 0
  score = 0
  health = 3
  maxHealth = 5
  triple = false
  speedBoost = false
  shield = false
  isGameOver = false
  lastShot = 0
  shootCooldown = 400
  wasd: any
  playerName = ""
  wavePause = false
  enemiesLeftStatic = 0

  // UI Elements
  scoreText!: Phaser.GameObjects.Text
  healthText!: Phaser.GameObjects.Text
  buffText!: Phaser.GameObjects.Text
  waveText!: Phaser.GameObjects.Text
  enemiesLeftText!: Phaser.GameObjects.Text
  playerNameText!: Phaser.GameObjects.Text

  // UI Backgrounds
  scoreBg!: Phaser.GameObjects.Rectangle
  healthBg!: Phaser.GameObjects.Rectangle
  waveBg!: Phaser.GameObjects.Rectangle
  enemiesLeftBg!: Phaser.GameObjects.Rectangle

  // Health bars
  healthBarBg!: Phaser.GameObjects.Rectangle
  healthBar!: Phaser.GameObjects.Rectangle

  waveManager!: WaveManager

  // Combo system
  comboCount = 0
  comboTimer = 0
  comboText!: Phaser.GameObjects.Text

  constructor() {
    super("Game")
  }

  init(data: { playerName?: string }) {
    this.lastEnemy = 0
    this.lastPower = 0
    this.score = 0
    this.health = 3
    this.triple = this.speedBoost = this.shield = false
    this.isGameOver = false
    this.playerName = data.playerName || "Player"
    this.wavePause = false
    this.comboCount = 0
    this.comboTimer = 0
  }

  create() {
    const { width, height } = this.scale

    // Modular: Animated background
    createAnimatedBackground(this, this.stars, this.gridLines, this.scanLines)

    // Modular: Screen effects
    const effects = createScreenEffects(this)
    this.screenFlash = effects.screenFlash
    this.damageOverlay = effects.damageOverlay

    // Input setup
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })

    // Game objects
    this.player = new Player(this, width / 2, height / 2)
    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true, maxSize: 120 })
    this.enemies = this.physics.add.group({ classType: Enemy })
    this.powerUps = this.physics.add.group({ classType: PowerUp, runChildUpdate: true })
    this.enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true, maxSize: 60 })

    // Modular: Particle systems
    const particles = createParticleSystems(this)
    this.particles = particles.particles
    this.explosionParticles = particles.explosionParticles
    this.powerUpParticles = particles.powerUpParticles

    // Modular: HUD
    const hud = createEnhancedHUD(this)
    this.scoreBg = hud.scoreBg
    this.scoreText = hud.scoreText
    this.healthBg = hud.healthBg
    this.healthText = hud.healthText
    this.healthBarBg = hud.healthBarBg
    this.healthBar = hud.healthBar
    this.waveBg = hud.waveBg
    this.waveText = hud.waveText
    this.enemiesLeftBg = hud.enemiesLeftBg
    this.enemiesLeftText = hud.enemiesLeftText
    this.buffText = hud.buffText
    this.comboText = hud.comboText

    // Player name with enhanced styling
    this.playerNameText = this.add
      .text(this.player.x, this.player.y - 50, this.playerName, {
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

    // Input handlers
    this.input.on("pointerdown", () => this.shoot())

    // Collision detection
    this.setupCollisions()

    // Wave manager
    this.setupWaveManager()

    // Start first wave
    this.waveManager.startWave(1)
  }

  // ...existing code...

  setupCollisions() {
    this.physics.add.overlap(this.bullets, this.enemies, (b, e) => this.hitEnemy(b as Bullet, e as Enemy))
    this.physics.add.overlap(this.player, this.enemies, (_p, e) => this.damagePlayer(e as Enemy))
    this.physics.add.overlap(this.player, this.powerUps, (_p, p) => this.collectPowerUp(p as PowerUp))
    this.physics.add.overlap(this.player, this.enemyBullets, (_p, b) => this.damagePlayerBullet(b as Bullet))
  }

  setupWaveManager() {
    this.waveManager = new WaveManager({
      scene: this,
      enemyGroup: this.enemies,
      onWaveStart: (wave) => {
        this.waveText.setText(`WAVE: ${wave}`)
        this.enemiesLeftStatic = 5 + wave * 3
        this.enemiesLeftText.setText(`ENEMIES: ${this.enemiesLeftStatic}`)

        // Enhanced wave start effect
        this.showWaveStartEffect(wave)
        this.wavePause = true

        this.time.delayedCall(1500, () => {
          this.buffText.setText("")
          this.wavePause = false
        })
      },
      onWaveEnd: (wave) => {
        this.showWaveCompleteEffect(wave)
        this.wavePause = true

        this.time.delayedCall(2000, () => {
          this.buffText.setText("")
          this.showShopAfterWave()
        })
      },
    })
  }

  showWaveStartEffect(wave: number) {
    // Screen flash
    this.flashScreen(0x00ff88, 0.3, 200)

    // Wave text effect
    this.buffText.setText(`WAVE ${wave} INCOMING!`).setColor("#ffa502").setScale(0)

    this.tweens.add({
      targets: this.buffText,
      scale: { from: 0, to: [1.2, 1] },
      duration: 800,
      ease: "Back.easeOut",
    })

    // Screen shake
    this.cameras.main.shake(300, 0.01)
  }

  showWaveCompleteEffect(wave: number) {
    // Screen flash
    this.flashScreen(0x00ff88, 0.4, 300)

    // Wave complete text
    this.buffText.setText(`WAVE ${wave} COMPLETE!`).setColor("#00ff88").setScale(0)

    this.tweens.add({
      targets: this.buffText,
      scale: { from: 0, to: [1.3, 1] },
      duration: 1000,
      ease: "Back.easeOut",
    })

    // Bonus score effect
    this.score += wave * 50
    this.createScorePopup(this.scale.width / 2, this.scale.height / 2 + 50, `+${wave * 50} WAVE BONUS!`)
  }

  update(_t: number, dt: number) {
    if (this.isGameOver) return

    if (!this.wavePause) this.waveManager.update(dt)

    this.lastShot += dt
    this.comboTimer += dt

    // Reset combo after 3 seconds
    if (this.comboTimer > 3000 && this.comboCount > 0) {
      this.comboCount = 0
      this.comboText.setText("")
    }

    this.player.update(this.cursors, this.input.activePointer, this.wasd)
    this.playerNameText.setPosition(this.player.x, this.player.y - 50)

    // Update HUD with animations
    this.updateHUD()

    // Power-up spawning
    this.lastPower += dt
    if (this.lastPower > 12000) {
      this.spawnPowerUp()
      this.lastPower = 0
    }

    // Enemy AI
    this.enemies.children.iterate((o) => {
      ;(o as Enemy).pursue(this.player)
      return true
    })

    // Update health bar
    this.updateHealthBar()
  }

  updateHUD() {
    // Animate score changes
    const newScoreText = `SCORE: ${this.score}`
    if (this.scoreText.text !== newScoreText) {
      this.scoreText.setText(newScoreText)
      this.tweens.add({
        targets: this.scoreText,
        scale: { from: 1, to: [1.2, 1] },
        duration: 200,
        ease: "Back.easeOut",
      })
    }

    this.healthText.setText(`HEALTH: ${this.health}`)
    this.waveText.setText(`WAVE: ${this.waveManager.getCurrentWave()}`)
    this.enemiesLeftText.setText(`ENEMIES: ${this.enemiesLeftStatic}`)
  }

  updateHealthBar() {
    const healthPercent = this.health / this.maxHealth
    const targetWidth = 160 * healthPercent

    // Animate health bar
    this.tweens.add({
      targets: this.healthBar,
      width: targetWidth,
      duration: 300,
      ease: "Quad.easeOut",
    })

    // Change color based on health
    if (healthPercent > 0.6) {
      this.healthBar.setFillStyle(0x00ff88)
    } else if (healthPercent > 0.3) {
      this.healthBar.setFillStyle(0xffa502)
    } else {
      this.healthBar.setFillStyle(0xff4757)
    }
  }

  shoot() {
    if (this.lastShot < this.shootCooldown) return
    this.lastShot = 0

    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.input.activePointer.worldX,
      this.input.activePointer.worldY,
    )

    if (this.triple) {
      ;[-0.25, 0, 0.25].forEach((offset) => this.fireSingleBullet(angle + offset))
    } else {
      this.fireSingleBullet(angle)
    }

    // Muzzle flash effect
    this.createMuzzleFlash()
  }

  fireSingleBullet(angle: number) {
    const bullet = this.bullets.get() as Bullet
    if (!bullet) return
    bullet.fire(this.player.x, this.player.y, angle)
  }

  createMuzzleFlash() {
    const flash = this.add.circle(this.player.x, this.player.y, 15, 0xffffff, 0.8).setDepth(5)

    this.tweens.add({
      targets: flash,
      scale: { from: 1, to: 2 },
      alpha: { from: 0.8, to: 0 },
      duration: 100,
      ease: "Power2.easeOut",
      onComplete: () => flash.destroy(),
    })
  }

  damagePlayer(enemy: Enemy) {
    if (this.isGameOver) return

    // Enhanced destruction effect
    this.explosionParticles.explode(15, enemy.x, enemy.y)
    this.createExplosionRing(enemy.x, enemy.y)
    enemy.destroy()

    if (this.shield) {
      this.createShieldEffect()
      return
    }

    this.health--
    this.healthText.setText(`HEALTH: ${this.health}`)

    // Damage effects
    this.createDamageEffect()
    this.cameras.main.shake(200, 0.02)

    if (this.health <= 0) this.gameOver()
  }

  damagePlayerBullet(bullet: Bullet) {
    if (!bullet.active) return
    bullet.setActive(false).setVisible(false)

    if (this.shield || this.isGameOver) {
      if (this.shield) this.createShieldEffect()
      return
    }

    this.health--
    this.healthText.setText(`HEALTH: ${this.health}`)

    // Damage effects
    this.createDamageEffect()
    this.cameras.main.shake(150, 0.015)

    if (this.health <= 0) this.gameOver()
  }

  hitEnemy(bullet: Bullet, enemy: Enemy) {
    if (!bullet.active) return
    bullet.setActive(false).setVisible(false)

    // Enhanced hit effects
    this.particles.explode(12, enemy.x, enemy.y)
    this.createHitEffect(enemy.x, enemy.y)

    enemy.destroy()

    // Combo system
    this.comboCount++
    this.comboTimer = 0

    let scoreGain = 10
    if (this.comboCount > 1) {
      scoreGain = 10 + (this.comboCount - 1) * 5
      this.comboText.setText(`${this.comboCount}x COMBO!`)
      this.tweens.add({
        targets: this.comboText,
        scale: { from: 1, to: [1.3, 1] },
        duration: 200,
        ease: "Back.easeOut",
      })
    }

    this.score += scoreGain
    this.createScorePopup(enemy.x, enemy.y - 30, `+${scoreGain}`)

    this.enemiesLeftStatic = Math.max(0, this.enemiesLeftStatic - 1)
    this.enemiesLeftText.setText(`ENEMIES: ${this.enemiesLeftStatic}`)
  }

  collectPowerUp(power: PowerUp) {
    // Enhanced collection effect
    this.powerUpParticles.explode(20, power.x, power.y)
    this.createPowerUpCollectionEffect(power.x, power.y)
    this.flashScreen(0xffa502, 0.2, 150)

    power.destroy()

    switch (power.ptype) {
      case "trip":
        return this.activateTripleShot()
      case "speed":
        return this.activateSpeedBoost()
      case "shield":
        return this.activateShield()
      case "heal":
        return this.activateHeal()
    }
  }

  activateTripleShot() {
    this.triple = true
    this.setBuffText("TRIPLE SHOT ACTIVATED!", 0x00ff88, 8000, () => {
      this.triple = false
    })
  }

  activateSpeedBoost() {
    if (!this.speedBoost) {
      this.speedBoost = true
      ;(this.player as any).speed *= 1.5
    }
    this.setBuffText("SPEED BOOST ACTIVATED!", 0x00ccff, 8000, () => {
      this.speedBoost = false
      ;(this.player as any).speed /= 1.5
    })
  }

  activateShield() {
    this.shield = true
    this.setBuffText("SHIELD ACTIVATED!", 0xffd93c, 5000, () => {
      this.shield = false
    })

    // Shield visual effect on player
    this.createShieldActivationEffect()
  }

  activateHeal() {
    if (this.health < this.maxHealth) {
      this.health++
      this.healthText.setText(`HEALTH: ${this.health}`)
      this.createHealEffect()
    }
    this.setBuffText("HEALTH RESTORED!", 0xff4a4a, 1500)
  }

  setBuffText(text: string, color: number, duration: number, onEnd?: () => void) {
    this.buffText
      .setText(text)
      .setColor(`#${color.toString(16)}`)
      .setScale(0)

    this.tweens.add({
      targets: this.buffText,
      scale: { from: 0, to: [1.2, 1] },
      duration: 400,
      ease: "Back.easeOut",
    })

    this.time.delayedCall(duration, () => {
      if (onEnd) onEnd()
      this.tweens.add({
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

  // Visual Effects
  flashScreen(color: number, alpha: number, duration: number) {
    if (!this.screenFlash) return

    this.screenFlash.setFillStyle(color, alpha)
    this.tweens.add({
      targets: this.screenFlash,
      alpha: { from: alpha, to: 0 },
      duration,
      ease: "Power2.easeOut",
    })
  }

  createDamageEffect() {
    if (!this.damageOverlay) return

    this.damageOverlay.setAlpha(0.3)
    this.tweens.add({
      targets: this.damageOverlay,
      alpha: 0,
      duration: 200,
      ease: "Power2.easeOut",
    })
  }

  createShieldEffect() {
    const shield = this.add.circle(this.player.x, this.player.y, 40, 0xffd93c, 0).setDepth(8)
    shield.setStrokeStyle(3, 0xffd93c, 0.8)

    this.tweens.add({
      targets: shield,
      scale: { from: 0.5, to: 1.5 },
      alpha: { from: 0.8, to: 0 },
      duration: 300,
      ease: "Power2.easeOut",
      onComplete: () => shield.destroy(),
    })
  }

  createShieldActivationEffect() {
    const rings = []
    for (let i = 0; i < 3; i++) {
      const ring = this.add.circle(this.player.x, this.player.y, 30 + i * 10, 0xffd93c, 0).setDepth(7)
      ring.setStrokeStyle(2, 0xffd93c, 0.6 - i * 0.2)
      rings.push(ring)

      this.tweens.add({
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

  createHitEffect(x: number, y: number) {
    const flash = this.add.circle(x, y, 20, 0xffffff, 0.8).setDepth(6)

    this.tweens.add({
      targets: flash,
      scale: { from: 0.5, to: 2 },
      alpha: { from: 0.8, to: 0 },
      duration: 200,
      ease: "Power2.easeOut",
      onComplete: () => flash.destroy(),
    })
  }

  createExplosionRing(x: number, y: number) {
    const ring = this.add.circle(x, y, 30, 0xff6b6b, 0).setDepth(6)
    ring.setStrokeStyle(4, 0xff6b6b, 1)

    this.tweens.add({
      targets: ring,
      scale: { from: 0.2, to: 2 },
      alpha: { from: 1, to: 0 },
      duration: 400,
      ease: "Power2.easeOut",
      onComplete: () => ring.destroy(),
    })
  }

  createPowerUpCollectionEffect(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const spark = this.add.circle(x, y, 3, 0xffa502, 1).setDepth(6)
      const angle = (i / 8) * Math.PI * 2
      const distance = 60

      this.tweens.add({
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

  createHealEffect() {
    const healRing = this.add.circle(this.player.x, this.player.y, 35, 0xff4a4a, 0).setDepth(7)
    healRing.setStrokeStyle(3, 0xff4a4a, 0.8)

    this.tweens.add({
      targets: healRing,
      scale: { from: 0.3, to: 1.5 },
      alpha: { from: 0.8, to: 0 },
      duration: 600,
      ease: "Power2.easeOut",
      onComplete: () => healRing.destroy(),
    })
  }

  createScorePopup(x: number, y: number, text: string) {
    const popup = this.add
      .text(x, y, text, {
        fontSize: "16px",
        color: "#ffa502",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(11)

    this.tweens.add({
      targets: popup,
      y: y - 50,
      alpha: { from: 1, to: 0 },
      scale: { from: 1, to: 1.2 },
      duration: 1000,
      ease: "Power2.easeOut",
      onComplete: () => popup.destroy(),
    })
  }

  gameOver() {
    this.isGameOver = true
    this.buffText.setText("")

    // Enhanced game over effect
    this.flashScreen(0xff0000, 0.5, 500)
    this.cameras.main.shake(500, 0.03)

    this.player.setActive(false).setVisible(false)
    this.playerNameText.setVisible(false)

    // Explosion at player position
    this.explosionParticles.explode(30, this.player.x, this.player.y)

    this.time.delayedCall(1000, () => this.scene.start("GameOver", { score: this.score, playerName: this.playerName }))
  }

  showShopAfterWave() {
    this.scene.pause()
    this.scene.launch("Shop", {
      score: this.score,
      onClose: () => {
        this.waveManager.startWave(this.waveManager.getCurrentWave() + 1)
      },
    })
  }

  spawnPowerUp() {
    const types: PowerType[] = ["trip", "speed", "shield", "heal"]
    const ptype = Phaser.Utils.Array.GetRandom(types)
    const x = Phaser.Math.Between(80, this.scale.width - 80)
    const y = Phaser.Math.Between(80, this.scale.height - 80)

    const powerUp = new PowerUp(this, x, y, ptype)
    this.powerUps.add(powerUp)

    // Spawn effect
    this.powerUpParticles.explode(10, x, y)
    this.createPowerUpSpawnEffect(x, y)
  }

  createPowerUpSpawnEffect(x: number, y: number) {
    const glow = this.add.circle(x, y, 50, 0xffa502, 0.3).setDepth(4)

    this.tweens.add({
      targets: glow,
      scale: { from: 0, to: 1.5 },
      alpha: { from: 0.5, to: 0 },
      duration: 800,
      ease: "Power2.easeOut",
      onComplete: () => glow.destroy(),
    })
  }
}
