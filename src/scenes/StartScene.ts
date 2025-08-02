import Phaser from "phaser"

export default class StartScene extends Phaser.Scene {
  playerName = ""
  nameInput?: HTMLInputElement
  startBtn?: Phaser.GameObjects.Text
  startBtnBg?: Phaser.GameObjects.Rectangle
  particles: Phaser.GameObjects.Arc[] = []
  stars: Phaser.GameObjects.Arc[] = []

  constructor() {
    super("Start")
  }

  create() {
    const centerX = this.scale.width / 2
    const centerY = this.scale.height / 2

    // Hide loading screen if present
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
    }

    // Create animated space background
    this.createAnimatedBackground()

    // Main title panel with glow effect
    this.createTitlePanel(centerX, centerY)

    // Create animated title
    this.createTitle(centerX, centerY)

    // Create subtitle
    this.createSubtitle(centerX, centerY)

    // Create name input section
    this.createNameInput(centerX, centerY)

    // Create start button
    this.createStartButton(centerX, centerY)

    // Create controls button
    this.createControlsButton(centerX, centerY)

    // Add floating particles
    this.createFloatingParticles()

    // Add pulsing energy rings
    this.createEnergyRings(centerX, centerY)
  }

  createAnimatedBackground() {
    // Dark space background with gradient
    const bg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x0a0a1a,
      1,
    )

    // Create animated grid
    this.createGrid()

    // Create moving stars
    this.createStarField()

    // Add scanning lines effect
    this.createScanLines()
  }

  createGrid() {
    const gridSize = 50
    const gridColor = 0x00ff88
    const gridAlpha = 0.1

    // Vertical lines
    for (let x = 0; x < this.scale.width; x += gridSize) {
      const line = this.add.rectangle(x, this.scale.height / 2, 1, this.scale.height, gridColor, gridAlpha)
      this.tweens.add({
        targets: line,
        alpha: { from: 0.05, to: 0.15 },
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      })
    }

    // Horizontal lines
    for (let y = 0; y < this.scale.height; y += gridSize) {
      const line = this.add.rectangle(this.scale.width / 2, y, this.scale.width, 1, gridColor, gridAlpha)
      this.tweens.add({
        targets: line,
        alpha: { from: 0.05, to: 0.15 },
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      })
    }
  }

  createStarField() {
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Math.random() * this.scale.width,
        Math.random() * this.scale.height,
        Math.random() * 2 + 0.5,
        0xffffff,
        Math.random() * 0.8 + 0.2,
      )

      this.stars.push(star)

      // Twinkling effect
      this.tweens.add({
        targets: star,
        alpha: { from: 0.2, to: 1 },
        duration: 1000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      })

      // Slow movement
      this.tweens.add({
        targets: star,
        x: star.x + (Math.random() - 0.5) * 100,
        y: star.y + (Math.random() - 0.5) * 100,
        duration: 10000 + Math.random() * 5000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      })
    }
  }

  createScanLines() {
    for (let i = 0; i < 3; i++) {
      const scanLine = this.add.rectangle(this.scale.width / 2, -10, this.scale.width, 2, 0x00ff88, 0.6)

      this.tweens.add({
        targets: scanLine,
        y: this.scale.height + 10,
        duration: 4000 + i * 1000,
        repeat: -1,
        ease: "Linear",
        delay: i * 1500,
      })
    }
  }

  createTitlePanel(centerX: number, centerY: number) {
    // Main panel shadow
    const panelShadow = this.add.rectangle(centerX + 6, centerY - 40 + 6, 700, 500, 0x000000, 0.4)

    // Main panel
    const panel = this.add.rectangle(centerX, centerY - 40, 700, 500, 0x0f0f23, 0.85)
    panel.setStrokeStyle(4, 0x00ff88, 1)

    // Inner glow
    const innerGlow = this.add.rectangle(centerX, centerY - 40, 680, 480, 0x001122, 0.2)
    innerGlow.setStrokeStyle(2, 0x00ff88, 0.3)

    // Animated border pulse
    this.tweens.add({
      targets: panel,
      alpha: { from: 0.85, to: 0.95 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })
  }

  createTitle(centerX: number, centerY: number) {
    // Title background glow
    const titleGlow = this.add.circle(centerX, centerY - 150, 200, 0x00ff88, 0.1)
    this.tweens.add({
      targets: titleGlow,
      scale: { from: 1, to: 1.2 },
      alpha: { from: 0.05, to: 0.15 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })

    // Main title
    const title = this.add
      .text(centerX, centerY - 150, "NANO DEFENDER", {
        fontSize: "56px",
        color: "#00ff88",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#ffffff",
        strokeThickness: 6,
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: "#00ff88",
          blur: 20,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0)

    // Title entrance animation
    this.tweens.add({
      targets: title,
      alpha: 1,
      scale: { from: 0.5, to: 1 },
      duration: 1500,
      ease: "Back.easeOut",
    })

    // Continuous pulse
    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.05 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })

    // Color shift effect
    this.time.addEvent({
      delay: 100,
      callback: () => {
        const colors = ["#00ff88", "#00ccff", "#ff6b6b", "#ffa502"]
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        if (Math.random() < 0.1) {
          title.setColor(randomColor)
          this.time.delayedCall(200, () => title.setColor("#00ff88"))
        }
      },
      loop: true,
    })
  }

  createSubtitle(centerX: number, centerY: number) {
    const subtitle = this.add
      .text(centerX, centerY - 100, "ARCADE SPACE SHOOTER", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setAlpha(0)

    this.tweens.add({
      targets: subtitle,
      alpha: 0.8,
      y: centerY - 100,
      duration: 2000,
      ease: "Quad.easeOut",
      delay: 500,
    })
  }

  createNameInput(centerX: number, centerY: number) {
    // Name prompt with glow
    const promptBg = this.add.rectangle(centerX, centerY - 20, 300, 40, 0x1a1a2e, 0.8)
    promptBg.setStrokeStyle(2, 0x00ff88, 0.6)

    const prompt = this.add
      .text(centerX, centerY - 20, "ENTER PILOT NAME", {
        fontSize: "20px",
        color: "#00ff88",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setAlpha(0)

    this.tweens.add({
      targets: [promptBg, prompt],
      alpha: { from: 0, to: 1 },
      duration: 1000,
      ease: "Quad.easeOut",
      delay: 1000,
    })

    // Enhanced HTML input styling
    this.nameInput = document.createElement("input")
    this.nameInput.type = "text"
    this.nameInput.placeholder = "PILOT NAME"
    this.nameInput.maxLength = 15
    this.nameInput.style.position = "absolute"
    this.nameInput.style.left = `calc(50% - 120px)`
    this.nameInput.style.top = `${centerY + 30}px`
    this.nameInput.style.width = "240px"
    this.nameInput.style.height = "50px"
    this.nameInput.style.fontSize = "20px"
    this.nameInput.style.fontFamily = "Arial Black, Arial, sans-serif"
    this.nameInput.style.fontWeight = "bold"
    this.nameInput.style.borderRadius = "8px"
    this.nameInput.style.border = "3px solid #00ff88"
    this.nameInput.style.padding = "12px"
    this.nameInput.style.background = "linear-gradient(145deg, #1a1a2e, #16213e)"
    this.nameInput.style.color = "#ffffff"
    this.nameInput.style.textAlign = "center"
    this.nameInput.style.textTransform = "uppercase"
    this.nameInput.style.letterSpacing = "2px"
    this.nameInput.style.boxShadow = "0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.1)"
    this.nameInput.style.outline = "none"
    this.nameInput.style.zIndex = "1000"
    this.nameInput.style.transition = "all 0.3s ease"

    // Enhanced input focus effects
    this.nameInput.addEventListener("focus", () => {
      this.nameInput!.style.borderColor = "#00ccff"
      this.nameInput!.style.boxShadow = "0 0 30px rgba(0, 204, 255, 0.5), inset 0 0 20px rgba(0, 204, 255, 0.1)"
      this.nameInput!.style.transform = "scale(1.05)"
    })

    this.nameInput.addEventListener("blur", () => {
      this.nameInput!.style.borderColor = "#00ff88"
      this.nameInput!.style.boxShadow = "0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.1)"
      this.nameInput!.style.transform = "scale(1)"
    })

    document.body.appendChild(this.nameInput)

    // Input validation and button state management
    this.nameInput.addEventListener("input", () => {
      const value = this.nameInput!.value.trim()
      if (value.length > 0) {
        this.enableStartButton()
      } else {
        this.disableStartButton()
      }
    })

    // Enter key support
    this.nameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && this.nameInput!.value.trim().length > 0) {
        this.startGame()
      }
    })
  }

  createStartButton(centerX: number, centerY: number) {
    // Button background with glow
    this.startBtnBg = this.add.rectangle(centerX, centerY + 120, 250, 70, 0x00ff88, 0.3)
    this.startBtnBg.setStrokeStyle(4, 0x00ff88, 1)

    // Button text
    this.startBtn = this.add
      .text(centerX, centerY + 120, "LAUNCH MISSION", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5)

    // Initially disabled state
    this.disableStartButton()

    // Button animations
    this.tweens.add({
      targets: [this.startBtnBg, this.startBtn],
      alpha: { from: 0, to: 1 },
      scale: { from: 0.8, to: 1 },
      duration: 1200,
      ease: "Back.easeOut",
      delay: 1500,
    })
  }

  createControlsButton(centerX: number, centerY: number) {
    // Controls button background
    const controlsBtnBg = this.add.rectangle(centerX, centerY + 210, 200, 50, 0x3742fa, 0.8)
    controlsBtnBg.setStrokeStyle(3, 0x3742fa, 1)

    const controlsBtn = this.add
      .text(centerX, centerY + 210, "VIEW CONTROLS", {
        fontSize: "18px",
        color: "#ffffff",
        fontFamily: "Arial Black, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)

    // Make interactive
    ;[controlsBtnBg, controlsBtn].forEach((target) => {
      target.setInteractive({ useHandCursor: true })

      target.on("pointerover", () => {
        this.tweens.add({
          targets: [controlsBtnBg, controlsBtn],
          scale: 1.1,
          duration: 200,
          ease: "Back.easeOut",
        })
        controlsBtnBg.setFillStyle(0x4c63d2)
      })

      target.on("pointerout", () => {
        this.tweens.add({
          targets: [controlsBtnBg, controlsBtn],
          scale: 1,
          duration: 200,
          ease: "Quad.easeOut",
        })
        controlsBtnBg.setFillStyle(0x3742fa)
      })

      target.on("pointerdown", () => {
        if (this.nameInput) this.nameInput.remove()
        this.scene.start("Controls")
      })
    })

    // Entrance animation
    this.tweens.add({
      targets: [controlsBtnBg, controlsBtn],
      alpha: { from: 0, to: 1 },
      y: { from: centerY + 250, to: centerY + 210 },
      duration: 1000,
      ease: "Back.easeOut",
      delay: 2000,
    })

    // Subtle pulse
    this.tweens.add({
      targets: controlsBtnBg,
      alpha: { from: 0.8, to: 0.6 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })
  }

  createFloatingParticles() {
    for (let i = 0; i < 30; i++) {
      const particle = this.add.circle(
        Math.random() * this.scale.width,
        Math.random() * this.scale.height,
        Math.random() * 3 + 1,
        0x00ff88,
        Math.random() * 0.5 + 0.2,
      )

      this.particles.push(particle)

      // Floating movement
      this.tweens.add({
        targets: particle,
        x: particle.x + (Math.random() - 0.5) * 200,
        y: particle.y + (Math.random() - 0.5) * 200,
        duration: 8000 + Math.random() * 4000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      })

      // Pulsing alpha
      this.tweens.add({
        targets: particle,
        alpha: { from: 0.2, to: 0.8 },
        duration: 2000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      })
    }
  }

  createEnergyRings(centerX: number, centerY: number) {
    for (let i = 0; i < 3; i++) {
      const ring = this.add.circle(centerX, centerY - 150, 100 + i * 50, 0x00ff88, 0)
      ring.setStrokeStyle(2, 0x00ff88, 0.3 - i * 0.1)

      this.tweens.add({
        targets: ring,
        scaleX: { from: 0.5, to: 2 },
        scaleY: { from: 0.5, to: 2 },
        alpha: { from: 0.3, to: 0 },
        duration: 3000,
        repeat: -1,
        ease: "Quad.easeOut",
        delay: i * 1000,
      })
    }
  }

  enableStartButton() {
    if (!this.startBtn || !this.startBtnBg) return

    this.startBtnBg.setFillStyle(0x00ff88, 0.9)
    this.startBtn.setColor("#000000")
    this.startBtnBg.setInteractive({ useHandCursor: true })
    this.startBtn.setInteractive({ useHandCursor: true })

    // Hover effects
    ;[this.startBtnBg, this.startBtn].forEach((target) => {
      target.on("pointerover", () => {
        this.tweens.add({
          targets: [this.startBtnBg, this.startBtn],
          scale: 1.1,
          duration: 200,
          ease: "Back.easeOut",
        })
        this.startBtnBg!.setFillStyle(0x00cc66)
      })

      target.on("pointerout", () => {
        this.tweens.add({
          targets: [this.startBtnBg, this.startBtn],
          scale: 1,
          duration: 200,
          ease: "Quad.easeOut",
        })
        this.startBtnBg!.setFillStyle(0x00ff88)
      })

      target.on("pointerdown", () => {
        this.startGame()
      })
    })

    // Pulsing glow when enabled
    this.tweens.add({
      targets: this.startBtnBg,
      alpha: { from: 0.9, to: 0.6 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })
  }

  disableStartButton() {
    if (!this.startBtn || !this.startBtnBg) return

    this.startBtnBg.setFillStyle(0x666666, 0.5)
    this.startBtn.setColor("#999999")
    this.startBtnBg.disableInteractive()
    this.startBtn.disableInteractive()
    this.startBtnBg.removeAllListeners()
    this.startBtn.removeAllListeners()

    // Stop pulsing when disabled
    this.tweens.killTweensOf(this.startBtnBg)
  }

  startGame() {
    if (!this.nameInput || this.nameInput.value.trim().length === 0) return

    this.playerName = this.nameInput.value.trim()

    // Launch effect
    this.createLaunchEffect()

    // Remove input and transition
    this.time.delayedCall(500, () => {
      if (this.nameInput) this.nameInput.remove()
      this.scene.start("Game", { playerName: this.playerName })
    })
  }

  createLaunchEffect() {
    const centerX = this.scale.width / 2
      const centerY = this.scale.height / 2

    // Screen flash
    const flash = this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0xffffff, 0)
    this.tweens.add({
      targets: flash,
      alpha: { from: 0, to: [0.8, 0] },
      duration: 500,
      ease: "Quad.easeInOut",
      onComplete: () => flash.destroy(),
    })

    // Explosion particles
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(centerX, centerY + 120, 5, 0x00ff88, 1)
      const angle = (i / 20) * Math.PI * 2
      const distance = 150

      this.tweens.add({
        targets: particle,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + 120 + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0,
        duration: 500,
        ease: "Power2.easeOut",
        onComplete: () => particle.destroy(),
      })
    }
  }

  shutdown() {
    if (this.nameInput) {
      this.nameInput.remove()
    }
  }
}
