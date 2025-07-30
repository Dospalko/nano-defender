import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  speed = 60;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "enemy");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
  pursue(t: Phaser.GameObjects.Sprite) {
    const a = Phaser.Math.Angle.Between(this.x, this.y, t.x, t.y);
    this.scene.physics.velocityFromRotation(a, this.speed, this.body.velocity);
    this.setRotation(a + Math.PI / 2);
  }
}
