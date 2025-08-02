import Phaser from "phaser"

export function createAnimatedBackground(scene: Phaser.Scene, stars: Phaser.GameObjects.Arc[], gridLines: Phaser.GameObjects.Rectangle[], scanLines: Phaser.GameObjects.Rectangle[]) {
  // Create starfield
  for (let i = 0; i < 100; i++) {
    const star = scene.add.circle(
      Math.random() * scene.scale.width,
      Math.random() * scene.scale.height,
      Math.random() * 2 + 0.5,
      0xffffff,
      Math.random() * 0.8 + 0.2,
    )
    stars.push(star)
    scene.tweens.add({
      targets: star,
      alpha: { from: 0.2, to: 1 },
      duration: 1000 + Math.random() * 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })
  }

  // Create grid lines
  const gridSize = 80
  for (let x = 0; x < scene.scale.width; x += gridSize) {
    const line = scene.add.rectangle(x, scene.scale.height / 2, 1, scene.scale.height, 0x00ff88, 0.1)
    gridLines.push(line)
  }
  for (let y = 0; y < scene.scale.height; y += gridSize) {
    const line = scene.add.rectangle(scene.scale.width / 2, y, scene.scale.width, 1, 0x00ff88, 0.1)
    gridLines.push(line)
  }
  scene.tweens.add({
    targets: gridLines,
    alpha: { from: 0.05, to: 0.15 },
    duration: 3000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  })

  // Create scanning lines
  for (let i = 0; i < 2; i++) {
    const scanLine = scene.add.rectangle(scene.scale.width / 2, -5, scene.scale.width, 3, 0x00ff88, 0.6)
    scanLines.push(scanLine)
    scene.tweens.add({
      targets: scanLine,
      y: scene.scale.height + 5,
      duration: 6000,
      repeat: -1,
      ease: "Linear",
      delay: i * 3000,
    })
  }
}
