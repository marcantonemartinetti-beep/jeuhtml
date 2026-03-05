// ═══════════════════════════════════════════════
// DUNGEON WORLD - Main Game Logic
// ═══════════════════════════════════════════════

// ==================== THREE.JS GLOBALS ====================
var camYaw = 0, camPitch = 0;
var scene, camera, renderer, clock;
var playerPivot;
var sunLight, fillLight, skyMat, minimapCtx;
var groundTex;
var vm, vmModel, vmRecoil = 0;
var SPD = 7.5;
var playerModel, playerParts, playerTypeData;

// ==================== CONSTANTS ====================
const CHUNK_SZ = 60;
const DRAW_DIST = 2;
var GRAV = -22; // Changed to var for dynamic gravity

// ==================== CACHE ====================
var chunks = {};
var colliders = []; // Global collision boxes
var monsters = [];
var projectiles = [];
var particles = [];
var dmgNums = [];
var chests = [];
var xpOrbs = [];

// Sauvegarde de l'état initial des données pour la réinitialisation
const INITIAL_WEAPONS = JSON.parse(JSON.stringify(WEAPONS));
const INITIAL_PASSIVES = JSON.parse(JSON.stringify(PASSIVES));

const keys = {};
const mDown = {};
const keyState = { space: false };

let lastCX = null, lastCZ = null;

// Temp vectors
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _vMove = new THREE.Vector3();

// Shared geometries & materials
var GEOS = {
  box: new THREE.BoxGeometry(1, 1, 1),
  sphere: new THREE.SphereGeometry(1, 8, 8),
  quad: new THREE.PlaneGeometry(1, 1),
  cone: new THREE.ConeGeometry(1, 1, 8),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 8),
  oct: new THREE.OctahedronGeometry(1, 0),
  dodec: new THREE.DodecahedronGeometry(1, 0),
  torus: new THREE.TorusGeometry(1, 0.2, 8, 16),
  circle: new THREE.CircleGeometry(1, 16)
};

var MATS = {
  hpBg: new THREE.MeshBasicMaterial({ color: 0x300000, depthTest: false, side: THREE.DoubleSide }),
  hpFill: new THREE.MeshBasicMaterial({ color: 0xdd2020, depthTest: false, side: THREE.DoubleSide }),
  wire: new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
};

// ==================== TERRAIN ====================
function createChunk(cx, cz) {
  const S = 32;
  const geo = new THREE.PlaneGeometry(CHUNK_SZ, CHUNK_SZ, S, S);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position.array, cols = [];
  for (let i = 0; i < pos.length; i += 3) {
    const wx = pos[i] + cx, wz = pos[i + 2] + cz, h = terrainH(wx, wz);
    pos[i + 1] = h;
    const v = (h + 5) / 25 + noise2(wx * 0.2, wz * 0.2) * 0.1;
    cols.push(((GameState.pBiome.col >> 16) & 255) / 255 * v, ((GameState.pBiome.col >> 8) & 255) / 255 * v, (GameState.pBiome.col & 255) / 255 * v);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cols), 3));
  geo.computeVertexNormals();
  geo.attributes.position.needsUpdate = true;
  const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, map: groundTex }));
  m.receiveShadow = true;
  m.position.set(cx, 0, cz);

  // Scenery for this chunk
  const grp = new THREE.Group();
  grp.position.set(cx, 0, cz);
  populateChunk(grp, cx, cz);

  // Add Water for Islands
  if (['pirate', 'ocean'].includes(GameState.pBiome.id)) {
      const wGeo = new THREE.PlaneGeometry(CHUNK_SZ, CHUNK_SZ);
      wGeo.rotateX(-Math.PI/2);
      const wMat = new THREE.MeshBasicMaterial({color: 0x004488, transparent:true, opacity:0.7});
      const water = new THREE.Mesh(wGeo, wMat);
      water.position.y = -2;
      grp.add(water);
  }
  
  // Add Ceiling for Indoors
  if (['dungeon', 'crypt', 'mine', 'sewer', 'lab', 'library', 'museum', 'asylum', 'kitchen', 'core'].includes(GameState.pBiome.id)) {
      const cGeo = new THREE.PlaneGeometry(CHUNK_SZ, CHUNK_SZ);
      cGeo.rotateX(Math.PI/2);
      const cMat = new THREE.MeshBasicMaterial({color: 0x111111});
      const ceil = new THREE.Mesh(cGeo, cMat);
      ceil.position.y = 30;
      grp.add(ceil);
  }

  scene.add(m);
  scene.add(grp);
  return { m, grp };
}

function updateTerrain(px, pz) {
  const cx = Math.round(px / CHUNK_SZ), cz = Math.round(pz / CHUNK_SZ);
  const keep = new Set();
  for (let x = -DRAW_DIST; x <= DRAW_DIST; x++) {
    for (let z = -DRAW_DIST; z <= DRAW_DIST; z++) {
      const k = `${cx + x},${cz + z}`;
      keep.add(k);
      if (!chunks[k]) chunks[k] = createChunk((cx + x) * CHUNK_SZ, (cz + z) * CHUNK_SZ);
    }
  }
  for (const k in chunks) {
    if (!keep.has(k)) {
      scene.remove(chunks[k].m);
      scene.remove(chunks[k].grp);
      colliders = colliders.filter(c => c.chunkKey !== k);
      chunks[k].m.geometry.dispose();
      delete chunks[k];
    }
  }
}

// ==================== SCENERY ====================
function buildStructure(biome, t, x, z, h) {
  const g = new THREE.Group();
  g.position.set(x, h, z);
  const boxes = [];
  const addBox = (w, h, d, px, py, pz) => {
    boxes.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(px, py, pz), new THREE.Vector3(w, h, d)));
  };

  const mStone = new THREE.MeshLambertMaterial({ map: genTex(0x666666, 'stone') });
  const mWood = new THREE.MeshLambertMaterial({ map: genTex(0x5a4030, 'wood') });
  const mDark = new THREE.MeshLambertMaterial({ map: genTex(0x222222) });
  const mIce = new THREE.MeshLambertMaterial({ color: 0xaaddff, transparent: true, opacity: 0.8 });
  const mGold = new THREE.MeshLambertMaterial({ color: 0xffaa00 });
  const mBrick = new THREE.MeshLambertMaterial({ map: genTex(0x884444, 'stone') });
  const mWhite = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const mRed = new THREE.MeshLambertMaterial({ color: 0xaa2222 });
  const mRoof = new THREE.MeshLambertMaterial({ map: genTex(0x884444, 'stone') });

  if (biome === 'samurai') {
      if (t === 0) { // Torii Gate
          const h = 10, w = 8;
          const p1 = new THREE.Mesh(GEOS.cyl, mRed); p1.scale.set(1, h, 1); p1.position.set(-w/2, h/2, 0); g.add(p1);
          const p2 = new THREE.Mesh(GEOS.cyl, mRed); p2.scale.set(1, h, 1); p2.position.set(w/2, h/2, 0); g.add(p2);
          const top = new THREE.Mesh(GEOS.box, mRed); top.scale.set(w+4, 1, 1); top.position.set(0, h-1, 0); g.add(top);
          const top2 = new THREE.Mesh(GEOS.box, mDark); top2.scale.set(w+2, 0.8, 0.8); top2.position.set(0, h-3, 0); g.add(top2);
          addBox(w+2, h, 2, 0, h/2, 0);
      } else { // Pagoda
          const levels = 3;
          for(let i=0; i<levels; i++) {
              const s = 8 - i*2;
              const y = i*5;
              const b = new THREE.Mesh(GEOS.box, mWhite); b.scale.set(s, 4, s); b.position.y = y+2; g.add(b);
              const r = new THREE.Mesh(GEOS.cone, mDark); r.scale.set(s+2, 2, s+2); r.position.y = y+4.5; g.add(r);
              addBox(s, 4, s, 0, y+2, 0);
          }
      }
  } else if (biome === 'wildwest') {
      if (t === 0) { // Saloon
          const w = 10, h = 6, d = 8;
          const b = new THREE.Mesh(GEOS.box, mWood); b.scale.set(w, h, d); b.position.y = h/2; g.add(b);
          const front = new THREE.Mesh(GEOS.box, mWood); front.scale.set(w, h+3, 0.5); front.position.set(0, (h+3)/2, d/2); g.add(front);
          addBox(w, h, d, 0, h/2, 0);
      } else { // Water Tower
          const h = 10;
          const legs = new THREE.Group();
          for(let i=0; i<4; i++) {
              const l = new THREE.Mesh(GEOS.cyl, mWood); l.scale.set(0.5, h, 0.5);
              l.position.set((i%2?1:-1)*2, h/2, (i<2?1:-1)*2);
              legs.add(l);
          }
          g.add(legs);
          const tank = new THREE.Mesh(GEOS.cyl, mWood); tank.scale.set(3, 4, 3); tank.position.y = h+2; g.add(tank);
          addBox(4, h+4, 4, 0, h/2, 0);
      }
  } else if (biome === 'plains' || biome === 'farm') {
    if (t === 0) { // Château / Fort
      const w = 12, h = 8;
      const b = new THREE.Mesh(GEOS.box, mStone); b.scale.set(w, h, w); b.position.y = h/2; g.add(b); addBox(w, h, w, 0, h/2, 0);
      // Towers corners
      for(let i=0; i<4; i++) {
        const tx = (i%2===0?1:-1)*w/2, tz = (i<2?1:-1)*w/2;
        const tow = new THREE.Mesh(GEOS.cyl, mStone); tow.scale.set(2.5, h+4, 2.5); tow.position.set(tx, (h+4)/2, tz); g.add(tow);
        const roof = new THREE.Mesh(GEOS.cone, mRed); roof.scale.set(3.5, 3, 3.5); roof.position.set(tx, h+4+1.5, tz); g.add(roof);
      }
      // Gate
      const gate = new THREE.Mesh(GEOS.box, mDark); gate.scale.set(4, 5, 1); gate.position.set(0, 2.5, w/2+0.1); g.add(gate);
    } else if (t === 1) { // Moulin
      const b = new THREE.Mesh(GEOS.cyl, mWood); b.scale.set(3.5, 9, 3.5); b.position.y = 4.5; g.add(b); addBox(3.5, 9, 3.5, 0, 4.5, 0);
      const roof = new THREE.Mesh(GEOS.cone, mDark); roof.scale.set(4, 3, 4); roof.position.y = 10.5; g.add(roof);
      // Blades
      const blades = new THREE.Group(); blades.position.set(0, 8, 2.5);
      const b1 = new THREE.Mesh(GEOS.box, mWhite); b1.scale.set(14, 1, 0.2); blades.add(b1);
      const b2 = new THREE.Mesh(GEOS.box, mWhite); b2.scale.set(1, 14, 0.2); blades.add(b2);
      blades.rotation.z = Math.random(); // Static rotation
      g.add(blades);
    } else { // Barn
      const w = 10, h = 6, d = 14;
      const b = new THREE.Mesh(GEOS.box, mRed); b.scale.set(w, h, d); b.position.y = h/2; g.add(b);
      const roof = new THREE.Mesh(GEOS.cone, mDark); roof.scale.set(w*1.2, 4, d*1.2); roof.position.y = h+2; 
      g.add(roof);
      addBox(w, h, d, 0, h/2, 0);
    }
  } else if (biome === 'graveyard' || biome === 'crypt') {
    if (t === 0) { // Mausolée
      const b = new THREE.Mesh(GEOS.box, mStone); b.scale.set(6, 6, 8); b.position.y = 3; g.add(b); addBox(6, 6, 8, 0, 3, 0);
      const roof = new THREE.Mesh(GEOS.cyl, mDark); roof.scale.set(4, 8, 4); roof.position.y = 6; roof.rotation.z = Math.PI/2; g.add(roof);
      const cols = [-2.5, 2.5];
      cols.forEach(cx => {
          const c = new THREE.Mesh(GEOS.cyl, mStone); c.scale.set(0.8, 6, 0.8); c.position.set(cx, 3, 4.2); g.add(c);
      });
    } else { // Giant Tombstone
      const b = new THREE.Mesh(GEOS.box, mStone); b.scale.set(4, 8, 1.5); b.position.y = 4; g.add(b); addBox(4, 8, 1.5, 0, 4, 0);
      const top = new THREE.Mesh(GEOS.cyl, mStone); top.scale.set(2, 1.5, 2); top.position.set(0, 8, 0); top.rotation.x = Math.PI/2; g.add(top);
      const cross = new THREE.Mesh(GEOS.box, mDark); cross.scale.set(2, 3, 0.2); cross.position.set(0, 5, 0.8); g.add(cross);
      const crossH = new THREE.Mesh(GEOS.box, mDark); crossH.scale.set(1.5, 0.8, 0.2); crossH.position.set(0, 5.5, 0.8); g.add(crossH);
    }
  } else if (biome === 'desert') {
      if (t === 0) { // Pyramide
          const b = new THREE.Mesh(GEOS.cone, mStone); b.scale.set(16, 12, 16); b.position.y = 6; b.rotation.y = Math.PI/4; g.add(b); addBox(14, 12, 14, 0, 6, 0);
      } else if (t === 1) { // Sphinx-like
          const body = new THREE.Mesh(GEOS.box, mStone); body.scale.set(6, 4, 10); body.position.y = 2; g.add(body);
          const head = new THREE.Mesh(GEOS.sphere, mStone); head.scale.set(3, 3, 3); head.position.set(0, 5, 4); g.add(head);
          addBox(6, 6, 10, 0, 3, 0);
      } else { // Obelisk
          const b = new THREE.Mesh(GEOS.box, mStone); b.scale.set(2, 12, 2); b.position.y = 6; g.add(b);
          const top = new THREE.Mesh(GEOS.cone, mGold); top.scale.set(1.5, 2, 1.5); top.position.y = 13; g.add(top);
          addBox(2, 12, 2, 0, 6, 0);
      }
  } else if (biome === 'forest' || biome === 'jungle' || biome === 'fairy' || biome === 'hive') {
    if (t === 0) { // Giant Tree House
      const trunk = new THREE.Mesh(GEOS.cyl, mWood); trunk.scale.set(5, 20, 5); trunk.position.y = 10; g.add(trunk); addBox(5, 20, 5, 0, 10, 0);
      const house = new THREE.Mesh(GEOS.box, mWood); house.scale.set(8, 5, 8); house.position.y = 14; g.add(house);
      const leaves = new THREE.Mesh(GEOS.dodec, new THREE.MeshLambertMaterial({color: biome==='fairy'?0xffaaff:0x228822}));
      leaves.scale.set(14, 10, 14); leaves.position.y = 18; g.add(leaves);
    } else { // Ancient Ruin Arch
      const p1 = new THREE.Mesh(GEOS.box, mStone); p1.scale.set(2, 8, 2); p1.position.set(-3, 4, 0); g.add(p1);
      const p2 = new THREE.Mesh(GEOS.box, mStone); p2.scale.set(2, 8, 2); p2.position.set(3, 4, 0); g.add(p2);
      const top = new THREE.Mesh(GEOS.box, mStone); top.scale.set(10, 2, 3); top.position.set(0, 9, 0); g.add(top);
      addBox(8, 10, 3, 0, 5, 0);
    }
  } else if (biome === 'snow' || biome === 'storm') {
      if (t === 0) { // Ice Spire
          const b = new THREE.Mesh(GEOS.cone, mIce); b.scale.set(4, 20, 4); b.position.y = 10; g.add(b); addBox(4, 20, 4, 0, 10, 0);
          // Floating crystals around
          for(let i=0; i<3; i++) {
              const c = new THREE.Mesh(GEOS.oct, mIce); c.scale.set(1, 2, 1);
              c.position.set(Math.cos(i*2)*5, 8+i*3, Math.sin(i*2)*5);
              g.add(c);
          }
      } else { // Igloo Complex
          const main = new THREE.Mesh(GEOS.sphere, mIce); main.scale.set(6, 5, 6); main.position.y = 0; g.add(main); addBox(6, 5, 6, 0, 2.5, 0);
          const tunnel = new THREE.Mesh(GEOS.box, mIce); tunnel.scale.set(2, 2, 4); tunnel.position.set(0, 1, 5); g.add(tunnel);
      }
  } else if (biome === 'cyber' || biome === 'steampunk' || biome === 'clockwork' || biome === 'lab' || biome === 'alien' || biome === 'core') {
    if (t === 0) { // Skyscraper
      const h = 25 + Math.random()*15;
      const b = new THREE.Mesh(GEOS.box, mDark); b.scale.set(8, h, 8); b.position.y = h/2; g.add(b); addBox(8, h, 8, 0, h/2, 0);
      // Neon strips
      const n = new THREE.Mesh(GEOS.box, new THREE.MeshBasicMaterial({color: biome==='cyber'?0x00ff00:0xffaa00}));
      n.scale.set(8.2, h, 0.5); n.position.set(0, h/2, 4); g.add(n);
    } else if (t === 1) { // Factory Pipes
      const b = new THREE.Mesh(GEOS.box, mDark); b.scale.set(10, 6, 10); b.position.y = 3; g.add(b); addBox(10, 6, 10, 0, 3, 0);
      for(let i=0; i<3; i++) {
          const p = new THREE.Mesh(GEOS.cyl, mStone); p.scale.set(1, 10, 1); p.position.set(-3+i*3, 8, 0); g.add(p);
          // Smoke (static sphere)
          const s = new THREE.Mesh(GEOS.sphere, new THREE.MeshLambertMaterial({color:0x555555, transparent:true, opacity:0.6}));
          s.scale.set(2, 2, 2); s.position.set(-3+i*3, 14, 0); g.add(s);
      }
    } else { // Server/Machine
      const b = new THREE.Mesh(GEOS.box, mDark); b.scale.set(6, 8, 4); b.position.y = 4; g.add(b); addBox(6, 8, 4, 0, 4, 0);
      const screen = new THREE.Mesh(GEOS.quad, new THREE.MeshBasicMaterial({color:0x00ffff}));
      screen.scale.set(4, 3, 1); screen.position.set(0, 5, 2.1); g.add(screen);
    }
  } else if (biome === 'sky' || biome === 'heavens') {
      if (t === 0) { // Greek Temple
          const floor = new THREE.Mesh(GEOS.box, mWhite); floor.scale.set(12, 1, 16); floor.position.y = 0.5; g.add(floor);
          const roof = new THREE.Mesh(GEOS.cone, mWhite); roof.scale.set(10, 4, 10); roof.position.y = 8; roof.rotation.y = Math.PI/4; g.add(roof);
          for(let x=-4; x<=4; x+=4) for(let z=-6; z<=6; z+=4) {
              const c = new THREE.Mesh(GEOS.cyl, mWhite); c.scale.set(0.8, 6, 0.8); c.position.set(x, 3.5, z); g.add(c);
          }
          addBox(12, 10, 16, 0, 5, 0);
      } else { // Floating Ring
          const r = new THREE.Mesh(GEOS.torus, mGold); r.scale.set(6, 6, 6); r.position.y = 8; g.add(r);
          const base = new THREE.Mesh(GEOS.cone, mWhite); base.scale.set(4, 4, 4); base.position.y = 2; g.add(base);
          addBox(6, 12, 2, 0, 6, 0);
      }
  } else if (biome === 'ocean' || biome === 'atlantis' || biome === 'pirate' || biome === 'deep') {
      if (t === 0) { // Shipwreck
          const hull = new THREE.Mesh(GEOS.box, mWood); hull.scale.set(4, 4, 12); hull.position.set(0, 2, 0); hull.rotation.z = 0.2; hull.rotation.x = 0.1; g.add(hull);
          const mast = new THREE.Mesh(GEOS.cyl, mWood); mast.scale.set(0.5, 10, 0.5); mast.position.set(0, 6, 0); hull.add(mast);
          addBox(6, 6, 14, 0, 3, 0);
      } else { // Coral Arch
          const arch = new THREE.Mesh(GEOS.torus, new THREE.MeshLambertMaterial({color:0xff88aa}));
          arch.scale.set(5, 5, 5); arch.position.y = 4; g.add(arch);
          addBox(5, 8, 2, 0, 4, 0);
      }
  } else if (biome === 'candy' || biome === 'toy' || biome === 'circus') {
      if (t === 0) { // Circus Tent
          const tent = new THREE.Mesh(GEOS.cone, new THREE.MeshLambertMaterial({color:0xff0000}));
          tent.scale.set(10, 8, 10); tent.position.y = 4; g.add(tent);
          const top = new THREE.Mesh(GEOS.sphere, mGold); top.scale.set(1, 1, 1); top.position.y = 8; g.add(top);
          addBox(10, 8, 10, 0, 4, 0);
      } else { // Castle of Blocks
          const b1 = new THREE.Mesh(GEOS.box, new THREE.MeshLambertMaterial({color:0x0000ff})); b1.scale.set(4, 4, 4); b1.position.set(-2, 2, 0); g.add(b1);
          const b2 = new THREE.Mesh(GEOS.box, new THREE.MeshLambertMaterial({color:0x00ff00})); b2.scale.set(4, 4, 4); b2.position.set(2, 2, 0); g.add(b2);
          const b3 = new THREE.Mesh(GEOS.box, new THREE.MeshLambertMaterial({color:0xff0000})); b3.scale.set(4, 4, 8); b3.position.set(0, 6, 0); g.add(b3);
          addBox(8, 8, 8, 0, 4, 0);
      }
  } else if (biome === 'kitchen') {
      if (t === 0) { // Giant Table
          const leg1 = new THREE.Mesh(GEOS.box, mWood); leg1.scale.set(1, 8, 1); leg1.position.set(-4, 4, -4); g.add(leg1);
          const leg2 = new THREE.Mesh(GEOS.box, mWood); leg2.scale.set(1, 8, 1); leg2.position.set(4, 4, -4); g.add(leg2);
          const leg3 = new THREE.Mesh(GEOS.box, mWood); leg3.scale.set(1, 8, 1); leg3.position.set(-4, 4, 4); g.add(leg3);
          const leg4 = new THREE.Mesh(GEOS.box, mWood); leg4.scale.set(1, 8, 1); leg4.position.set(4, 4, 4); g.add(leg4);
          const top = new THREE.Mesh(GEOS.box, mWood); top.scale.set(12, 1, 12); top.position.y = 8.5; g.add(top);
          addBox(10, 8, 10, 0, 4, 0);
      } else { // Giant Fridge
          const b = new THREE.Mesh(GEOS.box, mWhite); b.scale.set(6, 12, 6); b.position.y = 6; g.add(b); addBox(6, 12, 6, 0, 6, 0);
      }
  } else if (biome === 'library' || biome === 'museum') {
      if (t === 0) { // Bookshelf / Display Case
          const b = new THREE.Mesh(GEOS.box, mWood); b.scale.set(8, 10, 2); b.position.y = 5; g.add(b); addBox(8, 10, 2, 0, 5, 0);
      } else { // Pillar
          const c = new THREE.Mesh(GEOS.cyl, mStone); c.scale.set(2, 12, 2); c.position.y = 6; g.add(c); addBox(2, 12, 2, 0, 6, 0);
      }
  } else if (biome === 'music') {
      if (t === 0) { // Giant Drum
          const b = new THREE.Mesh(GEOS.cyl, mRed); b.scale.set(6, 4, 6); b.position.y = 2; g.add(b); addBox(6, 4, 6, 0, 2, 0);
      } else { // Metronome shape
          const b = new THREE.Mesh(GEOS.cone, mWood); b.scale.set(4, 10, 4); b.position.y = 5; g.add(b); addBox(4, 10, 4, 0, 5, 0);
      }
  } else if (biome === 'asylum') {
      if (t === 0) { // Cell Block
          const b = new THREE.Mesh(GEOS.box, mWhite); b.scale.set(8, 6, 8); b.position.y = 3; g.add(b); addBox(8, 6, 8, 0, 3, 0);
          for(let i=-3; i<=3; i+=1.5) { const bar = new THREE.Mesh(GEOS.cyl, mDark); bar.scale.set(0.2, 6, 0.2); bar.position.set(i, 3, 4.1); g.add(bar); }
      } else { // Watchtower
          const b = new THREE.Mesh(GEOS.box, mBrick); b.scale.set(4, 12, 4); b.position.y = 6; g.add(b); addBox(4, 12, 4, 0, 6, 0);
      }
  } else if (biome === 'prehistoric') {
      if (t === 0) { // Cave Entrance
          const b = new THREE.Mesh(GEOS.sphere, mStone); b.scale.set(8, 6, 8); b.position.y = 0; g.add(b); addBox(8, 6, 8, 0, 3, 0);
      } else { // Giant Bone Rib
          const b = new THREE.Mesh(GEOS.torus, mWhite); b.scale.set(4, 4, 4); b.position.y = 0; b.rotation.x = Math.PI/2; g.add(b);
          addBox(8, 4, 2, 0, 2, 0);
      }
  } else if (biome === 'void' || biome === 'chaos' || biome === 'shadow' || biome === 'omega' || biome === 'abyss' || biome === 'warp') {
    if (t === 0) { // Monolithe
      const b = new THREE.Mesh(GEOS.box, mDark);
      b.scale.set(2, 15, 2);
      b.position.y = 7.5;
      g.add(b);
      addBox(2, 15, 2, 0, 7.5, 0);
    } else if (t === 1) { // Cube
      const b = new THREE.Mesh(GEOS.box, mDark);
      b.scale.set(4, 4, 4);
      b.position.y = 6;
      g.add(b);
      addBox(4, 4, 4, 0, 6, 0);
    } else { // Spire
      const b = new THREE.Mesh(GEOS.cone, mDark);
      b.scale.set(3, 12, 3);
      b.position.y = 6;
      b.rotation.x = Math.PI;
      g.add(b);
      addBox(3, 12, 3, 0, 6, 0);
    }
  } else if (biome === 'crystal') {
    if (t === 0) { // Grand Cristal
      const b = new THREE.Mesh(GEOS.oct, mIce); b.scale.set(4, 10, 4); b.position.y = 5; g.add(b); addBox(4, 10, 4, 0, 5, 0);
    } else if (t === 1) { // Cluster
      const b = new THREE.Mesh(GEOS.dodec, mIce); b.scale.set(6, 6, 6); b.position.y = 3; g.add(b); addBox(6, 6, 6, 0, 3, 0);
    } else { // Spire
      const b = new THREE.Mesh(GEOS.cone, mIce); b.scale.set(2, 12, 2); b.position.y = 6; g.add(b); addBox(2, 12, 2, 0, 6, 0);
    }
  } else if (biome === 'web') {
    if (t === 0) { // Giant Web
      for(let i=0; i<8; i++) {
        const strand = new THREE.Mesh(GEOS.cyl, mWhite); strand.scale.set(0.1, 15, 0.1); strand.rotation.z = i/8 * Math.PI; g.add(strand);
      }
      addBox(15, 1, 15, 0, 0, 0);
    }
  } else { // Default (Swamp, Magma, Ocean)
    if (t === 0) { // Tower
      const b = new THREE.Mesh(GEOS.cyl, mStone); b.scale.set(3, 12, 3); b.position.y = 6; g.add(b); addBox(3, 12, 3, 0, 6, 0);
      const top = new THREE.Mesh(GEOS.cone, mDark); top.scale.set(4, 4, 4); top.position.y = 14; g.add(top);
    } else { // Ruins
      const w1 = new THREE.Mesh(GEOS.box, mStone); w1.scale.set(6, 4, 1); w1.position.set(0, 2, -3); g.add(w1);
      const w2 = new THREE.Mesh(GEOS.box, mStone); w2.scale.set(1, 6, 6); w2.position.set(-3, 3, 0); g.add(w2);
      addBox(6, 6, 6, 0, 3, 0);
    }
  }
  return { mesh: g, colliders: boxes };
}

function populateChunk(grp, cx, cz) {
  // Structures
  let hasStruct = false;
  let structChance = 0.85;
  if (GameState.pBiome.id === 'cyber' || GameState.pBiome.id === 'steampunk' || GameState.pBiome.id === 'clockwork' || GameState.pBiome.id === 'lab' || GameState.pBiome.id === 'asylum' || GameState.pBiome.id === 'museum') structChance = 0.7;
  if (GameState.pBiome.id === 'desert' || GameState.pBiome.id === 'snow') structChance = 0.92;

  if (hash(cx * 0.07 + cz * 0.07) > structChance) {
    hasStruct = true;
    const type = Math.floor(hash(cx + cz) * 3);
    const h = terrainH(cx, cz);
    const { mesh, colliders: boxes } = buildStructure(GameState.pBiome.id, type, 0, 0, h);
    grp.add(mesh);
    boxes.forEach(b => {
      b.translate(new THREE.Vector3(cx, h, cz));
      colliders.push({ box: b, chunkKey: `${Math.round(cx / CHUNK_SZ)},${Math.round(cz / CHUNK_SZ)}` });
    });
  }

  // Biome specific scenery
  let treeType = 'tree', treeCol = 0x228822, rockCol = 0x777777, grassCol = 0x44aa44;
  let hasGrass = true;

  if (GameState.pBiome.id === 'plains' || GameState.pBiome.id === 'farm') { treeType = 'tree'; treeCol = 0x228822; }
  else if (GameState.pBiome.id === 'desert' || GameState.pBiome.id === 'wildwest') { treeType = 'cactus'; treeCol = 0x66aa44; rockCol = 0xaa8866; hasGrass = false; }
  else if (GameState.pBiome.id === 'forest' || GameState.pBiome.id === 'jungle') { treeType = 'dead'; treeCol = 0x332211; rockCol = 0x444444; grassCol = 0x223322; }
  else if (GameState.pBiome.id === 'snow' || GameState.pBiome.id === 'storm') { treeType = 'pine'; treeCol = 0xddeeff; rockCol = 0xaaccdd; grassCol = 0xffffff; }
  else if (GameState.pBiome.id === 'swamp' || GameState.pBiome.id === 'sewer') { treeType = 'dead'; treeCol = 0x223322; rockCol = 0x334433; grassCol = 0x445533; }
  else if (GameState.pBiome.id === 'hive') { treeType = 'dead'; treeCol = 0xaa8800; rockCol = 0x664400; grassCol = 0xaa8800; }
  else if (GameState.pBiome.id === 'dungeon' || GameState.pBiome.id === 'prison' || GameState.pBiome.id === 'mine' || GameState.pBiome.id === 'library' || GameState.pBiome.id === 'asylum' || GameState.pBiome.id === 'museum') { treeType = 'pillar'; treeCol = 0x555555; rockCol = 0x333333; hasGrass = false; }
  else if (GameState.pBiome.id === 'magma' || GameState.pBiome.id === 'volcano' || GameState.pBiome.id === 'core') { treeType = 'rock'; treeCol = 0x441111; rockCol = 0x220000; hasGrass = false; }
  else if (GameState.pBiome.id === 'ruins' || GameState.pBiome.id === 'prehistoric' || GameState.pBiome.id === 'samurai') { treeType = 'pillar'; treeCol = 0x777788; rockCol = 0x555566; hasGrass = false; }
  else if (GameState.pBiome.id === 'void' || GameState.pBiome.id === 'shadow' || GameState.pBiome.id === 'abyss' || GameState.pBiome.id === 'warp') { treeType = 'crystal'; treeCol = 0xaa00ff; rockCol = 0x110022; hasGrass = false; }
  else if (GameState.pBiome.id === 'chaos' || GameState.pBiome.id === 'omega') { treeType = 'crystal'; treeCol = 0xff0000; rockCol = 0x330000; hasGrass = false; }
  else if (GameState.pBiome.id === 'crystal') { treeType = 'crystal'; treeCol = 0x00ffff; rockCol = 0xaa00ff; hasGrass = false; }
  else if (GameState.pBiome.id === 'cyber' || GameState.pBiome.id === 'steampunk' || GameState.pBiome.id === 'clockwork' || GameState.pBiome.id === 'lab') { treeType = 'tech'; treeCol = GameState.pBiome.id==='steampunk'?0xffaa00:0x00ff00; rockCol = 0x111111; hasGrass = false; }
  else if (GameState.pBiome.id === 'alien') { treeType = 'organic'; treeCol = 0x440088; rockCol = 0x220044; hasGrass = false; }
  else if (GameState.pBiome.id === 'sky' || GameState.pBiome.id === 'heavens') { treeType = 'tree'; treeCol = 0xffd700; rockCol = 0xffffff; grassCol = 0xffffee; }
  else if (GameState.pBiome.id === 'ocean' || GameState.pBiome.id === 'atlantis' || GameState.pBiome.id === 'pirate' || GameState.pBiome.id === 'deep') { treeType = 'coral'; treeCol = 0xff8844; rockCol = 0x444444; grassCol = 0x004488; }
  else if (GameState.pBiome.id === 'graveyard' || GameState.pBiome.id === 'crypt') { treeType = 'tombstone'; treeCol = 0x666666; rockCol = 0x444444; grassCol = 0x223322; }
  else if (GameState.pBiome.id === 'web') { treeType = 'dead'; treeCol = 0xeeeeee; rockCol = 0xcccccc; grassCol = 0xaaaaaa; }
  else if (GameState.pBiome.id === 'candy' || GameState.pBiome.id === 'toy' || GameState.pBiome.id === 'circus' || GameState.pBiome.id === 'fairy' || GameState.pBiome.id === 'kitchen' || GameState.pBiome.id === 'music') { treeType = 'tree'; treeCol = 0xff66aa; rockCol = 0xffccdd; grassCol = 0xffaaff; }

  const tMat = new THREE.SpriteMaterial({ map: getSceneryTex(treeType, treeCol) });
  const rMat = new THREE.SpriteMaterial({ map: getSceneryTex(GameState.pBiome.id === 'void' || GameState.pBiome.id === 'chaos' ? 'crystal' : 'rock', rockCol) });
  const gMat = hasGrass ? new THREE.SpriteMaterial({ map: getSceneryTex('grass', grassCol), depthWrite: false }) : null;

  // Trees
  for (let i = 0; i < 12; i++) {
    const h1 = hash(cx * 0.1 + cz * 0.3 + i * 13.1), h2 = hash(cx * 0.4 - cz * 0.2 + i * 7.7);
    const lx = (h1 - 0.5) * CHUNK_SZ * 0.9, lz = (h2 - 0.5) * CHUNK_SZ * 0.9;
    if (hasStruct && lx * lx + lz * lz < 60) continue;
    const h = terrainH(cx + lx, cz + lz);
    const s = 6 + hash(i) * 4;
    const sp = new THREE.Sprite(tMat);
    sp.center.set(0.5, 0);
    sp.position.set(lx, h, lz);
    sp.scale.set(s, s, 1);
    grp.add(sp);
  }

  // Rocks
  for (let i = 0; i < 8; i++) {
    const h1 = hash(cx * 0.2 + cz * 0.1 + i * 5.1), h2 = hash(cx * 0.3 - cz * 0.4 + i * 2.7);
    const lx = (h1 - 0.5) * CHUNK_SZ * 0.9, lz = (h2 - 0.5) * CHUNK_SZ * 0.9;
    if (hasStruct && lx * lx + lz * lz < 50) continue;
    const h = terrainH(cx + lx, cz + lz);
    const s = 1 + hash(i) * 1.5;
    const sp = new THREE.Sprite(rMat);
    sp.center.set(0.5, 0);
    sp.position.set(lx, h, lz);
    sp.scale.set(s, s, 1);
    grp.add(sp);
  }

  // Grass
  if (gMat) {
    for (let i = 0; i < 250; i++) {
      const h1 = hash(cx * 0.2 - cz * 0.1 + i * 3.3), h2 = hash(cx * 0.1 + cz * 0.2 + i * 9.1);
      const lx = (h1 - 0.5) * CHUNK_SZ, lz = (h2 - 0.5) * CHUNK_SZ;
      if (hasStruct && lx * lx + lz * lz < 40) continue;
      const h = terrainH(cx + lx, cz + lz);
      const sp = new THREE.Sprite(gMat);
      sp.center.set(0.5, 0);
      sp.position.set(lx, h, lz);
      sp.scale.set(1.2, 1.2, 1);
      grp.add(sp);
    }
  }
}

// Export game state and functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameState, createChunk, updateTerrain, buildStructure, populateChunk };
}

// ==================== MISSING CORE FUNCTIONS ====================

// Spawning
let spawnTimer = 6;
let chestTimer = 15;

// Fonction manquante pour les tremblements d'écran
window.addScreenShake = function(amount) {
  // Implémentation simple ou vide pour éviter le crash
  // camPitch += (Math.random() - 0.5) * amount;
};

window.checkBossUnlocks = function() {
  let newUnlock = false;
  CLASSES.forEach(c => {
    if (c.linkedBiome && !GameState.saveData.unlockedClasses.includes(c.id)) {
      const b = BIOMES.find(x => x.id === c.linkedBiome);
      if (b) {
        const allMobs = [...b.mobs, b.boss];
        const hasAll = allMobs.every(m => GameState.saveData.cards.includes(m));
        if (hasAll) {
          GameState.saveData.unlockedClasses.push(c.id);
          addNotif(`🔓 Personnage débloqué: ${c.name}`, '#00ff00');
          newUnlock = true;
        }
      }
    }
  });
  if (newUnlock && window.saveGame) window.saveGame();
};

function doSpawn() {
  if (GameState.finalBossSpawned) return;
  const pp = playerPivot.position, n = 2 + Math.floor(GameState.pT / 20);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, d = 26 + Math.random() * 14;
    monsters.push(new Monster(pp.x + Math.cos(a) * d, pp.z + Math.sin(a) * d));
  }
}

function checkBoss() {
  if (!GameState.finalBossSpawned && GameState.pT >= 300) {
    GameState.finalBossSpawned = true;
    GameState.bossAlive = true;
    monsters.forEach(m => scene.remove(m.root));
    monsters = [];
    const pp = playerPivot.position, a = camYaw, d = 50;
    const bossName = GameState.pBiome ? GameState.pBiome.boss : 'Adam';
    const bossIdx = MTYPES.findIndex(m => m.name === bossName);
    const boss = new Monster(pp.x + Math.cos(a) * d, pp.z + Math.sin(a) * d, bossIdx !== -1 ? bossIdx : (MTYPES.length - 1));
    boss.makeFinalBoss();
    monsters.push(boss);
    document.getElementById('bossbar').style.display = 'block';
    document.getElementById('bossname').textContent = boss.T.name.toUpperCase();
    addNotif('⚠ ' + boss.T.name.toUpperCase() + ' EST ARRIVÉ !', '#ff0000');
  } else if (!GameState.bossAlive && !GameState.finalBossSpawned && GameState.pKills >= GameState.nextBossKills) {
    GameState.nextBossKills += 15;
    GameState.bossAlive = true;
    const pp = playerPivot.position, a = camYaw, d = 34;
    const boss = new Monster(pp.x + Math.cos(a) * d, pp.z + Math.sin(a) * d, 3);
    boss.makeBoss();
    monsters.push(boss);
    document.getElementById('bossbar').style.display = 'block';
    addNotif('⚠ BOSS APPROCHE!', '#ff2020');
  }
}

// ==================== DAY/NIGHT ====================
function updateDayNight(dt) {
  if (!skyMat) return;
  if (GameState.finalBossSpawned) {
    const bloodTop = new THREE.Color(0x2a0505), bloodBot = new THREE.Color(0x8a1a1a);
    const bloodFog = new THREE.Color(0x4a1a1a);
    skyMat.uniforms.tC.value.lerp(bloodTop, dt * 0.8);
    skyMat.uniforms.bC.value.lerp(bloodBot, dt * 0.8);
    scene.fog.color.lerp(bloodFog, dt * 0.8);
    renderer.setClearColor(scene.fog.color);
    sunLight.color.lerp(new THREE.Color(0xff3333), dt * 0.8);
    sunLight.intensity += (1.2 - sunLight.intensity) * dt * 0.8;
    return;
  }
  sunLight.position.set(50, 100, 40);
  sunLight.intensity = 1.1;
  fillLight.intensity = 0.3;
  sunLight.color.setHex(0xffe8cc);
  skyMat.uniforms.tC.value.setHex(0x1a3a6a);
  skyMat.uniforms.bC.value.setHex(GameState.pBiome ? GameState.pBiome.fog : 0x7ab0d8);
  if (GameState.pBiome) {
    scene.fog.color.setHex(GameState.pBiome.fog);
    renderer.setClearColor(GameState.pBiome.fog);
  }
}

// ==================== XP ====================
function addXP(n) {
  GameState.pXP += n;
  const oldLvl = GameState.pLevel;
  GameState.pLevel = 1 + Math.floor(GameState.pXP / 500);
  if (GameState.pLevel > oldLvl) {
    GameState.pMaxHP = 100 + (GameState.pLevel - 1) * 20;
    GameState.pHP = GameState.pMaxHP;
    const r = 1.1, rc = 0.95;
    
    // Upgrade active weapon
    for (const k in WEAPONS) {
        if (WEAPONS[k].active) {
            WEAPONS[k].dmg *= r; WEAPONS[k].maxCd *= rc; WEAPONS[k].level++;
        }
    }
    updateWeaponVisuals();
    showLevelUp();
  }
  const xpFill = document.getElementById('xpfill');
  if (xpFill) xpFill.style.width = ((GameState.pXP % 500) / 500 * 100) + '%';
}

// ==================== GAME OVER / WIN ====================
function gameOver() {
  GameState.gameRunning = false;
  document.exitPointerLock();
  document.getElementById('hud').style.display = 'none';
  document.getElementById('overlay').style.display = 'flex';
  document.getElementById('overlay').innerHTML = '<h1 style="color:#aa2020;font-size:clamp(2em,6vw,4em)">GAME OVER</h1><div class="divider"></div><p style="color:#8a6a4a">Score: ' + Math.floor(GameState.pScore) + ' · Tués: ' + GameState.pKills + ' · Niveau: ' + GameState.pLevel + '</p><button id="startBtn" onclick="location.reload()">↺ RECOMMENCER</button>';
}

function gameWin() {
  GameState.gameRunning = false;
  document.exitPointerLock();
  document.getElementById('hud').style.display = 'none';
  document.getElementById('overlay').style.display = 'flex';
  document.getElementById('overlay').innerHTML = '<h1 style="color:#f0c030;font-size:clamp(2em,6vw,4em)">VICTOIRE !</h1><div class="divider"></div><p style="color:#e0e0e0">Adam a été vaincu.</p><p style="color:#8a6a4a">Score: ' + Math.floor(GameState.pScore) + ' · Temps: ' + Math.floor(GameState.pT / 60) + 'm ' + Math.floor(GameState.pT % 60) + 's</p><button id="startBtn" onclick="location.reload()">↺ REJOUER</button>';
  
  if (!GameState.saveData.wins) GameState.saveData.wins = {};
  if (!GameState.saveData.wins[GameState.pClass.id]) GameState.saveData.wins[GameState.pClass.id] = [];
  if (!GameState.saveData.wins[GameState.pClass.id].includes(GameState.pBiome.id)) GameState.saveData.wins[GameState.pClass.id].push(GameState.pBiome.id);
  
  // Unlock Next Biome
  const currentBiomeIdx = BIOMES.findIndex(b => b.id === GameState.pBiome.id);
  if (currentBiomeIdx !== -1 && currentBiomeIdx < BIOMES.length - 1) {
    const nextBiome = BIOMES[currentBiomeIdx + 1];
    if (!GameState.saveData.unlockedBiomes.includes(nextBiome.id)) {
      GameState.saveData.unlockedBiomes.push(nextBiome.id);
      addNotif(`🔓 Monde débloqué: ${nextBiome.name}`, '#00ff00');
    }
  }

  // Unlock Classes
  CLASSES.forEach(c => {
    if (c.unlockReq && !GameState.saveData.unlockedClasses.includes(c.id)) {
      if (c.unlockReq.includes(GameState.pClass.name)) {
         GameState.saveData.unlockedClasses.push(c.id);
         addNotif(`🔓 Classe débloquée: ${c.name}`, '#00ff00');
      }
    }
  });

  saveGame();
}

function saveGame() {
  try { localStorage.setItem('dw_save', JSON.stringify(GameState.saveData)); } catch(e) { console.error("Save failed", e); }
}

function loadGame() {
  try {
    const data = JSON.parse(localStorage.getItem('dw_save'));
    if (data) GameState.saveData = { ...GameState.saveData, ...data };
  } catch(e) {}
}

// ==================== START GAME ====================
window.startGame = function() {
 try {
  if (window.event) window.event.stopPropagation(); // Empêche le clic de traverser
  if (!renderer) init(); // Safety check
  GameState.pClass = CLASSES[GameState.selCharIdx];
  
  GameState.thirdPerson = false; // Default to 1st person

  // Read Modifiers
  GameState.modX2 = document.getElementById('mod_x2') ? document.getElementById('mod_x2').checked : false;
  GameState.modHC = document.getElementById('mod_hc') ? document.getElementById('mod_hc').checked : false;
  GameState.modChaos = document.getElementById('mod_chaos') ? document.getElementById('mod_chaos').checked : false;

  GameState.pBiome = BIOMES[GameState.selMapIdx];
  GameState.pMaxHP = GameState.pHP = GameState.pClass.hp;
  
  if (GameState.modHC) {
      GameState.pMaxHP = 1;
      GameState.pHP = 1;
  }

  setTerrainBiome(GameState.pBiome.id);
  
  // Apply Perm Upgrades
  GameState.pDmgMult = 1.0;
  GameState.pGoldMult = 1.0;
  GameState.pSpdMult = 1.0;
  
  if (GameState.saveData.permUpgrades) {
      PERM_UPGRADES.forEach(u => {
          if (GameState.saveData.permUpgrades[u.id]) {
              const lvl = GameState.saveData.permUpgrades[u.id];
              if (lvl > 0) {
                  if (u.stat === 'pMaxHP') { GameState.pMaxHP += u.val * lvl; GameState.pHP += u.val * lvl; }
                  else if (u.stat === 'dmgMult') GameState.pDmgMult += u.val * lvl;
                  else if (u.stat === 'goldMult') GameState.pGoldMult += u.val * lvl;
                  else if (u.stat === 'pRegen') GameState.pRegen += u.val * lvl;
                  else if (u.stat === 'pDmgRed') GameState.pDmgRed += u.val * lvl;
                  else if (u.stat === 'pLuck') GameState.pLuck += u.val * lvl;
                  else if (u.stat === 'spdMult') GameState.pSpdMult += u.val * lvl;
              }
          }
      });
  }
  
  // Gravity Logic
  if (['sky', 'heavens', 'void', 'alien', 'moon', 'space', 'warp'].includes(GameState.pBiome.id)) {
      GRAV = -8;
      addNotif("🌌 Gravité faible !", "#aaaaff");
  } else {
      GRAV = -22;
  }

  GameState.galleryMode = false;
  GameState.levelingUp = false;
  GameState.gameRunning = true;
  GameState.paused = false;
  GameState.playerUpgrades = {};
  
  // Reset terrain to ensure it generates in the current scene
  for (const k in chunks) {
    if (chunks[k].m) scene.remove(chunks[k].m);
    if (chunks[k].grp) scene.remove(chunks[k].grp);
  }
  chunks = {};
  colliders = [];
  lastCX = null; lastCZ = null;

  // Clear existing entities from scene
  monsters.forEach(m => scene.remove(m.root));
  projectiles.forEach(p => scene.remove(p.m));
  particles.forEach(p => scene.remove(p.m));
  dmgNums.forEach(d => scene.remove(d.sp));
  chests.forEach(c => scene.remove(c.m));
  xpOrbs.forEach(o => scene.remove(o.m));

  // Reset lists
  monsters = [];
  projectiles = [];
  particles = [];
  dmgNums = [];
  chests = [];
  xpOrbs = [];
  // Note: colliders et chunks sont gérés par updateTerrain
  spawnTimer = 6;
  chestTimer = 15;

  updateUpgradesHUD();
  GameState.pBleedChance = 0;
  GameState.pKnockback = 0;
  GameState.pGambler = false;
  GameState.pWindwalker = false;
  GameState.pTank = false;
  GameState.pAssassin = false;
  GameState.nextBossKills = 15;
  GameState.pVelY = 0; // Reset vertical velocity
  SPD = GameState.pClass.spd * GameState.pSpdMult;
  GameState.pT = 0;
  GameState.pScore = 0;
  GameState.pKills = 0;
  GameState.pXP = 0;
  GameState.pLevel = 1;
  GameState.pSpecialCd = 0; // Cooldown capacité spéciale
  GameState.pVelX = 0; // Vitesse X (Physique)
  GameState.pVelZ = 0; // Vitesse Z (Physique)

  // Reset Player Position (Spawn)
  let sx = 0, sz = 0;
  // Si c'est un biome type "îles flottantes", on cherche un sol
  if (['sky', 'heavens', 'void', 'chaos', 'warp', 'shadow', 'candy'].includes(GameState.pBiome.id)) {
      let angle = 0, radius = 0;
      for(let i=0; i<100; i++) {
          const h = terrainH(sx, sz);
          if(h > -50) break; // Sol trouvé !
          angle += 0.5;
          radius += 5;
          sx = Math.cos(angle) * radius;
          sz = Math.sin(angle) * radius;
      }
  }
  playerPivot.position.set(sx, terrainH(sx, sz) + 1.7, sz);
  playerPivot.rotation.set(0, 0, 0);
  camYaw = 0; camPitch = 0; // Reset camera angles

  // Nettoyage des visuels des passifs de la partie précédente
  if (PASSIVES.orb.meshes) PASSIVES.orb.meshes.forEach(m => scene.remove(m));
  if (PASSIVES.shield.meshes) PASSIVES.shield.meshes.forEach(m => scene.remove(m));
  if (PASSIVES.turret.meshes) PASSIVES.turret.meshes.forEach(t => scene.remove(t.m));
  if (PASSIVES.poison.pools) PASSIVES.poison.pools.forEach(p => { scene.remove(p.m); if(p.m.geometry) p.m.geometry.dispose(); if(p.m.material) p.m.material.dispose(); });
  if (PASSIVES.aura.mesh) scene.remove(PASSIVES.aura.mesh);

  // Réinitialisation complète des Armes depuis la sauvegarde
  for (const k in WEAPONS) {
    if (INITIAL_WEAPONS[k]) {
        Object.assign(WEAPONS[k], JSON.parse(JSON.stringify(INITIAL_WEAPONS[k])));
    }
    WEAPONS[k].active = false;
  }
  // Réinitialisation complète des Passifs depuis la sauvegarde
  for (const k in PASSIVES) {
    if (INITIAL_PASSIVES[k]) {
        Object.assign(PASSIVES[k], JSON.parse(JSON.stringify(INITIAL_PASSIVES[k])));
    }
  }

  // Reset Class Flags
  GameState.pSniper = false;
  GameState.pBrawler = false;

  // Class Bonuses
  switch (GameState.pClass.id) {
    case 'mage': GameState.pXpMult += 0.2; break;
    case 'knight': GameState.pDmgRed += 0.1; break;
    case 'ninja': GameState.pDodge += 0.15; GameState.pDashCdMult *= 0.8; break;
    case 'paladin': GameState.pDmgRed += 0.2; GameState.pThorns += 10; break;
    case 'necro': GameState.pVamp += 0.05; break;
    case 'barbarian': GameState.pLowHpDmg += 0.5; GameState.pBrawler = true; break;
    case 'ranger': GameState.pCritDmg += 0.5; break;
    case 'rogue': GameState.pExec += 0.12; break;
    case 'lancer': GameState.pArea *= 1.25; break;
    case 'pirate': GameState.pLuck *= 1.4; break;
    case 'voidmage': GameState.pArea *= 1.2; break;
    case 'druid': GameState.pRegen += 1.0; break;
    case 'samurai': GameState.pLuck *= 2.0; break;
    case 'gladiator': GameState.pMaxJumps += 1; break;
    case 'hunter': GameState.pPickupRange *= 1.6; GameState.pLuck *= 1.2; break;
    case 'crusader': GameState.pArea *= 1.3; GameState.pMaxHP += 40; break;
    case 'engineer': PASSIVES.turret.active = true; PASSIVES.turret.count = 1; break;
    case 'monk': GameState.pKnockback += 2.0; GameState.pDodge += 0.1; break;
    case 'alchemist': PASSIVES.poison.active = true; PASSIVES.poison.level = 1; break;
    case 'pyro': WEAPONS.SCEPTER.fire = true; break;
    case 'gambler': GameState.pGambler = true; break;
    case 'warlock': PASSIVES.orb.active = true; PASSIVES.orb.level = 1; PASSIVES.orb.count = 1; break;
    case 'valkyrie': GameState.pDashCdMult *= 0.7; break;
    case 'arbalist': GameState.pCritDmg += 0.5; break;
    case 'runemaster': GameState.pArea *= 1.2; break;
    case 'duelist': GameState.pDodge += 0.2; break;
    case 'gunner': GameState.pArea *= 1.3; break;
    case 'shaman': PASSIVES.aura.active = true; PASSIVES.aura.level = 1; break;
    case 'werewolf': GameState.pBleedChance += 0.3; GameState.pRegen += 1; break;
    case 'templar': GameState.pDmgRed += 0.15; break;
    case 'illusionist': GameState.pDodge += 0.25; break;
    case 'cowboy': GameState.pLuck *= 1.5; break;
    case 'witchdoc': PASSIVES.poison.active = true; break;
    case 'stormcaller': WEAPONS.SCEPTER.lightning = true; break;
    case 'frostarcher': WEAPONS.SCEPTER.ice = true; break;
    case 'cultist': GameState.pVamp += 0.15; GameState.pMaxHP *= 0.6; GameState.pHP = GameState.pMaxHP; break;
    case 'mechanic': PASSIVES.turret.active = true; break;
    case 'astronomer': PASSIVES.orb.active = true; break;
    case 'chef': GameState.pRegen += 2; break;
    case 'juggler': GameState.pLuck *= 1.8; break;
    case 'executioner': GameState.pExec += 0.2; break;
    case 'geomancer': GameState.pDmgRed += 0.1; break;
    case 'apothecary': PASSIVES.poison.active = true; break;
    case 'kyudo': GameState.pCritDmg += 1.0; GameState.pSniper = true; break;
    case 'sniper': GameState.pSniper = true; GameState.pCritDmg += 0.5; break;
    case 'darkknight': GameState.pLowHpDmg += 0.5; break;
    case 'sunpriest': GameState.pArea *= 1.2; break;
    case 'chronomancer': GameState.pDashCdMult *= 0.5; WEAPONS.SCEPTER.ice = true; break;
    case 'tamer': PASSIVES.dagger.active = true; PASSIVES.dagger.level = 1; break; // "Pet" attack
    case 'bard': GameState.pXpMult += 0.3; break;
    
    // Boss Classes Bonuses
    case 'boss_reaper': GameState.pExec += 0.3; break;
    case 'boss_vampire': GameState.pVamp += 0.2; break;
    case 'boss_yeti': GameState.pDmgRed += 0.3; WEAPONS.SCEPTER.ice = true; break;
    case 'boss_outlaw': GameState.pSniper = true; GameState.pCritDmg += 1.0; break;
    case 'boss_spider': PASSIVES.poison.active = true; break;
    case 'boss_lich': PASSIVES.skulls.active = true; PASSIVES.skulls.count = 2; break;
  }

  // Activate weapon
  const wepMap = {
    'scepter': 'SCEPTER', 'sword': 'SWORD', 'axe': 'AXE', 'bow': 'BOW',
    'daggers': 'DAGGERS', 'spear': 'SPEAR', 'hammer': 'HAMMER', 'boomerang': 'BOOMERANG',
    'scythe': 'SCYTHE', 'katana': 'KATANA', 'flail': 'FLAIL', 'gauntlets': 'GAUNTLETS',
    'grimoire': 'GRIMOIRE', 'whip': 'WHIP', 'cards': 'CARDS', 'pistol': 'PISTOL',
    'trident': 'TRIDENT', 'rifle': 'RIFLE', 'shuriken': 'SHURIKEN', 'void_staff': 'VOID_STAFF',
    'fire_staff': 'FIRE_STAFF', 'leaf_blade': 'LEAF_BLADE', 'potion': 'POTION', 'lute': 'LUTE', 'wrench': 'WRENCH',
    'javelin': 'JAVELIN', 'crossbow': 'CROSSBOW', 'runestone': 'RUNESTONE', 'rapier': 'RAPIER', 'bomb': 'BOMB',
    'totem': 'TOTEM', 'claws': 'CLAWS', 'mace': 'MACE', 'mirror': 'MIRROR', 'revolver': 'REVOLVER',
    'needles': 'NEEDLES', 'lightning_rod': 'LIGHTNING_ROD', 'ice_bow': 'ICE_BOW', 'dagger_sac': 'DAGGER_SAC',
    'drill': 'DRILL', 'star_globe': 'STAR_GLOBE', 'cleaver': 'CLEAVER', 'balls': 'BALLS', 'greatsword': 'GREATSWORD',
    'rock': 'ROCK', 'blowgun': 'BLOWGUN', 'greatbow': 'GREATBOW', 'dark_blade': 'DARK_BLADE', 'sun_staff': 'SUN_STAFF',
    'hourglass': 'HOURGLASS'
  };
  // Désactiver toutes les armes avant d'activer celle de la classe
  for (const k in WEAPONS) WEAPONS[k].active = false;

  const wepKey = wepMap[GameState.pClass.wep];
  if (wepKey) WEAPONS[wepKey].active = true;
  else {
    // Fallback si l'arme n'est pas trouvée
    console.warn("Weapon not found in map:", GameState.pClass.wep);
    WEAPONS.SCEPTER.active = true;
  }

  // Generate ground texture
  const s = 512, c = document.createElement('canvas');
  c.width = s; c.height = s;
  const ctx = c.getContext('2d');
  const col = new THREE.Color(GameState.pBiome.col);
  ctx.fillStyle = '#' + col.getHexString();
  ctx.fillRect(0, 0, s, s);
  
  // Biome specific ground patterns
  if (GameState.pBiome.id === 'cyber' || GameState.pBiome.id === 'steampunk' || GameState.pBiome.id === 'clockwork' || GameState.pBiome.id === 'lab') {
      // Grid
      ctx.strokeStyle = GameState.pBiome.id === 'steampunk' ? 'rgba(200,150,50,0.3)' : 'rgba(0,255,0,0.2)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      for(let i=0; i<=s; i+=64) { ctx.moveTo(i,0); ctx.lineTo(i,s); ctx.moveTo(0,i); ctx.lineTo(s,i); }
      ctx.stroke();
  } else if (GameState.pBiome.id === 'dungeon' || GameState.pBiome.id === 'ruins' || GameState.pBiome.id === 'crypt' || GameState.pBiome.id === 'prison') {
      // Bricks / Cobblestone
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      for(let y=0; y<s; y+=32) {
          for(let x=0; x<s; x+=64) {
              ctx.fillRect(x + (y%64===0?0:32) + 2, y + 2, 60, 28);
          }
      }
  } else {
      // Natural Noise
      const id = ctx.getImageData(0, 0, s, s), d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() - 0.5) * 30;
        d[i] = Math.min(255, Math.max(0, d[i] + n));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n));
      }
      ctx.putImageData(id, 0, 0);
      for (let i = 0; i < 50; i++) { ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.beginPath(); ctx.arc(Math.random() * s, Math.random() * s, 10 + Math.random() * 40, 0, Math.PI * 2); ctx.fill(); }
  }
  
  groundTex = new THREE.CanvasTexture(c);
  groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(16, 16); // Augmenté pour éviter l'étirement moche

  // Create Player Model (for 3rd person)
  if (playerModel) playerPivot.remove(playerModel);
  const pm = buildPlayerModel(GameState.pClass);
  playerModel = pm.root;
  playerParts = pm.parts;
  playerTypeData = pm.typeData;
  playerPivot.add(playerModel);
  playerModel.position.y = -1.6; // Ancrer le modèle au sol
  playerModel.visible = false; // Start hidden (1st person)

  if (typeof createVM === 'function') {
    createVM(GameState.pClass.wep);
  }

  scene.fog.color.setHex(GameState.pBiome.fog);
  renderer.setClearColor(GameState.pBiome.fog);

  document.getElementById('overlay').style.display = 'none';
  document.getElementById('hud').style.display = 'block';
  clock.start();
  renderer.domElement.requestPointerLock();
  for (let i = 0; i < 8; i++) { const a = Math.random() * Math.PI * 2, d = 18 + Math.random() * 12; monsters.push(new Monster(Math.cos(a) * d, Math.sin(a) * d)); }
  addNotif(`⚔ ${GameState.pClass.wep.toUpperCase()} équipé`, '#f0c030');
  
  // Force terrain update
  if (playerPivot && playerPivot.position) {
      updateTerrain(playerPivot.position.x, playerPivot.position.z);
  }
  
  addNotif("Bonne chance !", "#ffffff");
  newQuest();
 } catch(e) {
     console.error(e);
     addNotif("ERREUR: " + e.message, "#ff0000");
 }
}

// ==================== DASH FUNCTION ====================
function attemptDash() {
    if (GameState.dashCd <= 0 && GameState.gameRunning && !GameState.levelingUp) {
      GameState.dashCd = 1.5 * GameState.pDashCdMult;
      GameState.dashTime = 0.15;
      // Dash direction is current movement or forward if standing still
      const moveDir = new THREE.Vector3(GameState.pVelX, 0, GameState.pVelZ).normalize();
      if (moveDir.lengthSq() === 0) moveDir.copy(fwd()).setY(0).normalize();
      
      GameState.dashDir.copy(moveDir);
      spawnPart(playerPivot.position, 0xaaddff, 12, 6);
      GameState.invTimer = 0.3; // Invincibility frames during dash
    }
}

// ==================== MAIN LOOP ====================
function loop() {
  requestAnimationFrame(loop);

  if (GameState.galleryMode) {
    const dt = clock.getDelta();
    if (window.galleryPivot) window.galleryPivot.rotation.y += dt * 0.5;
    const view = document.getElementById('galView');
    if (view) {
      const rect = view.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const left = rect.left;
      const bottom = renderer.domElement.clientHeight - rect.bottom;
      renderer.setViewport(left, bottom, width, height);
      renderer.setScissor(left, bottom, width, height);
      renderer.setScissorTest(true);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      camera.position.copy(window.galleryPivot.position).add(new THREE.Vector3(0, 0.5, 4));
      camera.lookAt(window.galleryPivot.position);
      renderer.setClearColor(0x111111, 1);
      renderer.clear();
      renderer.render(scene, camera);
    }
    return;
  }

  // Card Preview Mode (Progression Menu)
  if (window.previewTarget) {
    const dt = clock.getDelta();
    if (window.galleryPivot) window.galleryPivot.rotation.y += dt * 0.5;
    
    const rect = window.previewTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const left = rect.left;
    const bottom = renderer.domElement.clientHeight - rect.bottom;

    renderer.setScissorTest(true);
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.position.copy(window.galleryPivot.position).add(new THREE.Vector3(0, 1, 3.5));
    camera.lookAt(window.galleryPivot.position.clone().add(new THREE.Vector3(0, 0.5, 0)));
    
    const cv = document.getElementById('main');
    cv.style.zIndex = '600'; // Bring canvas to front (above overlay background)
    cv.style.pointerEvents = 'none'; // Allow clicks to pass through to close button
    renderer.setClearColor(0x000000, 0); // Transparent clear
    renderer.clear();
    renderer.render(scene, camera);
    return;
  }

  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  if (camera.aspect !== window.innerWidth / window.innerHeight) { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); }
  renderer.setClearColor(GameState.pBiome ? GameState.pBiome.fog : 0x8ab8d8);

  if (GameState.paused) {
    renderer.render(scene, camera);
    return;
  }

  if (GameState.gameRunning && !GameState.levelingUp) {
    let dt = Math.min(clock.getDelta(), 0.05);
    if (GameState.modX2) dt *= 2.0;

    GameState.globalTime += dt;
    GameState.pT += dt;
    GameState.pScore += dt * 10;
    GameState.invTimer = Math.max(0, GameState.invTimer - dt);
    GameState.frenzyTimer = Math.max(0, GameState.frenzyTimer - dt);
    GameState.dashCd = Math.max(0, GameState.dashCd - dt);
    GameState.pSpecialCd = Math.max(0, GameState.pSpecialCd - dt);

    // Cooldowns
    const wepKeys = Object.keys(WEAPONS);
    wepKeys.forEach(w => { if (WEAPONS[w]) WEAPONS[w].cd = Math.max(0, WEAPONS[w].cd - dt); });

    // Regen
    GameState.pMP = Math.min(GameState.pMaxMP, GameState.pMP + 8 * dt);
    if (GameState.invTimer <= 0 && !GameState.modHC) GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + 0.3 * dt);
    if (GameState.invTimer <= 0 && !GameState.modHC) GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + GameState.pRegen * dt);

    // Fire
    handleFire();
    
    // Special Ability (Left Click or A)
    if (mDown[0] || keys['KeyA']) {
        if (typeof triggerSpecial === 'function') triggerSpecial();
    }
    
    // Dash (Right Click) - Note: KeyE is handled in keydown event
    if (mDown[2]) attemptDash();

    // Movement
    let isMoving = false;
    if (GameState.dashTime > 0) {
      GameState.dashTime -= dt;
      playerPivot.position.addScaledVector(GameState.dashDir, SPD * 4.5 * dt);
      camera.fov = 95;
      
      // Dash Attack Logic
      if (PASSIVES.dash_atk.active) {
          monsters.forEach(m => {
              if (!m.dead && m.root.position.distanceTo(playerPivot.position) < PASSIVES.dash_atk.range) {
                  if (m.invulnDash !== GameState.dashCd) { // Prevent multi-hit per dash frame
                      m.takeDmg(PASSIVES.dash_atk.dmg, true, 15, playerPivot.position);
                      spawnPart(m.root.position, 0xffaa00, 8, 6);
                      m.invulnDash = GameState.dashCd; // Tag monster
                  }
              }
          });
      }
      
      camera.updateProjectionMatrix();
    } else {
      if (camera.fov !== 85) { camera.fov = 85; camera.updateProjectionMatrix(); }
      _vMove.set(0, 0, 0);
      if (keys['KeyW'] || keys['ArrowUp']) _vMove.z = -1;
      if (keys['KeyS'] || keys['ArrowDown']) _vMove.z = 1;
      if (keys['KeyA'] || keys['ArrowLeft']) _vMove.x = -1;
      if (keys['KeyD'] || keys['ArrowRight']) _vMove.x = 1;
      isMoving = _vMove.lengthSq() > 0;
      
      // PHYSICS & WEIGHT SYSTEM
      const weight = GameState.pClass.weight || 1.0;
      const accel = 15.0 / weight; // Lighter = faster accel
      const friction = 10.0 / weight; // Lighter = faster stop
      
      let targetVx = 0;
      let targetVz = 0;

      if (isMoving) {
        _vMove.normalize();
        const sY = Math.sin(camYaw), cY = Math.cos(camYaw);
        targetVx = (_vMove.x * cY + _vMove.z * sY) * SPD;
        targetVz = (_vMove.z * cY - _vMove.x * sY) * SPD;
      }
      
      // Interpolate velocity (Inertia)
      GameState.pVelX = THREE.MathUtils.lerp(GameState.pVelX || 0, targetVx, dt * (isMoving ? accel : friction));
      GameState.pVelZ = THREE.MathUtils.lerp(GameState.pVelZ || 0, targetVz, dt * (isMoving ? accel : friction));
      
      playerPivot.position.x += GameState.pVelX * dt;
      playerPivot.position.z += GameState.pVelZ * dt;
    }

    // Gravity + jump
    GameState.pVelY += GRAV * dt;
    playerPivot.position.y += GameState.pVelY * dt;
    
    // CRITICAL SAFETY: Check for NaN position to prevent game freeze
    if (isNaN(playerPivot.position.y) || isNaN(playerPivot.position.x) || isNaN(playerPivot.position.z)) {
        console.warn("Player position NaN detected! Respawning...");
        playerPivot.position.set(0, 50, 0);
        GameState.pVelY = 0;
    }

    const gh = terrainH(playerPivot.position.x, playerPivot.position.z) + 1.65;
    
    // Falling into Abyss check
    if (playerPivot.position.y < -30) {
        GameState.pHP = Math.max(0, GameState.pHP - 10);
        addNotif("CHUTE DANS LE VIDE!", "#ff0000");
        if (GameState.pHP <= 0) gameOver();
        else {
            playerPivot.position.y = 30; // Respawn high
            GameState.pVelY = 0;
            playerPivot.position.lerp(new THREE.Vector3(0, 30, 0), 0.1); // Move towards center
        }
    } else if (gh > -50 && playerPivot.position.y < gh) { 
        // Solid ground collision
        playerPivot.position.y = gh; GameState.pVelY = 0; GameState.pJumpCount = 0; 
    }

    if (keys['Space']) {
      if (!keyState.space) {
        if (GameState.pJumpCount < GameState.pMaxJumps) {
          GameState.pVelY = GameState.pClass.jump || 8.5;
          GameState.pJumpCount++;
          if (GameState.pJumpCount > 1) spawnPart(playerPivot.position, 0xffffff, 8, 4);
        }
        keyState.space = true;
      }
    } else keyState.space = false;

    // Viewmodel
    vmRecoil = Math.max(0, vmRecoil - dt * (WEAPONS.SCEPTER.active || WEAPONS.BOW.active || WEAPONS.BOOMERANG.active ? 7 : 4));
    const sway = Math.sin(GameState.pT * 2.6) * 0.003 * (isMoving ? 0.8 : 1);
    const bob = Math.sin(GameState.pT * 10) * 0.01 * (isMoving ? 1 : 0);
  if (vmModel) {
    vmModel.position.x = 0.4 + sway + bob;
    vmModel.position.y = -0.3 + sway - vmRecoil * 0.1 + Math.abs(bob);
    vmModel.rotation.x = -Math.PI/2 - vmRecoil * 0.2;
    }

    // Terrain
    const px = playerPivot.position.x, pz = playerPivot.position.z;
    const cx = Math.round(px / CHUNK_SZ), cz = Math.round(pz / CHUNK_SZ);
    if (cx !== lastCX || cz !== lastCZ) { updateTerrain(px, pz); lastCX = cx; lastCZ = cz; }

    // Chests
    chestTimer -= dt;
    if (chestTimer < 0) { const a = Math.random() * Math.PI * 2, d = 15 + Math.random() * 15; chests.push(new Chest(playerPivot.position.x + Math.cos(a) * d, playerPivot.position.z + Math.sin(a) * d)); chestTimer = 15 + Math.random() * 15; }
    for (let i = chests.length - 1; i >= 0; i--) { if (chests[i].update(dt, playerPivot.position)) { scene.remove(chests[i].m); chests.splice(i, 1); } }
    for (let i = xpOrbs.length - 1; i >= 0; i--) { if (xpOrbs[i].update(dt, playerPivot.position)) xpOrbs.splice(i, 1); }

    // Spawn + boss
    spawnTimer -= dt;
    if (spawnTimer <= 0) { spawnTimer = Math.max(2.0, 5.0 - (GameState.pT / 60) * 0.6); doSpawn(); }
    checkBoss();

    // Update
    for (let i = monsters.length - 1; i >= 0; i--) { if (monsters[i].update(dt, playerPivot.position)) { scene.remove(monsters[i].root); monsters.splice(i, 1); } }
    for (let i = projectiles.length - 1; i >= 0; i--) { if (projectiles[i].update(dt, playerPivot.position)) projectiles.splice(i, 1); }
    updatePassives(dt);
    updPart(dt);
    updateDayNight(dt);
    drawMinimap();
    updHUD(dt);

    // ==================== CAMERA UPDATE ====================
    if (playerPivot && camera) {
        if (GameState.thirdPerson) {
            playerModel.visible = true;
            if (vm) vm.visible = false;
            
            // 3rd Person Camera Position
            const dist = 4.0;
            const targetHeight = 1.5 * (playerTypeData.S || 1.0); // Hauteur de la tête/épaules ajustée à la taille
            
            const hDist = dist * Math.cos(camPitch);
            const vDist = dist * Math.sin(-camPitch);

            const cx = playerPivot.position.x + Math.sin(camYaw) * hDist;
            const cz = playerPivot.position.z + Math.cos(camYaw) * hDist;
            let cy = playerPivot.position.y + targetHeight + vDist;
            
            // Anti-clip sol basique (évite que la caméra passe sous terre)
            const terrH = terrainH(cx, cz);
            if (cy < terrH + 0.5) cy = terrH + 0.5;

            camera.position.set(cx, cy, cz);
            camera.lookAt(playerPivot.position.x, playerPivot.position.y + targetHeight, playerPivot.position.z);
            
            // Rotation du joueur indépendante de la caméra (Free Cam)
            if (isMoving) {
                // Calcul de l'angle de mouvement en espace monde
                // _vMove contient la direction relative (z=-1 avant, x=-1 gauche)
                // On projette ce mouvement par rapport à l'angle de la caméra (camYaw)
                const moveX = (_vMove.x * Math.cos(camYaw) + _vMove.z * Math.sin(camYaw));
                const moveZ = (_vMove.z * Math.cos(camYaw) - _vMove.x * Math.sin(camYaw));
                
                const targetRot = Math.atan2(moveX, moveZ);
                
                // Interpolation fluide vers la direction de mouvement
                let rotDiff = targetRot - playerModel.rotation.y;
                while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
                while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
                playerModel.rotation.y += rotDiff * dt * 10;
            }
            // Si on ne bouge pas, on garde la dernière rotation (ou on pourrait s'aligner si on vise)
            
            // Animation
            animPuppet(playerParts, GameState.pT, isMoving, playerTypeData.S, playerTypeData.shape);
        } else {
            playerModel.visible = false;
            if (vm) vm.visible = true;
            
            camera.position.copy(playerPivot.position);
            camera.position.y += 0.05;
            camera.rotation.order = 'YXZ';
            camera.rotation.y = camYaw;
            camera.rotation.x = camPitch;
        }
    }
  }

  renderer.render(scene, camera);
}

// ==================== MINIMAP ====================
function drawMinimap() {
  if (!minimapCtx) return;
  const ctx = minimapCtx, w = 120, h = 120, cx = w / 2, cy = h / 2, scale = 1.5;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0f0';
  ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
  const pp = playerPivot.position;
  ctx.fillStyle = '#f00';
  monsters.forEach(m => { if (m.dead) return; const dx = (m.root.position.x - pp.x) * scale, dz = (m.root.position.z - pp.z) * scale; if (dx * dx + dz * dz < (w / 2) * (w / 2)) { ctx.beginPath(); ctx.arc(cx + dx, cy + dz, 2, 0, Math.PI * 2); ctx.fill(); } });
  ctx.fillStyle = '#fd0';
  chests.forEach(c => { const dx = (c.m.position.x - pp.x) * scale, dz = (c.m.position.z - pp.z) * scale; if (dx * dx + dz * dz < (w / 2) * (w / 2)) { ctx.beginPath(); ctx.arc(cx + dx, cy + dz, 3, 0, Math.PI * 2); ctx.fill(); } });
}

// ==================== INIT ====================
let isInitialized = false;
function init() {
  if (typeof GameState === 'undefined') {
    console.error("GameState is not defined. Check data.js for errors.");
    return;
  }
  loadGame(); // Load progress on init
  checkBossUnlocks(); // Check for retroactive unlocks
  
  // --- FIX CRITIQUE : Réparation de la sauvegarde si corrompue ---
  if (!GameState.saveData) GameState.saveData = {};
  if (!Array.isArray(GameState.saveData.unlockedClasses)) GameState.saveData.unlockedClasses = [];
  if (GameState.saveData.unlockedClasses.length === 0) GameState.saveData.unlockedClasses = ['mage', 'knight'];
  if (!GameState.saveData.unlockedClasses.includes('mage')) GameState.saveData.unlockedClasses.push('mage');

  if (!Array.isArray(GameState.saveData.unlockedBiomes)) GameState.saveData.unlockedBiomes = [];
  if (GameState.saveData.unlockedBiomes.length === 0) GameState.saveData.unlockedBiomes = ['plains'];
  if (!GameState.saveData.unlockedBiomes.includes('plains')) GameState.saveData.unlockedBiomes.push('plains');
  if (typeof GameState.saveData.money === 'undefined') GameState.saveData.money = 0;
  if (typeof GameState.saveData.permUpgrades === 'undefined') GameState.saveData.permUpgrades = {};
  if (!Array.isArray(GameState.saveData.unlockedCosmetics)) GameState.saveData.unlockedCosmetics = ['default'];
  if (!GameState.saveData.equippedCosmetic) GameState.saveData.equippedCosmetic = 'default';
  if (!GameState.saveData.settings) GameState.saveData.settings = { view: 0, particles: 1 };
  // ---------------------------------------------------------------

  if (isInitialized) return;
  isInitialized = true;
  const cv = document.getElementById('main');
  
  // Initialize default biome and ground texture to prevent errors before game start
  if (typeof BIOMES !== 'undefined' && BIOMES.length > 0) {
    GameState.pBiome = BIOMES[0];
    if (typeof setTerrainBiome === 'function') setTerrainBiome(GameState.pBiome.id);
  }
  
  renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x8ab8d8);

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x8ab8d8, 0.018);

  camera = new THREE.PerspectiveCamera(85, innerWidth / innerHeight, 0.04, 250);
  camera.rotation.order = 'YXZ';
  scene.add(camera);
  clock = new THREE.Clock();

  scene.add(new THREE.AmbientLight(0x557799, 0.6));
  sunLight = new THREE.DirectionalLight(0xffe8cc, 1.1);
  sunLight.position.set(60, 120, 40);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.left = sunLight.shadow.camera.bottom = -100;
  sunLight.shadow.camera.right = sunLight.shadow.camera.top = 100;
  sunLight.shadow.camera.far = 200;
  scene.add(sunLight);
  fillLight = new THREE.DirectionalLight(0x445566, 0.3);
  fillLight.position.set(-40, 20, -60);
  scene.add(fillLight);

  // Sky
  skyMat = new THREE.ShaderMaterial({
    uniforms: { tC: { value: new THREE.Color(0x1a3a6a) }, bC: { value: new THREE.Color(0x7ab0d8) } },
    vertexShader: 'varying float vY;void main(){vY=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1);}',
    fragmentShader: 'uniform vec3 tC,bC;varying float vY;void main(){gl_FragColor=vec4(mix(bC,tC,clamp((vY+100.)/300.,0.,1.)),1.);}',
    side: THREE.BackSide, depthWrite: false
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(220, 16, 8), skyMat));

  // Clouds
  for (let i = 0; i < 24; i++) {
    const g = new THREE.Group();
    for (let j = 0; j < 2 + Math.floor(Math.random() * 3); j++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(8 + Math.random() * 12, 2.5 + Math.random() * 3, 5 + Math.random() * 7), new THREE.MeshBasicMaterial({ color: 0xe8edf5, transparent: true, opacity: 0.82 }));
      m.position.set(j * 5, Math.random() * 3, Math.random() * 4);
      g.add(m);
    }
    g.position.set((Math.random() - 0.5) * 350, 50 + Math.random() * 30, (Math.random() - 0.5) * 350);
    scene.add(g);
  }
  
  // Default ground texture
  const s = 4, c = document.createElement('canvas'); c.width = s; c.height = s;
  const ctx = c.getContext('2d'); ctx.fillStyle = '#5a6a4a'; ctx.fillRect(0, 0, s, s);
  groundTex = new THREE.CanvasTexture(c);

  // Player
  playerPivot = new THREE.Group();
  
  // Recherche d'un point de spawn solide (évite de tomber dans le vide au départ)
  let sx = 0, sz = 0;
  // Si c'est un biome type "îles flottantes", on cherche un sol
  if (['sky', 'heavens', 'void', 'chaos', 'warp', 'shadow', 'candy'].includes(GameState.pBiome.id)) {
      let angle = 0, radius = 0;
      for(let i=0; i<250; i++) {
          const h = terrainH(sx, sz);
          if(h > -50) break; // Sol trouvé !
          angle += 0.8;
          radius += 6;
          sx = Math.cos(angle) * radius;
          sz = Math.sin(angle) * radius;
      }
  }
  
  let startH = terrainH(sx, sz);
  if (isNaN(startH)) startH = 0;
  playerPivot.position.set(sx, startH + 1.7, sz);
  
  // Safety: Ensure no NaN at start
  if (isNaN(playerPivot.position.x) || isNaN(playerPivot.position.y) || isNaN(playerPivot.position.z)) {
      playerPivot.position.set(0, 30, 0);
  }
  scene.add(playerPivot);

  minimapCtx = document.getElementById('minimap').getContext('2d');
  injectDOM(); // Inject new UI elements
  initSelectionUI(); // Update UI with loaded save data
  window.galleryPivot = new THREE.Group();
  window.galleryPivot.position.set(0, 500, 0);
  scene.add(window.galleryPivot);

  // Input
  document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyE') {
        attemptDash();
    }
    if (e.code === 'KeyV') { // Toggle View
        GameState.thirdPerson = !GameState.thirdPerson;
        addNotif(GameState.thirdPerson ? "Vue: 3ème Personne" : "Vue: 1ère Personne", "#ffffff");
    }
    if (e.code === 'Escape') {
      if (GameState.gameRunning && !GameState.levelingUp) {
        if (GameState.paused) {
          resumeGame();
        } else {
          GameState.paused = true;
          document.exitPointerLock();
          document.getElementById('hud').style.display = 'none';
          document.getElementById('pauseMenu').style.display = 'flex';
        }
      } else if (GameState.galleryMode) {
        closeGallery();
      } else if (document.getElementById('progressionUI').style.display === 'flex') {
        closeProgression();
      }
    }
    if (e.code === 'Space') e.preventDefault();
  });
  document.addEventListener('keyup', e => { keys[e.code] = false; });
  document.addEventListener('mousedown', e => {
    if (!GameState.gameRunning || GameState.levelingUp) return;
    if (e.target !== cv) return; // Ignore les clics sur l'interface (boutons, etc.)
    if (document.pointerLockElement !== cv) { cv.requestPointerLock(); return; }
    mDown[e.button] = true;
  });
  document.addEventListener('mouseup', e => { mDown[e.button] = false; });
  document.addEventListener('mousemove', e => {
    if (document.pointerLockElement !== cv) return;
    camYaw -= e.movementX * 0.0028;
    camPitch -= e.movementY * 0.0028; // Correction souris pour comportement standard
    camPitch = Math.max(-0.82, Math.min(0.82, camPitch));
  });
  document.addEventListener('pointerlockchange', () => {
    const lk = document.pointerLockElement === cv;
    if (!GameState.levelingUp) document.getElementById('lkhint').style.display = lk ? 'none' : 'block';
  });
  window.addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

  loop(); // Démarrage de la boucle de rendu
}

// Auto-start when DOM is ready - wrapped for reliability
window.addEventListener('load', function() {
  // Small delay to ensure everything is initialized
  setTimeout(init, 100);
});
