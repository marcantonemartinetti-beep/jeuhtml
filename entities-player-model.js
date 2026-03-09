// ==================== SPRITE WEAPON BUILDER ====================
function buildSpriteWeapon(weaponType, armPart, S = 1.0) {
  if (!weaponType || !armPart) return null;
  
  const addAcc = (parent, child, x, y, z) => {
    child.position.set(x, y, z);
    parent.add(child);
    return child;
  };
  
  // Weapon colors
  const C_Blade = 0xffffff;
  const C_Steel = 0x99aacc;
  const C_Wood = 0x5a3a20;
  const C_Gold = 0xffaa00;
  const C_Dark = 0x1a1a1a;
  
  const parts = {};
  
  // SWORDS & BLADES
  if (weaponType === 'sword' || weaponType === 'greatsword' || weaponType === 'dark_blade') {
    const isGreat = weaponType !== 'sword';
    const bladeH = isGreat ? 1.5 : 1.0;
    const bladeW = isGreat ? 0.14 : 0.09;
    const bladeMat = weaponType === 'dark_blade' ? C_Dark : C_Blade;
    
    parts.handle = mkSprite(C_Wood, bladeW * S, bladeH * S);
    addAcc(armPart, parts.handle, 0, -0.4 * S, 0.1);
    parts.blade = mkSprite(bladeMat, (bladeW * 0.8) * S, (bladeH * 0.7) * S);
    addAcc(armPart, parts.blade, 0, (-0.4 - bladeH * 0.5) * S, 0.11);
    parts.guard = mkSprite(C_Gold, 0.3 * S, 0.08 * S);
    addAcc(armPart, parts.guard, 0, (-0.1) * S, 0.11);
    
  } else if (weaponType === 'rapier') {
    parts.handle = mkSprite(C_Wood, 0.06 * S, 0.35 * S);
    addAcc(armPart, parts.handle, 0, -0.15 * S, 0.1);
    parts.blade = mkSprite(C_Blade, 0.04 * S, 1.2 * S);
    addAcc(armPart, parts.blade, 0, -0.7 * S, 0.11);
    parts.guard = mkSprite(C_Gold, 0.2 * S, 0.2 * S, 'circle');
    addAcc(armPart, parts.guard, 0, 0.05 * S, 0.11);
    
  } else if (weaponType === 'katana') {
    parts.handle = mkSprite(C_Dark, 0.07 * S, 0.35 * S);
    addAcc(armPart, parts.handle, 0, -0.15 * S, 0.1);
    parts.blade = mkSprite(C_Blade, 0.07 * S, 1.3 * S);
    addAcc(armPart, parts.blade, 0.04 * S, -0.75 * S, 0.11);
    parts.guard = mkSprite(C_Gold, 0.18 * S, 0.18 * S, 'circle');
    addAcc(armPart, parts.guard, 0, 0.08 * S, 0.11);
    
  } else if (weaponType === 'axe' || weaponType === 'cleaver') {
    const isCleaver = weaponType === 'cleaver';
    parts.handle = mkSprite(C_Wood, 0.1 * S, 1.0 * S);
    addAcc(armPart, parts.handle, 0, -0.4 * S, 0.1);
    if (isCleaver) {
      parts.blade = mkSprite(C_Steel, 0.35 * S, 0.45 * S);
      addAcc(armPart, parts.blade, 0.15 * S, -0.75 * S, 0.11);
    } else {
      parts.blade = mkSprite(C_Steel, 0.4 * S, 0.3 * S, 'tri');
      parts.blade.rotation.z = Math.PI / 2;
      addAcc(armPart, parts.blade, 0.1 * S, -0.8 * S, 0.11);
    }
    
  } else if (weaponType === 'hammer' || weaponType === 'mace') {
    parts.handle = mkSprite(C_Wood, 0.1 * S, 1.0 * S);
    addAcc(armPart, parts.handle, 0, -0.4 * S, 0.1);
    if (weaponType === 'mace') {
      parts.head = mkSprite(C_Steel, 0.25 * S, 0.25 * S, 'circle');
      addAcc(armPart, parts.head, 0, -0.82 * S, 0.11);
    } else {
      parts.head = mkSprite(C_Steel, 0.4 * S, 0.3 * S);
      addAcc(armPart, parts.head, 0, -0.8 * S, 0.11);
    }
    
  } else if (weaponType === 'wrench') {
    parts.handle = mkSprite(0x444444, 0.08 * S, 0.8 * S);
    addAcc(armPart, parts.handle, 0, -0.3 * S, 0.1);
    parts.head = mkSprite(0x444444, 0.3 * S, 0.15 * S);
    addAcc(armPart, parts.head, 0, -0.7 * S, 0.11);
    
  } else if (weaponType === 'spear' || weaponType === 'trident' || weaponType === 'javelin') {
    parts.handle = mkSprite(C_Wood, 0.06 * S, 1.4 * S);
    addAcc(armPart, parts.handle, 0, -0.5 * S, 0.1);
    if (weaponType === 'trident') {
      parts.blade = mkSprite(C_Steel, 0.05 * S, 0.3 * S, 'tri');
      addAcc(armPart, parts.blade, 0, -1.15 * S, 0.11);
      addAcc(armPart, mkSprite(C_Steel, 0.04 * S, 0.2 * S, 'tri'), 0.1 * S, -1.0 * S, 0.11);
      addAcc(armPart, mkSprite(C_Steel, 0.04 * S, 0.2 * S, 'tri'), -0.1 * S, -1.0 * S, 0.11);
    } else {
      parts.blade = mkSprite(C_Steel, 0.07 * S, 0.35 * S, 'tri');
      addAcc(armPart, parts.blade, 0, -1.15 * S, 0.11);
    }
    
  } else if (weaponType === 'scepter' || weaponType === 'void_staff' || weaponType === 'fire_staff' || 
             weaponType === 'sun_staff' || weaponType === 'lightning_rod') {
    const shaftCol = weaponType === 'void_staff' ? C_Dark : C_Wood;
    parts.handle = mkSprite(shaftCol, 0.07 * S, 1.2 * S);
    addAcc(armPart, parts.handle, 0, -0.5 * S, 0.1);
    
    let gemCol = 0x00ffff;
    if (weaponType === 'fire_staff') gemCol = 0xff4400;
    if (weaponType === 'sun_staff') gemCol = 0xffff00;
    if (weaponType === 'void_staff') gemCol = 0xcc00ff;
    if (weaponType === 'lightning_rod') gemCol = 0xffff00;
    
    parts.gem = mkSprite(gemCol, 0.25 * S, 0.25 * S, 'circle');
    addAcc(armPart, parts.gem, 0, -1.15 * S, 0.11);
    
  } else if (weaponType === 'bow' || weaponType === 'crossbow' || weaponType === 'greatbow' || weaponType === 'ice_bow') {
    const bowCol = weaponType === 'ice_bow' ? 0xaaddff : C_Wood;
    if (weaponType === 'crossbow') {
      parts.handle = mkSprite(C_Wood, 0.09 * S, 0.6 * S);
      addAcc(armPart, parts.handle, 0, -0.2 * S, 0.1);
      parts.prod = mkSprite(C_Steel, 0.45 * S, 0.08 * S);
      addAcc(armPart, parts.prod, 0, -0.05 * S, 0.11);
    } else {
      const sz = weaponType === 'greatbow' ? 1.3 : 1.0;
      parts.handle = mkSprite(bowCol, 0.08 * S, sz * S);
      addAcc(armPart, parts.handle, 0, -0.3 * S, 0.1);
    }
    
  } else if (weaponType === 'scythe') {
    parts.handle = mkSprite(C_Wood, 0.07 * S, 1.4 * S);
    addAcc(armPart, parts.handle, 0, -0.5 * S, 0.1);
    parts.blade = mkSprite(C_Steel, 0.5 * S, 0.12 * S);
    addAcc(armPart, parts.blade, 0.2 * S, -1.0 * S, 0.11);
    
  } else if (weaponType === 'flail') {
    parts.handle = mkSprite(C_Wood, 0.07 * S, 0.6 * S);
    addAcc(armPart, parts.handle, 0, -0.25 * S, 0.1);
    parts.chain = mkSprite(C_Steel, 0.02 * S, 0.3 * S);
    addAcc(armPart, parts.chain, 0.05 * S, -0.65 * S, 0.11);
    parts.ball = mkSprite(C_Steel, 0.2 * S, 0.2 * S, 'circle');
    addAcc(armPart, parts.ball, 0.1 * S, -0.85 * S, 0.11);
    
  } else if (weaponType === 'whip') {
    parts.handle = mkSprite(C_Wood, 0.07 * S, 0.3 * S);
    addAcc(armPart, parts.handle, 0, -0.15 * S, 0.1);
    parts.coil = mkSprite(0x8b5a35, 0.2 * S, 0.2 * S, 'circle');
    addAcc(armPart, parts.coil, 0, -0.4 * S, 0.11);
    
  } else if (weaponType === 'boomerang') {
    parts.blade = mkSprite(0xb8860b, 0.5 * S, 0.08 * S);
    addAcc(armPart, parts.blade, 0, -0.3 * S, 0.1);
    
  } else if (weaponType === 'grimoire') {
    parts.book = mkSprite(0x4a0e4e, 0.3 * S, 0.35 * S);
    addAcc(armPart, parts.book, 0, -0.25 * S, 0.1);
    parts.symbol = mkSprite(0xff00ff, 0.15 * S, 0.15 * S, 'circle');
    addAcc(armPart, parts.symbol, 0, -0.25 * S, 0.11);
    
  } else if (weaponType === 'gauntlets') {
    parts.gauntlet = mkSprite(C_Steel, 0.18 * S, 0.25 * S);
    addAcc(armPart, parts.gauntlet, 0, -0.15 * S, 0.1);
    
  } else if (weaponType === 'daggers') {
    parts.blade1 = mkSprite(C_Blade, 0.05 * S, 0.5 * S);
    addAcc(armPart, parts.blade1, -0.08 * S, -0.3 * S, 0.1);
    parts.blade2 = mkSprite(C_Blade, 0.05 * S, 0.5 * S);
    addAcc(armPart, parts.blade2, 0.08 * S, -0.3 * S, 0.1);
    
  } else if (weaponType === 'cards') {
    parts.card = mkSprite(0xffffff, 0.2 * S, 0.28 * S);
    addAcc(armPart, parts.card, 0, -0.2 * S, 0.1);
    parts.symbol = mkSprite(0xff0000, 0.12 * S, 0.12 * S, 'diamond');
    addAcc(armPart, parts.symbol, 0, -0.2 * S, 0.11);
    
  } else if (weaponType === 'pistol' || weaponType === 'rifle' || weaponType === 'revolver') {
    const isRifle = weaponType === 'rifle';
    const len = isRifle ? 0.9 : 0.5;
    parts.barrel = mkSprite(0x444444, 0.07 * S, len * S);
    addAcc(armPart, parts.barrel, 0, -0.3 * S, 0.1);
    parts.grip = mkSprite(C_Wood, 0.1 * S, 0.2 * S);
    addAcc(armPart, parts.grip, 0, 0, 0.1);
    
  } else if (weaponType === 'shuriken') {
    parts.star = mkSprite(C_Steel, 0.25 * S, 0.25 * S, 'diamond');
    addAcc(armPart, parts.star, 0, -0.2 * S, 0.1);
    
  } else if (weaponType === 'runestone') {
    parts.rune = mkSprite(0x6644aa, 0.25 * S, 0.25 * S, 'circle');
    addAcc(armPart, parts.rune, 0, -0.2 * S, 0.1);
    
  } else if (weaponType === 'bomb') {
    parts.bomb = mkSprite(0x222222, 0.25 * S, 0.25 * S, 'circle');
    addAcc(armPart, parts.bomb, 0, -0.2 * S, 0.1);
    parts.fuse = mkSprite(0xff4400, 0.02 * S, 0.15 * S);
    addAcc(armPart, parts.fuse, 0, -0.35 * S, 0.11);
    
  } else if (weaponType === 'totem') {
    parts.totem = mkSprite(C_Wood, 0.15 * S, 0.6 * S);
    addAcc(armPart, parts.totem, 0, -0.3 * S, 0.1);
    parts.face = mkSprite(0xff4400, 0.12 * S, 0.12 * S, 'circle');
    addAcc(armPart, parts.face, 0, -0.45 * S, 0.11);
    
  } else if (weaponType === 'claws') {
    parts.claw1 = mkSprite(C_Steel, 0.04 * S, 0.35 * S, 'tri');
    addAcc(armPart, parts.claw1, -0.08 * S, -0.25 * S, 0.1);
    parts.claw2 = mkSprite(C_Steel, 0.04 * S, 0.35 * S, 'tri');
    addAcc(armPart, parts.claw2, 0.08 * S, -0.25 * S, 0.1);
    
  } else if (weaponType === 'mirror') {
    parts.mirror = mkSprite(0x88aacc, 0.3 * S, 0.4 * S);
    addAcc(armPart, parts.mirror, 0, -0.25 * S, 0.1);
    parts.frame = mkSprite(C_Gold, 0.32 * S, 0.42 * S);
    addAcc(armPart, parts.frame, 0, -0.25 * S, 0.09);
    
  } else if (weaponType === 'needles') {
    parts.needle = mkSprite(C_Steel, 0.02 * S, 0.4 * S);
    addAcc(armPart, parts.needle, 0, -0.25 * S, 0.1);
    
  } else if (weaponType === 'drill') {
    parts.drill = mkSprite(0x444444, 0.12 * S, 0.7 * S);
    addAcc(armPart, parts.drill, 0, -0.35 * S, 0.1);
    parts.bit = mkSprite(C_Steel, 0.08 * S, 0.15 * S, 'tri');
    addAcc(armPart, parts.bit, 0, -0.7 * S, 0.11);
    
  } else if (weaponType === 'star_globe') {
    parts.globe = mkSprite(0x2244aa, 0.3 * S, 0.3 * S, 'circle');
    addAcc(armPart, parts.globe, 0, -0.25 * S, 0.1);
    parts.star = mkSprite(0xffffaa, 0.15 * S, 0.15 * S, 'diamond');
    addAcc(armPart, parts.star, 0, -0.25 * S, 0.11);
    
  } else if (weaponType === 'balls') {
    parts.ball = mkSprite(0xff0055, 0.18 * S, 0.18 * S, 'circle');
    addAcc(armPart, parts.ball, 0, -0.2 * S, 0.1);
    
  } else if (weaponType === 'rock') {
    parts.rock = mkSprite(0x777777, 0.28 * S, 0.28 * S, 'circle');
    addAcc(armPart, parts.rock, 0, -0.25 * S, 0.1);
    
  } else if (weaponType === 'potion' || weaponType === 'blowgun') {
    if (weaponType === 'potion') {
      parts.bottle = mkSprite(0x00ff88, 0.15 * S, 0.3 * S);
      addAcc(armPart, parts.bottle, 0, -0.2 * S, 0.1);
    } else {
      parts.tube = mkSprite(C_Wood, 0.06 * S, 0.6 * S);
      addAcc(armPart, parts.tube, 0, -0.3 * S, 0.1);
    }
    
  } else if (weaponType === 'leaf_blade') {
    parts.blade = mkSprite(0x44aa44, 0.12 * S, 0.9 * S);
    addAcc(armPart, parts.blade, 0, -0.5 * S, 0.1);
    parts.handle = mkSprite(C_Wood, 0.08 * S, 0.3 * S);
    addAcc(armPart, parts.handle, 0, -0.1 * S, 0.1);
    
  } else if (weaponType === 'lute') {
    parts.body = mkSprite(C_Wood, 0.3 * S, 0.35 * S);
    addAcc(armPart, parts.body, 0, -0.25 * S, 0.1);
    parts.neck = mkSprite(C_Wood, 0.08 * S, 0.5 * S);
    addAcc(armPart, parts.neck, 0, -0.6 * S, 0.1);
    
  } else if (weaponType === 'hourglass') {
    parts.glass = mkSprite(0x88ccff, 0.2 * S, 0.35 * S);
    addAcc(armPart, parts.glass, 0, -0.25 * S, 0.1);
    parts.frame = mkSprite(C_Gold, 0.22 * S, 0.05 * S);
    addAcc(armPart, parts.frame, 0, -0.1 * S, 0.11);
    parts.frame2 = mkSprite(C_Gold, 0.22 * S, 0.05 * S);
    addAcc(armPart, parts.frame2, 0, -0.4 * S, 0.11);
    
  } else if (weaponType === 'dagger_sac') {
    parts.blade = mkSprite(C_Steel, 0.06 * S, 0.4 * S);
    addAcc(armPart, parts.blade, 0, -0.25 * S, 0.1);
    parts.handle = mkSprite(0x660000, 0.08 * S, 0.2 * S);
    addAcc(armPart, parts.handle, 0, 0, 0.1);
  }
  
  return parts;
}

// ==================== PLAYER MODEL BUILDER ====================

function buildPlayerModel(cls, opts = {}) {
  if (!cls) return { root: new THREE.Group(), parts: {}, typeData: {} };
  
  // Unique shapes for each character class
  const styles = {
    mage:       { C: 0x3366cc, SK: 0xffccaa, shape: 'mage_robed', eyeC: 0x88ccff, S: 1.0 },
    knight:     { C: 0x8899aa, SK: 0xffccaa, shape: 'knight_plate', eyeC: 0xffffff, S: 1.1 },
    barbarian:  { C: 0x884422, SK: 0xcc8866, shape: 'barbarian_wild', eyeC: 0xff0000, S: 1.25 },
    ranger:     { C: 0x448844, SK: 0xffccaa, shape: 'ranger_archer', eyeC: 0x88ff88, S: 1.0 },
    rogue:      { C: 0x222222, SK: 0xffccaa, shape: 'rogue_shadow', eyeC: 0xffff00, S: 0.9 },
    lancer:     { C: 0x4444aa, SK: 0xffccaa, shape: 'lancer_pike', eyeC: 0xffffff, S: 1.05 },
    paladin:    { C: 0xeeeeee, SK: 0xffccaa, shape: 'paladin_holy', eyeC: 0xffd700, S: 1.2 },
    hunter:     { C: 0x554433, SK: 0xffccaa, shape: 'dragoon', eyeC: 0x44ff44, S: 1.0 },
    necro:      { C: 0x220022, SK: 0xdddddd, shape: 'necro_dark', eyeC: 0x00ff00, S: 0.95 },
    samurai:    { C: 0xaa2222, SK: 0xffccaa, shape: 'samurai_warrior', eyeC: 0x000000, S: 1.0 },
    monk:       { C: 0xffaa00, SK: 0xffccaa, shape: 'monk_martial', eyeC: 0xffffff, S: 1.0 },
    warlock:    { C: 0x440088, SK: 0xccaaff, shape: 'lich', eyeC: 0xff00ff, S: 0.95 },
    tamer:      { C: 0x664422, SK: 0xffccaa, shape: 'monkey', eyeC: 0xffaa00, S: 0.9 },
    gambler:    { C: 0x111111, SK: 0xffccaa, shape: 'gambler_lucky', eyeC: 0xff00aa, S: 1.0 },
    pirate:     { C: 0xaa4444, SK: 0xffccaa, shape: 'pirate_sailor', eyeC: 0x000000, S: 1.05 },
    gladiator:  { C: 0x885522, SK: 0xffccaa, shape: 'gladiator_arena', eyeC: 0xffffff, S: 1.2 },
    sniper:     { C: 0x334433, SK: 0xffccaa, shape: 'tengu', eyeC: 0x00ff00, S: 0.95 },
    ninja:      { C: 0x111111, SK: 0xffccaa, shape: 'ninja_shadow', eyeC: 0xffffff, S: 0.85 },
    voidmage:   { C: 0x220044, SK: 0xaa88ff, shape: 'shade', eyeC: 0x00ffff, S: 1.0 },
    crusader:   { C: 0xdddddd, SK: 0xffccaa, shape: 'crusader_shield', eyeC: 0xff0000, S: 1.2 },
    engineer:   { C: 0xcc6622, SK: 0xffccaa, shape: 'engineer_mech', eyeC: 0x00aaff, S: 0.95 },
    pyro:       { C: 0xaa2200, SK: 0xffccaa, shape: 'oni', eyeC: 0xffaa00, S: 1.0 },
    druid:      { C: 0x226622, SK: 0xffccaa, shape: 'treant', eyeC: 0xaaffaa, S: 1.05 },
    alchemist:  { C: 0x225544, SK: 0xffccaa, shape: 'alchemist_tech', eyeC: 0x00ff88, S: 0.9 },
    bard:       { C: 0xaa2266, SK: 0xffccaa, shape: 'bard_musical', eyeC: 0xffffaa, S: 0.95 },
    valkyrie:   { C: 0x88ccff, SK: 0xffccaa, shape: 'valkyrie_winged', eyeC: 0xffffff, S: 1.1 },
    arbalist:   { C: 0x553322, SK: 0xffccaa, shape: 'banshee', eyeC: 0xffff00, S: 1.0 },
    runemaster: { C: 0x444466, SK: 0xffccaa, shape: 'runemaster_arcane', eyeC: 0x00ffff, S: 1.0 },
    duelist:    { C: 0x332244, SK: 0xffccaa, shape: 'duelist_blade', eyeC: 0xff00ff, S: 0.95 },
    gunner:     { C: 0x443322, SK: 0xffccaa, shape: 'gunner_ranged', eyeC: 0xffaa00, S: 1.0 },
    shaman:     { C: 0x662200, SK: 0xffccaa, shape: 'shaman_tribal', eyeC: 0xff4400, S: 1.05 },
    werewolf:   { C: 0x553322, SK: 0x775544, shape: 'werewolf_beast', eyeC: 0xffaa00, S: 1.15 },
    templar:    { C: 0xeeeeee, SK: 0xffccaa, shape: 'vampire', eyeC: 0x0000ff, S: 1.2 },
    illusionist:{ C: 0x8800aa, SK: 0xffccaa, shape: 'illusionist_mirror', eyeC: 0xff00ff, S: 0.95 },
    cowboy:     { C: 0x664422, SK: 0xffccaa, shape: 'cowboy_gunslinger', eyeC: 0x000000, S: 1.0 },
    witchdoc:   { C: 0x331144, SK: 0x553355, shape: 'witchdoc_voodoo', eyeC: 0x00ff00, S: 0.9 },
    stormcaller:{ C: 0x222266, SK: 0xaaccff, shape: 'djinn', eyeC: 0xffff00, S: 1.0 },
    frostarcher:{ C: 0x44aaff, SK: 0xddeeff, shape: 'yeti', eyeC: 0x00ffff, S: 1.0 },
    cultist:    { C: 0x330000, SK: 0xdddddd, shape: 'cultist_twisted', eyeC: 0xff0000, S: 0.9 },
    mechanic:   { C: 0x555566, SK: 0xffccaa, shape: 'mech', eyeC: 0x00ff00, S: 0.95 },
    astronomer: { C: 0x111133, SK: 0xffccaa, shape: 'astronomer_celestial', eyeC: 0xffffaa, S: 1.0 },
    chef:       { C: 0xffffff, SK: 0xffccaa, shape: 'chef_cook', eyeC: 0x000000, S: 1.1 },
    juggler:    { C: 0xff0055, SK: 0xffccaa, shape: 'juggler_acrobat', eyeC: 0x00ff00, S: 0.95 },
    executioner:{ C: 0x220000, SK: 0xddbb99, shape: 'executioner_heavy', eyeC: 0x000000, S: 1.3 },
    geomancer:  { C: 0x554433, SK: 0x776655, shape: 'geomancer_earth', eyeC: 0x00ff00, S: 1.0 },
    apothecary: { C: 0x224433, SK: 0xffccaa, shape: 'hag', eyeC: 0x88ff88, S: 0.9 },
    kyudo:      { C: 0xeeeeee, SK: 0xffccaa, shape: 'kappa', eyeC: 0x000000, S: 1.0 },
    darkknight: { C: 0x111111, SK: 0x555555, shape: 'darkknight_evil', eyeC: 0xff0000, S: 1.2 },
    sunpriest:  { C: 0xffd700, SK: 0xffccaa, shape: 'sunpriest_radiant', eyeC: 0xffffff, S: 1.05 },
    chronomancer:{ C: 0x00aaaa, SK: 0xffccaa, shape: 'gear', eyeC: 0xffffff, S: 0.95 },
    
    // Shop Characters
    phoenix:    { C: 0xff4400, SK: 0xffaa00, shape: 'phoenix', eyeC: 0xffff00, S: 1.1 },
    minotaur:   { C: 0x553311, SK: 0x442200, shape: 'horned_beast', eyeC: 0xff0000, S: 1.4 },
    siren:      { C: 0x4488ff, SK: 0xaaddff, shape: 'fish', eyeC: 0x00ffff, S: 1.0 },
    golem:      { C: 0x888888, SK: 0x666666, shape: 'stone_golem', eyeC: 0xffaa00, S: 1.5 },
    djinn:      { C: 0x8800ff, SK: 0xcc88ff, shape: 'ghost', eyeC: 0x00ffff, S: 1.2 },
    vampire_lord:{ C: 0x330000, SK: 0xdddddd, shape: 'wraith', eyeC: 0xff0000, S: 1.1 },
    kitsune:    { C: 0xff8833, SK: 0xffccaa, shape: 'fox_spirit', eyeC: 0xffaa00, S: 0.9 },
    angel:      { C: 0xffffff, SK: 0xffeeee, shape: 'seraph', eyeC: 0xffd700, S: 1.15 },
    demon_lord: { C: 0x990000, SK: 0x330000, shape: 'demon', eyeC: 0xff0000, S: 1.3 },
    treant:     { C: 0x664422, SK: 0x886633, shape: 'plant', eyeC: 0x00ff00, S: 1.4 },
    sphinx:     { C: 0xffaa00, SK: 0xffdd88, shape: 'riddle_sphinx', eyeC: 0x0000ff, S: 1.2 },
    banshee:    { C: 0x555577, SK: 0x888899, shape: 'ghost', eyeC: 0x00ffff, S: 1.0 },
    dragonkin:  { C: 0xaa2200, SK: 0xcc5544, shape: 'dragon', eyeC: 0xffaa00, S: 1.3 },
    lich_king:  { C: 0x220033, SK: 0xaaaaaa, shape: 'construct', eyeC: 0x00ff00, S: 1.1 },
    basilisk:   { C: 0x335533, SK: 0x556655, shape: 'serpent', eyeC: 0xff0000, S: 1.2 },
    kraken_slayer:{ C: 0x004488, SK: 0xffccaa, shape: 'human', eyeC: 0x0066ff, S: 1.1 },
    fairy_queen:{ C: 0xff88ff, SK: 0xffddff, shape: 'flyer', eyeC: 0xffffaa, S: 0.7 },
    centaur_archer:{ C: 0x886644, SK: 0xffccaa, shape: 'centaur', eyeC: 0x88ff88, S: 1.2 },
    gargoyle:   { C: 0x555555, SK: 0x666666, shape: 'gargoyle', eyeC: 0xff0000, S: 1.3 },
    elemental_lord:{ C: 0xff6600, SK: 0xffaa44, shape: 'elemental', eyeC: 0xffffff, S: 1.2 },
    mummy:      { C: 0xccaa88, SK: 0xddbb99, shape: 'mummy', eyeC: 0x00ff00, S: 1.1 },
    yeti:       { C: 0xffffff, SK: 0xdddddd, shape: 'elder_beast', eyeC: 0x0088ff, S: 1.4 },
    chimera:    { C: 0x996633, SK: 0xaa7744, shape: 'multi_beast', eyeC: 0xff0000, S: 1.3 },
    pegasus_rider:{ C: 0xeeeeee, SK: 0xffccaa, shape: 'pegasus', eyeC: 0x88ccff, S: 1.1 },
    oni_warrior:{ C: 0xaa0000, SK: 0xffccaa, shape: 'ogre', eyeC: 0xff0000, S: 1.3 },
    medusa:     { C: 0x336633, SK: 0xaaddaa, shape: 'naga', eyeC: 0xffff00, S: 1.1 },
    cerberus:   { C: 0x331111, SK: 0x442222, shape: 'cerberus', eyeC: 0xff0000, S: 1.4 },
    harpy:      { C: 0x664422, SK: 0x886644, shape: 'harpy', eyeC: 0xffaa00, S: 0.9 },
    cyclops:    { C: 0x887766, SK: 0x998877, shape: 'colossus', eyeC: 0x0000ff, S: 1.6 },
    griffin:    { C: 0xaa8844, SK: 0xccaa66, shape: 'griffin', eyeC: 0xffaa00, S: 1.2 },
    wraith:     { C: 0x222244, SK: 0x444466, shape: 'phantom', eyeC: 0xff0000, S: 0.9 },
    archdruid:  { C: 0x446622, SK: 0xffccaa, shape: 'druid_nature', eyeC: 0x00ff00, S: 1.1 },
    frost_giant:{ C: 0xaaddff, SK: 0xccddff, shape: 'ogre', eyeC: 0x00ffff, S: 1.5 },
    thunder_lord:{ C: 0x4444aa, SK: 0xaaccff, shape: 'storm_entity', eyeC: 0xffff00, S: 1.1 },
    sand_golem: { C: 0xddbb88, SK: 0xccaa77, shape: 'sand_dune', eyeC: 0xffaa00, S: 1.3 },
    blood_knight:{ C: 0x660000, SK: 0xffccaa, shape: 'scarlet_warrior', eyeC: 0xff0000, S: 1.2 },
    moonlight_assassin:{ C: 0x222244, SK: 0xffccaa, shape: 'shadow_stalker', eyeC: 0xaaaaff, S: 0.9 },
    crystal_mage:{ C: 0x88ccff, SK: 0xaaddff, shape: 'crystal_sage', eyeC: 0x00ffff, S: 1.0 },
    void_reaper:{ C: 0x110022, SK: 0x332244, shape: 'shadow', eyeC: 0x8800ff, S: 1.1 },
    lava_titan: { C: 0xff4400, SK: 0xcc3300, shape: 'lava_golem', eyeC: 0xffff00, S: 1.5 },
    star_guardian:{ C: 0x2244aa, SK: 0xffccaa, shape: 'flyer', eyeC: 0xffffaa, S: 1.1 },
    shadow_dancer:{ C: 0x111111, SK: 0x333333, shape: 'shadow_whirlwind', eyeC: 0xff00ff, S: 0.85 },
    nature_spirit:{ C: 0x88ff88, SK: 0xaaffaa, shape: 'grove_spirit', eyeC: 0x00ff00, S: 1.0 },
    chaos_mage: { C: 0x884488, SK: 0xffccaa, shape: 'entropy_mage', eyeC: 0xff00ff, S: 1.0 },
    samurai_lord:{ C: 0x880000, SK: 0xffccaa, shape: 'dino', eyeC: 0x000000, S: 1.1 },
    plague_doctor:{ C: 0x222222, SK: 0xffccaa, shape: 'mummy', eyeC: 0x00ff00, S: 1.0 },
    time_knight:{ C: 0x0088aa, SK: 0xffccaa, shape: 'chrono_warrior', eyeC: 0x00ffff, S: 1.1 },
    necro_lord: { C: 0x220022, SK: 0x444444, shape: 'specter', eyeC: 0x00ff00, S: 1.1 },
    battle_bard:{ C: 0xaa4488, SK: 0xffccaa, shape: 'human', eyeC: 0xffaa00, S: 1.0 },
    arcane_archer:{ C: 0x6644aa, SK: 0xffccaa, shape: 'spider', eyeC: 0xaa00ff, S: 1.0 },
    berserker:  { C: 0x884422, SK: 0xcc6644, shape: 'frenzy_warrior', eyeC: 0xff0000, S: 1.35 }
  };

  // Valeurs par défaut
  let def = styles[cls.id] || { C: 0x4488ff, SK: 0xffccaa, shape: 'human', eyeC: 0xffffff };
  
  // Gestion des boss jouables (si applicable)
  if (cls.id.startsWith('boss_')) {
      let bossType = null;
      if (cls.linkedBiome && typeof BIOMES !== 'undefined') {
          const biome = BIOMES.find(b => b.id === cls.linkedBiome);
          if (biome && biome.boss && typeof MTYPES !== 'undefined') {
              bossType = MTYPES.find(m => m.name === biome.boss);
          }
      }
      if (!bossType && typeof MTYPES !== 'undefined') {
          bossType = MTYPES.find(m => m.name === cls.name);
      }
      if (bossType) {
          def = { C: bossType.C, SK: bossType.SK, shape: bossType.shape, eyeC: bossType.eyeC || 0xff0000, S: Math.max(1.0, (bossType.S || 1.0) * 0.6) };
      } else {
          def = { C: 0x550000, SK: 0xaa5555, shape: 'human', eyeC: 0xff0000, S: 1.2 };
      }
  }

  const typeData = {
    name: cls.name,
    shape: def.shape,
    C: def.C,
    SK: def.SK,
    S: def.S || 1.0,
    eyeC: def.eyeC,
    wep: cls.wep || null
  };

  const { g, p } = buildPuppet(typeData);

  return { root: g, parts: p, typeData: typeData };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Monster, buildPuppet, animPuppet, buildPlayerModel };
}
