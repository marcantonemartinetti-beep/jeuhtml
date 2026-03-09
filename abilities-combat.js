// ═══════════════════════════════════════════════
// DUNGEON WORLD - Abilities & Combat
// ═══════════════════════════════════════════════

// ==================== CAMERA & PLAYER ====================
function fwd() {
  return new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(camPitch, camYaw, 0, 'YXZ')).normalize();
}

var combatFireContextWeaponKey = null;

function spawnPos(weaponKey) {
  const key = weaponKey || combatFireContextWeaponKey;
  if (key && typeof getWeaponHaloWorldPos === 'function') {
    const haloPos = getWeaponHaloWorldPos(key);
    if (haloPos) {
      // Slight upward nudge so shots visually leave the marker center.
      haloPos.y += 0.05;
      return haloPos;
    }
  }
  // Attaques depuis la hauteur de la caméra
  const cameraHeight = 1.5 * (playerTypeData ? playerTypeData.S || 1.0 : 1.0);
  return playerPivot.position.clone().add(new THREE.Vector3(0, cameraHeight, 0));
}

// ==================== DAMAGE CALCULATION ====================
function getPlayerDmg(wep, targetDist = 0) {
  let d = wep.dmg;
  if (wep.identity) {
    d *= (1 + (wep.identity.ferocity - 1) * 0.12);
    d *= (1 + (wep.pathPower || 0) * 0.09);
    d *= (1 + (wep.pathChaos || 0) * 0.03 * (0.5 + Math.random()));
  }
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
  if (wep.executeBonus && targetDist > 0 && targetDist < 3.2) d *= (1 + wep.executeBonus * 0.2);
  return d;
}

var meleeTelegraphs = [];

function getMeleeFacingYaw() {
  // In 3rd person, melee should follow the visible front of the character model.
  if (GameState && GameState.thirdPerson && typeof playerModel !== 'undefined' && playerModel) {
    return playerModel.rotation.y || 0;
  }
  // In 1st person, camera forward is the authoritative facing.
  return camYaw;
}

function getMeleeAimDir2D() {
  const yaw = getMeleeFacingYaw();
  return new THREE.Vector2(Math.sin(yaw), Math.cos(yaw)).normalize();
}

function spawnMeleeTelegraph(wep, origin) {
  const pp = origin || playerPivot.position;
  const areaMul = GameState.pArea || 1;
  const radius = Math.max(1.2, (wep.range || 3.0) * areaMul);
  const arc = Math.min(Math.PI * 2, Math.max(0.25, wep.arc || 1.2));
  const facingYaw = getMeleeFacingYaw();
  const geom = new THREE.CircleGeometry(radius, Math.max(12, Math.floor(22 * arc / Math.PI)), 0, arc);
  geom.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: 0xff8844, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.rotation.y = facingYaw - arc * 0.5;
  mesh.position.set(pp.x, terrainH(pp.x, pp.z) + 0.06, pp.z);
  scene.add(mesh);
  meleeTelegraphs.push({ mesh, ttl: 0.14, arc, followCamera: true });
}

function updateMeleeTelegraphs(dt) {
  if (!meleeTelegraphs.length) return;
  meleeTelegraphs = meleeTelegraphs.filter(t => {
    if (t.followCamera && t.mesh) {
      const pp = playerPivot ? playerPivot.position : null;
      if (pp) {
        t.mesh.position.set(pp.x, terrainH(pp.x, pp.z) + 0.06, pp.z);
      }
      t.mesh.rotation.y = getMeleeFacingYaw() - (t.arc || 1.2) * 0.5;
    }
    t.ttl -= dt;
    t.mesh.material.opacity = Math.max(0, t.ttl * 1.8);
    if (t.ttl <= 0) {
      scene.remove(t.mesh);
      t.mesh.geometry.dispose();
      t.mesh.material.dispose();
      return false;
    }
    return true;
  });
}

// ==================== MELEE WEAPONS ====================
function useMelee(wep) {
  if (wep.cd > 0) return;
  wep.cd = wep.maxCd;
  if (wep.pathControl) wep.cd *= (1 - Math.min(0.28, wep.pathControl * 0.06));
  vmRecoil = 0.5;
  const pp = spawnPos();
  spawnMeleeTelegraph(wep, pp);

  // Trigger weapon attack animation
  if (window.vmModel && window.vmModel.userData && window.vmModel.userData.parts) {
    animateWeaponAttack(window.vmModel, wep);
  }

  // Use the same facing source as the telegraph so visual and damage zones match exactly.
  const aimDir = getMeleeAimDir2D();
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
      
      // Hit only inside displayed arc (or full-circle melee).
      if (wep.arc >= Math.PI * 2 || dot > Math.cos(wep.arc / 2)) {
        let dmg = getPlayerDmg(wep, dist2d);
        const stagger = (GameState.pKnockback || 0) + (wep.stagger || 0) + (wep.pathPower || 0) * 0.35;
        m.takeDmg(dmg, false, stagger, pp);
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

// Weapon attack animation system
function animateWeaponAttack(weaponGroup, wep) {
  const parts = weaponGroup.userData.parts;
  const type = weaponGroup.userData.type;
  const animDuration = 0.25;
  const startTime = performance.now();
  
  // Store original transforms
  if (!weaponGroup.userData.originalTransforms) {
    weaponGroup.userData.originalTransforms = {};
    Object.keys(parts).forEach(key => {
      if (parts[key]) {
        weaponGroup.userData.originalTransforms[key] = {
          pos: parts[key].position.clone(),
          rot: parts[key].rotation.clone(),
          scale: parts[key].scale.clone()
        };
      }
    });
  }
  
  const animate = () => {
    const elapsed = (performance.now() - startTime) / 1000;
    const progress = Math.min(elapsed / animDuration, 1);
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    if (type === 'sword' || type === 'greatsword' || type === 'dark_blade' || type === 'katana' || type === 'rapier') {
      // Slash animation - rotate entire weapon
      weaponGroup.rotation.z = Math.sin(eased * Math.PI) * -0.8;
      if (parts.blade) parts.blade.position.x = Math.sin(eased * Math.PI) * 0.15;
    } else if (type === 'axe' || type === 'hammer' || type === 'mace' || type === 'wrench' || type === 'cleaver') {
      // Heavy swing - down and rotate
      weaponGroup.rotation.z = Math.sin(eased * Math.PI) * -1.2;
      weaponGroup.position.y = -Math.sin(eased * Math.PI) * 0.3;
      if (parts.head) parts.head.rotation.y = Math.sin(eased * Math.PI) * 0.5;
    } else if (type === 'spear' || type === 'trident' || type === 'javelin') {
      // Thrust animation
      weaponGroup.position.z = -Math.sin(eased * Math.PI) * 0.4;
      if (parts.tip) parts.tip.position.y = Math.sin(eased * Math.PI) * 0.1;
    } else if (type === 'scythe') {
      // Wide sweeping motion
      weaponGroup.rotation.z = Math.sin(eased * Math.PI * 2) * 1.0;
      if (parts.blade) parts.blade.rotation.y = Math.sin(eased * Math.PI) * 0.3;
    } else if (type === 'flail') {
      // Chain swinging
      if (parts.ball) {
        parts.ball.rotation.z = Math.sin(eased * Math.PI * 3) * 0.6;
        parts.ball.position.x = Math.sin(eased * Math.PI * 2) * 0.2;
      }
      if (parts.chain) parts.chain.rotation.z = Math.sin(eased * Math.PI * 2) * 0.4;
    } else if (type === 'gauntlets' || type === 'claws') {
      // Punch/swipe
      weaponGroup.position.z = -Math.sin(eased * Math.PI) * 0.25;
      weaponGroup.rotation.y = Math.sin(eased * Math.PI) * 0.4;
      if (parts.fingers) {
        for (let i = 0; i < 3; i++) {
          if (parts[`finger${i}`]) {
            parts[`finger${i}`].rotation.x = Math.sin(eased * Math.PI) * 0.5;
          }
        }
      }
    } else if (type === 'scepter' || type === 'grimoire' || type.includes('staff')) {
      // Magic pulse
      if (parts.orb || parts.gem) {
        const gemPart = parts.orb || parts.gem;
        gemPart.scale.setScalar(1 + Math.sin(eased * Math.PI) * 0.3);
        gemPart.rotation.y += 0.05;
      }
      weaponGroup.rotation.x = Math.sin(eased * Math.PI) * 0.3;
    }
    
    // Continue animation or reset
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Reset to original transforms
      weaponGroup.rotation.set(0, 0, 0);
      weaponGroup.position.set(0, 0, 0);
      const orig = weaponGroup.userData.originalTransforms;
      Object.keys(parts).forEach(key => {
        if (parts[key] && orig[key]) {
          parts[key].position.copy(orig[key].pos);
          parts[key].rotation.copy(orig[key].rot);
          parts[key].scale.copy(orig[key].scale);
        }
      });
    }
  };
  
  requestAnimationFrame(animate);
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

  const pp = spawnPos();
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
  const pp = spawnPos();
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

function fireArcaneOrb() {
  if (WEAPONS.ARCANE_ORB.cd > 0) return;
  WEAPONS.ARCANE_ORB.cd = GameState.frenzyTimer > 0 ? 0.08 : WEAPONS.ARCANE_ORB.maxCd;

  const pos = spawnPos();
  const baseDir = fwd();
  const count = Math.max(1, WEAPONS.ARCANE_ORB.count || 1);

  for (let i = 0; i < count; i++) {
    const d = baseDir.clone();
    const spread = WEAPONS.ARCANE_ORB.spread || 0;
    if (count > 1 || spread > 0) {
      d.x += (Math.random() - 0.5) * spread;
      d.y += (Math.random() - 0.5) * spread;
      d.z += (Math.random() - 0.5) * spread;
      d.normalize();
    }

    projectiles.push(new Proj(
      pos,
      d,
      getPlayerDmg(WEAPONS.ARCANE_ORB),
      0x66ccff,
      WEAPONS.ARCANE_ORB.speed,
      WEAPONS.ARCANE_ORB.life,
      {
        pierce: WEAPONS.ARCANE_ORB.pierce,
        homing: WEAPONS.ARCANE_ORB.homing,
        scale: 0.75,
        shape: 'circle'
      }
    ));
  }

  vmRecoil = 0.2;
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

function fireGenericWeaponByKey(weaponKey) {
  const w = WEAPONS[weaponKey];
  if (!w) return;

  const profileFor = (key, wep) => {
    const k = String(key || '').toUpperCase();
    const profile = {
      mode: 'fan',
      color: (wep.fire ? 0xff5533 : (wep.lightning ? 0xffff55 : (wep.ice ? 0xaaddff : 0x99bbff))),
      shape: 'diamond',
      spin: 0,
      salvo: 1,
      salvoIntervalMs: 0,
      burstSpreadMul: 1.0,
      speedMul: 1.0,
      lifeMul: 1.0,
      scale: 0.9,
      addPierce: 0,
      addBounce: 0,
      addBlast: 0,
      gravity: Number(wep.gravity) || 0,
      offsetY: 0
    };

    // Strong explicit overrides for signature weapons.
    const overrides = {
      RIFLE: { mode: 'single', shape: 'arrow', scale: 0.52, speedMul: 1.18, lifeMul: 1.2, addPierce: 2, burstSpreadMul: 0.2 },
      GREATBOW: { mode: 'single', shape: 'arrow', scale: 1.7, speedMul: 1.12, lifeMul: 1.15, addPierce: 2 },
      BOW: { mode: 'fan', shape: 'arrow', scale: 0.74, speedMul: 1.05, salvo: 1 },
      CROSSBOW: { mode: 'single', shape: 'arrow', scale: 0.9, speedMul: 1.08, addPierce: 1 },
      PISTOL: { mode: 'burst', shape: 'circle', scale: 0.5, salvo: 2, salvoIntervalMs: 48, burstSpreadMul: 1.5 },
      REVOLVER: { mode: 'single', shape: 'circle', scale: 0.62, speedMul: 1.08, addPierce: 1 },
      KNIFE_VOLLEY: { mode: 'burst', shape: 'arrow', scale: 0.58, salvo: 2, salvoIntervalMs: 38, burstSpreadMul: 1.1, addPierce: 1 },
      MILLION_EDGE: { mode: 'burst', shape: 'arrow', scale: 0.66, salvo: 3, salvoIntervalMs: 30, burstSpreadMul: 0.8, addPierce: 3 },
      HOLY_BIBLE: { mode: 'ring', shape: 'box', scale: 0.9, speedMul: 0.8, lifeMul: 1.35, addPierce: 4 },
      SANCTIFIED_SCRIPTURE: { mode: 'ring', shape: 'box', scale: 1.05, speedMul: 0.85, lifeMul: 1.6, addPierce: 99 },
      GARLIC_AURA: { mode: 'melee_aura' },
      SOUL_EATER: { mode: 'melee_aura' },
      PHIAL_RAIN: { mode: 'rain', shape: 'circle', scale: 0.88, gravity: 12, addBlast: 2, offsetY: 0.35 },
      TOXIC_MONSOON: { mode: 'rain', shape: 'circle', scale: 1.05, gravity: 12, addBlast: 4, offsetY: 0.45, salvo: 2, salvoIntervalMs: 120 },
      BONE_SWARM: { mode: 'spray', shape: 'box', scale: 0.78, addBounce: 2, burstSpreadMul: 1.8 },
      BONE_STORM: { mode: 'spray', shape: 'box', scale: 0.95, addBounce: 3, burstSpreadMul: 2.2, salvo: 2, salvoIntervalMs: 62 },
      CLOCK_LANCET: { mode: 'beam_fan', shape: 'arrow', scale: 0.72, speedMul: 1.25, addPierce: 3 },
      INFINITE_CORRIDOR: { mode: 'beam_fan', shape: 'arrow', scale: 0.9, speedMul: 1.35, addPierce: 6, salvo: 2, salvoIntervalMs: 82 },
      MANA_CHANT: { mode: 'ring', shape: 'star', scale: 0.92, speedMul: 0.82, lifeMul: 1.45 },
      MELODY_OF_ABYSS: { mode: 'ring', shape: 'star', scale: 1.02, speedMul: 0.85, lifeMul: 1.8, addPierce: 3 },
      THUNDER_DRUM: { mode: 'single', shape: 'diamond', scale: 1.15, addBlast: 2, speedMul: 1.08 },
      TEMPEST_FINALE: { mode: 'burst', shape: 'diamond', scale: 1.15, salvo: 2, salvoIntervalMs: 72, addBlast: 4, speedMul: 1.12 },
      RUNE_TRACER: { mode: 'spray', shape: 'diamond', scale: 0.72, addBounce: 3, burstSpreadMul: 2.0, salvo: 2, salvoIntervalMs: 36 },
      OMEGA_TRACER: { mode: 'spray', shape: 'diamond', scale: 0.9, addBounce: 6, addPierce: 3, burstSpreadMul: 2.2, salvo: 3, salvoIntervalMs: 30 },
      HEAVEN_BIRDS: { mode: 'orbit_fan', shape: 'tri', scale: 0.82, speedMul: 0.95, lifeMul: 1.35, addPierce: 1, salvo: 2, salvoIntervalMs: 84 },
      COSMOS_FALCON: { mode: 'orbit_fan', shape: 'tri', scale: 0.96, speedMul: 1.08, lifeMul: 1.6, addPierce: 4, salvo: 2, salvoIntervalMs: 64 },
      SILVER_WIND: { mode: 'returning', shape: 'tri', scale: 0.8, speedMul: 1.05, lifeMul: 1.2, addPierce: 1, salvo: 2, salvoIntervalMs: 46 },
      FESTIVAL_OF_WINDS: { mode: 'returning', shape: 'tri', scale: 0.98, speedMul: 1.12, lifeMul: 1.35, addPierce: 4, salvo: 3, salvoIntervalMs: 34 },
      CELESTIAL_BELLS: { mode: 'ring', shape: 'star', scale: 0.86, speedMul: 0.84, lifeMul: 1.5, addPierce: 2, salvo: 2, salvoIntervalMs: 92 },
      SERAPHIC_CARILLON: { mode: 'ring', shape: 'star', scale: 1.02, speedMul: 0.9, lifeMul: 1.85, addPierce: 6, salvo: 2, salvoIntervalMs: 76 },
      PHOENIX_ASH: { mode: 'burst', shape: 'diamond', scale: 1.02, speedMul: 1.06, addBlast: 1, salvo: 2, salvoIntervalMs: 68 },
      APOCALYPSE_PLUME: { mode: 'burst', shape: 'diamond', scale: 1.18, speedMul: 1.1, addBlast: 3, addPierce: 2, salvo: 3, salvoIntervalMs: 58 },
      RAZOR_GALE: { mode: 'returning', shape: 'tri', scale: 0.86, speedMul: 1.08, lifeMul: 1.15, addPierce: 2, salvo: 2, salvoIntervalMs: 42 },
      HURRICANE_RAZORS: { mode: 'returning', shape: 'tri', scale: 1.0, speedMul: 1.14, lifeMul: 1.35, addPierce: 4, salvo: 3, salvoIntervalMs: 34 },
      ARCANE_ORB: { mode: 'orbit_fan', shape: 'circle', scale: 0.82, speedMul: 0.92, lifeMul: 1.2 },
      ASTRAL_ORBIT: { mode: 'orbit_fan', shape: 'circle', scale: 0.96, speedMul: 0.95, lifeMul: 1.4, salvo: 2, salvoIntervalMs: 96 },
      SAW_BLADE: { mode: 'returning', shape: 'circle', scale: 0.9, spin: 14, addPierce: 1 },
      COSMIC_RIPSAW: { mode: 'returning', shape: 'circle', scale: 1.05, spin: 18, addPierce: 3, salvo: 2 },
      LIGHTNING_ROD: { mode: 'single', shape: 'diamond', scale: 0.9, addBlast: 1, speedMul: 1.15 },
      THUNDER_LOOP: { mode: 'burst', shape: 'diamond', scale: 1.0, salvo: 2, salvoIntervalMs: 44, addBlast: 2, speedMul: 1.2 },
      CHAIN_LIGHTNING: { mode: 'beam_fan', shape: 'diamond', scale: 0.88, speedMul: 1.18, addPierce: 2 },
      JUDGMENT_CHAIN: { mode: 'beam_fan', shape: 'diamond', scale: 1.02, speedMul: 1.3, addPierce: 5 },
      FIRE_STAFF: { mode: 'fan', shape: 'diamond', scale: 0.9, addBlast: 1, speedMul: 1.05 },
      HELLFIRE_STAFF: { mode: 'burst', shape: 'diamond', scale: 1.1, salvo: 2, salvoIntervalMs: 58, addBlast: 3, speedMul: 1.1 },
      POTION: { mode: 'rain', shape: 'circle', scale: 0.82, gravity: 11, addBlast: 1, offsetY: 0.28 },
      LA_BORRA: { mode: 'rain', shape: 'circle', scale: 0.95, gravity: 11, addBlast: 3, offsetY: 0.4, salvo: 2, salvoIntervalMs: 108 },
      SIEGE_MORTAR: { mode: 'lob', shape: 'circle', scale: 1.3, gravity: 14, addBlast: 3, speedMul: 0.9 },
      OBLIVION_MORTAR: { mode: 'lob', shape: 'circle', scale: 1.5, gravity: 14, addBlast: 6, speedMul: 0.92, salvo: 2, salvoIntervalMs: 132 },
      GRIMOIRE: { mode: 'ring', shape: 'box', scale: 0.84, speedMul: 0.86, lifeMul: 1.35 },
      UNHOLY_VESPERS: { mode: 'ring', shape: 'box', scale: 0.96, speedMul: 0.82, lifeMul: 1.75, addPierce: 90 },
      STAR_GLOBE: { mode: 'spray', shape: 'star', scale: 0.9, speedMul: 0.9, lifeMul: 1.3 },
      NOVA_TOME: { mode: 'ring', shape: 'star', scale: 0.86, speedMul: 0.86, lifeMul: 1.25 },
      APOCALYPSE_TOME: { mode: 'ring', shape: 'star', scale: 1.02, speedMul: 0.8, lifeMul: 1.6, salvo: 2, salvoIntervalMs: 88 },
      PHANTOM_TAROT: { mode: 'spray', shape: 'diamond', scale: 0.8, addBounce: 1 },
      ARCANA_STORM: { mode: 'spray', shape: 'diamond', scale: 0.95, addBounce: 3, salvo: 2, salvoIntervalMs: 52 },
      ROCK: { mode: 'lob', shape: 'circle', scale: 1.25, gravity: 10, addBlast: 1 },
      RUNE_CANNON: { mode: 'lob', shape: 'circle', scale: 1.45, gravity: 10, addBlast: 4 },
      FATE_NEEDLE: { mode: 'burst', shape: 'arrow', scale: 0.55, salvo: 2, salvoIntervalMs: 34, speedMul: 1.15 },
      FATE_WEAVER: { mode: 'burst', shape: 'arrow', scale: 0.68, salvo: 3, salvoIntervalMs: 28, speedMul: 1.25, addPierce: 2 }
    };

    if (overrides[k]) return Object.assign(profile, overrides[k]);

    if (k.includes('MORTAR') || k.includes('BOMB')) profile.mode = 'lob';
    else if (k.includes('POTION') || k.includes('FLASK') || k.includes('RAIN')) profile.mode = 'rain';
    else if (k.includes('RIFLE') || k.includes('LANCET') || k.includes('RAIL')) profile.mode = 'beam_fan';
    else if (k.includes('ORB') || k.includes('BIBLE') || k.includes('GRIMOIRE') || k.includes('TOME')) profile.mode = 'ring';
    else if (k.includes('SHURIKEN') || k.includes('TAROT') || k.includes('CARD') || k.includes('BONE')) profile.mode = 'spray';
    else if (k.includes('SAW') || k.includes('DISC') || k.includes('BOOMERANG') || k.includes('GLAIVE')) profile.mode = 'returning';
    else if (k.includes('DRUM') || k.includes('SPARK') || k.includes('LIGHTNING') || k.includes('CHAIN')) profile.mode = 'burst';
    else profile.mode = 'fan';

    return profile;
  };

  const profile = profileFor(weaponKey, w);

  // Generic melee fallback for unmapped close-range kits.
  if (profile.mode === 'melee_aura' || w.kind === 'melee' || (w.range !== undefined && !w.speed)) {
    const auraWep = Object.assign({}, w);
    if (profile.mode === 'melee_aura') {
      auraWep.range = Math.max(auraWep.range || 2.8, auraWep.range || 2.8);
      auraWep.arc = Math.PI * 2;
      auraWep.maxCd = Math.min(Number(auraWep.maxCd) || 0.3, 0.24);
    }
    useMelee(auraWep);
    return;
  }

  if (w.cd > 0) return;
  w.cd = GameState.frenzyTimer > 0 ? Math.max(0.05, (w.maxCd || 0.6) * 0.45) : (w.maxCd || 0.6);

  const pos = spawnPos();
  const baseDir = fwd();
  const count = Math.max(1, Number(w.count) || 1);
  const spread = Number(w.spread) || 0;
  const speed = (Number(w.speed) || 30) * (profile.speedMul || 1);
  const life = (Number(w.life) || 1.8) * (profile.lifeMul || 1);
  const salvo = Math.max(1, Number(profile.salvo) || 1);
  const defaultSalvoDelay = (profile.mode === 'burst') ? 55
    : ((profile.mode === 'rain' || profile.mode === 'lob') ? 90
      : ((profile.mode === 'ring' || profile.mode === 'orbit_fan') ? 75 : 45));
  const salvoDelayMs = Math.max(0, Number(profile.salvoIntervalMs) || (salvo > 1 ? defaultSalvoDelay : 0));

  const emitPatternVfx = (mode, origin, color, strength) => {
    const c = Number(color) || 0xffffff;
    const s = Math.max(1, Math.floor(strength || 4));
    const lowFx = !!(GameState && GameState.saveData && GameState.saveData.settings && GameState.saveData.settings.particles === 0);
    const userFx = Math.max(20, Math.min(100, Number(GameState && GameState.saveData && GameState.saveData.settings && GameState.saveData.settings.vfxIntensity) || 70)) / 100;
    const particleLoad = (typeof particles !== 'undefined' && particles) ? particles.length : 0;
    const perfMul = particleLoad > 260 ? 0.5 : (particleLoad > 140 ? 0.72 : 1);
    const densityMul = (lowFx ? 0.42 : 0.72) * perfMul * userFx;
    const cfg = {
      single: { count: 3, spread: 2 },
      beam_fan: { count: 4, spread: 3 },
      burst: { count: 6, spread: 4 },
      spray: { count: 6, spread: 4 },
      ring: { count: 5, spread: 3 },
      rain: { count: 7, spread: 5 },
      lob: { count: 7, spread: 5 },
      returning: { count: 4, spread: 3 },
      orbit_fan: { count: 5, spread: 3 },
      fan: { count: 4, spread: 3 }
    }[mode] || { count: 5, spread: 3 };

    const n = Math.max(1, Math.floor((cfg.count + s) * densityMul));
    spawnPart(origin, c, n, cfg.spread + Math.floor(s * 0.35));
    if (mode === 'lob' || mode === 'rain') {
      addScreenShake(Math.min(0.14, 0.03 + (Number(profile.addBlast) || 0) * 0.01));
    }
  };

  const pushPatternProjectile = (origin, dir, spreadMul) => {
    const d = dir.clone();
    const s = spread * (spreadMul || 1);
    if (s > 0) {
      d.x += (Math.random() - 0.5) * s;
      d.y += (Math.random() - 0.5) * s;
      d.z += (Math.random() - 0.5) * s;
      d.normalize();
    }
    projectiles.push(new Proj(
      origin,
      d,
      getPlayerDmg(w),
      profile.color,
      speed,
      life,
      {
        pierce: Math.max(0, (Number(w.pierce) || 0) + (Number(profile.addPierce) || 0)),
        bounce: Math.max(0, (Number(w.bounce) || 0) + (Number(profile.addBounce) || 0)),
        homing: Number(w.homing) || 0,
        blast: Math.max(0, (Number(w.blast) || 0) + (Number(profile.addBlast) || 0)),
        boomerang: !!w.boomerang || profile.mode === 'returning' || profile.mode === 'orbit_fan' || profile.mode === 'ring',
        gravity: Number(profile.gravity),
        fire: !!w.fire,
        ice: !!w.ice,
        lightning: !!w.lightning,
        scale: Number(profile.scale) || 0.85,
        shape: profile.shape || 'diamond',
        spin: Number(profile.spin) || 0,
        zigzagAmp: profile.mode === 'spray' ? 0.04 : 0,
        zigzagFreq: profile.mode === 'spray' ? 7 : 5
      }
    ));
  };

  const fireSalvoStep = (salvoIdx) => {
    if (!GameState || !GameState.gameRunning || GameState.levelingUp) return;
    const originNow = spawnPos(weaponKey);
    const baseNow = fwd();

    if (profile.mode === 'single') {
      pushPatternProjectile(originNow.clone().add(new THREE.Vector3(0, profile.offsetY || 0, 0)), baseNow, 0.25);
      emitPatternVfx(profile.mode, originNow, profile.color, 3);
      return;
    }
    if (profile.mode === 'beam_fan') {
      for (let i = 0; i < count; i++) {
        const t = count <= 1 ? 0 : (i / (count - 1) - 0.5);
        const d = baseNow.clone();
        d.x += t * Math.max(0.03, spread);
        d.normalize();
        pushPatternProjectile(originNow.clone().add(new THREE.Vector3(0, profile.offsetY || 0, 0)), d, 0.2);
      }
      emitPatternVfx(profile.mode, originNow, profile.color, 4);
      return;
    }
    if (profile.mode === 'burst') {
      for (let i = 0; i < count; i++) {
        pushPatternProjectile(originNow.clone().add(new THREE.Vector3(0, profile.offsetY || 0, 0)), baseNow, profile.burstSpreadMul || 1.3);
      }
      emitPatternVfx(profile.mode, originNow, profile.color, 5);
      return;
    }
    if (profile.mode === 'spray') {
      for (let i = 0; i < count; i++) {
        const d = new THREE.Vector3(baseNow.x + (Math.random() - 0.5), baseNow.y + (Math.random() - 0.5), baseNow.z + (Math.random() - 0.5)).normalize();
        pushPatternProjectile(originNow.clone().add(new THREE.Vector3(0, profile.offsetY || 0, 0)), d, (profile.burstSpreadMul || 1.8));
      }
      emitPatternVfx(profile.mode, originNow, profile.color, 5);
      return;
    }
    if (profile.mode === 'ring') {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + GameState.pT * 0.8 + salvoIdx * 0.25;
        const d = new THREE.Vector3(Math.cos(a), 0.08 + Math.sin(a * 0.5) * 0.08, Math.sin(a)).normalize();
        pushPatternProjectile(originNow.clone().add(new THREE.Vector3(0, 0.08 + (profile.offsetY || 0), 0)), d, 0.12);
      }
      emitPatternVfx(profile.mode, originNow, profile.color, 4);
      return;
    }
    if (profile.mode === 'rain' || profile.mode === 'lob') {
      for (let i = 0; i < count; i++) {
        const d = baseNow.clone();
        d.y += 0.35 + Math.random() * 0.25;
        d.normalize();
        pushPatternProjectile(originNow.clone().add(new THREE.Vector3(0, profile.offsetY || 0.2, 0)), d, 1.5);
      }
      emitPatternVfx(profile.mode, originNow, profile.color, 6);
      return;
    }
    if (profile.mode === 'returning' || profile.mode === 'orbit_fan') {
      for (let i = 0; i < count; i++) {
        const t = count <= 1 ? 0 : (i / (count - 1) - 0.5);
        const d = baseNow.clone();
        d.x += t * Math.max(0.05, spread * 1.4);
        d.y += (profile.mode === 'orbit_fan' ? 0.06 : 0);
        d.normalize();
        pushPatternProjectile(originNow.clone().add(new THREE.Vector3(0, profile.offsetY || 0, 0)), d, 0.5);
      }
      emitPatternVfx(profile.mode, originNow, profile.color, 4);
      return;
    }
    // fan default
    for (let i = 0; i < count; i++) {
      const t = count <= 1 ? 0 : (i / (count - 1) - 0.5);
      const d = baseNow.clone();
      d.x += t * spread;
      d.y += t * spread * 0.35;
      d.normalize();
      pushPatternProjectile(originNow.clone().add(new THREE.Vector3(0, profile.offsetY || 0, 0)), d, 0.35);
    }
    emitPatternVfx(profile.mode, originNow, profile.color, 3);
  };

  if (salvo <= 1 || salvoDelayMs <= 0) {
    fireSalvoStep(0);
  } else {
    for (let s = 0; s < salvo; s++) {
      setTimeout(() => fireSalvoStep(s), s * salvoDelayMs);
    }
  }

  vmRecoil = Math.max(0.12, Math.min(0.45, 0.14 + count * 0.02));
}

// ==================== PASSIVE ABILITIES ====================

function fireWeaponByCombatKey(key) {
  combatFireContextWeaponKey = key;
  try {
    switch (key) {
      // Keep a few handcrafted support/control kits.
      case 'WHIP': return useWhip();
      case 'LUTE': return useLute();
      default: return fireGenericWeaponByKey(key);
    }
  } finally {
    combatFireContextWeaponKey = null;
  }
}

function handleFire() {
  if (document.pointerLockElement !== renderer.domElement || GameState.levelingUp) return;

  var fired = false;
  var order = [];
  var seen = {};

  if (GameState && GameState.inventory && Array.isArray(GameState.inventory.mainWeapons)) {
    for (var i = 0; i < GameState.inventory.mainWeapons.length; i++) {
      var slot = GameState.inventory.mainWeapons[i];
      if (slot && slot.id && WEAPONS[slot.id]) {
        // Runtime source of truth is the loadout; keep legacy active flags in sync.
        WEAPONS[slot.id].active = true;
        if (!seen[slot.id]) {
          seen[slot.id] = true;
          order.push(slot.id);
        }
      }
    }
  }

  if (!order.length) {
    for (var key in WEAPONS) {
      if (WEAPONS[key] && WEAPONS[key].active) order.push(key);
    }
  }

  for (var j = 0; j < order.length; j++) {
    var weaponKey = order[j];
    if (!WEAPONS[weaponKey] || !WEAPONS[weaponKey].active) continue;
    fireWeaponByCombatKey(weaponKey);
    fired = true;
  }

  if (!fired) {
    var activeKey = Object.keys(WEAPONS).find(function (k) { return WEAPONS[k] && WEAPONS[k].active; });
    if (activeKey) fireWeaponByCombatKey(activeKey);
  }
}

