// src/objects/Bullet.ts
import Phaser from "phaser";
export default class Bullet extends Phaser.Physics.Arcade.Image {
  speed = 500;
  fire(x:number,y:number,a:number){
    this.setActive(true).setVisible(true);
    this.setPosition(x, y).setRotation(a + Math.PI / 2);
    if (this.body) {
      this.scene.physics.velocityFromRotation(a, this.speed, this.body.velocity);
    }
  }
}