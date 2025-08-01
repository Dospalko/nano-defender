import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  playerName: string = "";
  nameInput?: HTMLInputElement;

  constructor() { super("Start"); }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Animated gradient background overlay
    const bg = this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x222233, 0.95).setDepth(-1);
    this.tweens.add({ targets: bg, alpha: { from: 0.7, to: 0.95 }, duration: 1200, yoyo: true, repeat: -1 });

    // Animated title text
    const title = this.add.text(centerX, centerY - 120, "Nano Defender", {
      fontSize: "64px",
      color: "#35ff74",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#fff",
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 0, color: "#222", blur: 16, fill: true }
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: title, alpha: 1, duration: 1000, ease: "Quad.easeOut" });
    this.tweens.add({ targets: title, scale: { from: 1, to: 1.08 }, duration: 1200, yoyo: true, repeat: -1 });

    // Name prompt
    const prompt = this.add.text(centerX, centerY - 30, "Enter your name:", {
      fontSize: "28px",
      color: "#fff",
      fontFamily: "Arial Black, Arial, sans-serif"
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: prompt, alpha: 1, duration: 1200, ease: "Quad.easeOut" });

    // Create HTML input for name (centered above button)
    this.nameInput = document.createElement("input");
    this.nameInput.type = "text";
    this.nameInput.placeholder = "Your name";
    this.nameInput.style.position = "absolute";
    this.nameInput.style.left = `calc(50% - 100px)`;
    this.nameInput.style.top = `${centerY + 20}px`;
    this.nameInput.style.width = "200px";
    this.nameInput.style.fontSize = "22px";
    this.nameInput.style.borderRadius = "8px";
    this.nameInput.style.border = "2px solid #35ff74";
    this.nameInput.style.padding = "8px";
    this.nameInput.style.background = "#222";
    this.nameInput.style.color = "#fff";
    this.nameInput.style.textAlign = "center";
    this.nameInput.style.marginBottom = "20px";
    this.nameInput.style.zIndex = "100";
    document.body.appendChild(this.nameInput);

    // Glowing Start button (disabled by default)
    const startBtn = this.add.text(centerX + 10, centerY + 120, "Start Game", {
      fontSize: "36px",
      color: "#fff",
      backgroundColor: "#35ff74",
      fontFamily: "Arial Black, Arial, sans-serif",
      padding: { left: 32, right: 32, top: 16, bottom: 16 },
      stroke: "#fff",
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: "#35ff74", blur: 16, fill: true }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0.5);
    startBtn.disableInteractive();
    this.tweens.add({ targets: startBtn, alpha: 1, duration: 1600, ease: "Quad.easeOut" });
    this.tweens.add({ targets: startBtn, scale: { from: 1, to: 1.05 }, duration: 900, yoyo: true, repeat: -1 });

    // Show Controls button
    const controlsBtn = this.add.text(centerX + 10, centerY + 180, "Show Controls", {
      fontSize: "28px",
      color: "#fff",
      backgroundColor: "#3742fa",
      fontFamily: "Arial Black, Arial, sans-serif",
      padding: { left: 24, right: 24, top: 12, bottom: 12 },
      stroke: "#fff",
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color: "#3742fa", blur: 10, fill: true }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0.9);
    this.tweens.add({ targets: controlsBtn, scale: { from: 1, to: 1.05 }, duration: 900, yoyo: true, repeat: -1 });

    controlsBtn.on("pointerover", () => {
      this.tweens.add({ targets: controlsBtn, scale: 1.15, duration: 150, ease: "Back.easeOut" });
    });
    controlsBtn.on("pointerout", () => {
      this.tweens.add({ targets: controlsBtn, scale: 1, duration: 150, ease: "Quad.easeOut" });
    });
    controlsBtn.on("pointerdown", () => {
      if (this.nameInput) this.nameInput.remove();
      this.scene.start("Controls");
    });

    // Enable button only if name is typed
    this.nameInput.addEventListener("input", () => {
      if (this.nameInput!.value.trim().length > 0) {
        startBtn.setAlpha(1);
        startBtn.setInteractive({ useHandCursor: true });
      } else {
        startBtn.setAlpha(0.5);
        startBtn.disableInteractive();
      }
    });

    startBtn.on("pointerdown", () => {
      if (this.nameInput!.value.trim().length === 0) return;
      this.playerName = this.nameInput!.value;
      this.nameInput!.remove();
      this.scene.start("Game", { playerName: this.playerName });
    });
  }

  shutdown() {
    if (this.nameInput) this.nameInput.remove();
  }
}
