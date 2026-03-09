# CHANGELOG - DUNGEON WORLD

Toutes les modifications notables du projet sont documentées dans ce fichier.

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [0.3.0] - 2026-03-06 - Refonte Modulaire & Biomes Thématiques

### 🎨 Ajouté
- **biomes-config.js** - Module dédié pour configurations de biomes
  - Extraction de 300+ lignes depuis game.js
  - `getBiomeProfile(biome)` : 60+ configurations manuelles thématiques
  - `biomeIdSeed(id)` : Seed déterministe pour cohérence
- **README.md** - Guide complet de développement
  - Structure du projet détaillée
  - Exemples de code
  - Guide d'ajout de contenu
  - Standards de développement
- **index.html** - Inclusion de biomes-config.js dans l'ordre de chargement
  - Ordre: data.js → utils.js → **biomes-config.js** → entities.js → ...

### 🔄 Modifié
- **game.js** - Suppression de getBiomeProfile() et biomeIdSeed()
  - Réduction de ~300 lignes
  - Utilisation du module externe biomes-config.js
  - Meilleure séparation des responsabilités
- **ARCHITECTURE.md** - Mise à jour documentation complète
  - Nouvelle section pour biomes-config.js
  - Mise à jour "Guide de modification"
  - Ordre des fichiers ajusté (7 → 8 fichiers)
  - Documentation des archetypes de terrain

### ✨ Amélioré
- **Système de biomes** - Refonte complète des configurations
  - ❌ Avant : Génération aléatoire par hash (incohérent)
  - ✅ Après : Configurations manuelles thématiques (cohérent)
  - Archetypes assignés par thème (wild/maze/skyPlatforms/archipelago/fracture/ridges)
  - Densités de végétation appropriées (0-32 arbres, 0-350 herbe)
  - Structures thématiques (0.3-1.3 chance)
  - Paramètres physiques adaptés (gravité -10 à -25)
  - Hazards environnementaux personnalisés

**Exemple : Biome "Symphonie" (id: 'music')**
- Avant : Terrain plat rose/jaune aléatoire
- Après : Terrain ondulé (freq 0.025), structures musicales (0.85), gravité réduite (-18)

**Exemple : Biome "Volcan" (id: 'volcano')**
- Terrain : ridges (montagnes) avec amplitude 35
- Végétation : 0 arbres, 0 herbe, 24 rochers
- Hazard : burn (feu) avec power 1.5, intervalle 3.0s
- Sprites réduits (0.45x) pour performance

### 📊 Organisation des Biomes par Catégorie
- **Nature** : plains, farm, forest, jungle
- **Désert** : desert, wildwest
- **Froid** : snow, storm
- **Souterrain** : mine, sewer
- **Aquatique** : ocean, pirate, atlantis, deep
- **Mort-vivant** : graveyard, crypt, dungeon, prison
- **Ancien** : ruins, prehistoric, samurai
- **Feu** : magma, volcano, core
- **Ciel** : sky, heavens
- **Fantaisie** : candy, kitchen, toy, circus, fairy
- **Savoir** : library, museum, asylum
- **Musique** : music (symphonie)
- **Tech** : steampunk, clockwork, cyber, lab
- **Insectes** : hive
- **Cristaux** : crystal
- **Alien** : alien, web
- **Void** : void, shadow, warp, abyss, chaos, omega

---

## [0.2.0] - Session de Documentation

### 📚 Ajouté
- **ARCHITECTURE.md** - Documentation technique complète (400+ lignes)
  - Structure détaillée des 7 fichiers JS
  - Flux de données
  - Guide de modification
  - Exemples de code

---

## [0.1.0] - Corrections Critiques

### 🐛 Corrigé
- **Freeze du jeu** - Cap sur le nombre de monstres actifs
  - Ligne game.js:769 : `maxMonsters = 35 + min(15, floor(time/120))`
  - Évite accumulation exponentielle des spawns
  - Scaling progressif avec le temps (35-50 max)
  
- **Inversion de caméra** - Limites de pitch
  - Ligne game.js:1773 : `camPitch = max(-1.4, min(1.4, camPitch))`
  - Pitch limité à ±80° (±1.4 radians)
  - Évite gimbal lock et retournement
  
- **Barres de vie ennemies** - Couleur incorrecte
  - Ligne entities.js:2573 : `mkSprite(0xff0000, ...)` (rouge au lieu de vert)
  - Meilleure visibilité des HP bars
  - Cohérence avec design de menace

### 🧪 Testé
- Parties de 10+ minutes sans freeze
- Rotation caméra sur tous les axes
- Visibilité des barres de vie en combat

---

## Format du Changelog

### Types de changements
- **Ajouté** : Nouvelles fonctionnalités
- **Modifié** : Changements dans les fonctionnalités existantes
- **Déprécié** : Fonctionnalités qui seront supprimées
- **Supprimé** : Fonctionnalités retirées
- **Corrigé** : Corrections de bugs
- **Sécurité** : Corrections de vulnérabilités

### Structure des versions
Format : [MAJEUR.MINEUR.CORRECTIF]
- **MAJEUR** : Changements incompatibles
- **MINEUR** : Ajout de fonctionnalités compatibles
- **CORRECTIF** : Corrections de bugs

---

**Mainteneur** : Ciryl  
**Début du projet** : 2026  
**Dernière mise à jour** : 2026-03-06
