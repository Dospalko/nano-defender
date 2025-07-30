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
    // Nápis Game Over
    this.add
      .text(400, 250, "Game Over", { fontSize: "48px", color: "#f00" })
      .setOrigin(0.5);

    // Zobrazenie skóre
    this.add
      .text(400, 330, `Score: ${this.finalScore}`, { fontSize: "32px", color: "#fff" })
      .setOrigin(0.5);

    // Inštrukcia pre restart
    this.add
      .text(400, 410, "Click to Restart", { fontSize: "24px", color: "#afa" })
      .setOrigin(0.5);

    // Po kliknutí spusti znova GameScene
    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
