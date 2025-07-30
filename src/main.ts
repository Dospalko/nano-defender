import Phaser from "phaser";
import BootScene from "@/scenes/BootScene";
import GameScene from "@/scenes/GameScene";

export default new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 800,
  height: 600,
  backgroundColor: "#111111",
  physics: { default: "arcade", arcade: { debug: false } },
  scene: [BootScene, GameScene]
});
