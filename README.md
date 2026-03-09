# DUNGEON WORLD - Guide de Développement

## 📁 Structure du Projet

### Fichiers Principaux
- **index.html** - Point d'entrée de l'application
- **styles.css** - Styles visuels et UI

### Modules JavaScript (dans l'ordre de chargement)

1. **data.js** (Configuration de base)
   - Classes jouables (CLASSES)
   - Biomes et leur métadonnées (BIOMES)
   - Armes (WEAPONS)
   - Améliorations (UPGRADES)
   - Passifs (PASSIVES)
   - Monstres et boss

2. **utils.js** (Outils de génération)
   - Fonctions de noise pour terrain procédural
   - Hash pour génération déterministe
   - Utils mathématiques

3. **biomes-config.js** ✨ *NOUVEAU - Modulaire*
   - Configuration détaillée de tous les 60+ biomes
   - Fonction `getBiomeProfile(biome)` - paramètres par biome
   - Fonction `biomeIdSeed(id)` - seeds déterministes
   - Paramètres : terrain, végétation, structures, gravité, hazards

4. **entities.js** (Entités du jeu)
   - Classe Player (joueur)
   - Classe Monster (ennemis)
   - Gestion des PV, collisions, IA
   - Animations et visuels

5. **projectiles.js** (Système de projectiles)
   - Balles, flèches, sorts
   - Gestion trajectoires, rebonds, explosions
   - Effets visuels

6. **abilities.js** (Capacités spéciales)
   - Dash, tourelles, familiers
   - Orbes gardiens, auras
   - Cooldowns et activations

7. **ui.js** (Interface utilisateur)
   - Menus principaux
   - HUD en jeu
   - Galerie/Codex
   - Sélection de classe

8. **game.js** (Moteur principal)
   - Boucle de jeu Three.js
   - Génération de terrain
   - Système de spawn
   - Gestion des chunks
   - Collision et physique

## 🎮 Systèmes Principaux

### Génération de Terrain

**Architecture Modulaire :**
```
biomes-config.js → getBiomeProfile(biome)
                ↓
    Retourne configuration complète
                ↓
game.js → utilise le profil pour:
          - generateChunk()
          - terrainH() depuis utils.js
          - populateChunk()
```

**Types d'archétypes de terrain :**
- `wild` : Terrain naturel varié
- `maze` : Corridors et labyrinthes
- `skyPlatforms` : Îles flottantes
- `archipelago` : Îles sur eau
- `fracture` : Terrain cassé, chaotique
- `ridges` : Montagnes et crêtes

**Exemple de configuration de biome :**
```javascript
if (id === 'volcano') {
  fx.terrainFreq = 0.012;      // Fréquence des vagues
  fx.terrainAmp = 35;           // Amplitude (hauteur)
  fx.terrainArchetype = 'ridges'; // Type de terrain
  fx.treeDensity = 0;           // Pas d'arbres
  fx.grassDensity = 0;          // Pas d'herbe
  fx.rockDensity = 24;          // Beaucoup de rochers
  fx.structureChance = 0.5;     // Structures moyennes
  fx.hazardType = 'burn';       // Hazard de feu
  fx.hazardInterval = 3.0;      // Intervalle 3s
  fx.hazardPower = 1.5;         // Puissance 150%
  fx.spriteDensityMult = 0.45;  // Peu de sprites
}
```

### Système de Combat

**Armes :**
- **Corps à corps** : range + arc (zone de swing)
- **Distance** : speed + life (portée temporelle)
- **Modificateurs** : pierce, bounce, blast, homing

**Statuts :**
- `burn` : Dégâts sur la durée (feu)
- `frost` : Ralentissement (glace)
- `poison` : Dégâts sur la durée (toxique)
- `lightning` : Chaîne sur ennemis proches

### Système de Progression

**Niveaux et XP :**
- XP par kill : basé sur difficulté du biome
- Level up → choix d'amélioration
- Améliorations : stats, armes, passifs

**Déblocages :**
- Tuer boss → débloque classe liée au biome
- Découvrir biome → ajoute à la galerie
- Complétions → achievements

## 🔧 Modifications Récentes

### Session 1 - Corrections de bugs
✅ Barre de vie ennemis rouge (au lieu de vert)
✅ Limites de caméra pour éviter l'inversion
✅ Cap sur le nombre de monstres pour éviter le freeze

### Session 2 - Documentation
✅ Fichier ARCHITECTURE.md créé (400+ lignes)
✅ Documentation complète de tous les systèmes

### Session 3 - Refonte des biomes
✅ **biomes-config.js créé** - Module dédié
✅ 60+ biomes avec configurations thématiques manuelles
✅ Suppression de la génération aléatoire par hash
✅ Archétypes de terrain assignés par thème
✅ Densités de végétation cohérentes
✅ Structures appropriées au thème
✅ Paramètres physiques (gravité, vitesse)

**Exemple : "Symphonie" (biome musique)**
- Avant : Terrain aléatoire jaune/rose plat
- Après : Terrain ondulé (vagues harmoniques), structures musicales, gravité réduite

## 📝 Comment Ajouter un Nouveau Biome

1. **Ajouter les métadonnées dans data.js**
```javascript
{
  id:'mybiome',
  name:'Mon Biome',
  col:0x123456,
  fog:0x234567,
  icon:'fa-solid fa-star',
  diff:10.0,
  mobs:[...],
  boss:'Mon Boss',
  unlockReq:'Terminer Biome Précédent'
}
```

2. **Configurer dans biomes-config.js**
```javascript
else if (id === 'mybiome') {
  fx.terrainFreq = 0.01;
  fx.terrainAmp = 20;
  fx.terrainArchetype = 'wild';
  fx.treeDensity = 10;
  fx.grassDensity = 150;
  fx.structureChance = 0.7;
  fx.gravity = -22;
  // ... autres params
}
```

3. **Ajouter sprites/structures spécifiques dans game.js**
- `buildStructure()` pour structures thématiques
- `populateChunk()` pour décoration

## 🐛 Debugging

**Outils :**
- Console navigateur (F12)
- `console.log()` dans le code
- Stats FPS : affichées dans HUD

**Problèmes Courants :**
- **Freeze** : Trop de monstres → Vérifier cap dans doSpawn()
- **Caméra inversée** : Pitch trop haut/bas → Vérifier clamp game.js:1773
- **Terrain plat** : Mauvais biome config → Vérifier biomes-config.js
- **Pas de structures** : structureChance = 0 → Augmenter la valeur

## 📊 Performance

**Optimisations :**
- Pooling des projectiles
- Chunks limités en mémoire
- Sprites instanciés (Three.js InstancedMesh)
- Cap sur monstres actifs

**Benchmarks :**
- 30-50 monstres simultanés : OK
- 100+ monstres : Risque de lag
- 200+ projectiles : Limite haute

## 🎯 Prochaines Étapes

### À Faire
- [ ] Extraire WEAPONS dans weapons-config.js
- [ ] Créer monsters-config.js pour définitions mobs
- [ ] Améliorer structures thématiques par biome
- [ ] Ajouter musiques ambientes par biome
- [ ] Système de sauvegarde cloud
- [ ] Mode multijoueur coopératif

### En Cours
- [x] Modularisation du code
- [x] Refonte complète système de biomes
- [x] Documentation technique

## 🤝 Contribution

**Standards de Code :**
- Noms en anglais pour variables
- Commentaires en français
- Indentation : 2 espaces
- Pas de `var`, utiliser `let`/`const`

**Tests Avant Commit :**
1. Lancer le jeu
2. Tester 3-4 biomes différents
3. Vérifier console (pas d'erreurs)
4. Tester combat et level up

## 📚 Ressources

- **Three.js Docs** : https://threejs.org/docs/
- **Font Awesome Icons** : https://fontawesome.com/icons
- **Noise Functions** : Simplex/Perlin noise pour terrain procédural

---

**Version :** Alpha 0.3.0  
**Dernière MAJ :** Session 3 - Refonte Biomes  
**Développeur :** Ciryl
