// ═══════════════════════════════════════════════
// DUNGEON WORLD - Biome Configurations
// ═══════════════════════════════════════════════
// Extracted and organized for better maintainability

/**
 * Get complete biome profile with all generation parameters
 * @param {Object} biome - Biome object with id and metadata
 * @returns {Object} Complete biome configuration for terrain generation
 */
function getBiomeProfile(biome) {
  const id = biome && biome.id ? biome.id : 'plains';
  const seed = biomeIdSeed(id);
  
  // Base defaults (used as fallback)
  const fx = {
    seed,
    terrainFreq: 0.01,
    terrainDetailFreq: 0.05,
    terrainAmp: 15,
    detailAmp: 3,
    layoutMode: 0,
    layoutRadius: 200,
    layoutStrength: 1,
    spawnRateMult: 1.0,
    packSizeMult: 1.0,
    spawnRadiusMin: 25,
    spawnRadiusMax: 40,
    gravity: -22,
    playerSpeedMult: 1.0,
    jumpMult: 1.0,
    chestRateMult: 1.0,
    structureChance: 0.75,
    treeDensity: 10,
    rockDensity: 6,
    grassDensity: 200,
    spriteDensityMult: 1.0,
    terrainArchetype: 'wild',
    mobHpMult: 1.0,
    mobDmgMult: 1.0,
    mobSpdMult: 1.0,
    xpMult: 1.0,
    eliteBossTime: 300,
    hazardType: 'none',
    hazardInterval: 5.0,
    hazardPower: 1.0
  };

  // ==================== THEMATIC CONFIGURATIONS (60+ BIOMES) ====================
  
  // === NATURE & WILDERNESS ===
  if (id === 'plains') {
    fx.terrainFreq = 0.008; fx.terrainAmp = 12; fx.terrainArchetype = 'wild';
    fx.treeDensity = 8; fx.grassDensity = 280; fx.structureChance = 0.65;
  } else if (id === 'farm') {
    fx.terrainFreq = 0.006; fx.terrainAmp = 8; fx.terrainArchetype = 'wild';
    fx.treeDensity = 4; fx.grassDensity = 150; fx.structureChance = 0.9; // Lots of barns/fences
  } else if (id === 'forest') {
    fx.terrainFreq = 0.012; fx.terrainAmp = 18; fx.terrainArchetype = 'wild';
    fx.treeDensity = 24; fx.grassDensity = 200; fx.structureChance = 0.4; // Dense trees
  } else if (id === 'jungle') {
    fx.terrainFreq = 0.015; fx.terrainAmp = 22; fx.terrainArchetype = 'wild';
    fx.treeDensity = 32; fx.grassDensity = 350; fx.spriteDensityMult = 1.4; fx.structureChance = 0.3;
  } else if (id === 'swamp') {
    fx.terrainFreq = 0.008; fx.terrainAmp = 6; fx.detailAmp = 4; fx.terrainArchetype = 'archipelago';
    fx.treeDensity = 14; fx.grassDensity = 100; fx.structureChance = 0.5; fx.hazardType = 'poison';
  } else if (id === 'sewer') {
    fx.terrainArchetype = 'maze'; fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 0.7;
    fx.spriteDensityMult = 0.4; fx.hazardType = 'poison'; fx.hazardInterval = 3.5;
  } else if (id === 'hive') {
    fx.terrainFreq = 0.02; fx.terrainAmp = 10; fx.terrainArchetype = 'wild'; // Organic terrain
    fx.treeDensity = 0; fx.grassDensity = 0; fx.rockDensity = 25; fx.structureChance = 1.2; // Lots of hive structures
    fx.spriteDensityMult = 0.75; fx.hazardType = 'poison';
  }
  
  // === DESERT & ARID ===
  else if (id === 'desert') {
    fx.terrainFreq = 0.006; fx.terrainAmp = 20; fx.terrainArchetype = 'ridges'; // Dunes
    fx.treeDensity = 0; fx.grassDensity = 5; fx.rockDensity = 12; fx.structureChance = 0.9; // Pyramids
    fx.hazardType = 'sand'; fx.spriteDensityMult = 0.5;
  } else if (id === 'wildwest') {
    fx.terrainFreq = 0.009; fx.terrainAmp = 25; fx.terrainArchetype = 'ridges'; // Canyons
    fx.treeDensity = 2; fx.grassDensity = 15; fx.rockDensity = 18; fx.structureChance = 0.75;
    fx.hazardType = 'sand';
  }
  
  // === COLD & ICE ===
  else if (id === 'snow') {
    fx.terrainFreq = 0.01; fx.terrainAmp = 30; fx.terrainArchetype = 'ridges'; // Mountains
    fx.treeDensity = 6; fx.grassDensity = 40; fx.rockDensity = 20; fx.structureChance = 0.65;
    fx.hazardType = 'frost'; fx.spriteDensityMult = 0.7;
  } else if (id === 'storm') {
    fx.terrainFreq = 0.012; fx.terrainAmp = 22; fx.terrainArchetype = 'wild';
    fx.treeDensity = 4; fx.grassDensity = 60; fx.rockDensity = 10; fx.structureChance = 0.5;
    fx.hazardType = 'frost'; fx.hazardInterval = 4.0;
  }
  
  // === UNDERGROUND & MINING ===
  else if (id === 'mine') {
    fx.terrainArchetype = 'maze'; 
    fx.treeDensity = 0; fx.grassDensity = 0; fx.rockDensity = 0; fx.structureChance = 0.8;
    fx.spriteDensityMult = 0.5;
  }
  
  // === WATER & ISLANDS ===
  else if (id === 'ocean') {
    fx.terrainFreq = 0.007; fx.terrainAmp = 35; fx.terrainArchetype = 'archipelago'; // Open water + islands
    fx.treeDensity = 6; fx.grassDensity = 80; fx.rockDensity = 10; fx.structureChance = 0.4;
    fx.hazardType = 'tide'; fx.spriteDensityMult = 0.5;
  } else if (id === 'pirate') {
    fx.terrainFreq = 0.009; fx.terrainAmp = 15; fx.terrainArchetype = 'archipelago';
    fx.treeDensity = 12; fx.grassDensity = 120; fx.structureChance = 0.85; // Ships & docks
    fx.hazardType = 'tide';
  } else if (id === 'atlantis') {
    fx.terrainFreq = 0.008; fx.terrainAmp = 12; fx.terrainArchetype = 'archipelago';
    fx.treeDensity = 8; fx.grassDensity = 150; fx.structureChance = 1.0; // Ruins
    fx.hazardType = 'tide'; fx.spriteDensityMult = 0.65;
  } else if (id === 'deep') {
    fx.terrainFreq = 0.006; fx.terrainAmp = 40; fx.terrainArchetype = 'fracture'; // Trenches
    fx.treeDensity = 0; fx.grassDensity = 0; fx.rockDensity = 18; fx.structureChance = 0.3;
    fx.hazardType = 'tide'; fx.spriteDensityMult = 0.3; fx.gravity = -15; // Underwater feel
  }
  
  // === UNDEAD & GOTHIC ===
  else if (id === 'graveyard') {
    fx.terrainFreq = 0.007; fx.terrainAmp = 10; fx.terrainArchetype = 'wild';
    fx.treeDensity = 10; fx.grassDensity = 80; fx.rockDensity = 0; fx.structureChance = 1.1; // Lots of tombstones
    fx.spriteDensityMult = 0.8;
  } else if (id === 'crypt') {
    fx.terrainArchetype = 'maze';
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 0.75;
    fx.spriteDensityMult = 0.4;
  } else if (id === 'dungeon') {
    fx.terrainArchetype = 'maze';
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 0.8;
    fx.spriteDensityMult = 0.5;
  } else if (id === 'prison') {
    fx.terrainArchetype = 'maze'; // Grid-like corridors
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 0.9; // Cells
    fx.spriteDensityMult = 0.3;
  }
  
  // === ANCIENT & RUINS ===
  else if (id === 'ruins') {
    fx.terrainFreq = 0.01; fx.terrainAmp = 18; fx.terrainArchetype = 'fracture'; // Broken land
    fx.treeDensity = 8; fx.grassDensity = 120; fx.structureChance = 1.2; // Lots of ruins
    fx.spriteDensityMult = 0.7;
  } else if (id === 'prehistoric') {
    fx.terrainFreq = 0.012; fx.terrainAmp = 25; fx.terrainArchetype = 'wild';
    fx.treeDensity = 18; fx.grassDensity = 300; fx.rockDensity = 14; fx.structureChance = 0.5;
    fx.spriteDensityMult = 1.2;
  } else if (id === 'samurai') {
    fx.terrainFreq = 0.009; fx.terrainAmp = 14; fx.terrainArchetype = 'wild';
    fx.treeDensity = 20; fx.grassDensity = 200; fx.structureChance = 0.9; // Pagodas, torii gates
    fx.spriteDensityMult = 1.0;
  }
  
  // === FIRE & LAVA ===
  else if (id === 'magma') {
    fx.terrainFreq = 0.01; fx.terrainAmp = 22; fx.terrainArchetype = 'ridges'; // Rocky terrain
    fx.treeDensity = 0; fx.grassDensity = 0; fx.rockDensity = 20; fx.structureChance = 0.65;
    fx.hazardType = 'burn'; fx.hazardInterval = 3.5; fx.hazardPower = 1.3; fx.spriteDensityMult = 0.55;
  } else if (id === 'volcano') {
    fx.terrainFreq = 0.012; fx.terrainAmp = 35; fx.terrainArchetype = 'ridges';
    fx.treeDensity = 0; fx.grassDensity = 0; fx.rockDensity = 24; fx.structureChance = 0.5;
    fx.hazardType = 'burn'; fx.hazardInterval = 3.0; fx.hazardPower = 1.5; fx.spriteDensityMult = 0.45;
  } else if (id === 'core') {
    fx.terrainFreq = 0.015; fx.terrainAmp = 30; fx.terrainArchetype = 'fracture'; // Chaotic lava
    fx.treeDensity = 0; fx.grassDensity = 0; fx.rockDensity = 15; fx.structureChance = 0.4;
    fx.hazardType = 'burn'; fx.hazardInterval = 2.8; fx.hazardPower = 1.7; fx.spriteDensityMult = 0.4;
  }
  
  // === SKY & FLIGHT ===
  else if (id === 'sky') {
    fx.terrainArchetype = 'skyPlatforms'; // Floating islands
    fx.treeDensity = 8; fx.grassDensity = 120; fx.structureChance = 0.7;
    fx.gravity = -14; fx.jumpMult = 1.3; fx.spriteDensityMult = 0.5;
  } else if (id === 'heavens') {
    fx.terrainArchetype = 'skyPlatforms';
    fx.treeDensity = 10; fx.grassDensity = 180; fx.structureChance = 0.85;
    fx.gravity = -12; fx.jumpMult = 1.4; fx.spriteDensityMult = 0.6;
  }
  
  // === WHIMSICAL & FANTASY ===
  else if (id === 'candy') {
    fx.terrainFreq = 0.01; fx.terrainAmp = 15; fx.terrainArchetype = 'wild';
    fx.treeDensity = 12; fx.grassDensity = 250; fx.structureChance = 0.85; // Candy houses
    fx.gravity = -18; fx.spriteDensityMult = 1.1;
  } else if (id === 'kitchen') {
    fx.terrainArchetype = 'maze'; // Kitchen counter layout
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 1.3; // Lots of kitchen stuff
    fx.spriteDensityMult = 0.6;
  } else if (id === 'toy') {
    fx.terrainFreq = 0.012; fx.terrainAmp = 20; fx.terrainArchetype = 'wild'; // Bumpy toybox
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 1.2; // Toy structures
    fx.gravity = -18; fx.spriteDensityMult = 0.8;
  } else if (id === 'circus') {
    fx.terrainFreq = 0.009; fx.terrainAmp = 12; fx.terrainArchetype = 'wild';
    fx.treeDensity = 6; fx.grassDensity = 100; fx.structureChance = 0.95; // Tents
    fx.spriteDensityMult = 0.9;
  } else if (id === 'fairy') {
    fx.terrainFreq = 0.011; fx.terrainAmp = 16; fx.terrainArchetype = 'wild';
    fx.treeDensity = 22; fx.grassDensity = 320; fx.structureChance = 0.6;
    fx.gravity = -18; fx.spriteDensityMult = 1.3; // Magical sparkles
  }
  
  // === KNOWLEDGE & CULTURE ===
  else if (id === 'library') {
    fx.terrainArchetype = 'maze'; // Bookshelves as walls
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 1.0; // Bookshelves
    fx.spriteDensityMult = 0.5;
  } else if (id === 'museum') {
    fx.terrainArchetype = 'maze'; // Gallery halls
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 0.95; // Exhibits
    fx.spriteDensityMult = 0.45;
  } else if (id === 'asylum') {
    fx.terrainArchetype = 'maze'; // Asylum corridors
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 0.85;
    fx.spriteDensityMult = 0.35;
  }
  
  // === MUSIC & HARMONY (SPECIAL) ===
  else if (id === 'music') {
    // Symphonie: Terrain with harmonic waves, musical structures
    fx.terrainFreq = 0.025; fx.terrainAmp = 18; fx.terrainArchetype = 'wild'; // Flowing waves
    fx.detailAmp = 6; // Extra detail for "notes"
    fx.treeDensity = 10; fx.grassDensity = 180; fx.structureChance = 0.85; // Instruments
    fx.gravity = -18; fx.spriteDensityMult = 0.9;
    // Note: terrain should have wave-like patterns (handled in terrainH if needed)
  }
  
  // === TECH & MACHINES ===
  else if (id === 'steampunk') {
    fx.terrainFreq = 0.007; fx.terrainAmp = 10; fx.terrainArchetype = 'wild'; // Industrial flat-ish
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 1.1; // Lots of machines
    fx.hazardType = 'overload'; fx.spriteDensityMult = 0.5;
  } else if (id === 'clockwork') {
    fx.terrainFreq = 0.008; fx.terrainAmp = 8; fx.terrainArchetype = 'wild'; // Gear-like patterns
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 1.2; // Gears everywhere
    fx.hazardType = 'overload'; fx.spriteDensityMult = 0.55;
  } else if (id === 'cyber') {
    fx.terrainFreq = 0.009; fx.terrainAmp = 12; fx.terrainArchetype = 'wild'; // Tech grid
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 0.95; // Buildings
    fx.hazardType = 'overload'; fx.spriteDensityMult = 0.5;
  } else if (id === 'lab') {
    fx.terrainArchetype = 'maze'; // Lab corridors
    fx.treeDensity = 0; fx.grassDensity = 0; fx.structureChance = 0.9;
    fx.hazardType = 'overload'; fx.spriteDensityMult = 0.4;
  }
  
  // === CRYSTALS & GEMS ===
  else if (id === 'crystal') {
    fx.terrainFreq = 0.012; fx.terrainAmp = 28; fx.terrainArchetype = 'ridges'; // Spiky crystals
    fx.treeDensity = 0; fx.grassDensity = 0; fx.rockDensity = 28; fx.structureChance = 0.6;
    fx.spriteDensityMult = 1.0; // Lots of crystal sprites
  }
  
  // === ALIEN & EXTRATERRESTRIAL ===
  else if (id === 'alien') {
    fx.terrainFreq = 0.014; fx.terrainAmp = 24; fx.terrainArchetype = 'fracture'; // Alien landscape
    fx.treeDensity = 8; fx.grassDensity = 120; fx.rockDensity = 18; fx.structureChance = 0.7;
    fx.gravity = -16; fx.spriteDensityMult = 0.8;
  } else if (id === 'web') {
    fx.terrainFreq = 0.01; fx.terrainAmp = 14; fx.terrainArchetype = 'wild'; // Webbed terrain
    fx.treeDensity = 0; fx.grassDensity = 0; fx.rockDensity = 15; fx.structureChance = 0.85; // Web structures
    fx.spriteDensityMult = 0.7;
  }
  
  // === VOID & ABSTRACT ===
  else if (id === 'void') {
    fx.terrainFreq = 0.008; fx.terrainAmp = 25; fx.terrainArchetype = 'fracture'; // Broken void
    fx.treeDensity = 0; fx.grassDensity = 0; fx.rockDensity = 10; fx.structureChance = 0.4;
    fx.hazardType = 'voidPulse'; fx.hazardInterval = 5.0; fx.hazardPower = 1.2;
    fx.gravity = -15; fx.spriteDensityMult = 0.45;
  } else if (id === 'shadow') {
    fx.terrainFreq = 0.01; fx.terrainAmp = 16; fx.terrainArchetype = 'fracture';
    fx.treeDensity = 8; fx.grassDensity = 60; fx.rockDensity = 12; fx.structureChance = 0.5;
    fx.hazardType = 'voidPulse'; fx.spriteDensityMult = 0.5;
  } else if (id === 'warp') {
    fx.terrainFreq = 0.02; fx.terrainAmp = 30; fx.terrainArchetype = 'fracture'; // Chaotic warp
    fx.treeDensity = 5; fx.grassDensity = 80; fx.rockDensity = 15; fx.structureChance = 0.45;
    fx.hazardType = 'voidPulse'; fx.gravity = -10; fx.spriteDensityMult = 0.6;
  } else if (id === 'abyss') {
    fx.terrainFreq = 0.007; fx.terrainAmp = 35; fx.terrainArchetype = 'fracture'; // Deep fractures
    fx.treeDensity = 0; fx.grassDensity = 0; fx.rockDensity = 8; fx.structureChance = 0.3;
    fx.hazardType = 'voidPulse'; fx.hazardInterval = 5.5; fx.hazardPower = 1.4;
    fx.gravity = -18; fx.spriteDensityMult = 0.35;
  } else if (id === 'chaos') {
    fx.terrainFreq = 0.025; fx.terrainAmp = 40; fx.terrainArchetype = 'fracture'; // Extremely chaotic
    fx.treeDensity = 10; fx.grassDensity = 150; fx.rockDensity = 20; fx.structureChance = 0.5;
    fx.hazardType = 'voidPulse'; fx.hazardPower = 1.5; fx.gravity = -25; fx.spriteDensityMult = 0.75;
  } else if (id === 'omega') {
    fx.terrainFreq = 0.018; fx.terrainAmp = 32; fx.terrainArchetype = 'fracture';
    fx.treeDensity = 0; fx.grassDensity = 0; fx.rockDensity = 0; fx.structureChance = 0.6;
    fx.hazardType = 'voidPulse'; fx.hazardInterval = 3.0; fx.hazardPower = 2.0;
    fx.spriteDensityMult = 0.3;
  }

  // Scale stats by difficulty tier
  const diff = biome ? biome.diff : 1.0;
  fx.mobHpMult = 0.85 + diff * 0.15;
  fx.mobDmgMult = 0.9 + diff * 0.12;
  fx.mobSpdMult = 0.95 + diff * 0.08;
  fx.xpMult = 0.9 + diff * 0.08;
  fx.eliteBossTime = Math.max(240, 340 - diff * 8);

  return fx;
}

/**
 * Generate deterministic seed from biome ID
 * @param {string} id - Biome identifier
 * @returns {number} Seed value for procedural generation
 */
function biomeIdSeed(id) {
  let s = 12345;
  for (let i = 0; i < id.length; i++) {
    s = (s * 131 + id.charCodeAt(i)) % 1000003;
  }
  return s;
}
