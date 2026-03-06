// ═══════════════════════════════════════════════
// DUNGEON WORLD - Game Data
// ═══════════════════════════════════════════════

// ==================== CLASSES ====================
// Moved to classes-config.js

// ==================== BIOMES ====================
// Moved to biomes-list-config.js

// ==================== WEAPONS ====================
// Moved to weapons-config.js

// ==================== PASSIVE SPELLS ====================
// Moved to upgrades-config.js

// ==================== UPGRADES ====================
// Moved to upgrades-config.js

// ==================== PERMANENT UPGRADES ====================
// Moved to perm-upgrades-config.js

// ==================== COSMETICS ====================
// Moved to cosmetics-config.js

// ==================== MONSTER TYPES ====================
// Moved to monsters-config.js

// ==================== GAME STATE ====================
// Moved to game-state-config.js

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CLASSES: (typeof CLASSES !== 'undefined') ? CLASSES : [],
    BIOMES: (typeof BIOMES !== 'undefined') ? BIOMES : [],
    WEAPONS: (typeof WEAPONS !== 'undefined') ? WEAPONS : {},
    PASSIVES: (typeof PASSIVES !== 'undefined') ? PASSIVES : {},
    UPGRADES: (typeof UPGRADES !== 'undefined') ? UPGRADES : [],
    RARITIES: (typeof RARITIES !== 'undefined') ? RARITIES : {},
    MTYPES: (typeof MTYPES !== 'undefined') ? MTYPES : [],
    PERM_UPGRADES: (typeof PERM_UPGRADES !== 'undefined') ? PERM_UPGRADES : [],
    COSMETICS: (typeof COSMETICS !== 'undefined') ? COSMETICS : [],
    GameState: (typeof GameState !== 'undefined') ? GameState : {}
  };
}
