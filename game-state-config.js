// ==================== GAME STATE ====================
var GameState = {
  // Player stats
  pHP: 100, pMaxHP: 100,
  pVelY: 0, pKills: 0, pXP: 0, pLevel: 1, pScore: 0,
  pRegen: 0, pLuck: 1, pVamp: 0, pExec: 0, pThorns: 0,
  pDashCdMult: 1, pXpMult: 1, pMaxJumps: 1, pJumpCount: 0,
  pCritDmg: 2.0, pDodge: 0, pArea: 1, pDmgRed: 0, pLowHpDmg: 0,
  pPickupRange: 3.5,
  pBleedChance: 0, pKnockback: 0,
  pGambler: false, pWindwalker: false, pTank: false, pAssassin: false,

  // Game state
  invTimer: 0, gameRunning: false, levelingUp: false,
  frenzyTimer: 0, globalTime: 0, pT: 0,
  paused: false,

  // Dash
  dashCd: 0, dashTime: 0, dashDir: new THREE.Vector3(),

  // Boss
  nextBossKills: 15, bossAlive: false, finalBossSpawned: false,

  // Loop System (NG+)
  loopLevel: 0, totalPlayTime: 0, totalKills: 0, totalLoops: 0,

  // Selection
  selCharIdx: 0, selMapIdx: 0,

  // Quest
  currentQuest: null,

  // Player class/biome
  pClass: null, pBiome: null,

  // Upgrades
  playerUpgrades: {},
  weaponPaths: {},

  // UI State
  galleryMode: false, autoUpgrade: false,

  // Save data
  saveData: { wins: {}, unlockedClasses: ['mage', 'knight'], unlockedBiomes: ['plains'], cards: [], money: 0, gold: 0, permUpgrades: {}, unlockedCosmetics: ['default'], equippedCosmetic: 'default', unlockedThemes: ['medieval'], selectedTheme: 'medieval', settings: { view: 0, particles: 1 } }
};
