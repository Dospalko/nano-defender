import Phaser from "phaser";
export default class Player extends Phaser.Physics.Arcade.Sprite {
  speed = 220;
  constructor(scene: Phaser.Scene, x: number, y: number) { super(scene, x, y, "player"); scene.add.existing(this); scene.physics.add.existing(this); this.setCollideWorldBounds(true); }
  update(c: Phaser.Types.Input.Keyboard.CursorKeys, p: Phaser.Input.Pointer, wasd?: any) {
    // Support both arrow keys and WASD
    const left = (c.left?.isDown ? 1 : 0) + (wasd?.left?.isDown ? 1 : 0);
    const right = (c.right?.isDown ? 1 : 0) + (wasd?.right?.isDown ? 1 : 0);
    const up = (c.up?.isDown ? 1 : 0) + (wasd?.up?.isDown ? 1 : 0);
    const down = (c.down?.isDown ? 1 : 0) + (wasd?.down?.isDown ? 1 : 0);
    const vx = (left ? -1 : 0) + (right ? 1 : 0);
    const vy = (up ? -1 : 0) + (down ? 1 : 0);
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      const velocity = new Phaser.Math.Vector2(vx, vy).normalize().scale(this.speed);
      this.body.setVelocity(velocity.x, velocity.y);
    }
    // Rotate sprite to face mouse pointer
    this.setRotation(Phaser.Math.Angle.Between(this.x, this.y, p.worldX, p.worldY) + Math.PI / 2);
  }
}
