import Enemy from "./Enemy";
import Phaser from "phaser";

export default class FastEnemy extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.speed = 200; // faster than normal enemy
    this.setTint(0x00fffc); // visually distinct
  }
}
