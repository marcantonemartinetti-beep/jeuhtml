// ═══════════════════════════════════════════════
// DUNGEON WORLD - UI Progression Module
// ═══════════════════════════════════════════════

function renderMobCardPortrait(canvas, mobType) {
  if (!canvas || !mobType) return;

  // Clear previous renderer if this card is re-rendered.
  const parent = canvas.parentElement;
  if (parent && parent._cardRenderer) {
    try { parent._cardRenderer.dispose(); } catch(e) {}
  }

  // Recreate the exact same card stack as MobCardDrop (back/face/title/model).
  const scene = new THREE.Scene();
  scene.background = null;

  const width = canvas.width || 80;
  const height = canvas.height || 80;

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 3.2);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);

  const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(1, 1, 3);
  scene.add(dirLight);

  try {
    const back = mkSprite(0x2a2018, 1.0, 1.35, 'box');
    scene.add(back);

    const face = mkSprite(0xe9d9b8, 0.9, 1.22, 'box');
    face.position.z = 0.01;
    scene.add(face);

    const titleBar = mkSprite((mobType && mobType.C) ? mobType.C : 0x777777, 0.9, 0.18, 'box');
    titleBar.position.set(0, 0.52, 0.02);
    scene.add(titleBar);

    const built = buildPuppet(mobType);
    if (built && built.g) {
      const modelWrap = new THREE.Group();
      modelWrap.position.set(0, -0.02, 0.03);

      const model = built.g;
      model.scale.setScalar(0.21 / Math.max(0.55, mobType.S || 1));
      model.rotation.y = Math.PI;

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -center.y, -center.z);

      modelWrap.add(model);
      scene.add(modelWrap);
    }
  } catch(e) {
    // Keep card visible even if one mob model fails.
  }

  renderer.setClearColor(0x000000, 0);
  renderer.render(scene, camera);

  if (parent) parent._cardRenderer = renderer;
}

function disposeProgressionCardRenderers(container) {
  if (!container || typeof container.querySelectorAll !== 'function') return;
  const cards = container.querySelectorAll('.mob-card');
  cards.forEach((card) => {
    if (card && card._cardRenderer) {
      try { card._cardRenderer.dispose(); } catch (e) {}
      card._cardRenderer = null;
    }
  });
}

window.openProgression = function() {
  if (window.event) window.event.stopPropagation();
  if (!document.getElementById('progressionUI')) injectDOM();

  // Hide other menus
  document.getElementById('selContainer').style.display = 'none';
  document.getElementById('startBtn').style.display = 'none';
  document.querySelector('.ctrl').style.display = 'none';
  const mg = document.getElementById('menuGrid');
  if (mg) mg.style.display = 'none';
  else {
    document.getElementById('galleryBtn').style.display = 'none';
  }
  document.getElementById('pauseMenu').style.display = 'none';

  document.getElementById('progressionUI').style.display = 'flex';

  const totalClasses = CLASSES.length;
  const unlockedClasses = GameState.saveData.unlockedClasses.length;
  const totalBiomes = BIOMES.length;
  const unlockedBiomes = GameState.saveData.unlockedBiomes.length;
  const totalCards = MTYPES.length;
  const cardCounts = Object.create(null);
  (GameState.saveData.cards || []).forEach(name => {
    cardCounts[name] = (cardCounts[name] || 0) + 1;
  });
  const collectedCards = Object.keys(cardCounts).length;

  const globalPct = Math.floor(((unlockedClasses + unlockedBiomes) / (totalClasses + totalBiomes)) * 100);

  const ui = document.getElementById('progressionUI');
  disposeProgressionCardRenderers(ui);
  ui.innerHTML = `
    <div class="prog-header">
      <h2>PROGRESSION</h2>
      <div class="global-prog">
        <span>COMPLÉTION GLOBALE</span>
        <div class="prog-bar"><div class="prog-fill" style="width: ${globalPct}%"></div></div>
        <span>${globalPct}%</span>
      </div>
    </div>

    <div class="prog-content">
      <div class="prog-section">
        <h3>PERSONNAGES <span>${unlockedClasses}/${totalClasses}</span></h3>
        <div class="unlock-list" id="progClasses"></div>
      </div>

      <div class="prog-section">
        <h3>MONDES <span>${unlockedBiomes}/${totalBiomes}</span></h3>
        <div class="unlock-list" id="progBiomes"></div>
      </div>

      <div class="prog-section">
        <h3>COLLECTION DE CARTES (BONUS) <span>${collectedCards}/${totalCards}</span></h3>
        <div id="progCardsContainer"></div>
      </div>
    </div>

    <div style="display:flex; gap:10px; justify-content:center; margin-bottom:20px; flex-wrap:wrap; width: 80%; max-width: 1000px; margin: 0 auto 20px auto;">
        <button class="gal-btn" onclick="exportSave()">EXPORTER</button>
        <button class="gal-btn" onclick="document.getElementById('importFile').click()">IMPORTER</button>
        <input type="file" id="importFile" style="display:none" onchange="importSave(this)">
        <button class="gal-btn" onclick="deleteData(this)" style="border-color:#d03030; color:#d03030;">RÉINITIALISER</button>
        <button class="gal-btn" onclick="unlockAll(this)" style="border-color:#f0a030; color:#f0a030;">TOUT DÉBLOQUER</button>
    </div>

    <button class="gal-btn" onclick="closeProgression()" style="margin: 0 auto; display: block; width: 200px;">RETOUR</button>
  `;

  // Populate Lists
  const cList = document.getElementById('progClasses');
  CLASSES.forEach(c => {
    const unlocked = GameState.saveData.unlockedClasses.includes(c.id);
    cList.innerHTML += `<div class="unlock-item ${unlocked?'unlocked':''}"><i class="${c.icon}"></i> ${c.name} ${unlocked?'':'<i class="fa-solid fa-lock" style="margin-left:auto"></i>'}</div>`;
  });

  const bList = document.getElementById('progBiomes');
  const getCardTier = (mob) => {
    if (!mob) return { label: 'COMMUNE', col: '#7f8b9a' };
    if (mob.boss) return { label: 'BOSS', col: '#ff9a3d' };
    if ((mob.hp || 0) >= 250 || (mob.dmg || 0) >= 35) return { label: 'EPIC', col: '#d26dff' };
    if ((mob.hp || 0) >= 140 || (mob.dmg || 0) >= 22) return { label: 'RARE', col: '#63b6ff' };
    return { label: 'COMMUNE', col: '#7f8b9a' };
  };

  BIOMES.forEach(b => {
    const unlocked = GameState.saveData.unlockedBiomes.includes(b.id);
    bList.innerHTML += `<div class="unlock-item ${unlocked?'unlocked':''}"><i class="${b.icon}"></i> ${b.name} ${unlocked?'':'<i class="fa-solid fa-lock" style="margin-left:auto"></i>'}</div>`;
  });

  const cardContainer = document.getElementById('progCardsContainer');

  // Iterate biomes to group cards
  BIOMES.forEach(b => {
    if (b.id === 'omega') return; // Handle Omega separately

    const biomeSection = document.createElement('div');
    biomeSection.style.marginBottom = '25px';

    const header = document.createElement('h4');
    header.style.cssText = 'color:#e0c080; font-family:"Cinzel",serif; font-size:14px; border-bottom:1px solid #333; padding-bottom:5px; margin-bottom:10px; text-transform:uppercase;';
    header.innerHTML = `<i class="${b.icon}"></i> ${b.name}`;
    biomeSection.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'card-grid';

    const mobs = [...b.mobs];
    if (b.boss) mobs.push(b.boss);

    let hasCards = false;
    mobs.forEach(mobName => {
      const m = MTYPES.find(x => x.name === mobName);
      if (m) {
        hasCards = true;
        const copies = cardCounts[m.name] || 0;
        const collected = copies > 0;
        const tier = getCardTier(m);

        const el = document.createElement('div');
        el.className = `mob-card ${collected?'collected':''}`;
        el.style.borderColor = collected ? tier.col : '#444';
        el.style.background = collected
          ? `linear-gradient(160deg, rgba(20,20,20,0.92), ${tier.col}1f)`
          : 'rgba(20,20,20,0.6)';

        // Create card content with 3D model or placeholder
        const tierDiv = `<div class="mob-tier" style="color:${collected ? tier.col : '#777'}">${collected ? tier.label : 'INCONNUE'}</div>`;
        const copiesDiv = collected ? `<div class="mob-new">x${copies}</div>` : '';
        const nameDiv = `<div class="mob-name">${collected ? m.name : '???'}</div>`;

        if (collected) {
          // Create canvas for 3D model
          el.innerHTML = tierDiv + copiesDiv;
          const canvas = document.createElement('canvas');
          canvas.width = 80;
          canvas.height = 80;
          canvas.style.cssText = 'margin: 8px auto; display: block;';
          el.appendChild(canvas);
          const nameNode = document.createElement('div');
          nameNode.className = 'mob-name';
          nameNode.textContent = m.name;
          el.appendChild(nameNode);

          // Render 3D model to canvas
          setTimeout(() => renderMobCardPortrait(canvas, m), 0);
        } else {
          // Locked card
          const icon = 'fa-solid fa-question';
          el.innerHTML = `${tierDiv}${copiesDiv}<i class="${icon}"></i>${nameDiv}`;
        }

        if (collected) {
          el.onclick = () => {
            document.querySelectorAll('.mob-card').forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');

            const overlay = document.getElementById('cardPreviewOverlay');
            const content = document.getElementById('cardPreviewContent');
            const info = document.getElementById('cardPreviewInfo');
            overlay.style.display = 'flex';

            window.previewTarget = content;
            previewEntity('enemy', MTYPES.indexOf(m));
            info.innerHTML = `<b>${m.name}</b><br><span style="font-size:18px">HP: ${m.hp} · DMG: ${m.dmg} · SPD: ${m.spd}</span>`;
          };
        }

        grid.appendChild(el);
      }
    });

    if (hasCards) {
      biomeSection.appendChild(grid);
      cardContainer.appendChild(biomeSection);
    }
  });

  // Special case for Omega / Final Bosses
  const omega = BIOMES.find(b => b.id === 'omega');
  if (omega) {
    const biomeSection = document.createElement('div');
    biomeSection.style.marginBottom = '25px';
    const header = document.createElement('h4');
    header.style.cssText = 'color:#e0c080; font-family:"Cinzel",serif; font-size:14px; border-bottom:1px solid #333; padding-bottom:5px; margin-bottom:10px; text-transform:uppercase;';
    header.innerHTML = `<i class="${omega.icon}"></i> ${omega.name}`;
    biomeSection.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'card-grid';

    // Add Adam and any other final bosses found in MTYPES
    ['Adam', 'L\'Ultime'].forEach(mobName => {
      const m = MTYPES.find(x => x.name === mobName);
      if (m) {
        const copies = cardCounts[m.name] || 0;
        const collected = copies > 0;
        const tier = getCardTier(m);

        const el = document.createElement('div');
        el.className = `mob-card ${collected?'collected':''}`;
        el.style.borderColor = collected ? tier.col : '#444';
        el.style.background = collected
          ? `linear-gradient(160deg, rgba(20,20,20,0.92), ${tier.col}1f)`
          : 'rgba(20,20,20,0.6)';

        // Create card content with 3D model or placeholder
        const tierDiv = `<div class="mob-tier" style="color:${collected ? tier.col : '#777'}">${collected ? tier.label : 'INCONNUE'}</div>`;
        const copiesDiv = collected ? `<div class="mob-new">x${copies}</div>` : '';
        const nameDiv = `<div class="mob-name">${collected ? m.name : '???'}</div>`;

        if (collected) {
          // Create canvas for 3D model
          el.innerHTML = tierDiv + copiesDiv;
          const canvas = document.createElement('canvas');
          canvas.width = 80;
          canvas.height = 80;
          canvas.style.cssText = 'margin: 8px auto; display: block;';
          el.appendChild(canvas);
          const nameNode = document.createElement('div');
          nameNode.className = 'mob-name';
          nameNode.textContent = m.name;
          el.appendChild(nameNode);

          // Render 3D model to canvas
          setTimeout(() => renderMobCardPortrait(canvas, m), 0);
        } else {
          // Locked card
          const icon = 'fa-solid fa-question';
          el.innerHTML = `${tierDiv}${copiesDiv}<i class="${icon}"></i>${nameDiv}`;
        }

        if (collected) {
          el.onclick = () => {
            document.querySelectorAll('.mob-card').forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');

            const overlay = document.getElementById('cardPreviewOverlay');
            const content = document.getElementById('cardPreviewContent');
            const info = document.getElementById('cardPreviewInfo');
            overlay.style.display = 'flex';

            window.previewTarget = content;
            previewEntity('enemy', MTYPES.indexOf(m));
            info.innerHTML = `<b>${m.name}</b><br><span style="font-size:18px">HP: ${m.hp} · DMG: ${m.dmg} · SPD: ${m.spd}</span>`;
          };
        }
        grid.appendChild(el);
      }
    });

    if (grid.children.length > 0) {
      biomeSection.appendChild(grid);
      cardContainer.appendChild(biomeSection);
    }
  }
};

window.closeCardPreview = function() {
  const overlay = document.getElementById('cardPreviewOverlay');
  if (overlay) overlay.style.display = 'none';
  window.previewTarget = null;
  const cv = document.getElementById('main');
  if (cv) {
    cv.style.zIndex = '';
    cv.style.pointerEvents = '';
  }
};

window.exportSave = function() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(GameState.saveData));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "dungeon_world_save.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

window.importSave = function(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data && data.wins) {
        GameState.saveData = data;
        localStorage.setItem('dw_save', JSON.stringify(data));
        alert("Sauvegarde importée !");
        location.reload();
      } else {
        alert("Fichier invalide.");
      }
    } catch (err) {
      alert("Erreur de lecture.");
    }
  };
  reader.readAsText(file);
};

window.deleteData = function(btn) {
  if (btn.dataset.confirm === "true") {
    localStorage.removeItem('dw_save');
    location.reload();
  } else {
    btn.dataset.confirm = "true";
    const originalText = btn.innerHTML;
    btn.innerHTML = "SÛR ?";
    btn.style.background = "#d03030";
    btn.style.color = "#fff";
    setTimeout(() => {
      btn.dataset.confirm = "false";
      btn.innerHTML = originalText;
      btn.style.background = "";
      btn.style.color = "#d03030";
    }, 3000);
  }
};

window.unlockAll = function(btn) {
  if (btn.dataset.confirm === "true") {
    GameState.saveData.unlockedClasses = CLASSES.map(c => c.id);
    GameState.saveData.unlockedBiomes = BIOMES.map(b => b.id);
    GameState.saveData.cards = MTYPES.map(m => m.name);
    GameState.saveData.wins = {};
    CLASSES.forEach(c => {
      GameState.saveData.wins[c.id] = BIOMES.map(b => b.id);
    });
    localStorage.setItem('dw_save', JSON.stringify(GameState.saveData));
    location.reload();
  } else {
    btn.dataset.confirm = "true";
    const originalText = btn.innerHTML;
    btn.innerHTML = "SPOILERS ?";
    btn.style.background = "#f0a030";
    btn.style.color = "#000";
    setTimeout(() => {
      btn.dataset.confirm = "false";
      btn.innerHTML = originalText;
      btn.style.background = "";
      btn.style.color = "#f0a030";
    }, 3000);
  }
};

window.closeProgression = function() {
  const progressionUI = document.getElementById('progressionUI');
  if (!progressionUI) return;
  disposeProgressionCardRenderers(progressionUI);
  progressionUI.style.display = 'none';
  window.closeCardPreview();
  window.previewTarget = null;
  const mainCv = document.getElementById('main');
  if (mainCv) mainCv.style.zIndex = '';
  if (GameState.gameRunning) {
    const pauseMenu = document.getElementById('pauseMenu');
    if (pauseMenu) pauseMenu.style.display = 'flex';
  } else {
    closeGallery(); // Reuses closeGallery logic to reset main menu
    const mg = document.getElementById('menuGrid');
    if (mg) mg.style.display = 'grid';
  }
};
