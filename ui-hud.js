// ═══════════════════════════════════════════════
// DUNGEON WORLD - HUD & UPGRADES SYSTEM
// ═══════════════════════════════════════════════

// ==================== HUD STATE ====================
var selectedUpgradeData = null;
var selectedUpgradeId = null;

// ==================== UPGRADES HUD ====================
function updateUpgradesHUD() {
  const container = document.getElementById('upgrades-display');
  if (!container) return;
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
  const notifContainer = document.getElementById('notifs');
  if (notifContainer) {
      notifContainer.appendChild(d);
      setTimeout(() => d.remove(), 3000);
  }
}

let flashT;
function flashDmg() {
  const e = document.getElementById('dmgfl');
  if (e) {
      e.style.opacity = '1';
      clearTimeout(flashT);
      flashT = setTimeout(() => e.style.opacity = '0', 200);
  }
}

// ==================== UPGRADE SELECTION ====================
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
        if (typeof syncLegacyWeaponActivationFromInventory === 'function') {
          syncLegacyWeaponActivationFromInventory();
        }
        if (!selectedUpgradeData._skipLegacyTrack && selectedUpgradeId) {
          GameState.playerUpgrades[selectedUpgradeId] = (GameState.playerUpgrades[selectedUpgradeId] || 0) + 1;
        }
        updateUpgradesHUD();
        const pending = Math.max(0, (GameState.pendingBossChestUpgrades || 0) - 1);
        GameState.pendingBossChestUpgrades = pending;
        GameState.levelingUp = false;
        const lvlUpUI = document.getElementById('lvlUp');
        if (lvlUpUI) lvlUpUI.style.display = 'none';
        if (renderer && renderer.domElement) renderer.domElement.requestPointerLock();
        if (pending > 0) {
          setTimeout(() => {
            if (typeof showLevelUp === 'function') showLevelUp();
          }, 0);
        }
    }
};

// ==================== UPGRADE POOL HELPERS ====================
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
    return !!u.req(WEAPONS.SCEPTER);
  } catch (e) {
    return false;
  }
}

function getLevelUpChoices(count) {
  const wanted = Math.max(1, Number(count) || 3);
  try {
    if (typeof buildLoadoutLevelUpOptions === 'function') {
      const modern = buildLoadoutLevelUpOptions(wanted);
      if (Array.isArray(modern) && modern.length) {
        return modern.map((choice) => ({
          id: choice.id,
          name: choice.name,
          icon: choice.icon || 'fa-solid fa-star',
          type: choice.type || 'loadout',
          desc: choice.desc || '',
          descHtml: String(choice.desc || '').replace(/\n/g, '<br>'),
          apply: choice.apply,
          rarityClass: (choice.weight || 0) >= 95 ? 'legendary' : ((choice.weight || 0) >= 70 ? 'rare' : 'common'),
          rarityName: (choice.weight || 0) >= 95 ? 'Mythique' : ((choice.weight || 0) >= 70 ? 'Rare' : 'Commun'),
          _skipLegacyTrack: true
        }));
      }
    }
  } catch (e) {
    console.warn('buildLoadoutLevelUpOptions failed, fallback to legacy pool:', e);
  }

  // Legacy fallback for compatibility if loadout module is unavailable.
  const legacyPool = UPGRADES.filter(canUseUpgrade).concat(getWeaponPathUpgrades().filter(canUseUpgrade));
  const out = [];
  for (let i = 0; i < wanted && legacyPool.length > 0; i++) {
    const u = legacyPool[Math.floor(Math.random() * legacyPool.length)];
    const r = Math.random();
    let rarity = RARITIES.common;
    if (r > 0.9) rarity = RARITIES.legendary;
    else if (r > 0.6) rarity = RARITIES.rare;
    const scaled = u.scale(rarity.m);
    out.push({
      id: u.id,
      name: u.name,
      icon: u.icon,
      type: u.type,
      desc: scaled.desc,
      descHtml: String(scaled.desc || '').replace(/\n/g, '<br>'),
      apply: scaled.apply,
      rarityClass: rarity.c,
      rarityName: rarity.n,
      _skipLegacyTrack: false
    });
  }
  return out;
}

// ==================== LEVEL UP SCREEN ====================
function showLevelUp() {
  if (GameState.autoUpgrade) {
    const choices = getLevelUpChoices(3);
    if (choices.length > 0) {
      const pick = choices[Math.floor(Math.random() * choices.length)];
      pick.apply();
      if (typeof syncLegacyWeaponActivationFromInventory === 'function') {
        syncLegacyWeaponActivationFromInventory();
      }
      if (!pick._skipLegacyTrack && pick.id) {
        GameState.playerUpgrades[pick.id] = (GameState.playerUpgrades[pick.id] || 0) + 1;
      }
      updateUpgradesHUD();
      addNotif(`AUTO: ${pick.name} (${pick.rarityName || 'Choix'})`, '#ffff00');
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
  
  let ui = document.getElementById('lvlUp');
  if (!ui) { injectDOM(); ui = document.getElementById('lvlUp'); }
  
  if (ui) {
      ui.style.display = 'flex';
      const upCheck = document.getElementById('autoUpCheck');
      if (upCheck) upCheck.checked = GameState.autoUpgrade;
  }
  
  selectedUpgradeData = null;
  selectedUpgradeId = null;
  const btn = document.getElementById('confirmUpgradeBtn');
  if(btn) btn.style.display = 'none';
  
  rerollUpgrades();
}

function rerollUpgrades() {
  const c = document.getElementById('upCards');
  if (!c) return;
  c.innerHTML = '';
  const choices = getLevelUpChoices(3);

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];

    const el = document.createElement('div');
    el.className = `card ${choice.rarityClass || 'common'}`;
    el.style.cssText = 'width:200px;height:280px;background:#1a1a1a;border:2px solid #444;border-radius:8px;padding:15px;cursor:pointer;transition:transform 0.2s;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.5);color:#eee;font-family:sans-serif;';
    if(choice.rarityClass === 'rare') el.style.borderColor = '#4488ff';
    if(choice.rarityClass === 'legendary') el.style.borderColor = '#ffaa00';
    el.onmouseenter = () => el.style.transform = 'scale(1.05)';
    el.onmouseleave = () => el.style.transform = 'scale(1)';
    el.dataset.borderColor = el.style.borderColor;

    el.innerHTML = `
      <div class="c-type">${choice.type || 'loadout'}</div>
      <div class="c-rarity">${choice.rarityName || 'Choix'}</div>
      <div class="c-icon"><i class="${choice.icon || 'fa-solid fa-star'}"></i></div>
      <div class="c-name">${choice.name}</div>
      <div class="c-desc">${choice.descHtml || choice.desc || ''}</div>
    `;
    el.onclick = () => selectUpgrade({ apply: choice.apply, _skipLegacyTrack: !!choice._skipLegacyTrack }, choice.id, el);
    c.appendChild(el);
  }
}

// ==================== UPGRADES MENU (PAUSE) ====================
window.openUpgrades = function() {
    if (window.event) window.event.stopPropagation();
    document.getElementById('pauseMenu').style.display = 'none';
    let ui = document.getElementById('upgradesUI');
    if (!ui) {
        ui = document.createElement('div');
        ui.id = 'upgradesUI';
        ui.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:300;flex-direction:column;align-items:center;padding:20px;overflow-y:auto;';
        document.body.appendChild(ui);
    }
    ui.style.display = 'flex';
    renderPauseUpgrades();
};

window.closeUpgrades = function() {
    const ui = document.getElementById('upgradesUI');
    if (ui) ui.style.display = 'none';
    const pm = document.getElementById('pauseMenu');
    if (pm) pm.style.display = 'flex';
};

window.renderPauseUpgrades = function() {
    const ui = document.getElementById('upgradesUI');
    if (!ui) return;
    
    ui.innerHTML = `
        <h2 style="color:#ffd700;font-family:'Cinzel',serif;margin-bottom:20px;">AMÉLIORATIONS</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:15px;width:100%;max-width:1000px;margin-bottom:30px;">
    `;
    
    const upgContainer = document.createElement('div');
    upgContainer.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:15px;width:100%;max-width:1000px;';
    
    for (const id in GameState.playerUpgrades) {
        const upgrade = UPGRADES.find(u => u.id === id);
        if (upgrade) {
            const count = GameState.playerUpgrades[id];
            const el = document.createElement('div');
            el.style.cssText = 'background:#1a1a1a;border:1px solid #444;border-radius:4px;padding:10px;text-align:center;color:#eee;';
            el.innerHTML = `
                <div style="font-size:24px;margin-bottom:5px;"><i class="${upgrade.icon}"></i></div>
                <div style="font-weight:bold;font-size:12px;margin-bottom:3px;">${upgrade.name}</div>
                <div style="color:#aaa;font-size:10px;">x${count}</div>
            `;
            upgContainer.appendChild(el);
        }
    }
    
    ui.innerHTML += `</div>` + upgContainer.innerHTML + `
        <button class="gal-btn" onclick="closeUpgrades()" style="width:200px;margin-top:20px;">RETOUR</button>
    `;
};
