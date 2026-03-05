// ═══════════════════════════════════════════════
// DUNGEON WORLD - Abilities & Combat
// ═══════════════════════════════════════════════

// ==================== CAMERA & PLAYER ====================
function fwd() {
  return new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(camPitch, camYaw, 0, 'YXZ')).normalize();
}

function spawnPos() {
  return playerPivot.position.clone().add(new THREE.Vector3(0, 0.1, 0));
}

// ==================== DAMAGE CALCULATION ====================
function getPlayerDmg(wep, targetDist = 0) {
  let d = wep.dmg;
  if (GameState.pGambler) d *= (0.5 + Math.random() * 2.5);
  if (GameState.pWindwalker) d *= (1 + Math.max(0, SPD - 7.5) * 0.15);
  if (GameState.pTank) d += (GameState.pMaxHP - 100) * 0.15;
  if (GameState.pHP < GameState.pMaxHP * 0.3) d *= (1 + GameState.pLowHpDmg);
  
  // Sniper Trait: More damage further away
  if (GameState.pSniper && targetDist > 0) {
      d *= (1 + Math.min(2.0, targetDist / 20)); // Up to +200% dmg at 40m
  }
  
  // Brawler Trait: More damage closer
  if (GameState.pBrawler && targetDist > 0) {
      if (targetDist < 5) d *= 1.5;
      else if (targetDist < 10) d *= 1.2;
  }

  if (Math.random() < 0.05 * GameState.pLuck) d *= GameState.pCritDmg;
  return d;
}

// ==================== MELEE WEAPONS ====================
function useMelee(wep) {
  if (wep.cd > 0) return;
  wep.cd = wep.maxCd;
  vmRecoil = 0.5;

  const pp = playerPivot.position;
  // Use camera yaw for 2D direction (more reliable for melee)
  const aimDir = new THREE.Vector2(-Math.sin(camYaw), -Math.cos(camYaw));
  let hit = false;

  monsters.forEach(m => {
    if (m.dead) return;
    
    // 2D Distance check (cylinder hitbox)
    const dx = m.root.position.x - pp.x;
    const dz = m.root.position.z - pp.z;
    const dist2d = Math.sqrt(dx*dx + dz*dz);
    const dy = Math.abs(m.root.position.y - pp.y); // Vertical check

    if (dist2d < wep.range * GameState.pArea && dy < 3.0) {
      const dirToM = new THREE.Vector2(dx, dz).normalize();
      const dot = aimDir.dot(dirToM);
      
      // Hit if within arc OR very close (collision)
      if (dist2d < 1.2 || (wep.arc >= Math.PI * 2 || dot > Math.cos(wep.arc / 2))) {
        let dmg = getPlayerDmg(wep, dist2d);
        m.takeDmg(dmg, false, GameState.pKnockback, pp);
        if (Math.random() < GameState.pBleedChance) {
          m.bleedStack += Math.ceil(dmg * 0.2);
          addNotif('🩸 Saignement', '#aa0000');
        }
        spawnPart(m.root.position.clone().add(new THREE.Vector3(0, 1.5, 0)), 0xff0000, 5, 4);
        hit = true;
      }
    }
  });

  if (hit) addNotif('⚔ COUP !', '#ffffff');
}

// ==================== RANGED WEAPONS ====================
function fireBow() {
  if (WEAPONS.BOW.cd > 0) return;
  WEAPONS.BOW.cd = GameState.frenzyTimer > 0 ? 0.15 : WEAPONS.BOW.maxCd;

  const baseDir = fwd();
  const pos = spawnPos().addScaledVector(new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw)), 0.2);

  for (let i = 0; i < WEAPONS.BOW.count; i++) {
    const d = baseDir.clone();
    if (WEAPONS.BOW.count > 1) {
      d.x += (Math.random() - 0.5) * WEAPONS.BOW.spread;
      d.y += (Math.random() - 0.5) * WEAPONS.BOW.spread;
      d.z += (Math.random() - 0.5) * WEAPONS.BOW.spread;
      d.normalize();
    }
    let dmg = getPlayerDmg(WEAPONS.BOW);
    let col = 0xaaaaaa;
    if (WEAPONS.SCEPTER.fire) col = 0xff5500;

    projectiles.push(new Proj(pos, d, dmg, col, WEAPONS.BOW.speed, WEAPONS.BOW.life, {
      pierce: WEAPONS.BOW.pierce, scale: 0.6, homing: WEAPONS.BOW.homing, blast: WEAPONS.BOW.blast, shape: 'arrow'
    }));
  }

  vmRecoil = 0.3;
  const mzEl = document.getElementById('mzfl');
  mzEl.style.opacity = '0.5';
  setTimeout(() => mzEl.style.opacity = '0', 50);
}

function fireBoomerang() {
  if (WEAPONS.BOOMERANG.cd > 0) return;
  WEAPONS.BOOMERANG.cd = GameState.frenzyTimer > 0 ? 0.15 : WEAPONS.BOOMERANG.maxCd;

  const baseDir = fwd();
  const pos = spawnPos().addScaledVector(new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw)), 0.2);

  for (let i = 0; i < WEAPONS.BOOMERANG.count; i++) {
    const d = baseDir.clone();
    if (WEAPONS.BOOMERANG.count > 1) {
      d.x += (Math.random() - 0.5) * WEAPONS.BOOMERANG.spread;
      d.y += (Math.random() - 0.5) * WEAPONS.BOOMERANG.spread;
      d.z += (Math.random() - 0.5) * WEAPONS.BOOMERANG.spread;
      d.normalize();
    }
    let dmg = getPlayerDmg(WEAPONS.BOOMERANG);
    let col = 0xddaa55;
    if (WEAPONS.SCEPTER.fire) col = 0xff5500;

    projectiles.push(new Proj(pos, d, dmg, col, WEAPONS.BOOMERANG.speed, WEAPONS.BOOMERANG.life, {
      pierce: 99, boomerang: true, scale: 1.0, homing: WEAPONS.BOOMERANG.homing, blast: WEAPONS.BOOMERANG.blast, shape: 'tri', spin: 15
    }));
  }

  vmRecoil = 0.3;
}

function fireScepter() {
  if (WEAPONS.SCEPTER.cd > 0) return;
  WEAPONS.SCEPTER.cd = GameState.frenzyTimer > 0 ? 0.08 : WEAPONS.SCEPTER.maxCd;

  const baseDir = fwd();
  const pos = spawnPos().addScaledVector(new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw)), 0.2);

  for (let i = 0; i < WEAPONS.SCEPTER.count; i++) {
    const d = baseDir.clone();
    if (WEAPONS.SCEPTER.count > 1) {
      d.x += (Math.random() - 0.5) * WEAPONS.SCEPTER.spread;
      d.y += (Math.random() - 0.5) * WEAPONS.SCEPTER.spread;
      d.z += (Math.random() - 0.5) * WEAPONS.SCEPTER.spread;
      d.normalize();
    }

    let col = 0x44aaff;
    if (WEAPONS.SCEPTER.fire) col = 0xff5500;
    else if (WEAPONS.SCEPTER.lightning) col = 0xffff44;
    else if (WEAPONS.SCEPTER.ice) col = 0xaaddff;

    projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.SCEPTER), col, WEAPONS.SCEPTER.speed, WEAPONS.SCEPTER.life, {
      pierce: WEAPONS.SCEPTER.pierce, bounce: WEAPONS.SCEPTER.bounce,
      lowHpBonus: GameState.pLowHpDmg,
      fire: WEAPONS.SCEPTER.fire, ice: WEAPONS.SCEPTER.ice, lightning: WEAPONS.SCEPTER.lightning,
      scale: Math.min(2.5, 1 + WEAPONS.SCEPTER.level * 0.05), shape: 'diamond',
      homing: WEAPONS.SCEPTER.homing, blast: WEAPONS.SCEPTER.blast
    }));
  }

  vmRecoil = 0.14;
  const mzEl = document.getElementById('mzfl');
  mzEl.style.opacity = '1';
  setTimeout(() => mzEl.style.opacity = '0', 50);
}

function fireGrimoire() {
  if (WEAPONS.GRIMOIRE.cd > 0) return;
  WEAPONS.GRIMOIRE.cd = GameState.frenzyTimer > 0 ? 0.1 : WEAPONS.GRIMOIRE.maxCd;

  const baseDir = fwd();
  const pos = spawnPos();

  for (let i = 0; i < WEAPONS.GRIMOIRE.count; i++) {
    const d = baseDir.clone();
    const angle = (i / WEAPONS.GRIMOIRE.count) * Math.PI * 2 + GameState.pT * 5;
    d.x += Math.cos(angle) * WEAPONS.GRIMOIRE.spread;
    d.y += Math.sin(angle) * WEAPONS.GRIMOIRE.spread;
    d.normalize();

    let dmg = getPlayerDmg(WEAPONS.GRIMOIRE);
    let col = 0xaa00ff;
    if (WEAPONS.SCEPTER.fire) col = 0xff5500;

    projectiles.push(new Proj(pos, d, dmg, col, WEAPONS.GRIMOIRE.speed, WEAPONS.GRIMOIRE.life, {
      pierce: 1, homing: WEAPONS.GRIMOIRE.homing, blast: WEAPONS.GRIMOIRE.blast, shape: 'box'
    }));
  }

  vmRecoil = 0.2;
}

function useWhip() {
  if (WEAPONS.WHIP.cd > 0) return;
  WEAPONS.WHIP.cd = WEAPONS.WHIP.maxCd;
  vmRecoil = 0.4;

  const pp = playerPivot.position;
  const f = fwd();

  monsters.forEach(m => {
    if (m.dead) return;
    const dirToM = m.root.position.clone().sub(pp);
    if (dirToM.length() < WEAPONS.WHIP.range * GameState.pArea && dirToM.normalize().dot(f) > Math.cos(WEAPONS.WHIP.arc / 2)) {
      m.takeDmg(getPlayerDmg(WEAPONS.WHIP), false, GameState.pKnockback, pp);
      spawnPart(m.root.position, 0xffffff, 3, 3);
    }
  });
}

function fireCards() {
  if (WEAPONS.CARDS.cd > 0) return;
  WEAPONS.CARDS.cd = GameState.frenzyTimer > 0 ? 0.1 : WEAPONS.CARDS.maxCd;

  const baseDir = fwd();
  const pos = spawnPos();

  for (let i = 0; i < WEAPONS.CARDS.count; i++) {
    const d = baseDir.clone();
    d.x += (Math.random() - 0.5) * WEAPONS.CARDS.spread;
    d.y += (Math.random() - 0.5) * WEAPONS.CARDS.spread;
    d.z += (Math.random() - 0.5) * WEAPONS.CARDS.spread;
    d.normalize();

    projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.CARDS), 0xff0000, WEAPONS.CARDS.speed, WEAPONS.CARDS.life, {
      pierce: 1 + (WEAPONS.CARDS.pierce || 0), bounce: 1 + (WEAPONS.CARDS.bounce || 0), homing: WEAPONS.CARDS.homing, shape: 'box', spin: 10
    }));
  }

  vmRecoil = 0.2;
}

function firePistol() {
  if (WEAPONS.PISTOL.cd > 0) return;
  WEAPONS.PISTOL.cd = GameState.frenzyTimer > 0 ? 0.15 : WEAPONS.PISTOL.maxCd;

  const baseDir = fwd();
  const pos = spawnPos().addScaledVector(new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw)), 0.2);

  for (let i = 0; i < WEAPONS.PISTOL.count; i++) {
    const d = baseDir.clone();
    d.x += (Math.random() - 0.5) * WEAPONS.PISTOL.spread;
    d.y += (Math.random() - 0.5) * WEAPONS.PISTOL.spread;
    d.z += (Math.random() - 0.5) * WEAPONS.PISTOL.spread;
    d.normalize();

    projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.PISTOL), 0xddccaa, WEAPONS.PISTOL.speed, WEAPONS.PISTOL.life, {
      pierce: WEAPONS.PISTOL.pierce, homing: WEAPONS.PISTOL.homing, blast: WEAPONS.PISTOL.blast, shape: 'circle'
    }));
  }

  vmRecoil = 0.4;
  const mzEl = document.getElementById('mzfl');
  mzEl.style.opacity = '0.8';
  setTimeout(() => mzEl.style.opacity = '0', 40);
}

function fireTrident() {
  if (WEAPONS.TRIDENT.cd > 0) return;
  WEAPONS.TRIDENT.cd = GameState.frenzyTimer > 0 ? 0.2 : WEAPONS.TRIDENT.maxCd;
  const baseDir = fwd();
  const pos = spawnPos().addScaledVector(new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw)), 0.2);
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.TRIDENT), 0x44aaff, WEAPONS.TRIDENT.speed, WEAPONS.TRIDENT.life, {pierce: WEAPONS.TRIDENT.pierce, scale:1.2, shape: 'tri'}));
  addScreenShake(0.1);
  vmRecoil = 0.5;
}

function fireMirror() {
  if (WEAPONS.MIRROR.cd > 0) return;
  WEAPONS.MIRROR.cd = GameState.frenzyTimer > 0 ? 0.1 : WEAPONS.MIRROR.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  for(let i=0; i<WEAPONS.MIRROR.count; i++) {
    const d = baseDir.clone();
    d.x+=(Math.random()-.5)*WEAPONS.MIRROR.spread; d.y+=(Math.random()-.5)*WEAPONS.MIRROR.spread; d.z+=(Math.random()-.5)*WEAPONS.MIRROR.spread; d.normalize();
    projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.MIRROR), 0xaaddff, WEAPONS.MIRROR.speed, WEAPONS.MIRROR.life, {bounce: WEAPONS.MIRROR.bounce, scale:0.7, shape: 'diamond'}));
  }
  vmRecoil = 0.2;
}

function fireRifle() {
  if (WEAPONS.RIFLE.cd > 0) return;
  WEAPONS.RIFLE.cd = GameState.frenzyTimer > 0 ? 0.3 : WEAPONS.RIFLE.maxCd;
  const baseDir = fwd();
  const pos = spawnPos().addScaledVector(new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw)), 0.2);
  for(let i=0; i<WEAPONS.RIFLE.count; i++) {
    const d = baseDir.clone();
    if(WEAPONS.RIFLE.count>1) {
      d.x+=(Math.random()-.5)*WEAPONS.RIFLE.spread; d.y+=(Math.random()-.5)*WEAPONS.RIFLE.spread; d.z+=(Math.random()-.5)*WEAPONS.RIFLE.spread; d.normalize();
    }
    projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.RIFLE), 0xffff00, WEAPONS.RIFLE.speed, WEAPONS.RIFLE.life, {pierce: WEAPONS.RIFLE.pierce, scale:0.4, sniper: GameState.pSniper, shape: 'circle'}));
  }
  vmRecoil = 0.6;
  const mzEl = document.getElementById('mzfl'); mzEl.style.opacity = '1'; setTimeout(() => mzEl.style.opacity = '0', 60);
}

function fireShuriken() {
  if (WEAPONS.SHURIKEN.cd > 0) return;
  WEAPONS.SHURIKEN.cd = GameState.frenzyTimer > 0 ? 0.05 : WEAPONS.SHURIKEN.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  for(let i=0; i<WEAPONS.SHURIKEN.count; i++) {
    const d = baseDir.clone();
    d.x+=(Math.random()-.5)*WEAPONS.SHURIKEN.spread; d.y+=(Math.random()-.5)*WEAPONS.SHURIKEN.spread; d.z+=(Math.random()-.5)*WEAPONS.SHURIKEN.spread; d.normalize();
    projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.SHURIKEN), 0x888888, WEAPONS.SHURIKEN.speed, WEAPONS.SHURIKEN.life, {pierce: WEAPONS.SHURIKEN.pierce, bounce: WEAPONS.SHURIKEN.bounce, scale:0.5, shape: 'shuriken', spin: 20}));
  }
  vmRecoil = 0.1;
}

function fireVoidStaff() {
  if (WEAPONS.VOID_STAFF.cd > 0) return;
  WEAPONS.VOID_STAFF.cd = GameState.frenzyTimer > 0 ? 0.2 : WEAPONS.VOID_STAFF.maxCd;
  const baseDir = fwd();
  const pos = spawnPos().addScaledVector(new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw)), 0.2);
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.VOID_STAFF), 0xaa00ff, WEAPONS.VOID_STAFF.speed, WEAPONS.VOID_STAFF.life, {homing: WEAPONS.VOID_STAFF.homing, blast: WEAPONS.VOID_STAFF.blast, scale:1.5, shape: 'circle'}));
  vmRecoil = 0.3;
}

function fireFireStaff() {
  if (WEAPONS.FIRE_STAFF.cd > 0) return;
  WEAPONS.FIRE_STAFF.cd = GameState.frenzyTimer > 0 ? 0.15 : WEAPONS.FIRE_STAFF.maxCd;
  const baseDir = fwd();
  const pos = spawnPos().addScaledVector(new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw)), 0.2);
  for(let i=0; i<WEAPONS.FIRE_STAFF.count; i++) {
    const d = baseDir.clone();
    if(WEAPONS.FIRE_STAFF.count>1) { d.x+=(Math.random()-.5)*WEAPONS.FIRE_STAFF.spread; d.y+=(Math.random()-.5)*WEAPONS.FIRE_STAFF.spread; d.z+=(Math.random()-.5)*WEAPONS.FIRE_STAFF.spread; d.normalize(); }
    projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.FIRE_STAFF), 0xff4400, WEAPONS.FIRE_STAFF.speed, WEAPONS.FIRE_STAFF.life, {blast: WEAPONS.FIRE_STAFF.blast, fire:true, scale:1.0, shape: 'diamond'}));
  }
  addScreenShake(0.1);
  vmRecoil = 0.3;
}

function fireLeafBlade() {
  if (WEAPONS.LEAF_BLADE.cd > 0) return;
  WEAPONS.LEAF_BLADE.cd = GameState.frenzyTimer > 0 ? 0.1 : WEAPONS.LEAF_BLADE.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  for(let i=0; i<WEAPONS.LEAF_BLADE.count; i++) {
    const d = baseDir.clone();
    d.x+=(Math.random()-.5)*WEAPONS.LEAF_BLADE.spread; d.y+=(Math.random()-.5)*WEAPONS.LEAF_BLADE.spread; d.z+=(Math.random()-.5)*WEAPONS.LEAF_BLADE.spread; d.normalize();
    projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.LEAF_BLADE), 0x44aa44, WEAPONS.LEAF_BLADE.speed, WEAPONS.LEAF_BLADE.life, {homing: WEAPONS.LEAF_BLADE.homing, scale:0.5, shape: 'tri'}));
  }
  vmRecoil = 0.1;
}

function firePotion() {
  if (WEAPONS.POTION.cd > 0) return;
  WEAPONS.POTION.cd = GameState.frenzyTimer > 0 ? 0.2 : WEAPONS.POTION.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  for(let i=0; i<WEAPONS.POTION.count; i++) {
    const d = baseDir.clone();
    d.y += 0.5; d.normalize(); // Arc
    projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.POTION), 0x00ff00, WEAPONS.POTION.speed, WEAPONS.POTION.life, {blast: WEAPONS.POTION.blast, scale:0.8, shape: 'circle'}));
  }
  vmRecoil = 0.3;
}

function useLute() {
  if (WEAPONS.LUTE.cd > 0) return;
  WEAPONS.LUTE.cd = WEAPONS.LUTE.maxCd;
  vmRecoil = 0.2;
  const pp = playerPivot.position;
  spawnPart(pp, 0xffd700, 10, 5); // Soundwave visual
  addScreenShake(0.05);
  monsters.forEach(m => {
    if (m.dead) return;
    if (m.root.position.distanceTo(pp) < WEAPONS.LUTE.range * GameState.pArea) {
      m.takeDmg(getPlayerDmg(WEAPONS.LUTE, m.root.position.distanceTo(pp)), true, GameState.pKnockback*2, pp); // Stun/Slow
    }
  });
}

function fireJavelin() {
  if (WEAPONS.JAVELIN.cd > 0) return;
  WEAPONS.JAVELIN.cd = GameState.frenzyTimer > 0 ? 0.2 : WEAPONS.JAVELIN.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.JAVELIN), 0xffd700, WEAPONS.JAVELIN.speed, WEAPONS.JAVELIN.life, {pierce: WEAPONS.JAVELIN.pierce, scale:1.0, shape: 'arrow'}));
  vmRecoil = 0.4;
}

function fireCrossbow() {
  if (WEAPONS.CROSSBOW.cd > 0) return;
  WEAPONS.CROSSBOW.cd = GameState.frenzyTimer > 0 ? 0.1 : WEAPONS.CROSSBOW.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.CROSSBOW), 0x888888, WEAPONS.CROSSBOW.speed, WEAPONS.CROSSBOW.life, {pierce: WEAPONS.CROSSBOW.pierce, scale:0.5, shape: 'arrow'}));
  vmRecoil = 0.2;
}

function fireRunestone() {
  if (WEAPONS.RUNESTONE.cd > 0) return;
  WEAPONS.RUNESTONE.cd = WEAPONS.RUNESTONE.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.RUNESTONE), 0x00ffff, WEAPONS.RUNESTONE.speed, WEAPONS.RUNESTONE.life, {blast: WEAPONS.RUNESTONE.blast, scale:1.2, shape: 'box'}));
  vmRecoil = 0.4;
}

function fireBomb() {
  if (WEAPONS.BOMB.cd > 0) return;
  WEAPONS.BOMB.cd = WEAPONS.BOMB.maxCd;
  const baseDir = fwd();
  baseDir.y += 0.5; baseDir.normalize();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.BOMB), 0x222222, WEAPONS.BOMB.speed, WEAPONS.BOMB.life, {blast: WEAPONS.BOMB.blast, gravity: 15, scale:1.0, shape: 'circle'}));
  vmRecoil = 0.4;
}

function fireRevolver() {
  if (WEAPONS.REVOLVER.cd > 0) return;
  WEAPONS.REVOLVER.cd = GameState.frenzyTimer > 0 ? 0.05 : WEAPONS.REVOLVER.maxCd;
  const baseDir = fwd();
  const pos = spawnPos().addScaledVector(new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw)), 0.2);
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.REVOLVER), 0xddccaa, WEAPONS.REVOLVER.speed, WEAPONS.REVOLVER.life, {pierce: 0, scale:0.3, shape: 'circle'}));
  vmRecoil = 0.3;
}

function fireNeedles() {
  if (WEAPONS.NEEDLES.cd > 0) return;
  WEAPONS.NEEDLES.cd = GameState.frenzyTimer > 0 ? 0.02 : WEAPONS.NEEDLES.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  const d = baseDir.clone();
  d.x += (Math.random()-0.5)*WEAPONS.NEEDLES.spread;
  d.y += (Math.random()-0.5)*WEAPONS.NEEDLES.spread;
  d.z += (Math.random()-0.5)*WEAPONS.NEEDLES.spread;
  d.normalize();
  projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.NEEDLES), 0xaaaaaa, WEAPONS.NEEDLES.speed, WEAPONS.NEEDLES.life, {pierce: 0, scale:0.2, shape: 'arrow'}));
  vmRecoil = 0.05;
}

function fireLightningRod() {
  if (WEAPONS.LIGHTNING_ROD.cd > 0) return;
  WEAPONS.LIGHTNING_ROD.cd = WEAPONS.LIGHTNING_ROD.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.LIGHTNING_ROD), 0xffff00, WEAPONS.LIGHTNING_ROD.speed, WEAPONS.LIGHTNING_ROD.life, {lightning: true, scale:0.8, shape: 'diamond'}));
  vmRecoil = 0.3;
}

function fireIceBow() {
  if (WEAPONS.ICE_BOW.cd > 0) return;
  WEAPONS.ICE_BOW.cd = WEAPONS.ICE_BOW.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.ICE_BOW), 0xaaddff, WEAPONS.ICE_BOW.speed, WEAPONS.ICE_BOW.life, {ice: true, scale:0.6, shape: 'arrow'}));
  vmRecoil = 0.3;
}

function fireStarGlobe() {
  if (WEAPONS.STAR_GLOBE.cd > 0) return;
  WEAPONS.STAR_GLOBE.cd = WEAPONS.STAR_GLOBE.maxCd;
  const pos = spawnPos();
  for(let i=0; i<WEAPONS.STAR_GLOBE.count; i++) {
      const d = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
      projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.STAR_GLOBE), 0xffffaa, WEAPONS.STAR_GLOBE.speed, WEAPONS.STAR_GLOBE.life, {homing: 2.0, scale:0.7, shape: 'star', spin: 10}));
  }
  vmRecoil = 0.2;
}

function fireCleaver() {
  if (WEAPONS.CLEAVER.cd > 0) return;
  WEAPONS.CLEAVER.cd = WEAPONS.CLEAVER.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.CLEAVER), 0x888888, WEAPONS.CLEAVER.speed, WEAPONS.CLEAVER.life, {pierce: 2, scale:1.0, shape: 'box', spin: 20}));
  vmRecoil = 0.4;
}

function fireBalls() {
  if (WEAPONS.BALLS.cd > 0) return;
  WEAPONS.BALLS.cd = WEAPONS.BALLS.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  for(let i=0; i<WEAPONS.BALLS.count; i++) {
      const d = baseDir.clone();
      d.x += (Math.random()-0.5)*0.2; d.y += (Math.random()-0.5)*0.2; d.normalize();
      projectiles.push(new Proj(pos, d, getPlayerDmg(WEAPONS.BALLS), 0xff0000, WEAPONS.BALLS.speed, WEAPONS.BALLS.life, {bounce: 3, scale:0.5, shape: 'circle'}));
  }
  vmRecoil = 0.2;
}

function fireRock() {
  if (WEAPONS.ROCK.cd > 0) return;
  WEAPONS.ROCK.cd = WEAPONS.ROCK.maxCd;
  const baseDir = fwd();
  baseDir.y += 0.3; baseDir.normalize();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.ROCK), 0x888888, WEAPONS.ROCK.speed, WEAPONS.ROCK.life, {blast: 2, gravity: 10, scale:1.5, shape: 'circle'}));
  vmRecoil = 0.5;
}

function fireBlowgun() {
  if (WEAPONS.BLOWGUN.cd > 0) return;
  WEAPONS.BLOWGUN.cd = WEAPONS.BLOWGUN.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.BLOWGUN), 0x00ff00, WEAPONS.BLOWGUN.speed, WEAPONS.BLOWGUN.life, {scale:0.3, shape: 'arrow'}));
  vmRecoil = 0.1;
}

function fireGreatbow() {
  if (WEAPONS.GREATBOW.cd > 0) return;
  WEAPONS.GREATBOW.cd = WEAPONS.GREATBOW.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.GREATBOW), 0xffffff, WEAPONS.GREATBOW.speed, WEAPONS.GREATBOW.life, {pierce: 5, scale:2.0, shape: 'arrow'}));
  vmRecoil = 0.8;
}

function fireSunStaff() {
  if (WEAPONS.SUN_STAFF.cd > 0) return;
  WEAPONS.SUN_STAFF.cd = WEAPONS.SUN_STAFF.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.SUN_STAFF), 0xffff00, WEAPONS.SUN_STAFF.speed, WEAPONS.SUN_STAFF.life, {blast: 3, scale:1.5, shape: 'star', spin: 5}));
  vmRecoil = 0.4;
}

function fireHourglass() {
  if (WEAPONS.HOURGLASS.cd > 0) return;
  WEAPONS.HOURGLASS.cd = WEAPONS.HOURGLASS.maxCd;
  const baseDir = fwd();
  const pos = spawnPos();
  projectiles.push(new Proj(pos, baseDir, getPlayerDmg(WEAPONS.HOURGLASS), 0xccaa00, WEAPONS.HOURGLASS.speed, WEAPONS.HOURGLASS.life, {scale:1.0, shape: 'tri', spin: 10}));
  vmRecoil = 0.3;
}

// ==================== PASSIVE ABILITIES ====================
function updateOrbVisuals() {
  PASSIVES.orb.meshes.forEach(m => scene.remove(m));
  PASSIVES.orb.meshes = [];
  for (let i = 0; i < PASSIVES.orb.count; i++) {
    const m = mkSprite(0x00ffaa, 0.6, 0.6, 'circle');
    scene.add(m);
    PASSIVES.orb.meshes.push(m);
  }
}

function updateShieldVisuals() {
  PASSIVES.shield.meshes.forEach(m => scene.remove(m));
  PASSIVES.shield.meshes = [];
  for (let i = 0; i < PASSIVES.shield.count; i++) {
    const m = mkSprite(0x4488ff, 0.5, 0.8, 'box');
    scene.add(m);
    PASSIVES.shield.meshes.push(m);
  }
}

function updateAuraVisuals() {
  if (!PASSIVES.aura.mesh) {
    const g = new THREE.RingGeometry(PASSIVES.aura.range - 0.2, PASSIVES.aura.range, 32);
    g.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xff4400, side: THREE.DoubleSide, transparent: true, opacity: 0.3 }));
    scene.add(m);
    PASSIVES.aura.mesh = m;
  } else {
    const s = PASSIVES.aura.range / 6;
    PASSIVES.aura.mesh.scale.set(s, s, s);
  }
}

function updatePassives(dt) {
  const pp = playerPivot.position;

  // ORB
  if (PASSIVES.orb.active) {
    PASSIVES.orb.angle += dt * PASSIVES.orb.speed;
    PASSIVES.orb.meshes.forEach((m, i) => {
      const off = (i / PASSIVES.orb.count) * Math.PI * 2, r = 2.5;
      m.position.set(pp.x + Math.cos(PASSIVES.orb.angle + off) * r, 0, pp.z + Math.sin(PASSIVES.orb.angle + off) * r);
      m.position.y = terrainH(m.position.x, m.position.z) + 1.2;

      monsters.forEach(mon => {
        if (!mon.dead && mon.root.position.distanceTo(m.position) < 1.5 && mon.orbHitT <= 0) {
          mon.takeDmg(PASSIVES.orb.dmg, false, GameState.pKnockback, pp);
          mon.orbHitT = 0.5;
          spawnPart(m.position, 0x00ffaa, 4, 3);
        }
      });
    });
  }

  // DAGGER
  if (PASSIVES.dagger.active) {
    PASSIVES.dagger.cd -= dt;
    if (PASSIVES.dagger.cd <= 0) {
      let t = null, minD = PASSIVES.dagger.range;
      monsters.forEach(m => {
        if (!m.dead) {
          const d = m.root.position.distanceTo(pp);
          if (d < minD) { minD = d; t = m; }
        }
      });
      if (t) {
        PASSIVES.dagger.cd = PASSIVES.dagger.maxCd;
        const dir = t.root.position.clone().sub(pp).normalize();
        projectiles.push(new Proj(pp.clone().add(new THREE.Vector3(0, 1.5, 0)), dir, PASSIVES.dagger.dmg, 0xffffff, 22, PASSIVES.dagger.range / 22, { pierce: 1, scale: 0.8, shape: 'arrow' }));
        spawnPart(pp.clone().add(new THREE.Vector3(0, 1.5, 0)), 0xffffff, 5, 5);
      }
    }
  }

  // AURA
  if (PASSIVES.aura.active) {
    if (PASSIVES.aura.mesh) {
      PASSIVES.aura.mesh.position.copy(pp);
      PASSIVES.aura.mesh.position.y = terrainH(pp.x, pp.z) + 0.15;
      PASSIVES.aura.mesh.rotation.z += dt;
    }
    PASSIVES.aura.cd -= dt;
    if (PASSIVES.aura.cd <= 0) {
      PASSIVES.aura.cd = PASSIVES.aura.maxCd;
      monsters.forEach(m => {
        if (!m.dead && m.root.position.distanceTo(pp) < PASSIVES.aura.range) {
          m.takeDmg(PASSIVES.aura.dmg, false, 0, pp);
          spawnPart(m.root.position, 0xff4400, 2, 2);
        }
      });
    }
  }

  // POISON
  if (PASSIVES.poison.active) {
    PASSIVES.poison.cd -= dt;
    if (PASSIVES.poison.cd <= 0) {
      PASSIVES.poison.cd = PASSIVES.poison.maxCd;
      const pool = new THREE.Mesh(new THREE.CircleGeometry(PASSIVES.poison.range, 16), new THREE.MeshBasicMaterial({ color: 0x44cc00, transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
      pool.rotation.x = -Math.PI / 2;
      pool.position.copy(pp);
      pool.position.y = terrainH(pp.x, pp.z) + 0.1;
      scene.add(pool);
      PASSIVES.poison.pools.push({ m: pool, t: 5.0, tick: 0 });
    }
    PASSIVES.poison.pools = PASSIVES.poison.pools.filter(p => {
      p.t -= dt;
      p.tick -= dt;
      if (p.tick <= 0) {
        p.tick = 0.5;
        monsters.forEach(m => {
          if (!m.dead && m.root.position.distanceTo(p.m.position) < PASSIVES.poison.range) {
            m.takeDmg(PASSIVES.poison.dmg, false, 0, p.m.position);
            spawnPart(m.root.position, 0x44cc00, 2, 2);
          }
        });
      }
      if (p.t <= 0) {
        scene.remove(p.m);
        p.m.geometry.dispose();
        p.m.material.dispose();
      }
      return p.t > 0;
    });
  }

  // SHIELD
  if (PASSIVES.shield.active) {
    PASSIVES.shield.angle -= dt * 2.0;
    PASSIVES.shield.meshes.forEach((m, i) => {
      const off = (i / PASSIVES.shield.count) * Math.PI * 2, r = PASSIVES.shield.range;
      m.position.set(pp.x + Math.cos(PASSIVES.shield.angle + off) * r, 0, pp.z + Math.sin(PASSIVES.shield.angle + off) * r);
      m.position.y = terrainH(m.position.x, m.position.z) + 1.5;
      m.lookAt(pp);

      monsters.forEach(mon => {
        if (!mon.dead && mon.root.position.distanceTo(m.position) < 1.0 && mon.orbHitT <= 0) {
          mon.takeDmg(PASSIVES.shield.dmg, false, GameState.pKnockback * 2, pp);
          mon.orbHitT = 0.4;
          spawnPart(m.position, 0x4488ff, 5, 5);
        }
      });
    });
  }

  // TURRET
  if (PASSIVES.turret.active) {
    PASSIVES.turret.cd -= dt;
    if (PASSIVES.turret.cd <= 0) {
      PASSIVES.turret.cd = PASSIVES.turret.maxCd;
      const t = mkSprite(0x888888, 1.0, 1.5, 'box');
      t.position.copy(pp);
      t.position.y = terrainH(pp.x, pp.z) + 0.75;
      scene.add(t);
      PASSIVES.turret.meshes.push({ m: t, life: 15.0, fireCd: 0 });
    }
    PASSIVES.turret.meshes = PASSIVES.turret.meshes.filter(t => {
      t.life -= dt;
      t.fireCd -= dt;
      if (t.fireCd <= 0) {
        let tgt = null, minD = PASSIVES.turret.range;
        monsters.forEach(m => {
          if (!m.dead) {
            const d = m.root.position.distanceTo(t.m.position);
            if (d < minD) { minD = d; tgt = m; }
          }
        });
        if (tgt) {
          t.fireCd = 0.8;
          const dir = tgt.root.position.clone().sub(t.m.position).normalize();
          projectiles.push(new Proj(t.m.position.clone().add(new THREE.Vector3(0, 1, 0)), dir, PASSIVES.turret.dmg, 0xffff00, 20, 1.0, { scale: 0.5, shape: 'circle' }));
        }
      }
      if (t.life <= 0) scene.remove(t.m);
      return t.life > 0;
    });
  }

  // NECRO SKULLS
  if (PASSIVES.skulls.active) {
    PASSIVES.skulls.cd -= dt;
    if (PASSIVES.skulls.cd <= 0) {
      PASSIVES.skulls.cd = PASSIVES.skulls.maxCd;
      let t = null, minD = PASSIVES.skulls.range;
      monsters.forEach(m => {
        if (!m.dead) {
          const d = m.root.position.distanceTo(pp);
          if (d < minD) { minD = d; t = m; }
        }
      });
      if (t) {
        const dir = t.root.position.clone().sub(pp).normalize();
        projectiles.push(new Proj(pp.clone().add(new THREE.Vector3(0, 1.5, 0)), dir, PASSIVES.skulls.dmg, 0x88ff88, 15, 3.0, { pierce: 0, homing: 2.0, scale: 1.2, shape: 'circle' }));
      }
    }
  }

  // METEOR
  if (PASSIVES.meteor.active) {
    PASSIVES.meteor.cd -= dt;
    if (PASSIVES.meteor.cd <= 0) {
      PASSIVES.meteor.cd = PASSIVES.meteor.maxCd;
      const t = monsters[Math.floor(Math.random()*monsters.length)];
      if(t && !t.dead) {
        const pos = t.root.position.clone();
        spawnPart(pos, 0xff4400, 20, 8);
        monsters.forEach(m => {
          if(!m.dead && m.root.position.distanceTo(pos) < PASSIVES.meteor.range) m.takeDmg(PASSIVES.meteor.dmg, false, GameState.pKnockback*2, pos);
        });
      }
    }
  }

  // LIGHTNING
  if (PASSIVES.lightning.active) {
    PASSIVES.lightning.cd -= dt;
    if (PASSIVES.lightning.cd <= 0) {
      PASSIVES.lightning.cd = PASSIVES.lightning.maxCd;
      const t = monsters[Math.floor(Math.random()*monsters.length)];
      if(t && !t.dead && t.root.position.distanceTo(pp) < PASSIVES.lightning.range) {
        t.takeDmg(PASSIVES.lightning.dmg); spawnPart(t.root.position, 0xffff00, 8, 5);
      }
    }
  }
}

// ==================== WEAPON VISUALS ====================
function buildWeapon3D(type, level) {
  const g = new THREE.Group();
  
  // Get Skin
  const skinId = (typeof GameState !== 'undefined' && GameState.saveData && GameState.saveData.equippedCosmetic) ? GameState.saveData.equippedCosmetic : 'default';
  const skin = (typeof COSMETICS !== 'undefined') ? (COSMETICS.find(c => c.id === skinId) || COSMETICS[0]) : {colors:{steel:0x99aacc, wood:0x5a3a20, gold:0xffaa00, dark:0x1a1a1a, blade:0xffffff}};
  const cols = skin.colors;

  // Materials
  const mSteel = new THREE.MeshStandardMaterial({color:cols.steel, roughness:0.3, metalness:0.9});
  const mBlade = new THREE.MeshStandardMaterial({color:cols.blade, roughness:0.2, metalness:1.0});
  const mSilver = new THREE.MeshStandardMaterial({color:cols.steel, roughness:0.2, metalness:0.9});
  const mWood = new THREE.MeshStandardMaterial({color:cols.wood, roughness:0.9});
  const mDarkWood = new THREE.MeshStandardMaterial({color:cols.wood, roughness:0.9});
  const mGold = new THREE.MeshStandardMaterial({color:cols.gold, roughness:0.2, metalness:1.0});
  const mDark = new THREE.MeshStandardMaterial({color:cols.dark, roughness:0.6, metalness:0.4});
  const mBlackMetal = new THREE.MeshStandardMaterial({color:cols.dark, roughness:0.4, metalness:0.8});
  const mRed = new THREE.MeshStandardMaterial({color:0xaa2222});
  const mGlowBlue = new THREE.MeshBasicMaterial({color:0x00ffff});
  const mGlowRed = new THREE.MeshBasicMaterial({color:0xff4400});
  const mGlowYellow = new THREE.MeshBasicMaterial({color:0xffffaa});
  
  // Helper geometries
  const box = new THREE.BoxGeometry(1,1,1);
  const cyl = new THREE.CylinderGeometry(1,1,1,12);
  const cone = new THREE.ConeGeometry(1,1,12);
  const sphere = new THREE.SphereGeometry(1,12,12);
  
  function addPart(geo, mat, scl, pos, rot) {
    const m = new THREE.Mesh(geo, mat);
    if(scl) m.scale.set(scl[0], scl[1], scl[2]);
    if(pos) m.position.set(pos[0], pos[1], pos[2]);
    if(rot) m.rotation.set(rot[0], rot[1], rot[2]);
    m.castShadow = true;
    g.add(m);
    return m;
  }

  if (type === 'sword' || type === 'greatsword' || type === 'dark_blade') {
    const isGreat = type !== 'sword';
    const bladeLen = isGreat ? 2.2 : 1.4;
    const bladeWid = isGreat ? 0.25 : 0.12;
    
    // Blade (with edge)
    addPart(box, type==='dark_blade'?mBlackMetal:mBlade, [bladeWid, bladeLen, 0.02], [0, bladeLen/2 + 0.3, 0]);
    // Central Ridge
    addPart(box, type==='dark_blade'?mDark:mSteel, [bladeWid*0.3, bladeLen*0.9, 0.03], [0, bladeLen/2 + 0.3, 0]);
    
    // Guard
    const guardW = isGreat ? 0.8 : 0.5;
    addPart(box, mGold, [guardW, 0.05, 0.08], [0, 0.3, 0]);
    addPart(box, mGold, [guardW*0.2, 0.1, 0.1], [0, 0.3, 0]); // Guard center
    
    // Handle
    addPart(cyl, mWood, [0.04, 0.5, 0.04], [0, 0.05, 0]);
    
    // Pommel
    addPart(sphere, mGold, [0.08, 0.08, 0.08], [0, -0.25, 0]);

  } else if (type === 'rapier' || type === 'needle') {
    // Thin Blade
    addPart(box, mBlade, [0.04, 1.6, 0.02], [0, 0.8, 0]);
    // Cup Guard
    const cup = addPart(sphere, mGold, [0.15, 0.15, 0.15], [0, 0.1, 0]);
    cup.scale.y = 0.1; // Flattened sphere
    // Handle
    addPart(cyl, mWood, [0.03, 0.3, 0.03], [0, -0.1, 0]);
    // Pommel
    addPart(sphere, mGold, [0.05, 0.05, 0.05], [0, -0.3, 0]);

  } else if (type === 'katana') {
    // Blade
    addPart(box, mBlade, [0.08, 1.6, 0.02], [0, 0.8, 0.05], [0.05, 0, 0]);
    // Tsuba (Guard)
    addPart(cyl, mBlackMetal, [0.12, 0.02, 0.12], [0, 0.1, 0]);
    // Handle
    addPart(cyl, mDarkWood, [0.035, 0.5, 0.035], [0, -0.15, 0], [0.05, 0, 0]);
    
  } else if (type === 'axe' || type === 'cleaver') {
    const isCleaver = type === 'cleaver';
    // Handle
    addPart(cyl, mWood, [0.05, 1.2, 0.05], [0, 0.2, 0]);
    
    if (isCleaver) {
        // Rectangular blade
        addPart(box, mSteel, [0.6, 0.8, 0.05], [0.3, 0.6, 0]);
    } else {
        // Axe Head (Double sided or single)
        addPart(box, mSteel, [0.5, 0.4, 0.05], [0.25, 0.7, 0]); // Right blade
        addPart(box, mSteel, [0.5, 0.4, 0.05], [-0.25, 0.7, 0]); // Left blade
        // Central block
        addPart(box, mDark, [0.15, 0.5, 0.08], [0, 0.7, 0]);
    }

  } else if (type === 'hammer' || type === 'mace' || type === 'wrench') {
    // Handle
    addPart(cyl, mWood, [0.05, 1.0, 0.05], [0, 0.2, 0]);
    
    if (type === 'wrench') {
        addPart(box, mSteel, [0.4, 0.15, 0.1], [0, 0.7, 0]);
        addPart(box, mSteel, [0.15, 0.3, 0.1], [-0.2, 0.8, 0]);
        addPart(box, mSteel, [0.15, 0.3, 0.1], [0.2, 0.8, 0]);
    } else if (type === 'mace') {
        // Spiked ball
        addPart(sphere, mDark, [0.25, 0.25, 0.25], [0, 0.7, 0]);
        // Spikes
        addPart(cone, mSteel, [0.05, 0.2, 0.05], [0, 0.95, 0]);
        addPart(cone, mSteel, [0.05, 0.2, 0.05], [0.25, 0.7, 0], [0, 0, -Math.PI/2]);
        addPart(cone, mSteel, [0.05, 0.2, 0.05], [-0.25, 0.7, 0], [0, 0, Math.PI/2]);
        addPart(cone, mSteel, [0.05, 0.2, 0.05], [0, 0.7, 0.25], [Math.PI/2, 0, 0]);
        addPart(cone, mSteel, [0.05, 0.2, 0.05], [0, 0.7, -0.25], [-Math.PI/2, 0, 0]);
    } else {
        // Hammer head
        addPart(box, mSteel, [0.6, 0.3, 0.3], [0, 0.7, 0]);
    }

  } else if (type === 'spear' || type === 'trident' || type === 'javelin') {
    // Shaft
    addPart(cyl, mWood, [0.03, 2.5, 0.03], [0, 0, 0]);
    
    if (type === 'trident') {
        const baseY = 1.2;
        addPart(box, mGold, [0.4, 0.05, 0.05], [0, baseY, 0]);
        addPart(cone, mSteel, [0.03, 0.6, 0.03], [0, baseY+0.3, 0]); // Center
        addPart(cone, mSteel, [0.03, 0.5, 0.03], [0.15, baseY+0.25, 0]); // Right
        addPart(cone, mSteel, [0.03, 0.5, 0.03], [-0.15, baseY+0.25, 0]); // Left
    } else {
        // Spear tip
        addPart(cone, mSteel, [0.08, 0.6, 0.08], [0, 1.4, 0]);
        addPart(box, mDark, [0.1, 0.1, 0.1], [0, 1.1, 0]); // Connector
    }

  } else if (type === 'scepter' || type === 'void_staff' || type === 'fire_staff' || type === 'sun_staff' || type === 'lightning_rod') {
    // Staff Shaft
    addPart(cyl, type==='void_staff'?mBlackMetal:mWood, [0.04, 1.8, 0.04], [0, 0, 0]);
    
    const headY = 0.9;
    let gemMat = mGlowBlue;
    if (type === 'fire_staff') gemMat = mGlowRed;
    if (type === 'sun_staff' || type === 'lightning_rod') gemMat = mGlowYellow;
    if (type === 'void_staff') gemMat = new THREE.MeshBasicMaterial({color:0xaa00ff});

    // Head
    if (type === 'sun_staff') {
        addPart(new THREE.TorusGeometry(0.3, 0.05, 8, 16), mGold, [1,1,1], [0, headY, 0]);
        addPart(sphere, gemMat, [0.15, 0.15, 0.15], [0, headY, 0]);
        // Rays
        for(let i=0; i<8; i++) {
            const a = i/8 * Math.PI*2;
            addPart(box, mGold, [0.05, 0.3, 0.05], [Math.cos(a)*0.4, headY+Math.sin(a)*0.4, 0], [0, 0, a]);
        }
    } else if (type === 'lightning_rod') {
        addPart(cone, mGold, [0.1, 0.6, 0.1], [0, headY+0.2, 0]);
        addPart(new THREE.TorusGeometry(0.2, 0.03, 8, 16), mSteel, [1,1,1], [0, headY, 0], [Math.PI/2, 0, 0]);
    } else {
        // Generic / Void / Fire
        const cage = type === 'void_staff' ? mBlackMetal : mGold;
        addPart(new THREE.IcosahedronGeometry(0.2), cage, [1,1,1], [0, headY, 0], [0, Math.PI/4, 0]); // Cage
        addPart(new THREE.OctahedronGeometry(0.1), gemMat, [1,1,1], [0, headY, 0]); // Core
    }

  } else if (type === 'pistol' || type === 'revolver' || type === 'rifle' || type === 'blowgun') {
    const isRifle = type === 'rifle';
    const isBlow = type === 'blowgun';
    
    if (isBlow) {
        addPart(cyl, mWood, [0.04, 1.5, 0.04], [0, 0.2, 0], [Math.PI/2, 0, 0]);
    } else {
        const barrelLen = isRifle ? 1.2 : 0.5;
        // Barrel
        addPart(cyl, mBlackMetal, [0.05, barrelLen, 0.05], [0, 0.1, -barrelLen/2], [Math.PI/2, 0, 0]);
        // Body/Receiver
        addPart(box, mDark, [0.08, 0.1, 0.2], [0, 0.1, 0.1]);
        // Grip
        addPart(box, mWood, [0.07, 0.2, 0.08], [0, -0.1, 0.15], [0.3, 0, 0]);
        
        if (isRifle) {
            // Stock
            addPart(box, mWood, [0.07, 0.15, 0.4], [0, 0.05, 0.4]);
        }
        if (type === 'revolver') {
            // Cylinder
            addPart(cyl, mSteel, [0.08, 0.08, 0.08], [0, 0.1, 0], [Math.PI/2, 0, 0]);
        }
    }

  } else if (type === 'grimoire') {
    // Cover
    addPart(box, mDarkWood, [0.6, 0.8, 0.1], [0, 0, 0]);
    // Pages
    addPart(box, mSilver, [0.55, 0.75, 0.08], [0, 0, 0.02]);
    // Symbol
    addPart(sphere, mGold, [0.1, 0.1, 0.02], [0, 0.1, 0.06]);

  } else if (type === 'bow' || type === 'crossbow' || type === 'greatbow' || type === 'ice_bow') {
    const isCross = type === 'crossbow';
    const isGreat = type === 'greatbow';
    const bowMat = type === 'ice_bow' ? new THREE.MeshStandardMaterial({color:0xaaddff, roughness:0.1}) : mWood;
    
    if (isCross) {
        // Stock
        addPart(box, mWood, [0.1, 0.8, 0.15], [0, 0, 0], [Math.PI/2, 0, 0]);
        // Prod (Bow part)
        const prod = new THREE.Group();
        prod.position.set(0, 0, -0.4);
        g.add(prod);
        addPart(box, mSteel, [0.8, 0.05, 0.05], [0, 0, 0]); // Straight prod for simplicity or use curves
        // String
        addPart(box, mSilver, [0.75, 0.01, 0.01], [0, 0, 0.35]);
    } else {
        // Longbow
        const sz = isGreat ? 1.5 : 1.0;
        // Upper Limb
        addPart(box, bowMat, [0.05, sz, 0.05], [0, sz/2, 0.2], [0.2, 0, 0]);
        // Lower Limb
        addPart(box, bowMat, [0.05, sz, 0.05], [0, -sz/2, 0.2], [-0.2, 0, 0]);
        // Handle
        addPart(box, mDark, [0.06, 0.2, 0.06], [0, 0, 0.1]);
        // String
        addPart(cyl, mSilver, [0.01, sz*1.9, 0.01], [0, 0, -0.1]);
    }

  } else if (type === 'scythe') {
    addPart(cyl, mWood, [0.05, 2.0, 0.05], [0, 0, 0]);
    addPart(box, mSteel, [0.8, 0.1, 0.05], [0.4, 0.9, 0], [0, 0, 0.3]); // Blade

  } else if (type === 'boomerang') {
    addPart(box, mWood, [0.8, 0.1, 0.05], [0, 0, 0], [0, 0, 0.5]);
    addPart(box, mWood, [0.8, 0.1, 0.05], [0, 0, 0], [0, 0, -0.5]);

  } else if (type === 'flail') {
    addPart(cyl, mWood, [0.05, 0.8, 0.05], [0, -0.2, 0]);
    addPart(new THREE.SphereGeometry(0.2), mDark, [1,1,1], [0, 0.6, 0.3]); // Ball

  } else if (type === 'gauntlets' || type === 'claws') {
    addPart(box, mDark, [0.3, 0.3, 0.3], [0, 0, 0]);
    if (type === 'claws') {
        addPart(new THREE.ConeGeometry(0.05, 0.3), mSteel, [1,1,1], [0.1, 0.2, 0]);
        addPart(new THREE.ConeGeometry(0.05, 0.3), mSteel, [1,1,1], [-0.1, 0.2, 0]);
    }

  } else if (type === 'whip') {
    addPart(cyl, mWood, [0.05, 0.4, 0.05], [0, -0.2, 0]);
    addPart(new THREE.TorusGeometry(0.3, 0.05, 8, 16), mDark, [1,1,1], [0, 0.3, 0]);

  } else if (type === 'cards') {
    addPart(box, mBlade, [0.2, 0.3, 0.01], [0, 0.2, 0]);
    addPart(box, mRed, [0.1, 0.15, 0.015], [0, 0.2, 0]);

  } else if (type === 'shuriken') {
    addPart(box, mSteel, [0.4, 0.05, 0.4], [0, 0.2, 0]);

  } else if (type === 'potion') {
    addPart(new THREE.SphereGeometry(0.2), new THREE.MeshStandardMaterial({color:0x00ff00, transparent:true, opacity:0.8}), [1,1,1], [0, 0.2, 0]);
    addPart(cyl, mWood, [0.05, 0.1, 0.05], [0, 0.4, 0]);

  } else if (type === 'runestone') {
    addPart(box, new THREE.MeshStandardMaterial({color:0x00ffff}), [0.3, 0.3, 0.3], [0, 0.2, 0]);

  } else if (type === 'bomb') {
    addPart(new THREE.SphereGeometry(0.25), mDark, [1,1,1], [0, 0.2, 0]);
    addPart(cyl, mWood, [0.05, 0.1, 0.05], [0, 0.45, 0]); // Fuse

  } else if (type === 'shield' || type === 'totem') {
      if (type === 'totem') {
          addPart(cyl, mWood, [0.15, 1.5, 0.15], [0, 0.5, 0]);
          addPart(box, mRed, [0.4, 0.3, 0.4], [0, 0.8, 0]); // Head
          addPart(box, mGold, [0.5, 0.1, 0.1], [0, 0.6, 0]); // Wings
      } else {
          // Shield
          addPart(box, mSteel, [0.8, 1.0, 0.1], [0, 0.2, 0]);
          addPart(box, mGold, [0.9, 1.1, 0.05], [0, 0.2, -0.01]); // Rim
      }

  } else if (type === 'mirror') {
    addPart(box, mSteel, [0.4, 0.6, 0.05], [0, 0.5, 0]);
    addPart(cyl, mWood, [0.04, 0.4, 0.04], [0, 0, 0]);

  } else if (type === 'needles') {
    addPart(cyl, mSteel, [0.02, 0.5, 0.02], [0, 0.2, 0]);
    addPart(cyl, mSteel, [0.02, 0.5, 0.02], [0.1, 0.2, 0]);
    addPart(cyl, mSteel, [0.02, 0.5, 0.02], [-0.1, 0.2, 0]);

  } else if (type === 'dagger_sac') {
    addPart(box, mRed, [0.1, 0.6, 0.05], [0, 0.3, 0]);
    addPart(cyl, mDark, [0.04, 0.3, 0.04], [0, 0, 0]);

  } else if (type === 'drill') {
    addPart(new THREE.ConeGeometry(0.15, 0.8), mSteel, [1,1,1], [0, 0.4, 0], [Math.PI, 0, 0]);
    addPart(box, mDark, [0.3, 0.3, 0.3], [0, 0.8, 0]);

  } else if (type === 'star_globe') {
    addPart(new THREE.SphereGeometry(0.2), mGold, [1,1,1], [0, 0.5, 0]);
    addPart(new THREE.TorusGeometry(0.3, 0.02, 8, 16), mSteel, [1,1,1], [0, 0.5, 0]);

  } else if (type === 'balls') {
    addPart(sphere, mRed, [0.15, 0.15, 0.15], [0, 0.2, 0]);
    addPart(sphere, mGlowBlue, [0.15, 0.15, 0.15], [0.2, 0.4, 0]);

  } else if (type === 'rock') {
    addPart(new THREE.DodecahedronGeometry(0.3), mDark, [1,1,1], [0, 0.3, 0]);

  } else if (type === 'hourglass') {
    addPart(new THREE.ConeGeometry(0.2, 0.3), mGold, [1,1,1], [0, 0.15, 0]);
    addPart(new THREE.ConeGeometry(0.2, 0.3), mGold, [1,1,1], [0, 0.45, 0], [Math.PI, 0, 0]);

  } else {
    // Default
    addPart(cyl, mWood, [0.05, 1.0, 0.05], [0, 0.3, 0]);
  }

  // Orient for viewmodel (Y up, -Z forward)
  g.rotation.x = -Math.PI / 2;
  g.rotation.z = Math.PI / 8;
  g.rotation.y = Math.PI / 8;

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
  window.vmModel.scale.set(0.3, 0.3, 0.3);
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
      
      // Create new 3D weapon
      window.tpWeapon = buildWeapon3D(t, l);
      const S = (typeof playerTypeData !== 'undefined' && playerTypeData.S) ? playerTypeData.S : 1.0;
      window.tpWeapon.scale.set(0.5 * S, 0.5 * S, 0.5 * S);
      
      // Reset rotation from buildWeapon3D default
      window.tpWeapon.rotation.set(0, 0, 0);

      let parent = playerParts.handR;
      if (!parent && playerParts.armRD && playerParts.armRD.visible) parent = playerParts.armRD;
      if (!parent && playerParts.armR && playerParts.armR.visible) parent = playerParts.armR;
      if (!parent && playerParts.armRU && playerParts.armRU.visible) parent = playerParts.armRU;
      if (!parent) parent = playerParts.torso;

      // Left hand for bows
      if (t.includes('bow') || t.includes('crossbow')) {
          parent = playerParts.handL;
          if (!parent && playerParts.armLD && playerParts.armLD.visible) parent = playerParts.armLD;
          if (!parent && playerParts.armL && playerParts.armL.visible) parent = playerParts.armL;
          if (!parent && playerParts.armLU && playerParts.armLU.visible) parent = playerParts.armLU;
          if (!parent) parent = playerParts.torso;
      }

      if (parent) {
          parent.add(window.tpWeapon);
          
          if (parent === playerParts.armRD || parent === playerParts.armLD) {
              window.tpWeapon.position.set(0, -0.6 * S, 0.1 * S);
              // Align with arm
              window.tpWeapon.rotation.set(Math.PI, -Math.PI/2, 0);
              
              if (t.includes('bow') || t.includes('crossbow')) {
                  window.tpWeapon.rotation.set(0, Math.PI/2, Math.PI/2);
                  window.tpWeapon.position.set(0, -0.6 * S, 0);
              } else if (t.includes('staff') || t.includes('spear') || t.includes('trident')) {
                  window.tpWeapon.rotation.set(Math.PI, 0, 0);
                  window.tpWeapon.position.set(0, -0.4 * S, 0.2 * S);
              }
          } else if (parent === playerParts.armRU || parent === playerParts.armLU || parent === playerParts.armR || parent === playerParts.armL) {
              // Upper arm or single arm attachment (Beast/Mech)
              window.tpWeapon.position.set(0, -0.5 * S, 0.2 * S);
              window.tpWeapon.rotation.set(Math.PI, -Math.PI/2, 0);
              
              if (t.includes('claws') || t.includes('gauntlets')) {
                   window.tpWeapon.position.set(0, -0.3 * S, 0);
                   // Adjust for claws/gauntlets to face forward
                   window.tpWeapon.rotation.set(Math.PI, -Math.PI/2, -Math.PI/2);
              }
          } else {
              window.tpWeapon.position.set(0.5 * S, 0, 0.5 * S);
          }
      }
  }
}

// ==================== FIRE INPUT ====================
function handleFire() {
  if (document.pointerLockElement === renderer.domElement && !GameState.levelingUp) {
    if (WEAPONS.SCEPTER.active) fireScepter();
    else if (WEAPONS.BOW.active) fireBow();
    else if (WEAPONS.BOOMERANG.active) fireBoomerang();
    else if (WEAPONS.SWORD.active) useMelee(WEAPONS.SWORD);
    else if (WEAPONS.AXE.active) useMelee(WEAPONS.AXE);
    else if (WEAPONS.SPEAR.active) useMelee(WEAPONS.SPEAR);
    else if (WEAPONS.HAMMER.active) useMelee(WEAPONS.HAMMER);
    else if (WEAPONS.DAGGERS.active) useMelee(WEAPONS.DAGGERS);
    else if (WEAPONS.SCYTHE.active) useMelee(WEAPONS.SCYTHE);
    else if (WEAPONS.KATANA.active) useMelee(WEAPONS.KATANA);
    else if (WEAPONS.FLAIL.active) useMelee(WEAPONS.FLAIL);
    else if (WEAPONS.GAUNTLETS.active) useMelee(WEAPONS.GAUNTLETS);
    else if (WEAPONS.GRIMOIRE.active) fireGrimoire();
    else if (WEAPONS.WHIP.active) useWhip();
    else if (WEAPONS.CARDS.active) fireCards();
    else if (WEAPONS.PISTOL.active) firePistol();
    else if (WEAPONS.TRIDENT.active) fireTrident();
    else if (WEAPONS.RIFLE.active) fireRifle();
    else if (WEAPONS.SHURIKEN.active) fireShuriken();
    else if (WEAPONS.VOID_STAFF.active) fireVoidStaff();
    else if (WEAPONS.FIRE_STAFF.active) fireFireStaff();
    else if (WEAPONS.LEAF_BLADE.active) fireLeafBlade();
    else if (WEAPONS.POTION.active) firePotion();
    else if (WEAPONS.LUTE.active) useLute();
    else if (WEAPONS.WRENCH.active) useMelee(WEAPONS.WRENCH);
    else if (WEAPONS.JAVELIN.active) fireJavelin();
    else if (WEAPONS.CROSSBOW.active) fireCrossbow();
    else if (WEAPONS.RUNESTONE.active) fireRunestone();
    else if (WEAPONS.RAPIER.active) useMelee(WEAPONS.RAPIER);
    else if (WEAPONS.BOMB.active) fireBomb();
    else if (WEAPONS.TOTEM.active) useMelee(WEAPONS.TOTEM);
    else if (WEAPONS.CLAWS.active) useMelee(WEAPONS.CLAWS);
    else if (WEAPONS.MACE.active) useMelee(WEAPONS.MACE);
    else if (WEAPONS.MIRROR.active) fireMirror();
    else if (WEAPONS.REVOLVER.active) fireRevolver();
    else if (WEAPONS.NEEDLES.active) fireNeedles();
    else if (WEAPONS.LIGHTNING_ROD.active) fireLightningRod();
    else if (WEAPONS.ICE_BOW.active) fireIceBow();
    else if (WEAPONS.DAGGER_SAC.active) useMelee(WEAPONS.DAGGER_SAC);
    else if (WEAPONS.DRILL.active) useMelee(WEAPONS.DRILL);
    else if (WEAPONS.STAR_GLOBE.active) fireStarGlobe();
    else if (WEAPONS.CLEAVER.active) fireCleaver();
    else if (WEAPONS.BALLS.active) fireBalls();
    else if (WEAPONS.GREATSWORD.active) useMelee(WEAPONS.GREATSWORD);
    else if (WEAPONS.ROCK.active) fireRock();
    else if (WEAPONS.BLOWGUN.active) fireBlowgun();
    else if (WEAPONS.GREATBOW.active) fireGreatbow();
    else if (WEAPONS.DARK_BLADE.active) useMelee(WEAPONS.DARK_BLADE);
    else if (WEAPONS.SUN_STAFF.active) fireSunStaff();
    else if (WEAPONS.HOURGLASS.active) fireHourglass();
  }
}

// ==================== SPECIAL ABILITIES ====================
function triggerSpecial() {
  if (GameState.pSpecialCd > 0) return;
  
  const cls = GameState.pClass;
  const spec = cls.special;
  if (!spec) return;
  
  if (GameState.pMP < spec.cost) {
      addNotif("Pas assez de Mana !", "#ff4444");
      return;
  }

  let used = false;
  const pp = playerPivot.position;
  const dir = fwd();

  switch (spec.name) {
      case 'Transfert': // Mage
          const dist = 8;
          const target = pp.clone().addScaledVector(dir, dist);
          target.y = terrainH(target.x, target.z) + 1.7;
          playerPivot.position.copy(target);
          spawnPart(pp, 0x00ffff, 20, 5);
          spawnPart(target, 0x00ffff, 20, 5);
          addNotif("✨ Transfert", "#aaddff");
          used = true;
          break;

      case 'Rempart': // Chevalier
      case 'Bouclier Divin': // Templar
          GameState.invTimer = 3.0;
          spawnPart(pp, 0xffffff, 30, 2);
          addNotif("🛡️ Invulnérable", "#ffffff");
          used = true;
          break;

      case 'Cri de Guerre': // Barbare
      case 'Hurlement': // Werewolf
          spawnPart(pp, 0xffaa00, 40, 10);
          addScreenShake(0.5);
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(pp) < 12) {
                  m.takeDmg(20, true, 20, pp); // Gros recul
                  if(spec.name === 'Hurlement') m.T.spd *= 0.5; // Fear/Slow
              }
          });
          addNotif("😡 " + spec.name.toUpperCase(), "#ff4400");
          used = true;
          break;

      case 'Roulade': // Ranger
          GameState.dashCd = 0;
          GameState.dashTime = 0.25;
          GameState.dashDir.copy(dir).negate();
          used = true;
          break;

      case 'Fumigène': // Voleur
      case 'Disparition': // Shadow
          GameState.invTimer = 3.0;
          GameState.dashCd = 0;
          spawnPart(pp, 0x555555, 40, 4);
          addNotif("💨 Invisible", "#aaaaaa");
          used = true;
          break;

      case 'Substitution': // Ninja
          let subTarget = null;
          let minD = 20;
          monsters.forEach(m => {
              if (!m.dead) {
                  const d = m.root.position.distanceTo(pp);
                  if (d < minD) { minD = d; subTarget = m; }
              }
          });
          spawnPart(pp, 0x555555, 20, 5); // Smoke at old pos
          if (subTarget) {
              // Teleport behind
              const subDir = subTarget.root.position.clone().sub(pp).normalize();
              const dest = subTarget.root.position.clone().add(subDir.multiplyScalar(2));
              dest.y = terrainH(dest.x, dest.z) + 1.7;
              playerPivot.position.copy(dest);
              subTarget.takeDmg(50, true, 0, pp); // Backstab dmg
              addNotif("⚡ Substitution", "#ffffff");
          } else {
              // Just dash forward
              const dest = pp.clone().addScaledVector(dir, 6);
              dest.y = terrainH(dest.x, dest.z) + 1.7;
              playerPivot.position.copy(dest);
          }
          spawnPart(playerPivot.position, 0x555555, 20, 5); // Smoke at new pos
          used = true;
          break;

      case 'Charge': // Lancer
      case 'Coupe Éclair': // Shogun
      case 'Envol': // Valkyrie
          GameState.dashCd = 0;
          GameState.dashTime = 0.4;
          GameState.dashDir.copy(dir);
          spawnPart(pp, 0xff0000, 20, 5);
          monsters.forEach(m => {
             if (!m.dead && m.root.position.distanceTo(pp) < 5) m.takeDmg(40, true, 10, pp);
          });
          used = true;
          break;

      case 'Soin Sacré': // Paladin
      case 'Régénération': // Hydra
      case 'Festin': // Chef
          const heal = spec.name === 'Festin' ? 100 : 30;
          GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + heal);
          spawnPart(pp, 0x00ff00, 30, 3);
          addNotif(`💚 +${heal} PV`, "#00ff00");
          used = true;
          break;

      case 'Piège': // Hunter
          projectiles.push(new Proj(pp.clone(), new THREE.Vector3(0,0,0), 50, 0x885522, 0, 10.0, {blast: 4, scale: 1.0, shape: 'box'}));
          addNotif("🕸️ Piège posé", "#aa8855");
          used = true;
          break;

      case 'Invocation': // Necro
      case 'Armée des Morts': // Lich
      case 'Appel de la Bête': // Tamer
      case 'Essaim': // Hive
          for(let i=0; i<(spec.name==='Armée des Morts'?5:1); i++) {
              const d = new THREE.Vector3(Math.random()-0.5, 0, Math.random()-0.5).normalize();
              projectiles.push(new Proj(spawnPos(), d, 20, 0x00ff00, 8, 15.0, {homing: 2.0, bounce: 10, scale: 0.8, shape: 'circle'}));
          }
          addNotif("💀 Serviteurs !", "#00ff00");
          used = true;
          break;

      case 'Concentration': // Samurai
      case 'Visée': // Sniper
      case 'Hymne': // Bard
      case 'Surcharge': // Engineer
          GameState.frenzyTimer = 5.0;
          spawnPart(pp, 0xffff00, 20, 5);
          addNotif("⚡ Buff Actif !", "#ffff00");
          used = true;
          break;

      case 'Malédiction': // Warlock
      case 'Vaudou': // Witchdoc
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(pp) < 15) {
                  m.takeDmg(10);
                  m.bleedStack += 20;
                  spawnPart(m.root.position, 0xaa00aa, 5, 2);
              }
          });
          addNotif("☠ Malédiction", "#aa00aa");
          used = true;
          break;

      case 'Jackpot': // Gambler
          const r = Math.random();
          if (r < 0.33) { GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + 50); addNotif("💰 Soin !", "#ffff00"); }
          else if (r < 0.66) { GameState.pMP = GameState.pMaxMP; addNotif("🔵 Mana Max !", "#00ffff"); }
          else { GameState.frenzyTimer = 8.0; addNotif("🎰 FRENZY !", "#ff0000"); }
          used = true;
          break;

      case 'Tir de Canon': // Pirate
      case 'Guillotine': // Executioner
      case 'Perce-Cœur': // Kyudo
          projectiles.push(new Proj(spawnPos(), dir, 150, 0x000000, 40, 3.0, {pierce: 10, blast: 5, scale: 2.0, shape: 'circle'}));
          addScreenShake(0.5);
          used = true;
          break;

      case 'Filet': // Gladiator
      case 'Racines': // Druid
      case 'Cocon': // Arachne
      case 'Temps Arrêté': // Chronomancer
      case 'Verrouillage': // Warden
      case 'Regard': // Void
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(pp) < 15) {
                  m.T.spd = 0;
                  setTimeout(() => { if(!m.dead) m.T.spd = m.T.spd || 1.0; }, 3000);
                  spawnPart(m.root.position, 0xffffff, 5, 1);
              }
          });
          addNotif("❄️ Immobilisation", "#aaddff");
          used = true;
          break;

      case 'Trou Noir': // Voidmage
      case 'Gravité': // Astronomer
      case 'Engloutir': // Leviathan
          const center = pp.clone().addScaledVector(dir, 10);
          spawnPart(center, 0x000000, 50, 2);
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(center) < 15) {
                  const pull = center.clone().sub(m.root.position).normalize().multiplyScalar(0.5);
                  m.root.position.add(pull);
                  m.takeDmg(2);
              }
          });
          addNotif("⚫ Singularité", "#000000");
          used = true;
          break;

      case 'Jugement': // Crusader
          const jPos = pp.clone().addScaledVector(dir, 5);
          jPos.y = terrainH(jPos.x, jPos.z);
          for(let i=0; i<20; i++) spawnPart(jPos.clone().add(new THREE.Vector3(0, i, 0)), 0xffffaa, 5, 2);
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(jPos) < 6) m.takeDmg(80, true, 5, jPos);
          });
          addNotif("✝️ JUGEMENT", "#ffff00");
          used = true;
          break;

      case 'Explosion': // Pyro
      case 'Onde de Choc': // Monk
      case 'Enfer': // Firelord
      case 'Éruption': // Core
          spawnPart(pp, 0xff4400, 40, 8);
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(pp) < 8) {
                  m.takeDmg(50, false, 10, pp);
              }
          });
          used = true;
          break;

      case 'Transmutation': // Alchemist
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(pp) < 8) {
                  m.takeDmg(m.hp + 1);
                  GameState.saveData.money += 10;
                  spawnPart(m.root.position, 0xffd700, 10, 5);
              }
          });
          addNotif("⚗️ Or !", "#ffd700");
          used = true;
          break;

      case 'Rune Explosive': // Runemaster
      case 'Nuage Toxique': // Apothecary
      case 'Acide': // Alien
          const type = spec.name === 'Rune Explosive' ? 0x00ffff : 0x00ff00;
          projectiles.push(new Proj(pp.clone(), new THREE.Vector3(0,0,0), 20, type, 0, 5.0, {blast: 3, scale: 1.5, poison: spec.name!=='Rune Explosive'}));
          used = true;
          break;

      case 'Parade': // Duelist
          GameState.invTimer = 1.0;
          addNotif("⚔️ Parade", "#ffffff");
          used = true;
          break;

      case 'Barrage': // Gunner
      case 'Multiballe': // Juggler
      case 'Pluie de Météores':
          for(let i=0; i<8; i++) {
              const d = dir.clone();
              d.x += (Math.random()-0.5);
              d.z += (Math.random()-0.5);
              d.normalize();
              projectiles.push(new Proj(spawnPos(), d, 30, 0xff0000, 25, 2.0, {blast: 2, scale: 0.5}));
          }
          used = true;
          break;

      case 'Tir Rapide': // Arbalist
          let shots = 0;
          const shoot = () => {
              if(shots >= 3) return;
              const d = fwd();
              projectiles.push(new Proj(spawnPos(), d, getPlayerDmg(WEAPONS.CROSSBOW)*1.5, 0xffffff, 60, 2.0, {pierce: 2, scale:0.8, shape: 'arrow'}));
              shots++;
              setTimeout(shoot, 100);
          };
          shoot();
          used = true;
          break;

      case 'Totem de Soin': // Shaman
          GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + 50);
          spawnPart(pp, 0x00ff00, 20, 5);
          used = true;
          break;

      case 'Double': // Illusionist
      case 'Clone': // Monkey King
          GameState.invTimer = 2.0;
          spawnPart(pp, 0xff00ff, 20, 2);
          addNotif("🎭 Leurre", "#ff00ff");
          used = true;
          break;

      case 'Midi Pile': // Cowboy
          let hits = 0;
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(pp) < 30) {
                  m.takeDmg(100, false, 5, pp);
                  spawnPart(m.root.position, 0xffaa00, 5, 5);
                  hits++;
              }
          });
          if(hits > 0) addNotif("🤠 IT'S HIGH NOON", "#ffaa00");
          used = true;
          break;

      case 'Éclair': // Stormcaller
      case 'Tonnerre': // Storm Lord
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(pp) < 20) {
                  if(Math.random() < 0.5) {
                      m.takeDmg(60);
                      spawnPart(m.root.position, 0xffff00, 10, 10);
                  }
              }
          });
          addNotif("⚡ Foudre", "#ffff00");
          used = true;
          break;

      case 'Blizzard': // Frostarcher
      case 'Avalanche': // Yeti
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(pp) < 20) {
                  m.takeDmg(20, true);
                  m.T.spd *= 0.5;
              }
          });
          spawnPart(pp, 0xaaddff, 50, 10);
          addNotif("❄️ Blizzard", "#aaddff");
          used = true;
          break;

      case 'Sacrifice': // Cultist
          GameState.pHP = Math.max(1, GameState.pHP - 10);
          GameState.pMP = Math.min(GameState.pMaxMP, GameState.pMP + 50);
          GameState.frenzyTimer = 5.0;
          addNotif("🩸 Sacrifice", "#aa0000");
          used = true;
          break;

      case 'Réparation': // Mechanic
          GameState.pHP += 20;
          addNotif("🔧 Réparation", "#888888");
          used = true;
          break;

      case 'Mur de Pierre': // Geomancer
          for(let i=-1; i<=1; i++) {
              const p = pp.clone().addScaledVector(dir, 3).addScaledVector(new THREE.Vector3(-dir.z, 0, dir.x), i*1.5);
              spawnPart(p, 0x555555, 10, 1); 
          }
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(pp) < 5) m.takeDmg(10, true, 10, pp);
          });
          used = true;
          break;

      case 'Absorption': // Darkknight
          GameState.pVamp += 0.5;
          setTimeout(() => GameState.pVamp -= 0.5, 5000);
          addNotif("🌑 Absorption", "#330033");
          used = true;
          break;

      case 'Éclat Solaire': // Sunpriest
      case 'Lumière': // Archangel
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(pp) < 15) {
                  m.takeDmg(40);
              }
          });
          spawnPart(pp, 0xffffaa, 50, 10);
          addNotif("☀️ Lumière", "#ffffaa");
          used = true;
          break;
          
      case 'Fin': // Ultimate
          monsters.forEach(m => m.takeDmg(9999));
          addScreenShake(2.0);
          addNotif("Ω FIN", "#000000");
          used = true;
          break;

      default:
          // Generic fallback
          spawnPart(pp, 0xffffff, 20, 5);
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(pp) < 8) {
                  m.takeDmg(30, true, 10, pp);
              }
          });
          addNotif("💥 " + spec.name, "#ffffff");
          used = true;
          break;
  }
  
  if (used) {
      GameState.pMP -= spec.cost;
      GameState.pSpecialCd = spec.cd;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fwd, spawnPos, getPlayerDmg, useMelee, fireCrossbow, fireBoomerang, fireScepter, fireGrimoire, useWhip, fireCards, firePistol, updatePassives, updateOrbVisuals, updateShieldVisuals, updateAuraVisuals, createVM, updateWeaponVisuals, handleFire, buildWeapon3D, fireJavelin, fireRunestone, fireBomb, fireRevolver, fireNeedles, fireLightningRod, fireIceBow, fireStarGlobe, fireCleaver, fireBalls, fireRock, fireBlowgun, fireGreatbow, fireSunStaff, fireHourglass, triggerSpecial };
}
