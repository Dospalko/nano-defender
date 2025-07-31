import Phaser from "phaser";
export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene,x:number,y:number){ super(scene,x,y,"powerup"); scene.add.existing(this); scene.physics.add.existing(this); this.setRotation(0); }
  update(_: Phaser.Types.Input.Keyboard.CursorKeys,dt:number){ this.rotation += 0.002*dt; }
}