# 🏗️ DUNGEON WORLD - ARCHITECTURE & DOCUMENTATION

## 📋 TABLE DES MATIÈRES
1. [Vue d'ensemble](#vue-densemble)
2. [Structure des fichiers](#structure-des-fichiers)
3. [Systèmes principaux](#systèmes-principaux)
4. [Flux de données](#flux-de-données)
5. [Guide de modification](#guide-de-modification)

---

## 🎯 VUE D'ENSEMBLE

**Dungeon World** est un roguelite FPS/TPS 3D basé sur Three.js avec :
- **Modules runtime + modules de configuration séparés** (architecture modulaire v0.4.0)
- **Architecture modulaire** avec séparation claire des préoccupations
- **Système de biomes procéduraux** avec génération de terrain adaptative
- **Combat temps réel** avec armes multiples et passifs

**Technologies** : Three.js, JavaScript vanille, HTML5 Canvas

**⚠️ Note de version :**  
Depuis la v0.4.0, les grandes configurations ont été extraites de `data.js` vers des modules dédiés :
- `classes-config.js`
- `biomes-list-config.js`
- `biomes-config.js`
- `weapons-config.js`
- `upgrades-config.js`
- `monsters-config.js`
- `perm-upgrades-config.js`
- `cosmetics-config.js`
- `game-state-config.js`

---

## 📁 STRUCTURE DES FICHIERS

### **index.html** (Point d'entrée)
- Interface utilisateur complète
- Menu principal, sélection de classe/biome
- Galerie de progression (classes, biomes, monstres)
- Paramètres et sauvegarde

### **data.js** (⚙️ Configuration & Données)
**Responsabilité** : Définitions statiques et état du jeu

#### Modules externalisés (chargés par `index.html`) :
- `classes-config.js` : `CLASSES`
- `biomes-list-config.js` : `BIOMES` (liste des mondes, mobs, boss, unlocks)
- `weapons-config.js` : `WEAPONS`, `MELEE_WEAPONS`, `RANGED_WEAPONS`, identité d'arme
- `upgrades-config.js` : `PASSIVES`, `RARITIES`, `UPGRADES`
- `monsters-config.js` : `MTYPES`
- `perm-upgrades-config.js` : `PERM_UPGRADES`
- `cosmetics-config.js` : `COSMETICS`
- `game-state-config.js` : `GameState`

#### Contenu principal :
- **CLASSES** (lignes 6-51) : 50+ classes jouables avec stats, armes, spéciaux
  - Stats de base : HP, vitesse, saut, poids
  - Classes normales (mage, chevalier, barbare...)
  - Classes boss déblocables (boss_goblin, boss_reaper...)
  
- **BIOMES** : Définitions de biomes (plains, forest, desert, dungeon...)
  - Métadonnées visuelles (couleurs, fog)
  - Difficulté et ennemis
  - Boss final

- **PERM_UPGRADES** : boutique de progression permanente (externalisé)
- **COSMETICS** : skins et palettes (externalisé)

- **GameState** : État global du jeu
  - Variables joueur (pHP, pXP, pLevel...)
  - Timers et cooldowns
  - Progression (kills, score, unlocks...)

#### Fonctions clés :
- `resetRun()` : Initialise une nouvelle partie
- `levelUp()` : Gestion du level-up UI
- `selectUpgrade(u)` : Application d'une amélioration

---

### **biomes-config.js** (🗺️ Configuration des Biomes) ✨ *NOUVEAU - v0.3.0*
**Responsabilité** : Configuration détaillée et thématique des 60+ biomes

`biomes-config.js` complète `biomes-list-config.js`:
- `biomes-list-config.js` contient le catalogue `BIOMES` (données de sélection/progression)
- `biomes-config.js` contient les profils procéduraux `getBiomeProfile()`/`biomeIdSeed()`

**Historique** : Extrait de game.js pour meilleure modularité et maintenabilité.

#### Contenu principal :

**`getBiomeProfile(biome)` - Ligne 8-281**
- **Entrée** : Objet biome avec {id, name, diff, ...}
- **Sortie** : Objet de configuration complet `fx` avec tous les paramètres
- **Logique** : Switch manuel sur `biome.id` avec 60+ cas configurés

**Paramètres retournés (objet `fx`) :**
```javascript
{
  seed,                    // Seed déterministe pour cohérence
  terrainFreq,             // Fréquence des ondulations (0.006-0.025)
  terrainDetailFreq,       // Détails secondaires
  terrainAmp,              // Amplitude/hauteur (6-40)
  detailAmp,               // Amplitude des détails (3-6)
  terrainArchetype,        // Type: wild/maze/skyPlatforms/archipelago/fracture/ridges
  treeDensity,             // Arbres par chunk (0-32)
  rockDensity,             // Rochers par chunk (0-28)
  grassDensity,            // Brins d'herbe (0-350)
  structureChance,         // Probabilité de structure (0.3-1.3)
  spriteDensityMult,       // Multiplicateur sprites décor (0.3-1.4)
  gravity,                 // Force de gravité (-10 à -25)
  playerSpeedMult,         // Modificateur vitesse joueur
  jumpMult,                // Modificateur saut (1.0-1.4)
  spawnRateMult,           // Fréquence spawn monstres
  packSizeMult,            // Taille des groupes
  mobHpMult,               // Multiplicateur PV (scaling diff)
  mobDmgMult,              // Multiplicateur dégâts (scaling diff)
  mobSpdMult,              // Multiplicateur vitesse (scaling diff)
  xpMult,                  // Multiplicateur XP (scaling diff)
  hazardType,              // Type de hazard: burn/frost/poison/tide/voidPulse/etc
  hazardInterval,          // Intervalle entre hazards (2.8-5.5s)
  hazardPower,             // Puissance hazard (1.0-2.0)
  // ... autres params
}
```

**Archétypes de terrain :**
- `wild` : Terrain naturel varié (collines, vallées)
- `maze` : Corridors intérieurs (donjons, prisons, bibliothèques)
- `skyPlatforms` : Îles flottantes (ciel, nuages)
- `archipelago` : Îles sur eau (océan, marais)
- `fracture` : Terrain cassé/chaotique (void, chaos, ruines)
- `ridges` : Crêtes/montagnes (désert/dunes, volcans, neige)

**Organisation thématique des biomes :**
```javascript
// === NATURE & WILDERNESS ===
if (id === 'plains') { /* collines vertes */ }
else if (id === 'forest') { /* arbres denses */ }
else if (id === 'jungle') { /* végétation extrême */ }

// === DESERT & ARID ===
else if (id === 'desert') { /* dunes, pyramides */ }

// === FIRE & LAVA ===
else if (id === 'volcano') { 
  fx.terrainArchetype = 'ridges';  // Montagnes volcaniques
  fx.rockDensity = 24;              // Beaucoup de rochers
  fx.treeDensity = 0;               // Pas d'arbres
  fx.hazardType = 'burn';           // Dégâts de feu périodiques
  fx.hazardPower = 1.5;             // 150% puissance
}

// === MUSIC & HARMONY (EXEMPLE SPÉCIAL) ===
else if (id === 'music') {
  fx.terrainFreq = 0.025;           // Ondulations rapides (vagues harmoniques)
  fx.terrainAmp = 18;               // Amplitude moyenne
  fx.terrainArchetype = 'wild';     // Terrain fluide
  fx.detailAmp = 6;                 // Détails prononcés (notes)
  fx.structureChance = 0.85;        // Beaucoup d'instruments
  fx.gravity = -18;                 // Gravité réduite (légèreté)
}

// === VOID & ABSTRACT ===
else if (id === 'abyss') { /* fractures profondes, void pulse */ }
```

**`biomeIdSeed(id)` - Ligne 288-293**
- Génère seed déterministe depuis string ID
- Utilisé pour consistance visuelle du biome
- Hash simple : `(s * 131 + charCode) % 1000003`

**Scaling de difficulté :**
```javascript
// Après la configuration manuelle, scaling automatique par diff
const diff = biome.diff;
fx.mobHpMult = 0.85 + diff * 0.15;    // +15% PV par diff
fx.mobDmgMult = 0.9 + diff * 0.12;    // +12% dmg par diff
fx.xpMult = 0.9 + diff * 0.08;        // +8% XP par diff
fx.eliteBossTime = Math.max(240, 340 - diff * 8); // Boss + rapide
```

**Utilisation :**
```javascript
// Dans game.js, au début d'un run
const biomeProfile = getBiomeProfile(currentBiome);
// Ensuite utilisé dans:
// - createChunk() pour terrain
// - populateChunk() pour végétation
// - doSpawn() pour ennemis
// - applyBiomeHazard() pour environnement
```

**Avantages de la modularité :**
- ✅ Séparation de responsabilité (config ≠ logique)
- ✅ Facilité de modification (1 fichier dédié)
- ✅ Meilleure lisibilité (organisation thématique)
- ✅ Réduction taille game.js (300 lignes extraites)

---

### **game.js** (🎮 Moteur Principal)
**Responsabilité** : Boucle de jeu, rendu, terrain, physique

#### Sections principales :

**1. Configuration & Variables Globales (lignes 1-43)**
- Caméra : `camYaw`, `camPitch`
- Scène Three.js : `scene`, `camera`, `renderer`
- Collections d'entités : `monsters`, `projectiles`, `particles`, `chests`, `xpOrbs`
- Inputs : `keys{}`, `mDown{}`, `keyState{}`

**2. Matériaux & Géométries Réutilisables (lignes 46-100)**
- `GEOS` : Box, cylinder, sphere partagés
- `MATS` : Matériaux cachés (stone, wood, ice, gold...)
- `getScenerySpriteMat()` : Cache de materials pour sprites

**3. Système de Terrain (lignes 102-180)**
- `createChunk(cx, cz)` : Génère un chunk 60x60
  - Lit `terrainH()` depuis utils.js
  - Applique vertex displacement
  - Ajoute eau/plafond selon archetype
- `updateTerrain(px, pz)` : Streaming de chunks
  - Charge chunks visibles (DRAW_DIST)
  - Dispose chunks hors range
  - Gère colliders

**4. Génération de Structures (lignes 181-655)**
- `buildStructure(biome, type, x, z, h)` : Construit bâtiments thématiques
  - Samurai : Torii gates, pagodas
  - Medieval : Castles, towers, houses
  - Dungeon : Pillars, torches, altars
  - Desert : Pyramids, obelisks
  - 30+ types différents

- `populateChunk(grp, cx, cz)` : Remplit chunk de scenery
  - Trees, rocks, crystals, grass sprites
  - Densité adaptative selon biome profile
  - Billboard sprites optimisés

**5. Utilisation des Biomes (anciennement lignes 456-746, maintenant externalisé)**
- ⚠️ **`getBiomeProfile(biome)` déplacé dans biomes-config.js**
- `game.js` utilise maintenant le module externe pour obtenir les profiles
- Consommation du profile :
  - `createChunk()` lit `terrainFreq`, `terrainAmp`, `terrainArchetype`
  - `populateChunk()` lit `treeDensity`, `grassDensity`, `rockDensity`
  - `doSpawn()` lit `spawnRateMult`, `packSizeMult`
  - `applyBiomeHazard()` lit `hazardType`, `hazardInterval`, `hazardPower`

**6. Spawn & Combat (lignes 762-850)**
- `doSpawn()` : Spawn vagues de monstres
  - Cap de 35-50 monstres max (évite freeze)
  - Baseline + difficulté croissante
- `checkBoss()` : Déclenche boss
  - Elite boss à 300s (5min)
  - Mini-boss tous les 15 kills
- `applyBiomeHazard(dt)` : Effets environnementaux
  - burn, frost, poison, tide, voidPulse...

**7. Boucle Principale `loop()` (lignes 1285-1620)**
```
requestAnimationFrame → 
  Modes spéciaux (gallery, preview) →
  Update dt →
  Fire weapons (handleFire) →
  Input movement (WASD) →
  Dash logic →
  Physics (gravity, collision) →
  Entity updates (monsters, projectiles, particles) →
  Passives update →
  Camera update (1st/3rd person) →
  Render
```

**8. Caméra (lignes 1525-1600)**
- **1st Person** : FPS classique
  - Position = playerPivot + offset Y
  - Rotation = Euler(camPitch, camYaw, 0)
- **3rd Person** : Caméra orbite
  - Distance 4m, suit rotation
  - Anti-clip sol
  - Rotation personnage vers direction de mouvement
  - Billboard sprites face caméra

**9. UI & HUD (lignes 1590-1620)**
- `drawMinimap()` : Canvas 2D minimap
- `updHUD()` : HP/XP bars, niveau, frenzy timer

---

### **entities.js** (👾 Monstres & Joueur)
**Responsabilité** : Construction et comportement des entités

#### Sections :

**1. buildPuppet(T)** (lignes 6-1698)
Construction procédurale de modèles 3D à partir de sprites
- **Formes de base** : blob, flyer, spider, worm, beast, human, necro...
- **Détails conditionnels** :
  - Armes (épée, staff, arc) si guerrier/mage/archer
  - Ailes si volant/dragon/ange
  - Queue si beast/dragon/lézard
  - Capuche si mage/voleur
  - Armure si chevalier/tank
- **50+ variantes** avec détection de mots-clés dans le nom
- **Accessoires** : Casques, barbes, cornes, halos, couronnes...

**2. animPuppet(p, t, moving, S, shape)** (lignes 1700-2492)
Animation procédurale des puppets
- Respiration (idle breathing)
- Marche (leg swing, arm swing, head bob)
- Animations spéciales par forme
  - Spider : pattes ondulent
  - Flyer : ailes battent
  - Worm : ondulation segments

**3. Class Monster** (lignes 2494-2916)
Logique complète des ennemis
- **Constructor** : Choix type, spawn position, barre de vie
- **update(dt, pp)** : IA et mouvement
  - Follow player (A* simplifié)
  - Attaque au contact
  - Stagger/knockback
  - Death & XP drop
- **takeDmg(dmg, crit, kb, src)** : Réception dégâts
  - Damage numbers
  - Invincibility frames
  - Blood particles
  - Combo system
- **makeBoss() / makeFinalBoss()** : Transformation en boss
  - Stats x3-5
  - Taille augmentée
  - Barre de boss UI

**4. buildPlayerModel(cls)** (lignes 2919-2985)
Construction du modèle joueur 3ème personne
- Utilise `buildPuppet()` avec data de classe
- Détection thème : barbarian, necro, ranger, paladin...
- Couleurs adaptées à la classe

---

### **abilities.js** (⚔️ Combat & Capacités)
**Responsabilité** : Armes, projectiles, passifs, spéciaux

#### Sections :

**1. Utilitaires (lignes 1-44)**
- `fwd()` : Direction forward depuis caméra (Euler)
- `spawnPos()` : Position devant joueur
- `getPlayerDmg(wep, dist)` : Calcul dégâts avec modificateurs
  - Weapon paths (power/control/chaos)
  - Crit, low HP bonus, sniper distance...

**2. Melee Telegraph (lignes 45-126)**
- `spawnMeleeTelegraph(wep)` : Affiche zone de mêlée
  - Arc circulaire selon arme
  - Fade in/out rapide
- `updateMeleeTelegraphs(dt)` : Update et cleanup
- `useMelee(wep)` : Hit detection arc de mêlée
  - Dot product pour angle check
  - Multiple hits dans l'arc

**3. Fire Functions (lignes 127-675)**
Une fonction par armeexemple : `fireScepter()`, `fireBow()`, `fireBoomerang()`...
- Crée projectiles avec comportements personnalisés
- Applique weapon identity (accel, drag, split...)
- Spawn particles & effets visuels

**4. Weapon Visuals (lignes 677-708)**
- `updateOrbVisuals()` : Orbite guardian orb
- `updateShieldVisuals()` : Shield rotation
- `updateAuraVisuals()` : Aura pulse

**5. Passives Update (lignes 710-954)**
- `updatePassives(dt)` : Tick tous les passifs actifs
  - Orb/Dagger auto-fire
  - Turret targeting
  - Rift portals
  - Lightning strikes
  - Mirror orb reflect

**6. Weapon 3D Builder (lignes 957-1390)**
- `buildWeapon3D(type, level, isFirstPerson)` : Construction armes 3D
  - 30+ types d'armes uniques
  - Blade, handle, guard, tip, gem...
  - Première/troisième personne

**7. Viewmodel (lignes 1391-1534)**
- `createVM(type)` : Crée viewmodel 1ère personne
- `updateWeaponVisuals()` : Sync état armes

**8. Fire Handler (lignes 1536-1590)**
- `handleFire()` : Détecte clicks/touches
  - Dispatch vers bonne fire function
  - Gère cooldowns

**9. Special Abilities (lignes 1592-fin)**
- `triggerSpecial()` : Compétences Q
  - Teleport (mage)
  - Shield (knight)
  - War Cry (barbarian)
  - 50+ variantes

---

### **projectiles.js** (💥 Projectiles & Effets)
**Responsabilité** : Gestion bullets, particles, chests, XP

#### Sections :

**1. Object Pools (lignes 5-42)**
- `projPool[]` : Réutilisation meshes projectiles (50 max)
- `partPool[]` : Particules recyclées
- `dmgNumPool[]` : Damage numbers recyclés
- Réduit GC pauses

**2. Class Proj** (lignes 56-276)
Projectile avec physique & comportements
- **Constructor** : Position, direction, dégâts, couleur, vitesse, lifetime
- **update(dt, pp)** : Physique frame-by-frame
  - Gravity (arcs)
  - Homing (seek targets)
  - Acceleration/drag
  - Zigzag motion
  - Bouncing off terrain
  - Split projectiles
  - Blast radius
- **Collision** : Monsters hit detection sphere
- **Chain lightning** : Saute entre ennemis
- **Boomerang** : Return to player

**3. Class Chest** (lignes 278-315)
Coffres avec loot
- Spawn aléatoire autour joueur
- Animation flottante (bobbing)
- Ouvre près joueur → Gold

**4. Class XPOrb** (lignes 317-354)
Orbes d'XP
- Drop au death monstre
- Attiré vers joueur (magnetic)
- Pickup range

**5. Particle System** (lignes 357-384)
- `spawnPart(pos, col, n, spd)` : Explosion particules
  - Vélocité aléatoire
  - Gravité
  - Fade out
- `updPart(dt)` : Update tous les particles
  - Recycle au lieu de delete

**6. Damage Numbers** (lignes 386-441)
- `addDmgNum(pos, dmg, crit)` : Affiche nombre 3D
  - Canvas texture dynamique
  - Jaune si crit, rouge sinon
  - Monte et fade

---

### **ui.js** (🖼️ Interface Utilisateur)
**Responsabilité** : Menus, level-up, settings, sauvegardes

#### Sections principales :

**1. Menu Principal & Navigation**
- Sélection classe/biome
- Run modifiers (Frenzy x2, Hardcore, Chaos...)
- Progression totale (kills, score high, runs)

**2. Level-Up System (lignes 100-450)**
- `showLevelUp()` : Affiche 3 cartes d'upgrade
  - Pool général (UPGRADES)
  - **Weapon Path Upgrades** dynamiques :
    - Génère 3 branches par arme
    - Power/Control/Chaos avec effets uniques
    - Requirements safe avec `canUseUpgrade(u)`
- `selectCard()` : Application upgrade + reroll logic

**3. Galerie de Progression**
- Classes unlockées
- Biomes découverts
- Monstres rencontrés (cartes collectibles)

**4. Settings**
- Particles (high/med/low)
- FOV
- Third person toggle
- Save/Load

**5. Pause Menu**
- Resume/Main Menu
- Affiche stats run

---

### **utils.js** (🛠️ Utilitaires & Génération)
**Responsabilité** : Bruit, terrain, textures, sprites

#### Sections :

**1. Noise Functions (lignes 6-35)**
- `hash(n)` : Pseudo-random deterministic
- `noise2(x, z)` : Perlin-like noise 2D
- `octave(x, z, oct, lac, gain)` : Fractional Brownian Motion
  - Multi-octaves pour détails

**2. Terrain Height (lignes 41-167)**
- `terrainH(x, z)` : Hauteur monde en fonction position
  - Lit `currentBiomeProfile`
  - **Archetypes** :
    - **'wild'** : Terrain organique classique (noise)
    - **'maze'** : Labyrinthe avec murs/couloirs
    - **'skyPlatforms'** : Plateformes flottantes étagées
    - **'archipelago'** : Îles séparées par eau
    - **'fracture'** : Terrain fragmenté avec fissures
    - **'ridges'** : Crêtes montagneuses
    - **'flat'** : Plat pour intérieurs (dungeon, library...)
  - Layout modes (radial, linear, cellular...)

**3. Texture Generation (lignes 169-203)**
- `genTex(hex, type)` : Canvas textures procédurales
  - Noise, gradient, grid, brick...
  - Cached dans `texCache{}`

**4. Sprite System (lignes 204-319)**
- `getSpTex(c, shp)` : Texture sprite par forme
  - circle, tri, diamond, star, arrow, shuriken, box
  - 2 jeux : opaque + outline
- `mkSprite(c, w, h, shp)` : Crée sprite mesh
  - Material cached
  - Double-sided, transparent

**5. Scenery Textures (lignes 322-442)**
- `getSceneryTex(type, col)` : Textures props
  - tree, rock, crystal, mushroom, torch, skull...
  - Canvas 2D stylisés

**6. Weapon Textures (lignes 444-fin)**
- `getWeaponTex(type, level)` : Icons armes
  - Génération procédurale selon type
  - Couleur level-based

---

## 🔄 FLUX DE DONNÉES

### Démarrage du jeu
```
index.html load →
  data.js parsed (GameState init) →
  game.js init() →
    Three.js setup →
    Load save data →
    UI.buildMenus() →
  User select class/biome →
    data.resetRun() →
    game.startRun() →
      Terrain generation starts →
      Player spawns →
      loop() begins
```

### Boucle de jeu (60 FPS)
```
requestAnimationFrame →
  clock.getDelta() →
  Input handling (keys, mouse) →
  abilities.handleFire() → projectiles spawn →
  Player physics (movement, gravity, collision) →
  monsters.forEach(m => m.update()) →
    AI pathfinding →
    Attack player →
    Check death →
  projectiles.forEach(p => p.update()) →
    Physics →
    Hit detection →
    Remove if expired →
  abilities.updatePassives() →
    Orb, turret, aura tick →
  updPart() → particles fade →
  Camera update (1st/3rd person) →
  renderer.render(scene, camera)
```

### Level Up
```
Monster death →
  XP orb spawn →
  Player collects →
    GameState.pXP += amount →
    if (pXP >= pXPReq) →
      ui.showLevelUp() →
        Generate 3 upgrade cards →
        Pause game →
      User clicks card →
        data.selectUpgrade(u) →
          Apply stat changes →
          Activate new passive →
          Update UI →
        Resume game
```

### Biome Generation
```
game.startRun(biomeId) →
  data.js: Find BIOMES[biomeId] →
  game.getBiomeProfile(biome) →
    Procedural config generation →
    terrain archetype, spawn rate, hazards... →
  utils.setTerrainBiomeProfile(profile) →
  game.updateTerrain(0, 0) →
    createChunk() loops →
      Read terrainH(x, z) →
        Apply archetype logic →
      Mesh vertex displacement →
      populateChunk() →
        buildStructure() x N →
        Spawn trees/props →
```

---

## 🔧 GUIDE DE MODIFICATION

### Ajouter une nouvelle arme
1. **data.js** : Ajouter dans `WEAPONS`
```js
MYGUN: {name:'My Gun', dmg:25, cd:0.3, active:false, ...}
```
2. **abilities.js** : Créer `fireMyGun()`
```js
function fireMyGun() {
  const dir = fwd();
  projectiles.push(new Proj(spawnPos(), dir, dmg, color, speed, life));
}
```
3. **abilities.js** : Ajouter case dans `handleFire()`
4. **abilities.js** : Ajouter case dans `buildWeapon3D()`
5. **utils.js** : Ajouter texture dans `getWeaponTex()`

### Ajouter une nouvelle classe
1. **data.js** : Ajouter dans `CLASSES`
```js
{id:'myclass', name:'My Class', hp:100, spd:7, wep:'sword', ...}
```
2. **entities.js** : (Optionnel) Ajouter détection thème dans `buildPuppet()` si style unique

### Créer un nouveau biome
1. **data.js** : Ajouter dans `BIOMES`
```js
{id:'mybiome', name:'My Biome', diff:5, fog:0x112233, mobs:['goblin','orc'], boss:'MyBossName'}
```
2. **biomes-config.js** ✨ : Configurer dans `getBiomeProfile()`
```js
if (biome.id === 'mybiome') {
  fx.terrainArchetype = 'maze';  // Type: wild/maze/skyPlatforms/archipelago/fracture/ridges
  fx.terrainFreq = 0.015;
  fx.terrainAmp = 20;
  fx.treeDensity = 10;
  fx.grassDensity = 150;
  fx.structureChance = 0.7;
  fx.hazardType = 'poison';      // burn/frost/poison/tide/voidPulse/etc
  fx.gravity = -22;
  // ... voir biomes-config.js pour tous les paramètres
}
```
3. **game.js** : Ajouter structures dans `buildStructure()`
4. **game.js** : Ajouter scenery dans `populateChunk()`

### Ajouter un upgrade
1. **data.js** : Ajouter dans `UPGRADES`
```js
{
  name:'Mon Upgrade',
  desc:'Description',
  icon:'fa-icon',
  rarity:2,
  apply:() => { GameState.myBonus += 10; },
  req: s => s.pLevel > 5 // optional requirement
}
```

### Modifier la génération de terrain
1. **utils.js** : Modifier `terrainH(x, z)`
   - Changer archetype logic (maze, skyPlatforms...)
   - Ajuster noise parameters
2. **game.js** : Modifier `getBiomeProfile()` params
   - `terrainFreq`, `terrainAmp`, `detailAmp`
   - `terrainArchetype`

---

## 🐛 BUGS CONNUS & FIXES

### ✅ Résolu : Game Freeze après quelques secondes
**Cause** : Spawn exponentiel de monstres sans limite
**Fix** : Cap de 35-50 monstres max dans `doSpawn()` (game.js:769)

### ✅ Résolu : Caméra inversée
**Cause** : Pas de limite sur pitch rotation
**Fix** : Clamp pitch à ±1.4 rad (±80°) (game.js:1773)

### ✅ Résolu : Barre de vie verte
**Fix** : Changée en rouge 0xff0000 (entities.js:2573)

---

## 📊 STATISTIQUES DU PROJET

- **Lignes de code** : ~12,000+
- **Fichiers JS** : 7 principaux
- **Classes jouables** : 50+
- **Biomes** : 60+
- **Types de monstres** : 200+
- **Armes** : 40+
- **Passifs** : 20+
- **Upgrades** : 100+

---

## 🎨 PROCHAINES AMÉLIORATIONS

### Priorité Haute
1. ✅ **Optimisation spawn monstres** (fait)
2. ✅ **Fix caméra** (fait)
3. 🔄 **Biome generation thématique cohérente**
   - Repenser chaque biome pour coller au thème
   - Terrain adaptatif vraiment lié au lore
4. **Fragmentation du code**
   - Séparer biome configs dans fichier dédié
   - Extraction weapon definitions

### Améliorations Futures
- Sauvegarde cloud
- Multijoueur co-op
- Boss patterns plus complexes
- Système de crafting
- Achievements détaillés

---

**Dernière mise à jour** : 6 mars 2026
**Mainteneur** : GitHub Copilot AI Assistant
