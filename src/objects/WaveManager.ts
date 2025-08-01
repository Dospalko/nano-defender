import Phaser from "phaser";
import Enemy from "@/objects/Enemy";
import FastEnemy from "@/objects/FastEnemy";
import ShooterEnemy from "@/objects/ShooterEnemy";

export type WaveManagerConfig = {
  scene: Phaser.Scene;
  onWaveStart?: (wave: number) => void;
  onWaveEnd?: (wave: number) => void;
  enemyGroup: Phaser.Physics.Arcade.Group;
};

export default class WaveManager {
  private scene: Phaser.Scene;
  private enemyGroup: Phaser.Physics.Arcade.Group;
  private wave: number = 1;
  private enemiesToSpawn: number = 0;
  private enemiesSpawned: number = 0;
  private waveInProgress: boolean = false;
  private onWaveStart?: (wave: number) => void;
  private onWaveEnd?: (wave: number) => void;
  private lastEnemy: number = 0;

  constructor(config: WaveManagerConfig) {
    this.scene = config.scene;
    this.enemyGroup = config.enemyGroup;
    this.onWaveStart = config.onWaveStart;
    this.onWaveEnd = config.onWaveEnd;
  }

  startWave(wave: number) {
    this.wave = wave;
    this.enemiesToSpawn = 5 + wave * 3;
    this.enemiesSpawned = 0;
    this.waveInProgress = true;
    this.lastEnemy = 0;
    if (this.onWaveStart) this.onWaveStart(wave);
  }

  update(dt: number) {
    if (!this.waveInProgress) return;
    this.lastEnemy += dt;
    if (this.lastEnemy > 1000 && this.enemiesSpawned < this.enemiesToSpawn) {
      this.spawnEnemy();
      this.lastEnemy = 0;
    }
    const enemiesLeft = this.enemyGroup.countActive(true);
    if (this.enemiesSpawned === this.enemiesToSpawn && enemiesLeft === 0) {
      this.waveInProgress = false;
      if (this.onWaveEnd) this.onWaveEnd(this.wave);
    }
  }

  spawnEnemy() {
    const m = 40, w = this.scene.scale.width, h = this.scene.scale.height;
    const p = [
      { x: Phaser.Math.Between(0, w), y: -m },
      { x: w + m, y: Phaser.Math.Between(0, h) },
      { x: Phaser.Math.Between(0, w), y: h + m },
      { x: -m, y: Phaser.Math.Between(0, h) }
    ][Phaser.Math.Between(0, 3)];
    let EnemyClass = Enemy;
    if (this.wave > 2 && Math.random() < 0.4) EnemyClass = FastEnemy;
    if (this.wave > 4 && Math.random() < 0.3) EnemyClass = ShooterEnemy;
    this.enemyGroup.add(new EnemyClass(this.scene, p.x, p.y));
    this.enemiesSpawned++;
  }

  isWaveInProgress() {
    return this.waveInProgress;
  }

  getCurrentWave() {
    return this.wave;
  }
}
