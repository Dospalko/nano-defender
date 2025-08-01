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

    // Create a stylized frame/panel for the game over content
    const panelWidth = 600;
    const panelHeight = 400;
    const panel = this.add.rectangle(centerX, centerY, panelWidth, panelHeight, 0x1a1a2e, 0.95);
    panel.setStrokeStyle(4, 0x35ff74, 1); // FIXED: setStroke -> setStrokeStyle
    this.tweens.add({ targets: panel, alpha: { from: 0.8, to: 0.95 }, duration: 2000, yoyo: true, repeat: -1 });

    // Animated gradient background
    const bg = this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x0f0f23, 0.85).setDepth(-2);

    // Multiple particle bursts with better timing
    const particles = this.add.particles(centerX, centerY, "particle", {
      speed: { min: 80, max: 250 },
      angle: { min: 0, max: 360 },
      lifespan: 1500,
      scale: { start: 1.8, end: 0 },
      blendMode: "ADD",
      quantity: 0
    });
    particles.explode(50, centerX, centerY);
    
    // Continuous sparkle effect
    this.time.addEvent({
      delay: 800,
      callback: () => {
        particles.explode(15, 
          centerX + Phaser.Math.Between(-250, 250), 
          centerY + Phaser.Math.Between(-150, 150)
        );
      },
      repeat: -1
    });

    // Stylized title with better positioning
    const gameOverText = this.add.text(centerX, centerY - 140, "GAME OVER", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "56px",
      color: "#ff4757",
      stroke: "#fff",
      strokeThickness: 6,
      shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 10, fill: true }
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: gameOverText, alpha: 1, duration: 1000, ease: "Back.easeOut" });

    // Player name in a stylized box
    const playerBg = this.add.rectangle(centerX, centerY - 80, 400, 50, 0x2f3542, 0.8);
    playerBg.setStrokeStyle(2, 0x35ff74, 1); // FIXED: setStroke -> setStrokeStyle
    const playerText = this.add.text(centerX, centerY - 80, `${this.playerName}`, {
      fontSize: "28px",
      color: "#35ff74",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#000",
      strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: [playerBg, playerText], alpha: 1, duration: 1200, ease: "Quad.easeOut" });

    // Score with better styling and positioning
    const scoreBg = this.add.rectangle(centerX, centerY - 20, 350, 60, 0x2f3542, 0.8);
    scoreBg.setStrokeStyle(3, 0xffa502, 1); // FIXED: setStroke -> setStrokeStyle
    const scoreText = this.add.text(centerX, centerY - 20, `Score: 0`, {
      fontSize: "36px",
      color: "#ffa502",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#000",
      strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: [scoreBg, scoreText], alpha: 1, duration: 1400, ease: "Quad.easeOut" });
    
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

    // Better positioned and styled buttons
    const restartBtn = this.add.text(centerX - 120, centerY + 60, "🔄 Restart", {
      fontSize: "28px",
      color: "#fff",
      backgroundColor: "#2ed573",
      fontFamily: "Arial Black, Arial, sans-serif",
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      stroke: "#fff",
      strokeThickness: 2
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0);
    this.tweens.add({ targets: restartBtn, alpha: 1, duration: 1800, ease: "Quad.easeOut" });

    const mainMenuBtn = this.add.text(centerX + 120, centerY + 60, "🏠 Menu", {
      fontSize: "28px",
      color: "#fff",
      backgroundColor: "#3742fa",
      fontFamily: "Arial Black, Arial, sans-serif",
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      stroke: "#fff",
      strokeThickness: 2
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0);
    this.tweens.add({ targets: mainMenuBtn, alpha: 1, duration: 2000, ease: "Quad.easeOut" });

    // Enhanced button effects
    [restartBtn, mainMenuBtn].forEach(btn => {
      btn.on("pointerover", () => {
        this.tweens.add({ targets: btn, scale: 1.15, duration: 150, ease: "Back.easeOut" });
      });
      btn.on("pointerout", () => {
        this.tweens.add({ targets: btn, scale: 1, duration: 150, ease: "Quad.easeOut" });
      });
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