import Enemy from "./Enemy";
import Phaser from "phaser";
import Bullet from "./Bullet";

export default class ShooterEnemy extends Enemy {
  shootTimer = 0;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.setTint(0xffa500); // orange tint
  }
  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.shootTimer += delta;
    if (this.shootTimer > 1500) {
      this.shootTimer = 0;
      this.shootAtPlayer();
    }
  }
  shootAtPlayer() {
    const player = (this.scene as any).player;
    if (!player) return;
    // Use enemyBullets group to get a bullet
    const group = (this.scene as any).enemyBullets as Phaser.Physics.Arcade.Group;
    const bullet = group.get() as Bullet;
    if (!bullet) return;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    bullet.fire(this.x, this.y, angle);
  }
}
