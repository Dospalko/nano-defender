import Phaser from "phaser"

export class InputSystem {
  private scene: Phaser.Scene
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  public wasd: any
  private onShoot: () => void

  constructor(scene: Phaser.Scene, onShoot: () => void) {
    this.scene = scene
    this.onShoot = onShoot
    this.setupInput()
  }

  private setupInput() {
    this.cursors = this.scene.input.keyboard!.createCursorKeys()

    this.wasd = this.scene.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })

    this.scene.input.on("pointerdown", this.onShoot)
  }

  destroy() {
    this.scene.input.off("pointerdown", this.onShoot)
  }
}
