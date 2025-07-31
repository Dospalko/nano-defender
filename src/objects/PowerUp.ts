import Phaser from "phaser";

export type PowerType = "trip" | "speed" | "shield" | "heal";

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
  readonly ptype: PowerType;

  constructor(scene: Phaser.Scene, x: number, y: number, ptype: PowerType) {
    super(scene, x, y, `power-${ptype}`);
    this.ptype = ptype;
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  update(_: number, dt: number) {
    this.rotation += 0.002 * dt; // pomalá rotácia
  }
}
