// src/objects/Bullet.ts
import Phaser from "phaser";
export default class Bullet extends Phaser.Physics.Arcade.Image {
  speed = 500; lifespan = 1000; born = 0;
  fire(x:number,y:number,a:number){
    this.born = 0;
    this.setActive(true).setVisible(true);
    this.setPosition(x, y).setRotation(a + Math.PI / 2);
    if (this.body) {
      this.scene.physics.velocityFromRotation(a, this.speed, this.body.velocity);
    }
  }
update(_: unknown, d: number): void { this.born += d; if (this.born > this.lifespan) this.setActive(false).setVisible(false); }
}