// ═══════════════════════════════════════════════
// DUNGEON WORLD - World Generation
// ═══════════════════════════════════════════════

// ==================== SPRITE MATERIAL CACHE ====================
var scenerySpriteMatCache = {};

function getScenerySpriteMat(token, colorHex, extra = {}) {
  const key = `${token}_${colorHex}_${extra.depthWrite === false ? 0 : 1}`;
  if (scenerySpriteMatCache[key]) return scenerySpriteMatCache[key];
  scenerySpriteMatCache[key] = new THREE.SpriteMaterial({
    map: getSceneryTex(token, colorHex),
    depthWrite: extra.depthWrite !==false
  });
  return scenerySpriteMatCache[key];
}

// ==================== MATERIAL INITIALIZATION ====================
function initStructureMaterials() {
  // Pre-generate and cache structure materials to avoid GC pressure
  MATS.stone = new THREE.MeshLambertMaterial({ map: genTex(0x666666, 'stone') });
  MATS.wood = new THREE.MeshLambertMaterial({ map: genTex(0x5a4030, 'wood') });
  MATS.dark = new THREE.MeshLambertMaterial({ map: genTex(0x222222) });
  MATS.brick = new THREE.MeshLambertMaterial({ map: genTex(0x884444, 'stone') });
  MATS.roof = MATS.brick; // Reuse brick texture
  // Extra structure materials
  MATS.fairy = new THREE.MeshLambertMaterial({color: 0xffaaff});
  MATS.jungle = new THREE.MeshLambertMaterial({color: 0x228822});
  MATS.coral = new THREE.MeshLambertMaterial({color:0xff88aa});
  MATS.tent = new THREE.MeshLambertMaterial({color:0xff0000});
  MATS.blockBlue = new THREE.MeshLambertMaterial({color:0x0000ff});
  MATS.blockGreen = new THREE.MeshLambertMaterial({color:0x00ff00});
  MATS.blockRed = new THREE.MeshLambertMaterial({color:0xff0000});
}

// ==================== TERRAIN ====================
function createChunk(cx, cz) {
  const S = 32;
  const geo = new THREE.PlaneGeometry(CHUNK_SZ, CHUNK_SZ, S, S);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position.array;
  
  // Pre-allocate color array to avoid repeated push() allocations
  const colorCount = (S + 1) * (S + 1); // Number of vertices
  const cols = new Float32Array(colorCount * 3); // RGB per vertex
  let colIdx = 0;
  
  for (let i = 0; i < pos.length; i += 3) {
    const wx = pos[i] + cx, wz = pos[i + 2] + cz, h = terrainH(wx, wz);
    pos[i + 1] = h;
    const v = (h + 5) / 25 + noise2(wx * 0.2, wz * 0.2) * 0.1;
    cols[colIdx++] = ((GameState.pBiome.col >> 16) & 255) / 255 * v;
    cols[colIdx++] = ((GameState.pBiome.col >> 8) & 255) / 255 * v;
    cols[colIdx++] = (GameState.pBiome.col & 255) / 255 * v;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  geo.computeVertexNormals();
  geo.attributes.position.needsUpdate = true;
  const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, map: groundTex }));
  m.receiveShadow = true;
  m.position.set(cx, 0, cz);
  scene.add(m);

  // Scenery for this chunk
  const grp = new THREE.Group();
  grp.position.set(cx, 0, cz);
  try {
    populateChunk(grp, cx, cz);
  } catch (e) {
    console.warn('populateChunk failed for biome:', GameState && GameState.pBiome ? GameState.pBiome.id : 'unknown', e);
  }

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

  scene.add(grp);
  return { m, grp };
}

function updateTerrain(px, pz) {
  const cx = Math.round(px / CHUNK_SZ), cz = Math.round(pz / CHUNK_SZ);
  const drawDist = (GameState && GameState.saveData && GameState.saveData.settings && GameState.saveData.settings.particles === 0) ? 1 : DRAW_DIST;
  const keep = new Set();
  for (let x = -drawDist; x <= drawDist; x++) {
    for (let z = -drawDist; z <= drawDist; z++) {
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

  // Use cached materials instead of creating new ones (GC optimization)
  const mStone = MATS.stone;
  const mWood = MATS.wood;
  const mDark = MATS.dark;
  const mIce = MATS.ice;
  const mGold = MATS.gold;
  const mBrick = MATS.brick;
  const mWhite = MATS.white;
  const mRed = MATS.red;
  const mRoof = MATS.roof;

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
      const leaveMat = biome==='fairy' ? MATS.fairy : MATS.jungle;
      const leaves = new THREE.Mesh(GEOS.dodec, leaveMat);
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
      const neonMat = biome==='cyber' ? MATS.neonGreen : MATS.neonOrange;
      const n = new THREE.Mesh(GEOS.box, neonMat);
      n.scale.set(8.2, h, 0.5); n.position.set(0, h/2, 4); g.add(n);
    } else if (t === 1) { // Factory Pipes
      const b = new THREE.Mesh(GEOS.box, mDark); b.scale.set(10, 6, 10); b.position.y = 3; g.add(b); addBox(10, 6, 10, 0, 3, 0);
      for(let i=0; i<3; i++) {
          const p = new THREE.Mesh(GEOS.cyl, mStone); p.scale.set(1, 10, 1); p.position.set(-3+i*3, 8, 0); g.add(p);
          // Smoke (static sphere)
          const s = new THREE.Mesh(GEOS.sphere, MATS.smoke);
          s.scale.set(2, 2, 2); s.position.set(-3+i*3, 14, 0); g.add(s);
      }
    } else { // Server/Machine
      const b = new THREE.Mesh(GEOS.box, mDark); b.scale.set(6, 8, 4); b.position.y = 4; g.add(b); addBox(6, 8, 4, 0, 4, 0);
      const screen = new THREE.Mesh(GEOS.quad, MATS.cyan);
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
          const arch = new THREE.Mesh(GEOS.torus, MATS.coral);
          arch.scale.set(5, 5, 5); arch.position.y = 4; g.add(arch);
          addBox(5, 8, 2, 0, 4, 0);
      }
  } else if (biome === 'candy' || biome === 'toy' || biome === 'circus') {
      if (t === 0) { // Circus Tent
          const tent = new THREE.Mesh(GEOS.cone, MATS.tent);
          tent.scale.set(10, 8, 10); tent.position.y = 4; g.add(tent);
          const top = new THREE.Mesh(GEOS.sphere, mGold); top.scale.set(1, 1, 1); top.position.y = 8; g.add(top);
          addBox(10, 8, 10, 0, 4, 0);
      } else { // Castle of Blocks
          const b1 = new THREE.Mesh(GEOS.box, MATS.blockBlue); b1.scale.set(4, 4, 4); b1.position.set(-2, 2, 0); g.add(b1);
          const b2 = new THREE.Mesh(GEOS.box, MATS.blockGreen); b2.scale.set(4, 4, 4); b2.position.set(2, 2, 0); g.add(b2);
          const b3 = new THREE.Mesh(GEOS.box, MATS.blockRed); b3.scale.set(4, 4, 8); b3.position.set(0, 6, 0); g.add(b3);
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
  // Biome signature layer: each stage gets a distinct ornament language.
  const bInfo = (typeof BIOMES !== 'undefined' && BIOMES) ? BIOMES.find(b => b.id === biome) : null;
  const accent = bInfo ? bInfo.col : 0x888888;
  let bseed = 0;
  for (let i = 0; i < biome.length; i++) bseed = (bseed * 131 + biome.charCodeAt(i)) % 1000003;
  const sig = bseed % 4;
  const mAccent = new THREE.MeshLambertMaterial({ color: accent });if (sig === 0) {
    const ring = new THREE.Mesh(GEOS.torus, mAccent);
    ring.scale.set(1.8, 1.8, 1.8);
    ring.position.y = 9 + (bseed % 4);
    g.add(ring);
  } else if (sig === 1) {
    for (let i = 0; i < 3; i++) {
      const p = new THREE.Mesh(GEOS.oct, mAccent);
      p.scale.set(0.8, 1.2, 0.8);
      p.position.set(Math.cos(i * 2.1) * 4, 6 + i * 1.2, Math.sin(i * 2.1) * 4);
      g.add(p);
    }
  } else if (sig === 2) {
    const crown = new THREE.Mesh(GEOS.cone, mAccent);
    crown.scale.set(1.4, 2.6, 1.4);
    crown.position.y = 11 + (bseed % 3);
    g.add(crown);
  } else {
    const core = new THREE.Mesh(GEOS.sphere, mAccent);
    core.scale.set(1.1, 1.1, 1.1);
    core.position.y = 8 + (bseed % 5) * 0.5;
    g.add(core);
  }

  return { mesh: g, colliders: boxes };
}

function populateChunk(grp, cx, cz) {
  const biomeId = GameState.pBiome.id;
  const fx = GameState.biomeFx || getBiomeProfile(GameState.pBiome);
  const lowFx = GameState.saveData && GameState.saveData.settings && GameState.saveData.settings.particles === 0;
  const spriteDensityMult = (fx.spriteDensityMult || 1) * (lowFx ? 0.55 : 1.0);

  // Biome-specific scenery variants (pair of types per biome)
  const biomeTreeMap = {
    'plains': ['tree', 'tree'], 'farm': ['tree', 'crate'], 'desert': ['cactus', 'rock'], 'wildwest': ['cactus', 'crate'],
    'forest': ['dead', 'tree'], 'jungle': ['organic', 'dead'], 'fairy': ['tree', 'mushroom'], 'hive': ['organic', 'mushroom'],
    'snow': ['pine', 'rock'], 'storm': ['pine', 'dead'], 'swamp': ['dead', 'organic'], 'graveyard': ['tombstone', 'dead'],
    'magma': ['rock', 'crystal'], 'volcano': ['rock', 'crystal'], 'ocean': ['coral', 'rock'], 'pirate': ['coral', 'crate'],
    'samurai': ['pillar', 'tree'], 'dungeon': ['pillar', 'pillar'], 'void': ['crystal', 'crystal'], 'cyber': ['tech', 'tech']
  };
  const biomeRockMap = {
    'plains': ['rock', 'rock'], 'farm': ['rock', 'rock'], 'desert': ['rock', 'rock'], 'wildwest': ['rock', 'crate'],
    'forest': ['rock', 'organic'], 'jungle': ['organic', 'organic'], 'fairy': ['mushroom', 'crystal'],
    'snow': ['crystal', 'crystal'], 'magma': ['crystal', 'rock'], 'ocean': ['rock', 'coral'], 'pirate': ['crate', 'rock'],
    'samurai': ['pillar', 'rock'], 'dungeon': ['pillar', 'pillar'], 'void': ['crystal', 'crystal'], 'cyber': ['pillar', 'tech']
  };

  const treeOpts = biomeTreeMap[biomeId] || ['tree', 'rock'];
  const rockOpts = biomeRockMap[biomeId] || ['rock', 'crystal'];

  const c = new THREE.Color(GameState.pBiome.col);
  const treeCol1 = new THREE.Color(c).offsetHSL(0.08, 0.15, 0.02).getHex();
  const treeCol2 = new THREE.Color(c).offsetHSL(-0.05, 0.08, -0.05).getHex();
  const rockCol1 = new THREE.Color(GameState.pBiome.fog).offsetHSL(-0.04, -0.1, -0.15).getHex();
  const rockCol2 = new THREE.Color(GameState.pBiome.fog).offsetHSL(0.02, 0.05, 0.1).getHex();
  const grassCol = new THREE.Color(c).offsetHSL(0.02, 0.1, -0.1).getHex();

  const noGrassBiomes = ['dungeon', 'prison', 'mine', 'library', 'asylum', 'museum', 'magma', 'volcano', 'core', 'void', 'shadow', 'abyss', 'warp', 'chaos', 'omega', 'cyber', 'steampunk', 'clockwork', 'lab', 'alien', 'web'];
  const hasGrass = !noGrassBiomes.includes(biomeId);

  const tMat1 = getScenerySpriteMat(`${treeOpts[0]}@${biomeId}`, treeCol1);
  const tMat2 = getScenerySpriteMat(`${treeOpts[1]}@${biomeId}`, treeCol2);
  const rMat1 = getScenerySpriteMat(`${rockOpts[0]}@${biomeId}`, rockCol1);
  const rMat2 = getScenerySpriteMat(`${rockOpts[1]}@${biomeId}`, rockCol2);
  const gMat = hasGrass ? getScenerySpriteMat('grass', grassCol, { depthWrite: false }) : null;

  const indoorBiomes = ['dungeon', 'prison', 'mine', 'library', 'asylum', 'museum', 'lab', 'kitchen', 'crypt'];
  const isIndoor = indoorBiomes.includes(biomeId) || fx.terrainArchetype === 'maze';
  const treeFactor = isIndoor ? 0.15 : 1;
  const rockFactor = isIndoor ? 0.45 : 1;
  const grassFactor = isIndoor ? 0.0 : 1;

  // Dense trees with clustering for natural grouping
  const treeCount = Math.floor(fx.treeDensity * 1.05 * spriteDensityMult * treeFactor);
  for (let i = 0; i < treeCount; i++) {
    const clusterIdx = Math.floor(i / 4);
    const inCluster = i % 4;
    const h1 = hash(cx * 0.07 + cz * 0.13 + clusterIdx * 11), h2 = hash(cx * 0.21 - cz * 0.09 + clusterIdx * 17);
    let lx = (h1 - 0.5) * CHUNK_SZ * 0.85, lz = (h2 - 0.5) * CHUNK_SZ * 0.85;
    // Cluster offset: trees grouped together naturally
    if (inCluster > 0) {
      const coff = hash(clusterIdx * 31 + inCluster);
      lx += (coff - 0.5) * 12;
      lz += (hash(clusterIdx * 37 + inCluster) - 0.5) * 12;
    }
    const h = terrainH(cx + lx, cz + lz);
    const s = 5 + hash(i * 3) * 5;
    const tMat = hash(i * 7) < 0.5 ? tMat1 : tMat2;
    const sp = new THREE.Sprite(tMat);
    sp.center.set(0.5, 0);
    sp.position.set(lx, h, lz);
    sp.scale.set(s, s, 1);
    grp.add(sp);
  }

  // Dense rocks with clustering
  const rockCount = Math.floor(fx.rockDensity * 1.05 * spriteDensityMult * rockFactor);
  for (let i = 0; i < rockCount; i++) {
    const clusterIdx = Math.floor(i / 3);
    const inCluster = i % 3;
    const h1 = hash(cx * 0.15 + cz * 0.08 + clusterIdx * 13), h2 = hash(cx * 0.11 - cz * 0.19 + clusterIdx * 23);
    let lx = (h1 - 0.5) * CHUNK_SZ * 0.88, lz = (h2 - 0.5) * CHUNK_SZ * 0.88;
    // Cluster offset: rocks grouped together naturally
    if (inCluster > 0) {
      const coff = hash(clusterIdx * 29 + inCluster);
      lx += (coff - 0.5) * 10;
      lz += (hash(clusterIdx * 41 + inCluster) - 0.5) * 10;
    }
    const h = terrainH(cx + lx, cz + lz);
    const s = 0.8 + hash(i * 2) * 2.2;
    const rMat = hash(i * 5) < 0.5 ? rMat1 : rMat2;
    const sp = new THREE.Sprite(rMat);
    sp.center.set(0.5, 0);
    sp.position.set(lx, h, lz);
    sp.scale.set(s, s, 1);
    grp.add(sp);
  }

  // Grass
  if (gMat) {
    const grassCount = Math.floor(fx.grassDensity * 0.30 * spriteDensityMult * grassFactor);
    for (let i = 0; i < grassCount; i++) {
      const h1 = hash(cx * 0.12 - cz * 0.06 + i * 3.3), h2 = hash(cx * 0.08 + cz * 0.14 + i * 9.1);
      const lx = (h1 - 0.5) * CHUNK_SZ, lz = (h2 - 0.5) * CHUNK_SZ;
      const h = terrainH(cx + lx, cz + lz);
      const sp = new THREE.Sprite(gMat);
      sp.center.set(0.5, 0);
      sp.position.set(lx, h, lz);
      sp.scale.set(1.2, 1.2, 1);
      grp.add(sp);
    }
  }

  // Unique complex structures per biome with collisions
  const structChanceByBiome = {
    'plains': 0.24, 'farm': 0.28, 'desert': 0.18, 'wildwest': 0.22, 'forest': 0.14, 'jungle': 0.16,
    'fairy': 0.20, 'hive': 0.12, 'snow': 0.16, 'storm': 0.14, 'swamp': 0.15, 'graveyard': 0.20,
    'magma': 0.10, 'volcano': 0.10, 'ocean': 0.12, 'pirate': 0.18, 'samurai': 0.22, 'dungeon': 0.25,
    'void': 0.08, 'cyber': 0.26, 'steampunk': 0.24, 'clockwork': 0.23, 'lab': 0.22, 'alien': 0.20,
    'sky': 0.18, 'heavens': 0.15, 'candy': 0.20, 'toy': 0.22, 'circus': 0.18,
    'kitchen': 0.20, 'library': 0.24, 'museum': 0.22, 'music': 0.18, 'asylum': 0.18, 'prehistoric': 0.16, 'core': 0.12
  };

  const structChance = structChanceByBiome[biomeId] || 0.20;
  const structCount = Math.floor((structChance * 3) + 0.5); // 0-3 structures per chunk based on Biome

  for (let s = 0; s < structCount; s++) {
    const seed4struct = hash(cx * 11 + cz * 13 + s * 17);
    if (hash(seed4struct) > structChance) continue; // Early exit based on chance

    // Deterministic unique-ish structure position within chunk
    const structX = (hash(seed4struct * 2.1) - 0.5) * CHUNK_SZ * 0.7;
    const structZ = (hash(seed4struct * 3.3) - 0.5) * CHUNK_SZ * 0.7;
    const h = terrainH(cx + structX, cz + structZ);

    // Select structure type based on biome seed
    const numStructTypes = Math.floor(hash(seed4struct * 7.1) * 3) + 0; // 0-2 structure types per biome
    const structType = Math.min(2, numStructTypes);

    // Build the structure with collisions
    const { mesh, colliders: boxes } = buildStructure(biomeId, structType, 0, 0, 0);
    
    // Position structure
    mesh.position.set(structX, h, structZ);
    grp.add(mesh);

    // Add collision boxes to world colliders with chunk key
    if (boxes && boxes.length > 0) {
      boxes.forEach(box => {
        // Translate box to world coordinates
        const worldBox = new THREE.Box3();
        worldBox.copy(box);
        const offset = new THREE.Vector3(cx + structX, h, cz + structZ);
        worldBox.translate(offset);
        colliders.push({
          box: worldBox,
          chunkKey: `${Math.round(cx / CHUNK_SZ)},${Math.round(cz / CHUNK_SZ)}`
        });
      });
    }
  }
}
