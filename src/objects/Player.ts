import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  speed = 220;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }
  update(c: Phaser.Types.Input.Keyboard.CursorKeys, p: Phaser.Input.Pointer) {
    const vx = (c.left?.isDown ? -1 : 0) + (c.right?.isDown ? 1 : 0);
    const vy = (c.up?.isDown ? -1 : 0) + (c.down?.isDown ? 1 : 0);
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      const magnitude = Math.sqrt(vx * vx + vy * vy);
      if (magnitude > 0) {
        body.setVelocity((vx / magnitude) * this.speed, (vy / magnitude) * this.speed);
      } else {
        body.setVelocity(0, 0);
      }
    }
    const a = Phaser.Math.Angle.Between(this.x, this.y, p.worldX, p.worldY);
    this.setRotation(a + Math.PI / 2);
  }
}
