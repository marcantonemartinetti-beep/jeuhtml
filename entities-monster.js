// ==================== MONSTER CLASS ====================
class Monster {
  constructor(x, z, ti = null) {
    let typeData;
    if (ti !== null) typeData = MTYPES[ti];
    else {
        const mobNames = GameState.pBiome ? GameState.pBiome.mobs : ['Gobelin'];
        const name = mobNames[Math.floor(Math.random() * mobNames.length)];
        typeData = MTYPES.find(m => m.name === name) || MTYPES[0];
      }
    this.T = { ...typeData };
    this.baseName = this.T.name;
    this.baseTint = 0xffffff;

    const diff = 0.4 + GameState.pT / 120;
    let diffMult = diff;
    if (GameState.pBiome && !ti) diffMult *= GameState.pBiome.diff;

    // Loop difficulty scaling (NG+)
    const loopMult = 1.0 + (GameState.loopLevel * 0.5);
    diffMult *= loopMult;

    // Time-based speed scaling (Vampire Survivors style)
    const timeSpeedMult = 1.0 + Math.min(0.8, GameState.pT / 200); // +80% vitesse max après 160s

    if (GameState.biomeFx && !ti) {
      this.T.spd *= GameState.biomeFx.mobSpdMult || 1;
      diffMult *= GameState.biomeFx.mobHpMult || 1;
    }

    this.T.spd *= timeSpeedMult; // Ennemis plus rapides avec le temps
    this.T.hp *= diffMult;
    this.T.dmg *= diffMult * (GameState.biomeFx && !ti ? (GameState.biomeFx.mobDmgMult || 1) : 1);
    this.xpVal = Math.floor(100 * diff * (this.baseTint !== 0xffffff ? 1.5 : 1));
    if (GameState.pBiome) this.xpVal = Math.floor(this.xpVal * GameState.pBiome.diff);
    if (GameState.biomeFx && !ti) this.xpVal = Math.floor(this.xpVal * (GameState.biomeFx.xpMult || 1));

    this.hp = this.mhp = this.T.hp;
    this.dead = false;
    this.dt = 0;
    this.t = Math.random() * 100;
    this.state = 'wander';
    this.wangle = Math.random() * Math.PI * 2;
    this.wtimer = 2 + Math.random() * 3;
    this.acd = 0;
    this.boss = false;
    this.flash = 0;
    this.orbHitT = 0;
    this.finalBoss = false;
    this.bossTimer = 0;
    this.deathFxApplied = false;

    const { g, p } = buildPuppet(this.T);
    this.bleedStack = 0;
    this.bleedTimer = 0;
    this.root = g;
    this.p = p;
    this.bleed = [];

    // Init limb HP
    const base = this.T.hp * 0.4;
    for (const k in p) {
      if (k.startsWith('eye') && this.T.shape !== 'titan') continue;
      const ratio = (k === 'torso' || k === 'core') ? 1.0 : (k === 'head') ? 0.4 : 0.25;
      p[k].userData = { hp: base * ratio, max: base * ratio };
    }
    Object.values(this.p).forEach(s => {
      s.material.color.setHex(this.baseTint);
      if (this.T.op) s.material.opacity = this.T.op;
    });

    // Nouvelle barre de vie optimisée (1 sprite au lieu de 2 meshes)
    const bw = 1.2 * this.T.S;
    const barH = 0.15;
    const barY = 2.9 * this.T.S;
    
    // Bordure (fond noir)
    this.hpBorder = mkSprite(0x000000, bw + 0.08, barH + 0.04, 'box');
    this.hpBorder.position.set(0, barY, 0);
    this.hpBorder.renderOrder = 998;
    this.root.add(this.hpBorder);
    
    // Fond gris foncé
    this.hpBg = mkSprite(0x222222, bw, barH, 'box');
    this.hpBg.position.set(0, barY, 0.01);
    this.hpBg.renderOrder = 999;
    this.root.add(this.hpBg);
    
    // Barre de vie (couleur dynamique)
    this.hpFill = mkSprite(0xff0000, bw, barH, 'box');
    this.hpFill.position.set(0, barY, 0.02);
    this.hpFill.renderOrder = 1000;
    this.root.add(this.hpFill);
    
    this.bw = bw;
    this.barVisible = true;

    this.root.position.set(x, terrainH(x, z), z);
    this.baseCollisionRadius = Math.max(0.45, (this.T.S || 1) * 0.55);
    this.collisionRadius = this.getCollisionRadius();
    scene.add(this.root);
  }

  getCollisionRadius() {
    const shape = String(this.T && this.T.shape ? this.T.shape : '');
    let shapeMul = 1.0;
    if (shape === 'flyer' || shape === 'floating_skull') shapeMul = 0.85;
    else if (shape === 'blob' || shape === 'slime_cube') shapeMul = 1.12;
    else if (shape === 'titan' || shape === 'hydra') shapeMul = 1.28;
    const scale = this.root && this.root.scale ? Math.max(this.root.scale.x || 1, this.root.scale.z || 1) : 1;
    return Math.max(0.4, this.baseCollisionRadius * shapeMul * scale);
  }

  makeBoss(opts = null) {
    const diff = 0.6 + GameState.pT / 180;
    const loopMult = 1.0 + (GameState.loopLevel * 0.5); // Loop difficulty scaling
    const cfg = opts && typeof opts === 'object' ? opts : {};

    this.boss = true;

    const hpMult = Math.max(1.2, Number(cfg.hpMult) || 3.8);
    const dmgMult = Math.max(1.05, Number(cfg.dmgMult) || 1.8);
    const spdMult = Math.max(0.9, Number(cfg.spdMult) || 1.12);
    const bossScale = Math.max(1.6, Number(cfg.scale) || 2.5);

    this.hp = this.mhp = Math.max(220, this.mhp * hpMult * diff * Math.max(1, loopMult * 0.6));
    this.T = {
      ...this.T,
      dmg: Math.max(8, this.T.dmg * dmgMult * Math.max(1, diff * 0.55) * loopMult),
      spd: Math.max(0.9, this.T.spd * spdMult)
    };
    this.xpVal = Math.max(1200, this.xpVal * 3.2 * diff * loopMult);
    this.root.scale.setScalar(bossScale); // Géant sans casser le puppet d'origine
    this.baseTint = Number(cfg.tint) || 0xff3300;
    Object.values(this.p).forEach(s => s.material.color.setHex(this.baseTint));

    if (cfg.titlePrefix) {
      this.T.name = `${String(cfg.titlePrefix)} ${this.baseName}`;
    }

    // Keep collision in sync with scaled boss body.
    this.collisionRadius = this.getCollisionRadius();

    // Ajouter marqueur au dessus du boss
    this.addBossMarker();
  }
  
  addBossMarker() {
    if (this.bossMarker) {
      this.root.remove(this.bossMarker);
      this.bossMarker = null;
    }

    const markerG = new THREE.Group();
    const markerColor = this.finalBoss ? 0xffee88 : 0xffaa00;

    const crown = mkSprite(markerColor, 0.95, 0.55, 'tri');
    crown.position.set(0, 6 * this.T.S, 0);
    crown.material.transparent = true;
    crown.material.opacity = 0.9;
    crown.material.depthTest = false;
    markerG.add(crown);

    const ring = mkSprite(markerColor, 2.0, 2.0, 'circle');
    ring.position.set(0, 5 * this.T.S, 0);
    ring.material.transparent = true;
    ring.material.opacity = 0.4;
    ring.material.depthTest = false;
    markerG.add(ring);
    
    this.bossMarker = markerG;
    this.root.add(markerG);
  }

  makeFinalBoss() {
    this.boss = true;
    this.finalBoss = true;
    
    // Loop difficulty scaling (NG+)
    const loopMult = 1.0 + (GameState.loopLevel * 0.5);
    
    this.hp = this.mhp = 60000 * loopMult;
    this.T = { ...this.T, dmg: 80 * loopMult, spd: 3.5 };
    this.xpVal = 100000 * loopMult;
    this.root.scale.setScalar(8.0);
    this.baseTint = 0xffffff;
    Object.values(this.p).forEach(s => s.material.color.setHex(this.baseTint));
    this.addBossMarker();
  }

  update(dt, pp) {
    if (this.dead) {
      this.dt += dt;

      // Lightweight death effect: apply once, then despawn quickly.
      if (!this.deathFxApplied) {
        this.deathFxApplied = true;
        this.root.scale.multiplyScalar(this.boss || this.finalBoss ? 0.92 : 0.85);
        this.root.position.y -= 0.2 * this.T.S;
        this.root.rotation.z += (Math.random() - 0.5) * 0.35;
        this.hpBorder.visible = false;
        this.hpBg.visible = false;
        this.hpFill.visible = false;
      }

      // Keep bosses visible a bit longer; normal mobs despawn immediately.
      return this.dt > (this.boss || this.finalBoss ? 0.45 : 0.0);
    }

    if (this.bleedStack > 0) {
      this.bleedTimer -= dt;
      if (this.bleedTimer <= 0) {
        this.takeDmg(this.bleedStack);
        this.bleedTimer = 1.0;
        spawnPart(this.root.position, 0xaa0000, 3, 1);
      }
    }

    this.orbHitT = Math.max(0, this.orbHitT - dt);
    this.collisionRadius = this.getCollisionRadius();
    this.t += dt;
    this.acd = Math.max(0, this.acd - dt);
    this.flash = Math.max(0, this.flash - dt);

    const dx = pp.x - this.root.position.x, dz = pp.z - this.root.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    // Safety check for NaN distance
    if (isNaN(dist)) {
        this.root.position.set(pp.x + 10, pp.y, pp.z + 10); // Teleport away
        return false;
    }

    // LOD avec despawn distance
    const lodHigh = dist < 25;
    const lodMed = dist < 50;
    this.root.visible = dist < 70;
    
    // Despawn si trop loin (optimisation) - sauf pour les boss
    if (dist > 75 && !this.boss && !this.finalBoss) {
      return true; // Signal to remove
    }
    
    if (!this.root.visible) return false;

    const engageDist = this.boss || this.finalBoss ? 65 : 22;
    const disengageDist = this.boss || this.finalBoss ? 90 : 42;
    if (dist < engageDist) this.state = 'chase';
    if (dist > disengageDist && this.state === 'chase') this.state = 'wander';

    let mv = false;
    if (this.state === 'chase') {
      const atkDist = (this.boss || this.finalBoss) ? (2.6 * Math.max(1, this.root.scale.x)) : 1.6;
      if (dist > atkDist) {
        this.root.position.x += dx / dist * this.T.spd * dt;
        this.root.position.z += dz / dist * this.T.spd * dt;
        mv = true;
      } else if (this.acd <= 0) {
        this.acd = 1.2;
        if (GameState.invTimer <= 0) {
          if (Math.random() < GameState.pDodge) {
            addNotif('💨 Esquive!', '#aaddff');
            return;
          }
          const dmgTaken = Math.max(1, Math.round(this.T.dmg * (1 - GameState.pDmgRed)));
          GameState.pHP = Math.max(0, GameState.pHP - dmgTaken);
          if (GameState.runTelemetry) GameState.runTelemetry.damageTaken = (GameState.runTelemetry.damageTaken || 0) + dmgTaken;
          GameState.invTimer = 0.5;
    
    // Reset Combo on hit
    if (GameState.pCombo > 0) {
        addNotif("💔 COMBO PERDU !", "#ff0000");
        GameState.pCombo = 0;
    }
    
          flashDmg();
          addNotif(`💥 -${dmgTaken} PV`, '#e03030');
          if (GameState.pThorns > 0) {
            this.takeDmg(GameState.pThorns);
            spawnPart(this.root.position, 0x88ff00, 5, 3);
          }
          if (GameState.pHP <= 0) gameOver();
        }
      }
    } else {
      this.wtimer -= dt;
      if (this.wtimer < 0) {
        this.wangle += (Math.random() - 0.5) * 2;
        this.wtimer = 2 + Math.random() * 3;
      }
      const wanderSpd = this.boss || this.finalBoss ? Math.max(0.6, this.T.spd * 0.35) : 0.4;
      this.root.position.x += Math.sin(this.wangle) * wanderSpd * dt;
      this.root.position.z += Math.cos(this.wangle) * wanderSpd * dt;
    }

    // Limb support logic
    let yOff = 0;
    if (this.T.shape === 'flyer') {
      if ((!this.p.wingL || !this.p.wingL.visible) && (!this.p.wingR || !this.p.wingR.visible)) yOff = -2.0 * this.T.S;
    } else if (this.T.shape !== 'blob' && this.T.shape !== 'spider') {
      const legs = ['legLU', 'legRU', 'legFL', 'legBL'].filter(k => this.p[k]);
      const active = legs.filter(k => this.p[k].visible).length;
      if (active === 0) yOff = -0.8 * this.T.S;
    }

    this.root.position.y = terrainH(this.root.position.x, this.root.position.z) + yOff;

    if (lodMed || Math.floor(this.t * 60) % 15 === 0) this.root.lookAt(pp.x, this.root.position.y, pp.z);

    if (this.finalBoss && !this.dead) {
      this.bossTimer -= dt;
      if (this.bossTimer <= 0) {
        this.bossTimer = 2.0;
        const r = Math.random();
        if (r < 0.5) {
          ['eyeL', 'eyeR'].forEach(k => {
            if (this.p[k] && this.p[k].visible) {
              this.p[k].getWorldPosition(_v1);
              const wp = _v1.clone();
              const d = pp.clone().sub(wp).normalize();
              projectiles.push(new Proj(wp, d, 25, 0xaa0000, 18, 4.0));
            }
          });
        }
      }
      
      // Animation du marqueur boss
      if (this.bossMarker) {
        this.bossMarker.children[0].position.y = 6 * this.T.S + Math.sin(this.t * 4) * 0.5;
        this.bossMarker.children[1].rotation.z = this.t * 2;
        this.bossMarker.children[1].material.opacity = 0.3 + Math.sin(this.t * 3) * 0.2;
      }
    }
    
    // Animation du marqueur pour boss standard aussi
    if (this.boss && !this.finalBoss && this.bossMarker) {
      this.bossMarker.children[0].position.y = 6 * this.T.S + Math.sin(this.t * 4) * 0.5;
      this.bossMarker.children[1].rotation.z = this.t * 2;
      this.bossMarker.children[1].material.opacity = 0.3 + Math.sin(this.t * 3) * 0.2;
    }

    // Animation avec LOD amélioré
    // Boss et ennemis proches: animation complète
    // Ennemis moyens: animation réduite
    // Ennemis loin: pas d'animation (statues)
    if (this.boss || this.finalBoss || lodHigh) {
      // Animation complète
      animPuppet(this.p, this.t, mv, this.T.S, this.T.shape);
    } else if (lodMed && Math.floor(this.t * 60) % 3 === 0) {
      // Animation réduite (toutes les 3 frames)
      animPuppet(this.p, this.t, mv, this.T.S, this.T.shape);
    }
    // Sinon: pas d'animation du tout (économise les calculs)

    if (lodHigh && this.bleed.length && !this.dead && Math.random() < 0.2) {
      const b = this.bleed[Math.floor(Math.random() * this.bleed.length)];
      b.getWorldPosition(_v1);
      spawnPart(_v1, 0x880000, 1, 1);
    }

    Object.values(this.p).forEach(s => {
      if (s.visible) s.material.color.setHex(this.flash > 0 ? 0xff7777 : this.baseTint);
    });

    // Mise à jour barre de vie optimisée
    const pct = Math.max(0, this.hp / this.mhp);
    
    // Masquer la barre quand à 100% HP (optimisation)
    const shouldShow = pct < 0.999;
    if (shouldShow !== this.barVisible) {
      this.barVisible = shouldShow;
      this.hpBorder.visible = shouldShow;
      this.hpBg.visible = shouldShow;
      this.hpFill.visible = shouldShow;
    }
    
    if (shouldShow) {
      this.hpBorder.lookAt(camera.position);
      this.hpBg.lookAt(camera.position);
      this.hpFill.lookAt(camera.position);
      
      if (lodMed || Math.floor(this.t * 60) % 10 === 0) {
        // Mise à jour largeur
        this.hpFill.scale.x = pct;
        this.hpFill.position.x = -(1 - pct) * this.bw * 0.5;
        
        // Couleur dynamique: vert (100%) → jaune (50%) → rouge (0%)
        let hpColor;
        if (pct > 0.6) {
          // Vert vers jaune
          const t = (1 - pct) / 0.4;
          hpColor = new THREE.Color(t, 1, 0);
        } else if (pct > 0.3) {
          // Jaune vers orange
          const t = (0.6 - pct) / 0.3;
          hpColor = new THREE.Color(1, 1 - t * 0.5, 0);
        } else {
          // Orange vers rouge
          const t = pct / 0.3;
          hpColor = new THREE.Color(1, t * 0.5, 0);
        }
        this.hpFill.material.color.copy(hpColor);
      }
    }

    if (this.boss) {
      const bf = document.getElementById('bossfill'), bt = document.getElementById('bosstrk');
      if (this.finalBoss) {
        const P = 3, sz = this.mhp / P, cur = Math.max(1, Math.ceil(this.hp / sz));
        const subPct = Math.max(0, (this.hp - (cur - 1) * sz) / sz);
        const cols = ['#d02020', '#f0a020', '#a020f0'];
        bf.style.background = cols[cur - 1];
        bf.style.width = (subPct * 100) + '%';
        bt.style.background = cur > 1 ? cols[cur - 2] : '#300000';
      } else {
        bf.style.background = 'linear-gradient(90deg,#800,#d03030)';
        bt.style.background = 'rgba(0,0,0,.65)';
        bf.style.width = (pct * 100) + '%';
      }
    }

    this.root.updateMatrixWorld();
    return false;
  }

  checkHit(pos, r) {
    if (this.dead) return null;
    const rootScale = Math.max(1, this.root.scale && this.root.scale.x ? this.root.scale.x : 1);
    if (pos.distanceTo(this.root.position) > 3.5 * this.T.S * rootScale) return null;
    let hit = null, minD = Infinity;
    for (const [k, sp] of Object.entries(this.p)) {
      if (!sp.visible) continue;
      if (k.startsWith('eye') && this.T.shape !== 'titan') continue;
      sp.getWorldPosition(_v1);
      const d = pos.distanceTo(_v1);
      const hr = (sp.scale.x * this.root.scale.x) * 0.5;
      if (d < hr + r && d < minD) {
        minD = d;
        hit = k;
      }
    }
    return hit;
  }

  hitPart(k, dmg, slow) {
    if (this.dead) return;
    const p = this.p[k];
    p.getWorldPosition(_v1);
    const wp = _v1.clone();
    this.flash = 0.15;

    if (k === 'head' || k === 'torso' || k === 'core') {
      const m = (k === 'head') ? 1.5 : 1;
      this.takeDmg(dmg * m, slow);
      addDmgNum(wp, Math.floor(dmg * m));
    } else {
      p.userData.hp -= dmg;
      this.takeDmg(dmg * 0.3, slow);
      addDmgNum(wp, Math.floor(dmg * 0.3));
      if (p.userData.hp <= 0 && p.visible) {
        p.visible = false;
        this.bleed.push(p);
        spawnPart(wp, this.T.C, 6, 3);
        spawnPart(wp, 0x990000, 8, 4);
        const deps = { 'armLU': 'armLD', 'armRU': 'armRD', 'legLU': 'legLD', 'legRU': 'legRD' };
        if (deps[k] && this.p[deps[k]]) {
          const c = this.p[deps[k]];
          c.visible = false;
          c.getWorldPosition(_v2);
          spawnPart(_v2, this.T.C, 5, 3);
        }
        if (k.includes('leg') || k.includes('wing')) this.T.spd *= 0.5;
        if (this.finalBoss) {
          this.takeDmg(this.mhp * 0.05);
          addNotif("POINT FAIBLE DÉTRUIT!", "#ff0000");
          const organColor = p.material.color.getHex();
          spawnPart(wp, organColor, 40, 15);
          spawnPart(wp, 0xaa0000, 50, 18);
          const flashLight = new THREE.PointLight(0xffaaaa, 8, 30, 2);
          flashLight.position.copy(wp);
          scene.add(flashLight);
          setTimeout(() => scene.remove(flashLight), 180);
        }
      } else {
        spawnPart(wp, this.T.C, 3, 2);
      }
    }
  }

  takeDmg(dmg, slow = false, knock = 0, src = null) {
    if (this.dead) return;
    this.hp -= dmg;
    if (GameState.runTelemetry) GameState.runTelemetry.damageDealt = (GameState.runTelemetry.damageDealt || 0) + Math.max(0, dmg || 0);
    this.flash = 0.18;
    if (this.hp < this.mhp * GameState.pExec && !this.boss && !this.finalBoss) {
      this.hp = 0;
      addNotif('💀 EXÉCUTION!', '#ff0000');
    }
    if (slow) this.T = { ...this.T, spd: Math.max(0.2, this.T.spd * 0.5) };
    if (knock > 0 && src) {
      const dir = this.root.position.clone().sub(src).normalize();
      this.root.position.addScaledVector(dir, knock);
    }
    if (this.hp <= 0 && !this.dead) this.die();
  }

  die() {
    this.dead = true;
    this.dt = 0;
    this.deathFxApplied = false;
    GameState.pKills++;
    GameState.pScore += this.xpVal;
    
    // Money Drop
    const coins = Math.max(1, Math.floor(this.xpVal / 10 * (GameState.pGoldMult || 1)));
    GameState.saveData.money = (GameState.saveData.money || 0) + coins;
    
    if (Math.random() < GameState.pVamp) {
      GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + 5);
      addNotif('🩸 Vampirisme', '#ff0000');
    }
    
    updateQuest(this);
    if (this.finalBoss) {
      gameWin();
      return;
    }

    // XP reward is spawned first so card/chest visuals cannot suppress progression.
    try {
      xpOrbs.push(new XPOrb(this.root.position.clone(), this.xpVal));
    } catch (xpErr) {
      console.warn('XP orb spawn failed:', xpErr);
    }

    // Tiny physical card drops from mobs; elites/bosses get a slightly higher chance.
    const cardDropChance = this.boss ? 0.025 : (this.isElite ? 0.01 : 0.0015);
    if (typeof MobCardDrop === 'function' && Array.isArray(cardDrops) && Math.random() < cardDropChance) {
      try {
        cardDrops.push(new MobCardDrop(this.root.position.clone(), this.T || this.type || this));
      } catch (cardErr) {
        console.warn('Card drop spawn failed:', cardErr);
      }
    }

    document.getElementById('kills').innerHTML = `<i class="fa-solid fa-skull"></i> ${GameState.pKills}`;
    if (this.boss) {
      if (GameState.runTelemetry) GameState.runTelemetry.bossesKilled = (GameState.runTelemetry.bossesKilled || 0) + 1;
      addNotif('🏆 BOSS VAINCU! +300 XP', '#70e030');
    } else if (this.isElite) {
      if (GameState.runTelemetry) GameState.runTelemetry.elitesKilled = (GameState.runTelemetry.elitesKilled || 0) + 1;
    } else if ((GameState.pKills % 10) === 0) {
      // Throttle regular kill notifications to reduce UI churn during mob waves.
      addNotif(`💀 ${GameState.pKills} kills`, '#70e030');
    }
    if (this.boss) {
      GameState.bossAlive = false;
      document.getElementById('bossbar').style.display = 'none';
      const rewards = 1 + Math.floor(Math.random() * 3);
      if (typeof spawnWorldPickupAt === 'function') {
        spawnWorldPickupAt(this.root.position.clone(), { type: 'bossChest', rewards });
        addNotif(`🧰 Coffre de boss lâché (${rewards} amélioration${rewards > 1 ? 's' : ''})`, '#ffd37a');
      } else {
        // Safe fallback if pickup system is unavailable.
        GameState.pendingBossChestUpgrades = (GameState.pendingBossChestUpgrades || 0) + rewards;
        if (typeof showLevelUp === 'function' && !GameState.levelingUp && GameState.gameRunning) {
          setTimeout(() => showLevelUp(), 0);
        }
      }
    }
  }
}

