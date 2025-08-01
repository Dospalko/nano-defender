/* The GameOverScene class in TypeScript extends Phaser.Scene to display the final score and a restart
prompt upon game over. */
import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  private finalScore = 0;
  private playerName = "";

  constructor() {
    super("GameOver");
  }

  init(data: { score: number, playerName?: string }) {
    this.finalScore = data.score;
    this.playerName = data.playerName || "Player";
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Animated gradient background
    const bg = this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x222233, 0.95).setDepth(-1);
    this.tweens.add({ targets: bg, alpha: { from: 0.85, to: 0.95 }, duration: 2000, yoyo: true, repeat: -1 });

    // Multiple particle bursts
    const particles = this.add.particles(centerX, centerY, "particle", {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      lifespan: 1200,
      scale: { start: 2, end: 0 },
      blendMode: "ADD",
      quantity: 0
    });
    particles.explode(60, centerX, centerY);
    
    // Additional smaller bursts
    this.time.delayedCall(500, () => particles.explode(30, centerX - 100, centerY - 50));
    this.time.delayedCall(800, () => particles.explode(30, centerX + 100, centerY + 50));

    // Animated title with shake effect
    const gameOverText = this.add.text(centerX, centerY - 120, "GAME OVER", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "72px",
      color: "#ff3366",
      stroke: "#fff",
      strokeThickness: 8,
      shadow: { offsetX: 3, offsetY: 3, color: "#000", blur: 12, fill: true }
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: gameOverText, alpha: 1, duration: 800, ease: "Bounce.easeOut" });
    this.tweens.add({ targets: gameOverText, x: { from: centerX - 5, to: centerX + 5 }, duration: 100, yoyo: true, repeat: -1 });

    // Player name with glow effect
    const playerText = this.add.text(centerX, centerY - 50, `Player: ${this.playerName}`, {
      fontSize: "32px",
      color: "#35ff74",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#fff",
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: "#35ff74", blur: 16, fill: true }
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: playerText, alpha: 1, duration: 1000, ease: "Quad.easeOut" });

    // Score with counter animation
    const scoreText = this.add.text(centerX, centerY, `Score: 0`, {
      fontSize: "40px",
      color: "#fff",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#222",
      strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: scoreText, alpha: 1, duration: 1200, ease: "Quad.easeOut" });
    
    // Animate score counting up
    let currentScore = 0;
    const scoreCounter = this.time.addEvent({
      delay: 30,
      callback: () => {
        currentScore += Math.max(1, Math.floor(this.finalScore / 50));
        if (currentScore >= this.finalScore) {
          currentScore = this.finalScore;
          scoreCounter.destroy();
        }
        scoreText.setText(`Score: ${currentScore}`);
      },
      repeat: -1
    });

    // Interactive buttons with hover effects
    const restartBtn = this.add.text(centerX - 100, centerY + 80, "Restart", {
      fontSize: "32px",
      color: "#fff",
      backgroundColor: "#35ff74",
      fontFamily: "Arial Black, Arial, sans-serif",
      padding: { left: 24, right: 24, top: 12, bottom: 12 },
      stroke: "#fff",
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0);
    this.tweens.add({ targets: restartBtn, alpha: 1, duration: 1600, ease: "Quad.easeOut" });

    const mainMenuBtn = this.add.text(centerX + 100, centerY + 80, "Main Menu", {
      fontSize: "32px",
      color: "#fff",
      backgroundColor: "#3ca6ff",
      fontFamily: "Arial Black, Arial, sans-serif",
      padding: { left: 24, right: 24, top: 12, bottom: 12 },
      stroke: "#fff",
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0);
    this.tweens.add({ targets: mainMenuBtn, alpha: 1, duration: 1800, ease: "Quad.easeOut" });

    // Button hover effects
    restartBtn.on("pointerover", () => {
      this.tweens.add({ targets: restartBtn, scale: 1.1, duration: 200 });
    });
    restartBtn.on("pointerout", () => {
      this.tweens.add({ targets: restartBtn, scale: 1, duration: 200 });
    });

    mainMenuBtn.on("pointerover", () => {
      this.tweens.add({ targets: mainMenuBtn, scale: 1.1, duration: 200 });
    });
    mainMenuBtn.on("pointerout", () => {
      this.tweens.add({ targets: mainMenuBtn, scale: 1, duration: 200 });
    });

    // Button click handlers
    restartBtn.on("pointerdown", () => {
      this.scene.start("Game", { playerName: this.playerName });
    });

    mainMenuBtn.on("pointerdown", () => {
      this.scene.start("Start");
    });
  }
}