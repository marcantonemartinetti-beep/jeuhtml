// ═══════════════════════════════════════════════
// DUNGEON WORLD - UI Functions
// ═══════════════════════════════════════════════

// ==================== HUD STATE ====================
var hudState = { hp: 100, wep: '', score: 0, time: '0:00', dash: false, hit: false, special: false, runWeaponsLine: '', runPassivesLine: '' };
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

  var runWeaponsLine = '';
  var runPassivesLine = '';
  if (GameState && GameState.inventory) {
    var main = Array.isArray(GameState.inventory.mainWeapons) ? GameState.inventory.mainWeapons : [];
    var auto = Array.isArray(GameState.inventory.autoWeapons) ? GameState.inventory.autoWeapons : [];
    var pass = Array.isArray(GameState.inventory.passives) ? GameState.inventory.passives : [];

    var fmtWeaponEntry = function (entry) {
      if (!entry || !entry.id) return '-';
      var def = WEAPONS && WEAPONS[entry.id] ? WEAPONS[entry.id] : null;
      var icon = def && def.icon ? `<i class="${def.icon}"></i> ` : '';
      var lvl = entry.level ? ` L${entry.level}` : '';
      var evo = entry.evolved ? ' *' : '';
      return `${icon}${formatWeaponName(entry.id)}${lvl}${evo}`;
    };

    var fmtPassiveEntry = function (entry) {
      if (!entry || !entry.id) return '-';
      var def = (typeof getPassiveItemDef === 'function') ? getPassiveItemDef(entry.id) : null;
      var icon = def && def.icon ? `<i class="${def.icon}"></i> ` : '';
      var name = def && def.name ? def.name : entry.id;
      var lvl = entry.level ? ` L${entry.level}` : '';
      return `${icon}${name}${lvl}`;
    };

    var activeWeapons = main.filter(function (x) { return !!x; }).map(fmtWeaponEntry);
    var autoWeapons = auto.filter(function (x) { return !!x; }).map(fmtWeaponEntry);
    var passives = pass.filter(function (x) { return !!x; }).map(fmtPassiveEntry);

    var slotsLine = main.map(function (entry, idx) {
      return `<span class="run-slot-tag">${idx + 1}</span> ${entry ? fmtWeaponEntry(entry) : '-'}`;
    }).join(' <span class="run-sep">|</span> ');
    var extras = autoWeapons.length ? autoWeapons.join(' · ') : '';
    var autoState = GameState.autoAttackEnabled === false ? 'OFF' : 'ON';
    var autoColor = GameState.autoAttackEnabled === false ? '#ffb070' : '#8ee7a5';

    runWeaponsLine = `<span style="color:#f0c080">SLOTS:</span> ${slotsLine}`
      + (extras ? ` <span class="run-sep">|</span> <span style="color:#8aa8d8">EXTRA:</span> ${extras}` : '')
      + ` <span class="run-sep">|</span> <span style="color:${autoColor}">AUTO ${autoState}</span> <span style="color:#8a9fb5">(R toggle)</span>`;
    runPassivesLine = `<span style="color:#7ec9ff">NIVEAU:</span> ${Math.max(1, Math.floor(GameState.pLevel || 1))}`
      + ` <span class="run-sep">|</span> <span style="color:#b8d8a8">MODIFICATEURS:</span> ${passives.length ? passives.join(' · ') : '-'}`
      + ` <span class="run-sep">|</span> <span style="color:#ffd37a">NIVEAUX ILLIMITES</span>`;
  }

  if (runWeaponsLine !== hudState.runWeaponsLine) {
    hudState.runWeaponsLine = runWeaponsLine;
    var weaponsEl = document.getElementById('runLoadoutLineWeapons');
    if (weaponsEl) weaponsEl.innerHTML = runWeaponsLine;
  }
  if (runPassivesLine !== hudState.runPassivesLine) {
    hudState.runPassivesLine = runPassivesLine;
    var passivesEl = document.getElementById('runLoadoutLinePassives');
    if (passivesEl) passivesEl.innerHTML = runPassivesLine;
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

// Upgrade, level-up et notifications sont geres par ui-hud.js.

