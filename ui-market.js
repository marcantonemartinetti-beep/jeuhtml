// ═══════════════════════════════════════════════
// DUNGEON WORLD - MARKET & CASINO
// ═══════════════════════════════════════════════

window.openMarket = function() {
    if (window.event) window.event.stopPropagation();
    document.getElementById('selContainer').style.display = 'none';
    document.getElementById('startBtn').style.display = 'none';
    document.querySelector('.ctrl').style.display = 'none';
    const mg = document.getElementById('menuGrid');
    if (mg) mg.style.display = 'none';
    else {
        document.getElementById('galleryBtn').style.display = 'none';
    }
    
    // Create UI if not exists
    let ui = document.getElementById('marketUI');
    if (!ui) {
        ui = document.createElement('div');
        ui.id = 'marketUI';
        ui.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:300;flex-direction:column;align-items:center;padding:20px;overflow-y:auto;';
        document.body.appendChild(ui);
    }
    ui.style.display = 'flex';
    switchMarketTab('upgrades');
};

window.closeMarket = function() {
    const ui = document.getElementById('marketUI');
    if (ui) ui.style.display = 'none';
    document.getElementById('selContainer').style.display = 'flex';
    document.getElementById('startBtn').style.display = 'block';
    document.querySelector('.ctrl').style.display = 'block';
    const mg = document.getElementById('menuGrid');
    if (mg) mg.style.display = 'grid';
    else {
        document.getElementById('galleryBtn').style.display = 'block';
    }
};

window.switchMarketTab = function(tab) {
    const ui = document.getElementById('marketUI');
    if (!ui) return;
    const money = GameState.saveData.money || 0;
    
    let html = `
        <div style="width:100%;max-width:800px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="color:#ffd700;font-family:'Cinzel',serif;margin:0;">MARCHÉ</h2>
            <div style="font-size:24px;color:#ffd700;"><i class="fa-solid fa-coins"></i> ${Math.floor(money)}</div>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;justify-content:center;">
            <button onclick="switchMarketTab('upgrades')" style="padding:10px 20px;background:${tab==='upgrades'?'#d0a030':'#333'};color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">AMÉLIORATIONS</button>
            <button onclick="switchMarketTab('characters')" style="padding:10px 20px;background:${tab==='characters'?'#d0a030':'#333'};color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">PERSONNAGES</button>
            <button onclick="switchMarketTab('cosmetics')" style="padding:10px 20px;background:${tab==='cosmetics'?'#d0a030':'#333'};color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">COSMÉTIQUES</button>
            <button onclick="switchMarketTab('casino')" style="padding:10px 20px;background:${tab==='casino'?'#d0a030':'#333'};color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">CASINO</button>
        </div>
        <div id="marketContent" style="width:100%;display:flex;flex-direction:column;align-items:center;"></div>
        <button class="gal-btn" onclick="closeMarket()" style="margin-top:30px;width:200px;">RETOUR</button>
    `;
    ui.innerHTML = html;
    
    if (tab === 'upgrades') renderUpgrades();
    else if (tab === 'characters') renderCharacterShop();
    else if (tab === 'cosmetics') renderShop();
    else if (tab === 'casino') renderCasino();
};

window.renderUpgrades = function() {
    const ui = document.getElementById('marketContent');
    if (!ui) return;
    const money = GameState.saveData.money || 0;
    
    let html = `<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap:15px;width:100%;max-width:1000px;">`;
    
    PERM_UPGRADES.forEach(u => {
        const lvl = (GameState.saveData.permUpgrades && GameState.saveData.permUpgrades[u.id]) || 0;
        const cost = Math.floor(u.baseCost * Math.pow(u.costMult, lvl));
        const isMax = lvl >= u.max;
        const canBuy = !isMax && money >= cost;
        
        html += `
            <div style="background:rgba(255,255,255,0.05);border:1px solid ${isMax?'#ffd700':'#444'};border-radius:8px;padding:15px;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;">
                <div style="font-size:32px;color:#eee;margin-bottom:10px;"><i class="${u.icon}"></i></div>
                <div style="font-weight:bold;color:#fff;margin-bottom:5px;">${u.name}</div>
                <div style="font-size:12px;color:#aaa;margin-bottom:10px;">${u.desc}</div>
                <div style="font-size:14px;color:#ffd700;margin-bottom:10px;">Niveau ${lvl} / ${u.max}</div>
                <button onclick="buyUpgrade('${u.id}')" style="margin-top:auto;padding:8px 16px;background:${isMax?'#555':(canBuy?'#d0a030':'#333')};color:${canBuy||isMax?'#000':'#666'};border:none;border-radius:4px;cursor:${canBuy?'pointer':'default'};font-weight:bold;" ${!canBuy?'disabled':''}>
                    ${isMax ? 'MAX' : `<i class="fa-solid fa-coins"></i> ${cost}`}
                </button>
            </div>
        `;
    });
    
    html += `</div>`;
    ui.innerHTML = html;
};

window.buyUpgrade = function(id) {
    const u = PERM_UPGRADES.find(x => x.id === id);
    if (!u) return;
    
    const lvl = (GameState.saveData.permUpgrades && GameState.saveData.permUpgrades[id]) || 0;
    if (lvl >= u.max) return;
    
    const cost = Math.floor(u.baseCost * Math.pow(u.costMult, lvl));
    if (GameState.saveData.money >= cost) {
        GameState.saveData.money -= cost;
        if (!GameState.saveData.permUpgrades) GameState.saveData.permUpgrades = {};
        GameState.saveData.permUpgrades[id] = lvl + 1;
        localStorage.setItem('dw_save', JSON.stringify(GameState.saveData));
        switchMarketTab('upgrades');
    }
};

window.renderShop = function() {
    const ui = document.getElementById('marketContent');
    if (!ui) return;
    const money = GameState.saveData.money || 0;
    const unlocked = GameState.saveData.unlockedCosmetics || ['default'];
    const equipped = GameState.saveData.equippedCosmetic || 'default';
    const unlockedCostumes = GameState.saveData.unlockedCostumes || ['A'];

    const costumeDefs = (typeof COSTUMES !== 'undefined' && Array.isArray(COSTUMES) && COSTUMES.length)
      ? COSTUMES
      : [{ id: 'A', name: 'Costume A', cost: 0, desc: 'Costume de base.', icon: 'fa-solid fa-shirt' }, { id: 'B', name: 'Costume B', cost: 3500, desc: 'Variation premium pour tous les personnages.', icon: 'fa-solid fa-crown' }];

    let html = `<div style="width:100%;max-width:1000px;margin-bottom:18px;">`;
    html += `<div style="font-family:'Cinzel',serif;color:#f0a030;font-size:14px;margin-bottom:10px;letter-spacing:.08em;">COSTUMES (TOUS PERSONNAGES)</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap:15px;">`;

    costumeDefs.forEach(costume => {
        const isUnlocked = unlockedCostumes.includes(costume.id);
        const canBuy = !isUnlocked && money >= costume.cost;
        const selected = (GameState.saveData.selectedCostume || 'A') === costume.id;
        html += `
            <div style="background:rgba(255,255,255,0.05);border:1px solid ${selected?'#00ff88':(isUnlocked?'#ffd700':'#444')};border-radius:8px;padding:15px;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;">
                <div style="font-size:30px;color:#eee;margin-bottom:10px;"><i class="${costume.icon || 'fa-solid fa-shirt'}"></i></div>
                <div style="font-weight:bold;color:#fff;margin-bottom:5px;">${costume.name}</div>
                <div style="font-size:12px;color:#aaa;margin-bottom:10px;">${costume.desc}</div>
                ${isUnlocked
                  ? `<button style="margin-top:auto;padding:8px 16px;background:${selected?'#228822':'#333'};color:#fff;border:none;border-radius:4px;font-weight:bold;cursor:default;">${selected ? 'ACTIF' : 'ACHETÉ'}</button>`
                  : `<button onclick="buyCostume('${costume.id}')" style="margin-top:auto;padding:8px 16px;background:${canBuy?'#d0a030':'#333'};color:${canBuy?'#000':'#666'};border:none;border-radius:4px;cursor:${canBuy?'pointer':'default'};font-weight:bold;" ${!canBuy?'disabled':''}><i class="fa-solid fa-coins"></i> ${costume.cost}</button>`}
            </div>
        `;
    });

    html += `</div></div>`;
    
    html += `<div style="font-family:'Cinzel',serif;color:#f0a030;font-size:14px;margin-bottom:10px;letter-spacing:.08em;">SKINS D'ARME</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap:15px;width:100%;max-width:1000px;">`;
    
    COSMETICS.forEach(c => {
        const isUnlocked = unlocked.includes(c.id);
        const isEquipped = equipped === c.id;
        const canBuy = !isUnlocked && money >= c.cost;
        
        html += `
            <div style="background:rgba(255,255,255,0.05);border:1px solid ${isEquipped?'#00ff00':(isUnlocked?'#ffd700':'#444')};border-radius:8px;padding:15px;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;">
                <div style="font-size:32px;color:#eee;margin-bottom:10px;text-shadow:0 0 10px #${c.colors.steel.toString(16)};"><i class="fa-solid fa-paint-roller"></i></div>
                <div style="font-weight:bold;color:#fff;margin-bottom:5px;">${c.name}</div>
                <div style="font-size:12px;color:#aaa;margin-bottom:10px;">${c.desc}</div>
                ${isEquipped ? 
                    `<button style="margin-top:auto;padding:8px 16px;background:#228822;color:#fff;border:none;border-radius:4px;font-weight:bold;cursor:default;">ÉQUIPÉ</button>` :
                    (isUnlocked ? 
                        `<button onclick="equipCosmetic('${c.id}')" style="margin-top:auto;padding:8px 16px;background:#333;color:#fff;border:1px solid #fff;border-radius:4px;cursor:pointer;font-weight:bold;">ÉQUIPER</button>` :
                        `<button onclick="buyCosmetic('${c.id}')" style="margin-top:auto;padding:8px 16px;background:${canBuy?'#d0a030':'#333'};color:${canBuy?'#000':'#666'};border:none;border-radius:4px;cursor:${canBuy?'pointer':'default'};font-weight:bold;" ${!canBuy?'disabled':''}>
                            <i class="fa-solid fa-coins"></i> ${c.cost}
                        </button>`
                    )
                }
            </div>
        `;
    });
    
    html += `</div>`;
    ui.innerHTML = html;
};

window.buyCostume = function(id) {
    const defs = (typeof COSTUMES !== 'undefined' && Array.isArray(COSTUMES)) ? COSTUMES : [];
    const costume = defs.find(x => x.id === id);
    if (!costume || id === 'A') return;
    if (!Array.isArray(GameState.saveData.unlockedCostumes)) GameState.saveData.unlockedCostumes = ['A'];
    if (GameState.saveData.unlockedCostumes.includes(id)) return;
    if (GameState.saveData.money < costume.cost) return;

    GameState.saveData.money -= costume.cost;
    GameState.saveData.unlockedCostumes.push(id);
    GameState.saveData.selectedCostume = id;
    localStorage.setItem('dw_save', JSON.stringify(GameState.saveData));
    switchMarketTab('cosmetics');
    if (typeof addNotif === 'function') addNotif(`🎭 ${costume.name} acheté !`, '#ffd700');
};

window.buyCosmetic = function(id) {
    const c = COSMETICS.find(x => x.id === id);
    if (!c) return;
    if (GameState.saveData.money >= c.cost) {
        GameState.saveData.money -= c.cost;
        GameState.saveData.unlockedCosmetics.push(id);
        localStorage.setItem('dw_save', JSON.stringify(GameState.saveData));
        switchMarketTab('cosmetics');
    }
};

window.equipCosmetic = function(id) {
    GameState.saveData.equippedCosmetic = id;
    localStorage.setItem('dw_save', JSON.stringify(GameState.saveData));
    switchMarketTab('cosmetics');
};

window.renderCharacterShop = function() {
    const ui = document.getElementById('marketContent');
    if (!ui) return;
    const money = GameState.saveData.money || 0;
    const unlocked = GameState.saveData.unlockedClasses || [];
    
    const shopChars = CLASSES.filter(c => c.shopPrice);
    
    let html = `<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:15px;width:100%;max-width:1200px;">`;
    
    shopChars.forEach(c => {
        const isUnlocked = unlocked.includes(c.id);
        const canBuy = !isUnlocked && money >= c.shopPrice;
        
        html += `
            <div style="background:rgba(255,255,255,0.05);border:1px solid ${isUnlocked?'#00ff00':'#444'};border-radius:8px;padding:15px;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;min-height:280px;">
                ${isUnlocked ? '<div style="position:absolute;top:8px;right:8px;color:#00ff00;font-size:20px;"><i class="fa-solid fa-check-circle"></i></div>' : ''}
                <div style="font-size:48px;color:#eee;margin-bottom:10px;"><i class="${c.icon}"></i></div>
                <div style="font-weight:bold;color:#fff;font-size:18px;margin-bottom:5px;">${c.name}</div>
                <div style="font-size:11px;color:#888;margin-bottom:10px;">${c.desc}</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;font-size:11px;color:#aaa;margin-bottom:10px;padding:10px;background:rgba(0,0,0,0.3);border-radius:4px;">
                    <div><i class="fa-solid fa-heart"></i> PV: ${c.hp}</div>
                    <div><i class="fa-solid fa-person-running"></i> Vit: ${c.spd}</div>
                    <div><i class="fa-solid fa-arrow-up"></i> Saut: ${c.jump}</div>
                    <div><i class="fa-solid fa-weight-hanging"></i> Poids: ${c.weight}</div>
                </div>
                <div style="font-size:10px;color:#ffaa00;margin-bottom:5px;"><i class="fa-solid fa-bolt"></i> ${c.special.name}</div>
                <div style="font-size:9px;color:#666;margin-bottom:auto;">${c.special.desc}</div>
                ${isUnlocked ? 
                    `<button style="margin-top:10px;padding:10px 20px;background:#228822;color:#fff;border:none;border-radius:4px;font-weight:bold;cursor:default;width:100%;">DÉBLOQUÉ</button>` :
                    `<button onclick="buyCharacter('${c.id}')" style="margin-top:10px;padding:10px 20px;background:${canBuy?'#d0a030':'#333'};color:${canBuy?'#000':'#666'};border:none;border-radius:4px;cursor:${canBuy?'pointer':'default'};font-weight:bold;width:100%;" ${!canBuy?'disabled':''}>
                        <i class="fa-solid fa-coins"></i> ${c.shopPrice.toLocaleString()}
                    </button>`
                }
            </div>
        `;
    });
    
    html += `</div>`;
    html += `<div style="margin-top:20px;padding:15px;background:rgba(100,200,255,0.1);border:1px solid #4488ff;border-radius:8px;max-width:800px;text-align:center;">
        <div style="color:#88ccff;font-weight:bold;margin-bottom:5px;"><i class="fa-solid fa-info-circle"></i> Comment gagner de l'or ?</div>
        <div style="color:#aaa;font-size:12px;">Tuez des ennemis en partie pour gagner de l'or ! Plus vous tuez, plus vous gagnez.</div>
    </div>`;
    
    ui.innerHTML = html;
};

window.buyCharacter = function(id) {
    const c = CLASSES.find(x => x.id === id);
    if (!c || !c.shopPrice) return;
    
    if (GameState.saveData.money >= c.shopPrice) {
        GameState.saveData.money -= c.shopPrice;
        if (!GameState.saveData.unlockedClasses) GameState.saveData.unlockedClasses = [];
        if (!GameState.saveData.unlockedClasses.includes(id)) {
            GameState.saveData.unlockedClasses.push(id);
        }
        localStorage.setItem('dw_save', JSON.stringify(GameState.saveData));
        switchMarketTab('characters');
        addNotif(`🎉 ${c.name} débloqué !`, '#00ff00');
    }
};

window.renderCasino = function() {
    const ui = document.getElementById('marketContent');
    if (!ui) return;
    
    let html = `<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:20px;width:100%;max-width:1200px;">`;
    
    // Coin Flip
    html += `
        <div style="background:rgba(255,255,255,0.05);border:1px solid #444;border-radius:8px;padding:15px;text-align:center;">
            <div style="font-size:32px;color:#ffd700;margin-bottom:10px;"><i class="fa-solid fa-circle-half-stroke"></i></div>
            <div style="font-weight:bold;color:#fff;margin-bottom:5px;">Pile ou Face</div>
            <div style="font-size:12px;color:#aaa;margin-bottom:10px;">Doublez votre mise ou perdez tout (50%).</div>
            <input type="number" id="betCoin" value="100" min="10" style="width:80px;padding:5px;margin-bottom:10px;background:#222;color:#fff;border:1px solid #555;text-align:center;">
            <button onclick="gambleCoin()" class="gal-btn" style="width:100%;border-color:#ffd700;color:#ffd700;">JOUER</button>
            <div id="coinResult" style="margin-top:10px;height:24px;font-weight:bold;"></div>
        </div>
    `;

    // Slots
    html += `
        <div style="background:rgba(255,255,255,0.05);border:1px solid #444;border-radius:8px;padding:15px;text-align:center;">
            <div style="font-size:32px;color:#ff4444;margin-bottom:10px;"><i class="fa-solid fa-7"></i></div>
            <div style="font-weight:bold;color:#fff;margin-bottom:5px;">Machine à Sous</div>
            <div style="font-size:12px;color:#aaa;margin-bottom:10px;">Alignez 3 symboles pour le Jackpot !</div>
            <div class="slots-container" style="display:flex;justify-content:center;gap:10px;margin-bottom:15px;background:#111;padding:10px;border-radius:5px;border:1px solid #333;">
                <div id="reel1" class="slot-reel" style="font-size:40px;width:50px;height:60px;overflow:hidden;line-height:60px;">🍒</div>
                <div id="reel2" class="slot-reel" style="font-size:40px;width:50px;height:60px;overflow:hidden;line-height:60px;">🍒</div>
                <div id="reel3" class="slot-reel" style="font-size:40px;width:50px;height:60px;overflow:hidden;line-height:60px;">🍒</div>
            </div>
            <input type="number" id="betSlots" value="50" min="10" style="width:80px;padding:5px;margin-bottom:10px;background:#222;color:#fff;border:1px solid #555;text-align:center;">
            <button onclick="gambleSlots()" class="gal-btn" style="width:100%;border-color:#ff4444;color:#ff4444;">JOUER</button>
            <div id="slotMsg" style="margin-top:10px;height:20px;font-size:14px;font-weight:bold;"></div>
        </div>
    `;

    // Dice
    html += `
        <div style="background:rgba(255,255,255,0.05);border:1px solid #444;border-radius:8px;padding:15px;text-align:center;">
            <div style="font-size:32px;color:#44aaff;margin-bottom:10px;"><i class="fa-solid fa-dice"></i></div>
            <div style="font-weight:bold;color:#fff;margin-bottom:5px;">Dés de la Fortune</div>
            <div style="font-size:12px;color:#aaa;margin-bottom:10px;">> 7 (x2) | Double (x3) | 12 (x10)</div>
            <div id="diceContainer" style="height:80px;display:flex;justify-content:center;align-items:center;gap:20px;margin-bottom:10px;perspective:500px;">
                <div id="die1" style="font-size:50px;color:#fff;transition:transform 0.5s;">🎲</div>
                <div id="die2" style="font-size:50px;color:#fff;transition:transform 0.5s;">🎲</div>
            </div>
            <input type="number" id="betDice" value="200" min="10" style="width:80px;padding:5px;margin-bottom:10px;background:#222;color:#fff;border:1px solid #555;text-align:center;">
            <button onclick="gambleDice()" class="gal-btn" style="width:100%;border-color:#44aaff;color:#44aaff;">LANCER</button>
        </div>
    `;

    // Wheel
    html += `
        <div style="background:rgba(255,255,255,0.05);border:1px solid #444;border-radius:8px;padding:15px;text-align:center;">
            <div style="font-size:32px;color:#aa44ff;margin-bottom:10px;"><i class="fa-solid fa-dharmachakra"></i></div>
            <div style="font-weight:bold;color:#fff;margin-bottom:5px;">Roue Mystique</div>
            <div style="position:relative;width:120px;height:120px;margin:10px auto;">
                <div id="wheel" style="width:100%;height:100%;border-radius:50%;border:4px solid #fff;box-sizing:border-box;background:conic-gradient(#f00 0deg 60deg, #0f0 60deg 120deg, #00f 120deg 180deg, #ff0 180deg 240deg, #0ff 240deg 300deg, #f0f 300deg 360deg);transition:transform 4s cubic-bezier(0.1, 0.7, 0.1, 1);"></div>
                <div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:20px;color:#fff;text-shadow:0 2px 2px #000;">▼</div>
            </div>
            <input type="number" id="betWheel" value="200" min="10" style="width:80px;padding:5px;margin-bottom:10px;background:#222;color:#fff;border:1px solid #555;text-align:center;">
            <button onclick="gambleWheel()" class="gal-btn" style="width:100%;border-color:#aa44ff;color:#aa44ff;">TOURNER</button>
        </div>
    `;

    // High/Low
    html += `
        <div style="background:rgba(255,255,255,0.05);border:1px solid #444;border-radius:8px;padding:15px;text-align:center;">
            <div style="font-size:32px;color:#44ff44;margin-bottom:10px;"><i class="fa-solid fa-diamond"></i></div>
            <div style="font-weight:bold;color:#fff;margin-bottom:5px;">Plus ou Moins</div>
            <div id="hlCard" style="width:50px;height:70px;background:#fff;color:#000;border-radius:4px;margin:10px auto;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;transition:transform 0.2s;">?</div>
            <input type="number" id="betHL" value="50" min="10" style="width:80px;padding:5px;margin-bottom:10px;background:#222;color:#fff;border:1px solid #555;text-align:center;">
            <div style="display:flex;gap:10px;">
                <button onclick="gambleHL('low')" class="gal-btn" style="flex:1;border-color:#ff4444;color:#ff4444;">-</button>
                <button onclick="gambleHL('high')" class="gal-btn" style="flex:1;border-color:#44ff44;color:#44ff44;">+</button>
            </div>
            <div id="hlMsg" style="margin-top:5px;height:20px;font-size:12px;"></div>
        </div>
    `;
    
    html += `</div>`;
    ui.innerHTML = html;
    
    window.hlCurrent = Math.floor(Math.random() * 13) + 1;
    const hlCard = document.getElementById('hlCard');
    if(hlCard) hlCard.textContent = window.hlCurrent;
};

window.updateMoneyDisplay = function() {
    const ui = document.getElementById('marketUI');
    if(!ui) return;
    const headerMoney = ui.querySelector('h2').nextElementSibling;
    if(headerMoney) headerMoney.innerHTML = `<i class="fa-solid fa-coins"></i> ${Math.floor(GameState.saveData.money)}`;
    localStorage.setItem('dw_save', JSON.stringify(GameState.saveData));
};

window.gambleCoin = function() {
    const betInput = document.getElementById('betCoin');
    const bet = parseInt(betInput.value);
    if (isNaN(bet) || bet <= 0) return addNotif("Mise invalide", "#ff4444");
    if (GameState.saveData.money < bet) return addNotif("Pas assez d'argent !", "#ff4444");

    GameState.saveData.money -= bet;
    updateMoneyDisplay();
    
    const resDiv = document.getElementById('coinResult');
    resDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    
    setTimeout(() => {
        if (Math.random() < 0.5) {
            const win = bet * 2;
            GameState.saveData.money += win;
            resDiv.innerHTML = `<span style="color:#00ff00">GAGNÉ ! +${win}</span>`;
            addNotif(`💰 +${win} Or`, '#ffd700');
        } else {
            resDiv.innerHTML = `<span style="color:#ff4444">PERDU...</span>`;
        }
        updateMoneyDisplay();
    }, 1000);
};

window.gambleSlots = function() {
    const betInput = document.getElementById('betSlots');
    const bet = parseInt(betInput.value);
    if (isNaN(bet) || bet <= 0) return addNotif("Mise invalide", "#ff4444");
    if (GameState.saveData.money < bet) return addNotif("Pas assez d'argent !", "#ff4444");

    GameState.saveData.money -= bet;
    updateMoneyDisplay();
    
    const symbols = ['🍒', '🍋', '🍇', '💎', '7️⃣', '🔔'];
    const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    const msg = document.getElementById('slotMsg');
    msg.textContent = "";
    
    let results = [];
    
    reels.forEach((r, i) => {
        let speed = 50;
        let t = 0;
        const duration = 1000 + i * 500;
        const interval = setInterval(() => {
            r.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            t += speed;
            if (t > duration) {
                clearInterval(interval);
                const finalSym = symbols[Math.floor(Math.random() * symbols.length)];
                r.textContent = finalSym;
                results.push(finalSym);
                if (results.length === 3) {
                    const [r1, r2, r3] = results;
                    let win = 0;
                    if (r1 === r2 && r2 === r3) {
                        if (r1 === '7️⃣') win = bet * 50;
                        else if (r1 === '💎') win = bet * 20;
                        else win = bet * 10;
                    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
                        win = Math.floor(bet * 1.5);
                    }

                    if (win > 0) {
                        GameState.saveData.money += win;
                        addNotif(`🎰 JACKPOT ! +${win} Or`, '#ffd700');
                        msg.innerHTML = `<span style="color:#0f0">GAGNÉ: ${win}</span>`;
                    } else {
                        msg.innerHTML = `<span style="color:#f44">PERDU</span>`;
                    }
                    updateMoneyDisplay();
                }
            }
        }, speed);
    });
};

window.gambleDice = function() {
    const betInput = document.getElementById('betDice');
    const bet = parseInt(betInput.value);
    if (isNaN(bet) || bet <= 0) return addNotif("Mise invalide", "#ff4444");
    if (GameState.saveData.money < bet) return addNotif("Pas assez d'argent !", "#ff4444");

    GameState.saveData.money -= bet;
    updateMoneyDisplay();
    
    const d1El = document.getElementById('die1');
    const d2El = document.getElementById('die2');
    const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
    
    let rot = 0;
    const interval = setInterval(() => {
        rot += 90;
        d1El.style.transform = `rotate(${rot}deg) scale(1.2)`;
        d2El.style.transform = `rotate(-${rot}deg) scale(1.2)`;
        d1El.textContent = faces[Math.floor(Math.random()*6)];
        d2El.textContent = faces[Math.floor(Math.random()*6)];
    }, 100);
    
    setTimeout(() => {
        clearInterval(interval);
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const total = d1 + d2;
        
        d1El.textContent = faces[d1-1];
        d2El.textContent = faces[d2-1];
        d1El.style.transform = `rotate(0deg) scale(1)`;
        d2El.style.transform = `rotate(0deg) scale(1)`;
        
        let win = 0;
        if (total === 12) win = bet * 10;
        else if (d1 === d2) win = bet * 3;
        else if (total > 7) win = bet * 2;
        
        if (win > 0) {
            GameState.saveData.money += win;
            addNotif(`🎲 GAGNÉ ! +${win} Or`, '#ffd700');
        }
        updateMoneyDisplay();
    }, 1000);
};

window.gambleWheel = function() {
    const betInput = document.getElementById('betWheel');
    const bet = parseInt(betInput.value);
    if (isNaN(bet) || bet <= 0) return addNotif("Mise invalide", "#ff4444");
    if (GameState.saveData.money < bet) return addNotif("Pas assez d'argent !", "#ff4444");

    GameState.saveData.money -= bet;
    updateMoneyDisplay();
    
    const wheel = document.getElementById('wheel');
    if (!wheel) return;
    const rot = 1080 + Math.random() * 360;
    wheel.style.transform = `rotate(${rot}deg)`;
    
    setTimeout(() => {
        const finalAngle = rot % 360;
        const seg = Math.floor((360 - finalAngle) / 60) % 6;
        let win = 0;
        
        if (seg === 1) win = bet * 2;
        else if (seg === 3) win = bet * 3;
        else if (seg === 4) win = bet * 5;
        
        if (win > 0) {
            GameState.saveData.money += win;
            addNotif(`🎡 GAGNÉ ! +${win} Or`, '#ffd700');
        } else {
            addNotif(`🎡 PERDU...`, '#ff4444');
        }
        updateMoneyDisplay();
        
        setTimeout(() => {
            wheel.style.transition = 'none';
            wheel.style.transform = `rotate(${finalAngle}deg)`;
            setTimeout(() => wheel.style.transition = 'transform 4s cubic-bezier(0.1, 0.7, 0.1, 1)', 50);
        }, 1000);
        
    }, 4000);
};

window.gambleHL = function(choice) {
    const betInput = document.getElementById('betHL');
    const bet = parseInt(betInput.value);
    if (isNaN(bet) || bet <= 0) return addNotif("Mise invalide", "#ff4444");
    if (GameState.saveData.money < bet) return addNotif("Pas assez d'argent !", "#ff4444");

    GameState.saveData.money -= bet;
    updateMoneyDisplay();
    
    const next = Math.floor(Math.random() * 13) + 1;
    const cur = window.hlCurrent;
    const cardEl = document.getElementById('hlCard');
    const msg = document.getElementById('hlMsg');
    
    if (!cardEl || !msg) return;
    
    cardEl.style.transform = "scaleX(0)";
    setTimeout(() => {
        cardEl.textContent = next;
        cardEl.style.transform = "scaleX(1)";
        
        let win = 0;
        if (choice === 'high' && next > cur) win = bet * 2;
        else if (choice === 'low' && next < cur) win = bet * 2;
        else if (next === cur) win = bet;
        
        if (win > bet) {
            GameState.saveData.money += win;
            msg.innerHTML = `<span style="color:#0f0">GAGNÉ !</span>`;
        } else if (win === bet) {
            GameState.saveData.money += win;
            msg.innerHTML = `<span style="color:#ff0">ÉGALITÉ</span>`;
        } else {
            msg.innerHTML = `<span style="color:#f44">PERDU</span>`;
        }
        updateMoneyDisplay();
        window.hlCurrent = next;
    }, 200);
};
