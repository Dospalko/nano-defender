import Phaser from "phaser";

export default class ControlsScene extends Phaser.Scene {
  constructor() {
    super("Controls");
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Panel background
    const panel = this.add.rectangle(centerX, centerY, 600, 400, 0x1a1a2e, 0.95);
    panel.setStrokeStyle(4, 0x35ff74, 1);

    // Title
    this.add.text(centerX, centerY - 150, "CONTROLS", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "48px",
      color: "#35ff74",
      stroke: "#fff",
      strokeThickness: 4
    }).setOrigin(0.5);

    // Controls info
    this.add.text(centerX, centerY - 40,
      "Move: W/A/S/D or Arrow Keys\nAim: Mouse\nShoot: Left Mouse Button\nPause: Esc",
      {
        fontSize: "28px",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        align: "center"
      }
    ).setOrigin(0.5);

    // Back button
    const backBtn = this.add.text(centerX, centerY + 120, "⬅ Back", {
      fontSize: "28px",
      color: "#fff",
      backgroundColor: "#3742fa",
      fontFamily: "Arial Black, Arial, sans-serif",
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      stroke: "#fff",
      strokeThickness: 2
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on("pointerover", () => {
      this.tweens.add({ targets: backBtn, scale: 1.15, duration: 150, ease: "Back.easeOut" });
    });
    backBtn.on("pointerout", () => {
      this.tweens.add({ targets: backBtn, scale: 1, duration: 150, ease: "Quad.easeOut" });
    });
    backBtn.on("pointerdown", () => {
      this.scene.start("Start");
    });
  }
}
