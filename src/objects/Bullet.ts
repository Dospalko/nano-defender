// src/objects/Bullet.ts
import Phaser from "phaser";
export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  speed = 500;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bullet");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(false).setVisible(false);
  }
  fire(x: number, y: number, a: number) {
    this.setActive(true).setVisible(true);
    this.setPosition(x, y).setRotation(a + Math.PI / 2);
    if (this.body) {
      this.scene.physics.velocityFromRotation(a, this.speed, this.body.velocity);
    }
  }
}