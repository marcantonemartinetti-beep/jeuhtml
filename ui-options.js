// ═══════════════════════════════════════════════
// DUNGEON WORLD - OPTIONS & SETTINGS
// ═══════════════════════════════════════════════

window.openOptions = function() {
  if (window.event) window.event.stopPropagation();
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

  let ui = document.getElementById('optionsUI');
  if (!ui) {
      ui = document.createElement('div');
      ui.id = 'optionsUI';
      ui.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:300;flex-direction:column;align-items:center;justify-content:center;padding:20px;';
      document.body.appendChild(ui);
  }
  ui.style.display = 'flex';
  renderOptions();
};

window.closeOptions = function() {
    const ui = document.getElementById('optionsUI');
    if (ui) ui.style.display = 'none';
    if (GameState.gameRunning) {
        const pm = document.getElementById('pauseMenu');
        if (pm) pm.style.display = 'flex';
    } else {
        document.getElementById('selContainer').style.display = 'flex';
        document.getElementById('startBtn').style.display = 'block';
        document.querySelector('.ctrl').style.display = 'block';
        const mg = document.getElementById('menuGrid');
        if (mg) mg.style.display = 'grid';
        else {
            document.getElementById('galleryBtn').style.display = 'block';
        }
    }
};

window.renderOptions = function() {
    const ui = document.getElementById('optionsUI');
    if (!ui) return;
    const s = GameState.saveData.settings || { view: 0, particles: 1 };
    
    ui.innerHTML = `
        <h2 style="color:#ffd700;font-family:'Cinzel',serif;margin-bottom:30px;">OPTIONS</h2>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;width:100%;max-width:400px;margin-bottom:30px;">
            <div style="color:#eee;align-self:center;">Vue par défaut</div>
            <button onclick="toggleSetting('view')" style="padding:8px;background:#333;color:#fff;border:1px solid #555;cursor:pointer;">${s.view===0?'1ère Personne':'3ème Personne'}</button>
            
            <div style="color:#eee;align-self:center;">Particules</div>
            <button onclick="toggleSetting('particles')" style="padding:8px;background:#333;color:#fff;border:1px solid #555;cursor:pointer;">${s.particles===0?'Faible':'Élevé'}</button>
        </div>
        
        <button class="gal-btn" onclick="closeOptions()" style="width:200px;">RETOUR</button>
    `;
};

window.toggleSetting = function(key) {
    if (!GameState.saveData.settings) GameState.saveData.settings = { view: 0, particles: 1 };
    const s = GameState.saveData.settings;
    if (key === 'view') s.view = s.view === 0 ? 1 : 0;
    if (key === 'particles') s.particles = s.particles === 0 ? 1 : 0;
    localStorage.setItem('dw_save', JSON.stringify(GameState.saveData));
    renderOptions();
};
