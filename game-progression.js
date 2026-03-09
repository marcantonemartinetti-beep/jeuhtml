// ═══════════════════════════════════════════════
// DUNGEON WORLD - Progression & Save System
// ═══════════════════════════════════════════════

// ==================== STABLE CLASS MAPPING ====================
var classStableIdMap = {};
var classByStableId = {};

function hashClassStableId(classId) {
  // FNV-1a 32-bit, then clamp to a compact positive numeric id range.
  let h = 0x811c9dc5;
  const src = String(classId || 'unknown');
  for (let i = 0; i < src.length; i++) {
    h ^= src.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return 1 + ((h >>> 0) % 900000);
}

function buildStableClassMaps() {
  classStableIdMap = {};
  classByStableId = {};
  const used = {};
  for (let i = 0; i < CLASSES.length; i++) {
    const cls = CLASSES[i];
    if (!cls || !cls.id) continue;
    let sid = hashClassStableId(cls.id);
    while (used[sid] && used[sid] !== cls.id) sid = sid >= 900000 ? 1 : sid + 1;
    used[sid] = cls.id;
    cls.stableId = sid;
    classStableIdMap[cls.id] = sid;
    classByStableId[sid] = cls;
  }
}

function getClassByStableId(stableId) {
  if (!classByStableId || !Object.keys(classByStableId).length) buildStableClassMaps();
  return classByStableId[stableId] || null;
}

function migrateClassSaveData() {
  if (!GameState || !GameState.saveData) return;
  
  if (!GameState.saveData.selectedClassStableId) {
    const selected = (GameState.pClass && GameState.pClass.id)
      ? GameState.pClass
      : (CLASSES[GameState.selCharIdx] || CLASSES[0]);
    if (selected && selected.id && classStableIdMap[selected.id]) {
      GameState.saveData.selectedClassStableId = classStableIdMap[selected.id];
    }
  }

  if (typeof GameState.saveData.selectedBiomeId !== 'string') {
    GameState.saveData.selectedBiomeId = 'plains';
  }
  if (typeof GameState.saveData.normalUnlockTier !== 'number') {
    GameState.saveData.normalUnlockTier = 0;
  }
}

function isNormalPlayableClass(cls) {
  if (!cls || !cls.id) return false;
  if (cls.shopPrice) return false;
  if (cls.linkedBiome) return false;
  if (String(cls.id).startsWith('boss_')) return false;
  return true;
}

function getNormalPowerScore(cls) {
  const hp = Number(cls.hp) || 100;
  const spd = Number(cls.spd) || 7;
  const jump = Number(cls.jump) || 8;
  const weight = Number(cls.weight) || 1;
  const specialCd = cls.special && Number(cls.special.cd) > 0 ? Number(cls.special.cd) : 12;
  return hp * 1.0 + spd * 12 + jump * 6 + weight * 20 + (80 / specialCd);
}

function getNormalClassesByPowerAscending() {
  return CLASSES
    .filter(isNormalPlayableClass)
    .slice()
    .sort((a, b) => {
      const da = getNormalPowerScore(a);
      const db = getNormalPowerScore(b);
      if (da !== db) return da - db;
      return String(a.id).localeCompare(String(b.id));
    });
}

function getNormalClassUnlockBiome(classId) {
  const orderedIds = getNormalClassesByPowerAscending().map((c) => c.id);
  const baseIds = ['mage', 'knight'];
  const unlockIds = orderedIds.filter((id) => !baseIds.includes(id));
  const unlockIdx = unlockIds.indexOf(classId);
  if (unlockIdx < 0) return null;
  return BIOMES[unlockIdx] || null;
}

function applyNormalClassUnlockTier(tier, notify = false) {
  if (!GameState || !GameState.saveData) return;
  if (!Array.isArray(GameState.saveData.unlockedClasses)) GameState.saveData.unlockedClasses = [];

  const baseIds = ['mage', 'knight'];
  baseIds.forEach((id) => {
    if (!GameState.saveData.unlockedClasses.includes(id)) GameState.saveData.unlockedClasses.push(id);
  });

  const orderedIds = getNormalClassesByPowerAscending().map((c) => c.id);
  const unlockIds = orderedIds.filter((id) => !baseIds.includes(id));
  const clampedTier = Math.max(0, Math.min(unlockIds.length, Math.floor(tier || 0)));

  for (let i = 0; i < clampedTier; i++) {
    const id = unlockIds[i];
    if (!GameState.saveData.unlockedClasses.includes(id)) {
      GameState.saveData.unlockedClasses.push(id);
      if (notify && typeof addNotif === 'function') {
        const cls = CLASSES.find((c) => c.id === id);
        if (cls) addNotif(`🔓 Personnage débloqué: ${cls.name}`, '#00ff00');
      }
    }
  }

  GameState.saveData.normalUnlockTier = Math.max(
    Number(GameState.saveData.normalUnlockTier) || 0,
    clampedTier
  );
}

function syncNormalClassUnlocksFromProgress(notify = false) {
  if (!GameState || !GameState.saveData) return;
  const currentTier = Number(GameState.saveData.normalUnlockTier) || 0;
  const biomeTier = Math.max(0, (Array.isArray(GameState.saveData.unlockedBiomes) ? GameState.saveData.unlockedBiomes.length : 1) - 1);
  applyNormalClassUnlockTier(Math.max(currentTier, biomeTier), notify);
}

function runMatchesSpecificUnlock(cls, runCtx) {
  if (!cls || !cls.specificUnlock || !runCtx) return false;
  const req = cls.specificUnlock;
  if (req.biomeId && req.biomeId !== runCtx.biomeId) return false;
  if (req.classId && req.classId !== runCtx.classId) return false;
  if (req.weaponId) {
    const used = runCtx.usedWeapons || {};
    if (!used[String(req.weaponId).toUpperCase()]) return false;
  }
  return true;
}

function evaluateSpecificClassUnlocks(runCtx, notify = true) {
  if (!GameState || !GameState.saveData || !runCtx) return 0;
  if (!Array.isArray(GameState.saveData.unlockedClasses)) GameState.saveData.unlockedClasses = [];
  if (!GameState.saveData.unlockedBySpecificConditions || typeof GameState.saveData.unlockedBySpecificConditions !== 'object') {
    GameState.saveData.unlockedBySpecificConditions = {};
  }

  let unlockedNow = 0;
  for (let i = 0; i < CLASSES.length; i++) {
    const cls = CLASSES[i];
    if (!cls || !cls.id || !cls.specificUnlock) continue;
    if (GameState.saveData.unlockedClasses.includes(cls.id)) continue;
    if (!runMatchesSpecificUnlock(cls, runCtx)) continue;

    GameState.saveData.unlockedClasses.push(cls.id);
    GameState.saveData.unlockedBySpecificConditions[cls.id] = true;
    unlockedNow++;
    if (notify && typeof addNotif === 'function') {
      addNotif(`Unlock: ${cls.name}`, '#65ff9a');
    }
  }
  return unlockedNow;
}

window.isNormalPlayableClass = isNormalPlayableClass;
window.getNormalClassesByPowerAscending = getNormalClassesByPowerAscending;
window.getNormalClassUnlockBiome = getNormalClassUnlockBiome;
window.syncNormalClassUnlocksFromProgress = syncNormalClassUnlocksFromProgress;
window.evaluateSpecificClassUnlocks = evaluateSpecificClassUnlocks;

// ==================== XP ====================
function xpForLevel(level) {
  const lv = Math.max(1, Math.floor(level || 1));
  return Math.floor(120 * Math.pow(lv, 1.35) + 45 * lv);
}

function addXP(n) {
  GameState.pXP += Math.max(0, n);
  const oldLvl = GameState.pLevel;

  let lvl = 1;
  let remaining = GameState.pXP;
  let req = xpForLevel(lvl);
  while (remaining >= req) {
    remaining -= req;
    lvl++;
    req = xpForLevel(lvl);
  }
  GameState.pLevel = lvl;

  if (GameState.pLevel > oldLvl) {
    const hpGain = 6 * (GameState.pLevel - oldLvl);
    GameState.pMaxHP += hpGain;
    GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + hpGain);
    showLevelUp();
  }

  const xpFill = document.getElementById('xpfill');
  if (xpFill) xpFill.style.width = ((remaining / Math.max(1, req)) * 100) + '%';
}

// ==================== GAME OVER / WIN ====================
function gameOver(showFullStats = false) {
  GameState.gameRunning = false;
  document.exitPointerLock();
  document.getElementById('hud').style.display = 'none';
  document.getElementById('overlay').style.display = 'flex';
  
  // Compute final stats
  const totalTime = GameState.totalPlayTime + GameState.pT;
  const totalKills = GameState.totalKills + GameState.pKills;
  const minutes = Math.floor(totalTime / 60);
  const seconds = Math.floor(totalTime % 60);
  const runTel = GameState.runTelemetry || {};
  
  let statsHTML = '';
  if (showFullStats) {
    statsHTML = `
      <div style="max-width:600px;margin:auto;text-align:left;color:#e0e0e0;font-size:14px;line-height:1.6;">
        <h3 style="color:#f0c030;text-align:center;margin-bottom:15px;">📊 STATISTIQUES COMPLÈTES</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px;background:rgba(0,0,0,0.3);border-radius:8px;">
          <div>🏆 <b>Loops Complétés:</b></div><div style="text-align:right;">${GameState.loopLevel}</div>
          <div>⏱ <b>Temps Total:</b></div><div style="text-align:right;">${minutes}m ${seconds}s</div>
          <div>💀 <b>Total Tués:</b></div><div style="text-align:right;">${totalKills}</div>
          <div>📈 <b>Niveau Final:</b></div><div style="text-align:right;">${GameState.pLevel}</div>
          <div>⭐ <b>Score Final:</b></div><div style="text-align:right;">${Math.floor(GameState.pScore)}</div>
          <div>🗺 <b>Biome:</b></div><div style="text-align:right;">${GameState.pBiome.name}</div>
          <div>👤 <b>Classe:</b></div><div style="text-align:right;">${GameState.pClass.name}</div>
          <div>⚔ <b>Dégâts Infligés:</b></div><div style="text-align:right;">${Math.floor(runTel.damageDealt || 0)}</div>
          <div>🛡 <b>Dégâts Reçus:</b></div><div style="text-align:right;">${Math.floor(runTel.damageTaken || 0)}</div>
          <div>🔥 <b>Elites / Boss:</b></div><div style="text-align:right;">${Math.floor(runTel.elitesKilled || 0)} / ${Math.floor(runTel.bossesKilled || 0)}</div>
          <div>📊 <b>Pic Monstres:</b></div><div style="text-align:right;">${Math.floor(runTel.peakMonsters || 0)}</div>
          <div>🖥 <b>FPS Moyen:</b></div><div style="text-align:right;">${Math.floor(runTel.avgFps || 60)}</div>
        </div>
      </div>
    `;
  }
  
  const loopText = GameState.loopLevel > 0 ? ` (Loop ${GameState.loopLevel})` : '';
  document.getElementById('overlay').innerHTML = `
    <h1 style="color:#aa2020;font-size:clamp(2em,6vw,4em)">GAME OVER${loopText}</h1>
    <div class="divider"></div>
    ${statsHTML}
    <p style="color:#8a6a4a;margin-top:15px;">Score: ${Math.floor(GameState.pScore)} · Tués: ${GameState.pKills} · Niveau: ${GameState.pLevel}</p>
    <button id="startBtn" onclick="location.reload()">↺ RECOMMENCER</button>
  `;
}

function gameWin() {
  GameState.gameRunning = false;
  document.exitPointerLock();
  document.getElementById('hud').style.display = 'none';
  document.getElementById('overlay').style.display = 'flex';
  
  // Update cumulative stats
  GameState.totalPlayTime += GameState.pT;
  GameState.totalKills += GameState.pKills;
  
  const loopText = GameState.loopLevel > 0 ? ` (Loop ${GameState.loopLevel})` : '';
  const nextLoopDiff = Math.floor((GameState.loopLevel + 1) * 50);
  const runTel = GameState.runTelemetry || {};
  
  document.getElementById('overlay').innerHTML = `
    <h1 style="color:#f0c030;font-size:clamp(2em,6vw,4em)">VICTOIRE !${loopText}</h1>
    <div class="divider"></div>
    <p style="color:#e0e0e0;font-size:18px;margin-bottom:20px;">Le boss final a été vaincu !</p>
    <div style="max-width:500px;margin:auto;padding:15px;background:rgba(0,0,0,0.3);border-radius:8px;margin-bottom:25px;">
      <div style="color:#aaa;font-size:14px;line-height:2;">
        ⏱ Temps: ${Math.floor(GameState.pT / 60)}m ${Math.floor(GameState.pT % 60)}s<br>
        💀 Tués: ${GameState.pKills}<br>
        📈 Niveau: ${GameState.pLevel}<br>
        ⭐ Score: ${Math.floor(GameState.pScore)}<br>
        ⚔ Dégâts: ${Math.floor(runTel.damageDealt || 0)}<br>
        🛡 Dégâts reçus: ${Math.floor(runTel.damageTaken || 0)}<br>
        🔥 Elites/Boss: ${Math.floor(runTel.elitesKilled || 0)}/${Math.floor(runTel.bossesKilled || 0)}
      </div>
    </div>
    <p style="color:#ffaa00;font-size:16px;margin-bottom:20px;">Que voulez-vous faire ?</p>
    <div style="display:flex;gap:15px;justify-content:center;flex-wrap:wrap;">
      <button onclick="continueToNextLoop()" style="background:#00aa44;flex:1;min-width:200px;max-width:250px;">
        🔄 NIVEAU SUIVANT<br>
        <span style="font-size:12px;opacity:0.8;">Stage suivant · Loop ${GameState.loopLevel + 1} (+${nextLoopDiff}% difficulté)</span>
      </button>
      <button onclick="gameOver(true)" style="background:#aa2020;flex:1;min-width:200px;max-width:250px;">
        🛑 ARRÊTER<br>
        <span style="font-size:12px;opacity:0.8;">Voir les statistiques</span>
      </button>
    </div>
  `;
  
  if (!GameState.saveData.wins) GameState.saveData.wins = {};
  if (!GameState.saveData.wins[GameState.pClass.id]) GameState.saveData.wins[GameState.pClass.id] = [];
  if (!GameState.saveData.wins[GameState.pClass.id].includes(GameState.pBiome.id)) GameState.saveData.wins[GameState.pClass.id].push(GameState.pBiome.id);
  
  // Unlock Next Biome
  const currentBiomeIdx = BIOMES.findIndex(b => b.id === GameState.pBiome.id);
  if (currentBiomeIdx !== -1 && currentBiomeIdx < BIOMES.length - 1) {
    const nextBiome = BIOMES[currentBiomeIdx + 1];
    if (!GameState.saveData.unlockedBiomes.includes(nextBiome.id)) {
      GameState.saveData.unlockedBiomes.push(nextBiome.id);
      addNotif(`🔓 Monde débloqué: ${nextBiome.name}`, '#00ff00');
    }
  }

  // Unlock normal classes sequentially: each completed biome grants one class.
  if (currentBiomeIdx !== -1) {
    applyNormalClassUnlockTier(currentBiomeIdx + 1, true);
  }

  // Unlock special classes that require precise stage/class/weapon combinations.
  evaluateSpecificClassUnlocks({
    biomeId: GameState.pBiome && GameState.pBiome.id,
    classId: GameState.pClass && GameState.pClass.id,
    usedWeapons: GameState.runUsedWeapons || {}
  }, true);
  
  // AUTO-SAVE on Win
  saveGame();
}

// ==================== SAVE / LOAD ====================
function saveGame() {
  buildStableClassMaps();
  migrateClassSaveData();

  const selectedClass = (GameState.pClass && GameState.pClass.id)
    ? GameState.pClass
    : (CLASSES[GameState.selCharIdx] || CLASSES[0]);
  if (selectedClass && selectedClass.id && classStableIdMap[selectedClass.id]) {
    GameState.saveData.selectedClassStableId = classStableIdMap[selectedClass.id];
  }

  if (Array.isArray(BIOMES) && BIOMES[GameState.selMapIdx]) {
    GameState.saveData.selectedBiomeId = BIOMES[GameState.selMapIdx].id;
  }

  syncNormalClassUnlocksFromProgress(false);

  // Keep legacy `gold` and current `money` fields in sync.
  const money = typeof GameState.saveData.money === 'number' ? GameState.saveData.money : 0;
  const gold = typeof GameState.saveData.gold === 'number' ? GameState.saveData.gold : 0;
  const unified = Math.max(money, gold);
  GameState.saveData.money = unified;
  GameState.saveData.gold = unified;
  try { localStorage.setItem('dw_save', JSON.stringify(GameState.saveData)); } catch(e) { console.error("Save failed", e); }
}

function loadGame() {
  try {
    const data = JSON.parse(localStorage.getItem('dw_save'));
    if (data) GameState.saveData = { ...GameState.saveData, ...data };
    buildStableClassMaps();
    migrateClassSaveData();
    syncNormalClassUnlocksFromProgress(false);
    if (!GameState.saveData.unlockedBySpecificConditions || typeof GameState.saveData.unlockedBySpecificConditions !== 'object') {
      GameState.saveData.unlockedBySpecificConditions = {};
    }
  } catch(e) {}
}
