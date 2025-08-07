import Phaser from "phaser"
import Player from "@/objects/Player"
import Bullet from "@/objects/Bullet"
import Enemy from "@/objects/Enemy"
import PowerUp from "@/objects/PowerUp"
import { GAME_CONFIG } from "./game/config/game-config"
import type { GameState } from "./game/types/game-types"

// Define GameData type for scene initialization
type GameData = {
  playerName?: string
}

// Define GameTimers interface
interface GameTimers {
  lastEnemy: number
  lastPower: number
  lastShot: number
}

// Systems
import { InputSystem } from "./game/systems/input-system"
import { BackgroundSystem } from "./game/systems/background-system"
import { CombatSystem } from "./game//systems/combat-system"
import { PowerUpSystem } from "./game/systems/powerup-system"

// Effects
import { VisualEffects } from "./game/effects/visual-effects"
import { ParticleSystem } from "./game/effects/particle-system"

// UI
import { HUDSystem } from "./game/ui/hud-system"

// Managers
import { WaveManagerIntegration } from "./game/managers/wave-manager-integration"

export default class GameScene extends Phaser.Scene {
  // Core game objects
  private player!: Player
  private bullets!: Phaser.Physics.Arcade.Group
  private enemies!: Phaser.Physics.Arcade.Group
  private powerUps!: Phaser.Physics.Arcade.Group
  private enemyBullets!: Phaser.Physics.Arcade.Group

  // Systems
  private inputSystem!: InputSystem
  private backgroundSystem!: BackgroundSystem
  private combatSystem!: CombatSystem
  private powerUpSystem!: PowerUpSystem
  private visualEffects!: VisualEffects
  private particleSystem!: ParticleSystem
  public hudSystem!: HUDSystem
  public waveManager!: WaveManagerIntegration

  // Game state
  public gameState: GameState = {
    score: 0,
    health: GAME_CONFIG.PLAYER.INITIAL_HEALTH,
    maxHealth: GAME_CONFIG.PLAYER.MAX_HEALTH,
    isGameOver: false,
    wavePause: false,
    enemiesLeftStatic: 0,
    comboCount: 0,
    comboTimer: 0,
  }

  private timers: GameTimers = {
    lastEnemy: 0,
    lastPower: 0,
    lastShot: 0,
  }

  private playerName = ""

  constructor() {
    super("Game")
  }

  init(data: GameData) {
    this.resetGameState()
    this.playerName = data.playerName || "Player"
  }

  create() {
    const { width, height } = this.scale

    // Initialize systems
    this.initializeSystems()

    // Create game objects
    this.createGameObjects(width, height)

    // Setup collisions
    this.setupCollisions()

    // Start first wave
    this.waveManager.startWave(1)
  }

  private resetGameState() {
    const bonus = window.maxHealthBonus || 0;
    const maxHealth = GAME_CONFIG.PLAYER.MAX_HEALTH + bonus;
    this.gameState = {
      score: 0,
      health: Math.min(GAME_CONFIG.PLAYER.INITIAL_HEALTH, maxHealth),
      maxHealth,
      isGameOver: false,
      wavePause: false,
      enemiesLeftStatic: 0,
      comboCount: 0,
      comboTimer: 0,
    }

    this.timers = {
      lastEnemy: 0,
      lastPower: 0,
      lastShot: 0,
    }
  }

  private initializeSystems() {
    // Visual systems
    this.backgroundSystem = new BackgroundSystem(this)
    this.visualEffects = new VisualEffects(this)
    this.particleSystem = new ParticleSystem(this)

    // UI system
    this.hudSystem = new HUDSystem(this, this.playerName)

    // Input system
    this.inputSystem = new InputSystem(this, () => this.shoot())
  }

  private createGameObjects(width: number, height: number) {
    // Player
    this.player = new Player(this, width / 2, height / 2)

    // Game object groups
    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true, maxSize: 120 })
    this.enemies = this.physics.add.group({ classType: Enemy })
    this.powerUps = this.physics.add.group({ classType: PowerUp, runChildUpdate: true })
    this.enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true, maxSize: 60 })

    // Game systems that depend on game objects
    this.combatSystem = new CombatSystem(this, this.visualEffects, this.particleSystem, {
      onScoreUpdate: (points: number) => this.updateScore(points),
      onComboUpdate: (count: number) => this.updateCombo(count),
      onEnemyDestroyed: () => this.handleEnemyDestroyed(),
    })

    this.powerUpSystem = new PowerUpSystem(this, this.powerUps, this.visualEffects, this.particleSystem, {
      onBuffUpdate: (text: any, color: any, duration: any, onEnd: any) => this.hudSystem.showBuffText(text, color, duration, onEnd),
      onHealthUpdate: (health: number) => this.updateHealth(health),
    })

    this.waveManager = new WaveManagerIntegration(this, this.enemies, this.visualEffects, {
      onWaveUpdate: (wave: number, enemiesLeft: number) => this.handleWaveUpdate(wave, enemiesLeft),
      onWavePauseChange: (paused: any) => (this.gameState.wavePause = paused),
      onShowShop: () => this.showShopAfterWave(),
    })
  }

  private setupCollisions() {
    this.physics.add.overlap(this.bullets, this.enemies, (b, e) =>
      this.combatSystem.handleBulletHitEnemy(b as Bullet, e as Enemy, this.gameState.comboCount),
    )

    this.physics.add.overlap(this.player, this.enemies, (_p, e) => {
      if (this.combatSystem.handlePlayerHitByEnemy(this.player, e as Enemy, this.powerUpSystem.shield)) {
        this.takeDamage()
      }
    })

    this.physics.add.overlap(this.player, this.powerUps, (_p, p) => {
      const newHealth = this.powerUpSystem.handlePowerUpCollection(
        this.player,
        p as PowerUp,
        this.gameState.health,
        this.gameState.maxHealth,
      )
      if (newHealth !== this.gameState.health) {
        this.gameState.health = newHealth
        this.hudSystem.updateHealth(this.gameState.health, this.gameState.maxHealth)
      }
    })

    this.physics.add.overlap(this.player, this.enemyBullets, (_p, b) => {
      if (this.combatSystem.handlePlayerHitByBullet(b as Bullet, this.player, this.powerUpSystem.shield)) {
        this.takeDamage()
      }
    })
  }

  update(_t: number, dt: number) {
    if (this.gameState.isGameOver) return

    this.updateTimers(dt)
    this.updateGameLogic()
    this.updateUI()
  }

  private updateTimers(dt: number) {
    this.timers.lastShot += dt
    this.timers.lastPower += dt
    this.gameState.comboTimer += dt

    // Reset combo after timeout
    if (this.gameState.comboTimer > GAME_CONFIG.COMBO.RESET_TIME && this.gameState.comboCount > 0) {
      this.gameState.comboCount = 0
      this.hudSystem.clearCombo()
    }
  }

  private updateGameLogic() {
    if (!this.gameState.wavePause) {
      this.waveManager.update(16) // Approximate 60fps delta
    }

    // Update player
    this.player.update(this.inputSystem.cursors, this.input.activePointer, this.inputSystem.wasd)

    // Power-up spawning
    if (this.timers.lastPower > GAME_CONFIG.POWERUPS.SPAWN_INTERVAL) {
      this.powerUpSystem.spawnPowerUp()
      this.timers.lastPower = 0
    }

    // Enemy AI
    this.enemies.children.iterate((o) => {
      ;(o as Enemy).pursue(this.player)
      return true
    })
  }

  private updateUI() {
    this.hudSystem.updateScore(this.gameState.score)
    this.hudSystem.updateHealth(this.gameState.health, this.gameState.maxHealth)
    this.hudSystem.updateWave(this.waveManager.getCurrentWave())
    this.hudSystem.updateEnemiesLeft(this.gameState.enemiesLeftStatic)
    this.hudSystem.updatePlayerNamePosition(this.player.x, this.player.y)
  }

  private shoot() {
    const cooldown = window.rapidFire ? 600 : GAME_CONFIG.PLAYER.SHOOT_COOLDOWN;
    if (this.timers.lastShot < cooldown) return;
    this.timers.lastShot = 0;

    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.input.activePointer.worldX,
      this.input.activePointer.worldY,
    );

    if (this.powerUpSystem.triple) {
      [-0.25, 0, 0.25].forEach((offset) => this.fireSingleBullet(angle + offset));
    } else {
      this.fireSingleBullet(angle);
    }

    this.combatSystem.createMuzzleFlash(this.player.x, this.player.y);
  }

  private fireSingleBullet(angle: number) {
    const bullet = this.bullets.get() as Bullet
    if (!bullet) return
    bullet.fire(this.player.x, this.player.y, angle)
  }

  private updateScore(points: number) {
    this.gameState.score += points
  }

  private updateCombo(count: number) {
    this.gameState.comboCount = count
    this.gameState.comboTimer = 0
    this.hudSystem.showCombo(count)
  }

  private updateHealth(health: number) {
    const bonus = window.maxHealthBonus || 0;
    this.gameState.maxHealth = GAME_CONFIG.PLAYER.MAX_HEALTH + bonus;
    this.gameState.health = Math.min(health, this.gameState.maxHealth);
  }

  private handleEnemyDestroyed() {
    this.gameState.enemiesLeftStatic = Math.max(0, this.gameState.enemiesLeftStatic - 1)
  }

  private handleWaveUpdate(wave: number, enemiesLeft: number) {
    this.gameState.enemiesLeftStatic = enemiesLeft

    // Wave bonus
    if (wave > 1) {
      const bonus = wave * 50
      this.gameState.score += bonus
      this.visualEffects.createScorePopup(this.scale.width / 2, this.scale.height / 2 + 50, `+${bonus} WAVE BONUS!`)
    }
  }

  private takeDamage() {
    this.gameState.health--
    if (this.gameState.health <= 0) {
      this.gameOver()
    }
  }

  private gameOver() {
    this.gameState.isGameOver = true
    this.hudSystem.buffText.setText("")
    this.player.setActive(false).setVisible(false)
    this.hudSystem.hidePlayerName()

    this.combatSystem.createGameOverEffect(this.player.x, this.player.y)

    this.time.delayedCall(1000, () =>
      this.scene.start("GameOver", { score: this.gameState.score, playerName: this.playerName }),
    )
  }

  private showShopAfterWave() {
    this.scene.pause()
    this.scene.launch("Shop", {
      score: this.gameState.score,
      onClose: () => {
        this.waveManager.startWave(this.waveManager.getCurrentWave() + 1)
      },
    })
  }

  shutdown() {
    // Clean up systems
    this.inputSystem?.destroy()
    this.backgroundSystem?.destroy()
    this.visualEffects?.destroy()
    this.particleSystem?.destroy()
    this.hudSystem?.destroy()
    this.powerUpSystem?.reset()
  }
}
