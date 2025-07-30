import { Scene } from "phaser";

export default class BootScene extends Scene {
  constructor() { super("Boot"); }

  preload() {
    const g = this.add.graphics();
    g.fillStyle(0x00eaff).fillCircle(16, 16, 16);
    g.generateTexture("player", 32, 32);
    g.clear().fillStyle(0xffe200).fillCircle(8, 8, 8);
    g.generateTexture("bullet", 16, 16);
    g.clear().fillStyle(0xff2d75).fillCircle(20, 20, 20);
    g.generateTexture("enemy", 40, 40);
    g.clear().fillStyle(0xff0000).fillCircle(4, 4, 4);
    g.generateTexture("particle", 8, 8);
    g.destroy();
  }

  create() { this.scene.start("Game"); }
}
