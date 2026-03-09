// ═══════════════════════════════════════════════
// DUNGEON WORLD - Projectiles & Objects
// ═══════════════════════════════════════════════

// ==================== POOLS ====================
var partPool = [];
var dmgNumPool = [];
var projPool = []; // Projectile mesh pool for reuse
const PROJ_POOL_SIZE = 50; // Keep 50 reusable projectiles

// Initialize projectile pool
function initProjPool() {
  for (let i = 0; i < PROJ_POOL_SIZE; i++) {
    const m = new THREE.Mesh(spriteGeo, new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    projPool.push({ mesh: m, inUse: false });
  }
}

function getProjMesh(col, w, h, shp = 'box') {
  // Try to reuse from pool first
  for (let p of projPool) {
    if (!p.inUse) {
      p.inUse = true;
      const k = col + '_' + shp;
      if (!spMatCache[k]) spMatCache[k] = new THREE.MeshBasicMaterial({ map: getSpTex(col, shp), transparent: true, side: THREE.DoubleSide, depthWrite: false });
      p.mesh.material = spMatCache[k];
      p.mesh.scale.set(w, h, 1);
      return p.mesh;
    }
  }
  // Fallback: create new if pool exhausted
  return mkSprite(col, w, h, shp);
}

function releaseProjMesh(m) {
  for (let p of projPool) {
    if (p.mesh === m) {
      p.inUse = false;
      return;
    }
  }
}

var dmgNumCanvas = document.createElement('canvas');
dmgNumCanvas.width = 80;
dmgNumCanvas.height = 40;
var dmgNumCtx = dmgNumCanvas.getContext('2d');

// ==================== TEMP VECTORS (GC OPTIMIZATION) ====================
const _projTargetPos = new THREE.Vector3();
const _projDir = new THREE.Vector3();
const _projCurDir = new THREE.Vector3();
const _projRight = new THREE.Vector3();
var familyGroundZones = [];

function weaponKeyHash(key) {
  const src = String(key || 'UNKNOWN');
  let h = 2166136261 >>> 0;
  for (let i = 0; i < src.length; i++) {
    h ^= src.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function inferWeaponFamily(weaponKey) {
  const k = String(weaponKey || '').toUpperCase();
  if (!k) return 'martial';
  if (k.includes('LIGHTNING') || k.includes('THUNDER') || k.includes('SPARK') || k.includes('CHAIN') || k.includes('JUDGMENT')) return 'storm';
  if (k.includes('POTION') || k.includes('FLASK') || k.includes('ALCHEM') || k.includes('BOMB') || k.includes('MORTAR')) return 'alchemy';
  if (k.includes('VOID') || k.includes('SHADOW') || k.includes('DARK') || k.includes('PHANTOM') || k.includes('FATE') || k.includes('ECLIPSE')) return 'shadow';
  if (k.includes('ARCANE') || k.includes('MAGIC') || k.includes('SCEPTER') || k.includes('GRIMOIRE') || k.includes('RUNE') || k.includes('SUN') || k.includes('STAR') || k.includes('TOME')) return 'arcane';
  if (k.includes('SPEAR') || k.includes('LANCE') || k.includes('JAVELIN') || k.includes('RAIL') || k.includes('BOW') || k.includes('RIFLE') || k.includes('PISTOL') || k.includes('REVOLVER')) return 'precision';
  return 'martial';
}

function getFamilyStyle(family) {
  switch (family) {
    case 'storm': return { color: 0xd8f03a, impactColor: 0xffff66, shape: 'diamond', trailPulse: 0.55 };
    case 'alchemy': return { color: 0x57e26a, impactColor: 0x8bff7e, shape: 'circle', trailPulse: 0.45 };
    case 'shadow': return { color: 0xa857ff, impactColor: 0xdca8ff, shape: 'tri', trailPulse: 0.38 };
    case 'arcane': return { color: 0x56b7ff, impactColor: 0x9be2ff, shape: 'star', trailPulse: 0.48 };
    case 'precision': return { color: 0xffd07b, impactColor: 0xffefb5, shape: 'arrow', trailPulse: 0.35 };
    default: return { color: 0xd8d8d8, impactColor: 0xffffff, shape: 'box', trailPulse: 0.25 };
  }
}

function spawnFamilyGroundZone(pos, family, dmg, radius, duration) {
  if (!pos) return;
  var style = getFamilyStyle(family);
  var r = Math.max(0.8, radius || 1.8);
  var ttl = Math.max(0.6, duration || 2.4);
  var tickCd = family === 'alchemy' ? 0.24 : 0.35;
  var geom = new THREE.CircleGeometry(r, 20);
  var mat = new THREE.MeshBasicMaterial({
    color: style.color,
    transparent: true,
    opacity: family === 'alchemy' ? 0.42 : 0.28,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  var m = new THREE.Mesh(geom, mat);
  m.rotation.x = -Math.PI / 2;
  m.position.set(pos.x, terrainH(pos.x, pos.z) + 0.08, pos.z);
  scene.add(m);
  familyGroundZones.push({
    m: m,
    family: family,
    dmg: Math.max(1, dmg || 1),
    r: r,
    t: ttl,
    tick: 0,
    tickCd: tickCd,
    pulse: 0
  });
}

function updateFamilyGroundZones(dt) {
  if (!familyGroundZones.length) return;
  for (var i = familyGroundZones.length - 1; i >= 0; i--) {
    var z = familyGroundZones[i];
    if (!z || !z.m) {
      familyGroundZones.splice(i, 1);
      continue;
    }

    z.t -= dt;
    z.tick -= dt;
    z.pulse += dt * (z.family === 'alchemy' ? 6 : 4);
    z.m.material.opacity = Math.max(0, (z.family === 'alchemy' ? 0.45 : 0.3) * (z.t / Math.max(0.001, z.t + dt)) * (0.75 + Math.sin(z.pulse) * 0.25));

    if (z.tick <= 0) {
      z.tick = z.tickCd;
      for (var mi = 0; mi < monsters.length; mi++) {
        var mon = monsters[mi];
        if (!mon || mon.dead || !mon.root) continue;
        if (mon.root.position.distanceTo(z.m.position) <= z.r) {
          mon.takeDmg(z.dmg * (z.family === 'alchemy' ? 0.38 : 0.28), false, 0.1, z.m.position);
          if (z.family === 'shadow') {
            mon.root.position.add(new THREE.Vector3((Math.random() - 0.5) * 0.05, 0, (Math.random() - 0.5) * 0.05));
          }
          spawnPart(mon.root.position, getFamilyStyle(z.family).impactColor, 2, 2);
        }
      }
    }

    if (z.t <= 0) {
      scene.remove(z.m);
      z.m.geometry.dispose();
      z.m.material.dispose();
      familyGroundZones.splice(i, 1);
    }
  }
}

function buildWeaponSignature(weaponKey, family) {
  const h = weaponKeyHash(weaponKey);
  const variants = ['straight', 'wave', 'helix', 'drift'];
  const pattern = variants[h % variants.length];
  return {
    pattern: pattern,
    wobbleAmp: 0.03 + ((h >>> 8) % 12) / 200,
    wobbleFreq: 3 + ((h >>> 16) % 9),
    trailTick: 0.05 + ((h >>> 3) % 6) * 0.01,
    family: family
  };
}

// ==================== PROJECTILE CLASS ====================
class Proj {
  constructor(pos, dir, dmg, col, speed, life, props = {}) {
    const activeWeaponKey = (GameState && GameState._currentFireWeaponId)
      ? GameState._currentFireWeaponId
      : ((typeof WEAPONS !== 'undefined') ? Object.keys(WEAPONS).find(k => WEAPONS[k] && WEAPONS[k].active) : null);
    const activeWeapon = activeWeaponKey ? WEAPONS[activeWeaponKey] : null;
    const family = inferWeaponFamily(activeWeaponKey);
    const familyStyle = getFamilyStyle(family);
    const signature = buildWeaponSignature(activeWeaponKey, family);

    this.dmg = dmg;
    this.vel = dir.clone().normalize().multiplyScalar(speed);
    this.props = props;
    this.weaponKey = activeWeaponKey || 'UNKNOWN';
    this.family = family;
    this.familyStyle = familyStyle;
    this.signature = signature;
    this.trailT = 0;
    this.pierce = props.pierce || 0;
    this.bounce = props.bounce || 0;
    this.boomerang = props.boomerang || false;
    this.homing = props.homing || 0;
    this.blast = props.blast || 0;
    this.gravity = props.gravity || 0;
    this.orbit = props.orbit || false;
    this.spin = props.spin || 0;
    this.orbitRadius = props.orbitRadius || 3;
    this.orbitSpeed = props.orbitSpeed || 2;
    this.orbitAngle = Math.random() * Math.PI * 2;

    this.accel = props.accel || (activeWeapon && activeWeapon.kind === 'ranged' ? (activeWeapon.accel || 0) : 0);
    this.drag = props.drag || (activeWeapon && activeWeapon.kind === 'ranged' ? (activeWeapon.drag || 0) : 0);
    this.zigzagAmp = props.zigzagAmp || (activeWeapon && activeWeapon.kind === 'ranged' ? (activeWeapon.zigzagAmp || 0) : 0) || signature.wobbleAmp;
    this.zigzagFreq = props.zigzagFreq || (activeWeapon && activeWeapon.kind === 'ranged' ? (activeWeapon.zigzagFreq || 0) : 0);
    this.split = props.split || (activeWeapon ? Math.floor((activeWeapon.pathChaos || 0) / 2) : 0);
    this.weaponPathPower = activeWeapon ? (activeWeapon.pathPower || 0) : 0;
    this.weaponPathControl = activeWeapon ? (activeWeapon.pathControl || 0) : 0;

    _projRight.set(-this.vel.z, 0, this.vel.x);
    if (_projRight.lengthSq() < 0.0001) _projRight.set(1, 0, 0);
    this.zigzagAxis = _projRight.normalize().clone();

    this.target = null;
    this.t = 0;
    this.maxT = life;
    this.hitList = [];

    const r = Math.min(1.2, 0.3 * (props.scale || 1) * GameState.pArea);
    const shape = props.shape || familyStyle.shape || 'circle';
    const meshColor = (col === undefined || col === null) ? familyStyle.color : col;
    this.m = getProjMesh(meshColor, r, r, shape); // Use pooled mesh instead of mkSprite
    this.m.position.copy(pos);
    scene.add(this.m);
  }

  update(dt, pp) {
    if (pp && ((Math.floor(this.t * 60) & 1) === 0)) this.m.lookAt(pp);
    if (this.spin !== 0) {
        this.m.rotation.z += this.spin * this.t;
    }

    if (this.orbit) {
        this.t += dt;
        if (this.t > this.maxT) { scene.remove(this.m); releaseProjMesh(this.m); return true; }
        
        this.orbitAngle += this.orbitSpeed * dt;
        this.m.position.x = pp.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        this.m.position.z = pp.z + Math.sin(this.orbitAngle) * this.orbitRadius;
        this.m.position.y = pp.y + 1.0 + Math.sin(this.t * 3) * 0.5;
    } else {
      if (this.accel !== 0) {
        const spd = this.vel.length();
        const nextSpd = Math.max(2, spd * (1 + this.accel * dt));
        this.vel.setLength(nextSpd);
      }
      if (this.drag > 0) {
        this.vel.multiplyScalar(Math.max(0.2, 1 - this.drag * dt));
      }

        if (this.boomerang) {
            const spd = this.vel.length();
            const newSpd = spd - dt * 40;
            this.vel.normalize().multiplyScalar(newSpd);
        }

        if (this.homing > 0) {
            if (!this.target || this.target.dead) {
                let minD = 30;
                for (const m of monsters) {
                    if (!m.dead) {
                        const d = this.m.position.distanceTo(m.root.position);
                        if (d < minD) { minD = d; this.target = m; }
                    }
                }
            }
            if (this.target && !this.target.dead) {
                _projTargetPos.copy(this.target.root.position).y += 1.5;
                _projDir.copy(_projTargetPos).sub(this.m.position).normalize();
                const spd = this.vel.length();
                _projCurDir.copy(this.vel).normalize();
                _projCurDir.lerp(_projDir, dt * this.homing).normalize();
                this.vel.copy(_projCurDir).multiplyScalar(spd);
            }
        }

        if (this.gravity !== 0) {
            this.vel.y -= this.gravity * dt;
        }

        this.t += dt;
        if (this.t > this.maxT) {
            scene.remove(this.m);
            releaseProjMesh(this.m);
            return true;
        }

        this.m.position.addScaledVector(this.vel, dt);

        if (this.signature.pattern === 'helix') {
          const helix = Math.sin(this.t * this.signature.wobbleFreq) * this.signature.wobbleAmp;
          this.m.position.y += helix;
        } else if (this.signature.pattern === 'drift') {
          this.m.position.addScaledVector(this.zigzagAxis, this.signature.wobbleAmp * dt * 5);
        }

        if (this.zigzagAmp > 0.001 && this.zigzagFreq > 0) {
          const zz = Math.sin(this.t * this.zigzagFreq) * this.zigzagAmp;
          this.m.position.addScaledVector(this.zigzagAxis, zz * dt * 9);
        }

        this.trailT += dt;
        if (this.trailT >= this.signature.trailTick) {
          this.trailT = 0;
          spawnPart(this.m.position.clone(), this.familyStyle.color, 1, this.familyStyle.trailPulse);
        }

        if (this.m.position.y < terrainH(this.m.position.x, this.m.position.z)) {
          if (this.family === 'alchemy') {
            spawnFamilyGroundZone(this.m.position.clone(), 'alchemy', this.dmg, Math.max(1.6, (this.blast || 2) * 0.65), 3.0 + this.dmg * 0.004);
          }
            if (this.bounce > 0) {
                this.bounce--;
                this.vel.y *= -0.6;
                this.vel.x *= 0.8;
                this.vel.z *= 0.8;
                this.m.position.y += 0.2;
            } else {
                spawnPart(this.m.position, 0xffffff, 4, 2);
                if (this.blast > 0) { // Blast on ground hit
                    spawnPart(this.m.position, 0xffaa00, 12, 8);
                    monsters.forEach(m2 => {
                        if (!m2.dead && m2.root.position.distanceTo(this.m.position) < this.blast) {
                            m2.takeDmg(this.dmg * 0.5);
                        }
                    });
                }
                scene.remove(this.m);
                releaseProjMesh(this.m);
                return true;
            }
        }
    }

    for (const m of monsters) {
      if (m.dead || (this.hitList.includes(m) && !this.boomerang && !this.orbit)) continue;
      if (this.boomerang && this.hitList.includes(m)) continue;

      const hitPart = m.checkHit(this.m.position, 0.4);
      if (hitPart) {
        const dist = playerPivot.position.distanceTo(m.root.position);
        let dmg = this.dmg; // Base damage passed in constructor
        
        // Recalculate dynamic damage bonuses based on hit distance
        if (this.props.sniper) {
             dmg *= (1 + Math.min(2.0, dist / 20));
        }
        
        if (GameState.pHP < GameState.pMaxHP * 0.3 && this.props.lowHpBonus) dmg *= (1 + this.props.lowHpBonus);
        
        const isCrit = (this.props.fire && Math.random() < 0.3) || (Math.random() < 0.05 * GameState.pLuck);
        if (isCrit) dmg *= 2.0;
        if (this.weaponPathPower > 0) dmg *= (1 + this.weaponPathPower * 0.03);
        if (this.weaponPathControl > 0 && dist > 10) dmg *= (1 + this.weaponPathControl * 0.015);
        
        if (this.props.poison) {
            m.bleedStack += 5; // Utilise le système de saignement existant pour le poison
            addNotif("☠ Poison", "#00ff00");
        }
        
        m.hitPart(hitPart, dmg, this.props.ice);

        if (this.blast > 0) {
          spawnPart(this.m.position, 0xffaa00, 12, 8);
          monsters.forEach(m2 => {
            if (!m2.dead && m2.root.position.distanceTo(this.m.position) < this.blast) {
              m2.takeDmg(dmg * 0.5);
            }
          });
        }

        if (this.family === 'storm') {
          var jumps = 2 + Math.min(3, Math.floor((this.pierce || 0) * 0.5));
          var chainSrc = m;
          var chained = [m];
          for (var sj = 0; sj < jumps; sj++) {
            var next = null;
            var best = Infinity;
            for (var si = 0; si < monsters.length; si++) {
              var sm = monsters[si];
              if (!sm || sm.dead || chained.indexOf(sm) >= 0 || !sm.root || !chainSrc.root) continue;
              var chainDist = sm.root.position.distanceTo(chainSrc.root.position);
              if (chainDist < best && chainDist <= 9 + sj * 1.5) {
                best = chainDist;
                next = sm;
              }
            }
            if (!next) break;
            next.takeDmg(dmg * (0.68 - sj * 0.1), false, 0.3, chainSrc.root.position);
            spawnPart(next.root.position, 0xffff77, 7, 4);
            chained.push(next);
            chainSrc = next;
          }
        } else if (this.props.lightning && Math.random() < 0.4) {
          const other = monsters.find(om => om !== m && !om.dead && om.root.position.distanceTo(m.root.position) < 8);
          if (other) {
            other.takeDmg(dmg * 0.7);
            spawnPart(other.root.position, 0xffff00, 5, 5);
          }
        }

        if (this.family === 'alchemy' && (this.blast > 0 || this.props.shape === 'circle')) {
          spawnFamilyGroundZone(this.m.position.clone(), 'alchemy', dmg, Math.max(1.4, (this.blast || 2) * 0.6), 2.2 + dmg * 0.003);
        }

        spawnPart(this.m.position, this.familyStyle.impactColor, 7, 4);
        this.hitList.push(m);

        if (this.family === 'shadow') {
          var bounceTarget = null;
          var bounceBest = Infinity;
          for (var bi = 0; bi < monsters.length; bi++) {
            var bm = monsters[bi];
            if (!bm || bm.dead || bm === m || this.hitList.includes(bm) || !bm.root) continue;
            var bd = bm.root.position.distanceTo(this.m.position);
            if (bd < bounceBest && bd <= 10) {
              bounceBest = bd;
              bounceTarget = bm;
            }
          }
          if (bounceTarget && bounceTarget.root) {
            this.pierce = Math.max(this.pierce, 1);
            this.dmg *= 0.82;
            this.vel.copy(bounceTarget.root.position.clone().sub(this.m.position).normalize().multiplyScalar(Math.max(12, this.vel.length())));
            this.hitList.push(bounceTarget);
            spawnPart(this.m.position, 0xc28cff, 5, 3);
            return false;
          }
        }

        if (this.pierce > 0) {
          this.pierce--;
        } else if (this.bounce > 0) {
          this.bounce--;
          this.vel.x += (Math.random() - 0.5) * 10;
          this.vel.z += (Math.random() - 0.5) * 10;
          // Keep speed roughly same
        } else if (!this.orbit) {
          if (this.split > 0 && !this.props._child) {
            this.split--;
            const n = 2;
            for (let i = 0; i < n; i++) {
              const d = this.vel.clone().normalize();
              d.x += (Math.random() - 0.5) * 0.55;
              d.y += (Math.random() - 0.5) * 0.35;
              d.z += (Math.random() - 0.5) * 0.55;
              d.normalize();
              projectiles.push(new Proj(this.m.position.clone(), d, dmg * 0.45, this.m.material.color.getHex(), Math.max(12, this.vel.length() * 0.85), Math.max(0.45, this.maxT * 0.35), {
                _child: true,
                scale: 0.55,
                shape: this.props.shape || 'diamond',
                zigzagAmp: this.zigzagAmp * 0.6,
                zigzagFreq: this.zigzagFreq * 1.2
              }));
            }
          }
          scene.remove(this.m);
          releaseProjMesh(this.m);
          return true;
        } else {
        }
      }
    }
    return false;
  }
}

// ==================== CHEST CLASS ====================
class WorldPickup {
  constructor(x, z, forcedType = null) {
    this.kind = this.rollKind(forcedType);
    const size = this.kind.size || 1.0;
    this.m = mkSprite(this.kind.color, size, size, this.kind.shape);
    this.m.position.set(x, terrainH(x, z) + 0.5, z);
    scene.add(this.m);
    this.t = 0;
  }

  rollKind(forcedType = null) {
    if (forcedType && typeof forcedType === 'object') {
      const forcedKind = String(forcedType.type || '').toLowerCase();
      if (forcedKind === 'bosschest' || forcedKind === 'boss_chest') {
        return this.makeBossChestKind(forcedType.rewards);
      }
    }
    if (forcedType === 'magnet') return this.makeMagnetKind();
    if (forcedType === 'meal') return this.makeMealKind();
    if (forcedType === 'bomb') return this.makeBombKind();
    if (forcedType === 'frenzy') return this.makeFrenzyKind();

    const r = Math.random();
    if (r < 0.35) return this.makeMagnetKind();
    if (r < 0.65) return this.makeMealKind();
    if (r < 0.9) return this.makeBombKind();
    return this.makeFrenzyKind();
  }

  makeMagnetKind() {
    return {
      id: 'magnet',
      name: 'Aimant d\'XP',
      color: 0x66ccff,
      shape: 'diamond',
      pick: () => {
        let total = 0;
        for (let i = 0; i < xpOrbs.length; i++) {
          const orb = xpOrbs[i];
          if (!orb || !orb.active) continue;
          orb.magnet = true;
          total += Number(orb.val) || 0;
        }
        addNotif(`🧲 Aimant activé (${xpOrbs.length} orbes)`, '#66ccff');
        GameState.pScore += 350 + Math.floor(total * 0.1);
      }
    };
  }

  makeMealKind() {
    return {
      id: 'meal',
      name: 'Repas',
      color: 0xff9966,
      shape: 'circle',
      pick: () => {
        const heal = Math.max(35, Math.floor(GameState.pMaxHP * 0.3));
        const prev = GameState.pHP;
        GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + heal);
        addNotif(`🍖 Repas: +${Math.round(GameState.pHP - prev)} PV`, '#ff9966');
        GameState.pScore += 300;
      }
    };
  }

  makeBombKind() {
    return {
      id: 'bomb',
      name: 'Bombe',
      color: 0xff4444,
      shape: 'box',
      pick: (pos) => {
        const radius = 12;
        let hitCount = 0;
        monsters.forEach((m) => {
          if (!m || m.dead) return;
          const d = m.root.position.distanceTo(pos);
          if (d > radius) return;
          if (m.boss || m.finalBoss) m.takeDmg(Math.max(600, m.mhp * 0.2));
          else m.takeDmg(Math.max(99999, m.hp + 1));
          hitCount++;
        });
        spawnPart(pos, 0xff4400, 26, 9);
        addNotif(`💣 Explosion: ${hitCount} ennemis touchés`, '#ff5555');
        GameState.pScore += 500 + hitCount * 80;
      }
    };
  }

  makeFrenzyKind() {
    return {
      id: 'frenzy',
      name: 'Frénésie',
      color: 0xffe066,
      shape: 'star',
      pick: () => {
        GameState.frenzyTimer = 6;
        addNotif('⚡ Frénésie: cadence max!', '#ffdd66');
        GameState.pScore += 400;
      }
    };
  }

  makeBossChestKind(rewardCount = 1) {
    const rewards = Math.max(1, Math.min(3, Math.floor(rewardCount || 1)));
    return {
      id: 'boss_chest',
      name: 'Coffre de Boss',
      color: 0xffd37a,
      shape: 'box',
      size: 1.25,
      pick: () => {
        if (typeof processBossChestRewards === 'function') {
          processBossChestRewards(rewards);
        } else {
          GameState.pendingBossChestUpgrades = (GameState.pendingBossChestUpgrades || 0) + rewards;
          addNotif(`🎁 Coffre ouvert: ${rewards} amélioration${rewards > 1 ? 's' : ''}!`, '#ffd37a');
          if (typeof showLevelUp === 'function' && !GameState.levelingUp && GameState.gameRunning) {
            setTimeout(() => showLevelUp(), 0);
          }
        }
      }
    };
  }

  update(dt, pp) {
    if (pp) this.m.lookAt(pp);
    this.t += dt;
    this.m.position.y = terrainH(this.m.position.x, this.m.position.z) + 0.5 + Math.sin(this.t * 2) * 0.1;
    if (playerPivot.position.distanceTo(this.m.position) < 2.5) {
      this.pick();
      return true;
    }
    return false;
  }

  pick() {
    spawnPart(this.m.position, this.kind.color, 16, 4);
    if (this.kind && typeof this.kind.pick === 'function') {
      this.kind.pick(this.m.position.clone());
    }
  }
}

// Backward compatibility for old references.
class Chest extends WorldPickup {}

function spawnWorldPickupAt(pos, forcedType = null) {
  if (!pos) return;
  const p = pos.clone ? pos.clone() : new THREE.Vector3(pos.x || 0, pos.y || 0, pos.z || 0);
  chests.push(new WorldPickup(p.x, p.z, forcedType));
}

// ==================== MOB CARD DROP ====================
class MobCardDrop {
  constructor(pos, mobType) {
    const p = pos && pos.clone ? pos.clone() : new THREE.Vector3(pos.x || 0, pos.y || 0, pos.z || 0);
    this.typeName = (mobType && mobType.name) ? mobType.name : String(mobType || 'Unknown');
    this.root = new THREE.Group();
    this.t = 0;

    let built = false;
    if (mobType && typeof buildPuppet === 'function') {
      try {
        const puppet = buildPuppet(mobType);
        if (puppet && puppet.g) {
          puppet.g.scale.setScalar(0.35);
          puppet.g.position.set(0, 0.2, 0);
          this.root.add(puppet.g);
          built = true;
        }
      } catch (e) {
        built = false;
      }
    }

    if (!built) {
      const fallback = mkSprite(0xe0c080, 0.8, 1.1, 'box');
      fallback.position.set(0, 0.4, 0);
      this.root.add(fallback);
    }

    const ring = mkSprite(0xd0a040, 1.0, 1.0, 'circle');
    ring.position.set(0, 0.05, 0);
    ring.rotation.x = -Math.PI / 2;
    this.root.add(ring);

    this.root.position.copy(p);
    this.root.position.y = terrainH(p.x, p.z) + 0.6;
    scene.add(this.root);
  }

  update(dt, pp) {
    this.t += dt;
    this.root.position.y = terrainH(this.root.position.x, this.root.position.z) + 0.6 + Math.sin(this.t * 2.5) * 0.1;
    if (pp) {
      const look = pp.clone();
      look.y = this.root.position.y;
      this.root.lookAt(look);
    }

    if (playerPivot.position.distanceTo(this.root.position) < 2.2) {
      this.pick();
      return true;
    }
    return false;
  }

  pick() {
    if (!GameState.saveData.cardStacks || typeof GameState.saveData.cardStacks !== 'object') {
      GameState.saveData.cardStacks = {};
    }
    GameState.saveData.cardStacks[this.typeName] = (GameState.saveData.cardStacks[this.typeName] || 0) + 1;
    if (!Array.isArray(GameState.saveData.cards)) GameState.saveData.cards = [];
    if (!GameState.saveData.cards.includes(this.typeName)) GameState.saveData.cards.push(this.typeName);
    spawnPart(this.root.position.clone().add(new THREE.Vector3(0, 0.4, 0)), 0xe0c080, 18, 5);
    addNotif('Card: ' + this.typeName + ' x' + GameState.saveData.cardStacks[this.typeName], '#e0c080');
  }
}

// ==================== XP ORB CLASS ====================
class XPOrb {
  constructor(pos, val) {
    this.val = val;
    this.active = true;
    let col = 0x00ffff, s = 0.25;
    if (val > 200) { col = 0xffd700; s = 0.4; }
    if (val > 600) { col = 0xff00ff; s = 0.6; }
    this.m = mkSprite(col, s * 2, s * 2, 'diamond');
    this.m.position.copy(pos);
    this.m.position.y += 0.5;
    scene.add(this.m);
    this.t = Math.random() * 10;
    this.magnet = false;
  }

  update(dt, pp) {
    if (pp) this.m.lookAt(pp);
    if (!this.active) return true;
    const d = this.m.position.distanceTo(pp);

    if (this.magnet || d < GameState.pPickupRange) {
      this.magnet = true;
      const dir = pp.clone().sub(this.m.position).normalize();
      const spd = 12 + (20 / Math.max(0.1, d));
      this.m.position.addScaledVector(dir, spd * dt);
      if (d < 0.8) {
        addXP(this.val * GameState.pXpMult);
        scene.remove(this.m);
        this.active = false;
        return true;
      }
    } else {
      this.t += dt;
      this.m.position.y = terrainH(this.m.position.x, this.m.position.z) + 0.5 + Math.sin(this.t * 3) * 0.2;
    }
    return false;
  }
}

// ==================== PARTICLE FUNCTIONS ====================
function getPart() {
  if (partPool.length) return partPool.pop();
  const mat = new THREE.SpriteMaterial({ map: getSpTex(0xffffff, 'circle'), color: 0xffffff });
  return new THREE.Sprite(mat);
}

function recyclePart(m) {
  scene.remove(m);
  partPool.push(m);
}

function spawnPart(pos, col, n, spd = 3) {
  if (GameState.saveData.settings && GameState.saveData.settings.particles === 0) {
      n = Math.ceil(n * 0.3); // Reduce particles if setting is Low
  }

  for (let i = 0; i < n; i++) {
    const m = getPart();
    m.material.color.setHex(col);
    m.material.opacity = 1;
    const s = 0.15 + Math.random() * 0.2;
    m.scale.set(s, s, 1);
    m.position.copy(pos);
    const v = new THREE.Vector3((Math.random() - 0.5) * spd * 2, Math.random() * spd * 1.5, (Math.random() - 0.5) * spd * 2);
    scene.add(m);
    particles.push({ m, v, l: 0.5 + Math.random() * 0.4, ml: 1 });
  }
}

function getDmgNumSprite() {
  if (dmgNumPool.length) {
    const sprite = dmgNumPool.pop();
    scene.add(sprite);
    return sprite;
  }
  const texture = new THREE.CanvasTexture(dmgNumCanvas);
  const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.2, 0.6, 1);
  sprite.renderOrder = 2000;
  return sprite;
}

function recycleDmgNumSprite(sprite) {
  scene.remove(sprite);
  dmgNumPool.push(sprite);
}

function addDmgNum(wp, dmg, crit = false) {
  const sp = getDmgNumSprite();
  dmgNumCtx.clearRect(0, 0, 80, 40);
  dmgNumCtx.font = `bold ${crit ? 36 : 28}px Arial`;
  dmgNumCtx.fillStyle = crit ? '#ffff00' : '#ff4020';
  dmgNumCtx.strokeStyle = '#000';
  dmgNumCtx.lineWidth = 3;
  dmgNumCtx.strokeText('-' + dmg, 10, 30);
  dmgNumCtx.fillText('-' + dmg, 10, 30);
  sp.material.map.needsUpdate = true;
  sp.position.copy(wp).add(new THREE.Vector3(0, 3, 0));
  dmgNums.push({ sp, l: 1 });
}

function updPart(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.l -= dt;
    p.v.y -= 12 * dt;
    p.m.position.addScaledVector(p.v, dt);
    p.m.material.opacity = p.l / p.ml;
    if (p.l <= 0) {
      recyclePart(p.m);
      particles.splice(i, 1);
    }
  }
  for (let i = dmgNums.length - 1; i >= 0; i--) {
    const d = dmgNums[i];
    d.l -= dt;
    d.sp.position.y += dt * 1.5;
    d.sp.material.opacity = d.l;
    if (d.l <= 0) {
      recycleDmgNumSprite(d.sp);
      dmgNums.splice(i, 1);
    }
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Proj, Chest, XPOrb, MobCardDrop, spawnPart, addDmgNum, updPart };
}
