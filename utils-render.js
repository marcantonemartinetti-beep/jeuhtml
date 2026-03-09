// ═══════════════════════════════════════════════
// DUNGEON WORLD - Rendering Utilities
// ═══════════════════════════════════════════════

// ==================== TEXTURE CACHE ====================
var texCache = {};

function genTex(hex, type = 'noise') {
  const k = hex + '_' + type;
  if (texCache[k]) return texCache[k];
  const sz = 64, cv = document.createElement('canvas');
  cv.width = cv.height = sz;
  const ctx = cv.getContext('2d');
  const c = new THREE.Color(hex);
  ctx.fillStyle = '#' + c.getHexString();
  ctx.fillRect(0, 0, sz, sz);
  const id = ctx.getImageData(0, 0, sz, sz), d = id.data;
  const nInt = type === 'smooth' ? 15 : 35;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * nInt;
    d[i] = Math.min(255, Math.max(0, d[i] + n));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n));
  }
  ctx.putImageData(id, 0, 0);
  if (type === 'wood') {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for (let i = 0; i < 12; i++) ctx.fillRect(0, Math.random() * sz, sz, 1 + Math.random() * 2);
  } else if (type === 'stone') {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    for (let i = 0; i < 20; i++) ctx.fillRect(Math.random() * sz, Math.random() * sz, 2 + Math.random() * 4, 2 + Math.random() * 4);
  }
  const t = new THREE.CanvasTexture(cv);
  t.magFilter = THREE.NearestFilter;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  texCache[k] = t;
  return t;
}

// ==================== SPRITE TEXTURE CACHE ====================
var spTexCache = {}, spMatCache = {};

function getSpTex(c, shp) {
  const k = c + '_' + shp;
  if (spTexCache[k]) return spTexCache[k];
  const cv = document.createElement('canvas');
  cv.width = 64;
  cv.height = 64;
  const ctx = cv.getContext('2d');
  const col = new THREE.Color(c);
  ctx.fillStyle = '#' + col.getHexString();
  ctx.beginPath();
  if (shp === 'circle') {
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
  } else if (shp === 'tri') {
    ctx.moveTo(32, 2);
    ctx.lineTo(62, 62);
    ctx.lineTo(2, 62);
    ctx.fill();
  } else if (shp === 'diamond') {
    ctx.moveTo(32, 2);
    ctx.lineTo(62, 32);
    ctx.lineTo(32, 62);
    ctx.lineTo(2, 32);
    ctx.fill();
  } else if (shp === 'star') {
    ctx.beginPath();
    for(let i=0; i<5; i++){
      ctx.lineTo(32 + Math.cos((18+i*72)*Math.PI/180)*30, 32 + Math.sin((18+i*72)*Math.PI/180)*30);
      ctx.lineTo(32 + Math.cos((54+i*72)*Math.PI/180)*12, 32 + Math.sin((54+i*72)*Math.PI/180)*12);
    }
    ctx.closePath();
    ctx.fill();
  } else if (shp === 'arrow') {
    ctx.beginPath();
    ctx.moveTo(32, 2); ctx.lineTo(52, 22); ctx.lineTo(42, 22); ctx.lineTo(42, 62); ctx.lineTo(22, 62); ctx.lineTo(22, 22); ctx.lineTo(12, 22);
    ctx.closePath();
    ctx.fill();
  } else if (shp === 'shuriken') {
    ctx.beginPath();
    for(let i=0; i<4; i++){
      ctx.lineTo(32 + Math.cos(i*Math.PI/2)*30, 32 + Math.sin(i*Math.PI/2)*30);
      ctx.lineTo(32 + Math.cos((i+0.5)*Math.PI/2)*10, 32 + Math.sin((i+0.5)*Math.PI/2)*10);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(2, 2, 60, 60);
  }
  // Noise
  ctx.globalCompositeOperation = 'source-atop';
  const id = ctx.getImageData(0, 0, 64, 64), d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const n = (Math.random() - 0.5) * 40;
    d[i] = Math.min(255, Math.max(0, d[i] + n));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n));
  }
  ctx.putImageData(id, 0, 0);
  // Border
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  if (shp === 'circle') {
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.stroke();
  } else if (shp === 'tri') {
    ctx.beginPath();
    ctx.moveTo(32, 2);
    ctx.lineTo(62, 62);
    ctx.lineTo(2, 62);
    ctx.closePath();
    ctx.stroke();
  } else if (shp === 'diamond') {
    ctx.beginPath();
    ctx.moveTo(32, 2);
    ctx.lineTo(62, 32);
    ctx.lineTo(32, 62);
    ctx.lineTo(2, 32);
    ctx.closePath();
    ctx.stroke();
  } else if (shp === 'star') {
    ctx.beginPath();
    for(let i=0; i<5; i++){
      ctx.lineTo(32 + Math.cos((18+i*72)*Math.PI/180)*30, 32 + Math.sin((18+i*72)*Math.PI/180)*30);
      ctx.lineTo(32 + Math.cos((54+i*72)*Math.PI/180)*12, 32 + Math.sin((54+i*72)*Math.PI/180)*12);
    }
    ctx.closePath();
    ctx.stroke();
  } else if (shp === 'arrow') {
    ctx.beginPath();
    ctx.moveTo(32, 2); ctx.lineTo(52, 22); ctx.lineTo(42, 22); ctx.lineTo(42, 62); ctx.lineTo(22, 62); ctx.lineTo(22, 22); ctx.lineTo(12, 22);
    ctx.closePath();
    ctx.stroke();
  } else if (shp === 'shuriken') {
    ctx.beginPath();
    for(let i=0; i<4; i++){ ctx.lineTo(32 + Math.cos(i*Math.PI/2)*30, 32 + Math.sin(i*Math.PI/2)*30); ctx.lineTo(32 + Math.cos((i+0.5)*Math.PI/2)*10, 32 + Math.sin((i+0.5)*Math.PI/2)*10); }
    ctx.closePath();
    ctx.stroke();
  } else {
    ctx.strokeRect(2, 2, 60, 60);
  }
  return spTexCache[k] = new THREE.CanvasTexture(cv);
}

var spriteGeo = new THREE.PlaneGeometry(1, 1);
function mkSprite(c, w, h, shp = 'box') {
  const k = c + '_' + shp;
  if (!spMatCache[k]) spMatCache[k] = new THREE.MeshBasicMaterial({ map: getSpTex(c, shp), transparent: true, side: THREE.DoubleSide, depthWrite: false });
  const m = new THREE.Mesh(spriteGeo, spMatCache[k]);
  m.scale.set(w, h, 1);
  return m;
}

// ==================== SCENERY TEXTURES ====================
var scTexCache = {};

function getSceneryTex(type, col) {
  const k = type + '_' + col;
  if (scTexCache[k]) return scTexCache[k];
  const baseType = type.includes('@') ? type.split('@')[0] : type;
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const color = new THREE.Color(col);
  const base = '#' + color.getHexString();

  if (baseType === 'tree') {
    ctx.fillStyle = '#3a2010';
    ctx.fillRect(28, 40, 8, 24); // Trunk
    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.arc(32, 25, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.arc(32, 25, 15, 0, Math.PI * 2);
    ctx.fill();
  } else if (baseType === 'pine') {
    ctx.fillStyle = '#3a2010';
    ctx.fillRect(28, 50, 8, 14);
    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.moveTo(32, 5);
    ctx.lineTo(55, 50);
    ctx.lineTo(9, 50);
    ctx.fill();
  } else if (baseType === 'cactus') {
    ctx.fillStyle = base;
    ctx.fillRect(28, 10, 8, 54);
    ctx.fillRect(18, 25, 10, 6);
    ctx.fillRect(18, 15, 6, 10);
    ctx.fillRect(36, 35, 10, 6);
    ctx.fillRect(40, 25, 6, 10);
  } else if (baseType === 'dead') {
    ctx.strokeStyle = '#2a1a10';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(32, 64);
    ctx.lineTo(32, 20);
    ctx.moveTo(32, 40);
    ctx.lineTo(10, 25);
    ctx.moveTo(32, 30);
    ctx.lineTo(50, 15);
    ctx.stroke();
  } else if (baseType === 'rock') {
    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.moveTo(10, 60);
    ctx.lineTo(20, 20);
    ctx.lineTo(50, 15);
    ctx.lineTo(55, 55);
    ctx.fill();
  } else if (baseType === 'crystal') {
    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.moveTo(32, 60);
    ctx.lineTo(15, 30);
    ctx.lineTo(32, 5);
    ctx.lineTo(49, 30);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.moveTo(32, 60);
    ctx.lineTo(25, 30);
    ctx.lineTo(32, 5);
    ctx.fill();
  } else if (baseType === 'pillar') {
    ctx.fillStyle = base;
    ctx.fillRect(20, 10, 24, 54);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(24, 10, 4, 54);
    ctx.fillRect(36, 10, 4, 54);
  } else if (baseType === 'grass') {
    ctx.fillStyle = base;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(10 + i * 6, 64);
      ctx.lineTo(10 + i * 6 + (Math.random() - 0.5) * 10, 32 + Math.random() * 10);
      ctx.lineTo(14 + i * 6, 64);
      ctx.fill();
    }
  } else if (baseType === 'tombstone') {
    ctx.fillStyle = '#444';
    ctx.beginPath(); ctx.arc(32, 20, 14, Math.PI, 0); ctx.lineTo(46, 64); ctx.lineTo(18, 64); ctx.fill();
    ctx.fillStyle = '#333'; ctx.font = '10px Arial'; ctx.fillText('RIP', 22, 40);
  } else if (baseType === 'crate') {
    ctx.fillStyle = '#6a4a3a'; ctx.fillRect(10, 10, 44, 44);
    ctx.strokeStyle = '#4a3a2a'; ctx.lineWidth = 4; ctx.strokeRect(10, 10, 44, 44);
    ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(54, 54); ctx.moveTo(54, 10); ctx.lineTo(10, 54); ctx.stroke();
  } else if (baseType === 'tech') {
    ctx.fillStyle = '#111'; ctx.fillRect(20, 10, 24, 54);
    ctx.fillStyle = col; 
    ctx.fillRect(24, 15, 16, 4); ctx.fillRect(24, 25, 16, 4); ctx.fillRect(24, 45, 16, 4);
    ctx.fillRect(28, 10, 2, 54);
  } else if (baseType === 'coral') {
    ctx.fillStyle = base;
    ctx.beginPath(); ctx.moveTo(32, 64); 
    ctx.quadraticCurveTo(10, 40, 20, 10); ctx.quadraticCurveTo(40, 30, 32, 64); ctx.fill();
    ctx.beginPath(); ctx.moveTo(32, 64); 
    ctx.quadraticCurveTo(54, 40, 44, 15); ctx.quadraticCurveTo(24, 30, 32, 64); ctx.fill();
  } else if (baseType === 'organic') {
    ctx.fillStyle = '#442222'; ctx.beginPath(); ctx.arc(32, 40, 15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = base; ctx.beginPath(); ctx.arc(32, 25, 20, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.arc(25, 20, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(40, 28, 3, 0, Math.PI*2); ctx.fill();
  } else if (baseType === 'mushroom') {
    ctx.fillStyle = '#dddddd'; ctx.fillRect(28, 30, 8, 34);
    ctx.fillStyle = base; ctx.beginPath(); ctx.arc(32, 30, 22, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(25, 25, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(40, 20, 3, 0, Math.PI*2); ctx.fill();
  }
  return scTexCache[k] = new THREE.CanvasTexture(c);
}

// ==================== WEAPON TEXTURES ====================
var wepTexCache = {};

function getWeaponTex(type, level) {
  const tier = Math.floor((level - 1) / 5);
  const vTier = Math.min(8, tier);
  const k = type + '_' + tier;
  if (wepTexCache[k]) return wepTexCache[k];
  const sz = 128, cv = document.createElement('canvas');
  cv.width = sz;
  cv.height = sz;
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const seed = type.charCodeAt(0) + tier * 1337;
  const rng = (i) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };
  const hue = (rng(0) * 360 + tier * 15) % 360;
  const sat = 40 + Math.min(60, tier * 5), lit = 50 + Math.min(40, tier * 2);
  const cMain = `hsl(${hue},${sat}%,${lit}%)`, cDark = `hsl(${hue},${sat}%,${lit - 20}%)`;
  const cMet = `hsl(0,0%,${60 + Math.min(40, tier * 5)}%)`, cWood = '#5a4a3a', cGold = '#ffd700';
  const rect = (x, y, w, h, c) => {
    ctx.fillStyle = c;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  };
  const circ = (x, y, r, c) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  if (type === 'sword') {
    const l = 60 + Math.min(50, vTier * 5), w = 12 + Math.min(10, vTier);
    rect(60, 110, 8, 18, cWood);
    rect(58, 124, 12, 4, cDark);
    const gw = 32 + vTier * 4;
    rect(64 - gw / 2, 106, gw, 6, cDark);
    rect(64 - w / 2, 106, w, l, cMet);
    rect(64 - w / 2 + 2, 106 - l + 2, w / 2 - 2, l - 4, '#fff');
  } else if (type === 'axe') {
    const h = 90;
    rect(62, 128 - h, 6, h, cWood);
    const s = 30 + vTier * 5;
    ctx.fillStyle = cMet;
    ctx.beginPath();
    ctx.moveTo(64, 128 - h + 10);
    ctx.lineTo(64 + s, 128 - h - 10);
    ctx.lineTo(64 + s, 128 - h + 30);
    ctx.lineTo(64, 128 - h + 20);
    ctx.fill();
    if (vTier >= 2) {
      ctx.beginPath();
      ctx.moveTo(64, 128 - h + 10);
      ctx.lineTo(64 - s, 128 - h - 10);
      ctx.lineTo(64 - s, 128 - h + 30);
      ctx.lineTo(64, 128 - h + 20);
      ctx.fill();
    }
  } else if (type === 'scythe') {
    const h = 110;
    rect(62, 128 - h, 4, h, cWood);
    ctx.fillStyle = cMet;
    ctx.beginPath();
    ctx.arc(64, 128 - h, 35, Math.PI, Math.PI * 1.8);
    ctx.lineTo(64, 128 - h);
    ctx.fill();
  } else if (type === 'katana') {
    const l = 80 + vTier * 5;
    rect(62, 120, 4, 15, cDark);
    ctx.strokeStyle = cMet;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(64, 120);
    ctx.quadraticCurveTo(70, 120 - l / 2, 64, 120 - l);
    ctx.stroke();
  } else if (type === 'flail') {
    rect(62, 100, 4, 28, cWood);
    ctx.strokeStyle = cDark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(64, 100);
    ctx.quadraticCurveTo(80, 90, 80, 70);
    ctx.stroke();
    const r = 12 + vTier * 2;
    circ(80, 70, r, cDark);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      ctx.fillStyle = cMet;
      ctx.beginPath();
      ctx.moveTo(80, 70);
      ctx.lineTo(80 + Math.cos(a) * r * 1.5, 70 + Math.sin(a) * r * 1.5);
      ctx.lineTo(80 + Math.cos(a + 0.5) * r * 0.5, 70 + Math.sin(a + 0.5) * r * 0.5);
      ctx.fill();
    }
  } else if (type === 'gauntlets') {
    rect(54, 100, 20, 20, cDark);
    rect(54, 100, 20, 5, cMet);
    rect(54, 115, 20, 5, cMet);
    ctx.fillStyle = cGold;
    ctx.beginPath();
    ctx.moveTo(54, 110);
    ctx.lineTo(44, 110);
    ctx.lineTo(54, 105);
    ctx.fill();
  } else if (type === 'grimoire') {
    rect(50, 90, 28, 38, cDark);
    ctx.fillStyle = '#fff';
    ctx.fillRect(52, 92, 24, 34);
    ctx.fillStyle = cMain;
    ctx.font = '20px serif';
    ctx.fillText('⚡', 54, 115);
    rect(48, 90, 4, 38, cGold);
  } else if (type === 'scepter') {
    const h = 100;
    rect(62, 128 - h, 4, h, cWood);
    const r = 10 + vTier * 2;
    circ(64, 128 - h, r, cGold);
    circ(64, 128 - h, r * 0.6, cMain);
    if (vTier >= 1) for (let i = 0; i < vTier; i++) circ(64 + Math.cos(i) * r * 1.5, 128 - h + Math.sin(i) * r * 1.5, 3, '#fff');
  } else if (type === 'hammer') {
    const h = 80;
    rect(60, 128 - h, 8, h, cWood);
    const hw = 40 + vTier * 5, hh = 25 + vTier * 2;
    rect(64 - hw / 2, 128 - h - hh / 2, hw, hh, cDark);
  } else if (type === 'spear') {
    const h = 120;
    rect(62, 128 - h, 4, h, cWood);
    const tl = 30 + vTier * 5;
    ctx.fillStyle = cMet;
    ctx.beginPath();
    ctx.moveTo(62, 128 - h);
    ctx.lineTo(66, 128 - h);
    ctx.lineTo(64, 128 - h - tl);
    ctx.fill();
  } else if (type === 'daggers') {
    const l = 40 + vTier * 3;
    rect(60, 100, 8, 14, cWood);
    rect(56, 96, 16, 4, cDark);
    ctx.fillStyle = cMet;
    ctx.beginPath();
    ctx.moveTo(60, 96);
    ctx.lineTo(68, 96);
    ctx.lineTo(64, 96 - l);
    ctx.fill();
  } else if (type === 'crossbow') {
    rect(60, 60, 8, 60, cWood);
    const w = 60 + vTier * 5;
    ctx.strokeStyle = cDark;
    ctx.beginPath();
    ctx.moveTo(64, 70);
    ctx.quadraticCurveTo(64 - w / 2, 80, 64 - w / 2, 90);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(64, 70);
    ctx.quadraticCurveTo(64 + w / 2, 80, 64 + w / 2, 90);
    ctx.stroke();
    ctx.strokeStyle = cMet;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(64 - w / 2, 90);
    ctx.quadraticCurveTo(64, 70, 64 + w / 2, 90);
    ctx.stroke();
  } else if (type === 'boomerang') {
    const s = 40 + vTier * 4;
    ctx.strokeStyle = cWood;
    ctx.lineWidth = 6 + vTier;
    ctx.beginPath();
    ctx.moveTo(64 - s, 80);
    ctx.quadraticCurveTo(64, 100, 64 + s, 80);
    ctx.stroke();
  } else if (type === 'whip') {
    ctx.strokeStyle = cWood;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(64, 120);
    ctx.quadraticCurveTo(80, 100, 50, 80);
    ctx.quadraticCurveTo(30, 60, 70, 40);
    ctx.stroke();
  } else if (type === 'cards') {
    rect(54, 90, 20, 28, '#fff');
    ctx.fillStyle = 'red';
    ctx.font = '16px serif';
    ctx.fillText('♦', 58, 110);
  } else if (type === 'pistol') {
    rect(60, 100, 8, 20, cWood);
    rect(50, 100, 20, 8, cMet);
    rect(50, 94, 4, 6, cDark);
  } else if (type === 'pipe') { // Scenery
    ctx.fillStyle = '#885533'; ctx.fillRect(28, 10, 8, 54);
    ctx.fillStyle = '#aa7755'; ctx.fillRect(20, 20, 24, 6); ctx.fillRect(20, 40, 24, 6);
  } else if (type === 'alien') { // Scenery
    const base = cMain; 
    ctx.fillStyle = base; ctx.beginPath(); ctx.moveTo(32, 64); ctx.quadraticCurveTo(10, 40, 20, 10); ctx.quadraticCurveTo(54, 40, 32, 64); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.arc(20, 10, 5, 0, Math.PI*2); ctx.fill();
  } else if (type === 'sakura') { // Scenery
    const base = cMain;
    ctx.fillStyle = '#5a3310'; ctx.fillRect(30, 40, 4, 24);
    ctx.fillStyle = base; ctx.beginPath(); ctx.arc(32, 30, 20, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffccdd'; for(let i=0;i<10;i++) { ctx.beginPath(); ctx.arc(20+Math.random()*24, 20+Math.random()*20, 4, 0, Math.PI*2); ctx.fill(); }
  } else if (type === 'fern') { // Scenery
    const base = cMain;
    ctx.fillStyle = '#3a2010'; ctx.fillRect(30, 30, 4, 34);
    ctx.fillStyle = base; 
    for(let i=0;i<5;i++) { ctx.beginPath(); ctx.ellipse(32, 30, 25, 8, i*Math.PI/2.5, 0, Math.PI*2); ctx.fill(); }
  } else if (type === 'palm') { // Scenery
    const base = cMain;
    ctx.fillStyle = '#886644'; ctx.beginPath(); ctx.moveTo(28, 64); ctx.quadraticCurveTo(40, 40, 28, 20); ctx.lineTo(36, 20); ctx.quadraticCurveTo(48, 40, 36, 64); ctx.fill();
    ctx.fillStyle = base;
    for(let i=0;i<6;i++) { ctx.beginPath(); ctx.ellipse(32, 20, 20, 6, i*Math.PI/3, 0, Math.PI*2); ctx.fill(); }
  } else {
    // Default weapon texture
    rect(54, 90, 20, 38, cMain);
  }
  return wepTexCache[k] = new THREE.CanvasTexture(cv);
}
