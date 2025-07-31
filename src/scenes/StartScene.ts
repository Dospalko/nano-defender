import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  playerName: string = "";
  nameInput?: HTMLInputElement;

  constructor() { super("Start"); }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x222233, 0.85);
    this.add.text(centerX, centerY - 80, "Nano Defender", {
      fontSize: "48px",
      color: "#35ff74",
      fontFamily: "Arial Black, Arial, sans-serif"
    }).setOrigin(0.5);
    this.add.text(centerX, centerY - 20, "Enter your name:", {
      fontSize: "28px",
      color: "#fff"
    }).setOrigin(0.5);

    // Create HTML input for name
    this.nameInput = document.createElement("input");
    this.nameInput.type = "text";
    this.nameInput.placeholder = "Your name";
    this.nameInput.style.position = "absolute";
    this.nameInput.style.left = `${centerX - 100}px`;
    this.nameInput.style.top = `${centerY + 20}px`;
    this.nameInput.style.width = "200px";
    this.nameInput.style.fontSize = "20px";
    document.body.appendChild(this.nameInput);

    // Start button
    const startBtn = this.add.text(centerX, centerY + 80, "Start Game", {
      fontSize: "32px",
      color: "#35ff74",
      backgroundColor: "#222",
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      fontFamily: "Arial Black, Arial, sans-serif"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on("pointerdown", () => {
      this.playerName = this.nameInput!.value || "Player";
      this.nameInput!.remove();
      this.scene.start("Game", { playerName: this.playerName });
    });
  }

  shutdown() {
    if (this.nameInput) this.nameInput.remove();
  }
}
