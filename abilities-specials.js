function specialVfxHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function getSpecialVfxProfile(cls, specialName) {
  const id = cls && cls.id ? cls.id : 'unknown';
  const key = `${id}|${specialName || 'special'}`;
  const seed = specialVfxHash(key);

  const palette = [
    0xff4d6d, 0xff8c42, 0xffd166, 0x6ee7b7, 0x38bdf8,
    0x818cf8, 0xc084fc, 0xf472b6, 0xfacc15, 0x22d3ee,
    0x34d399, 0xfb7185, 0xa3e635, 0xf59e0b, 0x60a5fa,
    0xe879f9, 0x2dd4bf, 0xf43f5e, 0x84cc16, 0x93c5fd
  ];
  const shapes = ['circle', 'diamond', 'tri', 'arrow', 'box'];

  const primary = palette[seed % palette.length];
  const secondary = palette[(seed >> 6) % palette.length];
  const tertiary = palette[(seed >> 12) % palette.length];

  return {
    primary,
    secondary,
    tertiary,
    shapeA: shapes[(seed >> 3) % shapes.length],
    shapeB: shapes[(seed >> 9) % shapes.length],
    burstCount: 16 + (seed % 22),
    ringCount: 6 + ((seed >> 5) % 8),
    burstSpeed: 2.6 + ((seed >> 11) % 24) / 10,
    orbitRadius: 1.0 + ((seed >> 14) % 16) / 10
  };
}

function spawnSpecialSignatureVfx(origin, dir, cls, specialName) {
  if (!origin) return;
  const profile = getSpecialVfxProfile(cls, specialName);
  const baseDir = (dir && typeof dir.clone === 'function') ? dir.clone().normalize() : new THREE.Vector3(0, 0, -1);
  const side = new THREE.Vector3(-baseDir.z, 0, baseDir.x).normalize();

  spawnPart(origin.clone(), profile.primary, profile.burstCount, profile.burstSpeed);
  spawnPart(origin.clone().add(new THREE.Vector3(0, 1.1, 0)), profile.secondary, Math.floor(profile.burstCount * 0.55), profile.burstSpeed * 0.7);

  for (let i = 0; i < profile.ringCount; i++) {
    const a = (i / profile.ringCount) * Math.PI * 2;
    const offset = side.clone().multiplyScalar(Math.cos(a) * profile.orbitRadius)
      .add(baseDir.clone().multiplyScalar(Math.sin(a) * profile.orbitRadius * 0.75));
    const p = origin.clone().add(offset).add(new THREE.Vector3(0, 0.3, 0));
    spawnPart(p, i % 2 === 0 ? profile.secondary : profile.tertiary, 4, 1.8);
  }

  // Non-damaging visual streaks to make each special instantly recognizable.
  if (typeof Proj === 'function' && Array.isArray(projectiles)) {
    const start = origin.clone().add(new THREE.Vector3(0, 1.0, 0));
    const d1 = baseDir.clone().add(side.clone().multiplyScalar(0.22)).normalize();
    const d2 = baseDir.clone().add(side.clone().multiplyScalar(-0.22)).normalize();
    projectiles.push(new Proj(start.clone(), d1, 0, profile.primary, 18, 0.35, { pierce: 0, scale: 0.5, shape: profile.shapeA }));
    projectiles.push(new Proj(start.clone(), d2, 0, profile.secondary, 18, 0.35, { pierce: 0, scale: 0.5, shape: profile.shapeB }));
  }
}

function getSpecialNotifProfile(cls, specialName) {
  const id = cls && cls.id ? cls.id : 'unknown';
  const key = `${id}|${specialName || 'special'}|notif`;
  const seed = specialVfxHash(key);
  const emojis = ['✨', '⚡', '🔥', '❄️', '🌙', '☀️', '🌀', '🛡️', '🗡️', '💀', '🌿', '🧪', '🎯', '🪨', '🕸️', '🌩️'];
  const colors = [
    '#7dd3fc', '#a78bfa', '#f472b6', '#f59e0b', '#34d399', '#f87171', '#22d3ee', '#facc15',
    '#fb7185', '#93c5fd', '#c4b5fd', '#2dd4bf', '#fda4af', '#a3e635', '#60a5fa', '#f97316'
  ];
  return {
    emoji: emojis[seed % emojis.length],
    color: colors[(seed >> 5) % colors.length]
  };
}

function spawnSpecialAfterTrail(origin, dir, cls, specialName) {
  if (!origin) return;
  const profile = getSpecialVfxProfile(cls, specialName);
  const baseDir = (dir && typeof dir.clone === 'function') ? dir.clone().normalize() : new THREE.Vector3(0, 0, -1);
  const side = new THREE.Vector3(-baseDir.z, 0, baseDir.x).normalize();

  for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
      if (!playerPivot || !playerPivot.position) return;
      const anchor = playerPivot.position.clone().add(new THREE.Vector3(0, 0.9, 0));
      const drift = side.clone().multiplyScalar((i % 2 === 0 ? 1 : -1) * (0.2 + i * 0.08));
      const ahead = baseDir.clone().multiplyScalar(0.15 * i);
      const p = anchor.add(drift).add(ahead);
      spawnPart(p, i % 2 === 0 ? profile.secondary : profile.primary, 8 + i, 1.4 + i * 0.2);

      if (typeof Proj === 'function' && Array.isArray(projectiles)) {
        const d = baseDir.clone().add(side.clone().multiplyScalar((i % 2 === 0 ? 0.15 : -0.15))).normalize();
        projectiles.push(new Proj(p.clone(), d, 0, profile.tertiary, 14, 0.22, { pierce: 0, scale: 0.35, shape: profile.shapeB }));
      }
    }, i * 130);
  }
}

// ==================== SPECIAL ABILITIES ====================
function triggerSpecial() {
  if (GameState.pSpecialCd > 0) return;
  
  const cls = GameState.pClass;
  const spec = cls.special;
  if (!spec) return;

  let used = false;
  const pp = playerPivot.position;
  const dir = fwd();

  switch (spec.name) {
        case 'Transfert': { // Mage (offensive rework)
          const impactDist = 11;
          const impactPos = pp.clone().addScaledVector(dir, impactDist);
          impactPos.y = terrainH(impactPos.x, impactPos.z) + 1.2;

          // Arcane lance projectile for immediate visual read.
          projectiles.push(new Proj(
          spawnPos(),
          dir.clone(),
          85,
          0x66eeff,
          42,
          1.1,
          { pierce: 3, blast: 2.6, scale: 1.25, shape: 'diamond' }
          ));

          // Arcane burst at impact point.
          spawnPart(impactPos.clone(), 0x66eeff, 42, 8.5);
          spawnPart(impactPos.clone().add(new THREE.Vector3(0, 1.2, 0)), 0xb799ff, 24, 5.5);
          addScreenShake(0.28);

          monsters.forEach(m => {
            if (!m.dead && m.root.position.distanceTo(impactPos) < 6.5) {
              m.takeDmg(55, true, 9, impactPos);
            }
          });

          addNotif("✨ Déflagration Arcanique", "#77ddff");
          used = true;
          break;
        }

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
          else if (r < 0.66) { addNotif("⭐ Lucky !", "#ffff00"); }
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
      spawnSpecialSignatureVfx(playerPivot.position.clone(), dir, cls, spec.name);
      spawnSpecialAfterTrail(playerPivot.position.clone(), dir, cls, spec.name);
      const notifStyle = getSpecialNotifProfile(cls, spec.name);
      addNotif(`${notifStyle.emoji} ${cls.name} • ${spec.name}`, notifStyle.color);
      GameState.pSpecialCd = spec.cd;
  }
}
