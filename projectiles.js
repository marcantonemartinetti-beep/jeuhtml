// ═══════════════════════════════════════════════
// DUNGEON WORLD - Projectiles & Objects
// ═══════════════════════════════════════════════

// ==================== POOLS ====================
var partPool = [];
var dmgNumPool = [];
var dmgNumCanvas = document.createElement('canvas');
dmgNumCanvas.width = 80;
dmgNumCanvas.height = 40;
var dmgNumCtx = dmgNumCanvas.getContext('2d');

// ==================== TEMP VECTORS (GC OPTIMIZATION) ====================
const _projTargetPos = new THREE.Vector3();
const _projDir = new THREE.Vector3();
const _projCurDir = new THREE.Vector3();

// ==================== PROJECTILE CLASS ====================
class Proj {
  constructor(pos, dir, dmg, col, speed, life, props = {}) {
    this.dmg = dmg;
    this.vel = dir.clone().normalize().multiplyScalar(speed);
    this.props = props;
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

    this.target = null;
    this.t = 0;
    this.maxT = life;
    this.hitList = [];

    const r = Math.min(1.2, 0.3 * (props.scale || 1) * GameState.pArea);
    const shape = props.shape || 'circle';
    this.m = mkSprite(col, r, r, shape);
    this.m.position.copy(pos);
    scene.add(this.m);
  }

  update(dt, pp) {
    if (pp) this.m.lookAt(pp);
    if (this.spin !== 0) {
        this.m.rotation.z += this.spin * this.t;
    }

    if (this.orbit) {
        this.t += dt;
        if (this.t > this.maxT) { scene.remove(this.m); return true; }
        
        this.orbitAngle += this.orbitSpeed * dt;
        this.m.position.x = pp.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        this.m.position.z = pp.z + Math.sin(this.orbitAngle) * this.orbitRadius;
        this.m.position.y = pp.y + 1.0 + Math.sin(this.t * 3) * 0.5;
    } else {
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
            return true;
        }

        this.m.position.addScaledVector(this.vel, dt);

        if (this.m.position.y < terrainH(this.m.position.x, this.m.position.z)) {
            if (this.bounce > 0) {
                this.bounce--;
                this.vel.y *= -0.6;
                this.vel.x *= 0.8;
                this.vel.z *= 0.8;
                this.m.position.y += 0.2;
            } else {
                spawnPart(this.m.position, this.m.material.color.getHex(), 4, 2);
                if (this.blast > 0) { // Blast on ground hit
                    spawnPart(this.m.position, 0xffaa00, 12, 8);
                    monsters.forEach(m2 => {
                        if (!m2.dead && m2.root.position.distanceTo(this.m.position) < this.blast) {
                            m2.takeDmg(this.dmg * 0.5);
                        }
                    });
                }
                scene.remove(this.m);
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

        if (this.props.lightning && Math.random() < 0.4) {
          const other = monsters.find(om => om !== m && !om.dead && om.root.position.distanceTo(m.root.position) < 8);
          if (other) {
            other.takeDmg(dmg * 0.7);
            spawnPart(other.root.position, 0xffff00, 5, 5);
          }
        }

        spawnPart(this.m.position, this.m.material.color.getHex(), 6, 4);
        this.hitList.push(m);

        if (this.pierce > 0) {
          this.pierce--;
        } else if (this.bounce > 0) {
          this.bounce--;
          this.vel.x += (Math.random() - 0.5) * 10;
          this.vel.z += (Math.random() - 0.5) * 10;
          // Keep speed roughly same
        } else if (!this.orbit) {
          scene.remove(this.m);
          return true;
        } else {
        }
      }
    }
    return false;
  }
}

// ==================== CHEST CLASS ====================
class Chest {
  constructor(x, z) {
    this.m = mkSprite(0xffaa00, 1.0, 1.0, 'box');
    this.m.position.set(x, terrainH(x, z) + 0.5, z);
    scene.add(this.m);
    this.t = 0;
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
    spawnPart(this.m.position, 0xffd700, 15, 4);
    const r = Math.random();
    if (r < 0.33) {
      GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + 50);
      addNotif('💖 Soin Divin!', '#ff4444');
      GameState.pScore += 500;
    } else if (r < 0.66) {
      xpOrbs.push(new XPOrb(this.m.position, 1000));
      addNotif('💎 Trésor d\'XP!', '#44ff44');
      GameState.pScore += 500;
    } else {
      GameState.frenzyTimer = 5;
      addNotif('⚡ FRENZY! Cadence Max!', '#ffff00');
      GameState.pScore += 500;
    }
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
  module.exports = { Proj, Chest, XPOrb, spawnPart, addDmgNum, updPart };
}
