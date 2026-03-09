// ═══════════════════════════════════════════════
// DUNGEON WORLD - Terrain Utilities
// ═══════════════════════════════════════════════

// ==================== TERRAIN GENERATION ====================
let currentBiome = 'plains';
function setTerrainBiome(id) { currentBiome = id; }
let currentBiomeProfile = null;
function setTerrainBiomeProfile(profile) { currentBiomeProfile = profile || null; }

function terrainH(x, z) {
  const p = currentBiomeProfile;
  const seedOff = p ? (p.seed % 997) * 0.01 : 0;
  const bFreq = p ? p.terrainFreq : 0.01;
  const dFreq = p ? p.terrainDetailFreq : 0.05;
  const bAmp = p ? p.terrainAmp : 15;
  const dAmp = p ? p.detailAmp : 2;
  const layoutMode = p ? p.layoutMode : 0;
  const layoutRadius = p ? p.layoutRadius : 220;
  const layoutStrength = p ? p.layoutStrength : 4;

  let val = octave((x + seedOff * 37) * bFreq, (z - seedOff * 53) * bFreq, 4, 2, 0.5) * bAmp
    + octave((x - seedOff * 19) * dFreq, (z + seedOff * 17) * dFreq, 2, 2, 0.5) * dAmp;

  const terrainArchetype = p && p.terrainArchetype ? p.terrainArchetype : 'wild';

  if (terrainArchetype === 'maze') {
    const cell = 14;
    const corridor = 3.3;
    const lx = ((x % cell) + cell) % cell;
    const lz = ((z % cell) + cell) % cell;
    const gx = Math.floor(x / cell);
    const gz = Math.floor(z / cell);
    const vGate = hash(gx * 177 + gz * 313 + SEED * 0.13) > 0.35;
    const hGate = hash(gx * 211 + gz * 271 + SEED * 0.17) > 0.35;
    const nearVWall = lx < corridor || lx > cell - corridor;
    const nearHWall = lz < corridor || lz > cell - corridor;
    const wall = (nearVWall && !vGate) || (nearHWall && !hGate);
    const baseFloor = -0.6 + octave(x * 0.035, z * 0.035, 2, 2, 0.5) * 0.8;
    return wall ? 8.5 + octave(x * 0.1, z * 0.1, 2, 2, 0.5) * 1.5 : baseFloor;
  }

  if (terrainArchetype === 'skyPlatforms') {
    if (x * x + z * z < 900) {
      return 6 + octave(x * 0.08, z * 0.08, 2, 2, 0.5) * 1.8;
    }
    const n = octave(x * 0.018, z * 0.018, 2, 2, 0.5);
    if (n < 0.46) return -120;
    const plat = Math.floor((n - 0.46) * 18);
    return 7 + plat * 2.2 + octave(x * 0.09, z * 0.09, 2, 2, 0.5) * 1.2;
  }

  if (terrainArchetype === 'archipelago') {
    const n = octave(x * 0.013, z * 0.013, 3, 2, 0.5);
    if (n < 0.45) return -9.5;
    return (n - 0.45) * 24 + 0.5;
  }

  if (terrainArchetype === 'fracture') {
    const rift = Math.abs(Math.sin((x + seedOff) * 0.028) * Math.cos((z - seedOff) * 0.028));
    if (rift < 0.22) return -35;
    val = val * 0.55 + rift * 18;
  }

  if (terrainArchetype === 'ridges') {
    const ridge = Math.abs(Math.sin((x + seedOff) * 0.035) + Math.cos((z - seedOff) * 0.031));
    val = Math.abs(val) * 1.2 + ridge * 8;
  }
  
  // Floating Islands (Abyss)
  if (terrainArchetype === 'wild' && ['sky', 'heavens', 'void', 'chaos', 'warp', 'shadow'].includes(currentBiome)) {
    // Force spawn island at (0,0) to prevent infinite falling loop
    if (x * x + z * z < 900) { // 30m radius safe zone
        return 5 + octave(x * 0.1, z * 0.1, 2, 2, 0.5) * 2;
    }

    const n = octave(x * 0.02, z * 0.02, 2, 2, 0.5);
    if (n < 0.35) return -100; // Abyss
    val = (n - 0.35) * 30;
  } 
  // Water Islands
  else if (terrainArchetype === 'wild' && ['pirate', 'ocean'].includes(currentBiome)) {
    const n = octave(x * 0.015, z * 0.015, 2, 2, 0.5);
    if (n < 0.4) return -8; // Sea floor / Water
    val = (n - 0.4) * 20 + 1;
  }
  // Standard Biomes
  else if (currentBiome === 'desert' || currentBiome === 'wildwest') {
    val = octave(x * 0.003, z * 0.003, 3, 2, 0.5) * 20 + Math.sin(x * 0.02) * 5;
  } else if (currentBiome === 'snow' || currentBiome === 'mountains' || currentBiome === 'storm') {
    val = Math.abs(val) * 2.5; 
  } else if (currentBiome === 'swamp' || currentBiome === 'sewer' || currentBiome === 'atlantis') {
    val = val * 0.3 - 4.0;
    if(currentBiome === 'ocean' || currentBiome === 'atlantis') val += Math.sin(x*0.05)*Math.cos(z*0.05)*5; // Seabed waves
  } else if (currentBiome === 'magma' || currentBiome === 'volcano' || currentBiome === 'core') {
    val = Math.abs(val) * 1.8;
  } else if (['ruins', 'dungeon', 'crypt', 'prison', 'mine'].includes(currentBiome)) {
    val = Math.floor(val / 4) * 4; // Terraced
  } else if (['cyber', 'steampunk', 'kitchen', 'toy', 'circus', 'asylum', 'library', 'lab', 'museum', 'clockwork'].includes(currentBiome)) {
    // Flat floors for buildings
    val = 0; 
  } else if (currentBiome === 'alien') {
    val = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 10 + octave(x*0.1, z*0.1, 2, 2, 0.5)*5;
  }

  const flatBiomes = ['cyber', 'steampunk', 'kitchen', 'toy', 'circus', 'asylum', 'library', 'lab', 'museum', 'clockwork'];
  if (!flatBiomes.includes(currentBiome)) {
    const d = Math.hypot(x, z);
    const ring = Math.cos(d / layoutRadius);
    if (layoutMode === 0) {
      val += ring * layoutStrength;
    } else if (layoutMode === 1) {
      val += Math.max(0, 1 - d / (layoutRadius * 1.4)) * layoutStrength * 1.6;
    } else if (layoutMode === 2) {
      val -= Math.max(0, 1 - d / (layoutRadius * 1.2)) * layoutStrength * 1.2;
    } else if (layoutMode === 3) {
      val += Math.sin((x - z) / (layoutRadius * 0.75)) * layoutStrength * 0.9;
    } else {
      val += Math.abs(Math.sin(x / (layoutRadius * 0.55)) * Math.cos(z / (layoutRadius * 0.55))) * layoutStrength - layoutStrength * 0.45;
    }
  }

  // Per-biome unique terrain signature layer.
  if (p && !flatBiomes.includes(currentBiome)) {
    if (p.terrainMode === 1) {
      val = Math.abs(val) * 1.15;
    } else if (p.terrainMode === 2) {
      const step = Math.max(1, p.terrainStep || 3);
      val = Math.floor(val / step) * step;
    } else if (p.terrainMode === 3) {
      val += Math.sin((x + seedOff) * (p.waveFreq || 0.03)) * (p.waveAmp || 1.5)
        + Math.cos((z - seedOff) * (p.waveFreq || 0.03)) * (p.waveAmp || 1.5) * 0.7;
    }
  }
  return val;
}
