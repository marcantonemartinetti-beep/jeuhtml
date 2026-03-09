// ═══════════════════════════════════════════════
// DUNGEON WORLD - GALLERY
// ═══════════════════════════════════════════════

function openGallery() {
  if (window.event) window.event.stopPropagation();
  GameState.galleryMode = true;
  document.getElementById('selContainer').style.display = 'none';
  document.getElementById('startBtn').style.display = 'none';
  document.querySelector('.ctrl').style.display = 'none';
  const mg = document.getElementById('menuGrid');
  if (mg) mg.style.display = 'none';
  else {
    document.getElementById('galleryBtn').style.display = 'none';
  }
  document.getElementById('galleryUI').style.display = 'flex';
  showGalCat('enemies', document.querySelector('.gal-btn.active'));
  document.getElementById('main').style.zIndex = '400';
  document.getElementById('main').style.pointerEvents = 'none';
  if(window.galleryPivot && typeof scene !== 'undefined') scene.add(window.galleryPivot);
}

function closeGallery() {
  GameState.galleryMode = false;
  document.getElementById('selContainer').style.display = 'flex';
  document.getElementById('startBtn').style.display = 'block';
  document.querySelector('.ctrl').style.display = 'block';
  const mg = document.getElementById('menuGrid');
  if (mg) mg.style.display = 'grid';
  else {
    document.getElementById('galleryBtn').style.display = 'block';
  }
  document.getElementById('galleryUI').style.display = 'none';
  document.getElementById('main').style.zIndex = '';
  document.getElementById('main').style.pointerEvents = '';
  if(window.galleryPivot && typeof scene !== 'undefined') scene.remove(window.galleryPivot);
}

function showGalCat(cat, btn) {
  if (btn) {
    document.querySelectorAll('.gal-cats .gal-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const lst = document.getElementById('galList');
  if (!lst) return;
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
  if (!info) return;

  if (type === 'enemy') {
    const t = MTYPES[id];
    if (!t) return;
    const { g } = buildPuppet(t);
    const box = new THREE.Box3().setFromObject(g);
    const center = box.getCenter(new THREE.Vector3());
    g.position.sub(center);
    window.galleryPivot.add(g);
    info.innerHTML = `<b>${t.name}</b><br>HP: ${t.hp} · DMG: ${t.dmg} · SPD: ${t.spd}`;
  } else if (type === 'class') {
    const c = CLASSES[id];
    if (!c) return;
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
    if (!b) return;
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
    if (!u) return;
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
  } else if (type === 'weapon' && typeof buildWeapon3D === 'function') {
    const g = buildWeapon3D(id, 10);
    g.scale.set(1.5, 1.5, 1.5);
    window.galleryPivot.add(g);
    info.innerHTML = `<b>${id.toUpperCase()}</b>`;
  }
}
