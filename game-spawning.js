// ═══════════════════════════════════════════════
// DUNGEON WORLD - Spawning System
// ═══════════════════════════════════════════════

// ==================== SPAWN TIMERS ====================
let spawnTimer = 1.2; // Démarrage rapide pour mettre de la pression
let chestTimer = 15;
let bossSpawnTimer = 60; // Boss toutes les minutes
let nextBossTime = 60; // Premier boss à 1 minute

const RUN_DIRECTOR_PHASES = [
  { t: 0, name: 'Eveil', spawnMul: 0.92, packMul: 0.9, capMul: 0.9, eliteChance: 0.00, bossEvery: 70 },
  { t: 60, name: 'Pression', spawnMul: 1.0, packMul: 1.0, capMul: 1.0, eliteChance: 0.03, bossEvery: 60 },
  { t: 120, name: 'Swarm', spawnMul: 1.1, packMul: 1.15, capMul: 1.2, eliteChance: 0.06, bossEvery: 55 },
  { t: 180, name: 'Survie', spawnMul: 1.2, packMul: 1.28, capMul: 1.35, eliteChance: 0.09, bossEvery: 50 },
  { t: 240, name: 'Cataclysme', spawnMul: 1.32, packMul: 1.45, capMul: 1.55, eliteChance: 0.14, bossEvery: 45 }
];

function getRunDirectorPhase() {
  const t = Math.max(0, Number((typeof GameState !== 'undefined' && GameState && GameState.pT) || 0));
  let out = RUN_DIRECTOR_PHASES[0];
  for (let i = 0; i < RUN_DIRECTOR_PHASES.length; i++) {
    if (t >= RUN_DIRECTOR_PHASES[i].t) out = RUN_DIRECTOR_PHASES[i];
    else break;
  }
  return out;
}

function updateRunDirectorState() {
  if (typeof GameState === 'undefined' || !GameState) return RUN_DIRECTOR_PHASES[0];
  const phase = getRunDirectorPhase();
  if (!GameState.runDirector || GameState.runDirector.phaseName !== phase.name) {
    GameState.runDirector = {
      phaseName: phase.name,
      phaseStart: phase.t,
      spawnMul: phase.spawnMul,
      packMul: phase.packMul,
      capMul: phase.capMul,
      eliteChance: phase.eliteChance,
      bossEvery: phase.bossEvery,
      fps: (GameState.runDirector && GameState.runDirector.fps) || 60,
      perfScale: (GameState.runDirector && GameState.runDirector.perfScale) || 1
    };
    if (GameState.gameRunning && typeof addNotif === 'function') {
      addNotif('⚙ Phase: ' + phase.name, '#ffd37a');
    }
  }
  return GameState.runDirector;
}

window.getRunDirectorSnapshot = function() {
  return updateRunDirectorState();
};

window.resetSpawnTimers = function() {
  const phase = getRunDirectorPhase();
  bossSpawnTimer = phase.bossEvery;
  nextBossTime = Math.max(45, phase.bossEvery);
  GameState.runDirector = null;
};

// ==================== BOSS UNLOCK CHECKER ====================
window.checkBossUnlocks = function() {
  let newUnlock = false;
  CLASSES.forEach(c => {
    if (c.linkedBiome && !GameState.saveData.unlockedClasses.includes(c.id)) {
      const b = BIOMES.find(x => x.id === c.linkedBiome);
      if (b) {
        const allMobs = [...b.mobs, b.boss];
        const hasAll = allMobs.every(m => GameState.saveData.cards.includes(m));
        if (hasAll) {
          GameState.saveData.unlockedClasses.push(c.id);
          addNotif(`🔓 Personnage débloqué: ${c.name}`, '#00ff00');
          newUnlock = true;
        }
      }
    }
  });
  if (newUnlock && window.saveGame) window.saveGame();
};

// ==================== SPAWN FUNCTIONS ====================
function doSpawn() {
  if (GameState.finalBossSpawned) return;
  const director = updateRunDirectorState();
  const pp = playerPivot.position;
  const fx = GameState.biomeFx || { packSizeMult: 1, spawnRadiusMin: 15, spawnRadiusMax: 25 };
  const perfScale = Math.max(0.6, Math.min(1.1, Number(GameState.perfSpawnScale || (director && director.perfScale) || 1)));
  
  // Limite augmentée progressivement (style Vampire Survivors)
  const loopBonus = GameState.loopLevel * 30; // +30 ennemis par loop
  const baseLimit = 80;
  const phaseCap = director ? director.capMul : 1;
  const maxMonsters = Math.floor((baseLimit + loopBonus + (GameState.modX2 ? 40 : 0)) * phaseCap * perfScale);
  
  if (monsters.length >= maxMonsters) return;
  
  const phasePack = director ? director.packMul : 1;
  const pack = Math.max(2, Math.floor(fx.packSizeMult * phasePack * perfScale * (1.6 + GameState.loopLevel * 0.25)));
  for (let i = 0; i < pack; i++) {
    if (monsters.length >= maxMonsters) break;
    const a = Math.random() * Math.PI * 2;
    // Spawn plus proche pour swarm (15-25 au lieu de 26-40)
    const d = fx.spawnRadiusMin + Math.random() * Math.max(4, fx.spawnRadiusMax - fx.spawnRadiusMin);
    const m = new Monster(pp.x + Math.cos(a) * d, pp.z + Math.sin(a) * d);
    if (director && Math.random() < director.eliteChance) {
      m.isElite = true;
      m.T.hp *= 1.85;
      m.T.dmg *= 1.25;
      m.mhp = m.T.hp;
      m.hp = Math.min(m.hp + m.mhp * 0.7, m.mhp);
      m.T.spd *= 1.08;
      if (m.hpFill && m.hpFill.material) m.hpFill.material.color.setHex(0xffbb33);
      if (m.hpBorder && m.hpBorder.material) m.hpBorder.material.color.setHex(0x775500);
    }
    monsters.push(m);
  }
}

function findSafeSpawnPoint() {
  // Prefer the center when it is valid.
  const centerH = terrainH(0, 0);
  if (Number.isFinite(centerH) && centerH > -50) {
    return { x: 0, z: 0, h: centerH };
  }

  // Spiral search for a valid floor patch near the origin.
  let angle = 0;
  let radius = 0;
  for (let i = 0; i < 320; i++) {
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const h = terrainH(x, z);
    if (Number.isFinite(h) && h > -50) {
      return { x, z, h };
    }
    angle += 0.45;
    radius += 1.9;
  }

  // Hard fallback keeps game playable even if terrain profile is broken.
  return { x: 0, z: 0, h: 0 };
}

function findSafeSpawnNearPlayer(minRadius, maxRadius) {
  const pp = playerPivot && playerPivot.position ? playerPivot.position : { x: 0, z: 0 };
  const rMin = Math.max(8, Number(minRadius) || 18);
  const rMax = Math.max(rMin + 4, Number(maxRadius) || 34);

  for (let i = 0; i < 40; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = rMin + Math.random() * (rMax - rMin);
    const x = pp.x + Math.cos(a) * d;
    const z = pp.z + Math.sin(a) * d;
    const h = terrainH(x, z);
    if (Number.isFinite(h) && h > -50) {
      return { x, z, h };
    }
  }

  // Fallback to previous robust world-safe resolver.
  return findSafeSpawnPoint();
}

function getBiomeMinuteBossTypeIndex() {
  const biomeMobs = (GameState.pBiome && Array.isArray(GameState.pBiome.mobs)) ? GameState.pBiome.mobs : [];
  const candidates = [];
  for (let i = 0; i < biomeMobs.length; i++) {
    const name = biomeMobs[i];
    const idx = MTYPES.findIndex(m => m && m.name === name);
    if (idx >= 0) candidates.push(idx);
  }

  if (candidates.length) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // Safety fallback: pick a normal non-boss-like type if biome mapping is missing.
  for (let i = 0; i < MTYPES.length; i++) {
    const t = MTYPES[i];
    if (!t || !t.name) continue;
    const n = String(t.name).toLowerCase();
    if (n.includes('adam') || n.includes('final') || n.includes('boss')) continue;
    return i;
  }

  return 0;
}

// ==================== BOSS SPAWN ====================
function checkBoss() {
  const director = updateRunDirectorState();
  const FINAL_BOSS_TIME = (GameState.biomeFx && GameState.biomeFx.eliteBossTime) ? Math.max(240, Math.floor(GameState.biomeFx.eliteBossTime)) : 300;

  // A 5:00, on vide l'arene sans XP puis on force le boss final.
  if (!GameState.finalBossSpawned && GameState.pT >= FINAL_BOSS_TIME) {
    GameState.finalBossSpawned = true;
    GameState.bossAlive = true;
    monsters.forEach(m => scene.remove(m.root));
    monsters = [];

    const pp = playerPivot.position;
    const a = camYaw;
    const d = 40;
    const bossName = GameState.pBiome ? GameState.pBiome.boss : 'Adam';
    const bossIdx = MTYPES.findIndex(m => m.name === bossName);
    const boss = new Monster(
      pp.x + Math.cos(a) * d,
      pp.z + Math.sin(a) * d,
      bossIdx !== -1 ? bossIdx : (MTYPES.length - 1)
    );
    boss.makeFinalBoss();
    monsters.push(boss);

    document.getElementById('bossbar').style.display = 'block';
    document.getElementById('bossname').textContent = '👑 ' + boss.T.name.toUpperCase() + ' 👑';
    addNotif('⚠ BOSS FINAL: ' + boss.T.name.toUpperCase() + ' !', '#ffaa00');
    return;
  }

  // Boss intermédiaires: un toutes les minutes
  if (GameState.finalBossSpawned || GameState.bossAlive || GameState.pT < nextBossTime) return;

  bossSpawnTimer = director ? director.bossEvery : bossSpawnTimer;
  nextBossTime += bossSpawnTimer;
  GameState.bossAlive = true;

  const spawn = findSafeSpawnNearPlayer(20, 36);
  const minuteBossTypeIdx = getBiomeMinuteBossTypeIndex();
  const boss = new Monster(spawn.x, spawn.z, minuteBossTypeIdx);
  boss.makeBoss({
    hpMult: 5.0,
    dmgMult: 2.2,
    spdMult: 1.18,
    scale: 2.35,
    tint: 0xff6633,
    titlePrefix: 'ALPHA'
  });
  boss.root.position.y = terrainH(boss.root.position.x, boss.root.position.z);
  boss.root.updateMatrixWorld(true);
  monsters.push(boss);

  document.getElementById('bossbar').style.display = 'block';
  document.getElementById('bossname').textContent = '⚔ ' + boss.T.name.toUpperCase();
  addNotif('⚠ BOSS GÉANT: ' + boss.T.name.toUpperCase() + ' !', '#ff3300');
}

// Fonction manquante pour les tremblements d'écran
window.addScreenShake = function(amount) {
  // Implémentation simple ou vide pour éviter le crash
  // camPitch += (Math.random() - 0.5) * amount;
};
