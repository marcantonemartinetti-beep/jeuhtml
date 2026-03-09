// ═══════════════════════════════════════════════
// DUNGEON WORLD - Environment & Biome Effects
// ═══════════════════════════════════════════════

// ==================== BIOME HAZARD ====================
let biomeHazardTimer = 4.0;

function applyBiomeHazard(dt) {
  if (!GameState || !GameState.biomeFx || !GameState.gameRunning || GameState.levelingUp) return;
  if (GameState.biomeSlowTimer > 0) GameState.biomeSlowTimer = Math.max(0, GameState.biomeSlowTimer - dt);
  if (GameState.finalBossSpawned) return;

  biomeHazardTimer -= dt;
  if (biomeHazardTimer > 0) return;

  const fx = GameState.biomeFx;
  biomeHazardTimer = fx.hazardInterval;
  const rawDmg = 2.0 * fx.hazardPower * (1 + (GameState.pBiome ? (GameState.pBiome.diff - 1) * 0.08 : 0));
  const dmg = Math.max(0.5, rawDmg * (1 - Math.min(0.8, GameState.pDmgRed || 0)));

  if (fx.hazardType === 'burn') {
    GameState.pHP -= dmg;
    spawnPart(playerPivot.position.clone(), 0xff5522, 6, 3);
  } else if (fx.hazardType === 'frost') {
    GameState.biomeSlowTimer = Math.max(GameState.biomeSlowTimer || 0, 1.8);
    spawnPart(playerPivot.position.clone(), 0xaaddff, 5, 2.5);
  } else if (fx.hazardType === 'poison') {
    GameState.pHP -= dmg * 0.85;
    spawnPart(playerPivot.position.clone(), 0x44aa44, 6, 2.2);
  } else if (fx.hazardType === 'tide') {
    const dir = fwd().setY(0).normalize();
    playerPivot.position.addScaledVector(dir, -0.8 * fx.hazardPower);
    spawnPart(playerPivot.position.clone(), 0x44aaff, 5, 2.0);
  } else if (fx.hazardType === 'voidPulse') {
    GameState.pHP -= dmg * 0.65;
    playerPivot.position.x += (Math.random() - 0.5) * 1.2;
    playerPivot.position.z += (Math.random() - 0.5) * 1.2;
    spawnPart(playerPivot.position.clone(), 0xaa00ff, 7, 3.2);
  } else if (fx.hazardType === 'overload') {
    GameState.pHP -= dmg * 0.5;
    if (typeof window.addScreenShake === 'function') window.addScreenShake(0.05);
    spawnPart(playerPivot.position.clone(), 0x00ffaa, 6, 2.6);
  } else if (fx.hazardType === 'sand') {
    GameState.biomeSlowTimer = Math.max(GameState.biomeSlowTimer || 0, 1.2);
    spawnPart(playerPivot.position.clone(), 0xccaa66, 4, 1.8);
  }

  if (GameState.pHP <= 0) gameOver();
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
    return;
  }

  GameState.dayTimer += dt;
  if (GameState.dayTimer > GameState.dayDuration) GameState.dayTimer = 0;
  const f = GameState.dayTimer / GameState.dayDuration;
  const top = new THREE.Color(), bot = new THREE.Color();

  if (f < 0.25) {
    top.setHex(0x050520); bot.setHex(0x1a2a3a);
  } else if (f < 0.5) {
    top.setHex(0x7ab0d8); bot.setHex(0xc0d8e8);
  } else if (f < 0.75) {
    top.setHex(0xffa060); bot.setHex(0xf0d0a0);
  } else {
    top.setHex(0x0a0a2a); bot.setHex(0x1a2a3a);
  }
  skyMat.uniforms.tC.value.lerp(top, dt);
  skyMat.uniforms.bC.value.lerp(bot, dt);
  skyMat.uniforms.bC.value.setHex(GameState.pBiome ? GameState.pBiome.fog : 0x7ab0d8);
  if (GameState.pBiome) {
    scene.fog.color.setHex(GameState.pBiome.fog);
    renderer.setClearColor(GameState.pBiome.fog);
  }
}

// ==================== BIOME VISUALS ====================
function refreshBiomeVisuals() {
  if (!GameState.pBiome) return;

  if (scene && scene.fog) scene.fog.color.setHex(GameState.pBiome.fog);
  if (renderer) renderer.setClearColor(GameState.pBiome.fog);

  // Lightweight terrain texture refresh when biome changes between loops.
  const s = 128;
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const ctx = c.getContext('2d');
  const col = new THREE.Color(GameState.pBiome.col);
  ctx.fillStyle = '#' + col.getHexString();
  ctx.fillRect(0, 0, s, s);
  const id = ctx.getImageData(0, 0, s, s), d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 30;
    d[i] = Math.min(255, Math.max(0, d[i] + n));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n));
  }
  ctx.putImageData(id, 0, 0);
  if (groundTex) groundTex.dispose();
  groundTex = new THREE.CanvasTexture(c);
  groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(8, 8);
}
