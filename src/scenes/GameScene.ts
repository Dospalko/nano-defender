import { Scene, Physics, Input } from "phaser";
import Player from "@/objects/Player";
import Bullet from "@/objects/Bullet";
import Enemy from "@/objects/Enemy";

export default class GameScene extends Scene {
  cursors!: Input.Keyboard.CursorKeys;
  player!: Player;
  bullets!: Physics.Arcade.Group;
  enemies!: Physics.Arcade.Group;
  particles!: Physics.Arcade.Particles.ParticleEmitterManager;
  lastEnemy = 0;
  score = 0;
  scoreText!: Phaser.GameObjects.Text;

  constructor() { super("Game"); }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = new Player(this, 400, 300);
    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true, maxSize: 40 });
    this.enemies = this.physics.add.group({ classType: Enemy });
    this.particles = this.add.particles("particle");
    this.input.on("pointerdown", () => this.shoot());
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, undefined, this);
    this.physics.add.overlap(this.enemies, this.player, () => this.scene.restart(), undefined, this);
    this.scoreText = this.add.text(10, 10, "Score: 0", { fontSize: "18px", color: "#fff" }).setDepth(10);
  }

  update(_, delta: number) {
    this.player.update(this.cursors, this.input.activePointer);
    this.lastEnemy += delta;
    if (this.lastEnemy > 1000) { this.spawnEnemy(); this.lastEnemy = 0; }
    this.enemies.getChildren().forEach(e => (e as Enemy).pursue(this.player));
  }

  shoot() {
    const bullet = this.bullets.get() as Bullet;
    if (!bullet) return;
    const a = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.input.activePointer.worldX, this.input.activePointer.worldY);
    bullet.fire(this.player.x, this.player.y, a);
  }

  spawnEnemy() {
    const e = [{x:Phaser.Math.Between(0,800),y:-40},{x:840,y:Phaser.Math.Between(0,600)},{x:Phaser.Math.Between(0,800),y:640},{x:-40,y:Phaser.Math.Between(0,600)}][Phaser.Math.Between(0,3)];
    this.enemies.add(new Enemy(this, e.x, e.y));
  }

  hitEnemy(b: Physics.Arcade.Image, e: Enemy) {
    b.setActive(false).setVisible(false);
    this.particles.createEmitter({ x:e.x, y:e.y, speed:{min:50,max:150}, angle:{min:0,max:360}, lifespan:300, quantity:8, scale:{start:1,end:0}, blendMode:"ADD" }).explode();
    e.destroy();
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);
  }
}
