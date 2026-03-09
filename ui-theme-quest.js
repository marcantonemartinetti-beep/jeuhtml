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
      sk.style.cssText = 'position:fixed;right:18px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:14px;z-index:100;pointer-events:none;align-items:flex-end;';
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
