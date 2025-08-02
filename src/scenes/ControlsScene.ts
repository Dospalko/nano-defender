import Phaser from "phaser";

export default class ControlsScene extends Phaser.Scene {
  constructor() {
    super("Controls");
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Add animated background particles
    this.createBackgroundParticles();

    // Main panel with glow effect
    const panel = this.add.rectangle(centerX, centerY, 650, 450, 0x0f0f23, 0.95);
    panel.setStrokeStyle(3, 0x35ff74, 1);
    
    // Add inner glow effect
    const panelGlow = this.add.rectangle(centerX, centerY, 650, 450, 0x35ff74, 0.1);
    panelGlow.setStrokeStyle(8, 0x35ff74, 0.3);

    // Animated title with glow
    const title = this.add.text(centerX, centerY - 160, "CONTROLS", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "52px",
      color: "#35ff74",
      stroke: "#000",
      strokeThickness: 6,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: "#35ff74",
        blur: 15,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);

    // Pulse animation for title
    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    // Control sections with better formatting
    const controlsData = [
      { action: "MOVEMENT", keys: "W/A/S/D or Arrow Keys", icon: "🎮" },
      { action: "AIMING", keys: "Mouse", icon: "🎯" },
      { action: "SHOOTING", keys: "Left Mouse Button", icon: "💥" },
      { action: "PAUSE", keys: "Esc Key", icon: "⏸️" }
    ];

    let yOffset = -60;
    controlsData.forEach((control, index) => {
      // Control item background
      const itemBg = this.add.rectangle(centerX, centerY + yOffset, 580, 50, 0x1a1a2e, 0.8);
      itemBg.setStrokeStyle(1, 0x35ff74, 0.5);

      // Icon
      this.add.text(centerX - 250, centerY + yOffset, control.icon, {
        fontSize: "24px"
      }).setOrigin(0.5);

      // Action name
      this.add.text(centerX - 180, centerY + yOffset, control.action, {
        fontSize: "20px",
        color: "#35ff74",
        fontFamily: "Arial Black, Arial, sans-serif",
        fontStyle: "bold"
      }).setOrigin(0, 0.5);

      // Keys
      this.add.text(centerX + 50, centerY + yOffset, control.keys, {
        fontSize: "18px",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif"
      }).setOrigin(0, 0.5);

      // Stagger animation for each item
      itemBg.setAlpha(0);
      this.tweens.add({
        targets: itemBg,
        alpha: 0.8,
        duration: 300,
        delay: index * 100,
        ease: "Power2"
      });

      yOffset += 60;
    });

    // Enhanced back button with neon effect
    const backBtn = this.add.container(centerX, centerY + 160);
    
    const btnBg = this.add.rectangle(0, 0, 180, 50, 0x3742fa, 1);
    btnBg.setStrokeStyle(2, 0x35ff74, 1);
    
    const btnGlow = this.add.rectangle(0, 0, 180, 50, 0x3742fa, 0.3);
    btnGlow.setStrokeStyle(6, 0x35ff74, 0.4);
    
    const btnText = this.add.text(0, 0, "⬅ BACK TO MENU", {
      fontSize: "20px",
      color: "#ffffff",
      fontFamily: "Arial Black, Arial, sans-serif",
      fontStyle: "bold"
    }).setOrigin(0.5);

    backBtn.add([btnGlow, btnBg, btnText]);
    backBtn.setSize(180, 50);
    backBtn.setInteractive({ useHandCursor: true });

    // Button hover effects
    backBtn.on("pointerover", () => {
      this.tweens.add({ 
        targets: [btnBg, btnGlow], 
        scaleX: 1.1, 
        scaleY: 1.1, 
        duration: 200, 
        ease: "Back.easeOut" 
      });
      this.tweens.add({
        targets: btnText,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: "Back.easeOut"
      });
      // Add glow intensity
      btnGlow.setAlpha(0.6);
    });

    backBtn.on("pointerout", () => {
      this.tweens.add({ 
        targets: [btnBg, btnGlow, btnText], 
        scaleX: 1, 
        scaleY: 1, 
        duration: 200, 
        ease: "Quad.easeOut" 
      });
      btnGlow.setAlpha(0.3);
    });

    backBtn.on("pointerdown", () => {
      // Button press effect
      this.tweens.add({
        targets: backBtn,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        ease: "Power2"
      });
      
      // Flash effect
      const flash = this.add.rectangle(centerX, centerY + 160, 180, 50, 0x35ff74, 0.5);
      this.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 300,
        onComplete: () => flash.destroy()
      });

      // Navigate back with delay for animation
      this.time.delayedCall(150, () => {
        this.scene.start("Start");
      });
    });

    // Add corner decorations
    this.createCornerDecorations(centerX, centerY);

    // Keyboard support
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-ESC', () => {
        this.scene.start("Start");
      });
    }
  }

  createBackgroundParticles() {
    // Create subtle animated particles for ambiance
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      
      const particle = this.add.circle(x, y, 2, 0x35ff74, 0.3);
      
      this.tweens.add({
        targets: particle,
        y: y - 100,
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000)
      });
    }
  }

  createCornerDecorations(centerX: number, centerY: number): void {
    // Top-left corner
    const topLeft: Phaser.GameObjects.Graphics = this.add.graphics();
    topLeft.lineStyle(3, 0x35ff74, 1);
    topLeft.strokeRect(centerX - 325, centerY - 225, 30, 30);
    
    // Top-right corner
    const topRight: Phaser.GameObjects.Graphics = this.add.graphics();
    topRight.lineStyle(3, 0x35ff74, 1);
    topRight.strokeRect(centerX + 295, centerY - 225, 30, 30);
    
    // Bottom-left corner
    const bottomLeft: Phaser.GameObjects.Graphics = this.add.graphics();
    bottomLeft.lineStyle(3, 0x35ff74, 1);
    bottomLeft.strokeRect(centerX - 325, centerY + 195, 30, 30);
    
    // Bottom-right corner
    const bottomRight: Phaser.GameObjects.Graphics = this.add.graphics();
    bottomRight.lineStyle(3, 0x35ff74, 1);
    bottomRight.strokeRect(centerX + 295, centerY + 195, 30, 30);

    // Animate corner decorations
    const corners: Phaser.GameObjects.Graphics[] = [topLeft, topRight, bottomLeft, bottomRight];
    corners.forEach((corner: Phaser.GameObjects.Graphics, index: number) => {
      this.tweens.add({
        targets: corner,
        alpha: 0.3,
        duration: 2000,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
        delay: index * 500
      });
    });
  }
}