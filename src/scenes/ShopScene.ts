declare global {
  interface Window {
    rapidFire?: boolean;
    maxHealthBonus?: number;
  }
}
declare global {
  interface Window {
    rapidFire?: boolean;
  }
}
import Phaser from "phaser"
import { GAME_CONFIG } from "./game/config/game-config";

export type ShopItem = {
  name: string
  description: string
  price: number
  icon: string
}

const SHOP_ITEMS: ShopItem[] = [
  { name: "Triple Shot", description: "Shoot 3 bullets at once", price: 150, icon: "🔫" },
  { name: "Speed Boost", description: "Move faster permanently", price: 120, icon: "⚡" },
  { name: "Shield", description: "Start each wave with a shield", price: 200, icon: "🛡️" },
  { name: "Max Health +1", description: "Increase max health by 1", price: 1, icon: "❤️" },
  { name: "Rapid Fire", description: "Reduce reload time to 600ms", price: 180, icon: "🔥" },
]

export default class ShopScene extends Phaser.Scene {
  playerScore = 0
  onClose?: () => void
  purchased: Set<string> = new Set()
  messageText?: Phaser.GameObjects.Text
  scoreText?: Phaser.GameObjects.Text
  particles?: Phaser.GameObjects.Particles.ParticleEmitter

  constructor() {
    super("Shop")
  }

  init(data: { score: number; onClose?: () => void }) {
    this.playerScore = data.score
    this.onClose = data.onClose
  }

  create() {
    const centerX = this.scale.width / 2
    const centerY = this.scale.height / 2

    // Create animated background
    this.createAnimatedBackground()

    // Main shop panel with glow effect
    const panelShadow = this.add.rectangle(centerX + 4, centerY + 4, 650, 480, 0x000000, 0.6)
    const panel = this.add.rectangle(centerX, centerY, 650, 480, 0x0f0f23, 0.95)
    panel.setStrokeStyle(6, 0x00ff88, 1)

    // Add inner glow
    const innerGlow = this.add.rectangle(centerX, centerY, 630, 460, 0x001122, 0.3)
    innerGlow.setStrokeStyle(2, 0x00ff88, 0.5)

    // Animated title with glow effect
    const titleText = this.add
      .text(centerX, centerY - 200, "ARCADE SHOP", {
        fontSize: "52px",
        color: "#00ff88",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#ffffff",
        strokeThickness: 6,
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: "#000000",
          blur: 8,
          fill: true,
        },
      })
      .setOrigin(0.5)

    // Animate title
    this.tweens.add({
      targets: titleText,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })

    // Score display with animated background
    const scoreBg = this.add.rectangle(centerX, centerY - 150, 300, 50, 0x1a1a2e, 0.9)
    scoreBg.setStrokeStyle(3, 0xffa502, 1)

    this.scoreText = this.add
      .text(centerX, centerY - 150, `CREDITS: ${this.playerScore}`, {
        fontSize: "28px",
        color: "#ffa502",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5)

    // Create shop items
    this.createShopItems(centerX, centerY)

    // Enhanced close button
    this.createCloseButton(centerX, centerY)

    // Add particle effects
    this.createParticleEffects()
  }

  createAnimatedBackground() {
    // Create moving grid lines
    for (let i = 0; i < 10; i++) {
      const line = this.add.rectangle(i * 80, this.scale.height / 2, 2, this.scale.height, 0x00ff88, 0.1)
      this.tweens.add({
        targets: line,
        x: line.x + 800,
        duration: 8000 + i * 500,
        repeat: -1,
        ease: "Linear",
      })
    }

    // Add floating geometric shapes
    for (let i = 0; i < 5; i++) {
      const shape = this.add.polygon(
        Phaser.Math.Between(0, this.scale.width),
        Phaser.Math.Between(0, this.scale.height),
        [0, -20, 20, 10, -20, 10],
        0x00ff88,
        0.1,
      )

      this.tweens.add({
        targets: shape,
        rotation: Math.PI * 2,
        duration: 4000 + i * 1000,
        repeat: -1,
        ease: "Linear",
      })
    }
  }

  createShopItems(centerX: number, centerY: number) {
    SHOP_ITEMS.forEach((item, i) => {
      const y = centerY - 80 + i * 80
      const isPurchased = this.purchased.has(item.name)
      const canAfford = this.playerScore >= item.price

      // Item container with glow effect
      const itemBg = this.add.rectangle(centerX, y, 580, 65, 0x1a1a2e, 0.8)
      itemBg.setStrokeStyle(2, isPurchased ? 0x666666 : canAfford ? 0x00ff88 : 0xff4757, 0.8)

      // Icon
      const iconBg = this.add.circle(centerX - 250, y, 25, 0x2d2d44, 1)
      iconBg.setStrokeStyle(2, 0x00ff88, 1)

      const iconText = this.add
        .text(centerX - 250, y, item.icon, {
          fontSize: "32px",
        })
        .setOrigin(0.5)

      // Item name with enhanced styling
      const nameText = this.add
        .text(centerX - 200, y - 15, item.name, {
          fontSize: "24px",
          color: isPurchased ? "#888888" : "#00ff88",
          fontFamily: "Arial Black, Arial, sans-serif",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0, 0.5)

      // Description
      const descText = this.add
        .text(centerX - 200, y + 10, item.description, {
          fontSize: "16px",
          color: isPurchased ? "#666666" : "#ffffff",
          fontFamily: "Arial, sans-serif",
        })
        .setOrigin(0, 0.5)

      // Price with coin icon
      const priceText = this.add
        .text(centerX + 120, y, `💰 ${item.price}`, {
          fontSize: "20px",
          color: isPurchased ? "#666666" : "#ffa502",
          fontFamily: "Arial Black, Arial, sans-serif",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0, 0.5)

      // Enhanced buy button
      const buttonColor = isPurchased ? 0x666666 : canAfford ? 0x00ff88 : 0xff4757
      const buttonText = isPurchased ? "OWNED" : canAfford ? "BUY" : "LOCKED"

      const buyBtnBg = this.add.rectangle(centerX + 220, y, 80, 40, buttonColor, 0.9)
      buyBtnBg.setStrokeStyle(2, 0xffffff, 1)

      const buyBtn = this.add
        .text(centerX + 220, y, buttonText, {
          fontSize: "16px",
          color: "#ffffff",
          fontFamily: "Arial Black, Arial, sans-serif",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0.5)

      if (!isPurchased && canAfford) {
        buyBtnBg.setInteractive({ useHandCursor: true })
        buyBtn.setInteractive({ useHandCursor: true })

        // Hover effects
        const hoverTargets = [buyBtnBg, buyBtn]
        hoverTargets.forEach((target) => {
          target.on("pointerover", () => {
            this.tweens.add({
              targets: [buyBtnBg, buyBtn],
              scale: 1.1,
              duration: 150,
              ease: "Back.easeOut",
            })
            buyBtnBg.setFillStyle(0x00cc66)
          })

          target.on("pointerout", () => {
            this.tweens.add({
              targets: [buyBtnBg, buyBtn],
              scale: 1,
              duration: 150,
              ease: "Quad.easeOut",
            })
            buyBtnBg.setFillStyle(0x00ff88)
          })

          target.on("pointerdown", () => {
            this.purchaseItem(item, itemBg, nameText, descText, priceText, buyBtnBg, buyBtn, iconBg)
          })
        })

        // Add pulsing effect for affordable items
        this.tweens.add({
          targets: buyBtnBg,
          alpha: 0.7,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        })
      }
    })
  }

  purchaseItem(
    item: ShopItem,
    itemBg: Phaser.GameObjects.Rectangle,
    nameText: Phaser.GameObjects.Text,
    descText: Phaser.GameObjects.Text,
    priceText: Phaser.GameObjects.Text,
    buyBtnBg: Phaser.GameObjects.Rectangle,
    buyBtn: Phaser.GameObjects.Text,
    iconBg: Phaser.GameObjects.Arc,
  ) {
    if (this.playerScore >= item.price) {
      this.playerScore -= item.price
      this.purchased.add(item.name)

      // Rapid Fire logic
      if (item.name === "Rapid Fire") {
        window.rapidFire = true;
      }
      // Max Health +1 logic
      if (item.name === "Max Health +1") {
        window.maxHealthBonus = (window.maxHealthBonus || 0) + 1;
        // Update GameScene HUD and health immediately
        const gameScene = this.scene.get("Game") as import("./GameScene").default;
        if (gameScene && gameScene.gameState && gameScene.hudSystem) {
          gameScene.gameState.maxHealth = GAME_CONFIG.PLAYER.MAX_HEALTH + window.maxHealthBonus;
          // If player is alive, also increase current health by 1 (up to maxHealth)
          if (!gameScene.gameState.isGameOver) {
            gameScene.gameState.health = Math.min(gameScene.gameState.health + 1, gameScene.gameState.maxHealth);
          }
          gameScene.hudSystem.updateHealth(gameScene.gameState.health, gameScene.gameState.maxHealth);
        }
      }

      // Update score display
      if (this.scoreText) {
        this.scoreText.setText(`CREDITS: ${this.playerScore}`)
        this.tweens.add({
          targets: this.scoreText,
          scale: 1.2,
          duration: 200,
          yoyo: true,
          ease: "Back.easeOut",
        })
      }

      // Update item appearance
      itemBg.setStrokeStyle(2, 0x666666, 0.8)
      nameText.setColor("#888888")
      descText.setColor("#666666")
      priceText.setColor("#666666")
      buyBtnBg.setFillStyle(0x666666).disableInteractive()
      buyBtn.setText("OWNED").disableInteractive()
      iconBg.setStrokeStyle(2, 0x666666, 1)

      // Purchase effect
      this.createPurchaseEffect(buyBtnBg.x, buyBtnBg.y)
      this.showMessage(`${item.name} PURCHASED!`, "#00ff88")
    } else {
      this.showMessage("INSUFFICIENT CREDITS!", "#ff4757")
      // Shake effect for insufficient funds
      this.tweens.add({
        targets: [buyBtnBg, buyBtn],
        x: buyBtnBg.x + 5,
        duration: 50,
        yoyo: true,
        repeat: 5,
        ease: "Power2",
      })
    }
  }

  createCloseButton(centerX: number, centerY: number) {
    const closeBtnBg = this.add.rectangle(centerX, centerY + 200, 200, 60, 0x3742fa, 0.9)
    closeBtnBg.setStrokeStyle(4, 0xffffff, 1)

    const closeBtn = this.add
      .text(centerX, centerY + 200, "CONTINUE", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5)
    ;[closeBtnBg, closeBtn].forEach((target) => {
      target.setInteractive({ useHandCursor: true })

      target.on("pointerover", () => {
        this.tweens.add({
          targets: [closeBtnBg, closeBtn],
          scale: 1.1,
          duration: 150,
          ease: "Back.easeOut",
        })
        closeBtnBg.setFillStyle(0x4c63d2)
      })

      target.on("pointerout", () => {
        this.tweens.add({
          targets: [closeBtnBg, closeBtn],
          scale: 1,
          duration: 150,
          ease: "Quad.easeOut",
        })
        closeBtnBg.setFillStyle(0x3742fa)
      })

      target.on("pointerdown", () => {
        if (this.onClose) this.onClose();
        this.scene.stop();
        this.scene.resume("Game");
      })
    })

    // Add pulsing glow effect
    this.tweens.add({
      targets: closeBtnBg,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })
  }

  createParticleEffects() {
    // Add subtle floating particles
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, this.scale.width),
        Phaser.Math.Between(0, this.scale.height),
        Phaser.Math.Between(1, 3),
        0x00ff88,
        0.3,
      )

      this.tweens.add({
        targets: particle,
        y: particle.y - this.scale.height - 100,
        duration: Phaser.Math.Between(8000, 15000),
        repeat: -1,
        ease: "Linear",
      })

      this.tweens.add({
        targets: particle,
        alpha: 0.1,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      })
    }
  }

  createPurchaseEffect(x: number, y: number) {
    // Create explosion effect
    for (let i = 0; i < 8; i++) {
      const spark = this.add.circle(x, y, 3, 0x00ff88, 1)
      const angle = (i / 8) * Math.PI * 2
      const distance = 50

      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0,
        duration: 500,
        ease: "Power2.easeOut",
        onComplete: () => spark.destroy(),
      })
    }
  }

  showMessage(msg: string, color: string) {
    if (this.messageText) this.messageText.destroy()

    const centerX = this.scale.width / 2
    const centerY = this.scale.height / 2

    // Message background
    const msgBg = this.add.rectangle(centerX, centerY + 160, msg.length * 12 + 40, 50, 0x000000, 0.8)
    msgBg.setStrokeStyle(2, color === "#00ff88" ? 0x00ff88 : 0xff4757, 1)

    this.messageText = this.add
      .text(centerX, centerY + 160, msg, {
        fontSize: "20px",
        color,
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)

    // Animate message appearance
    this.tweens.add({
      targets: [msgBg, this.messageText],
      scale: { from: 0, to: 1 },
      duration: 200,
      ease: "Back.easeOut",
    })

    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: [msgBg, this.messageText],
        alpha: 0,
        scale: 0.8,
        duration: 300,
        ease: "Power2.easeIn",
        onComplete: () => {
          msgBg.destroy()
          if (this.messageText) this.messageText.destroy()
        },
      })
    })
  }
}
