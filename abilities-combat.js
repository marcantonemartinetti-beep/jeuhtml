// ═══════════════════════════════════════════════
// DUNGEON WORLD - Abilities & Combat
// ═══════════════════════════════════════════════

// ==================== CAMERA & PLAYER ====================
function fwd() {
  return new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(camPitch, camYaw, 0, 'YXZ')).normalize();
}

function spawnPos() {
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

function spawnMeleeTelegraph(wep) {
  const pp = playerPivot.position;
  const areaMul = GameState.pArea || 1;
  const radius = Math.max(1.2, (wep.range || 3.0) * areaMul);
  const arc = Math.min(Math.PI * 2, Math.max(0.25, wep.arc || 1.2));
  const start = camYaw - arc * 0.5;
  const geom = new THREE.CircleGeometry(radius, Math.max(12, Math.floor(22 * arc / Math.PI)), start, arc);
  geom.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: 0xff8844, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(pp.x, terrainH(pp.x, pp.z) + 0.06, pp.z);
  scene.add(mesh);
  meleeTelegraphs.push({ mesh, ttl: 0.14 });
}

function updateMeleeTelegraphs(dt) {
  if (!meleeTelegraphs.length) return;
  meleeTelegraphs = meleeTelegraphs.filter(t => {
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
  spawnMeleeTelegraph(wep);

  // Trigger weapon attack animation
  if (window.vmModel && window.vmModel.userData && window.vmModel.userData.parts) {
    animateWeaponAttack(window.vmModel, wep);
  }

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

  const hashWeapon = (key) => {
    let h = 2166136261 >>> 0;
    const s = String(key || 'GENERIC');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  const h = hashWeapon(weaponKey);
  const shapes = ['diamond', 'circle', 'tri', 'arrow', 'box', 'star'];
  const genericShape = shapes[h % shapes.length];
  const genericSpin = ((h >> 8) % 3 === 0) ? (6 + ((h >> 4) % 12)) : 0;
  const genericZigAmp = ((h >> 13) % 5 === 0) ? 0.05 : 0;
  const genericZigFreq = 5 + (h % 7);

  // Generic melee fallback for unmapped close-range kits.
  if (w.kind === 'melee' || (w.range !== undefined && !w.speed)) {
    useMelee(w);
    return;
  }

  if (w.cd > 0) return;
  w.cd = GameState.frenzyTimer > 0 ? Math.max(0.05, (w.maxCd || 0.6) * 0.45) : (w.maxCd || 0.6);

  const pos = spawnPos();
  const baseDir = fwd();
  const count = Math.max(1, Number(w.count) || 1);
  const spread = Number(w.spread) || 0;
  const speed = Number(w.speed) || 30;
  const life = Number(w.life) || 1.8;

  for (let i = 0; i < count; i++) {
    const d = baseDir.clone();
    if (count > 1 || spread > 0) {
      d.x += (Math.random() - 0.5) * spread;
      d.y += (Math.random() - 0.5) * spread;
      d.z += (Math.random() - 0.5) * spread;
      d.normalize();
    }

    projectiles.push(new Proj(
      pos,
      d,
      getPlayerDmg(w),
      w.fire ? 0xff5500 : (w.lightning ? 0xffff55 : (w.ice ? 0xaaddff : 0x99bbff)),
      speed,
      life,
      {
        pierce: Number(w.pierce) || 0,
        bounce: Number(w.bounce) || 0,
        homing: Number(w.homing) || 0,
        blast: Number(w.blast) || 0,
        boomerang: !!w.boomerang,
        gravity: Number(w.gravity) || 0,
        fire: !!w.fire,
        ice: !!w.ice,
        lightning: !!w.lightning,
        scale: 0.85,
        shape: genericShape,
        spin: genericSpin,
        zigzagAmp: genericZigAmp,
        zigzagFreq: genericZigFreq
      }
    ));
  }

  vmRecoil = Math.max(0.12, Math.min(0.45, 0.14 + count * 0.02));
}

// ==================== PASSIVE ABILITIES ====================

function fireWeaponByCombatKey(key) {
  switch (key) {
    case 'SCEPTER': return fireScepter();
    case 'BOW': return fireBow();
    case 'BOOMERANG': return fireBoomerang();
    case 'SWORD': return useMelee(WEAPONS.SWORD);
    case 'AXE': return useMelee(WEAPONS.AXE);
    case 'SPEAR': return useMelee(WEAPONS.SPEAR);
    case 'HAMMER': return useMelee(WEAPONS.HAMMER);
    case 'DAGGERS': return useMelee(WEAPONS.DAGGERS);
    case 'SCYTHE': return useMelee(WEAPONS.SCYTHE);
    case 'KATANA': return useMelee(WEAPONS.KATANA);
    case 'FLAIL': return useMelee(WEAPONS.FLAIL);
    case 'GAUNTLETS': return useMelee(WEAPONS.GAUNTLETS);
    case 'GRIMOIRE': return fireGrimoire();
    case 'WHIP': return useWhip();
    case 'CARDS': return fireCards();
    case 'PISTOL': return firePistol();
    case 'TRIDENT': return fireTrident();
    case 'RIFLE': return fireRifle();
    case 'SHURIKEN': return fireShuriken();
    case 'VOID_STAFF': return fireVoidStaff();
    case 'FIRE_STAFF': return fireFireStaff();
    case 'LEAF_BLADE': return fireLeafBlade();
    case 'POTION': return firePotion();
    case 'LUTE': return useLute();
    case 'WRENCH': return useMelee(WEAPONS.WRENCH);
    case 'JAVELIN': return fireJavelin();
    case 'CROSSBOW': return fireCrossbow();
    case 'RUNESTONE': return fireRunestone();
    case 'RAPIER': return useMelee(WEAPONS.RAPIER);
    case 'BOMB': return fireBomb();
    case 'TOTEM': return useMelee(WEAPONS.TOTEM);
    case 'CLAWS': return useMelee(WEAPONS.CLAWS);
    case 'MACE': return useMelee(WEAPONS.MACE);
    case 'MIRROR': return fireMirror();
    case 'REVOLVER': return fireRevolver();
    case 'NEEDLES': return fireNeedles();
    case 'LIGHTNING_ROD': return fireLightningRod();
    case 'ARCANE_ORB': return fireArcaneOrb();
    case 'ICE_BOW': return fireIceBow();
    case 'DAGGER_SAC': return useMelee(WEAPONS.DAGGER_SAC);
    case 'DRILL': return useMelee(WEAPONS.DRILL);
    case 'STAR_GLOBE': return fireStarGlobe();
    case 'CLEAVER': return fireCleaver();
    case 'BALLS': return fireBalls();
    case 'GREATSWORD': return useMelee(WEAPONS.GREATSWORD);
    case 'ROCK': return fireRock();
    case 'BLOWGUN': return fireBlowgun();
    case 'GREATBOW': return fireGreatbow();
    case 'DARK_BLADE': return useMelee(WEAPONS.DARK_BLADE);
    case 'SUN_STAFF': return fireSunStaff();
    case 'HOURGLASS': return fireHourglass();
    default: return fireGenericWeaponByKey(key);
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
    if (activeKey) fireGenericWeaponByKey(activeKey);
  }
}

