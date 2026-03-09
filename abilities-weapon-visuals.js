function buildWeapon3D(type, level, isFirstPerson = true) {
  const g = new THREE.Group();
  
  // Store weapon type and parts for animations
  g.userData.type = type;
  g.userData.parts = {};
  const parts = g.userData.parts;
  
  // Get Skin colors
  const skinId = (typeof GameState !== 'undefined' && GameState.saveData && GameState.saveData.equippedCosmetic) ? GameState.saveData.equippedCosmetic : 'default';
  const skin = (typeof COSMETICS !== 'undefined') ? (COSMETICS.find(c => c.id === skinId) || COSMETICS[0]) : {colors:{steel:0x99aacc, wood:0x5a3a20, gold:0xffaa00, dark:0x1a1a1a, blade:0xffffff}};
  const cols = skin.colors;

  // Simple sprite helper
  const addSprite = (color, w, h, x, y, z = 0, shape = 'box', name = null) => {
    const spr = mkSprite(color, w * S, h * S, shape);
    spr.position.set(x, y, z);
    g.add(spr);
    if (name) parts[name] = spr;
    return spr;
  };

  const S = Math.min(1 + level * 0.03, 1.5); // Size scaling by level
  
  // Colors
  const C_Blade = new THREE.Color(cols.blade);
  const C_Steel = new THREE.Color(cols.steel);
  const C_Wood = new THREE.Color(cols.wood);
  const C_Gold = new THREE.Color(cols.gold);
  const C_Dark = new THREE.Color(cols.dark);

  // ====== SWORDS & BLADES ======
  if (type === 'sword' || type === 'greatsword' || type === 'dark_blade') {
    const isGreat = type !== 'sword';
    const bladeH = isGreat ? 2.0 : 1.4;
    const bladeW = isGreat ? 0.18 : 0.12;
    const guardW = isGreat ? 0.5 : 0.35;
    
    const bladeMat = type === 'dark_blade' ? C_Dark : C_Blade;
    
    // BLADE - main visible form
    parts.blade = addSprite(bladeMat, bladeW, bladeH, 0, bladeH * 0.35, 0, 'box', 'blade');
    addSprite(bladeMat.clone().multiplyScalar(1.2), bladeW * 0.08, bladeH * 0.9, 0, bladeH * 0.35, 0.01, 'box');
    
    // GUARD - simple crossguard
    parts.guard = addSprite(C_Gold, guardW, 0.12, 0, 0.12, 0, 'box', 'guard');
    
    // HANDLE
    addSprite(C_Wood, 0.09, 0.4, 0, -0.15, 0, 'box');
    
    // POMMEL - gem accent
    addSprite(C_Gold, 0.12, 0.12, 0, -0.38, 0, 'circle');

  } else if (type === 'rapier') {
    // Thin elegant blade
    parts.blade = addSprite(C_Blade, 0.06, 1.6, 0, 0.85, 0, 'box', 'blade');
    
    // Cup guard - distinctive detail
    parts.guard = addSprite(C_Gold, 0.28, 0.28, 0, 0.08, 0, 'circle', 'guard');
    
    // Handle
    addSprite(C_Wood, 0.08, 0.3, 0, -0.1, 0, 'box');
    addSprite(C_Gold, 0.1, 0.01, 0, -0.02, 0.01, 'box');
    
    // Pommel
    addSprite(C_Gold, 0.1, 0.1, 0, -0.35, 0, 'circle');

  } else if (type === 'katana') {
    // Curved blade positioned to the side
    parts.blade = addSprite(C_Blade, 0.09, 1.5, 0.05, 0.85, 0, 'box', 'blade');
    
    // Round guard (Tsuba)
    parts.guard = addSprite(C_Dark, 0.2, 0.2, 0, 0.08, 0, 'circle', 'guard');
    
    // Handle
    addSprite(C_Wood, 0.08, 0.35, 0, -0.1, 0, 'box');
    addSprite(C_Gold, 0.09, 0.01, 0, -0.05, 0.01, 'box');
    
    // Pommel
    addSprite(C_Gold, 0.1, 0.1, 0, -0.35, 0, 'circle');

  } else if (type === 'needle') {
    // Very thin blade
    parts.blade = addSprite(C_Steel, 0.03, 1.8, 0, 0.9, 0, 'box', 'blade');
    
    // Guard
    parts.guard = addSprite(C_Gold, 0.18, 0.07, 0, 0.08, 0, 'box', 'guard');
    
    // Handle
    addSprite(C_Wood, 0.05, 0.25, 0, -0.15, 0, 'box');
    addSprite(C_Gold, 0.06, 0.06, 0, -0.35, 0, 'circle');

  } else if (type === 'axe' || type === 'cleaver') {
    const isCleaver = type === 'cleaver';
    
    // HANDLE
    parts.blade = addSprite(C_Wood, 0.08, 1.1, 0, 0.1, 0, 'box');
    
    if (isCleaver) {
      // Wide single blade
      addSprite(C_Steel, 0.38, 0.55, 0.15, 0.65, 0, 'box');
    } else {
      // Double axe blades on both sides
      addSprite(C_Steel, 0.35, 0.3, 0.15, 0.7, 0, 'box');
      addSprite(C_Steel, 0.35, 0.3, -0.15, 0.7, 0, 'box');
    }
    
    // Detail band
    addSprite(C_Gold, 0.09, 0.02, 0, 0.4, 0.01, 'box');

  } else if (type === 'hammer' || type === 'mace') {
    // HANDLE
    addSprite(C_Wood, 0.08, 0.85, 0, 0.05, 0, 'box');
    
    if (type === 'mace') {
      // Spiked sphere
      parts.head = addSprite(C_Steel, 0.25, 0.25, 0, 0.7, 0, 'circle', 'head');
      // 3 characteristic spikes
      addSprite(C_Steel, 0.05, 0.12, 0, 0.85, 0.01, 'tri');
      addSprite(C_Steel, 0.05, 0.12, 0.13, 0.65, 0.01, 'tri');
      addSprite(C_Steel, 0.05, 0.12, -0.13, 0.65, 0.01, 'tri');
    } else {
      // Hammer head
      parts.head = addSprite(C_Steel, 0.45, 0.25, 0, 0.7, 0, 'box', 'head');
    }

  } else if (type === 'wrench') {
    const C_Iron = new THREE.Color(0x444444);
    
    // Handle
    addSprite(C_Iron, 0.08, 0.8, 0, -0.05, 0, 'box');
    
    // Head
    parts.head = addSprite(C_Iron, 0.35, 0.15, 0, 0.65, 0, 'box', 'head');
    
    // Jaws
    addSprite(C_Iron, 0.08, 0.2, -0.12, 0.75, 0.01, 'box');
    addSprite(C_Iron, 0.08, 0.2, 0.12, 0.75, 0.01, 'box');

  } else if (type === 'spear' || type === 'trident' || type === 'javelin') {
    // SHAFT
    addSprite(C_Wood, 0.06, 1.65, 0, 0, 0, 'box');
    
    if (type === 'trident') {
      // Three prongs
      parts.blade = addSprite(C_Steel, 0.05, 0.35, 0, 1.1, 0, 'tri', 'blade');
      addSprite(C_Steel, 0.04, 0.25, 0.12, 0.95, 0.01, 'tri');
      addSprite(C_Steel, 0.04, 0.25, -0.12, 0.95, 0.01, 'tri');
      addSprite(C_Gold, 0.25, 0.06, 0, 0.85, 0.01, 'box');
    } else if (type === 'javelin') {
      parts.blade = addSprite(C_Steel, 0.06, 0.4, 0, 1.1, 0, 'tri', 'blade');
    } else {
      // Standard spear
      parts.blade = addSprite(C_Steel, 0.08, 0.4, 0, 1.1, 0, 'tri', 'blade');
      addSprite(C_Gold, 0.11, 0.08, 0, 0.88, 0.01, 'circle');
    }
    
    // Band detail
    addSprite(C_Gold, 0.07, 0.01, 0, 0.4, 0.01, 'box');

  } else if (type === 'scepter' || type === 'void_staff' || type === 'fire_staff' || type === 'sun_staff' || type === 'lightning_rod') {
    const shaftCol = type === 'void_staff' ? C_Dark : C_Wood;
    
    // SHAFT
    addSprite(shaftCol, 0.07, 1.4, 0, 0, 0, 'box');
    
    // GEM HEAD - the distinctive part
    let gemCol = new THREE.Color(0x00ffff);
    if (type === 'fire_staff') gemCol = new THREE.Color(0xff4400);
    if (type === 'sun_staff') gemCol = new THREE.Color(0xffff00);
    if (type === 'void_staff') gemCol = new THREE.Color(0xcc00ff);
    if (type === 'lightning_rod') gemCol = new THREE.Color(0xffff00);
    
    parts.gem = addSprite(gemCol, 0.28, 0.28, 0, 0.8, 0, 'circle', 'gem');
    
    if (type === 'sun_staff') {
      addSprite(C_Gold, 0.35, 0.35, 0, 0.8, -0.01, 'circle');
      addSprite(gemCol, 0.08, 0.15, 0, 0.98, 0.01, 'tri');
    } else if (type === 'lightning_rod') {
      addSprite(gemCol, 0.18, 0.35, 0, 0.88, 0.01, 'tri');
    }
    
    addSprite(C_Gold, 0.07, 0.01, 0, 0.35, 0.01, 'box');

  } else if (type === 'bow' || type === 'crossbow' || type === 'greatbow' || type === 'ice_bow') {
    const bowCol = type === 'ice_bow' ? new THREE.Color(0xaaddff) : C_Wood;
    
    if (type === 'crossbow') {
      // Stock
      addSprite(C_Wood, 0.11, 0.65, 0, -0.1, 0, 'box');
      
      // Prod (bow arms)
      parts.blade = addSprite(C_Steel, 0.5, 0.085, 0, 0.08, 0, 'box', 'blade');
      
      // String
      addSprite(C_Steel, 0.01, 0.6, 0, 0.35, 0.01, 'box');
    } else {
      const sz = type === 'greatbow' ? 1.6 : 1.2;
      
      // Upper limb
      addSprite(bowCol, 0.08, sz * 0.45, 0.04, sz * 0.25, 0, 'box');
      
      // Lower limb
      addSprite(bowCol, 0.08, sz * 0.45, 0.04, -sz * 0.25, 0, 'box');
      
      // Grip
      addSprite(C_Wood, 0.1, 0.25, 0, 0, 0, 'box');
      
      // String
      addSprite(C_Steel, 0.008, sz * 1.1, -0.05, 0, 0.01, 'box');
    }

  } else if (type === 'scythe') {
    // HANDLE
    addSprite(C_Wood, 0.07, 1.55, 0, 0, 0, 'box');
    
    // CURVED BLADE to the side
    parts.blade = addSprite(C_Steel, 0.55, 0.12, 0.25, 0.8, 0, 'box', 'blade');
    
    // Guard detail
    addSprite(C_Gold, 0.08, 0.12, 0, 0.7, 0.01, 'box');

  } else if (type === 'flail') {
    // HANDLE
    addSprite(C_Wood, 0.07, 0.65, 0, -0.15, 0, 'box');
    
    // CHAIN
    addSprite(C_Steel, 0.02, 0.35, 0.05, 0.35, 0.01, 'box');
    
    // BALL
    parts.ball = addSprite(C_Steel, 0.22, 0.22, 0.12, 0.58, 0, 'circle', 'ball');
    addSprite(C_Steel, 0.05, 0.08, 0.12, 0.72, 0.01, 'tri');

  } else if (type === 'whip') {
    // HANDLE
    addSprite(C_Wood, 0.07, 0.35, 0, -0.2, 0, 'box');
    
    // WHIP COIL
    addSprite(new THREE.Color(0x8b5a35), 0.24, 0.24, 0, 0.25, 0, 'circle');

  } else if (type === 'boomerang') {
    // Curved throw weapon
    addSprite(new THREE.Color(0xb8860b), 0.58, 0.08, 0, 0.15, 0, 'box');
    addSprite(new THREE.Color(0xff8800), 0.12, 0.06, 0.2, 0.15, 0.01, 'box');
    addSprite(new THREE.Color(0xff8800), 0.12, 0.06, -0.2, 0.15, 0.01, 'box');

  } else if (type === 'gauntlets' || type === 'claws') {
    // GAUNTLET
    parts.blade = addSprite(C_Dark, 0.28, 0.28, 0, 0, 0, 'box', 'blade');
    addSprite(C_Gold, 0.31, 0.04, 0, 0.14, 0.01, 'box');
    
    if (type === 'claws') {
      // Claws
      addSprite(C_Steel, 0.05, 0.22, 0.1, 0.22, 0.01, 'tri');
      addSprite(C_Steel, 0.05, 0.22, -0.1, 0.22, 0.01, 'tri');
      addSprite(C_Steel, 0.05, 0.18, 0, 0.26, 0.01, 'tri');
    } else {
      // Knuckle gems
      addSprite(new THREE.Color(0xff8800), 0.08, 0.08, 0.1, 0.08, 0.01, 'circle');
      addSprite(new THREE.Color(0xff8800), 0.08, 0.08, -0.1, 0.08, 0.01, 'circle');
    }

  } else if (type === 'cards') {
    // CARD deck
    parts.blade = addSprite(C_Blade, 0.18, 0.25, 0, 0.2, 0, 'box', 'blade');
    addSprite(new THREE.Color(0xaa2222), 0.1, 0.13, 0, 0.2, 0.01, 'box');

  } else if (type === 'shuriken') {
    // NINJA star (4 points)
    addSprite(C_Steel, 0.32, 0.05, 0, 0.2, 0, 'box');
    addSprite(C_Steel, 0.05, 0.32, 0, 0.2, 0, 'box');
    addSprite(C_Gold, 0.08, 0.08, 0, 0.2, 0.01, 'diamond');

  } else if (type === 'potion') {
    // BOTTLE
    const potCol = new THREE.Color(0x00ff00);
    parts.gem = addSprite(potCol, 0.26, 0.26, 0, 0.25, 0, 'circle', 'gem');
    addSprite(C_Steel, 0.06, 0.09, 0, 0.4, 0.01, 'box');
    addSprite(potCol.clone().multiplyScalar(1.3), 0.4, 0.4, 0, 0.25, -0.01, 'circle');

  } else if (type === 'runestone') {
    // CRYSTAL
    const rCol = new THREE.Color(0x00ffff);
    parts.gem = addSprite(rCol, 0.24, 0.24, 0, 0.2, 0, 'box', 'gem');
    addSprite(rCol.clone().multiplyScalar(1.3), 0.14, 0.14, 0, 0.2, 0.01, 'diamond');

  } else if (type === 'bomb') {
    // SPHERE with fuse
    parts.head = addSprite(new THREE.Color(0x1a1a1a), 0.28, 0.28, 0, 0.25, 0, 'circle', 'head');
    addSprite(new THREE.Color(0xaa6644), 0.04, 0.1, 0, 0.4, 0.01, 'box');
    addSprite(C_Steel, 0.05, 0.08, 0.13, 0.28, 0.01, 'tri');

  } else if (type === 'shield') {
    // SHIELD
    parts.head = addSprite(C_Steel, 0.55, 0.72, 0, 0.2, 0, 'box', 'head');
    addSprite(C_Gold, 0.6, 0.78, 0, 0.2, -0.01, 'box');
    addSprite(new THREE.Color(0xff2222), 0.12, 0.12, 0, 0.15, 0.01, 'circle');

  } else if (type === 'totem') {
    // Pole with head
    addSprite(new THREE.Color(0x6b5535), 0.18, 1.15, 0, 0.3, 0, 'box');
    addSprite(new THREE.Color(0xdd4444), 0.32, 0.28, 0, 0.7, 0, 'box');
    addSprite(new THREE.Color(0xff6666), 0.13, 0.13, 0, 0.78, 0.01, 'circle');

  } else if (type === 'mirror') {
    // MIRROR surface
    parts.head = addSprite(new THREE.Color(0xf0f0f0), 0.32, 0.5, 0, 0.35, 0, 'box', 'head');
    addSprite(C_Gold, 0.36, 0.55, 0, 0.35, -0.01, 'box');
    
    // Handle
    addSprite(new THREE.Color(0xaa6644), 0.065, 0.28, 0, 0.05, 0.01, 'box');

  } else if (type === 'needles') {
    // BUNDLE of needles
    parts.blade = addSprite(C_Steel, 0.02, 0.4, 0, 0.25, 0, 'box', 'blade');
    addSprite(C_Steel, 0.02, 0.4, 0.08, 0.26, 0.01, 'box');
    addSprite(C_Steel, 0.02, 0.4, -0.08, 0.26, 0.01, 'box');
    addSprite(C_Gold, 0.11, 0.11, 0, -0, 0.01, 'circle');

  } else if (type === 'dagger_sac') {
    // CLOTH satchel with daggers
    addSprite(new THREE.Color(0xcc2222), 0.13, 0.5, 0, 0.25, 0, 'box');
    addSprite(C_Wood, 0.065, 0.24, 0, 0.04, 0, 'box');
    addSprite(C_Steel, 0.01, 0.15, 0.05, 0.48, 0.01, 'tri');
    addSprite(C_Steel, 0.01, 0.15, -0.05, 0.48, 0.01, 'tri');

  } else if (type === 'drill') {
    // Spiral drill bit
    parts.blade = addSprite(C_Dark, 0.2, 0.6, 0, 0.4, 0, 'tri', 'blade');
    addSprite(C_Dark, 0.15, 0.02, 0, 0.25, 0.01, 'box');
    addSprite(C_Dark, 0.15, 0.02, 0, 0.12, 0.01, 'box');
    addSprite(new THREE.Color(0x444444), 0.28, 0.3, 0, 0.75, 0, 'box');

  } else if (type === 'star_globe') {
    // Celestial sphere
    const gCol = new THREE.Color(0xffd700);
    parts.gem = addSprite(gCol, 0.26, 0.26, 0, 0.4, 0, 'circle', 'gem');
    addSprite(gCol.clone().multiplyScalar(0.6), 0.15, 0.15, 0, 0.4, 0.01, 'circle');
    addSprite(new THREE.Color(0xffffaa), 0.06, 0.06, 0, 0.52, 0.02, 'circle');

  } else if (type === 'balls') {
    // Juggling balls
    addSprite(new THREE.Color(0xff2222), 0.18, 0.18, 0, 0.15, 0, 'circle');
    addSprite(new THREE.Color(0x00ffff), 0.18, 0.18, 0.16, 0.33, 0, 'circle');
    addSprite(new THREE.Color(0xff0000).clone().multiplyScalar(0.4), 0.32, 0.32, 0, 0.15, -0.01, 'circle');

  } else if (type === 'rock') {
    // Stone
    parts.head = addSprite(new THREE.Color(0x5a5a5a), 0.3, 0.3, 0, 0.25, 0, 'box', 'head');
    addSprite(new THREE.Color(0x6a6a6a), 0.26, 0.26, 0, 0.25, 0.01, 'diamond');

  } else if (type === 'hourglass') {
    // Sand timer
    parts.gem = addSprite(C_Gold, 0.25, 0.25, 0, 0.15, 0, 'diamond', 'gem');
    addSprite(new THREE.Color(0xffdd00), 0.18, 0.1, 0, 0.28, 0.01, 'tri');
    addSprite(new THREE.Color(0xffdd00), 0.16, 0.08, 0, 0.05, 0.01, 'tri');

  } else if (type === 'leaf_blade') {
    // Leaf-shaped blade
    parts.blade = addSprite(new THREE.Color(0x00aa44), 0.11, 1.4, 0, 0.75, 0, 'diamond', 'blade');
    addSprite(C_Gold, 0.32, 0.05, 0, 0.18, 0.01, 'box');
    addSprite(new THREE.Color(0x003300), 0.065, 0.35, 0, -0.05, 0, 'box');

  } else if (type === 'lute') {
    // Musical instrument
    const lCol = new THREE.Color(0xb8860b);
    parts.head = addSprite(lCol, 0.32, 0.38, 0, 0.25, 0, 'circle', 'head');
    addSprite(lCol, 0.05, 0.6, 0, 0.6, 0, 'box');
    addSprite(new THREE.Color(0xfffff0), 0.22, 0.01, 0, 0.35, 0.01, 'box');

  } else if (type === 'pistol' || type === 'revolver' || type === 'rifle' || type === 'blowgun') {
    if (type === 'blowgun') {
      // Long tube
      parts.blade = addSprite(C_Wood, 0.045, 1.15, 0, 0.3, 0, 'box', 'blade');
    } else {
      const barrelLen = type === 'rifle' ? 0.8 : 0.38;
      
      // Barrel
      parts.blade = addSprite(C_Dark, 0.05, barrelLen, 0, 0.25, 0, 'box', 'blade');
      
      // Body
      addSprite(C_Dark, 0.11, 0.13, 0, 0.06, 0.01, 'box');
      
      // Grip
      addSprite(C_Wood, 0.08, 0.15, 0, -0.1, 0, 'box');
      
      if (type === 'rifle') {
        addSprite(C_Wood, 0.08, 0.24, 0, -0.28, 0, 'box');
      }
      if (type === 'revolver') {
        addSprite(C_Steel, 0.1, 0.1, 0, 0.06, 0.01, 'circle');
      }
    }

  } else if (type === 'grimoire') {
    // Book
    parts.head = addSprite(new THREE.Color(0x6a4a35), 0.48, 0.65, 0, 0.15, 0, 'box', 'head');
    addSprite(C_Gold, 0.52, 0.7, 0, 0.15, -0.01, 'box');
    addSprite(new THREE.Color(0x00ffff), 0.12, 0.12, 0, 0.28, 0.01, 'diamond');
    addSprite(new THREE.Color(0xff00ff), 0.06, 0.06, -0.1, 0.08, 0.02, 'circle');

  } else if (type === 'ice_bow') {
    // Blue bow
    const bowCol = new THREE.Color(0xaaddff);
    const sz = 1.25;
    
    addSprite(bowCol, 0.08, sz * 0.42, 0.04, sz * 0.22, 0, 'box');
    addSprite(bowCol, 0.08, sz * 0.42, 0.04, -sz * 0.22, 0, 'box');
    addSprite(C_Wood, 0.1, 0.22, 0, 0, 0, 'box');
    addSprite(bowCol.clone().multiplyScalar(1.2), 0.007, sz * 1.0, -0.05, 0, 0, 'box');

  } else {
    // DEFAULT fallback
    addSprite(C_Wood, 0.08, 0.9, 0, 0.2, 0, 'box');
    addSprite(C_Steel, 0.09, 0.15, 0, 0.65, 0.01, 'box');
  }

  // Orient for viewmodel (Y up, -Z forward) - only for 1st person view
  if (isFirstPerson) {
    g.rotation.x = -Math.PI / 2;
    g.rotation.z = Math.PI / 8;
    g.rotation.y = Math.PI / 8;
  }

  return g;
  if (isFirstPerson) {
    g.rotation.x = -Math.PI / 2;
    g.rotation.z = Math.PI / 8;
    g.rotation.y = Math.PI / 8;
  }

  return g;
}

function createVM(type) {
  if (vm) camera.remove(vm);
  vm = new THREE.Group();
  camera.add(vm);
  vm.position.set(0.4, -0.3, -0.5);
  updateWeaponVisuals();
}

function updateWeaponVisuals() {
  if (GameState.galleryMode) return;
  let t = 'sword', l = 1;

  // Détection dynamique de l'arme active
  for (const k in WEAPONS) {
    if (WEAPONS[k].active) {
      t = k.toLowerCase();
      l = WEAPONS[k].level || 1;
      break;
    }
  }

  if (window.vmModel && vm) vm.remove(window.vmModel);
  window.vmModel = buildWeapon3D(t, l);
  window.vmModel.scale.set(1.0, 1.0, 1.0);
  window.vmModel.rotation.set(-Math.PI/4, 0, 0);
  if (vm) vm.add(window.vmModel);

  // 3rd Person Weapon Attachment
  if (typeof playerParts !== 'undefined') {
      // Hide sprite weapons if present
      if (playerParts.weapon) playerParts.weapon.visible = false;
      if (playerParts.weapon2) playerParts.weapon2.visible = false;
      
      // Remove old 3D weapon
      if (window.tpWeapon) {
          if (window.tpWeapon.parent) window.tpWeapon.parent.remove(window.tpWeapon);
          window.tpWeapon = null;
      }
      
      // Determine weapon scale based on type
      const getWeaponScale = (type) => {
        // Very large weapons - almost as tall as player
        if (type.includes('greatsword') || type.includes('scythe') || type.includes('greatbow')) return 0.9;
        
        // Large weapons - 70-80% of player height
        if (type.includes('sword') || type.includes('axe') || type.includes('hammer') || type.includes('mace') || 
            type.includes('spear') || type.includes('trident') || type.includes('staff') || 
            type.includes('drill') || type.includes('javelin') || type.includes('pike')) return 0.75;
        
        // Medium weapons - 50-65% of player height
        if (type.includes('bow') || type.includes('crossbow') || type.includes('rapier') || type.includes('katana') || 
            type.includes('flail') || type.includes('whip') || type.includes('grimoire') || type.includes('lute')) return 0.58;
        
        // Small weapons - 25-45% (hand-sized)
        if (type.includes('dagger') || type.includes('card') || type.includes('claw') || type.includes('gauntlet') || 
            type.includes('needle') || type.includes('shuriken') || type.includes('pistol') || type.includes('rifle') || 
            type.includes('revolver') || type.includes('blowgun') || type.includes('mirror') || type.includes('scepter') ||
            type.includes('torch') || type.includes('wand') || type.includes('fire_staff') || type.includes('void_staff') ||
            type.includes('sun_staff') || type.includes('ice_bow') || type.includes('lightning_rod') || type.includes('leaf_blade') ||
            type.includes('potion') || type.includes('bomb') || type.includes('runestone') || type.includes('dagger_sac')) return 0.35;
        
        // Very small weapons
        if (type.includes('ball') || type.includes('rock') || type.includes('hourglass') || type.includes('boomerang') || 
            type.includes('star_globe') || type.includes('light')) return 0.25;
        
        // Default
        return 0.5;
      };
      
      // Create new 3D weapon (3rd person - no viewmodel rotation)
      window.tpWeapon = buildWeapon3D(t, l, false);
      const S = (typeof playerTypeData !== 'undefined' && playerTypeData.S) ? playerTypeData.S : 1.0;
      const weaponScale = getWeaponScale(t);
      const baseWeaponScale = 1.2; // Base multiplier - reduced now that viewmodel rotation is removed
      const desiredTpScale = weaponScale * baseWeaponScale * S;
      window.tpWeapon.scale.set(desiredTpScale, desiredTpScale, desiredTpScale);
      
      // Reset rotation from buildWeapon3D default
      window.tpWeapon.rotation.set(0, 0, 0);

      let parent = playerParts.handR;
      if (!parent && playerParts.armRD && playerParts.armRD.visible) parent = playerParts.armRD;
      if (!parent && playerParts.armR && playerParts.armR.visible) parent = playerParts.armR;
      if (!parent && playerParts.armRU && playerParts.armRU.visible) parent = playerParts.armRU;
      if (!parent) parent = playerParts.torso;

      // Left hand for bows and two-handed weapons
      if (t.includes('bow') || t.includes('crossbow') || t.includes('staff') || t.includes('spear') || 
          t.includes('trident') || t.includes('greatbow') || t.includes('scythe') || t.includes('grimoire')) {
          parent = playerParts.handL;
          if (!parent && playerParts.armLD && playerParts.armLD.visible) parent = playerParts.armLD;
          if (!parent && playerParts.armL && playerParts.armL.visible) parent = playerParts.armL;
          if (!parent && playerParts.armLU && playerParts.armLU.visible) parent = playerParts.armLU;
          if (!parent) parent = playerParts.torso;
      }

      if (parent) {
          parent.add(window.tpWeapon);

          // Compensate parent limb scale so weapon keeps realistic world size.
          const px = Math.max(0.001, Math.abs(parent.scale && parent.scale.x ? parent.scale.x : 1));
          const py = Math.max(0.001, Math.abs(parent.scale && parent.scale.y ? parent.scale.y : 1));
          const pz = Math.max(0.001, Math.abs(parent.scale && parent.scale.z ? parent.scale.z : 1));
          window.tpWeapon.scale.set(desiredTpScale / px, desiredTpScale / py, desiredTpScale / pz);
          
          // Position weapon in hand with length extending down arm
          if (parent === playerParts.handR || parent === playerParts.handL) {
              // Hand attachment - weapon extends from hand
              window.tpWeapon.position.set(0, -0.5 * weaponScale * S, 0.05 * S);
              window.tpWeapon.rotation.set(Math.PI/2, 0, 0);
              
          } else if (parent === playerParts.armRD || parent === playerParts.armLD) {
              // Lower arm attachment
              window.tpWeapon.position.set(0, -0.55 * weaponScale * S, 0.08 * S);
              window.tpWeapon.rotation.set(Math.PI/2, -Math.PI/2, 0);
              
              if (t.includes('bow') || t.includes('crossbow')) {
                  window.tpWeapon.rotation.set(Math.PI/2, 0, Math.PI/2);
                  window.tpWeapon.position.set(0, -0.5 * weaponScale * S, 0);
              } else if (t.includes('staff') || t.includes('spear') || t.includes('trident') || t.includes('scythe')) {
                  window.tpWeapon.rotation.set(Math.PI/2, 0, 0);
                  window.tpWeapon.position.set(0, -0.6 * weaponScale * S, 0.15 * S);
              } else if (t.includes('grimoire')) {
                  window.tpWeapon.rotation.set(Math.PI/4, 0, 0);
                  window.tpWeapon.position.set(0, -0.35 * weaponScale * S, 0.1 * S);
              }
          } else if (parent === playerParts.armRU || parent === playerParts.armLU || parent === playerParts.armR || parent === playerParts.armL) {
              // Upper arm or single arm attachment (Beast/Mech)
              window.tpWeapon.position.set(0, -0.5 * weaponScale * S, 0.15 * S);
              window.tpWeapon.rotation.set(Math.PI/2, -Math.PI/2, 0);
              
              if (t.includes('claws') || t.includes('gauntlets')) {
                   window.tpWeapon.position.set(0, -0.25 * S, 0);
                   window.tpWeapon.rotation.set(Math.PI/2, -Math.PI/2, -Math.PI/2);
              }
          } else {
              // Fallback to torso attachment
              window.tpWeapon.position.set(0.5 * S, -0.2 * S, 0.5 * S);
              window.tpWeapon.rotation.set(Math.PI/2, 0, 0);
          }
      }
  }
}

// ==================== FIRE INPUT ====================
