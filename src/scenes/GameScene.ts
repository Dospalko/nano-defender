/* The `GameScene` class in TypeScript manages the main game scene with player controls, enemy
spawning, power-ups, shooting mechanics, collisions, power-up effects, and game over handling. */
import Phaser from "phaser";
import Player from "@/objects/Player";
import Bullet from "@/objects/Bullet";
import Enemy from "@/objects/Enemy";
import PowerUp, { PowerType } from "@/objects/PowerUp";
import FastEnemy from "@/objects/FastEnemy";
import ShooterEnemy from "@/objects/ShooterEnemy";

export default class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Player;
  bullets!: Phaser.Physics.Arcade.Group;
  enemies!: Phaser.Physics.Arcade.Group;
  powerUps!: Phaser.Physics.Arcade.Group;
  enemyBullets!: Phaser.Physics.Arcade.Group;
  particles!: Phaser.GameObjects.Particles.ParticleEmitter;

  lastEnemy = 0;
  lastPower = 0;

  score = 0;
  health = 3;
  maxHealth = 5;

  scoreText!: Phaser.GameObjects.Text;
  healthText!: Phaser.GameObjects.Text;
  buffText!: Phaser.GameObjects.Text;

  triple = false;
  speedBoost = false;
  shield = false;

  isGameOver = false;

  lastShot = 0;
  shootCooldown = 400; // ms

  constructor() { super("Game"); }

  init() {
    this.lastEnemy = 0;
    this.lastPower = 0;
    this.score = 0;
    this.health = 3;
    this.triple = this.speedBoost = this.shield = false;
    this.isGameOver = false;
  }

  create() {
    const { width, height } = this.scale;

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.player = new Player(this, width / 2, height / 2);

    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true, maxSize: 120 });
    this.enemies = this.physics.add.group({ classType: Enemy });
    this.powerUps = this.physics.add.group({ classType: PowerUp, runChildUpdate: true });
    this.enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true, maxSize: 60 });

    this.particles = this.add.particles(0, 0, "particle", {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      lifespan: 300,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
      quantity: 0
    });

    this.scoreText = this.add.text(10, 10, "Score: 0", { fontSize: "18px", color: "#fff" }).setDepth(10);
    this.healthText = this.add.text(width - 150, 10, `Health: ${this.health}`, { fontSize: "18px", color: "#f55" }).setDepth(10);
    this.buffText = this.add.text(width / 2, 40, "", { fontSize: "22px", color: "#fff" }).setOrigin(0.5).setDepth(10);

    this.input.on("pointerdown", () => this.shoot());

    this.physics.add.overlap(this.bullets, this.enemies, (b, e) => this.hitEnemy(b as Bullet, e as Enemy));
    this.physics.add.overlap(this.player, this.enemies, (_p, e) => this.damagePlayer(e as Enemy));
    this.physics.add.overlap(this.player, this.powerUps, (_p, p) => this.collectPowerUp(p as PowerUp));
    this.physics.add.overlap(this.player, this.enemyBullets, (_p, b) => this.damagePlayerBullet(b as Bullet));
  }

  update(_t: number, dt: number) {
    if (this.isGameOver) return;
    this.lastShot += dt;
    this.player.update(this.cursors, this.input.activePointer);

    this.lastEnemy += dt;
    if (this.lastEnemy > 1000) {
      this.spawnEnemy();
      this.lastEnemy = 0;
    }

    this.lastPower += dt;
    if (this.lastPower > 10000) {
      this.spawnPowerUp();
      this.lastPower = 0;
    }

    this.enemies.children.iterate(o => { (o as Enemy).pursue(this.player); return true; });
  }

  /** ---------- Spawning ---------- */
  spawnEnemy() {
    const m = 40, w = this.scale.width, h = this.scale.height;
    const p = [
      { x: Phaser.Math.Between(0, w), y: -m },
      { x: w + m, y: Phaser.Math.Between(0, h) },
      { x: Phaser.Math.Between(0, w), y: h + m },
      { x: -m, y: Phaser.Math.Between(0, h) }
    ][Phaser.Math.Between(0, 3)];
    // Only spawn normal or fast enemies
    const types = [Enemy, FastEnemy, ShooterEnemy];
    const EnemyClass = Phaser.Utils.Array.GetRandom(types);
    this.enemies.add(new EnemyClass(this, p.x, p.y));
  }

  spawnPowerUp() {
    const types: PowerType[] = ["trip", "speed", "shield", "heal"];
    const ptype = Phaser.Utils.Array.GetRandom(types);
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const y = Phaser.Math.Between(50, this.scale.height - 50);
    this.powerUps.add(new PowerUp(this, x, y, ptype));
  }

  /** ---------- Shooting ---------- */
  shoot() {
    if (this.lastShot < this.shootCooldown) return;
    this.lastShot = 0;
    if (this.triple) {
      [-0.25, 0, 0.25].forEach(offset => this.fireSingleBullet(offset));
    } else {
      this.fireSingleBullet(0);
    }
  }
  fireSingleBullet(offset: number) {
    const bullet = this.bullets.get() as Bullet;
    if (!bullet) return;
    const base = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.input.activePointer.worldX, this.input.activePointer.worldY);
    bullet.fire(this.player.x, this.player.y, base + offset);
  }

  /** ---------- Collisions ---------- */
  damagePlayer(enemy: Enemy) {
    if (this.isGameOver) return;
    enemy.destroy();
    if (this.shield) return;                // ignorujeme zranenie
    this.health--;
    this.healthText.setText(`Health: ${this.health}`);
    if (this.health <= 0) this.gameOver();
  }

  damagePlayerBullet(bullet: Bullet) {
    bullet.setActive(false).setVisible(false);
    if (this.shield || this.isGameOver) return;
    this.health--;
    this.healthText.setText(`Health: ${this.health}`);
    if (this.health <= 0) this.gameOver();
  }

  hitEnemy(bullet: Bullet, enemy: Enemy) {
    if (!bullet.active) return;
    bullet.setActive(false).setVisible(false); 
    this.particles.explode(8, enemy.x, enemy.y);
    enemy.destroy();
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  collectPowerUp(power: PowerUp) {
    power.destroy();
    switch (power.ptype) {
      case "trip":   return this.activateTripleShot();
      case "speed":  return this.activateSpeedBoost();
      case "shield": return this.activateShield();
      case "heal":   return this.activateHeal();
    }
  }

  /** ---------- Power-up effects ---------- */
  activateTripleShot() {
    this.triple = true;
    this.setBuffText("TRIPLE SHOT!", 0x35ff74, 8000, () => { this.triple = false; });
  }

  activateSpeedBoost() {
    if (!this.speedBoost) {
      this.speedBoost = true;
      (this.player as any).speed *= 1.5;
    }
    this.setBuffText("SPEED BOOST!", 0x3ca6ff, 8000, () => {
      this.speedBoost = false;
      (this.player as any).speed /= 1.5;
    });
  }

  activateShield() {
    this.shield = true;
    this.setBuffText("SHIELD!", 0xffd93c, 5000, () => { this.shield = false; });
  }

  activateHeal() {
    if (this.health < this.maxHealth) {
      this.health++;
      this.healthText.setText(`Health: ${this.health}`);
    }
    this.setBuffText("+1 HEALTH", 0xff4a4a, 1500);
  }

  setBuffText(text: string, color: number, duration: number, onEnd?: () => void) {
    this.buffText.setText(text).setColor(`#${color.toString(16)}`);
    this.time.delayedCall(duration, () => {
      if (onEnd) onEnd();
      this.buffText.setText("");
    });
  }

  /** ---------- Game Over ---------- */
  gameOver() {
    this.isGameOver = true;
    this.buffText.setText("");
    this.player.setActive(false).setVisible(false);
    this.time.delayedCall(500, () => this.scene.start("GameOver", { score: this.score }));
  }
}
