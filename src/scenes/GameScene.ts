import Phaser from "phaser";
import Player from "@/objects/Player";
import Bullet from "@/objects/Bullet";
import Enemy from "@/objects/Enemy";

export default class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Player;
  bullets!: Phaser.Physics.Arcade.Group;
  enemies!: Phaser.Physics.Arcade.Group;
  particles!: Phaser.GameObjects.Particles.ParticleEmitter;
  lastEnemy = 0;
  score = 0;
  scoreText!: Phaser.GameObjects.Text;
  health = 3;
  healthText!: Phaser.GameObjects.Text;
  isGameOver = false;

  constructor() {
    super("Game");
  }

  init() {
    this.lastEnemy = 0;
    this.score = 0;
    this.health = 3;
    this.isGameOver = false;
  }

  create() {
    // Dynamické fullscreen prispôsobenie
    this.scale.scaleMode = Phaser.Scale.ScaleModes.RESIZE;
    this.scale.refresh();

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.player = new Player(this, centerX, centerY);

    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true, maxSize: 40 });
    this.enemies = this.physics.add.group({ classType: Enemy });

    this.particles = this.add.particles(0, 0, "particle", {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      lifespan: 300,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
      quantity: 0
    });

    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
      fontSize: "18px",
      color: "#fff"
    }).setDepth(10);

    this.healthText = this.add.text(this.scale.width - 150, 10, `Health: ${this.health}`, {
      fontSize: "18px",
      color: "#f55"
    }).setDepth(10);

    this.input.on("pointerdown", () => this.shoot());

    this.physics.add.overlap(this.bullets, this.enemies, (b, e) => this.hitEnemy(b as Bullet, e as Enemy));
    this.physics.add.overlap(this.player, this.enemies, (_p, e) => this.damagePlayer(e as Enemy));
  }

  update(_t: number, dt: number) {
    if (this.isGameOver) return;

    this.player.update(this.cursors, this.input.activePointer);

    this.lastEnemy += dt;
    if (this.lastEnemy > 1000) {
      this.spawnEnemy();
      this.lastEnemy = 0;
    }

    this.enemies.children.iterate(obj => {
      (obj as Enemy).pursue(this.player);
      return true;
    });
  }

  shoot() {
    const bullet = this.bullets.get() as Bullet;
    if (!bullet) return;
    const ang = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.input.activePointer.worldX,
      this.input.activePointer.worldY
    );
    bullet.fire(this.player.x, this.player.y, ang);
  }

  spawnEnemy() {
    const margin = 40;
    const w = this.scale.width;
    const h = this.scale.height;
    const pos = [
      { x: Phaser.Math.Between(0, w), y: -margin },
      { x: w + margin, y: Phaser.Math.Between(0, h) },
      { x: Phaser.Math.Between(0, w), y: h + margin },
      { x: -margin, y: Phaser.Math.Between(0, h) }
    ][Phaser.Math.Between(0, 3)];
    this.enemies.add(new Enemy(this, pos.x, pos.y));
  }

  damagePlayer(enemy: Enemy) {
    if (this.isGameOver) return;
    enemy.destroy();
    this.health--;
    this.healthText.setText(`Health: ${this.health}`);
    if (this.health <= 0) {
      this.gameOver();
    }
  }

  hitEnemy(bullet: Bullet, enemy: Enemy) {
    bullet.setActive(false).setVisible(false);
    this.particles.explode(8, enemy.x, enemy.y);
    enemy.destroy();
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  gameOver() {
    this.isGameOver = true;
    this.player.setActive(false).setVisible(false);
    this.time.delayedCall(500, () => {
      this.scene.start("GameOver", { score: this.score });
    });
  }
}
