// ═══════════════════════════════════════════════
// DUNGEON WORLD - Main Game Logic
// ═══════════════════════════════════════════════

// ==================== THREE.JS GLOBALS ====================
var camYaw = 0, camPitch = 0;
var scene, camera, renderer, clock;
var playerPivot;
var sunLight, fillLight, skyMat, minimapCtx;
var groundTex;
var vm, vmModel, vmModelLeft, vmRecoil = 0;
var SPD = 7.5;
var playerModel, playerParts, playerTypeData;
var loadoutHaloRoot = null, loadoutHaloWeapons = null, loadoutHaloItems = null;
var loadoutHaloRing = null, loadoutHaloSig = '';

// ==================== CONSTANTS ====================
const CHUNK_SZ = 60;
const DRAW_DIST = 2;
var GRAV = -22; // Changed to var for dynamic gravity

// ==================== CACHE ====================
var chunks = {};
var colliders = []; // Global collision boxes
var monsters = [];
var projectiles = [];
var particles = [];
var dmgNums = [];
var chests = [];
var xpOrbs = [];
var cardDrops = [];

// Sauvegarde de l'état initial des données pour la réinitialisation
const INITIAL_WEAPONS = JSON.parse(JSON.stringify(WEAPONS));
const INITIAL_PASSIVES = JSON.parse(JSON.stringify(PASSIVES));

const keys = {};
const mDown = {};
const keyState = { space: false, q: false, r: false };

let lastCX = null, lastCZ = null;

// Temp vectors
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _vMove = new THREE.Vector3();

// Shared geometries & materials
var GEOS = {
  box: new THREE.BoxGeometry(1, 1, 1),
  sphere: new THREE.SphereGeometry(1, 8, 8),
  quad: new THREE.PlaneGeometry(1, 1),
  cone: new THREE.ConeGeometry(1, 1, 8),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 8),
  oct: new THREE.OctahedronGeometry(1, 0),
  dodec: new THREE.DodecahedronGeometry(1, 0),
  torus: new THREE.TorusGeometry(1, 0.2, 8, 16),
  circle: new THREE.CircleGeometry(1, 16)
};

var MATS = {
  hpBg: new THREE.MeshBasicMaterial({ color: 0x300000, depthTest: false, side: THREE.DoubleSide }),
  hpFill: new THREE.MeshBasicMaterial({ color: 0xdd2020, depthTest: false, side: THREE.DoubleSide }),
  wire: new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
  ice: new THREE.MeshLambertMaterial({ color: 0xaaddff, transparent: true, opacity: 0.8 }),
  gold: new THREE.MeshLambertMaterial({ color: 0xffaa00 }),
  white: new THREE.MeshLambertMaterial({ color: 0xffffff }),
  red: new THREE.MeshLambertMaterial({ color: 0xaa2222 }),
  smoke: new THREE.MeshLambertMaterial({color:0x555555, transparent:true, opacity:0.6}),
  neonGreen: new THREE.MeshBasicMaterial({color: 0x00ff00}),
  neonOrange: new THREE.MeshBasicMaterial({color: 0xffaa00}),
  cyan: new THREE.MeshBasicMaterial({color:0x00ffff})
};

var scenerySpriteMatCache = {};
// World generation and structure logic are owned by `game-world.js`.
// Keep only shared cache object here so existing references stay valid.

// Export game state and functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameState };
}

function _loadoutVisualHash(id) {
  const src = String(id || 'unknown');
  let h = 0;
  for (let i = 0; i < src.length; i++) h = (h * 33 + src.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getLoadoutVisualSignature() {
  const inv = GameState && GameState.inventory ? GameState.inventory : null;
  if (!inv) return '';
  const main = Array.isArray(inv.mainWeapons) ? inv.mainWeapons : [];
  const pass = Array.isArray(inv.passives) ? inv.passives : [];
  const mainSig = main.map((w) => w && w.id ? `${w.id}:${w.level || 1}` : '-').join('|');
  const passSig = pass.map((p) => p && p.id ? `${p.id}:${p.level || 1}` : '-').join('|');
  return `${mainSig}#${passSig}`;
}

function ensureLoadoutHaloRoot() {
  if (!playerPivot) return;
  if (loadoutHaloRoot && loadoutHaloRoot.parent === playerPivot) return;

  loadoutHaloRoot = new THREE.Group();
  loadoutHaloRoot.position.set(0, 2.85, 0);
  loadoutHaloRoot.visible = false;
  loadoutHaloRoot.renderOrder = 120;
  playerPivot.add(loadoutHaloRoot);

  loadoutHaloWeapons = new THREE.Group();
  loadoutHaloItems = new THREE.Group();
  loadoutHaloRoot.add(loadoutHaloWeapons);
  loadoutHaloRoot.add(loadoutHaloItems);

  const ringGeo = new THREE.TorusGeometry(0.95, 0.045, 10, 40);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffc86a, transparent: true, opacity: 0.7, depthWrite: false });
  loadoutHaloRing = new THREE.Mesh(ringGeo, ringMat);
  loadoutHaloRing.rotation.x = Math.PI / 2;
  loadoutHaloRing.position.y = 0;
  loadoutHaloWeapons.add(loadoutHaloRing);
}

function clearGroupChildren(group, keepFirstChild) {
  if (!group) return;
  for (let i = group.children.length - 1; i >= 0; i--) {
    if (keepFirstChild && i === 0) continue;
    const c = group.children[i];
    group.remove(c);
    if (c.geometry && typeof c.geometry.dispose === 'function') c.geometry.dispose();
    if (c.material) {
      if (Array.isArray(c.material)) c.material.forEach((m) => m && m.dispose && m.dispose());
      else if (typeof c.material.dispose === 'function') c.material.dispose();
    }
  }
}

function rebuildLoadoutHaloVisuals() {
  ensureLoadoutHaloRoot();
  if (!loadoutHaloRoot) return;

  const inv = GameState && GameState.inventory ? GameState.inventory : null;
  const weaponEntries = inv && Array.isArray(inv.mainWeapons)
    ? inv.mainWeapons.filter((w) => w && w.id)
    : [];
  const passiveEntries = inv && Array.isArray(inv.passives)
    ? inv.passives.filter((p) => p && p.id)
    : [];

  clearGroupChildren(loadoutHaloWeapons, true);
  clearGroupChildren(loadoutHaloItems, false);

  if (!weaponEntries.length && !passiveEntries.length) {
    loadoutHaloRoot.visible = false;
    return;
  }

  loadoutHaloRoot.visible = true;

  const wepRadius = 0.95;
  for (let i = 0; i < weaponEntries.length; i++) {
    const we = weaponEntries[i];
    const a = (i / Math.max(1, weaponEntries.length)) * Math.PI * 2;
    const h = _loadoutVisualHash(we.id);
    const col = new THREE.Color().setHSL((h % 360) / 360, 0.75, 0.58);

    const shapeType = h % 3;
    const geo = shapeType === 0
      ? new THREE.BoxGeometry(0.15, 0.15, 0.15)
      : (shapeType === 1 ? new THREE.OctahedronGeometry(0.1, 0) : new THREE.ConeGeometry(0.11, 0.22, 8));
    const mat = new THREE.MeshBasicMaterial({ color: col.getHex(), transparent: true, opacity: 0.95, depthWrite: false });
    const marker = new THREE.Mesh(geo, mat);
    marker.position.set(Math.cos(a) * wepRadius, 0, Math.sin(a) * wepRadius);
    marker.userData.weaponId = we.id;
    marker.userData.spin = 1.6 + (h % 7) * 0.18;
    marker.userData.bob = 0.02 + (h % 3) * 0.008;
    loadoutHaloWeapons.add(marker);
  }

  const itemRadius = 0.55;
  for (let j = 0; j < passiveEntries.length; j++) {
    const pe = passiveEntries[j];
    const a = (j / Math.max(1, passiveEntries.length)) * Math.PI * 2;
    const def = (typeof getPassiveItemDef === 'function') ? getPassiveItemDef(pe.id) : null;
    const h = _loadoutVisualHash(pe.id);
    const col = def && def.statKey
      ? new THREE.Color().setHSL((_loadoutVisualHash(def.statKey) % 360) / 360, 0.7, 0.6)
      : new THREE.Color().setHSL((h % 360) / 360, 0.6, 0.62);

    const geo = new THREE.SphereGeometry(0.08, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: col.getHex(), transparent: true, opacity: 0.85, depthWrite: false });
    const marker = new THREE.Mesh(geo, mat);
    marker.position.set(Math.cos(a) * itemRadius, 0.55, Math.sin(a) * itemRadius);
    marker.userData.spin = -1.2 - (h % 5) * 0.16;
    marker.userData.bob = 0.018 + (h % 4) * 0.006;
    loadoutHaloItems.add(marker);
  }
}

window.getWeaponHaloWorldPos = function(weaponId) {
  if (!loadoutHaloWeapons || !weaponId) return null;
  const key = String(weaponId).toUpperCase();
  for (let i = 0; i < loadoutHaloWeapons.children.length; i++) {
    const child = loadoutHaloWeapons.children[i];
    if (!child || child === loadoutHaloRing || !child.userData) continue;
    if (String(child.userData.weaponId || '').toUpperCase() !== key) continue;
    const out = new THREE.Vector3();
    child.getWorldPosition(out);
    return out;
  }
  return null;
};

function updateLoadoutHaloVisuals(dt) {
  if (!GameState || !GameState.gameRunning) {
    if (loadoutHaloRoot) loadoutHaloRoot.visible = false;
    return;
  }

  ensureLoadoutHaloRoot();
  if (!loadoutHaloRoot) return;

  const sig = getLoadoutVisualSignature();
  if (sig !== loadoutHaloSig) {
    loadoutHaloSig = sig;
    rebuildLoadoutHaloVisuals();
  }

  if (!loadoutHaloRoot.visible) return;

  const t = GameState.pT || 0;
  if (loadoutHaloWeapons) {
    loadoutHaloWeapons.rotation.y += dt * 0.9;
    for (let i = 0; i < loadoutHaloWeapons.children.length; i++) {
      const c = loadoutHaloWeapons.children[i];
      if (!c || c === loadoutHaloRing) continue;
      c.rotation.y += dt * (c.userData.spin || 1.0);
      c.position.y = Math.sin(t * 2.2 + i) * (c.userData.bob || 0.02);
    }
  }
  if (loadoutHaloItems) {
    loadoutHaloItems.rotation.y -= dt * 0.65;
    for (let i = 0; i < loadoutHaloItems.children.length; i++) {
      const c = loadoutHaloItems.children[i];
      if (!c) continue;
      c.rotation.x += dt * 0.9;
      c.rotation.z += dt * (c.userData.spin || -1.0);
      c.position.y = 0.55 + Math.sin(t * 2.6 + i * 0.7) * (c.userData.bob || 0.02);
    }
  }
}
// ==================== MODULE OWNERSHIP ====================
// Legacy monolith blocks removed: spawning, environment, and progression logic
// are now owned by `game-spawning.js`, `game-environment.js`, and
// `game-progression.js`.

// ==================== CONTINUE TO NEXT LOOP (NG+) ====================
window.continueToNextLoop = function() {
  // Increment loop level
  GameState.loopLevel++;
  GameState.totalLoops++;

  // Advance to the next biome/stage.
  const curIdx = Math.max(0, BIOMES.findIndex((b) => b.id === (GameState.pBiome && GameState.pBiome.id)));
  const nextIdx = (curIdx + 1) % BIOMES.length;
  GameState.selMapIdx = nextIdx;
  GameState.pBiome = BIOMES[nextIdx];
  if (typeof setTerrainBiome === 'function') setTerrainBiome(GameState.pBiome.id);
  GameState.biomeFx = getBiomeProfile(GameState.pBiome);
  if (typeof setTerrainBiomeProfile === 'function') setTerrainBiomeProfile(GameState.biomeFx);
  GRAV = GameState.biomeFx ? GameState.biomeFx.gravity : -22;
  refreshBiomeVisuals();
  
  // Save upgrades and key stats to restore after reset
  const savedUpgrades = JSON.parse(JSON.stringify(GameState.playerUpgrades));
  const savedWeaponPaths = JSON.parse(JSON.stringify(GameState.weaponPaths));
  const savedWeapons = {};
  const savedPassives = {};
  
  // Save weapon states
  for (const k in WEAPONS) {
    savedWeapons[k] = {
      level: WEAPONS[k].level,
      active: WEAPONS[k].active
    };
  }
  
  // Save passive states
  for (const k in PASSIVES) {
    savedPassives[k] = {
      level: PASSIVES[k].level,
      active: PASSIVES[k].active
    };
  }
  
  const savedMaxHP = GameState.pMaxHP;
  const savedLevel = GameState.pLevel;
  const savedXP = GameState.pXP;
  
  // Clear the arena
  monsters.forEach(m => scene.remove(m.root));
  projectiles.forEach(p => scene.remove(p.m));
  particles.forEach(p => scene.remove(p.m));
  dmgNums.forEach(d => scene.remove(d.sp));
  chests.forEach(c => scene.remove(c.m || c.root));
  xpOrbs.forEach(o => scene.remove(o.m));
  cardDrops.forEach(cd => scene.remove(cd.root));
  
  // Reset lists
  monsters = [];
  projectiles = [];
  particles = [];
  dmgNums = [];
  chests = [];
  xpOrbs = [];
  cardDrops = [];
  
  // Reset boss state
  GameState.finalBossSpawned = false;
  GameState.bossAlive = false;
  GameState.nextBossKills = 15;
  if (typeof resetSpawnTimers === 'function') resetSpawnTimers();
  
  // Reset game time for this loop
  GameState.pT = 0;
  GameState.pScore = 0;
  GameState.pKills = 0;
  GameState.runTelemetry = {
    damageTaken: 0,
    damageDealt: 0,
    elitesKilled: 0,
    bossesKilled: 0,
    avgFps: 60,
    peakMonsters: 0
  };
  GameState._perfWindow = { acc: 0, frames: 0, fps: 60 };
  GameState.perfSpawnScale = 1.0;
  
  // Restore player stats with bonuses
  GameState.pMaxHP = savedMaxHP;
  GameState.pHP = GameState.pMaxHP;
  GameState.pLevel = savedLevel;
  GameState.pXP = savedXP;
  
  // Restore upgrades
  GameState.playerUpgrades = savedUpgrades;
  GameState.weaponPaths = savedWeaponPaths;
  
  // Restore weapons
  for (const k in savedWeapons) {
    if (WEAPONS[k]) {
      WEAPONS[k].level = savedWeapons[k].level;
      WEAPONS[k].active = savedWeapons[k].active;
    }
  }
  
  // Restore passives
  for (const k in savedPassives) {
    if (PASSIVES[k]) {
      PASSIVES[k].level = savedPassives[k].level;
      PASSIVES[k].active = savedPassives[k].active;
    }
  }
  
  // Reset terrain
  for (const k in chunks) {
    if (chunks[k].m) scene.remove(chunks[k].m);
    if (chunks[k].grp) scene.remove(chunks[k].grp);
  }
  chunks = {};
  colliders = [];
  lastCX = null; lastCZ = null;
  
  // Reset player position on guaranteed valid ground.
  const safeLoopSpawn = findSafeSpawnPoint();
  playerPivot.position.set(safeLoopSpawn.x, safeLoopSpawn.h + 1.7, safeLoopSpawn.z);
  playerPivot.rotation.set(0, 0, 0);
  camYaw = 0; camPitch = 0;
  
  // Reset game state
  GameState.gameRunning = true;
  GameState.paused = false;
  GameState.levelingUp = false;
  GameState.pendingBossChestUpgrades = 0;
  GameState.invTimer = 0;
  GameState.dashCd = 0;
  GameState.dashTime = 0;
  GameState.pVelY = 0;
  GameState.pVelX = 0;
  GameState.pVelZ = 0;
  GameState.pSpecialCd = 0;
  
  // Update spawn timers (slightly faster for difficulty)
  spawnTimer = Math.max(0.25, 0.9 / (GameState.biomeFx ? GameState.biomeFx.spawnRateMult : 1) * (1 - GameState.loopLevel * 0.04));
  chestTimer = Math.max(6, 15 / (GameState.biomeFx ? GameState.biomeFx.chestRateMult : 1));
  biomeHazardTimer = 3.0;
  GameState.biomeSlowTimer = 0;
  
  // Show UI and lock pointer
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('hud').style.display = 'flex';
  renderer.domElement.requestPointerLock();
  
  // Update HUD
  updateUpgradesHUD();
  updateWeaponVisuals();
  loadoutHaloSig = '';
  rebuildLoadoutHaloVisuals();
  
  // Notification
  const diffBonus = Math.floor(GameState.loopLevel * 50);
  addNotif(`🔄 LOOP ${GameState.loopLevel} | ${GameState.pBiome.name} | +${diffBonus}% DIFFICULTÉ`, '#ffaa00');
  
  saveGame();
}

// Stable class/save helpers are provided by `game-progression.js`.

// ==================== START GAME ====================
window.startGame = function() {
 try {
  if (window.event) window.event.stopPropagation(); // Empêche le clic de traverser
  if (!renderer) init(); // Safety check
  initStructureMaterials(); // Pre-cache materials before creating structures
  initProjPool(); // Pre-allocate projectile mesh pool
  buildStableClassMaps();
  migrateClassSaveData();

  const selectedStableClass = getClassByStableId(GameState.saveData.selectedClassStableId);
  if (selectedStableClass) {
    const selectedIdx = CLASSES.findIndex((c) => c.id === selectedStableClass.id);
    if (selectedIdx >= 0) GameState.selCharIdx = selectedIdx;
  }
  GameState.pClass = CLASSES[GameState.selCharIdx] || CLASSES[0];
  if (GameState.pClass && classStableIdMap[GameState.pClass.id]) {
    GameState.saveData.selectedClassStableId = classStableIdMap[GameState.pClass.id];
  }
  
  GameState.thirdPerson = false; // Default to 1st person

  // Read Modifiers
  GameState.modX2 = document.getElementById('mod_x2') ? document.getElementById('mod_x2').checked : false;
  GameState.modHC = document.getElementById('mod_hc') ? document.getElementById('mod_hc').checked : false;
  GameState.modChaos = document.getElementById('mod_chaos') ? document.getElementById('mod_chaos').checked : false;

  GameState.pBiome = BIOMES[GameState.selMapIdx];
  GameState.pMaxHP = GameState.pHP = GameState.pClass.hp;
  
  if (GameState.modHC) {
      GameState.pMaxHP = 1;
      GameState.pHP = 1;
  }

  setTerrainBiome(GameState.pBiome.id);
  GameState.biomeFx = getBiomeProfile(GameState.pBiome);
  if (typeof setTerrainBiomeProfile === 'function') setTerrainBiomeProfile(GameState.biomeFx);
  
  // Apply Perm Upgrades
  GameState.pDmgMult = 1.0;
  GameState.pGoldMult = 1.0;
  GameState.pSpdMult = 1.0;
  GameState.pLevelUpRerolls = 0;
  GameState.pLevelUpExtraCards = 0;
  GameState.pLevelUpBans = 0;
  
  if (GameState.saveData.permUpgrades) {
      PERM_UPGRADES.forEach(u => {
          if (GameState.saveData.permUpgrades[u.id]) {
              const lvl = GameState.saveData.permUpgrades[u.id];
              if (lvl > 0) {
                  if (u.stat === 'pMaxHP') { GameState.pMaxHP += u.val * lvl; GameState.pHP += u.val * lvl; }
                  else if (u.stat === 'dmgMult') GameState.pDmgMult += u.val * lvl;
                  else if (u.stat === 'goldMult') GameState.pGoldMult += u.val * lvl;
                  else if (u.stat === 'pRegen') GameState.pRegen += u.val * lvl;
                  else if (u.stat === 'pDmgRed') GameState.pDmgRed += u.val * lvl;
                  else if (u.stat === 'pLuck') GameState.pLuck += u.val * lvl;
                  else if (u.stat === 'spdMult') GameState.pSpdMult += u.val * lvl;
                    else if (u.stat === 'lvlRerolls') GameState.pLevelUpRerolls += Math.floor(u.val * lvl);
                    else if (u.stat === 'lvlCards') GameState.pLevelUpExtraCards += Math.floor(u.val * lvl);
                    else if (u.stat === 'lvlBans') GameState.pLevelUpBans += Math.floor(u.val * lvl);
              }
          }
      });
  }

            // Reset run-scoped level-up utilities from permanent upgrades.
            GameState.levelUpRerollsLeft = Math.max(0, Math.floor(GameState.pLevelUpRerolls || 0));
            GameState.levelUpBansLeft = Math.max(0, Math.floor(GameState.pLevelUpBans || 0));
            GameState.levelUpBanMode = false;
            GameState.levelUpBannedChoices = {};

  if (!Array.isArray(GameState.saveData.unlockedCostumes)) GameState.saveData.unlockedCostumes = ['A'];
  if (!GameState.saveData.unlockedCostumes.includes('A')) GameState.saveData.unlockedCostumes.push('A');
  if (!GameState.saveData.selectedCostume) GameState.saveData.selectedCostume = 'A';
  if (GameState.saveData.selectedCostume === 'B' && !GameState.saveData.unlockedCostumes.includes('B')) {
    GameState.saveData.selectedCostume = 'A';
  }
  
    // Gravity & biome profile
    GRAV = GameState.biomeFx ? GameState.biomeFx.gravity : -22;
    if (GRAV > -12) addNotif('Gravite faible dans ce biome', '#aaaaff');
    else if (GRAV < -24) addNotif('Gravite lourde dans ce biome', '#ffcc88');

  GameState.galleryMode = false;
  GameState.levelingUp = false;
  GameState.pendingBossChestUpgrades = 0;
  GameState.gameRunning = true;
  GameState.paused = false;
  GameState.mainWeaponsEnabled = true;
  GameState.autoAttackEnabled = true;
  GameState.playerUpgrades = {};
  GameState.weaponPaths = {};
  
  // Reset terrain to ensure it generates in the current scene
  for (const k in chunks) {
    if (chunks[k].m) scene.remove(chunks[k].m);
    if (chunks[k].grp) scene.remove(chunks[k].grp);
  }
  chunks = {};
  colliders = [];
  lastCX = null; lastCZ = null;

  // Clear existing entities from scene
  monsters.forEach(m => scene.remove(m.root));
  projectiles.forEach(p => scene.remove(p.m));
  particles.forEach(p => scene.remove(p.m));
  dmgNums.forEach(d => scene.remove(d.sp));
  chests.forEach(c => scene.remove(c.m || c.root));
  xpOrbs.forEach(o => scene.remove(o.m));
  cardDrops.forEach(cd => scene.remove(cd.root));

  // Reset lists
  monsters = [];
  projectiles = [];
  particles = [];
  dmgNums = [];
  chests = [];
  xpOrbs = [];
  cardDrops = [];
  // Note: colliders et chunks sont gérés par updateTerrain
  spawnTimer = Math.max(0.35, 1.2 / (GameState.biomeFx ? GameState.biomeFx.spawnRateMult : 1));
  chestTimer = Math.max(6, 15 / (GameState.biomeFx ? GameState.biomeFx.chestRateMult : 1));
  biomeHazardTimer = 3.0;
  GameState.biomeSlowTimer = 0;

  updateUpgradesHUD();
  GameState.pBleedChance = 0;
  GameState.pKnockback = 0;
  GameState.pGambler = false;
  GameState.pWindwalker = false;
  GameState.pTank = false;
  GameState.pAssassin = false;
  GameState.nextBossKills = 15;
  if (typeof resetSpawnTimers === 'function') resetSpawnTimers();
  GameState.pVelY = 0; // Reset vertical velocity
  SPD = GameState.pClass.spd * GameState.pSpdMult * (GameState.biomeFx ? GameState.biomeFx.playerSpeedMult : 1);
  GameState._baseRunStats = {
    pMaxHP: GameState.pMaxHP,
    pPickupRange: GameState.pPickupRange,
    pLuck: GameState.pLuck,
    pXpMult: GameState.pXpMult,
    pDmgRed: GameState.pDmgRed,
    SPD: SPD
  };
  GameState.pT = 0;
  GameState.pScore = 0;
  GameState.pKills = 0;
  GameState.runTelemetry = {
    damageTaken: 0,
    damageDealt: 0,
    elitesKilled: 0,
    bossesKilled: 0,
    avgFps: 60,
    peakMonsters: 0
  };
  GameState._perfWindow = { acc: 0, frames: 0, fps: 60 };
  GameState.perfSpawnScale = 1.0;
  GameState.pXP = 0;
  GameState.pLevel = 1;
  GameState.pSpecialCd = 0; // Cooldown capacité spéciale
  GameState.pVelX = 0; // Vitesse X (Physique)
  GameState.pVelZ = 0; // Vitesse Z (Physique)

    // Reset Player Position (Spawn) on guaranteed valid floor for every biome.
    const safeStartSpawn = findSafeSpawnPoint();
    playerPivot.position.set(safeStartSpawn.x, safeStartSpawn.h + 1.7, safeStartSpawn.z);
  playerPivot.rotation.set(0, 0, 0);
  camYaw = 0; camPitch = 0; // Reset camera angles

    // Force terrain chunks around the spawn immediately to avoid empty-sky starts.
    updateTerrain(playerPivot.position.x, playerPivot.position.z);
    lastCX = Math.round(playerPivot.position.x / CHUNK_SZ);
    lastCZ = Math.round(playerPivot.position.z / CHUNK_SZ);

  // Nettoyage des visuels des passifs de la partie précédente
  if (PASSIVES.orb.meshes) PASSIVES.orb.meshes.forEach(m => scene.remove(m));
  if (PASSIVES.shield.meshes) PASSIVES.shield.meshes.forEach(m => scene.remove(m));
  if (PASSIVES.turret.meshes) PASSIVES.turret.meshes.forEach(t => scene.remove(t.m));
  if (PASSIVES.poison.pools) PASSIVES.poison.pools.forEach(p => { scene.remove(p.m); if(p.m.geometry) p.m.geometry.dispose(); if(p.m.material) p.m.material.dispose(); });
  if (PASSIVES.aura.mesh) scene.remove(PASSIVES.aura.mesh);

  // Réinitialisation complète des Armes depuis la sauvegarde
  for (const k in WEAPONS) {
    if (INITIAL_WEAPONS[k]) {
        Object.assign(WEAPONS[k], JSON.parse(JSON.stringify(INITIAL_WEAPONS[k])));
    }
    WEAPONS[k].active = false;
  }
  // Réinitialisation complète des Passifs depuis la sauvegarde
  for (const k in PASSIVES) {
    if (INITIAL_PASSIVES[k]) {
        Object.assign(PASSIVES[k], JSON.parse(JSON.stringify(INITIAL_PASSIVES[k])));
    }
  }

  // Reset Class Flags
  GameState.pSniper = false;
  GameState.pBrawler = false;

  // Class Bonuses
  switch (GameState.pClass.id) {
    case 'mage': GameState.pXpMult += 0.2; break;
    case 'knight': GameState.pDmgRed += 0.1; break;
    case 'ninja': GameState.pDodge += 0.15; GameState.pDashCdMult *= 0.8; break;
    case 'paladin': GameState.pDmgRed += 0.2; GameState.pThorns += 10; break;
    case 'necro': GameState.pVamp += 0.05; break;
    case 'barbarian': GameState.pLowHpDmg += 0.5; GameState.pBrawler = true; break;
    case 'ranger': GameState.pCritDmg += 0.5; break;
    case 'rogue': GameState.pExec += 0.12; break;
    case 'lancer': GameState.pArea *= 1.25; break;
    case 'pirate': GameState.pLuck *= 1.4; break;
    case 'voidmage': GameState.pArea *= 1.2; break;
    case 'druid': GameState.pRegen += 1.0; break;
    case 'samurai': GameState.pLuck *= 2.0; break;
    case 'gladiator': GameState.pMaxJumps += 1; break;
    case 'hunter': GameState.pPickupRange *= 1.6; GameState.pLuck *= 1.2; break;
    case 'crusader': GameState.pArea *= 1.3; GameState.pMaxHP += 40; break;
    case 'engineer': PASSIVES.turret.active = true; PASSIVES.turret.count = 1; break;
    case 'monk': GameState.pKnockback += 2.0; GameState.pDodge += 0.1; break;
    case 'alchemist': PASSIVES.poison.active = true; PASSIVES.poison.level = 1; break;
    case 'pyro': WEAPONS.SCEPTER.fire = true; break;
    case 'gambler': GameState.pGambler = true; break;
    case 'warlock': PASSIVES.orb.active = true; PASSIVES.orb.level = 1; PASSIVES.orb.count = 1; break;
    case 'valkyrie': GameState.pDashCdMult *= 0.7; break;
    case 'arbalist': GameState.pCritDmg += 0.5; break;
    case 'runemaster': GameState.pArea *= 1.2; break;
    case 'duelist': GameState.pDodge += 0.2; break;
    case 'gunner': GameState.pArea *= 1.3; break;
    case 'shaman': PASSIVES.aura.active = true; PASSIVES.aura.level = 1; break;
    case 'werewolf': GameState.pBleedChance += 0.3; GameState.pRegen += 1; break;
    case 'templar': GameState.pDmgRed += 0.15; break;
    case 'illusionist': GameState.pDodge += 0.25; break;
    case 'cowboy': GameState.pLuck *= 1.5; break;
    case 'witchdoc': PASSIVES.poison.active = true; break;
    case 'stormcaller': WEAPONS.SCEPTER.lightning = true; break;
    case 'frostarcher': WEAPONS.SCEPTER.ice = true; break;
    case 'cultist': GameState.pVamp += 0.15; GameState.pMaxHP *= 0.6; GameState.pHP = GameState.pMaxHP; break;
    case 'mechanic': PASSIVES.turret.active = true; break;
    case 'astronomer': PASSIVES.orb.active = true; break;
    case 'chef': GameState.pRegen += 2; break;
    case 'juggler': GameState.pLuck *= 1.8; break;
    case 'executioner': GameState.pExec += 0.2; break;
    case 'geomancer': GameState.pDmgRed += 0.1; break;
    case 'apothecary': PASSIVES.poison.active = true; break;
    case 'kyudo': GameState.pCritDmg += 1.0; GameState.pSniper = true; break;
    case 'sniper': GameState.pSniper = true; GameState.pCritDmg += 0.5; break;
    case 'darkknight': GameState.pLowHpDmg += 0.5; break;
    case 'sunpriest': GameState.pArea *= 1.2; break;
    case 'chronomancer': GameState.pDashCdMult *= 0.5; WEAPONS.SCEPTER.ice = true; break;
    case 'tamer': PASSIVES.dagger.active = true; PASSIVES.dagger.level = 1; break; // "Pet" attack
    case 'bard': GameState.pXpMult += 0.3; break;
    
    // Boss Classes Bonuses
    case 'boss_reaper': GameState.pExec += 0.3; break;
    case 'boss_vampire': GameState.pVamp += 0.2; break;
    case 'boss_yeti': GameState.pDmgRed += 0.3; WEAPONS.SCEPTER.ice = true; break;
    case 'boss_outlaw': GameState.pSniper = true; GameState.pCritDmg += 1.0; break;
    case 'boss_spider': PASSIVES.poison.active = true; break;
    case 'boss_lich': PASSIVES.skulls.active = true; PASSIVES.skulls.count = 2; break;
  }

  // Initialize VS-like loadout schema while keeping current runtime combat behavior.
  if (typeof initializeRunInventoryFromClass === 'function') {
    initializeRunInventoryFromClass(GameState.pClass.wep);
  }
  if (typeof syncLegacyWeaponActivationFromInventory === 'function') {
    syncLegacyWeaponActivationFromInventory();
  } else {
    // Legacy fallback if loadout module is unavailable.
    for (const k in WEAPONS) WEAPONS[k].active = false;
    WEAPONS.SCEPTER.active = true;
  }

  GameState.runUsedWeapons = {};
  if (GameState.inventory && Array.isArray(GameState.inventory.mainWeapons)) {
    GameState.inventory.mainWeapons.forEach((slot) => {
      if (slot && slot.id) GameState.runUsedWeapons[String(slot.id).toUpperCase()] = true;
    });
  }

  // Generate ground texture
  const s = 512, c = document.createElement('canvas');
  c.width = s; c.height = s;
  const ctx = c.getContext('2d');
  const col = new THREE.Color(GameState.pBiome.col);
  ctx.fillStyle = '#' + col.getHexString();
  ctx.fillRect(0, 0, s, s);
  
  // Biome specific ground patterns
  if (GameState.pBiome.id === 'cyber' || GameState.pBiome.id === 'steampunk' || GameState.pBiome.id === 'clockwork' || GameState.pBiome.id === 'lab') {
      // Grid
      ctx.strokeStyle = GameState.pBiome.id === 'steampunk' ? 'rgba(200,150,50,0.3)' : 'rgba(0,255,0,0.2)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      for(let i=0; i<=s; i+=64) { ctx.moveTo(i,0); ctx.lineTo(i,s); ctx.moveTo(0,i); ctx.lineTo(s,i); }
      ctx.stroke();
  } else if (GameState.pBiome.id === 'dungeon' || GameState.pBiome.id === 'ruins' || GameState.pBiome.id === 'crypt' || GameState.pBiome.id === 'prison') {
      // Bricks / Cobblestone
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      for(let y=0; y<s; y+=32) {
          for(let x=0; x<s; x+=64) {
              ctx.fillRect(x + (y%64===0?0:32) + 2, y + 2, 60, 28);
          }
      }
  } else {
      // Natural Noise
      const id = ctx.getImageData(0, 0, s, s), d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() - 0.5) * 30;
        d[i] = Math.min(255, Math.max(0, d[i] + n));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n));
      }
      ctx.putImageData(id, 0, 0);
      for (let i = 0; i < 50; i++) { ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.beginPath(); ctx.arc(Math.random() * s, Math.random() * s, 10 + Math.random() * 40, 0, Math.PI * 2); ctx.fill(); }
  }
  
  groundTex = new THREE.CanvasTexture(c);
  groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(16, 16); // Augmenté pour éviter l'étirement moche

  // Create Player Model (for 3rd person)
  if (playerModel) playerPivot.remove(playerModel);
  let pm = null;
  try {
    pm = (typeof buildPlayerModel === 'function') ? buildPlayerModel(GameState.pClass) : null;
  } catch (err) {
    console.error('buildPlayerModel failed:', err);
  }
  if (!pm || !pm.root) {
    const fallback = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1.6, 0.5),
      new THREE.MeshLambertMaterial({ color: 0x88aacc })
    );
    body.position.y = 0.8;
    fallback.add(body);
    pm = { root: fallback, parts: {}, typeData: { S: 1.0, shape: 'human' } };
    addNotif('Modele joueur fallback active (erreur de rendu).', '#ffb070');
  }
  playerModel = pm.root;
  playerParts = pm.parts || {};
  playerTypeData = pm.typeData || { S: 1.0, shape: 'human' };
  playerPivot.add(playerModel);
  playerModel.position.y = -1.6; // Ancrer le modèle au sol
  playerModel.visible = false; // Start hidden (1st person)

  GameState.hideWeaponModels = true;
  if (typeof createVM === 'function') {
    createVM(GameState.pClass.wep);
    if (vm) vm.visible = false;
  }

  scene.fog.color.setHex(GameState.pBiome.fog);
  renderer.setClearColor(GameState.pBiome.fog);

  document.getElementById('overlay').style.display = 'none';
  document.getElementById('hud').style.display = 'block';
  clock.start();
  renderer.domElement.requestPointerLock();
  for (let i = 0; i < 16; i++) { const a = Math.random() * Math.PI * 2, d = 16 + Math.random() * 12; monsters.push(new Monster(Math.cos(a) * d, Math.sin(a) * d)); }
  addNotif(`⚔ ${GameState.pClass.wep.toUpperCase()} équipé`, '#f0c030');
  loadoutHaloSig = '';
  rebuildLoadoutHaloVisuals();
  
  // Force terrain update
  if (playerPivot && playerPivot.position) {
      updateTerrain(playerPivot.position.x, playerPivot.position.z);
  }
  
  addNotif("Bonne chance !", "#ffffff");
  newQuest();
 } catch(e) {
   console.error(e);
   GameState.gameRunning = false;
   GameState.paused = false;
   document.getElementById('overlay').style.display = 'flex';
   document.getElementById('hud').style.display = 'none';
   addNotif("ERREUR: " + e.message, "#ff0000");
 }
}

// ==================== MOVEMENT SKILL ====================
function _movementHash(id) {
  const src = String(id || 'unknown');
  let h = 0;
  for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getMovementSkillForClass(cls) {
  const id = (cls && cls.id) ? cls.id : 'mage';
  const hash = _movementHash(id);

  const direct = {
    mage: { id: 'blink', name: 'Blink Arcane', cd: 4.0, iFrames: 0.18, use: function () {
      const d = fwd().setY(0).normalize();
      const dist = 8;
      const t = playerPivot.position.clone().addScaledVector(d, dist);
      t.y = terrainH(t.x, t.z) + 1.7;
      playerPivot.position.copy(t);
      spawnPart(t, 0x77ccff, 20, 6);
    } },
    knight: { id: 'guard_step', name: 'Pas Garde', cd: 3.8, iFrames: 0.28, use: function () {
      const d = fwd().setY(0).normalize();
      playerPivot.position.addScaledVector(d, 4.5);
      GameState.pDmgRed += 0.2;
      setTimeout(() => { GameState.pDmgRed = Math.max(0, GameState.pDmgRed - 0.2); }, 900);
      spawnPart(playerPivot.position, 0xffffff, 16, 5);
    } },
    rogue: { id: 'smoke_dash', name: 'Dash Fumigene', cd: 2.8, iFrames: 0.35, use: function () {
      const d = fwd().setY(0).normalize();
      playerPivot.position.addScaledVector(d, 6.0);
      spawnPart(playerPivot.position, 0x777777, 24, 7);
      GameState.pDodge += 0.2;
      setTimeout(() => { GameState.pDodge = Math.max(0, GameState.pDodge - 0.2); }, 1100);
    } },
    ranger: { id: 'grapple', name: 'Grapin', cd: 3.2, iFrames: 0.16, use: function () {
      const d = fwd().setY(0).normalize();
      playerPivot.position.addScaledVector(d, 9.0);
      GameState.pVelY = Math.max(GameState.pVelY, 2.0);
      spawnPart(playerPivot.position, 0x88ffaa, 18, 6);
    } },
    chronomancer: { id: 'time_skip', name: 'Saut Temporel', cd: 5.2, iFrames: 0.25, use: function () {
      const d = fwd().setY(0).normalize();
      playerPivot.position.addScaledVector(d, 7.5);
      GameState.frenzyTimer = Math.max(GameState.frenzyTimer, 1.6);
      spawnPart(playerPivot.position, 0xaad8ff, 20, 6);
    } }
  };
  if (direct[id]) return direct[id];

  const kind = hash % 4;
  const cd = 3.0 + (hash % 9) * 0.25;
  const iFrames = 0.15 + (hash % 4) * 0.06;
  if (kind === 0) {
    return { id: 'dash', name: 'Ruée', cd: cd, iFrames: iFrames, use: function () {
      const d = fwd().setY(0).normalize();
      playerPivot.position.addScaledVector(d, 5.5 + (hash % 3));
      spawnPart(playerPivot.position, 0xaaddff, 14, 6);
    } };
  }
  if (kind === 1) {
    return { id: 'hop', name: 'Bond', cd: cd, iFrames: iFrames, use: function () {
      const d = fwd().setY(0).normalize();
      playerPivot.position.addScaledVector(d, 3.5 + (hash % 2));
      GameState.pVelY = Math.max(GameState.pVelY, 6.5);
      spawnPart(playerPivot.position, 0xffdd88, 14, 6);
    } };
  }
  if (kind === 2) {
    return { id: 'phase', name: 'Phase', cd: cd, iFrames: iFrames + 0.12, use: function () {
      const d = fwd().setY(0).normalize();
      playerPivot.position.addScaledVector(d, 4.6 + (hash % 4) * 0.6);
      spawnPart(playerPivot.position, 0xaa88ff, 18, 6);
    } };
  }
  return { id: 'side_step', name: 'Pas Latéral', cd: cd, iFrames: iFrames, use: function () {
    const side = new THREE.Vector3(-Math.cos(camYaw), 0, Math.sin(camYaw));
    const sign = (hash % 2) ? 1 : -1;
    playerPivot.position.addScaledVector(side, sign * 5.0);
    spawnPart(playerPivot.position, 0x88ffcc, 15, 6);
  } };
}

window.getMovementSkillPreviewForClass = function (classData) {
  const sk = getMovementSkillForClass(classData);
  return { name: sk.name, cd: sk.cd };
};

function attemptDash() {
  if (!GameState.gameRunning || GameState.levelingUp) return;
  const skill = getMovementSkillForClass(GameState.pClass);
  GameState.pMoveSkillCdBase = Math.max(0.6, Number(skill.cd || 3.0));
  const maxCd = GameState.pMoveSkillCdBase * GameState.pDashCdMult;
  if (GameState.dashCd > 0) return;

  GameState.dashCd = maxCd;
  GameState.dashTime = 0;
  GameState.invTimer = Math.max(GameState.invTimer, skill.iFrames || 0.2);
  try {
    skill.use();
    addNotif('🌀 Mouvement: ' + skill.name, '#aaddff');
  } catch (e) {
    console.warn('Movement skill failed:', e);
  }
}

function applyMonsterSeparation(dt) {
  if (!Array.isArray(monsters) || monsters.length < 2) return;
  const resolveStrength = Math.max(0.2, Math.min(1.2, dt * 18));
  const moved = [];

  function markMoved(mon) {
    if (!mon || !mon.root) return;
    if (moved.indexOf(mon) < 0) moved.push(mon);
  }

  for (let i = 0; i < monsters.length - 1; i++) {
    const a = monsters[i];
    if (!a || a.dead || !a.root) continue;
    const ar = Math.max(0.35, Number(a.collisionRadius) || (a.T && a.T.S ? a.T.S * 0.55 : 0.55));
    for (let j = i + 1; j < monsters.length; j++) {
      const b = monsters[j];
      if (!b || b.dead || !b.root) continue;
      const br = Math.max(0.35, Number(b.collisionRadius) || (b.T && b.T.S ? b.T.S * 0.55 : 0.55));
      const aBoss = !!(a.boss || a.finalBoss);
      const bBoss = !!(b.boss || b.finalBoss);

      // Never move bosses via crowd separation; they stay combat anchors.
      if (aBoss && bBoss) continue;

      const dx = b.root.position.x - a.root.position.x;
      const dz = b.root.position.z - a.root.position.z;
      const distSq = dx * dx + dz * dz;
      const minDist = ar + br;
      if (distSq <= 0.00001) {
        const nudge = 0.03 * resolveStrength;
        if (aBoss) {
          b.root.position.x += nudge * 2;
          markMoved(b);
        } else if (bBoss) {
          a.root.position.x -= nudge * 2;
          markMoved(a);
        } else {
          a.root.position.x -= nudge;
          b.root.position.x += nudge;
          markMoved(a);
          markMoved(b);
        }
        continue;
      }
      if (distSq >= minDist * minDist) continue;
      const dist = Math.sqrt(distSq);
      const overlap = (minDist - dist) * resolveStrength;
      if (overlap <= 0) continue;
      const nx = dx / dist;
      const nz = dz / dist;
      const push = overlap * 0.5;
      if (aBoss) {
        b.root.position.x += nx * overlap;
        b.root.position.z += nz * overlap;
        markMoved(b);
      } else if (bBoss) {
        a.root.position.x -= nx * overlap;
        a.root.position.z -= nz * overlap;
        markMoved(a);
      } else {
        a.root.position.x -= nx * push;
        a.root.position.z -= nz * push;
        b.root.position.x += nx * push;
        b.root.position.z += nz * push;
        markMoved(a);
        markMoved(b);
      }
    }
  }

  // Separation happens after monster update; refresh transforms for hit detection this frame.
  for (let i = 0; i < moved.length; i++) {
    const mon = moved[i];
    if (mon && mon.root) mon.root.updateMatrixWorld(true);
  }
}

// ==================== MAIN LOOP ====================
function loop() {
  requestAnimationFrame(loop);

  if (GameState.galleryMode) {
    const dt = clock.getDelta();
    if (window.galleryPivot) window.galleryPivot.rotation.y += dt * 0.5;
    const view = document.getElementById('galView');
    if (view) {
      const rect = view.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const left = rect.left;
      const bottom = renderer.domElement.clientHeight - rect.bottom;
      renderer.setViewport(left, bottom, width, height);
      renderer.setScissor(left, bottom, width, height);
      renderer.setScissorTest(true);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      camera.position.copy(window.galleryPivot.position).add(new THREE.Vector3(0, 0.5, 4));
      camera.lookAt(window.galleryPivot.position);
      renderer.setClearColor(0x111111, 1);
      renderer.clear();
      renderer.render(scene, camera);
    }
    return;
  }

  // Card Preview Mode (Progression Menu)
  if (window.previewTarget) {
    const dt = clock.getDelta();
    if (window.galleryPivot) window.galleryPivot.rotation.y += dt * 0.5;
    
    const rect = window.previewTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const left = rect.left;
    const bottom = renderer.domElement.clientHeight - rect.bottom;

    renderer.setScissorTest(true);
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.position.copy(window.galleryPivot.position).add(new THREE.Vector3(0, 1, 3.5));
    camera.lookAt(window.galleryPivot.position.clone().add(new THREE.Vector3(0, 0.5, 0)));
    
    const cv = document.getElementById('main');
    cv.style.zIndex = '600'; // Bring canvas to front (above overlay background)
    cv.style.pointerEvents = 'none'; // Allow clicks to pass through to close button
    renderer.setClearColor(0x000000, 0); // Transparent clear
    renderer.clear();
    renderer.render(scene, camera);
    return;
  }

  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  if (camera.aspect !== window.innerWidth / window.innerHeight) { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); }
  renderer.setClearColor(GameState.pBiome ? GameState.pBiome.fog : 0x8ab8d8);

  if (GameState.paused) {
    renderer.render(scene, camera);
    return;
  }

  if (GameState.gameRunning && !GameState.levelingUp) {
    let dt = Math.min(clock.getDelta(), 0.05);
    if (GameState.modX2) dt *= 2.0;

    GameState.globalTime += dt;
    GameState.pT += dt;
    if (typeof applyRunPassiveStatsToRuntime === 'function') applyRunPassiveStatsToRuntime();
    if (typeof applyInventoryWeaponScalingToRuntime === 'function') applyInventoryWeaponScalingToRuntime();
    GameState.pScore += dt * 10;
    GameState.invTimer = Math.max(0, GameState.invTimer - dt);
    GameState.frenzyTimer = Math.max(0, GameState.frenzyTimer - dt);
    GameState.dashCd = Math.max(0, GameState.dashCd - dt);
    GameState.pSpecialCd = Math.max(0, GameState.pSpecialCd - dt);

    // Cooldowns
    const wepKeys = Object.keys(WEAPONS);
    wepKeys.forEach(w => { if (WEAPONS[w]) WEAPONS[w].cd = Math.max(0, WEAPONS[w].cd - dt); });

    // Regen
    if (GameState.invTimer <= 0 && !GameState.modHC) GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + 0.3 * dt);
    if (GameState.invTimer <= 0 && !GameState.modHC) GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + GameState.pRegen * dt);

    // Fire
    handleFire();
    
    // Special Ability (Q key only)
    if (keys['KeyQ']) {
        if (!keyState.q) {
            if (typeof triggerSpecial === 'function') triggerSpecial();
            keyState.q = true;
        }
    } else {
        keyState.q = false;
    }

    // R key is handled by bootstrap for auto-attack toggle.
    keyState.r = false;
    
    // KeyE: class-specific movement skill.

    // Movement - Define isMoving BEFORE camera update
    _vMove.set(0, 0, 0);
    if (keys['KeyW'] || keys['ArrowUp']) _vMove.z = -1;
    if (keys['KeyS'] || keys['ArrowDown']) _vMove.z = 1;
    if (keys['KeyA'] || keys['ArrowLeft']) _vMove.x = -1;
    if (keys['KeyD'] || keys['ArrowRight']) _vMove.x = 1;
    let isMoving = _vMove.lengthSq() > 0;
    
    if (GameState.dashTime > 0) {
      GameState.dashTime -= dt;
      const slowMult = GameState.biomeSlowTimer > 0 ? 0.78 : 1;
      const effSpd = SPD * slowMult;
      playerPivot.position.addScaledVector(GameState.dashDir, effSpd * 4.5 * dt);
      camera.fov = 95;
      
      // Dash Attack Logic
      if (PASSIVES.dash_atk.active) {
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(playerPivot.position) < PASSIVES.dash_atk.range) {
                  if (m.invulnDash !== GameState.dashCd) { // Prevent multi-hit per dash frame
                      m.takeDmg(PASSIVES.dash_atk.dmg, true, 15, playerPivot.position);
                      spawnPart(m.root.position, 0xffaa00, 8, 6);
                      m.invulnDash = GameState.dashCd; // Tag monster
                  }
              }
          });
      }
      
      camera.updateProjectionMatrix();
    } else {
      if (camera.fov !== 85) { camera.fov = 85; camera.updateProjectionMatrix(); }
      
      // PHYSICS & WEIGHT SYSTEM
      const weight = GameState.pClass.weight || 1.0;
      const accel = 15.0 / weight; // Lighter = faster accel
      const friction = 10.0 / weight; // Lighter = faster stop
      
      let targetVx = 0;
      let targetVz = 0;
      const slowMult = GameState.biomeSlowTimer > 0 ? 0.78 : 1;
      const effSpd = SPD * slowMult;

      if (isMoving) {
        _vMove.normalize();
        const sY = Math.sin(camYaw), cY = Math.cos(camYaw);
        targetVx = (_vMove.x * cY + _vMove.z * sY) * effSpd;
        targetVz = (_vMove.z * cY - _vMove.x * sY) * effSpd;
      }
      
      // Interpolate velocity (Inertia)
      GameState.pVelX = THREE.MathUtils.lerp(GameState.pVelX || 0, targetVx, dt * (isMoving ? accel : friction));
      GameState.pVelZ = THREE.MathUtils.lerp(GameState.pVelZ || 0, targetVz, dt * (isMoving ? accel : friction));
      
      playerPivot.position.x += GameState.pVelX * dt;
      playerPivot.position.z += GameState.pVelZ * dt;
    }

    // Gravity + jump
    GameState.pVelY += GRAV * dt;
    playerPivot.position.y += GameState.pVelY * dt;
    
    // CRITICAL SAFETY: Check for NaN position to prevent game freeze
    if (isNaN(playerPivot.position.y) || isNaN(playerPivot.position.x) || isNaN(playerPivot.position.z)) {
        console.warn("Player position NaN detected! Respawning...");
        playerPivot.position.set(0, 50, 0);
        GameState.pVelY = 0;
    }

    const gh = terrainH(playerPivot.position.x, playerPivot.position.z) + 1.65;
    
    // Falling into Abyss check
    if (playerPivot.position.y < -30) {
        GameState.pHP = Math.max(0, GameState.pHP - 10);
        addNotif("CHUTE DANS LE VIDE!", "#ff0000");
        if (GameState.pHP <= 0) gameOver();
        else {
          const safeRespawn = findSafeSpawnPoint();
          playerPivot.position.set(safeRespawn.x, safeRespawn.h + 2.5, safeRespawn.z);
          GameState.pVelY = 0;
          GameState.pVelX = 0;
          GameState.pVelZ = 0;
          updateTerrain(playerPivot.position.x, playerPivot.position.z);
          lastCX = Math.round(playerPivot.position.x / CHUNK_SZ);
          lastCZ = Math.round(playerPivot.position.z / CHUNK_SZ);
        }
    } else if (gh > -50 && playerPivot.position.y < gh) { 
        // Solid ground collision
        playerPivot.position.y = gh; GameState.pVelY = 0; GameState.pJumpCount = 0; 
    }

    if (keys['Space']) {
      if (!keyState.space) {
        if (GameState.pJumpCount < GameState.pMaxJumps) {
          const jumpMult = GameState.biomeFx ? GameState.biomeFx.jumpMult : 1;
          GameState.pVelY = (GameState.pClass.jump || 8.5) * jumpMult;
          GameState.pJumpCount++;
          if (GameState.pJumpCount > 1) spawnPart(playerPivot.position, 0xffffff, 8, 4);
        }
        keyState.space = true;
      }
    } else keyState.space = false;

    // Viewmodel disabled for readability (no FP/TP weapon models)
    vmRecoil = Math.max(0, vmRecoil - dt * (WEAPONS.SCEPTER.active || WEAPONS.BOW.active || WEAPONS.BOOMERANG.active ? 7 : 4));
    const sway = Math.sin(GameState.pT * 2.6) * 0.003 * (isMoving ? 0.8 : 1);
    const bob = Math.sin(GameState.pT * 10) * 0.01 * (isMoving ? 1 : 0);
  if (!GameState.hideWeaponModels && vmModel) {
    vmModel.position.x = 0.38 + sway + bob;
    vmModel.position.y = -0.3 + sway - vmRecoil * 0.1 + Math.abs(bob);
    vmModel.rotation.x = -Math.PI/2 - vmRecoil * 0.2;
  }
  vmModelLeft = window.vmModelLeft || vmModelLeft;
  if (!GameState.hideWeaponModels && vmModelLeft) {
    vmModelLeft.position.x = -0.38 - sway - bob;
    vmModelLeft.position.y = -0.3 + sway - vmRecoil * 0.1 + Math.abs(bob);
    vmModelLeft.rotation.x = -Math.PI/2 - vmRecoil * 0.2;
    vmModelLeft.rotation.y = Math.PI;
  }

    // Terrain
    const px = playerPivot.position.x, pz = playerPivot.position.z;
    const cx = Math.round(px / CHUNK_SZ), cz = Math.round(pz / CHUNK_SZ);
    if (cx !== lastCX || cz !== lastCZ) { updateTerrain(px, pz); lastCX = cx; lastCZ = cz; }

    // World pickups
    chestTimer -= dt;
    if (chestTimer < 0) {
      const a = Math.random() * Math.PI * 2;
      const d = 15 + Math.random() * 15;
      chests.push(new WorldPickup(playerPivot.position.x + Math.cos(a) * d, playerPivot.position.z + Math.sin(a) * d));
      chestTimer = 11 + Math.random() * 14;
    }
    for (let i = chests.length - 1; i >= 0; i--) {
      if (chests[i].update(dt, playerPivot.position)) {
        scene.remove(chests[i].m || chests[i].root);
        chests.splice(i, 1);
      }
    }
    for (let i = xpOrbs.length - 1; i >= 0; i--) { if (xpOrbs[i].update(dt, playerPivot.position)) xpOrbs.splice(i, 1); }
    for (let i = cardDrops.length - 1; i >= 0; i--) {
      if (cardDrops[i].update(dt, playerPivot.position)) cardDrops.splice(i, 1);
    }

    // Performance sampling to keep late-game swarms playable.
    if (!GameState._perfWindow) GameState._perfWindow = { acc: 0, frames: 0, fps: 60 };
    GameState._perfWindow.acc += dt;
    GameState._perfWindow.frames++;
    if (GameState._perfWindow.acc >= 0.5) {
      const fps = GameState._perfWindow.frames / Math.max(0.001, GameState._perfWindow.acc);
      GameState._perfWindow.fps = fps;
      GameState._perfWindow.acc = 0;
      GameState._perfWindow.frames = 0;
      if (GameState.runTelemetry) GameState.runTelemetry.avgFps = Math.round(fps);
      if (fps >= 58) GameState.perfSpawnScale = 1.0;
      else if (fps >= 48) GameState.perfSpawnScale = 0.92;
      else if (fps >= 38) GameState.perfSpawnScale = 0.82;
      else GameState.perfSpawnScale = 0.72;
    }
    if (GameState.runTelemetry) {
      GameState.runTelemetry.peakMonsters = Math.max(GameState.runTelemetry.peakMonsters || 0, monsters.length);
    }

    // Spawn + boss
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      const rate = GameState.biomeFx ? GameState.biomeFx.spawnRateMult : 1;
      const director = (typeof getRunDirectorSnapshot === 'function') ? getRunDirectorSnapshot() : null;
      const phaseMul = director && director.spawnMul ? director.spawnMul : 1.0;
      const perfScale = Math.max(0.6, Math.min(1.1, Number(GameState.perfSpawnScale || 1.0)));
      // Spawn agressif: la pression monte rapidement avec le temps et les loops.
      const loopSpeedBonus = GameState.loopLevel * 0.08;
      const baseCd = Math.max(0.18, 1.4 - (GameState.pT / 90) - loopSpeedBonus);
      spawnTimer = (baseCd / Math.max(0.01, rate * phaseMul)) / Math.max(0.75, perfScale);
      doSpawn();
    }
    checkBoss();
    applyBiomeHazard(dt);

    // Update
    for (let i = monsters.length - 1; i >= 0; i--) { if (monsters[i].update(dt, playerPivot.position)) { scene.remove(monsters[i].root); monsters.splice(i, 1); } }
    applyMonsterSeparation(dt);
    for (let i = projectiles.length - 1; i >= 0; i--) { if (projectiles[i].update(dt, playerPivot.position)) projectiles.splice(i, 1); }
    if (typeof updateFamilyGroundZones === 'function') updateFamilyGroundZones(dt);
    updatePassives(dt);
    updPart(dt);
    updateDayNight(dt);
    drawMinimap();
    updateBossPointer(); // Update boss indicator
    updHUD(dt);
    updateLoadoutHaloVisuals(dt);

    // ==================== CAMERA UPDATE ====================
    if (playerPivot && camera) {
        if (GameState.thirdPerson) {
            playerModel.visible = true;
            if (vm) vm.visible = false;
            
            // 3rd Person Camera Position
            const dist = 4.0;
            const targetHeight = 1.5 * (playerTypeData.S || 1.0); // Hauteur de la tête/épaules ajustée à la taille
            
            const hDist = dist * Math.cos(camPitch);
            const vDist = dist * Math.sin(-camPitch);

            const cx = playerPivot.position.x + Math.sin(camYaw) * hDist;
            const cz = playerPivot.position.z + Math.cos(camYaw) * hDist;
            let cy = playerPivot.position.y + targetHeight + vDist;
            
            // Anti-clip sol basique (évite que la caméra passe sous terre)
            const terrH = terrainH(cx, cz);
            if (cy < terrH + 0.5) cy = terrH + 0.5;

            camera.position.set(cx, cy, cz);
            camera.lookAt(playerPivot.position.x, playerPivot.position.y + targetHeight, playerPivot.position.z);
            
            // Rotation du joueur basée sur la direction de mouvement
            if (isMoving) {
                const moveX = (_vMove.x * Math.cos(camYaw) + _vMove.z * Math.sin(camYaw));
                const moveZ = (_vMove.z * Math.cos(camYaw) - _vMove.x * Math.sin(camYaw));
                const targetRot = Math.atan2(moveX, moveZ);
                
                let rotDiff = targetRot - playerModel.rotation.y;
                while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
                while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
                playerModel.rotation.y += rotDiff * dt * 10;
            }
            
            // Animation
            animPuppet(playerParts, GameState.pT, isMoving, playerTypeData.S, playerTypeData.shape);
            
            // Billboard effect : seuls les sprites visibles face à face regardent la caméra
            // Exclure : yeux, markings, totem, orb, etc. (détails qui restent fixes sur la tête)
            const noBillboardParts = ['eyeL', 'eyeR', 'marking', 'totem', 'orb', 'aura', 'shadow', 'phantom', 'halo', 'cross', 'symbol', 'crown', 'helmet', 'hat', 'beard', 'beak', 'horn', 'star', 'rune'];
            for (let key in playerParts) {
                const part = playerParts[key];
                // Billboard uniquement pour les parties de premier niveau, excluant les accessoires/détails
                const isBillboardPart = !noBillboardParts.some(exclude => key.includes(exclude));
                if (part && part.lookAt && part.parent === playerModel && isBillboardPart) {
                    part.lookAt(camera.position);
                }
            }
        } else {
            playerModel.visible = false;
            if (vm) vm.visible = false;
            
            camera.position.copy(playerPivot.position);
            camera.position.y += 1.5 * (playerTypeData.S || 1.0); // Hauteur de caméra ajustée selon la taille du personnage
            camera.rotation.order = 'YXZ';
            camera.rotation.y = camYaw;
            camera.rotation.x = camPitch;
        }
    }
  }

  renderer.render(scene, camera);
}

// Runtime UI helpers moved to `game-runtime-ui.js`:
// - drawMinimap()
// - updateBossPointer()

// Bootstrap moved to `game-bootstrap.js`:
// - init()
// - auto-start on window load
