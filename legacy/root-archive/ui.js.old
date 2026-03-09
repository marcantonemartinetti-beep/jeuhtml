// ═══════════════════════════════════════════════
// DUNGEON WORLD - UI Functions
// ═══════════════════════════════════════════════

// ==================== HUD STATE ====================
var hudState = { hp: 100, wep: '', score: 0, time: '0:00', dash: false, hit: false, special: false };
var hitFlash = 0;  // Duration of hit flash effect - decremented by game.js when player takes damage

function getMobIcon(shape) {
  const icons = {
    human: 'fa-solid fa-person',
    blob: 'fa-solid fa-disease',
    flyer: 'fa-solid fa-crow',
    spider: 'fa-solid fa-spider',
    worm: 'fa-solid fa-worm',
    elemental: 'fa-solid fa-fire',
    hydra: 'fa-solid fa-dragon',
    eye: 'fa-solid fa-eye',
    plant: 'fa-solid fa-leaf',
    titan: 'fa-solid fa-person-rays',
    naga: 'fa-solid fa-staff-snake',
    centaur: 'fa-solid fa-horse',
    mech: 'fa-solid fa-robot',
    insectoid: 'fa-solid fa-locust',
    dino: 'fa-solid fa-dragon',
    fish: 'fa-solid fa-fish',
    wheel: 'fa-solid fa-dharmachakra',
    floating_skull: 'fa-solid fa-skull',
    serpent: 'fa-solid fa-staff-snake',
    construct: 'fa-solid fa-cubes',
    book: 'fa-solid fa-book',
    cloud: 'fa-solid fa-cloud',
    ghost: 'fa-solid fa-ghost',
    slime_cube: 'fa-solid fa-cube',
    crystal_golem: 'fa-solid fa-gem',
    bat: 'fa-solid fa-crow',
    mushroom: 'fa-solid fa-circle-dot',
    mimic: 'fa-solid fa-box-open',
    scorpion: 'fa-solid fa-bug',
    djinn: 'fa-solid fa-wind',
    treant: 'fa-solid fa-tree',
    note: 'fa-solid fa-music',
    utensil: 'fa-solid fa-utensils',
    doll: 'fa-solid fa-child-reaching',
    gear: 'fa-solid fa-gear',
    shade: 'fa-solid fa-user-secret',
    beast: 'fa-solid fa-paw',
    // Nouvelles shapes ajoutées
    windmill: 'fa-solid fa-wind',
    scarecrow: 'fa-solid fa-person',
    sack: 'fa-solid fa-sack-dollar',
    scythe: 'fa-solid fa-sickle',
    plow: 'fa-solid fa-tractor',
    troll: 'fa-solid fa-skull',
    werewolf: 'fa-solid fa-dog',
    werewolf_beast: 'fa-solid fa-dog',
    monkey: 'fa-solid fa-otter',
    gorilla: 'fa-solid fa-otter',
    frog: 'fa-solid fa-frog',
    toad: 'fa-solid fa-frog',
    crocodile: 'fa-solid fa-alligator',
    hag: 'fa-solid fa-hat-witch',
    penguin: 'fa-solid fa-fish',
    mammoth: 'fa-solid fa-hippo',
    yeti: 'fa-solid fa-snowman',
    mummy: 'fa-solid fa-mummy',
    vampire: 'fa-solid fa-vampire',
    lich: 'fa-solid fa-skull',
    banshee: 'fa-solid fa-ghost',
    oni: 'fa-solid fa-mask',
    demon: 'fa-solid fa-fire',
    imp: 'fa-solid fa-fire',
    ogre: 'fa-solid fa-person-military-pointing',
    kappa: 'fa-solid fa-turtle',
    tengu: 'fa-solid fa-crow',
    dragon: 'fa-solid fa-dragon',
    phoenix: 'fa-solid fa-fire-flame-curved',
    cerberus: 'fa-solid fa-dog',
    salamander: 'fa-solid fa-fire',
    griffin: 'fa-solid fa-horse',
    harpy: 'fa-solid fa-crow',
    gargoyle: 'fa-solid fa-mask',
    succubus: 'fa-solid fa-fire',
    cactus: 'fa-solid fa-seedling',
    stone_golem: 'fa-solid fa-cubes',
    ice_golem: 'fa-solid fa-snowflake',
    lava_golem: 'fa-solid fa-fire',
    iron_golem: 'fa-solid fa-robot',
    animated_armor: 'fa-solid fa-shield',
    shadow: 'fa-solid fa-user-ninja',
    leech: 'fa-solid fa-worm',
    poltergeist: 'fa-solid fa-ghost',
    jailer_ghost: 'fa-solid fa-ghost',
    executioner: 'fa-solid fa-axe',
    hellhound: 'fa-solid fa-dog',
    chained_skeleton: 'fa-solid fa-skull',
    violin: 'fa-solid fa-music',
    guitar: 'fa-solid fa-music',
    harp: 'fa-solid fa-music',
    mutant: 'fa-solid fa-disease',
    cyborg: 'fa-solid fa-robot',
    xenomorph: 'fa-solid fa-spider',
    voidling: 'fa-solid fa-user-secret',
    voidbeast: 'fa-solid fa-paw',
    voidmage: 'fa-solid fa-hat-wizard',
    nightmare: 'fa-solid fa-horse',
    fallen_angel: 'fa-solid fa-dove',
    seraph: 'fa-solid fa-dove',
    cherub: 'fa-solid fa-dove',
    angel: 'fa-solid fa-dove',
    pegasus: 'fa-solid fa-horse',
    deep_one: 'fa-solid fa-fish',
    fishman: 'fa-solid fa-fish',
    pixie: 'fa-solid fa-wand-magic-sparkles'
  };
  return icons[shape] || 'fa-solid fa-skull';
}

// ==================== HUD UPDATE ====================
// HUD functions moved to ui-hud.js
function updHUD(dt) {
  const chp = Math.ceil(GameState.pHP);

  if (chp !== hudState.hp) {
    hudState.hp = chp;
    document.getElementById('hp-fill').style.width = Math.max(0, Math.min(100, GameState.pHP / GameState.pMaxHP * 100)) + '%';
    document.getElementById('hp-txt').textContent = chp;
  }

  let wStats = '', wIcon = '';

  // Find active weapon safely - loop through instead of hardcoding names
  try {
    for (const weaponKey in WEAPONS) {
      if (WEAPONS[weaponKey] && WEAPONS[weaponKey].active) {
        const w = WEAPONS[weaponKey];
        const displayName = weaponKey.replace(/_/g, ' ').toUpperCase();
        wStats = `${displayName} · DMG: ${Math.round(w.dmg)}`;
        wIcon = w.icon || '';
        break;
      }
    }
  } catch(e) {
    // Fallback if anything goes wrong
    wStats = 'WEAPON · DMG: 0';
    wIcon = 'fa-solid fa-sword';
  }

  if (wStats !== hudState.wep) {
    hudState.wep = wStats;
    document.getElementById('scepterStats').innerHTML = `<i class="${wIcon}"></i> ${wStats}`;
  }

  const isHit = hitFlash > 0;
  if (isHit !== hudState.hit) {
    hudState.hit = isHit;
    document.getElementById('xh').classList.toggle('hit', isHit);
  }

  // Mise à jour de l'ancien indicateur de dash (si présent)
  const isDash = GameState.dashCd <= 0;
  if (isDash !== hudState.dash) {
    hudState.dash = isDash;
    const di = document.getElementById('dashInd');
    if (di) {
        if (isDash) di.classList.add('rdy');
        else di.classList.remove('rdy');
    }
  }

  // NOUVEAU HUD COMPÉTENCES
  const elSpecial = document.getElementById('skillSpecial');
  const elCdSpecial = document.getElementById('cdSpecial');
  const elDash = document.getElementById('skillDash');
  const elCdDash = document.getElementById('cdDash');

  if (elSpecial && elCdSpecial) {
      const maxCd = (GameState.pClass && GameState.pClass.special && GameState.pClass.special.cd) || 10.0;
      const curCd = GameState.pSpecialCd;
      
      if (curCd > 0) {
          elSpecial.classList.remove('ready');
          const pct = Math.min(100, (curCd / maxCd) * 100);
          elCdSpecial.style.height = pct + '%';
          elCdSpecial.textContent = curCd.toFixed(1);
      } else {
          elSpecial.classList.add('ready');
          elCdSpecial.style.height = '0%';
          elCdSpecial.textContent = '';
      }
      
      // Initialisation de l'icône (une seule fois)
      if (!elSpecial.dataset.init && GameState.pClass) {
          elSpecial.querySelector('.skill-icon').innerHTML = `<i class="${GameState.pClass.icon}"></i>`;
          elSpecial.dataset.init = "true";
      }
  }

  if (elDash && elCdDash) {
      const maxDashCd = 1.5 * GameState.pDashCdMult;
      const curDashCd = GameState.dashCd;
      
      if (curDashCd > 0) {
          elDash.classList.remove('ready');
          const pct = Math.min(100, (curDashCd / maxDashCd) * 100);
          elCdDash.style.height = pct + '%';
          elCdDash.textContent = curDashCd.toFixed(1);
      } else {
          elDash.classList.add('ready');
          elCdDash.style.height = '0%';
          elCdDash.textContent = '';
      }
  }

  // Combo Display (Reuse score or add new element)
  const scoreEl = document.getElementById('score');
  if (GameState.pCombo > 1) {
      scoreEl.innerHTML = `${Math.floor(GameState.pScore)} <span style="color:#ffaa00;font-size:0.8em;">x${GameState.pCombo} COMBO</span>`;
  } else {
      scoreEl.textContent = Math.floor(GameState.pScore);
  }

  const cScore = Math.floor(GameState.pScore);
  if (cScore !== hudState.score) {
    hudState.score = cScore;
    document.getElementById('score').textContent = cScore;
  }

  const m = Math.floor(GameState.pT / 60), s = Math.floor(GameState.pT % 60);
  const tStr = `${m}:${s < 10 ? '0' : ''}${s}`;
  if (tStr !== hudState.time) {
    hudState.time = tStr;
    document.getElementById('timer').textContent = tStr;
  }

  const killsEl = document.getElementById('kills');
  if (killsEl.textContent !== GameState.pKills.toString()) {
    killsEl.innerHTML = `<i class="fa-solid fa-skull"></i> ${GameState.pKills}`;
  }
}

// ==================== UPGRADES HUD ====================
function updateUpgradesHUD() {
  const container = document.getElementById('upgrades-display');
  container.innerHTML = '';
  for (const id in GameState.playerUpgrades) {
    const upgrade = UPGRADES.find(u => u.id === id);
    if (upgrade) {
      const count = GameState.playerUpgrades[id];
      container.innerHTML += `<div class="upgrade-icon" title="${upgrade.name}"><i class="${upgrade.icon}"></i> x${count}</div>`;
    }
  }
}

// ==================== NOTIFICATIONS ====================
function addNotif(txt, col = '#d0a060') {
  const d = document.createElement('div');
  d.className = 'ntf';
  d.style.color = col;
  d.textContent = txt;
  document.getElementById('notifs').appendChild(d);
  setTimeout(() => d.remove(), 3000);
}

let flashT;
function flashDmg() {
  const e = document.getElementById('dmgfl');
  e.style.opacity = '1';
  clearTimeout(flashT);
  flashT = setTimeout(() => e.style.opacity = '0', 200);
}

// ==================== LEVEL UP ====================
var selectedUpgradeData = null;
var selectedUpgradeId = null;

function toggleAutoUp(v) {
  GameState.autoUpgrade = v;
}

window.selectUpgrade = function(data, id, element) {
    selectedUpgradeData = data;
    selectedUpgradeId = id;
    document.querySelectorAll('.card').forEach(c => {
        c.style.transform = 'scale(1)';
        c.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
        c.style.borderColor = c.dataset.borderColor || '#444';
    });
    element.style.transform = 'scale(1.1)';
    element.style.boxShadow = '0 0 20px #ffd700';
    element.style.borderColor = '#ffd700';
    
    const confirmBtn = document.getElementById('confirmUpgradeBtn');
    if (confirmBtn) confirmBtn.style.display = 'block';
};

window.confirmUpgrade = function() {
    if (selectedUpgradeData) {
        selectedUpgradeData.apply();
        GameState.playerUpgrades[selectedUpgradeId] = (GameState.playerUpgrades[selectedUpgradeId] || 0) + 1;
        updateUpgradesHUD();
        const pending = Math.max(0, (GameState.pendingBossChestUpgrades || 0) - 1);
        GameState.pendingBossChestUpgrades = pending;
        GameState.levelingUp = false;
        document.getElementById('lvlUp').style.display = 'none';
        renderer.domElement.requestPointerLock();
        if (pending > 0) {
          setTimeout(() => {
            if (typeof showLevelUp === 'function') showLevelUp();
          }, 0);
        }
    }
};

function getActiveWeaponEntry() {
  for (const key in WEAPONS) {
    if (WEAPONS[key] && WEAPONS[key].active) return { key, wep: WEAPONS[key] };
  }
  return null;
}

function getWeaponPathUpgrades() {
  const active = getActiveWeaponEntry();
  if (!active) return [];

  const key = active.key;
  const w = active.wep;
  if (!GameState.weaponPaths) GameState.weaponPaths = {};
  if (!GameState.weaponPaths[key]) GameState.weaponPaths[key] = { power: 0, control: 0, chaos: 0 };

  const st = GameState.weaponPaths[key];
  const mk = (path, icon, name, descFn, applyFn) => ({
    id: `path_${key}_${path}`,
    name,
    icon,
    type: 'path',
    req: () => (st[path] || 0) < 3,
    scale: () => ({
      desc: `${descFn()} (${(st[path] || 0) + 1}/3)`,
      apply: () => {
        applyFn();
        st[path] = (st[path] || 0) + 1;
      }
    })
  });

  return [
    mk(
      'power',
      'fa-solid fa-fire',
      `Voie Puissance - ${key}`,
      () => '+18% dégâts, impact renforcé',
      () => {
        w.pathPower = (w.pathPower || 0) + 1;
        w.dmg *= 1.18;
        w.stagger = (w.stagger || 0) + 0.25;
        if (w.range) w.range *= 1.06;
        if (w.speed) w.speed *= 1.05;
      }
    ),
    mk(
      'control',
      'fa-solid fa-crosshairs',
      `Voie Contrôle - ${key}`,
      () => '-10% cooldown, trajectoire plus stable',
      () => {
        w.pathControl = (w.pathControl || 0) + 1;
        w.maxCd *= 0.90;
        if (w.homing !== undefined) w.homing += 0.22;
        if (w.arc) w.arc = Math.min(Math.PI * 2, w.arc + 0.14);
        if (w.spread) w.spread *= 0.9;
      }
    ),
    mk(
      'chaos',
      'fa-solid fa-dice',
      `Voie Chaos - ${key}`,
      () => '+variance, multishot/effets secondaires',
      () => {
        w.pathChaos = (w.pathChaos || 0) + 1;
        w.statusChance = (w.statusChance || 0) + 0.06;
        if (w.count !== undefined) w.count += 1;
        else if (w.blast !== undefined) w.blast += 0.8;
        else if (w.arc !== undefined) w.arc = Math.min(Math.PI * 2, w.arc + 0.3);
      }
    )
  ];
}

function canUseUpgrade(u) {
  if (!u || !u.req) return true;
  try {
    // Some upgrades expect the current SCEPTER state as context.
    return !!u.req(WEAPONS.SCEPTER);
  } catch (e) {
    return false;
  }
}

function showLevelUp() {
  if (GameState.autoUpgrade) {
    const pool = UPGRADES.filter(canUseUpgrade).concat(getWeaponPathUpgrades().filter(canUseUpgrade));
    if (pool.length > 0) {
      const uIdx = Math.floor(Math.random() * pool.length);
      const u = pool[uIdx];
      const r = Math.random();
      let rarity = RARITIES.common;
      if (r > 0.9) rarity = RARITIES.legendary;
      else if (r > 0.6) rarity = RARITIES.rare;
      u.scale(rarity.m).apply();
      GameState.playerUpgrades[u.id] = (GameState.playerUpgrades[u.id] || 0) + 1;
      updateUpgradesHUD();
      addNotif(`AUTO: ${u.name} (${rarity.n})`, '#ffff00');
    }
    if ((GameState.pendingBossChestUpgrades || 0) > 0) {
      GameState.pendingBossChestUpgrades--;
      if (GameState.pendingBossChestUpgrades > 0) {
        setTimeout(() => showLevelUp(), 0);
      }
    }
    return;
  }

  GameState.levelingUp = true;
  document.exitPointerLock();
  
  // Ensure UI exists and is up to date
  let ui = document.getElementById('lvlUp');
  if (!ui) { injectDOM(); ui = document.getElementById('lvlUp'); }
  
  ui.style.display = 'flex';
  document.getElementById('autoUpCheck').checked = GameState.autoUpgrade;
  
  // Reset selection state
  selectedUpgradeData = null;
  selectedUpgradeId = null;
  const btn = document.getElementById('confirmUpgradeBtn');
  if(btn) btn.style.display = 'none';
  
  const chk = document.getElementById('autoUpCheck');
  if(chk) chk.checked = GameState.autoUpgrade;
  
  rerollUpgrades();
}

function rerollUpgrades() {
  const c = document.getElementById('upCards');
  if (!c) return;
  c.innerHTML = '';
  let pool = [];
  try {
      pool = UPGRADES.filter(canUseUpgrade);
      pool = pool.concat(getWeaponPathUpgrades().filter(canUseUpgrade));
  } catch(e) { console.error("Upgrade filter error", e); pool = UPGRADES; }

  for (let i = 0; i < 3; i++) {
    if (pool.length === 0) break;
    const u = pool[Math.floor(Math.random() * pool.length)];

    const r = Math.random();
    let rarity = RARITIES.common;
    if (r > 0.9) rarity = RARITIES.legendary;
    else if (r > 0.6) rarity = RARITIES.rare;

    const data = u.scale(rarity.m);

    const el = document.createElement('div');
    el.className = `card ${rarity.c}`;
    // Styles de secours pour garantir l'affichage des cartes
    el.style.cssText = 'width:200px;height:280px;background:#1a1a1a;border:2px solid #444;border-radius:8px;padding:15px;cursor:pointer;transition:transform 0.2s;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.5);color:#eee;font-family:sans-serif;';
    if(rarity.c === 'rare') el.style.borderColor = '#4488ff';
    if(rarity.c === 'legendary') el.style.borderColor = '#ffaa00';
    el.onmouseenter = () => el.style.transform = 'scale(1.05)';
    el.onmouseleave = () => el.style.transform = 'scale(1)';
    el.dataset.borderColor = el.style.borderColor; // Store for reset

    el.innerHTML = `
      <div class="c-type">${u.type}</div>
      <div class="c-rarity">${rarity.n}</div>
      <div class="c-icon"><i class="${u.icon}"></i></div>
      <div class="c-name">${u.name}</div>
      <div class="c-desc">${data.desc}</div>
    `;
    el.onclick = () => selectUpgrade(data, u.id, el);
    c.appendChild(el);
  }
}

// ==================== SELECTION UI ====================
function hydrateSaveDataForMenu() {
  try {
    const raw = localStorage.getItem('dw_save');
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return;

    GameState.saveData = { ...GameState.saveData, ...data };
    if (!Array.isArray(GameState.saveData.unlockedClasses)) GameState.saveData.unlockedClasses = ['mage', 'knight'];
    if (!Array.isArray(GameState.saveData.unlockedBiomes)) GameState.saveData.unlockedBiomes = ['plains'];
    if (!GameState.saveData.unlockedClasses.includes('mage')) GameState.saveData.unlockedClasses.push('mage');
    if (!GameState.saveData.unlockedBiomes.includes('plains')) GameState.saveData.unlockedBiomes.push('plains');
    const money = typeof GameState.saveData.money === 'number' ? GameState.saveData.money : 0;
    const gold = typeof GameState.saveData.gold === 'number' ? GameState.saveData.gold : 0;
    const unified = Math.max(money, gold);
    GameState.saveData.money = unified;
    GameState.saveData.gold = unified;

    // Keep numeric stable class ids synced with legacy string ids.
    if (typeof buildStableClassMaps === 'function') buildStableClassMaps();
    if (typeof migrateClassSaveData === 'function') migrateClassSaveData();
  } catch (e) {
    console.warn('Menu save hydration failed:', e);
  }
}

function getWeaponDataByClass(c) {
  if (!c || !c.wep) return null;
  const keyMap = {
    scepter: 'SCEPTER', sword: 'SWORD', axe: 'AXE', bow: 'BOW', daggers: 'DAGGERS',
    spear: 'SPEAR', hammer: 'HAMMER', boomerang: 'BOOMERANG', scythe: 'SCYTHE',
    katana: 'KATANA', flail: 'FLAIL', gauntlets: 'GAUNTLETS', grimoire: 'GRIMOIRE',
    whip: 'WHIP', cards: 'CARDS', pistol: 'PISTOL', trident: 'TRIDENT', rifle: 'RIFLE',
    shuriken: 'SHURIKEN', void_staff: 'VOID_STAFF', fire_staff: 'FIRE_STAFF',
    leaf_blade: 'LEAF_BLADE', potion: 'POTION', lute: 'LUTE', wrench: 'WRENCH',
    javelin: 'JAVELIN', crossbow: 'CROSSBOW', runestone: 'RUNESTONE', rapier: 'RAPIER',
    bomb: 'BOMB', totem: 'TOTEM', claws: 'CLAWS', mace: 'MACE', mirror: 'MIRROR',
    revolver: 'REVOLVER', needles: 'NEEDLES', lightning_rod: 'LIGHTNING_ROD',
    ice_bow: 'ICE_BOW', dagger_sac: 'DAGGER_SAC', drill: 'DRILL', star_globe: 'STAR_GLOBE',
    cleaver: 'CLEAVER', balls: 'BALLS', greatsword: 'GREATSWORD', rock: 'ROCK',
    blowgun: 'BLOWGUN', greatbow: 'GREATBOW', dark_blade: 'DARK_BLADE',
    sun_staff: 'SUN_STAFF', hourglass: 'HOURGLASS'
  };
  const wKey = keyMap[c.wep];
  return wKey && WEAPONS[wKey] ? WEAPONS[wKey] : null;
}

function initSelectionUI() {
  hydrateSaveDataForMenu();

  // Initialize character grid
  const charGrid = document.getElementById('charGrid');
  if (!charGrid) return;
  charGrid.innerHTML = '';
  
  CLASSES.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'char-card' + (i === GameState.selCharIdx ? ' selected' : '');
    
    const isLocked = !GameState.saveData.unlockedClasses.includes(c.id);
    if (isLocked) el.classList.add('locked');
    
    // Create a canvas portrait
    const canvas = document.createElement('canvas');
    canvas.className = 'char-portrait';
    canvas.width = 120;
    canvas.height = 120;
    el.appendChild(canvas);
    
    // Add character name
    const nameLabel = document.createElement('div');
    nameLabel.className = 'char-name-label';
    nameLabel.textContent = c.name;
    el.appendChild(nameLabel);
    
    // Render portrait to canvas
    renderCharacterPortrait(canvas, c);
    
    el.onclick = () => {
      if (window.event) window.event.stopPropagation();
      GameState.selCharIdx = i;
      if (GameState.saveData && typeof classStableIdMap === 'object' && classStableIdMap[c.id]) {
        GameState.saveData.selectedClassStableId = classStableIdMap[c.id];
      }
      document.querySelectorAll('.char-card').forEach((x, j) => x.classList.toggle('selected', j === i));
      updateSelectionInfo();
    };
    
    charGrid.appendChild(el);
  });

  // Force exact 1:1 card sizing to avoid CSS/grid overlap edge-cases.
  syncCharGridSquareSizes();
  requestAnimationFrame(syncCharGridSquareSizes);
  if (!charGridResizeBound) {
    charGridResizeBound = true;
    window.addEventListener('resize', syncCharGridSquareSizes);
  }
  
  // Initialize stage grid
  const stageGrid = document.getElementById('stageGrid');
  stageGrid.innerHTML = '';
  
  BIOMES.forEach((b, i) => {
    const el = document.createElement('div');
    el.className = 'stage-card' + (i === GameState.selMapIdx ? ' selected' : '');
    
    const isLocked = !GameState.saveData.unlockedBiomes.includes(b.id);
    if (isLocked) el.classList.add('locked');
    
    el.innerHTML = `
      <div class="stage-icon"><i class="${b.icon}"></i></div>
      <div class="stage-name">${b.name}</div>
    `;
    
    el.onclick = () => {
      if (isLocked) return;
      if (window.event) window.event.stopPropagation();
      GameState.selMapIdx = i;
      document.querySelectorAll('.stage-card').forEach((x, j) => x.classList.toggle('selected', j === i));
      updateSelectionInfo();
    };
    
    stageGrid.appendChild(el);
  });
  
  updateSelectionInfo();
}

let charGridResizeBound = false;
function syncCharGridSquareSizes() {
  const grid = document.getElementById('charGrid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.char-card');
  cards.forEach((card) => {
    const w = Math.max(1, Math.floor(card.getBoundingClientRect().width));
    card.style.height = `${w}px`;
  });
}

function renderCharacterPortrait(canvas, classData) {
  if (!canvas) return;
  
  // Clear previous THREE.js content
  const parent = canvas.parentElement;
  if (parent && parent._portraitRenderer) {
    try { parent._portraitRenderer.dispose(); } catch(e) {}
  }
  
  // Create THREE.js scene for portrait
  const scene = new THREE.Scene();
  scene.background = null;
  
  const width = canvas.width || 120;
  const height = canvas.height || 120;
  
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1.2, 2.5);
  camera.lookAt(0, 0.8, 0);
  
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  
  // Lighting
  const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(1.5, 2, 2);
  scene.add(dirLight);
  
  // Build player model
  const pm = (typeof buildPlayerModel === 'function') ? buildPlayerModel(classData) : null;
  if (pm && pm.root) {
    const group = pm.root;
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);
    group.scale.setScalar(1.2);
    scene.add(group);
    
    // Render portrait once
    renderer.render(scene, camera);
  }
  
  // Store renderer for disposal
  if (parent) parent._portraitRenderer = renderer;
}

function updateSelectionInfo() {
  const c = CLASSES[GameState.selCharIdx];
  const b = BIOMES[GameState.selMapIdx];
  if (!c || !b) return;
  const isCharLocked = !GameState.saveData.unlockedClasses.includes(c.id);
  
  // Update character preview info
  document.getElementById('previewCharName').textContent = c.name;
  document.getElementById('previewCharDesc').textContent = c.desc;
  document.getElementById('pCharHP').textContent = c.hp;
  document.getElementById('pCharSpd').textContent = c.spd;
  
  // Get weapon info
  const wep = getWeaponDataByClass(c) || WEAPONS.SCEPTER;
  document.getElementById('pWeaponName').textContent = c.wep.toUpperCase();
  const wepStats = document.getElementById('pWeaponStats');
  const miniWeapon = document.getElementById('pCharMiniWeapon');
  const miniAbility = document.getElementById('pCharMiniAbility');
  if (wepStats) {
    wepStats.textContent = `DMG: ${wep.dmg ?? '--'} | CD: ${wep.maxCd ?? '--'}s`;
  }
  if (miniWeapon) {
    miniWeapon.textContent = `Arme: ${c.wep ? c.wep.toUpperCase() : '--'}`;
  }

  // Won stages overlay above character render
  const winsListEl = document.getElementById('charWinsList');
  if (winsListEl) {
    const winsByClass = (GameState.saveData && GameState.saveData.wins && typeof GameState.saveData.wins === 'object')
      ? GameState.saveData.wins
      : {};
    const wonStageIds = Array.isArray(winsByClass[c.id]) ? winsByClass[c.id] : [];
    const icons = wonStageIds
      .map((stageId) => {
        const stage = BIOMES.find((x) => x.id === stageId);
        if (!stage) return null;
        const iconClass = stage.icon || 'fa-solid fa-map';
        return `<span class="win-stage-icon" title="${stage.name}"><i class="${iconClass}"></i></span>`;
      })
      .filter(Boolean);

    if (!icons.length) {
      winsListEl.classList.remove('is-scrolling');
      winsListEl.innerHTML = '';
    } else if (icons.length > 9) {
      winsListEl.classList.add('is-scrolling');
      const base = icons.join('');
      winsListEl.innerHTML = `<div class="wins-track">${base}<span class="wins-track-copy">${base}</span></div>`;
    } else {
      winsListEl.classList.remove('is-scrolling');
      winsListEl.innerHTML = `<div class="wins-track">${icons.join('')}</div>`;
    }
  }
  
  // Render weapon model
  renderWeaponPreview(c);

  // Ability block
  const abilityName = document.getElementById('pAbilityName');
  const abilityDesc = document.getElementById('pAbilityDesc');
  const abilityIcon = document.getElementById('pAbilityIcon');
  if (abilityName && abilityDesc) {
    if (c.special) {
      abilityName.textContent = `${c.special.name} (${c.special.cd}s)`;
      abilityDesc.textContent = c.special.desc;
      if (abilityIcon) abilityIcon.className = c.special.icon || 'fa-solid fa-star';
      if (miniAbility) miniAbility.textContent = `Capacite: ${c.special.name}`;
    } else {
      abilityName.textContent = 'Aucune capacité';
      abilityDesc.textContent = 'Ce personnage n\'a pas de capacité active.';
      if (abilityIcon) abilityIcon.className = 'fa-solid fa-ban';
      if (miniAbility) miniAbility.textContent = 'Capacite: Aucune';
    }
  }
  
  // Show/hide unlock condition
  const unlockDiv = document.getElementById('unlockCondition');
  const unlockText = document.getElementById('unlockText');
  const charModelBlock = document.getElementById('charModelBlock');
  if (isCharLocked) {
    unlockDiv.style.display = 'flex';
    if (charModelBlock) charModelBlock.classList.add('is-locked');
    if (c.unlockReq) {
      unlockText.textContent = `Condition de deblocage: ${c.unlockReq}`;
    } else if (c.linkedBiome) {
      const linkedBiome = (typeof BIOMES !== 'undefined' && Array.isArray(BIOMES))
        ? BIOMES.find((x) => x.id === c.linkedBiome)
        : null;
      unlockText.textContent = linkedBiome
        ? `Condition de deblocage: Vaincre le boss de ${linkedBiome.name}`
        : 'Condition de deblocage: Vaincre le boss du biome lie';
    } else if (c.shopPrice) {
      unlockText.textContent = `Condition de deblocage: Acheter en boutique (${c.shopPrice.toLocaleString()} or)`;
    } else {
      unlockText.textContent = 'Condition de deblocage: Verrouille';
    }
  } else {
    unlockDiv.style.display = 'none';
    if (charModelBlock) charModelBlock.classList.remove('is-locked');
  }
  
  // Update stage preview info
  document.getElementById('previewStageName').innerHTML = `<span>${b.name}</span><i class="fa-solid fa-star stage-name-star"></i>`;
  document.getElementById('previewStageDesc').textContent = b.desc || 'Un lieu mystérieux et dangereux';
  const diffCol = b.diff <= 1.5 ? '#88ff88' : (b.diff <= 3 ? '#ffff88' : '#ff8888');
  document.getElementById('pStageDiff').innerHTML = `<span style="color:${diffCol}">x${b.diff}</span>`;
  document.getElementById('pStageXP').textContent = `+${Math.round((b.diff - 1) * 100)}%`;
  const stageBoss = BIOMES[GameState.selMapIdx].boss || 'Inconnu';
  document.getElementById('pStageBoss').textContent = stageBoss;
  document.getElementById('pStageMobs').textContent = `${(b.mobs || []).length} types`;
  
  // TODO: Render 3D previews (will need Three.js scene setup)
  renderCharacterPreview(c);
  renderStagePreview(b);
}

// ==================== 3D PREVIEW RENDERING ====================
let previewScenes = { char: null, stage: null };
let previewCameras = { char: null, stage: null };
let previewRenderers = { char: null, stage: null };
let previewModels = { char: null, stage: null };
let previewAnimStarted = false;
let previewStageCamRig = { baseY: 9.6, targetY: 0.8, targetZ: -4.5, radius: 7.5 };

function resizePreviewCanvases() {
  const charContainer = document.getElementById('charPreviewCanvas');
  const stageContainer = document.getElementById('stagePreviewCanvas');

  if (previewRenderers.char && previewCameras.char && charContainer) {
    const w = Math.max(1, charContainer.clientWidth);
    const h = Math.max(1, charContainer.clientHeight);
    previewRenderers.char.setSize(w, h, false);
    previewCameras.char.aspect = w / h;
    previewCameras.char.updateProjectionMatrix();
  }

  if (previewRenderers.stage && previewCameras.stage && stageContainer) {
    const w = Math.max(1, stageContainer.clientWidth);
    const h = Math.max(1, stageContainer.clientHeight);
    previewRenderers.stage.setSize(w, h, false);
    previewCameras.stage.aspect = w / h;
    previewCameras.stage.updateProjectionMatrix();
  }
}

function animatePreviewScenes() {
  if (GameState.gameRunning) return;

  if (previewModels.char) {
    previewModels.char.rotation.y += 0.01;
  }

  if (previewRenderers.char && previewScenes.char && previewCameras.char) {
    previewRenderers.char.render(previewScenes.char, previewCameras.char);
  }

  if (previewRenderers.stage && previewScenes.stage && previewCameras.stage) {
    // Overhead angled view with a subtle orbit for depth readability.
    const t = performance.now() * 0.00022;
    const radius = previewStageCamRig.radius;
    const x = Math.sin(t) * radius;
    const z = 5.8 + Math.cos(t) * 1.4;
    const y = previewStageCamRig.baseY + Math.sin(t * 1.7) * 0.25;

    previewCameras.stage.position.set(x, y, z);
    previewCameras.stage.lookAt(0, previewStageCamRig.targetY, previewStageCamRig.targetZ);

    previewRenderers.stage.render(previewScenes.stage, previewCameras.stage);
  }

  requestAnimationFrame(animatePreviewScenes);
}

function renderCharacterPreview(classData) {
  const container = document.getElementById('charPreviewCanvas');
  if (!container) return;
  
  // Initialize scene if needed
  if (!previewScenes.char) {
    previewScenes.char = new THREE.Scene();
    previewScenes.char.background = null;
    
    previewCameras.char = new THREE.PerspectiveCamera(48, container.clientWidth / container.clientHeight, 0.1, 100);
    previewCameras.char.position.set(0, 1.45, 3.9);
    previewCameras.char.lookAt(0, 0.7, 0);
    
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    
    previewRenderers.char = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    previewRenderers.char.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    previewRenderers.char.setSize(Math.max(1, container.clientWidth), Math.max(1, container.clientHeight), false);
    
    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
    previewScenes.char.add(ambLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(2, 3, 2);
    previewScenes.char.add(dirLight);
  }
  
  // Clear previous model
  while (previewScenes.char.children.length > 2) { // Keep lights
    previewScenes.char.remove(previewScenes.char.children[2]);
  }
  
  // Create real character model used in game
  const pm = (typeof buildPlayerModel === 'function') ? buildPlayerModel(classData) : null;
  const group = pm && pm.root ? pm.root : new THREE.Group();
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);
  group.scale.setScalar(1.08);
  previewCameras.char.position.set(0, 1.45, 3.9);
  previewCameras.char.lookAt(0, 0.7, 0);
  previewScenes.char.add(group);
  previewModels.char = group;

  resizePreviewCanvases();
  if (!previewAnimStarted) {
    previewAnimStarted = true;
    requestAnimationFrame(animatePreviewScenes);
    window.addEventListener('resize', resizePreviewCanvases);
  }
}

function renderStagePreview(biomeData) {
  const container = document.getElementById('stagePreviewCanvas');
  if (!container) return;

  // Initialize scene if needed
  if (!previewScenes.stage) {
    previewScenes.stage = new THREE.Scene();
    previewScenes.stage.background = null;

    previewCameras.stage = new THREE.PerspectiveCamera(68, container.clientWidth / container.clientHeight, 0.04, 250);
    previewCameras.stage.position.set(0, 9.6, 6.6);
    previewCameras.stage.lookAt(0, 0.8, -4.5);

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    previewRenderers.stage = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    previewRenderers.stage.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    previewRenderers.stage.setSize(Math.max(1, container.clientWidth), Math.max(1, container.clientHeight), false);

    // Lighting close to game readability (ambient + directional key light)
    const ambLight = new THREE.AmbientLight(0xffffff, 0.55);
    previewScenes.stage.add(ambLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(4, 7, 3);
    previewScenes.stage.add(dirLight);
  }

  const fogCol = biomeData.fog || 0x7ab0d8;
  // Wider fog range in preview so tall/rough biomes remain readable from overhead camera.
  previewScenes.stage.fog = new THREE.Fog(fogCol, 14, 90);
  if (previewRenderers.stage) previewRenderers.stage.setClearColor(fogCol, 1);

  // Clear previous terrain / props / mobs while keeping lights.
  while (previewScenes.stage.children.length > 2) {
    previewScenes.stage.remove(previewScenes.stage.children[2]);
  }

  // Initialize terrain biome profile to use the REAL terrain generation
  const biomeFx = typeof getBiomeProfile === 'function' ? getBiomeProfile(biomeData) : null;
  if (typeof setTerrainBiomeProfile === 'function' && biomeFx) {
    setTerrainBiomeProfile(biomeFx);
  }

  // Adapt camera height to actual biome relief so no stage gets hidden under terrain/fog.
  if (typeof terrainH === 'function') {
    let minH = Infinity;
    let maxH = -Infinity;
    for (let sx = -24; sx <= 24; sx += 6) {
      for (let sz = -24; sz <= 24; sz += 6) {
        const h = terrainH(sx, sz);
        if (h < minH) minH = h;
        if (h > maxH) maxH = h;
      }
    }
    const relief = Math.max(1, maxH - minH);
    previewStageCamRig.baseY = Math.max(11, Math.min(30, maxH + 8 + relief * 0.28));
    previewStageCamRig.targetY = minH + 1.8;
    previewStageCamRig.targetZ = -4.5;
    previewStageCamRig.radius = Math.max(8, Math.min(16, 8 + relief * 0.18));

    if (previewCameras.stage) {
      previewCameras.stage.position.set(0, previewStageCamRig.baseY, 6.6);
      previewCameras.stage.lookAt(0, previewStageCamRig.targetY, previewStageCamRig.targetZ);
    }
  }

  const g = new THREE.Group();
  const biomeId = (biomeData.id || '').toLowerCase();
  
  // Create REAL terrain chunk using game's terrainH function
  const CHUNK_SZ = 60;
  const S = 32;
  const groundGeo = new THREE.PlaneGeometry(CHUNK_SZ, CHUNK_SZ, S, S);
  groundGeo.rotateX(-Math.PI / 2);
  const pos = groundGeo.attributes.position.array;
  
  const colorCount = (S + 1) * (S + 1);
  const cols = new Float32Array(colorCount * 3);
  let colIdx = 0;
  
  // Use REAL terrain height function from game
  if (typeof terrainH === 'function' && typeof noise2 === 'function') {
    for (let i = 0; i < pos.length; i += 3) {
      const wx = pos[i], wz = pos[i + 2];
      const h = terrainH(wx, wz);
      pos[i + 1] = h;
      const v = (h + 5) / 25 + noise2(wx * 0.2, wz * 0.2) * 0.1;
      cols[colIdx++] = ((biomeData.col >> 16) & 255) / 255 * v;
      cols[colIdx++] = ((biomeData.col >> 8) & 255) / 255 * v;
      cols[colIdx++] = (biomeData.col & 255) / 255 * v;
    }
  }
  
  groundGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  groundGeo.computeVertexNormals();
  
  const ground = new THREE.Mesh(
    groundGeo,
    new THREE.MeshLambertMaterial({ vertexColors: true })
  );
  ground.receiveShadow = true;
  g.add(ground);

  // Water for Islands (same as game)
  if (['pirate', 'ocean'].includes(biomeId)) {
    const wGeo = new THREE.PlaneGeometry(CHUNK_SZ, CHUNK_SZ);
    wGeo.rotateX(-Math.PI/2);
    const wMat = new THREE.MeshBasicMaterial({color: 0x004488, transparent:true, opacity:0.7});
    const water = new THREE.Mesh(wGeo, wMat);
    water.position.y = -2;
    g.add(water);
  }
  
  // Ceiling for Indoors (same as game)
  if (['dungeon', 'crypt', 'mine', 'sewer', 'lab', 'library', 'museum', 'asylum', 'kitchen', 'core'].includes(biomeId)) {
    const cGeo = new THREE.PlaneGeometry(CHUNK_SZ, CHUNK_SZ);
    cGeo.rotateX(Math.PI/2);
    const cMat = new THREE.MeshBasicMaterial({color: 0x111111});
    const ceil = new THREE.Mesh(cGeo, cMat);
    ceil.position.y = 30;
    g.add(ceil);
  }

  // Generate REAL scenery using game's logic
  if (biomeFx && typeof hash === 'function' && typeof getScenerySpriteMat === 'function') {
    const cx = 0, cz = 0; // Center chunk
    const biomeTreeMap = {
      'plains': ['tree', 'tree'], 'farm': ['tree', 'crate'], 'desert': ['cactus', 'rock'], 'wildwest': ['cactus', 'crate'],
      'forest': ['dead', 'tree'], 'jungle': ['organic', 'dead'], 'fairy': ['tree', 'mushroom'], 'hive': ['organic', 'mushroom'],
      'snow': ['pine', 'rock'], 'storm': ['pine', 'dead'], 'swamp': ['dead', 'organic'], 'graveyard': ['tombstone', 'dead'],
      'magma': ['rock', 'crystal'], 'volcano': ['rock', 'crystal'], 'ocean': ['coral', 'rock'], 'pirate': ['coral', 'crate'],
      'samurai': ['pillar', 'tree'], 'dungeon': ['pillar', 'pillar'], 'void': ['crystal', 'crystal'], 'cyber': ['tech', 'tech']
    };
    const biomeRockMap = {
      'plains': ['rock', 'rock'], 'farm': ['rock', 'rock'], 'desert': ['rock', 'rock'], 'wildwest': ['rock', 'crate'],
      'forest': ['rock', 'organic'], 'jungle': ['organic', 'organic'], 'fairy': ['mushroom', 'crystal'],
      'snow': ['crystal', 'crystal'], 'magma': ['crystal', 'rock'], 'ocean': ['rock', 'coral'], 'pirate': ['crate', 'rock'],
      'samurai': ['pillar', 'rock'], 'dungeon': ['pillar', 'pillar'], 'void': ['crystal', 'crystal'], 'cyber': ['pillar', 'tech']
    };

    const treeOpts = biomeTreeMap[biomeId] || ['tree', 'rock'];
    const rockOpts = biomeRockMap[biomeId] || ['rock', 'crystal'];

    const c = new THREE.Color(biomeData.col);
    const treeCol1 = new THREE.Color(c).offsetHSL(0.08, 0.15, 0.02).getHex();
    const treeCol2 = new THREE.Color(c).offsetHSL(-0.05, 0.08, -0.05).getHex();
    const rockCol1 = new THREE.Color(biomeData.fog).offsetHSL(-0.04, -0.1, -0.15).getHex();
    const rockCol2 = new THREE.Color(biomeData.fog).offsetHSL(0.02, 0.05, 0.1).getHex();

    const tMat1 = getScenerySpriteMat(`${treeOpts[0]}@${biomeId}`, treeCol1);
    const tMat2 = getScenerySpriteMat(`${treeOpts[1]}@${biomeId}`, treeCol2);
    const rMat1 = getScenerySpriteMat(`${rockOpts[0]}@${biomeId}`, rockCol1);
    const rMat2 = getScenerySpriteMat(`${rockOpts[1]}@${biomeId}`, rockCol2);

    const indoorBiomes = ['dungeon', 'prison', 'mine', 'library', 'asylum', 'museum', 'lab', 'kitchen', 'crypt'];
    const isIndoor = indoorBiomes.includes(biomeId) || (biomeFx.terrainArchetype === 'maze');
    const treeFactor = isIndoor ? 0.15 : 1;
    const rockFactor = isIndoor ? 0.45 : 1;

    // Trees with EXACT same clustering logic as game
    const treeCount = Math.floor(biomeFx.treeDensity * 1.05 * treeFactor);
    for (let i = 0; i < treeCount; i++) {
      const clusterIdx = Math.floor(i / 4);
      const inCluster = i % 4;
      const h1 = hash(cx * 0.07 + cz * 0.13 + clusterIdx * 11);
      const h2 = hash(cx * 0.21 - cz * 0.09 + clusterIdx * 17);
      let lx = (h1 - 0.5) * CHUNK_SZ * 0.85;
      let lz = (h2 - 0.5) * CHUNK_SZ * 0.85;
      if (inCluster > 0) {
        const coff = hash(clusterIdx * 31 + inCluster);
        lx += (coff - 0.5) * 12;
        lz += (hash(clusterIdx * 37 + inCluster) - 0.5) * 12;
      }
      const h = terrainH(cx + lx, cz + lz);
      const s = 5 + hash(i * 3) * 5;
      const tMat = hash(i * 7) < 0.5 ? tMat1 : tMat2;
      const sp = new THREE.Sprite(tMat);
      sp.center.set(0.5, 0);
      sp.position.set(lx, h, lz);
      sp.scale.set(s, s, 1);
      g.add(sp);
    }

    // Rocks with EXACT same clustering logic as game
    const rockCount = Math.floor(biomeFx.rockDensity * 1.05 * rockFactor);
    for (let i = 0; i < rockCount; i++) {
      const clusterIdx = Math.floor(i / 3);
      const inCluster = i % 3;
      const h1 = hash(cx * 0.15 + cz * 0.08 + clusterIdx * 13);
      const h2 = hash(cx * 0.11 - cz * 0.19 + clusterIdx * 23);
      let lx = (h1 - 0.5) * CHUNK_SZ * 0.88;
      let lz = (h2 - 0.5) * CHUNK_SZ * 0.88;
      if (inCluster > 0) {
        const coff = hash(clusterIdx * 29 + inCluster);
        lx += (coff - 0.5) * 10;
        lz += (hash(clusterIdx * 41 + inCluster) - 0.5) * 10;
      }
      const h = terrainH(cx + lx, cz + lz);
      const s = 0.8 + hash(i * 2) * 2.2;
      const rMat = hash(i * 5) < 0.5 ? rMat1 : rMat2;
      const sp = new THREE.Sprite(rMat);
      sp.center.set(0.5, 0);
      sp.position.set(lx, h, lz);
      sp.scale.set(s, s, 1);
      g.add(sp);
    }

    // Add structures if buildStructure is available
    if (typeof buildStructure === 'function') {
      const structChance = 0.20;
      const structCount = 2; // A couple structures for preview
      for (let s = 0; s < structCount; s++) {
        const seed4struct = hash(cx * 11 + cz * 13 + s * 17);
        if (hash(seed4struct) > structChance) continue;
        
        const structX = (hash(seed4struct * 2.1) - 0.5) * CHUNK_SZ * 0.7;
        const structZ = (hash(seed4struct * 3.3) - 0.5) * CHUNK_SZ * 0.7;
        const h = terrainH(cx + structX, cz + structZ);
        
        const numStructTypes = Math.floor(hash(seed4struct * 7.1) * 3) + 0;
        const structType = Math.min(2, numStructTypes);
        
        const structData = buildStructure(biomeId, structType, 0, 0, 0);
        if (structData && structData.mesh) {
          structData.mesh.position.set(structX, h, structZ);
          g.add(structData.mesh);
        }
      }
    }
  }

  // Enemies at various distances
  if (Array.isArray(biomeData.mobs) && biomeData.mobs.length && typeof buildPuppet === 'function') {
    const mobNames = biomeData.mobs;
    for (let i = 0; i < Math.min(8, mobNames.length * 3); i++) {
      const mobName = mobNames[i % mobNames.length];
      const mt = Array.isArray(MTYPES) ? MTYPES.find((m) => m.name === mobName) : null;
      if (!mt) continue;
      const built = buildPuppet(mt);
      if (!built || !built.g) continue;
      const enemy = built.g;
      
      const angle = (i / 8) * Math.PI * 2;
      const dist = 5 + (i % 3) * 3.5;
      const ex = Math.sin(angle) * dist;
      const ez = Math.cos(angle) * dist;
      
      enemy.position.set(ex, typeof terrainH === 'function' ? terrainH(ex, ez) + 1.05 : 1.05, -Math.abs(ez) - 2);
      enemy.rotation.y = Math.atan2(ex, ez);
      enemy.scale.setScalar(0.88 + (i % 2) * 0.15);
      g.add(enemy);
    }
  }

  previewScenes.stage.add(g);
  previewModels.stage = g;
  resizePreviewCanvases();
}

function renderWeaponPreview(classData) {
  const weaponCanvas = document.getElementById('weaponModelCanvas');
  if (!weaponCanvas) return;
  
  // Clear previous content
  weaponCanvas.innerHTML = '';
  
  const wep = getWeaponDataByClass(classData) || WEAPONS.SCEPTER;
  
  // Create a mini THREE.js scene for weapon rendering
  let weaponScene, weaponCamera, weaponRenderer, weaponModel;
  
  weaponScene = new THREE.Scene();
  weaponScene.background = null;
  
  weaponCamera = new THREE.PerspectiveCamera(
    45,
    weaponCanvas.clientWidth / weaponCanvas.clientHeight,
    0.1,
    1000
  );
  weaponCamera.position.set(1.5, 0.5, 2);
  weaponCamera.lookAt(0, 0.5, 0);
  
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  weaponCanvas.appendChild(canvas);
  
  weaponRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  weaponRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  weaponRenderer.setSize(weaponCanvas.clientWidth, weaponCanvas.clientHeight, false);
  
  // Lighting
  const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
  weaponScene.add(ambLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(2, 2, 3);
  weaponScene.add(dirLight);
  
  // Build weapon model if available
  if (typeof buildWeapon3D === 'function') {
    const wepData = { type: classData.wep };
    weaponModel = buildWeapon3D(wepData, 0.8) || null;
    if (weaponModel) {
      const box = new THREE.Box3().setFromObject(weaponModel);
      const center = box.getCenter(new THREE.Vector3());
      weaponModel.position.sub(center);
      weaponScene.add(weaponModel);
    }
  }
  
  // Simple render
  weaponRenderer.render(weaponScene, weaponCamera);
  
  // Add rotation animation
  const animateWeapon = () => {
    if (weaponModel) {
      weaponModel.rotation.y += 0.03;
      weaponModel.rotation.x += 0.01;
    }
    weaponRenderer.render(weaponScene, weaponCamera);
    requestAnimationFrame(animateWeapon);
  };
  animateWeapon();
}

// ==================== RANDOM SELECTION ====================
window.randomCharacter = function() {
  const unlockedClasses = CLASSES.map((c, i) => ({ c, i })).filter(x => GameState.saveData.unlockedClasses.includes(x.c.id));
  if (unlockedClasses.length === 0) return;
  
  const randomClass = unlockedClasses[Math.floor(Math.random() * unlockedClasses.length)];
  GameState.selCharIdx = randomClass.i;
  if (GameState.saveData && typeof classStableIdMap === 'object' && classStableIdMap[randomClass.c.id]) {
    GameState.saveData.selectedClassStableId = classStableIdMap[randomClass.c.id];
  }
  
  document.querySelectorAll('.char-card').forEach((x, j) => x.classList.toggle('selected', j === randomClass.i));
  updateSelectionInfo();
  
  addNotif(`🎲 ${randomClass.c.name} sélectionné !`, '#ffaa00');
};

window.randomStage = function() {
  const unlockedBiomes = BIOMES.map((b, i) => ({ b, i })).filter(x => GameState.saveData.unlockedBiomes.includes(x.b.id));
  if (unlockedBiomes.length === 0) return;
  
  const randomBiome = unlockedBiomes[Math.floor(Math.random() * unlockedBiomes.length)];
  GameState.selMapIdx = randomBiome.i;
  
  document.querySelectorAll('.stage-card').forEach((x, j) => x.classList.toggle('selected', j === randomBiome.i));
  updateSelectionInfo();
  
  addNotif(`🎲 ${randomBiome.b.name} sélectionné !`, '#ffaa00');
};

// ==================== THEME SHOP ====================
window.openThemeShop = function() {
  const shop = document.getElementById('themeShopUI');
  const list = document.getElementById('themeShopList');
  const mainSel = document.getElementById('mainSelection');
  
  if (!shop || !list) return;
  
  // Update currency display (unified money/gold balance)
  const unifiedBalance = Math.max(
    typeof GameState.saveData.money === 'number' ? GameState.saveData.money : 0,
    typeof GameState.saveData.gold === 'number' ? GameState.saveData.gold : 0
  );
  document.getElementById('themeShopGold').textContent = unifiedBalance.toLocaleString();
  
  // Render themes
  list.innerHTML = '';
  const themes = getAllThemes();
  
  themes.forEach(theme => {
    const isUnlocked = isThemeUnlocked(theme.id);
    const isActive = currentTheme === theme.id;
    
    const card = document.createElement('div');
    card.className = 'theme-card';
    if (isUnlocked) card.classList.add('unlocked');
    if (isActive) card.classList.add('active');
    
    let statusIcon = '<i class="fa-solid fa-lock"></i>';
    let statusClass = 'locked';
    if (isActive) {
      statusIcon = '<i class="fa-solid fa-check"></i>';
      statusClass = 'active';
    } else if (isUnlocked) {
      statusIcon = '<i class="fa-solid fa-unlock"></i>';
      statusClass = 'unlocked';
    }
    
    card.innerHTML = `
      <div class="theme-status ${statusClass}">${statusIcon}</div>
      <div class="theme-icon"><i class="${theme.icon}"></i></div>
      <div class="theme-name">${theme.name}</div>
      <div class="theme-desc">${theme.desc}</div>
      <div class="theme-price">${theme.price === 0 ? 'GRATUIT' : theme.price.toLocaleString() + ' <i class="fa-solid fa-coins"></i>'}</div>
    `;
    
    card.onclick = () => {
      if (isActive) return;
      
      if (!isUnlocked) {
        buyTheme(theme.id);
        openThemeShop(); // Refresh
      } else {
        applyUITheme(theme.id);
        openThemeShop(); // Refresh
      }
    };
    
    list.appendChild(card);
  });
  
  mainSel.style.display = 'none';
  shop.style.display = 'flex';
};

window.closeThemeShop = function() {
  const shop = document.getElementById('themeShopUI');
  const mainSel = document.getElementById('mainSelection');
  
  if (shop) shop.style.display = 'none';
  if (mainSel) mainSel.style.display = 'grid';
  resizePreviewCanvases();
};

// ==================== QUEST SYSTEM ====================
function newQuest() {
  const type = MTYPES[Math.floor(Math.random() * MTYPES.length)];
  const count = 3 + Math.floor(Math.random() * 3) + Math.floor(GameState.pLevel / 3);
  GameState.currentQuest = { target: type.name, req: count, cur: 0, xp: 300 + count * 30 };
  updateQuestUI();
  addNotif(`📜 Quête: Tuer ${count} ${type.name}s`, '#ffffff');
}

function updateQuest(m) {
  if (!GameState.currentQuest) return;
  if (m.baseName === GameState.currentQuest.target) {
    GameState.currentQuest.cur++;
    updateQuestUI();
    if (GameState.currentQuest.cur >= GameState.currentQuest.req) {
      addNotif(`✨ Quête accomplie! +${GameState.currentQuest.xp} XP`, '#ffff00');
      xpOrbs.push(new XPOrb(playerPivot.position.clone().add(new THREE.Vector3(0, 2, 0)), GameState.currentQuest.xp));
      GameState.pScore += 1000;
      GameState.currentQuest = null;
      setTimeout(newQuest, 3000);
    }
  }
}
function updateQuestUI() {
  const qDesc = document.getElementById('qDesc');
  const qFill = document.getElementById('qFill');
  if (!qDesc || !qFill) return;

  if (!GameState.currentQuest) {
    qDesc.textContent = 'Aucune quête active';
    qFill.style.width = '0%';
    return;
  }

  qDesc.textContent = `Tuer ${GameState.currentQuest.target}s (${GameState.currentQuest.cur}/${GameState.currentQuest.req})`;
  qFill.style.width = ((GameState.currentQuest.cur / GameState.currentQuest.req) * 100) + '%';
}

// ==================== INJECT DOM ELEMENTS ====================
function injectDOM() {
  // Pause Menu
  if (!document.getElementById('pauseMenu')) {
    const pm = document.createElement('div');
    pm.id = 'pauseMenu';
    pm.innerHTML = `
      <h1>PAUSE</h1>
      <button onclick="resumeGame()"><i class="fa-solid fa-play"></i> REPRENDRE</button>
      <button onclick="openOptions()"><i class="fa-solid fa-gear"></i> OPTIONS</button>
      <button onclick="location.reload()"><i class="fa-solid fa-house"></i> MENU PRINCIPAL</button>
    `;
    document.body.appendChild(pm);
  }

  // Progression container host
  if (!document.getElementById('progressionUI')) {
    const pu = document.createElement('div');
    pu.id = 'progressionUI';
    document.body.appendChild(pu);
  }

  // Level Up UI
  if (!document.getElementById('lvlUp')) {
    const lu = document.createElement('div');
    lu.id = 'lvlUp';
    lu.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:200;flex-direction:column;align-items:center;justify-content:center;backdrop-filter:blur(5px);';
    lu.innerHTML = `
      <h2 style="color:#ffd700;font-family:'Cinzel',serif;font-size:3em;margin-bottom:30px;text-shadow:0 0 10px #ffaa00;text-transform:uppercase;">Niveau Supérieur !</h2>
      <div id="upCards" style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center;"></div>
      <div style="margin-top:30px;display:flex;gap:20px;align-items:center;">
        <button id="confirmUpgradeBtn" class="gal-btn" style="display:none;width:200px;background:#d0a030;color:#000;border-color:#ffd700;">CONFIRMER</button>
      </div>
      <div style="margin-top:20px;color:#aaa;">
        <label style="cursor:pointer;font-family:sans-serif;font-size:14px;"><input type="checkbox" id="autoUpCheck" onchange="toggleAutoUp(this.checked)"> Auto-Upgrade (Aléatoire)</label>
      </div>
    `;
    document.body.appendChild(lu);
    document.getElementById('confirmUpgradeBtn').onclick = confirmUpgrade;
  }

  // If lvlUp already comes from index.html, ensure confirm button exists.
  const existingLvlUp = document.getElementById('lvlUp');
  if (existingLvlUp && !document.getElementById('confirmUpgradeBtn')) {
    const controls = document.createElement('div');
    controls.style.cssText = 'margin-top:30px;display:flex;gap:20px;align-items:center;justify-content:center;';
    controls.innerHTML = '<button id="confirmUpgradeBtn" class="gal-btn" style="display:none;width:200px;background:#d0a030;color:#000;border-color:#ffd700;">CONFIRMER</button>';
    existingLvlUp.appendChild(controls);
  }
  const confirmBtn = document.getElementById('confirmUpgradeBtn');
  if (confirmBtn) confirmBtn.onclick = confirmUpgrade;

  // Card Preview Overlay
  if (!document.getElementById('cardPreviewOverlay')) {
    const cpo = document.createElement('div');
    cpo.id = 'cardPreviewOverlay';
    cpo.style.cssText = 'display:none;position:fixed;inset:0;z-index:500;background:rgba(0,0,0,0.9);flex-direction:column;align-items:center;justify-content:center;';
    cpo.innerHTML = `
      <div id="cardPreviewBox" style="width:80%;height:80%;border:2px solid #4a3a2a;background:radial-gradient(circle, #2a201a 0%, #000 100%);position:relative;display:flex;align-items:center;justify-content:center;">
          <button onclick="closeCardPreview()" style="position:absolute;top:10px;right:10px;background:none;border:none;color:#fff;font-size:32px;cursor:pointer;z-index:601;"><i class="fa-solid fa-xmark"></i></button>
          <div id="cardPreviewContent" style="width:100%;height:100%;"></div>
          <div id="cardPreviewInfo" style="position:absolute;bottom:40px;left:0;right:0;text-align:center;color:#e0c080;font-family:'Cinzel',serif;text-shadow:0 2px 4px #000;pointer-events:none;font-size:24px;z-index:601;"></div>
      </div>
    `;
    document.body.appendChild(cpo);
  }

  // Add Skills HUD (Cooldowns)
  if (!document.getElementById('skillsHUD')) {
      const sk = document.createElement('div');
      sk.id = 'skillsHUD';
      sk.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:20px;z-index:100;pointer-events:none;';
      sk.innerHTML = `
          <style>
              .skill-slot { width: 60px; height: 60px; background: rgba(0,0,0,0.6); border: 2px solid #444; border-radius: 8px; position: relative; display: flex; align-items: center; justify-content: center; font-size: 28px; color: #fff; transition: border-color 0.2s; }
              .skill-slot.ready { border-color: #ffd700; box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
              .skill-key { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 12px; color: #ccc; white-space: nowrap; text-shadow: 1px 1px 0 #000; font-family: sans-serif; font-weight: bold; }
              .skill-cd-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.85); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; color: #ff4444; transition: height 0.1s linear; overflow: hidden; height: 0%; }
              .skill-icon { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
          </style>
          <div class="skill-slot" id="skillSpecial">
              <div class="skill-key">A / CLIC G</div>
              <div class="skill-icon"><i class="fa-solid fa-star"></i></div>
              <div class="skill-cd-overlay" id="cdSpecial"></div>
          </div>
          <div class="skill-slot" id="skillDash">
              <div class="skill-key">E / CLIC D</div>
              <div class="skill-icon"><i class="fa-solid fa-person-running"></i></div>
              <div class="skill-cd-overlay" id="cdDash"></div>
          </div>
      `;
      document.body.appendChild(sk);
  }

  // Add Progression Button to Main Menu
  const galBtn = document.getElementById('galleryBtn');
  if (galBtn && !document.getElementById('menuGrid')) {
    const grid = document.createElement('div');
    grid.id = 'menuGrid';
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;max-width:600px;margin:10px auto;';
    
    galBtn.parentNode.insertBefore(grid, galBtn);
    grid.appendChild(galBtn);
    
    galBtn.style.width = '100%';
    galBtn.style.margin = '0';
    galBtn.innerHTML = '<i class="fa-solid fa-book"></i> CODEX';

    const progBtn = document.createElement('button');
    progBtn.className = 'gal-btn';
    progBtn.id = 'progressionBtn';
    progBtn.style.width = '100%';
    progBtn.style.margin = '0';
    progBtn.innerHTML = '<i class="fa-solid fa-chart-line"></i> PROGRESSION';
    progBtn.onclick = openProgression;
    grid.appendChild(progBtn);

    // Add Market Button (Merged Upgrades & Shop)
    const marketBtn = document.createElement('button');
    marketBtn.className = 'gal-btn';
    marketBtn.id = 'marketBtn';
    marketBtn.style.width = '100%';
    marketBtn.style.margin = '0';
    marketBtn.innerHTML = '<i class="fa-solid fa-shop"></i> MARCHÉ';
    marketBtn.onclick = openMarket;
    grid.appendChild(marketBtn);

    // Add Options Button
    const optBtn = document.createElement('button');
    optBtn.className = 'gal-btn';
    optBtn.id = 'optBtn';
    optBtn.style.width = '100%';
    optBtn.style.margin = '0';
    optBtn.innerHTML = '<i class="fa-solid fa-gear"></i> OPTIONS';
    optBtn.onclick = openOptions;
    grid.appendChild(optBtn);

    // Add Cheat Button (Temporary)
    const cheatBtn = document.createElement('button');
    cheatBtn.className = 'gal-btn';
    cheatBtn.style.width = '100%';
    cheatBtn.style.margin = '0';
    cheatBtn.style.borderColor = '#00ff00';
    cheatBtn.style.color = '#00ff00';
    cheatBtn.innerHTML = '<i class="fa-solid fa-money-bill"></i> +10k OR';
    cheatBtn.onclick = function() {
        GameState.saveData.money = (GameState.saveData.money || 0) + 10000;
        localStorage.setItem('dw_save', JSON.stringify(GameState.saveData));
        alert("10000 pièces ajoutées !");
    };
    grid.appendChild(cheatBtn);

    // Add Modifiers
    const modDiv = document.createElement('div');
    modDiv.style.cssText = 'grid-column: 1 / -1; display:flex; justify-content:center; gap:15px; margin-top:10px; background:rgba(0,0,0,0.4); padding:8px; border-radius:4px; color:#ccc; font-size:12px; font-family:sans-serif;';
    
    const mods = [
        {id:'mod_x2', icon:'fa-bolt', txt:'Vitesse x2'},
        {id:'mod_hc', icon:'fa-skull', txt:'Hardcore'},
        {id:'mod_chaos', icon:'fa-shuffle', txt:'Chaos'}
    ];
    
    mods.forEach(m => {
        const l = document.createElement('label');
        l.style.cursor = 'pointer';
        l.style.display = 'flex';
        l.style.alignItems = 'center';
        l.style.gap = '5px';
        l.innerHTML = `<input type="checkbox" id="${m.id}"> <span><i class="fa-solid ${m.icon}"></i> ${m.txt}</span>`;
        modDiv.appendChild(l);
    });
    grid.appendChild(modDiv);

    // Add View Toggle Button (HUD)
    const viewBtn = document.createElement('div');
    viewBtn.id = 'viewBtn';
    viewBtn.style.cssText = 'position:absolute;top:10px;right:10px;width:40px;height:40px;background:rgba(0,0,0,0.5);border:1px solid #fff;border-radius:4px;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;pointer-events:auto;z-index:100;font-size:20px;';
    viewBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    viewBtn.title = "Changer de vue (V)";
    viewBtn.onclick = function(e) {
        if(GameState.gameRunning) { GameState.thirdPerson = !GameState.thirdPerson; addNotif(GameState.thirdPerson ? "Vue: 3ème Personne" : "Vue: 1ère Personne", "#ffffff"); }
    };
    document.body.appendChild(viewBtn);
  }
}
window.injectDOM = injectDOM;

window.resumeGame = function() {
  GameState.paused = false;
  document.getElementById('pauseMenu').style.display = 'none';
  document.getElementById('hud').style.display = 'block';
  const cv = document.getElementById('main');
  cv.requestPointerLock();
};

// Options subsystem moved to ui-options.js

// Progression logic moved to ui-progression.js

// ==================== GALLERY ====================
// Gallery subsystem moved to ui-gallery.js

function showGalCat(cat, btn) {
  if (btn) {
    document.querySelectorAll('.gal-cats .gal-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const lst = document.getElementById('galList');
  lst.innerHTML = '';

  if (cat === 'classes') {
    CLASSES.forEach((c, i) => {
      const el = document.createElement('div');
      el.className = 'gal-item';
      el.innerHTML = `<span>${c.name}</span>`;
      el.onclick = () => {
        previewEntity('class', i);
        document.querySelectorAll('.gal-item').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
      };
      lst.appendChild(el);
    });
    previewEntity('class', 0);
  } else if (cat === 'biomes') {
    BIOMES.forEach((b, i) => {
      const el = document.createElement('div');
      el.className = 'gal-item';
      el.innerHTML = `<span>${b.name}</span>`;
      el.onclick = () => {
        previewEntity('biome', i);
        document.querySelectorAll('.gal-item').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
      };
      lst.appendChild(el);
    });
    previewEntity('biome', 0);
  } else if (cat === 'upgrades') {
    UPGRADES.forEach((u, i) => {
      const el = document.createElement('div');
      el.className = 'gal-item';
      el.innerHTML = `<span>${u.name}</span>`;
      el.onclick = () => {
        previewEntity('upgrade', i);
        document.querySelectorAll('.gal-item').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
      };
      lst.appendChild(el);
    });
    previewEntity('upgrade', 0);
  } else if (cat === 'enemies') {
    BIOMES.forEach(b => {
      const header = document.createElement('div');
      header.style.cssText = 'padding:4px;background:#3a2a1a;color:#e0c080;font-weight:bold;font-size:10px;margin-top:4px;text-transform:uppercase;';
      header.textContent = b.name;
      lst.appendChild(header);

      b.mobs.forEach(mobName => {
        const idx = MTYPES.findIndex(m => m.name === mobName);
        if (idx !== -1) {
          const m = MTYPES[idx];
          const el = document.createElement('div');
          el.className = 'gal-item';
          el.innerHTML = `<i class="${getMobIcon(m.shape)}" style="width:20px;text-align:center;margin-right:5px;"></i><span>${mobName}</span>`;
          el.onclick = () => {
            previewEntity('enemy', idx);
            document.querySelectorAll('.gal-item').forEach(x => x.classList.remove('selected'));
            el.classList.add('selected');
          };
          lst.appendChild(el);
        }
      });
    });

    const header = document.createElement('div');
    header.style.cssText = 'padding:4px;background:#5a1a1a;color:#ffaa80;font-weight:bold;font-size:10px;margin-top:4px;text-transform:uppercase;';
    header.textContent = 'Bosses';
    lst.appendChild(header);

    const biomeMobs = new Set(BIOMES.flatMap(b => b.mobs));
    MTYPES.forEach((m, i) => {
      if (!biomeMobs.has(m.name)) {
        const el = document.createElement('div');
        el.className = 'gal-item';
        el.innerHTML = `<i class="${getMobIcon(m.shape)}" style="width:20px;text-align:center;margin-right:5px;"></i><span>${m.name}</span>`;
        el.onclick = () => {
          previewEntity('enemy', i);
          document.querySelectorAll('.gal-item').forEach(x => x.classList.remove('selected'));
          el.classList.add('selected');
        };
        lst.appendChild(el);
      }
    });

    const firstMob = MTYPES.findIndex(m => m.name === BIOMES[0].mobs[0]);
    if (firstMob !== -1) previewEntity('enemy', firstMob);
  } else if (cat === 'weapons') {
    const weps = ['sword', 'axe', 'scepter', 'bow', 'daggers', 'hammer', 'spear', 'boomerang', 'scythe', 'katana', 'flail', 'gauntlets', 'grimoire', 'whip', 'cards', 'pistol', 'trident', 'rifle', 'shuriken', 'void_staff', 'fire_staff', 'leaf_blade', 'potion', 'lute', 'wrench', 'javelin', 'crossbow', 'runestone', 'rapier', 'bomb', 'totem', 'claws', 'mace', 'mirror', 'revolver', 'needles', 'lightning_rod', 'ice_bow', 'dagger_sac', 'drill', 'star_globe', 'cleaver', 'balls', 'greatsword', 'rock', 'blowgun', 'greatbow', 'dark_blade', 'sun_staff', 'hourglass'];
    weps.forEach(w => {
      const el = document.createElement('div');
      el.className = 'gal-item';
      el.innerHTML = `<span>${w.toUpperCase()}</span>`;
      el.onclick = () => {
        previewEntity('weapon', w);
        document.querySelectorAll('.gal-item').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
      };
      lst.appendChild(el);
    });
    previewEntity('weapon', 'sword');
  }
}

function previewEntity(type, id) {
  if (!window.galleryPivot) return;
  window.galleryPivot.clear();
  window.galleryPivot.position.set(0, 500, 0);
  const info = document.getElementById('galInfo');

  if (type === 'enemy') {
    const t = MTYPES[id];
    const { g } = buildPuppet(t);
    const box = new THREE.Box3().setFromObject(g);
    const center = box.getCenter(new THREE.Vector3());
    g.position.sub(center);
    window.galleryPivot.add(g);
    info.innerHTML = `<b>${t.name}</b><br>HP: ${t.hp} · DMG: ${t.dmg} · SPD: ${t.spd}`;
  } else if (type === 'class') {
    const c = CLASSES[id];
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x4488ff });
    const headMat = new THREE.MeshLambertMaterial({ color: 0xffccaa });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.6), bodyMat);
    torso.position.y = 1.5;
    g.add(torso);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.6), headMat);
    head.position.y = 2.65;
    g.add(head);
    const wepMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const wep = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 0.15), wepMat);
    wep.position.set(0.7, 1.5, 0);
    g.add(wep);
    const box = new THREE.Box3().setFromObject(g);
    const center = box.getCenter(new THREE.Vector3());
    g.position.sub(center);
    window.galleryPivot.add(g);
    info.innerHTML = `<b>${c.name}</b><br>HP: ${c.hp} · SPD: ${c.spd}<br><i class="${c.icon}"></i> ${c.wep.toUpperCase()}<br><span style="color:#aaa;font-size:10px">${c.desc}</span>`;
  } else if (type === 'biome') {
    const b = BIOMES[id];
    const g = new THREE.Group();
    const groundMat = new THREE.MeshLambertMaterial({ color: b.col });
    const ground = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 4), groundMat);
    ground.position.y = -0.5;
    g.add(ground);
    const fogMat = new THREE.MeshBasicMaterial({ color: b.fog, transparent: true, opacity: 0.5 });
    const fogSphere = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), fogMat);
    fogSphere.position.y = 1;
    g.add(fogSphere);
    const box = new THREE.Box3().setFromObject(g);
    const center = box.getCenter(new THREE.Vector3());
    g.position.sub(center);
    window.galleryPivot.add(g);
    info.innerHTML = `<b>${b.name}</b><br><i class="${b.icon}"></i><br>Difficulté: x${b.diff}<br>Mobs: ${b.mobs.length}`;
  } else if (type === 'upgrade') {
    const u = UPGRADES[id];
    const g = new THREE.Group();
    const upMat = new THREE.MeshLambertMaterial({ color: 0xffaa00 });
    const upBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), upMat);
    g.add(upBox);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.3 });
    const glow = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), glowMat);
    g.add(glow);
    const box = new THREE.Box3().setFromObject(g);
    const center = box.getCenter(new THREE.Vector3());
    g.position.sub(center);
    window.galleryPivot.add(g);
    info.innerHTML = `<b>${u.name}</b><br><i class="${u.icon}"></i><br>Type: ${u.type}`;
  } else {
    const g = buildWeapon3D(id, 10);
    g.scale.set(1.5, 1.5, 1.5);
    window.galleryPivot.add(g);
    info.innerHTML = `<b>${id.toUpperCase()}</b>`;
  }
}

// ==================== MARKET & CASINO ====================
// All market/casino functions moved to ui-market.js
// Includes: openMarket, closeMarket, switchMarketTab, renderUpgrades, buyUpgrade,
// renderShop, buyCosmetic, equipCosmetic, renderCharacterShop, buyCharacter, 
// renderCasino, gambleCoin, gambleSlots, gambleDice, gambleWheel, gambleHL, updateMoneyDisplay

// Export - Core UI functions only
// Functions in other modules: ui-options.js, ui-gallery.js, ui-market.js, ui-hud.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initSelectionUI, updateSelectionInfo, newQuest, updateQuest, updateQuestUI, injectDOM };
}
