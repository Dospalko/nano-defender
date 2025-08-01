import Phaser from "phaser";

export type ShopItem = {
  name: string;
  description: string;
  price: number;
};

const SHOP_ITEMS: ShopItem[] = [
  { name: "Triple Shot", description: "Shoot 3 bullets at once.", price: 150 },
  { name: "Speed Boost", description: "Move faster permanently.", price: 120 },
  { name: "Shield", description: "Start each wave with a shield.", price: 200 },
  { name: "Max Health +1", description: "Increase max health by 1.", price: 100 }
];

export default class ShopScene extends Phaser.Scene {
  playerScore: number = 0;
  onClose?: () => void;

  constructor() {
    super("Shop");
  }

  init(data: { score: number, onClose?: () => void }) {
    this.playerScore = data.score;
    this.onClose = data.onClose;
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const panel = this.add.rectangle(centerX, centerY, 600, 420, 0x1a1a2e, 0.97);
    panel.setStrokeStyle(4, 0x35ff74, 1);
    this.add.text(centerX, centerY - 170, "SHOP", {
      fontSize: "48px",
      color: "#35ff74",
      fontFamily: "Arial Black, Arial, sans-serif",
      stroke: "#fff",
      strokeThickness: 4
    }).setOrigin(0.5);
    this.add.text(centerX, centerY - 130, `Score: ${this.playerScore}`, {
      fontSize: "28px",
      color: "#ffa502",
      fontFamily: "Arial Black, Arial, sans-serif"
    }).setOrigin(0.5);

    SHOP_ITEMS.forEach((item, i) => {
      const y = centerY - 60 + i * 70;
      this.add.text(centerX - 180, y, item.name, {
        fontSize: "26px",
        color: "#35ff74",
        fontFamily: "Arial Black, Arial, sans-serif"
      }).setOrigin(0, 0.5);
      this.add.text(centerX - 20, y, item.description, {
        fontSize: "20px",
        color: "#fff",
        fontFamily: "Arial, sans-serif"
      }).setOrigin(0, 0.5);
      const priceText = this.add.text(centerX + 200, y, `${item.price} pts`, {
        fontSize: "22px",
        color: "#ffa502",
        fontFamily: "Arial Black, Arial, sans-serif"
      }).setOrigin(1, 0.5);
      const buyBtn = this.add.text(centerX + 220, y, "Buy", {
        fontSize: "22px",
        color: "#fff",
        backgroundColor: "#2ed573",
        fontFamily: "Arial Black, Arial, sans-serif",
        padding: { left: 16, right: 16, top: 6, bottom: 6 },
        stroke: "#fff",
        strokeThickness: 2
      }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
      buyBtn.on("pointerover", () => {
        this.tweens.add({ targets: buyBtn, scale: 1.15, duration: 120, ease: "Back.easeOut" });
      });
      buyBtn.on("pointerout", () => {
        this.tweens.add({ targets: buyBtn, scale: 1, duration: 120, ease: "Quad.easeOut" });
      });
      buyBtn.on("pointerdown", () => {
        if (this.playerScore >= item.price) {
          this.playerScore -= item.price;
          this.add.text(centerX, centerY + 160, `Purchased: ${item.name}!`, {
            fontSize: "24px",
            color: "#35ff74",
            fontFamily: "Arial Black, Arial, sans-serif"
          }).setOrigin(0.5).setAlpha(0.9);
          this.children.bringToTop(panel);
        } else {
          this.add.text(centerX, centerY + 160, `Not enough score!`, {
            fontSize: "24px",
            color: "#ff4757",
            fontFamily: "Arial Black, Arial, sans-serif"
          }).setOrigin(0.5).setAlpha(0.9);
          this.children.bringToTop(panel);
        }
      });
    });

    // Close button
    const closeBtn = this.add.text(centerX, centerY + 190, "Continue", {
      fontSize: "28px",
      color: "#fff",
      backgroundColor: "#3742fa",
      fontFamily: "Arial Black, Arial, sans-serif",
      padding: { left: 32, right: 32, top: 12, bottom: 12 },
      stroke: "#fff",
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on("pointerover", () => {
      this.tweens.add({ targets: closeBtn, scale: 1.12, duration: 120, ease: "Back.easeOut" });
    });
    closeBtn.on("pointerout", () => {
      this.tweens.add({ targets: closeBtn, scale: 1, duration: 120, ease: "Quad.easeOut" });
    });
    closeBtn.on("pointerdown", () => {
      this.scene.stop();
      this.scene.resume("Game");
    });
  }
}
