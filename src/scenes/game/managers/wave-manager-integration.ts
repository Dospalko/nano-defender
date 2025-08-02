import type Phaser from "phaser"
import WaveManager from "@/objects/WaveManager"
import { VisualEffects } from "../effects/visual-effects"
import { COLORS } from "@/scenes/game/config/game-config"


export class WaveManagerIntegration {
  private scene: Phaser.Scene
  private waveManager: WaveManager
  private visualEffects: VisualEffects
  private onWaveUpdate: (wave: number, enemiesLeft: number) => void
  private onWavePauseChange: (paused: boolean) => void
  private onShowShop: () => void

  constructor(
    scene: Phaser.Scene,
    enemies: Phaser.Physics.Arcade.Group,
    visualEffects: VisualEffects,
    callbacks: {
      onWaveUpdate: (wave: number, enemiesLeft: number) => void
      onWavePauseChange: (paused: boolean) => void
      onShowShop: () => void
    },
  ) {
    this.scene = scene
    this.visualEffects = visualEffects
    this.onWaveUpdate = callbacks.onWaveUpdate
    this.onWavePauseChange = callbacks.onWavePauseChange
    this.onShowShop = callbacks.onShowShop

    this.waveManager = new WaveManager({
      scene: this.scene,
      enemyGroup: enemies,
      onWaveStart: (wave) => this.handleWaveStart(wave),
      onWaveEnd: (wave) => this.handleWaveEnd(wave),
    })
  }

  private handleWaveStart(wave: number) {
    const enemiesLeft = 5 + wave * 3
    this.onWaveUpdate(wave, enemiesLeft)
    this.showWaveStartEffect(wave)
    this.onWavePauseChange(true)

    this.scene.time.delayedCall(1500, () => {
      this.onWavePauseChange(false)
    })
  }

  private handleWaveEnd(wave: number) {
    this.showWaveCompleteEffect(wave)
    this.onWavePauseChange(true)

    this.scene.time.delayedCall(2000, () => {
      this.onShowShop()
    })
  }

  private showWaveStartEffect(wave: number) {
    this.visualEffects.flashScreen(COLORS.PRIMARY, 0.3, 200)
    this.visualEffects.shakeCamera(300, 0.01)
  }

  private showWaveCompleteEffect(wave: number) {
    this.visualEffects.flashScreen(COLORS.PRIMARY, 0.4, 300)
  }

  startWave(wave: number) {
    this.waveManager.startWave(wave)
  }

  getCurrentWave(): number {
    return this.waveManager.getCurrentWave()
  }

  update(dt: number) {
    this.waveManager.update(dt)
  }
}
