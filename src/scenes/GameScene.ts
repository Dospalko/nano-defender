import Phaser from "phaser";
import Player from "@/objects/Player";
import Bullet from "@/objects/Bullet";
import Enemy from "@/objects/Enemy";

export default class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Player;
  bullets!: Phaser.Physics.Arcade.Group;
  enemies!: Phaser.Physics.Arcade.Group;
  // teraz správny typ pre vrátenú hodnotu add.particles(...)
  particles!: Phaser.GameObjects.Particles.ParticleEmitter;
  lastEnemy = 0;
  score = 0;
  scoreText!: Phaser.GameObjects.Text;
  health = 3;
  healthText!: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  create() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.player = new Player(this, 400, 300);
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
      maxSize: 40,
    });
    this.enemies = this.physics.add.group({ classType: Enemy });

    // initialize ParticleEmitter priamo s konfiguráciou
    this.particles = this.add.particles(
      0,
      0, // počiatočná pozícia emitoru (nehrá rolu pri explode)
      "particle", // kľúč textúry
      {
        speed: { min: 50, max: 150 },
        angle: { min: 0, max: 360 },
        lifespan: 300,
        scale: { start: 1, end: 0 },
        blendMode: "ADD",
        quantity: 0, // žiadne kontinuálne emitovanie
      }
    );

    this.input.on("pointerdown", () => this.shoot());

    this.physics.add.overlap(
      this.bullets,
      this.enemies,
      (b, e) => this.hitEnemy(b as Bullet, e as Enemy),
      undefined,
      this
    );

    this.physics.add.overlap(
      this.enemies,
      this.player,
      () => this.scene.restart(),
      undefined,
      this
    );
    this.physics.add.overlap(
      this.enemies,
      this.player,
      (_enemy, _player) => this.damagePlayer(),
      undefined,
      this
    );
    // Score UI
    this.scoreText = this.add
      .text(10, 10, "Score: 0", { fontSize: "18px", color: "#fff" })
      .setDepth(10);

    // Health UI
    this.healthText = this.add
      .text(700, 10, `Health: ${this.health}`, {
        fontSize: "18px",
        color: "#f55",
      })
      .setDepth(10);
  }

  update(_t: number, dt: number) {
    this.player.update(this.cursors, this.input.activePointer);

    this.lastEnemy += dt;
    if (this.lastEnemy > 1000) {
      this.spawnEnemy();
      this.lastEnemy = 0;
    }

    this.enemies
      .getChildren()
      .forEach((obj) => (obj as Enemy).pursue(this.player));
  }

  shoot() {
    const bullet = this.bullets.get() as Bullet;
    if (!bullet) return;
    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.input.activePointer.worldX,
      this.input.activePointer.worldY
    );
    bullet.fire(this.player.x, this.player.y, angle);
  }

  spawnEnemy() {
    const pos = [
      { x: Phaser.Math.Between(0, 800), y: -40 },
      { x: 840, y: Phaser.Math.Between(0, 600) },
      { x: Phaser.Math.Between(0, 800), y: 640 },
      { x: -40, y: Phaser.Math.Between(0, 600) },
    ][Phaser.Math.Between(0, 3)];
    this.enemies.add(new Enemy(this, pos.x, pos.y));
  }
  damagePlayer() {
    this.health--;
    this.healthText.setText(`Health: ${this.health}`);
    if (this.health <= 0) {
      this.scene.start("GameOver", { score: this.score });
    }
  }

  hitEnemy(bullet: Bullet, enemy: Enemy) {
    bullet.setActive(false).setVisible(false);

    // vyvoláme jednorazový "výbuch" častíc na mieste nepriateľa
    this.particles.explode(8, enemy.x, enemy.y);

    enemy.destroy();
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);
  }
}
