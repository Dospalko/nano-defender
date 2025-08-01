export const GAME_CONFIG = {
  PLAYER: {
    INITIAL_HEALTH: 3,
    MAX_HEALTH: 5,
    SHOOT_COOLDOWN: 400,
  },
  POWERUPS: {
    SPAWN_INTERVAL: 12000,
    TRIPLE_SHOT_DURATION: 8000,
    SPEED_BOOST_DURATION: 8000,
    SHIELD_DURATION: 5000,
    HEAL_DISPLAY_DURATION: 1500,
  },
  COMBO: {
    RESET_TIME: 3000,
    BASE_SCORE: 10,
    BONUS_MULTIPLIER: 5,
  },
  EFFECTS: {
    SCREEN_SHAKE_DURATION: 200,
    SCREEN_SHAKE_INTENSITY: 0.02,
    MUZZLE_FLASH_DURATION: 100,
    EXPLOSION_DURATION: 400,
  },
  BACKGROUND: {
    STAR_COUNT: 100,
    GRID_SIZE: 80,
    SCAN_LINE_COUNT: 2,
    SCAN_DURATION: 6000,
  },
} as const

export const COLORS = {
  PRIMARY: 0x00ff88,
  SECONDARY: 0x00ccff,
  DANGER: 0xff4757,
  WARNING: 0xffa502,
  SUCCESS: 0x00ff88,
  SHIELD: 0xffd93c,
  HEAL: 0xff4a4a,
  EXPLOSION: 0xff6b6b,
  WHITE: 0xffffff,
  DARK_BG: 0x1a1a2e,
} as const
