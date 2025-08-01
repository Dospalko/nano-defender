import Phaser from "phaser";
import BootScene from "@/scenes/BootScene";
import GameScene from "@/scenes/GameScene";
import GameOverScene from "@/scenes/GameOverScene";
import StartScene from "./scenes/StartScene";
import ControlsScene from "./scenes/ControlsScene";
import ShopScene from "./scenes/ShopScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game", // make sure your index.html has <div id="game"></div>
  backgroundColor: "#000",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [BootScene, StartScene, ControlsScene, GameScene, ShopScene, GameOverScene ],
};

new Phaser.Game(config);
