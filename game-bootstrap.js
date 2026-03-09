// ═══════════════════════════════════════════════
// DUNGEON WORLD - Bootstrap & Init
// ═══════════════════════════════════════════════

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
  if (typeof GameState.saveData.selectedBiomeId !== 'string') GameState.saveData.selectedBiomeId = 'plains';
  if (typeof GameState.saveData.normalUnlockTier !== 'number') GameState.saveData.normalUnlockTier = 0;
  if (!GameState.saveData.loadout || typeof GameState.saveData.loadout !== 'object') {
    GameState.saveData.loadout = { mainWeapons: [null, null, null, null, null, null], autoWeapons: [], passives: [null, null, null, null, null, null] };
  }
  if (!Array.isArray(GameState.saveData.loadout.mainWeapons)) GameState.saveData.loadout.mainWeapons = [null, null, null, null, null, null];
  while (GameState.saveData.loadout.mainWeapons.length < 6) GameState.saveData.loadout.mainWeapons.push(null);
  if (!Array.isArray(GameState.saveData.loadout.autoWeapons)) GameState.saveData.loadout.autoWeapons = [];
  if (!Array.isArray(GameState.saveData.loadout.passives)) GameState.saveData.loadout.passives = [null, null, null, null, null, null];
  if (typeof GameState.saveData.money !== 'number') GameState.saveData.money = 0;
  if (typeof GameState.saveData.gold !== 'number') GameState.saveData.gold = GameState.saveData.money;
  const unifiedCurrency = Math.max(GameState.saveData.money, GameState.saveData.gold);
  GameState.saveData.money = unifiedCurrency;
  GameState.saveData.gold = unifiedCurrency;
  if (typeof GameState.saveData.permUpgrades === 'undefined') GameState.saveData.permUpgrades = {};
  if (!Array.isArray(GameState.saveData.cards)) GameState.saveData.cards = [];
  if (!GameState.saveData.cardStacks || typeof GameState.saveData.cardStacks !== 'object') GameState.saveData.cardStacks = {};
  if (!GameState.saveData.unlockedBySpecificConditions || typeof GameState.saveData.unlockedBySpecificConditions !== 'object') {
    GameState.saveData.unlockedBySpecificConditions = {};
  }
  if (!GameState.saveData.marketRelics || typeof GameState.saveData.marketRelics !== 'object') {
    GameState.saveData.marketRelics = {};
  }

  buildStableClassMaps();
  migrateClassSaveData();
  if (typeof syncNormalClassUnlocksFromProgress === 'function') syncNormalClassUnlocksFromProgress(false);
  if (!Array.isArray(GameState.saveData.unlockedCosmetics)) GameState.saveData.unlockedCosmetics = ['default'];
  if (!GameState.saveData.equippedCosmetic) GameState.saveData.equippedCosmetic = 'default';
  if (!Array.isArray(GameState.saveData.unlockedCostumes)) GameState.saveData.unlockedCostumes = ['A'];
  if (!GameState.saveData.unlockedCostumes.includes('A')) GameState.saveData.unlockedCostumes.push('A');
  if (!GameState.saveData.selectedCostume) GameState.saveData.selectedCostume = 'A';
  if (GameState.saveData.selectedCostume === 'B' && !GameState.saveData.unlockedCostumes.includes('B')) {
    GameState.saveData.selectedCostume = 'A';
  }
  if (!GameState.saveData.settings) GameState.saveData.settings = { view: 0, particles: 1, vfxIntensity: 70 };
  if (typeof GameState.saveData.settings.vfxIntensity !== 'number') GameState.saveData.settings.vfxIntensity = 70;
  // ---------------------------------------------------------------

  if (isInitialized) return;
  isInitialized = true;
  const cv = document.getElementById('main');

  // Initialize default biome and ground texture to prevent errors before game start
  if (typeof BIOMES !== 'undefined' && BIOMES.length > 0) {
    GameState.pBiome = BIOMES[0];
    if (typeof setTerrainBiome === 'function') setTerrainBiome(GameState.pBiome.id);
    GameState.biomeFx = getBiomeProfile(GameState.pBiome);
    if (typeof setTerrainBiomeProfile === 'function') setTerrainBiomeProfile(GameState.biomeFx);
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

  // Recherche d'un point de spawn solide (évite tout départ dans le vide)
  const safeInitSpawn = findSafeSpawnPoint();
  playerPivot.position.set(safeInitSpawn.x, safeInitSpawn.h + 1.7, safeInitSpawn.z);

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
    if (e.code === 'KeyO' && playerPivot && !GameState.levelingUp && typeof spawnWorldPickupAt === 'function') {
      try {
        const fx = Math.sin(camYaw) * 2.8;
        const fz = Math.cos(camYaw) * 2.8;
        const spawnPos = new THREE.Vector3(playerPivot.position.x + fx, playerPivot.position.y, playerPivot.position.z + fz);
        spawnWorldPickupAt(spawnPos);
        addNotif('🎁 Pickup de test généré', '#ffd37a');
      } catch (err) {
        console.warn('KeyO pickup spawn failed:', err);
        try {
          const fallbackPos = playerPivot.position.clone().add(new THREE.Vector3(0, 0.6, 0));
          spawnWorldPickupAt(fallbackPos);
          addNotif('🎁 Pickup de test (fallback).', '#ffd37a');
        } catch (fallbackErr) {
          console.warn('KeyO fallback spawn failed:', fallbackErr);
          addNotif('Spawn pickup impossible (voir console).', '#ff7070');
        }
      }
    }
    if (e.code === 'KeyE') {
      attemptDash();
    }
    if (e.code === 'KeyV') {
      GameState.thirdPerson = !GameState.thirdPerson;
      addNotif(GameState.thirdPerson ? 'Vue: 3eme Personne' : 'Vue: 1ere Personne', '#ffffff');
    }
    if (e.code === 'KeyR' && GameState.gameRunning && !GameState.levelingUp) {
      GameState.autoAttackEnabled = !GameState.autoAttackEnabled;
      addNotif(
        GameState.autoAttackEnabled ? 'Auto-attaque: ON (R pour OFF)' : 'Auto-attaque: OFF (R pour ON)',
        GameState.autoAttackEnabled ? '#8ee7a5' : '#ffb070'
      );
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
    if (e.target !== cv) return;
    if (document.pointerLockElement !== cv) { cv.requestPointerLock(); return; }
    mDown[e.button] = true;
  });
  document.addEventListener('mouseup', e => { mDown[e.button] = false; });
  document.addEventListener('mousemove', e => {
    if (document.pointerLockElement !== cv) return;
    camYaw -= e.movementX * 0.0028;
    camPitch -= e.movementY * 0.0028;
    camPitch = Math.max(-1.4, Math.min(1.4, camPitch));
  });
  document.addEventListener('pointerlockchange', () => {
    const lk = document.pointerLockElement === cv;
    if (!GameState.levelingUp) document.getElementById('lkhint').style.display = lk ? 'none' : 'block';
  });
  window.addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

  loop();
}

// Auto-start when DOM is ready - wrapped for reliability
window.addEventListener('load', function() {
  setTimeout(init, 100);
});
