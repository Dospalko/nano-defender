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

    this.add.text(centerX, centerY - 60, "Game Over", {
      fontSize: "48px",
      color: "#f00"
    }).setOrigin(0.5);

    this.add.text(centerX, centerY, `Score: ${this.finalScore}`, {
      fontSize: "32px",
      color: "#fff"
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 60, "Click to Restart", {
      fontSize: "24px",
      color: "#afa"
    }).setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}