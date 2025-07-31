/* The GameOverScene class in TypeScript extends Phaser.Scene to display the final score and a restart
prompt upon game over. */
import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  private finalScore = 0;

  constructor() {
    super("GameOver");
  }

  init(data: { score: number }) {
    this.finalScore = data.score;
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Background overlay
    this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x222233, 0.85).setDepth(-1);

    // Particle burst
    const particles = this.add.particles(centerX, centerY, "particle", {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      lifespan: 800,
      scale: { start: 1.5, end: 0 },
      blendMode: "ADD",
      quantity: 40
    });
    particles.explode(40, centerX, centerY);

    // Fade-in text
    const gameOverText = this.add.text(centerX, centerY - 60, "GAME OVER", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "64px",
      color: "#ff3366",
      stroke: "#fff",
      strokeThickness: 6,
      shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 8, fill: true }
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: gameOverText, alpha: 1, duration: 800, ease: "Quad.easeOut" });

    const scoreText = this.add.text(centerX, centerY, `Score: ${this.finalScore}`, {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "36px",
      color: "#fff",
      stroke: "#222",
      strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: scoreText, alpha: 1, duration: 1200, ease: "Quad.easeOut" });

    const restartText = this.add.text(centerX, centerY + 80, "Click to Restart", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "28px",
      color: "#35ff74",
      stroke: "#fff",
      strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: restartText, alpha: 1, duration: 1800, ease: "Quad.easeOut" });

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}