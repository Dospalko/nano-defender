/* The `GameScene` class in TypeScript manages the main game scene with player controls, enemy
spawning, power-ups, shooting mechanics, collisions, power-up effects, and game over handling. */
import Phaser from "phaser";
import Player from "@/objects/Player";
import Bullet from "@/objects/Bullet";
import Enemy from "@/objects/Enemy";
import PowerUp, { PowerType } from "@/objects/PowerUp";
import FastEnemy from "@/objects/FastEnemy";
import ShooterEnemy from "@/objects/ShooterEnemy";
import WaveManager from "@/objects/WaveManager";

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
  waveText!: Phaser.GameObjects.Text;
  enemiesLeftText!: Phaser.GameObjects.Text;

  triple = false;
  speedBoost = false;
  shield = false;

  isGameOver = false;

  lastShot = 0;
  shootCooldown = 400; // ms

  wasd: any;

  playerName: string = "";
  playerNameText!: Phaser.GameObjects.Text;

  waveManager!: WaveManager;
  wavePause: boolean = false;

  enemiesLeftStatic = 0;

  constructor() { super("Game"); }

  init(data: { playerName?: string }) {
    this.lastEnemy = 0;
    this.lastPower = 0;
    this.score = 0;
    this.health = 3;
    this.triple = this.speedBoost = this.shield = false;
    this.isGameOver = false;
    this.playerName = data.playerName || "Player";
    this.wavePause = false;
  }

  create() {
    const { width, height } = this.scale;

    this.cursors = this.input.keyboard!.createCursorKeys();
    // Add WASD keys
    this.wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
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

    // Improved HUD layout and styling
    const hudFont = {
      fontSize: "22px",
      color: "#fff",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#222",
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color: "#222", blur: 8, fill: true }
    };
    this.scoreText = this.add.text(32, 24, "Score: 0", hudFont).setOrigin(0, 0.5).setDepth(10);
    this.healthText = this.add.text(this.scale.width - 32, 24, `Health: ${this.health}`, hudFont).setOrigin(1, 0.5).setDepth(10);
    this.waveText = this.add.text(this.scale.width / 2, 24, `Wave: 1`, hudFont).setOrigin(0.5).setDepth(10);
    this.enemiesLeftText = this.add.text(this.scale.width / 2, 60, `Enemies Left: 0`, {
      ...hudFont,
      color: "#ff4757",
      stroke: "#fff",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(10);
    this.buffText = this.add.text(this.scale.width / 2, 100, "", {
      ...hudFont,
      fontSize: "26px",
      color: "#35ff74",
      stroke: "#222",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(10);

    // Display player name above player
    this.playerNameText = this.add.text(this.player.x, this.player.y - 40, this.playerName, {
      fontSize: "20px",
      color: "#35ff74",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#222",
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color: "#222", blur: 8, fill: true }
    }).setOrigin(0.5).setDepth(10);

    this.input.on("pointerdown", () => this.shoot());

    this.physics.add.overlap(this.bullets, this.enemies, (b, e) => this.hitEnemy(b as Bullet, e as Enemy));
    this.physics.add.overlap(this.player, this.enemies, (_p, e) => this.damagePlayer(e as Enemy));
    this.physics.add.overlap(this.player, this.powerUps, (_p, p) => this.collectPowerUp(p as PowerUp));
    this.physics.add.overlap(this.player, this.enemyBullets, (_p, b) => this.damagePlayerBullet(b as Bullet));
    
    this.waveManager = new WaveManager({
      scene: this,
      enemyGroup: this.enemies,
      onWaveStart: (wave) => {
        this.waveText.setText(`Wave: ${wave}`);
        this.enemiesLeftStatic = 5 + wave * 3;
        this.enemiesLeftText.setText(`Enemies Left: ${this.enemiesLeftStatic}`);
        this.buffText.setText(`Wave ${wave} Incoming!`).setColor("#ffa502");
        this.wavePause = true;
        this.time.delayedCall(1200, () => {
          this.buffText.setText("");
          this.wavePause = false;
        });
      },
      onWaveEnd: (wave) => {
        this.buffText.setText(`Wave ${wave} Complete!`).setColor("#35ff74");
        this.wavePause = true;
        this.time.delayedCall(1800, () => {
          this.buffText.setText("");
          this.showShopAfterWave();
        });
      }
    });
    this.waveManager.startWave(1);
  }

  update(_t: number, dt: number) {
    if (this.isGameOver) return;
    if (!this.wavePause) this.waveManager.update(dt);
    this.lastShot += dt;
    this.player.update(this.cursors, this.input.activePointer, this.wasd);
    this.playerNameText.setPosition(this.player.x, this.player.y - 40);
    // Only update HUD for score, health, wave
    this.scoreText.setText(`Score: ${this.score}`);
    this.healthText.setText(`Health: ${this.health}`);
    this.waveText.setText(`Wave: ${this.waveManager.getCurrentWave()}`);
    this.lastPower += dt;
    if (this.lastPower > 10000) {
      this.spawnPowerUp();
      this.lastPower = 0;
    }
    this.enemies.children.iterate(o => { (o as Enemy).pursue(this.player); return true; });
  }

  /** ---------- Shooting ---------- */
  shoot() {
    if (this.lastShot < this.shootCooldown) return;
    this.lastShot = 0;
    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.input.activePointer.worldX,
      this.input.activePointer.worldY
    );
    if (this.triple) {
      [-0.25, 0, 0.25].forEach(offset => this.fireSingleBullet(angle + offset));
    } else {
      this.fireSingleBullet(angle);
    }
  }
  fireSingleBullet(angle: number) {
    const bullet = this.bullets.get() as Bullet;
    if (!bullet) return;
    bullet.fire(this.player.x, this.player.y, angle);
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
    /* The line `if (!bullet.active) return; // Only process if bullet is active` is a check to ensure
    that the code inside the block is only executed if the `bullet` object is currently active. If
    the `bullet` is not active, the function will exit early and not perform any further processing
    on that bullet. This check helps to avoid unnecessary operations on inactive bullets, improving
    efficiency and preventing potential errors that could occur if trying to process inactive
    objects. */
    if (!bullet.active) return; // Only process if bullet is active
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
    this.enemiesLeftStatic = Math.max(0, this.enemiesLeftStatic - 1);
    this.enemiesLeftText.setText(`Enemies Left: ${this.enemiesLeftStatic}`);
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
    this.playerNameText.setVisible(false);
    this.time.delayedCall(500, () => this.scene.start("GameOver", { score: this.score, playerName: this.playerName }));
  }

  showShopAfterWave() {
    this.scene.pause();
    this.scene.launch("Shop", {
      score: this.score,
      onClose: () => {
        // Start next wave after shop closes
        this.waveManager.startWave(this.waveManager.getCurrentWave() + 1);
      }
    });
  }

  spawnPowerUp() {
    const types: PowerType[] = ["trip", "speed", "shield", "heal"];
    const ptype = Phaser.Utils.Array.GetRandom(types);
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const y = Phaser.Math.Between(50, this.scale.height - 50);
    this.powerUps.add(new PowerUp(this, x, y, ptype));
  }
}
