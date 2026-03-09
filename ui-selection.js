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
    if (typeof GameState.saveData.selectedBiomeId !== 'string') GameState.saveData.selectedBiomeId = 'plains';
    if (typeof GameState.saveData.normalUnlockTier !== 'number') GameState.saveData.normalUnlockTier = 0;
    const money = typeof GameState.saveData.money === 'number' ? GameState.saveData.money : 0;
    const gold = typeof GameState.saveData.gold === 'number' ? GameState.saveData.gold : 0;
    const unified = Math.max(money, gold);
    GameState.saveData.money = unified;
    GameState.saveData.gold = unified;
    if (!Array.isArray(GameState.saveData.unlockedCostumes)) GameState.saveData.unlockedCostumes = ['A'];
    if (!GameState.saveData.unlockedCostumes.includes('A')) GameState.saveData.unlockedCostumes.push('A');
    if (!GameState.saveData.selectedCostume) GameState.saveData.selectedCostume = 'A';
    if (GameState.saveData.selectedCostume === 'B' && !GameState.saveData.unlockedCostumes.includes('B')) {
      GameState.saveData.selectedCostume = 'A';
    }

    // Keep numeric stable class ids synced with legacy string ids.
    if (typeof buildStableClassMaps === 'function') buildStableClassMaps();
    if (typeof migrateClassSaveData === 'function') migrateClassSaveData();
    if (typeof syncNormalClassUnlocksFromProgress === 'function') syncNormalClassUnlocksFromProgress(false);
  } catch (e) {
    console.warn('Menu save hydration failed:', e);
  }
}

function persistMenuSelection() {
  if (!GameState || !GameState.saveData) return;
  const selectedClass = CLASSES[GameState.selCharIdx];
  const selectedBiome = BIOMES[GameState.selMapIdx];
  if (selectedClass && typeof classStableIdMap === 'object' && classStableIdMap[selectedClass.id]) {
    GameState.saveData.selectedClassStableId = classStableIdMap[selectedClass.id];
  }
  if (selectedBiome) GameState.saveData.selectedBiomeId = selectedBiome.id;
  try {
    localStorage.setItem('dw_save', JSON.stringify(GameState.saveData));
  } catch (e) {
    console.warn('Persist menu selection failed:', e);
  }
}

function getClassPowerOrderMap() {
  const map = {};
  if (typeof getNormalClassesByPowerAscending === 'function') {
    getNormalClassesByPowerAscending().forEach((cls, idx) => {
      map[cls.id] = idx;
    });
  }
  return map;
}

function getSelectionClassEntries() {
  const unlocked = Array.isArray(GameState.saveData.unlockedClasses) ? GameState.saveData.unlockedClasses : [];
  const powerOrder = getClassPowerOrderMap();

  return CLASSES
    .map((c, idx) => ({ c, idx, unlocked: unlocked.includes(c.id) }))
    .sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;

      const aHasPower = Object.prototype.hasOwnProperty.call(powerOrder, a.c.id);
      const bHasPower = Object.prototype.hasOwnProperty.call(powerOrder, b.c.id);
      if (aHasPower && bHasPower) return powerOrder[a.c.id] - powerOrder[b.c.id];
      if (aHasPower) return -1;
      if (bHasPower) return 1;

      return a.idx - b.idx;
    });
}

function isCostumeUnlocked(costumeId) {
  const unlocked = GameState.saveData && Array.isArray(GameState.saveData.unlockedCostumes)
    ? GameState.saveData.unlockedCostumes
    : ['A'];
  return unlocked.includes(costumeId);
}

function refreshCostumeButtons() {
  const btnA = document.getElementById('costumeBtnA');
  const btnB = document.getElementById('costumeBtnB');
  if (!btnA || !btnB) return;

  const selected = (GameState.saveData && GameState.saveData.selectedCostume) ? GameState.saveData.selectedCostume : 'A';
  const hasB = isCostumeUnlocked('B');

  btnA.classList.toggle('is-selected', selected === 'A');
  btnB.classList.toggle('is-selected', selected === 'B');
  btnB.disabled = !hasB;
  btnB.innerHTML = hasB ? 'B' : 'B <i class="fa-solid fa-lock"></i>';
}

function selectCostume(costumeId) {
  if (!GameState.saveData) return;
  if (costumeId === 'B' && !isCostumeUnlocked('B')) {
    refreshCostumeButtons();
    return;
  }
  GameState.saveData.selectedCostume = costumeId;
  localStorage.setItem('dw_save', JSON.stringify(GameState.saveData));
  refreshCostumeButtons();
  updateSelectionInfo();
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

  // Restore previous class selection
  const selectedStableClass = (typeof getClassByStableId === 'function')
    ? getClassByStableId(GameState.saveData.selectedClassStableId)
    : null;
  if (selectedStableClass) {
    const selectedIdx = CLASSES.findIndex((cls) => cls.id === selectedStableClass.id);
    if (selectedIdx >= 0) GameState.selCharIdx = selectedIdx;
  }

  // Restore previous stage selection
  if (GameState.saveData.selectedBiomeId) {
    const selectedBiomeIdx = BIOMES.findIndex((b) => b.id === GameState.saveData.selectedBiomeId);
    if (selectedBiomeIdx >= 0) GameState.selMapIdx = selectedBiomeIdx;
  }

  // Initialize character grid
  const charGrid = document.getElementById('charGrid');
  if (!charGrid) return;
  charGrid.innerHTML = '';

  const costumeBtnA = document.getElementById('costumeBtnA');
  const costumeBtnB = document.getElementById('costumeBtnB');
  if (costumeBtnA) costumeBtnA.onclick = () => selectCostume('A');
  if (costumeBtnB) costumeBtnB.onclick = () => selectCostume('B');
  
  const classEntries = getSelectionClassEntries();
  classEntries.forEach(({ c, idx: classIndex, unlocked: isUnlocked }) => {
    const el = document.createElement('div');
    el.className = 'char-card' + (classIndex === GameState.selCharIdx ? ' selected' : '');
    el.dataset.classIndex = String(classIndex);
    
    const isLocked = !isUnlocked;
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
      GameState.selCharIdx = classIndex;
      document.querySelectorAll('.char-card').forEach((x) => {
        x.classList.toggle('selected', Number(x.dataset.classIndex) === classIndex);
      });
      persistMenuSelection();
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
      persistMenuSelection();
      updateSelectionInfo();
    };
    
    stageGrid.appendChild(el);
  });
  
  updateSelectionInfo();
  persistMenuSelection();
  refreshCostumeButtons();
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
  const weaponNameEl = document.getElementById('pWeaponName');
  if (weaponNameEl) weaponNameEl.textContent = c.wep.toUpperCase();
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
    } else if (typeof isNormalPlayableClass === 'function' && isNormalPlayableClass(c) && typeof getNormalClassUnlockBiome === 'function') {
      const reqBiome = getNormalClassUnlockBiome(c.id);
      unlockText.textContent = reqBiome
        ? `Condition de deblocage: Terminer ${reqBiome.name}`
        : 'Condition de deblocage: Progression des biomes';
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
  
  try {
    renderCharacterPreview(c);
  } catch (err) {
    console.warn('renderCharacterPreview failed:', err);
  }
  try {
    renderStagePreview(b);
  } catch (err) {
    console.warn('renderStagePreview failed:', err);
  }
  refreshCostumeButtons();
}

// ==================== 3D PREVIEW RENDERING ====================
let previewScenes = { char: null, stage: null };
let previewCameras = { char: null, stage: null };
let previewRenderers = { char: null, stage: null };
let previewModels = { char: null, stage: null };
let previewCharAnim = { parts: null, typeData: null, t: 0 };
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
    previewModels.char.rotation.y = 0;
    if (previewCharAnim.parts && typeof animPuppet === 'function') {
      previewCharAnim.t += 0.03;
      const td = previewCharAnim.typeData || { S: 1, shape: 'human' };
      animPuppet(previewCharAnim.parts, previewCharAnim.t, true, td.S || 1, td.shape || 'human');
    }
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
  previewCharAnim.parts = pm && pm.parts ? pm.parts : null;
  previewCharAnim.typeData = pm && pm.typeData ? pm.typeData : { S: 1, shape: 'human' };
  previewCharAnim.t = 0;

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

