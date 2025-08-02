export interface GameState {
  score: number
  health: number
  maxHealth: number
  isGameOver: boolean
  wavePause: boolean
  enemiesLeftStatic: number
  comboCount: number
  comboTimer: number
}

export interface PowerUpState {
  triple: boolean
  speedBoost: boolean
  shield: boolean
}

export interface GameTimers {
  lastEnemy: number
  lastPower: number
  lastShot: number
}

export interface GameData {
  playerName?: string
}

export interface WaveCallbacks {
  onWaveStart: (wave: number) => void
  onWaveEnd: (wave: number) => void
}
