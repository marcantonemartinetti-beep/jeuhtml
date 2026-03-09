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
  updateMeleeTelegraphs(dt);

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

  // RIFT
  if (PASSIVES.rift.active) {
    PASSIVES.rift.cd -= dt;
    if (PASSIVES.rift.cd <= 0) {
      PASSIVES.rift.cd = PASSIVES.rift.maxCd;
      let center = null;
      let minD = PASSIVES.rift.range;
      monsters.forEach(m => {
        if (m.dead) return;
        const d = m.root.position.distanceTo(pp);
        if (d < minD) { minD = d; center = m.root.position.clone(); }
      });
      if (center) {
        spawnPart(center, 0x9922ff, 16, 8);
        monsters.forEach(m => {
          if (m.dead) return;
          const d = m.root.position.distanceTo(center);
          if (d < PASSIVES.rift.range) {
            const dir = center.clone().sub(m.root.position).normalize();
            m.root.position.addScaledVector(dir, PASSIVES.rift.pulls);
            m.takeDmg(PASSIVES.rift.dmg, false, 0.4, center);
          }
        });
      }
    }
  }

  // MIRROR ORB
  if (PASSIVES.mirrorOrb.active) {
    if (PASSIVES.mirrorOrb.meshes.length !== PASSIVES.mirrorOrb.count) {
      PASSIVES.mirrorOrb.meshes.forEach(m => scene.remove(m));
      PASSIVES.mirrorOrb.meshes = [];
      for (let i = 0; i < PASSIVES.mirrorOrb.count; i++) {
        const m = mkSprite(0xaaddff, 0.45, 0.45, 'diamond');
        scene.add(m);
        PASSIVES.mirrorOrb.meshes.push(m);
      }
    }
    PASSIVES.mirrorOrb.angle += dt * PASSIVES.mirrorOrb.speed;
    PASSIVES.mirrorOrb.meshes.forEach((m, i) => {
      const off = (i / Math.max(1, PASSIVES.mirrorOrb.count)) * Math.PI * 2;
      m.position.set(pp.x + Math.cos(PASSIVES.mirrorOrb.angle + off) * PASSIVES.mirrorOrb.range, terrainH(pp.x, pp.z) + 1.25, pp.z + Math.sin(PASSIVES.mirrorOrb.angle + off) * PASSIVES.mirrorOrb.range);
      monsters.forEach(mon => {
        if (!mon.dead && mon.root.position.distanceTo(m.position) < 1.1 && mon.orbHitT <= 0) {
          mon.takeDmg(PASSIVES.mirrorOrb.dmg, false, GameState.pKnockback * 1.2, pp);
          mon.orbHitT = 0.35;
          spawnPart(m.position, 0xaaddff, 4, 2);
        }
      });
    });
  }
}

// ==================== WEAPON VISUALS (REDESIGNED SPRITE BILLBOARD STYLE) ====================
