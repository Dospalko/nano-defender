/* `import { Scene } from "phaser";` is importing the `Scene` class from the "phaser" module. This
allows the code to use the `Scene` class in the current file. */
import { Scene } from "phaser";

export default class BootScene extends Scene {
  constructor() { super("Boot"); }

  preload() {
    // Load real player, enemy, and bullet textures
    this.load.image('player', 'player.png');
    this.load.image('enemy', 'enemy.png');
    this.load.image('bullet', 'bullet.png');
    const g = this.add.graphics();

     g.clear().fillStyle(0xff0000).fillCircle(4,4,4); g.generateTexture("particle",8,8);

    // power-up textúry
    g.clear().fillStyle(0x35ff74).fillCircle(12,12,12); g.generateTexture("power-trip",24,24);   // zelená
    g.clear().fillStyle(0x3ca6ff).fillCircle(12,12,12); g.generateTexture("power-speed",24,24);  // modrá
    g.clear().fillStyle(0xffd93c).fillCircle(12,12,12); g.generateTexture("power-shield",24,24); // žltá
    g.clear().fillStyle(0xff4a4a).fillCircle(12,12,12); g.generateTexture("power-heal",24,24);   // červená
    g.destroy();
  }

  create() { this.scene.start("Start"); }
}
