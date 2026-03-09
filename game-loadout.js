// ==================== RUN LOADOUT SYSTEM (PHASE 1) ====================
var LOADOUT_LIMITS = {
  mainWeapons: 6,
  autoWeapons: 0,
  passives: 6
};

var AUTO_WEAPON_POOL = [
  'LIGHTNING_ROD', 'GRIMOIRE', 'BOOMERANG', 'FIRE_STAFF', 'POTION', 'WHIP', 'LUTE', 'TOTEM', 'CARDS',
  'STAR_GLOBE', 'RUNESTONE', 'MIRROR', 'SHURIKEN', 'CROSSBOW', 'SUN_STAFF', 'BOMB',
  'ARCANE_ORB', 'SAW_BLADE', 'BLOOD_LANCE', 'CHAIN_LIGHTNING',
  'MAGIC_MISSILE', 'SHADOW_DISC', 'CELESTIAL_SPEAR', 'PHANTOM_TAROT', 'DRAGON_SPARK', 'SACRED_FLASK',
  'RAIL_LANCE', 'NOVA_TOME', 'SIEGE_MORTAR', 'FATE_NEEDLE', 'PLASMA_GLAIVE', 'RUNE_CANNON',
  'KNIFE_VOLLEY', 'HOLY_BIBLE', 'PHIAL_RAIN', 'BONE_SWARM', 'CLOCK_LANCET', 'MANA_CHANT', 'THUNDER_DRUM',
  'RUNE_TRACER', 'HEAVEN_BIRDS', 'SILVER_WIND', 'CELESTIAL_BELLS', 'PHOENIX_ASH', 'RAZOR_GALE'
];

var MAIN_WEAPON_POOL = [
  'SCEPTER', 'BOW', 'DAGGERS', 'RAPIER', 'SWORD', 'SPEAR', 'RIFLE', 'KATANA', 'GREATBOW', 'DARK_BLADE',
  'SUN_STAFF', 'VOID_STAFF', 'MOON_SHOT', 'AXE', 'HAMMER', 'SCYTHE', 'GAUNTLETS', 'WHIP', 'FLAIL',
  'WRENCH', 'TOTEM', 'CLAWS', 'MACE', 'GREATSWORD', 'DAGGER_SAC', 'DRILL', 'TRIDENT', 'JAVELIN',
  'CROSSBOW', 'BOOMERANG', 'PISTOL', 'REVOLVER', 'SHURIKEN', 'LEAF_BLADE', 'ICE_BOW', 'ARCANE_ORB',
  'LIGHTNING_ROD', 'RUNESTONE', 'STAR_GLOBE', 'CLEAVER', 'ROCK', 'BLOWGUN', 'HOURGLASS', 'LUTE',
  'KNIFE_VOLLEY', 'HOLY_BIBLE', 'GARLIC_AURA', 'PHIAL_RAIN', 'BONE_SWARM', 'CLOCK_LANCET', 'MANA_CHANT', 'THUNDER_DRUM',
  'RUNE_TRACER', 'HEAVEN_BIRDS', 'SILVER_WIND', 'CELESTIAL_BELLS', 'PHOENIX_ASH', 'RAZOR_GALE'
];

function createEmptyLoadoutArray(size) {
  var arr = [];
  for (var i = 0; i < size; i++) arr.push(null);
  return arr;
}

function createEmptyRunInventory() {
  return {
    mainWeapons: createEmptyLoadoutArray(LOADOUT_LIMITS.mainWeapons),
    autoWeapons: createEmptyLoadoutArray(LOADOUT_LIMITS.autoWeapons),
    passives: createEmptyLoadoutArray(LOADOUT_LIMITS.passives)
  };
}

function normalizeWeaponKey(rawId) {
  if (!rawId) return 'SCEPTER';
  var k = String(rawId).trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  if (typeof WEAPONS !== 'undefined' && WEAPONS[k]) return k;

  var aliases = {
    DAGGER: 'DAGGERS',
    WAND: 'SCEPTER'
  };
  if (aliases[k] && WEAPONS[aliases[k]]) return aliases[k];
  return 'SCEPTER';
}

function getWeaponMaxLevel(weaponKey) {
  if (typeof WEAPONS === 'undefined' || !WEAPONS[weaponKey]) return Number.POSITIVE_INFINITY;
  return 8;
}

function getWeaponEvolutionLevel(weaponKey) {
  if (typeof WEAPONS === 'undefined' || !WEAPONS[weaponKey]) return 8;
  var custom = Number(WEAPONS[weaponKey].evolveLevel);
  if (Number.isFinite(custom) && custom > 0) return Math.floor(custom);
  var legacyCap = Number(WEAPONS[weaponKey].maxLevel);
  if (Number.isFinite(legacyCap) && legacyCap > 0) return Math.floor(legacyCap);
  return 8;
}

function isLevelCapInfinite(levelCap) {
  return !Number.isFinite(levelCap) || levelCap >= 9999;
}

function formatLevelCap(levelCap) {
  return isLevelCapInfinite(levelCap) ? 'INF' : String(Math.max(1, Math.floor(levelCap || 1)));
}

function getChoiceProgress(level, levelCap) {
  var lv = Math.max(1, Number(level) || 1);
  if (isLevelCapInfinite(levelCap)) {
    return Math.min(1, Math.log2(lv + 1) / 8);
  }
  var cap = Math.max(1, Number(levelCap) || 1);
  return cap > 1 ? (lv - 1) / Math.max(1, cap - 1) : 1;
}

function makeInventoryWeaponEntry(weaponKey) {
  return {
    id: weaponKey,
    level: 1,
    maxLevel: getWeaponMaxLevel(weaponKey),
    evolved: false
  };
}

function getInventoryWeaponGroups() {
  ensureRunInventorySchema();
  return [GameState.inventory.mainWeapons || [], GameState.inventory.autoWeapons || []];
}

function getInventoryWeaponEntryById(weaponId) {
  var groups = getInventoryWeaponGroups();
  for (var g = 0; g < groups.length; g++) {
    var arr = groups[g];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i].id === weaponId) return arr[i];
    }
  }
  return null;
}

function hasPassiveRequirement(passiveId, requiresMaxPassive) {
  if (!passiveId) return true;
  ensureRunInventorySchema();
  var arr = GameState.inventory.passives || [];
  for (var i = 0; i < arr.length; i++) {
    var p = arr[i];
    if (!p || p.id !== passiveId) continue;
    if (!requiresMaxPassive) return true;
    var def = getPassiveItemDef(passiveId);
    var reqLevel = def ? Math.max(1, Number(def.maxLevel) || 1) : Math.max(1, Number(p.maxLevel) || 1);
    return p.level >= reqLevel;
  }
  return false;
}

function getEligibleChestEvolutions() {
  var eligible = [];
  var groups = getInventoryWeaponGroups();
  for (var g = 0; g < groups.length; g++) {
    var arr = groups[g];
    for (var i = 0; i < arr.length; i++) {
      var entry = arr[i];
      if (!entry || entry.evolved || entry.level < getWeaponEvolutionLevel(entry.id)) continue;
      var recipe = findEvolutionRecipe(entry.id);
      if (!recipe) continue;
      if (!hasPassiveRequirement(recipe.requiredPassiveId, !!recipe.requiresMaxPassive)) continue;
      eligible.push({ entry: entry, recipe: recipe });
    }
  }
  return eligible;
}

function applyEvolutionToEntry(entry, recipe) {
  if (!entry || !recipe) return false;
  var evolvedId = recipe.evolvedWeaponId;
  if (evolvedId && WEAPONS[evolvedId]) {
    entry.id = evolvedId;
    entry.level = 1;
    entry.maxLevel = Number.POSITIVE_INFINITY;
    entry.evolved = true;
    return true;
  }

  // Fallback while evolved catalog is being authored: keep weapon id and apply an evolved power flag.
  entry.evolved = true;
  entry.virtualEvolution = recipe.evolvedWeaponId || 'EVOLVED';
  return true;
}

function attemptChestEvolution() {
  var eligible = getEligibleChestEvolutions();
  if (!eligible.length) return false;
  var pick = eligible[Math.floor(Math.random() * eligible.length)];
  if (!pick) return false;
  if (!applyEvolutionToEntry(pick.entry, pick.recipe)) return false;

  var evolvedLabel = WEAPONS[pick.entry.id]
    ? formatWeaponName(pick.entry.id)
    : formatWeaponName(pick.recipe.evolvedWeaponId || pick.entry.id);
  addNotif('✨ Evolution: ' + evolvedLabel, '#ffd37a');
  return true;
}

function processBossChestRewards(rewardCount) {
  var rewards = Math.max(1, Math.floor(rewardCount || 1));
  var evolutionCount = 0;
  var upgradeCount = 0;

  for (var i = 0; i < rewards; i++) {
    if (attemptChestEvolution()) evolutionCount++;
    else {
      GameState.pendingBossChestUpgrades = (GameState.pendingBossChestUpgrades || 0) + 1;
      upgradeCount++;
    }
  }

  if (evolutionCount > 0) {
    addNotif('🧬 Coffre: ' + evolutionCount + ' evolution' + (evolutionCount > 1 ? 's' : ''), '#ffd37a');
  }
  if (upgradeCount > 0 && typeof showLevelUp === 'function' && !GameState.levelingUp && GameState.gameRunning) {
    setTimeout(function () { showLevelUp(); }, 0);
  }
}

function makeInventoryPassiveEntry(itemId) {
  getPassiveItemDef(itemId);
  return {
    id: itemId,
    level: 1,
    maxLevel: 8
  };
}

function ensureLoadoutStatBoostSchema() {
  if (!GameState.loadoutStatBoosts || typeof GameState.loadoutStatBoosts !== 'object') {
    GameState.loadoutStatBoosts = {
      might: 1,
      cooldown: 1,
      area: 1,
      projectileSpeed: 1,
      duration: 1,
      moveSpeed: 1,
      pickupRange: 1,
      luck: 1
    };
  }
}

function buildLoadoutStatIncreaseChoices() {
  ensureLoadoutStatBoostSchema();
  return [
    makeLevelUpChoice('boost_might', 'Calibrage Brutal', 'fa-solid fa-burst', 'LOADOUT: DMG +6%', function () {
      GameState.loadoutStatBoosts.might *= 1.04;
    }, 100),
    makeLevelUpChoice('boost_cooldown', 'Rythme Parfait', 'fa-solid fa-stopwatch', 'LOADOUT: CD -5%', function () {
      GameState.loadoutStatBoosts.cooldown *= 0.97;
    }, 100),
    makeLevelUpChoice('boost_area', 'Onde Large', 'fa-solid fa-expand', 'LOADOUT: Zone +7%', function () {
      GameState.loadoutStatBoosts.area *= 1.05;
    }, 90),
    makeLevelUpChoice('boost_proj', 'Trajectoire Nette', 'fa-solid fa-location-arrow', 'LOADOUT: Vitesse proj +8%', function () {
      GameState.loadoutStatBoosts.projectileSpeed *= 1.05;
    }, 90),
    makeLevelUpChoice('boost_duration', 'Persistance', 'fa-solid fa-hourglass-half', 'LOADOUT: Duree +8%', function () {
      GameState.loadoutStatBoosts.duration *= 1.05;
    }, 85),
    makeLevelUpChoice('boost_move', 'Mobilite', 'fa-solid fa-person-running', 'LOADOUT: Vitesse deplacement +6%', function () {
      GameState.loadoutStatBoosts.moveSpeed *= 1.04;
    }, 80),
    makeLevelUpChoice('boost_pickup', 'Attraction', 'fa-solid fa-magnet', 'LOADOUT: Range pickup +8%', function () {
      GameState.loadoutStatBoosts.pickupRange *= 1.05;
    }, 75),
    makeLevelUpChoice('boost_luck', 'Chance', 'fa-solid fa-clover', 'LOADOUT: Luck +6%', function () {
      GameState.loadoutStatBoosts.luck *= 1.04;
    }, 70)
  ];
}

function formatWeaponName(weaponKey) {
  return String(weaponKey || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, function (m) { return m.toUpperCase(); });
}

function getWeaponStyleTag(weaponId) {
  var k = String(weaponId || '').toUpperCase();
  if (!k) return 'projectile';
  if (k.indexOf('ORB') >= 0 || k.indexOf('VESPERS') >= 0 || k.indexOf('AURA') >= 0) return 'aura';
  if (k.indexOf('POTION') >= 0 || k.indexOf('FLASK') >= 0 || k.indexOf('BOMB') >= 0 || k.indexOf('MORTAR') >= 0 || k.indexOf('TOME') >= 0) return 'zone';
  if (k.indexOf('LIGHTNING') >= 0 || k.indexOf('CHAIN') >= 0 || k.indexOf('SPARK') >= 0) return 'chain';
  if (k.indexOf('SWORD') >= 0 || k.indexOf('DAGGER') >= 0 || k.indexOf('DAGGERS') >= 0 || k.indexOf('WHIP') >= 0 || k.indexOf('MACE') >= 0 || k.indexOf('KATANA') >= 0 || k.indexOf('GAUNTLET') >= 0 || k.indexOf('SCYTHE') >= 0 || k.indexOf('CLAW') >= 0 || k.indexOf('RAPIER') >= 0) return 'melee';
  return 'projectile';
}

function buildOwnedWeaponStyleMap() {
  var owned = getAllOwnedWeaponIds();
  var styles = {};
  for (var weaponId in owned) {
    if (!owned[weaponId]) continue;
    styles[getWeaponStyleTag(weaponId)] = true;
  }
  return styles;
}

function getPassiveDeltaLabel(def) {
  if (!def) return '';
  var per = def.perLevel;
  if (def.statKey === 'amount' || def.statKey === 'armor') return '+' + per;
  var pct = Math.round(Math.abs(per) * 100);
  if (def.statKey === 'cooldown') return '-' + pct + '%';
  return '+' + pct + '%';
}

function getClassStarterKit(classId, primaryKey) {
  var id = String(classId || '').toLowerCase();
  var direct = {
    mage: { aimed: ['SCEPTER'], auto: ['MAGIC_MISSILE'], passives: ['crown'] },
    knight: { aimed: ['SWORD'], auto: [], passives: ['spinach'] },
    ranger: { aimed: ['BOW'], auto: [], passives: ['bracer'] },
    rogue: { aimed: ['DAGGERS'], auto: ['SHURIKEN'], passives: ['swift_boots'] },
    necro: { aimed: [], auto: ['GRIMOIRE'], passives: ['spellbinder'] },
    paladin: { aimed: [], auto: ['WHIP'], passives: ['armor'] },
    pyro: { aimed: [], auto: ['FIRE_STAFF'], passives: ['spinach'] },
    stormcaller: { aimed: [], auto: ['LIGHTNING_ROD'], passives: ['empty_tome'] },
    alchemist: { aimed: [], auto: ['POTION'], passives: ['attractorb'] },
    bard: { aimed: ['LUTE'], auto: [], passives: ['crown'] },
    sniper: { aimed: ['GREATBOW'], auto: ['CROSSBOW'], passives: ['bracer'] },
    darkknight: { aimed: ['DARK_BLADE'], auto: ['BLOOD_LANCE'], passives: ['hollow_heart'] },
    chronomancer: { aimed: [], auto: ['HOURGLASS'], passives: ['empty_tome'] },
    sunpriest: { aimed: [], auto: ['SUN_STAFF'], passives: ['candelabrador'] },
    tamer: { aimed: [], auto: ['WHIP'], passives: ['wings'] },
    monk: { aimed: ['GAUNTLETS'], auto: [], passives: ['armor'] }
  };

  if (direct[id]) return direct[id];

  function getClassArchetype(classKey, weaponKey) {
    var cid = String(classKey || '').toLowerCase();
    var mageLike = {
      warlock: true, voidmage: true, runemaster: true, witchdoc: true, astronomer: true,
      crystal_mage: true, lich_king: true, chaos_mage: true, sphinx: true, bard: true,
      illusionist: true, time_knight: true, shaman: true, plague_doctor: true, necro_lord: true,
      fairy_queen: true, star_guardian: true, elemental_lord: true, mummy: true
    };
    if (mageLike[cid]) return 'caster';

    var rangerLike = {
      hunter: true, arbalist: true, kyudo: true, frostarcher: true, arcane_archer: true,
      centaur_archer: true, pirate: true, cowboy: true, sniper: true, gunner: true,
      kraken_slayer: true, medusa: true, thunder_lord: true
    };
    if (rangerLike[cid]) return 'ranger';

    var bruiserLike = {
      barbarian: true, gladiator: true, templar: true, executioner: true, berserker: true,
      golem: true, minotaur: true, cyclops: true, lava_titan: true, frost_giant: true,
      crusader: true, werewolf: true, geomancer: true, darkknight: true, dragonkin: true,
      cerberus: true, gargoyle: true, blood_knight: true, yeti: true, sand_golem: true,
      oni_warrior: true
    };
    if (bruiserLike[cid]) return 'bruiser';

    var agileLike = {
      ninja: true, samurai: true, duelist: true, shadow_dancer: true, moonlight_assassin: true,
      harpy: true, kitsune: true, rogue: true, valkyrie: true, pegasus_rider: true,
      void_reaper: true, wraith: true, banshee: true, samurai_lord: true, chimera: true,
      griffin: true
    };
    if (agileLike[cid]) return 'agile';

    var supportLike = {
      alchemist: true, tamer: true, druid: true, engineer: true, mechanic: true,
      apothecary: true, chef: true, battle_bard: true, nature_spirit: true, sunpriest: true,
      chronomancer: true
    };
    if (supportLike[cid]) return 'support';

    var k = String(weaponKey || '');
    if (k === 'SCEPTER' || k === 'VOID_STAFF' || k === 'RUNESTONE' || k === 'STAR_GLOBE' || k === 'GRIMOIRE') return 'caster';
    if (k === 'BOW' || k === 'RIFLE' || k === 'CROSSBOW' || k === 'GREATBOW' || k === 'JAVELIN') return 'ranger';
    if (k === 'DAGGERS' || k === 'KATANA' || k === 'RAPIER' || k === 'SHURIKEN') return 'agile';
    return 'bruiser';
  }

  var archetype = getClassArchetype(id, primaryKey);
  if (archetype === 'caster') return { aimed: [], auto: ['ARCANE_ORB'], passives: ['empty_tome'] };
  if (archetype === 'ranger') return { aimed: ['BOW'], auto: ['CROSSBOW'], passives: ['bracer'] };
  if (archetype === 'agile') return { aimed: ['DAGGERS'], auto: ['SHURIKEN'], passives: ['swift_boots'] };
  if (archetype === 'support') return { aimed: [], auto: ['POTION'], passives: ['attractorb'] };
  if (archetype === 'bruiser') return { aimed: ['SWORD'], auto: ['WHIP'], passives: ['armor'] };

  var meleePrimaries = {
    SWORD: true, AXE: true, SPEAR: true, HAMMER: true, SCYTHE: true, KATANA: true,
    FLAIL: true, GAUNTLETS: true, WHIP: true, CLAWS: true, MACE: true, GREATSWORD: true
  };

  if (meleePrimaries[primaryKey]) {
    return { aimed: [primaryKey], auto: ['WHIP'], passives: ['armor'] };
  }
  return { aimed: [primaryKey], auto: ['ARCANE_ORB'], passives: ['empty_tome'] };
}

function getClassVsBaselineStats(classId) {
  var id = String(classId || '').toLowerCase();
  var byClass = {
    mage: { growth: 1.10 },
    knight: { might: 1.10, maxHpMult: 1.10, moveSpeed: 0.95 },
    ranger: { projectileSpeed: 1.15, moveSpeed: 1.08 },
    rogue: { amountFlat: 1, moveSpeed: 1.12, maxHpMult: 0.90 },
    necro: { duration: 1.20, moveSpeed: 0.95 },
    paladin: { area: 1.25, maxHpMult: 1.25, moveSpeed: 0.90 },
    pyro: { might: 1.10, cooldown: 0.90 },
    stormcaller: { cooldown: 0.85, area: 1.10, maxHpMult: 0.90 },
    alchemist: { duration: 1.15, area: 1.10 },
    sniper: { might: 1.15, projectileSpeed: 1.15, moveSpeed: 0.92 },
    darkknight: { might: 1.15, maxHpMult: 1.15, moveSpeed: 0.92 },
    chronomancer: { cooldown: 0.82, duration: 1.10, maxHpMult: 0.90 },
    sunpriest: { area: 1.20, growth: 1.08 },
    tamer: { duration: 1.15, moveSpeed: 1.05 },
    monk: { moveSpeed: 1.08, armorFlat: 1 }
  };
  if (byClass[id]) return byClass[id];

  var caster = {
    warlock: true, voidmage: true, runemaster: true, witchdoc: true, astronomer: true,
    crystal_mage: true, lich_king: true, chaos_mage: true, sphinx: true, bard: true,
    illusionist: true, shaman: true, plague_doctor: true, necro_lord: true, star_guardian: true
  };
  if (caster[id]) return { cooldown: 0.92, growth: 1.08, maxHpMult: 0.94 };

  var ranger = {
    hunter: true, arbalist: true, kyudo: true, frostarcher: true, arcane_archer: true,
    centaur_archer: true, pirate: true, cowboy: true, gunner: true, kraken_slayer: true,
    medusa: true, thunder_lord: true
  };
  if (ranger[id]) return { projectileSpeed: 1.14, moveSpeed: 1.05, might: 1.05 };

  var agile = {
    ninja: true, samurai: true, duelist: true, shadow_dancer: true, moonlight_assassin: true,
    harpy: true, kitsune: true, valkyrie: true, pegasus_rider: true, void_reaper: true,
    wraith: true, banshee: true, samurai_lord: true, griffin: true
  };
  if (agile[id]) return { moveSpeed: 1.12, cooldown: 0.95, maxHpMult: 0.9 };

  var support = {
    alchemist: true, tamer: true, druid: true, engineer: true, mechanic: true,
    apothecary: true, chef: true, battle_bard: true, nature_spirit: true, chronomancer: true,
    sunpriest: true
  };
  if (support[id]) return { duration: 1.12, area: 1.08, moveSpeed: 1.02 };

  return { might: 1.06, maxHpMult: 1.08, moveSpeed: 0.96 };
}

function getDefaultSecondaryMainWeapon(primaryKey) {
  var fallbacks = ['SCEPTER', 'BOW', 'DAGGERS', 'WHIP'];
  for (var i = 0; i < fallbacks.length; i++) {
    var candidate = fallbacks[i];
    if (candidate !== primaryKey && WEAPONS[candidate]) return candidate;
  }
  return primaryKey;
}

function ensureRunInventorySchema() {
  if (!GameState.inventory || typeof GameState.inventory !== 'object') {
    GameState.inventory = createEmptyRunInventory();
    return;
  }
  if (!Array.isArray(GameState.inventory.mainWeapons)) GameState.inventory.mainWeapons = createEmptyLoadoutArray(LOADOUT_LIMITS.mainWeapons);
  if (!Array.isArray(GameState.inventory.autoWeapons)) GameState.inventory.autoWeapons = createEmptyLoadoutArray(LOADOUT_LIMITS.autoWeapons);
  if (!Array.isArray(GameState.inventory.passives)) GameState.inventory.passives = createEmptyLoadoutArray(LOADOUT_LIMITS.passives);

  while (GameState.inventory.mainWeapons.length < LOADOUT_LIMITS.mainWeapons) GameState.inventory.mainWeapons.push(null);
  while (GameState.inventory.autoWeapons.length < LOADOUT_LIMITS.autoWeapons) GameState.inventory.autoWeapons.push(null);
  while (GameState.inventory.passives.length < LOADOUT_LIMITS.passives) GameState.inventory.passives.push(null);
}

function initializeRunInventoryFromClass(classWeaponId) {
  ensureRunInventorySchema();
  GameState._weaponRuntimeBase = {};
  var primaryKey = normalizeWeaponKey(classWeaponId);
  var clsId = GameState && GameState.pClass ? GameState.pClass.id : '';
  var starter = getClassStarterKit(clsId, primaryKey);
  var aimed = Array.isArray(starter.aimed) ? starter.aimed : [primaryKey, starter.secondary || getDefaultSecondaryMainWeapon(primaryKey)];
  var auto = Array.isArray(starter.auto) ? starter.auto : [];
  var combinedWeapons = [primaryKey];
  var sourceList = aimed.concat(auto);
  for (var cw = 0; cw < sourceList.length; cw++) {
    var wk = normalizeWeaponKey(sourceList[cw]);
    if (!wk) continue;
    if (combinedWeapons.indexOf(wk) < 0) combinedWeapons.push(wk);
  }
  GameState._classRunStats = getClassVsBaselineStats(clsId);

  for (var m = 0; m < LOADOUT_LIMITS.mainWeapons; m++) GameState.inventory.mainWeapons[m] = null;
  for (var m2 = 0; m2 < Math.min(combinedWeapons.length, LOADOUT_LIMITS.mainWeapons); m2++) {
    var aimedKey = normalizeWeaponKey(combinedWeapons[m2]);
    if (WEAPONS[aimedKey]) GameState.inventory.mainWeapons[m2] = makeInventoryWeaponEntry(aimedKey);
  }

  for (var i = 0; i < LOADOUT_LIMITS.autoWeapons; i++) GameState.inventory.autoWeapons[i] = null;
  for (var j = 0; j < LOADOUT_LIMITS.passives; j++) GameState.inventory.passives[j] = null;

  var passives = starter.passives || [];
  for (var p = 0; p < Math.min(passives.length, LOADOUT_LIMITS.passives); p++) {
    var passId = passives[p];
    if (getPassiveItemDef(passId)) GameState.inventory.passives[p] = makeInventoryPassiveEntry(passId);
  }
}

function getAllOwnedWeaponIds() {
  ensureRunInventorySchema();
  var owned = {};
  var groups = [GameState.inventory.mainWeapons, GameState.inventory.autoWeapons];
  for (var g = 0; g < groups.length; g++) {
    var arr = groups[g] || [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i].id) owned[arr[i].id] = true;
    }
  }
  return owned;
}

function getOwnedPassiveIds() {
  ensureRunInventorySchema();
  var owned = {};
  var arr = GameState.inventory.passives || [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] && arr[i].id) owned[arr[i].id] = true;
  }
  return owned;
}

function hasFreeAutoSlot() {
  ensureRunInventorySchema();
  for (var i = 0; i < GameState.inventory.autoWeapons.length; i++) {
    if (!GameState.inventory.autoWeapons[i]) return true;
  }
  return false;
}

function hasFreeAimedSlot() {
  ensureRunInventorySchema();
  for (var i = 0; i < GameState.inventory.mainWeapons.length; i++) {
    if (!GameState.inventory.mainWeapons[i]) return true;
  }
  return false;
}

function hasFreePassiveSlot() {
  ensureRunInventorySchema();
  for (var i = 0; i < GameState.inventory.passives.length; i++) {
    if (!GameState.inventory.passives[i]) return true;
  }
  return false;
}

function weightedSample(candidates, count) {
  var pool = candidates.slice();
  var out = [];
  while (pool.length > 0 && out.length < count) {
    var total = 0;
    for (var i = 0; i < pool.length; i++) total += Math.max(1, pool[i].weight || 1);
    var r = Math.random() * total;
    var pick = 0;
    for (var j = 0; j < pool.length; j++) {
      r -= Math.max(1, pool[j].weight || 1);
      if (r <= 0) {
        pick = j;
        break;
      }
    }
    out.push(pool[pick]);
    pool.splice(pick, 1);
  }
  return out;
}

function makeLevelUpChoice(id, name, icon, desc, applyFn, weight) {
  return {
    id: id,
    name: name,
    icon: icon || 'fa-solid fa-star',
    type: 'loadout',
    desc: desc,
    weight: weight || 50,
    apply: applyFn
  };
}

function describeWeaponUpgradeDelta(entry) {
  if (!entry) return '';
  var lv = Math.max(1, Number(entry.level) || 1);
  var nextLv = lv + 1;
  var lines = ['DMG: +18%', 'CD: -6%'];

  var countNow = (lv >= 3 ? 1 : 0) + (lv >= 5 ? 1 : 0) + (lv >= 7 ? 1 : 0);
  var countNext = (nextLv >= 3 ? 1 : 0) + (nextLv >= 5 ? 1 : 0) + (nextLv >= 7 ? 1 : 0);
  if (countNext > countNow) lines.push('Projectiles: +' + (countNext - countNow));

  if (nextLv === getWeaponEvolutionLevel(entry.id)) {
    lines.push('Evolution: pret via coffre');
  }

  return lines.join(' | ');
}

function describePassiveUpgradeDelta(entry, def) {
  if (!entry || !def) return '';
  var delta = getPassiveDeltaLabel(def);
  var key = String(def.statKey || '').toUpperCase();
  return key + ': ' + delta;
}

function buildLoadoutLevelUpOptions(optionCount) {
  ensureRunInventorySchema();
  var count = Math.max(1, optionCount || 3);
  var choices = [];

  var main = GameState.inventory.mainWeapons || [];
  var auto = GameState.inventory.autoWeapons || [];
  var passives = GameState.inventory.passives || [];
  var runStats = GameState._runPassiveStats || {};
  var luck = Math.max(1, Number(GameState.pLuck || runStats.luck || 1));
  var filledAutoSlots = auto.filter(function (x) { return !!x; }).length;
  var filledPassiveSlots = passives.filter(function (x) { return !!x; }).length;

  for (var i = 0; i < main.length; i++) {
    var wm = main[i];
    if (!wm) continue;
    (function (slotIndex, entry) {
      if ((entry.level || 1) >= Math.max(1, Number(entry.maxLevel) || 1)) return;
      var capLabel = formatLevelCap(entry.maxLevel);
      var progress = getChoiceProgress(entry.level, entry.maxLevel);
      var weight = 96 + Math.floor(progress * 24) + Math.floor((luck - 1) * 6);
      var style = getWeaponStyleTag(entry.id).toUpperCase();
      choices.push(makeLevelUpChoice(
        'up_main_' + entry.id + '_' + slotIndex,
        '[' + style + '] ' + formatWeaponName(entry.id),
        WEAPONS[entry.id] ? WEAPONS[entry.id].icon : 'fa-solid fa-crosshairs',
        'Ameliorer arme (' + entry.level + '/' + capLabel + ' -> ' + (entry.level + 1) + '/' + capLabel + ')\n' + describeWeaponUpgradeDelta(entry),
        function () { entry.level++; },
        weight
      ));
    })(i, wm);
  }

  for (var j = 0; j < auto.length; j++) {
    var wa = auto[j];
    if (!wa) continue;
    (function (slotIndex, entry) {
      if ((entry.level || 1) >= Math.max(1, Number(entry.maxLevel) || 1)) return;
      var capLabel = formatLevelCap(entry.maxLevel);
      var progress = getChoiceProgress(entry.level, entry.maxLevel);
      var weight = 88 + Math.floor(progress * 20) + Math.floor((luck - 1) * 5);
      var style = getWeaponStyleTag(entry.id).toUpperCase();
      choices.push(makeLevelUpChoice(
        'up_auto_' + entry.id + '_' + slotIndex,
        '[' + style + '] ' + formatWeaponName(entry.id),
        WEAPONS[entry.id] ? WEAPONS[entry.id].icon : 'fa-solid fa-bolt',
        'Ameliorer arme (' + entry.level + '/' + capLabel + ' -> ' + (entry.level + 1) + '/' + capLabel + ')\n' + describeWeaponUpgradeDelta(entry),
        function () { entry.level++; },
        weight
      ));
    })(j, wa);
  }

  for (var k = 0; k < passives.length; k++) {
    var p = passives[k];
    if (!p) continue;
    var pd = getPassiveItemDef(p.id);
    if (!pd) continue;
    (function (entry, def) {
      if ((entry.level || 1) >= Math.max(1, Number(entry.maxLevel) || 1)) return;
      var capLabel = formatLevelCap(entry.maxLevel);
      var progress = getChoiceProgress(entry.level, entry.maxLevel);
      var weight = Math.max(45, (def.rarityWeight || 60) + Math.floor(progress * 16) + Math.floor((luck - 1) * 3));
      choices.push(makeLevelUpChoice(
        'up_passive_' + entry.id,
        def.name,
        def.icon,
        (def.desc || ('Ameliorer objet passif (' + getPassiveDeltaLabel(def) + ' ' + def.statKey + ')'))
          + ' [' + entry.level + '/' + capLabel + ' -> ' + (entry.level + 1) + '/' + capLabel + ']\n'
          + describePassiveUpgradeDelta(entry, def),
        function () { entry.level++; },
        weight
      ));
    })(p, pd);
  }

  var ownedWeapons = getAllOwnedWeaponIds();
  var ownedStyles = buildOwnedWeaponStyleMap();
  var ownedMeleeCount = 0;
  var ownedRangedCount = 0;
  for (var ow in ownedWeapons) {
    if (!ownedWeapons[ow] || !WEAPONS[ow]) continue;
    if (String(WEAPONS[ow].kind || '').toLowerCase() === 'melee') ownedMeleeCount++;
    else ownedRangedCount++;
  }
  var canAddAimed = hasFreeAimedSlot();
  var canAddAuto = hasFreeAutoSlot();
  if (canAddAimed || canAddAuto) {
    var unifiedWeaponIds = {};
    var weaponCandidates = [];
    var aimedSlotPressure = 1 - ((main.filter(function (x) { return !!x; }).length) / Math.max(1, LOADOUT_LIMITS.mainWeapons));
    var autoSlotPressure = 1 - (filledAutoSlots / Math.max(1, LOADOUT_LIMITS.autoWeapons));

    for (var am = 0; am < MAIN_WEAPON_POOL.length; am++) unifiedWeaponIds[MAIN_WEAPON_POOL[am]] = true;
    for (var au = 0; au < AUTO_WEAPON_POOL.length; au++) unifiedWeaponIds[AUTO_WEAPON_POOL[au]] = true;

    for (var weaponId in unifiedWeaponIds) {
      if (ownedWeapons[weaponId] || !WEAPONS[weaponId]) continue;
      if (Number(WEAPONS[weaponId].maxLevel) === 1) continue; // Skip evolved/final forms from normal offers.
      var rarityBias = Math.max(0.4, 1.2 - (Number(WEAPONS[weaponId].level) || 1) * 0.08);
      var styleKey = getWeaponStyleTag(weaponId);
      var diversityBonus = ownedStyles[styleKey] ? 1.0 : 1.35;
      var kind = String(WEAPONS[weaponId].kind || 'ranged').toLowerCase();
      var kindBonus = 1.0;
      if (kind === 'melee') {
        if (ownedMeleeCount <= ownedRangedCount) kindBonus = 1.55;
        else kindBonus = 0.86;
      } else {
        if (ownedRangedCount <= ownedMeleeCount) kindBonus = 1.35;
        else kindBonus = 0.78;
      }

      if (canAddAimed) {
        weaponCandidates.push({
          id: weaponId,
          mode: 'aimed',
          weight: Math.max(12, Math.floor((40 + (luck - 1) * 7) * aimedSlotPressure * rarityBias * diversityBonus * kindBonus))
        });
      }
      if (canAddAuto) {
        weaponCandidates.push({
          id: weaponId,
          mode: 'auto',
          weight: Math.max(12, Math.floor((38 + (luck - 1) * 7) * autoSlotPressure * rarityBias * diversityBonus))
        });
      }
    }

    var pickedWeapons = weightedSample(weaponCandidates, luck >= 1.5 ? 3 : 2);
    var meleeAlreadyPicked = pickedWeapons.some(function (pick) {
      return WEAPONS[pick.id] && String(WEAPONS[pick.id].kind || '').toLowerCase() === 'melee';
    });
    if (!meleeAlreadyPicked && ownedMeleeCount === 0) {
      var meleeCandidates = weaponCandidates.filter(function (pick) {
        return WEAPONS[pick.id] && String(WEAPONS[pick.id].kind || '').toLowerCase() === 'melee';
      });
      if (meleeCandidates.length && pickedWeapons.length) {
        var forceMelee = weightedSample(meleeCandidates, 1);
        if (forceMelee.length) pickedWeapons[0] = forceMelee[0];
      }
    }
    for (var pw = 0; pw < pickedWeapons.length; pw++) {
      (function (pick) {
        var weaponId = pick.id;
        var mode = pick.mode;
        var isAimed = mode === 'aimed';
        var slotArr = GameState.inventory.mainWeapons;
        var slotMax = LOADOUT_LIMITS.mainWeapons;
        var slotFill = slotArr.filter(function (x) { return !!x; }).length;
        var label = '';
        var style = getWeaponStyleTag(weaponId).toUpperCase();

        choices.push(makeLevelUpChoice(
          'new_' + mode + '_' + weaponId,
          label + '[' + style + '] ' + formatWeaponName(weaponId),
          WEAPONS[weaponId].icon,
          'Nouvelle arme (slot ' + (slotFill + 1) + '/' + slotMax + ')\nDMG: ' + Math.round(WEAPONS[weaponId].dmg || 0) + ' | CD: ' + Number(WEAPONS[weaponId].maxCd || 0).toFixed(2) + 's',
          function () {
            for (var s = 0; s < slotArr.length; s++) {
              if (!slotArr[s]) {
                slotArr[s] = makeInventoryWeaponEntry(weaponId);
                break;
              }
            }
          },
          Math.max(18, 40 + Math.floor((luck - 1) * 6))
        ));
      })(pickedWeapons[pw]);
    }
  }

  var ownedPassives = getOwnedPassiveIds();
  if (hasFreePassiveSlot()) {
    var passCandidates = [];
    var passiveSlotPressure = 1 - (filledPassiveSlots / Math.max(1, LOADOUT_LIMITS.passives));
    for (var pi = 0; pi < PASSIVE_ITEMS.length; pi++) {
      var def = PASSIVE_ITEMS[pi];
      if (ownedPassives[def.id]) continue;
      var rarity = def.rarityWeight || 50;
      var rarityBias = Math.max(0.55, 1.25 - (rarity / 100));
      passCandidates.push({
        id: def.id,
        weight: Math.max(12, Math.floor((36 + (luck - 1) * 7) * passiveSlotPressure * rarityBias))
      });
    }
    var pickedPass = weightedSample(passCandidates, luck >= 1.5 ? 3 : 2);
    for (var pp = 0; pp < pickedPass.length; pp++) {
      (function (passiveId) {
        var def = getPassiveItemDef(passiveId);
        if (!def) return;
        choices.push(makeLevelUpChoice(
          'new_passive_' + passiveId,
          def.name,
          def.icon,
          (def.desc || ('Nouvel objet passif (' + getPassiveDeltaLabel(def) + ' ' + def.statKey + ')')) + '\n' + String(def.statKey || '').toUpperCase() + ': ' + getPassiveDeltaLabel(def),
          function () {
            for (var s = 0; s < GameState.inventory.passives.length; s++) {
              if (!GameState.inventory.passives[s]) {
                GameState.inventory.passives[s] = makeInventoryPassiveEntry(passiveId);
                break;
              }
            }
          },
          Math.max(18, 34 + Math.floor((luck - 1) * 5))
        ));
      })(pickedPass[pp].id);
    }
  }

  if (!choices.length) {
    return weightedSample(buildLoadoutStatIncreaseChoices(), count);
  }

  var newChoices = choices.filter(function (c) {
    return String(c.id || '').indexOf('new_') === 0;
  });
  if (newChoices.length > 0 && count >= 2) {
    var guaranteedNew = weightedSample(newChoices, 1);
    var remainingPool = choices.filter(function (c) { return guaranteedNew.indexOf(c) < 0; });
    var rest = weightedSample(remainingPool, Math.max(0, count - guaranteedNew.length));
    return guaranteedNew.concat(rest);
  }

  return weightedSample(choices, count);
}

function syncLegacyWeaponActivationFromInventory() {
  if (typeof WEAPONS === 'undefined') return;
  for (var key in WEAPONS) WEAPONS[key].active = false;

  // Activate all equipped run weapons so loadout behaves like multi-weapon survival gameplay.
  ensureRunInventorySchema();
  var enabled = false;
  var groups = [GameState.inventory.mainWeapons || [], GameState.inventory.autoWeapons || []];
  for (var g = 0; g < groups.length; g++) {
    var arr = groups[g];
    for (var i = 0; i < arr.length; i++) {
      var slot = arr[i];
      if (slot && slot.id && WEAPONS[slot.id]) {
        WEAPONS[slot.id].active = true;
        enabled = true;
      }
    }
  }
  if (!enabled) WEAPONS.SCEPTER.active = true;
}

function applyRunPassiveStats() {
  ensureRunInventorySchema();
  ensureLoadoutStatBoostSchema();
  var classStats = GameState._classRunStats || {};

  function statOr(base, fallback) {
    var n = Number(base);
    return Number.isFinite(n) ? n : fallback;
  }

  // Reset to baseline every frame/tick before re-applying passive modifiers.
  GameState._runPassiveStats = {
    might: statOr(classStats.might, 1.0),
    cooldown: statOr(classStats.cooldown, 1.0),
    area: statOr(classStats.area, 1.0),
    projectileSpeed: statOr(classStats.projectileSpeed, 1.0),
    duration: statOr(classStats.duration, 1.0),
    amountFlat: statOr(classStats.amountFlat, 0),
    pickupRange: statOr(classStats.pickupRange, 1.0),
    luck: statOr(classStats.luck, 1.0),
    growth: statOr(classStats.growth, 1.0),
    armorFlat: statOr(classStats.armorFlat, 0),
    maxHpMult: statOr(classStats.maxHpMult, 1.0),
    moveSpeed: statOr(classStats.moveSpeed, 1.0)
  };

  var passives = GameState.inventory.passives || [];
  for (var i = 0; i < passives.length; i++) {
    var entry = passives[i];
    if (!entry || !entry.id || !entry.level) continue;
    var def = getPassiveItemDef(entry.id);
    if (!def) continue;

    var total = def.perLevel * entry.level;
    switch (def.statKey) {
      case 'cooldown': GameState._runPassiveStats.cooldown *= (1 + total); break;
      case 'amount': GameState._runPassiveStats.amountFlat += total; break;
      case 'pickupRange': GameState._runPassiveStats.pickupRange *= (1 + total); break;
      case 'luck': GameState._runPassiveStats.luck *= (1 + total); break;
      case 'growth': GameState._runPassiveStats.growth *= (1 + total); break;
      case 'armor': GameState._runPassiveStats.armorFlat += total; break;
      case 'maxHpMult': GameState._runPassiveStats.maxHpMult *= (1 + total); break;
      case 'moveSpeed': GameState._runPassiveStats.moveSpeed *= (1 + total); break;
      case 'might': GameState._runPassiveStats.might *= (1 + total); break;
      case 'area': GameState._runPassiveStats.area *= (1 + total); break;
      case 'projectileSpeed': GameState._runPassiveStats.projectileSpeed *= (1 + total); break;
      case 'duration': GameState._runPassiveStats.duration *= (1 + total); break;
      default: break;
    }
  }

  // Build-defining synergy bonuses for mixed weapon families/styles.
  var owned = getAllOwnedWeaponIds();
  var familyMap = {};
  var styleMap = {};
  for (var wid in owned) {
    if (!owned[wid]) continue;
    var fam = (typeof getWeaponFamilyId === 'function') ? getWeaponFamilyId(wid) : null;
    if (fam) familyMap[fam] = true;
    styleMap[getWeaponStyleTag(wid)] = true;
  }

  var uniqueFamilies = Object.keys(familyMap).length;
  var uniqueStyles = Object.keys(styleMap).length;
  if (uniqueFamilies >= 2) {
    GameState._runPassiveStats.might *= 1.04;
    GameState._runPassiveStats.cooldown *= 0.97;
  }
  if (familyMap.arcane && familyMap.storm) {
    GameState._runPassiveStats.cooldown *= 0.94;
  }
  if (familyMap.alchemy && familyMap.shadow) {
    GameState._runPassiveStats.duration *= 1.08;
    GameState._runPassiveStats.area *= 1.06;
  }
  if (familyMap.martial && familyMap.precision) {
    GameState._runPassiveStats.might *= 1.06;
    GameState._runPassiveStats.projectileSpeed *= 1.08;
  }
  if (uniqueStyles >= 3) {
    GameState._runPassiveStats.moveSpeed *= 1.03;
  }

  // Post-cap level-up cards permanently amplify the current run loadout.
  var boosts = GameState.loadoutStatBoosts || {};
  var boostMight = Math.min(2.4, Math.max(1, Number(boosts.might) || 1));
  var boostCd = Math.max(0.55, Math.min(1, Number(boosts.cooldown) || 1));
  var boostArea = Math.min(2.2, Math.max(1, Number(boosts.area) || 1));
  var boostProj = Math.min(2.2, Math.max(1, Number(boosts.projectileSpeed) || 1));
  var boostDuration = Math.min(2.2, Math.max(1, Number(boosts.duration) || 1));
  var boostMove = Math.min(1.9, Math.max(1, Number(boosts.moveSpeed) || 1));
  var boostPickup = Math.min(2.0, Math.max(1, Number(boosts.pickupRange) || 1));
  var boostLuck = Math.min(1.9, Math.max(1, Number(boosts.luck) || 1));

  GameState._runPassiveStats.might *= boostMight;
  GameState._runPassiveStats.cooldown *= boostCd;
  GameState._runPassiveStats.area *= boostArea;
  GameState._runPassiveStats.projectileSpeed *= boostProj;
  GameState._runPassiveStats.duration *= boostDuration;
  GameState._runPassiveStats.moveSpeed *= boostMove;
  GameState._runPassiveStats.pickupRange *= boostPickup;
  GameState._runPassiveStats.luck *= boostLuck;
}

function applyRunPassiveStatsToRuntime() {
  if (!GameState || !GameState._baseRunStats) return;
  applyRunPassiveStats();
  var base = GameState._baseRunStats;
  var stats = GameState._runPassiveStats || {};

  GameState.pPickupRange = (base.pPickupRange || 3.5) * (stats.pickupRange || 1.0);
  GameState.pLuck = (base.pLuck || 1.0) * (stats.luck || 1.0);
  GameState.pXpMult = (base.pXpMult || 1.0) * (stats.growth || 1.0);
  GameState.pDmgRed = (base.pDmgRed || 0) + ((stats.armorFlat || 0) * 0.02);

  if (typeof SPD !== 'undefined') {
    SPD = (base.SPD || SPD) * (stats.moveSpeed || 1.0);
  }

  var targetMaxHP = Math.max(1, Math.round((base.pMaxHP || 100) * (stats.maxHpMult || 1.0)));
  if (targetMaxHP !== GameState.pMaxHP) {
    var ratio = GameState.pMaxHP > 0 ? (GameState.pHP / GameState.pMaxHP) : 1;
    GameState.pMaxHP = targetMaxHP;
    GameState.pHP = Math.min(GameState.pMaxHP, Math.max(1, Math.round(GameState.pMaxHP * ratio)));
  }
}

function ensureWeaponRuntimeBase() {
  if (!GameState._weaponRuntimeBase || typeof GameState._weaponRuntimeBase !== 'object') {
    GameState._weaponRuntimeBase = {};
  }
}

function getWeaponRuntimeBase(weaponKey) {
  ensureWeaponRuntimeBase();
  if (!WEAPONS[weaponKey]) return null;
  if (!GameState._weaponRuntimeBase[weaponKey]) {
    var src = WEAPONS[weaponKey];
    GameState._weaponRuntimeBase[weaponKey] = {
      dmg: src.dmg,
      maxCd: src.maxCd,
      count: src.count,
      speed: src.speed,
      range: src.range,
      life: src.life,
      blast: src.blast,
      pierce: src.pierce,
      bounce: src.bounce,
      arc: src.arc,
      homing: src.homing
    };
  }
  return GameState._weaponRuntimeBase[weaponKey];
}

function applyInventoryWeaponScalingToRuntime() {
  if (typeof WEAPONS === 'undefined') return;
  ensureWeaponRuntimeBase();

  var runStats = GameState._runPassiveStats || {
    might: 1.0,
    cooldown: 1.0,
    area: 1.0,
    projectileSpeed: 1.0,
    duration: 1.0,
    amountFlat: 0
  };

  for (var key in WEAPONS) {
    var w = WEAPONS[key];
    if (!w) continue;
    var base = getWeaponRuntimeBase(key);
    if (!base) continue;
    var isRanged = String(w.kind || '').toLowerCase() === 'ranged';

    // Always reset from immutable baseline first.
    w.dmg = base.dmg;
    w.maxCd = base.maxCd;
    if (base.count !== undefined) w.count = base.count;
    if (base.speed !== undefined) w.speed = base.speed;
    if (base.range !== undefined) w.range = base.range;
    if (base.life !== undefined) w.life = base.life;
    if (base.blast !== undefined) w.blast = base.blast;
    if (base.pierce !== undefined) w.pierce = base.pierce;
    if (base.bounce !== undefined) w.bounce = base.bounce;
    if (base.arc !== undefined) w.arc = base.arc;
    if (base.homing !== undefined) w.homing = base.homing;

    var entry = getInventoryWeaponEntryById(key);
    if (!entry) continue;

    var lvl = Math.max(1, Math.floor(entry.level || 1));
    var dmgMult = 1 + (lvl - 1) * 0.18;
    var cdMult = Math.max(0.45, 1 - (lvl - 1) * 0.06);

    if (entry.evolved) {
      dmgMult *= 1.65;
      cdMult *= 0.72;
    }

    w.dmg = base.dmg * dmgMult * (runStats.might || 1.0);
    w.maxCd = base.maxCd * cdMult * (runStats.cooldown || 1.0);

    if (base.count !== undefined) {
      var lvlCountBonus = (lvl >= 3 ? 1 : 0) + (lvl >= 5 ? 1 : 0) + (lvl >= 7 ? 1 : 0);
      w.count = Math.max(1, base.count + lvlCountBonus + (runStats.amountFlat || 0));
    }

    if (base.speed !== undefined) {
      var rangedSpeedBase = isRanged ? 0.9 : 1.0;
      var speedPerLevel = isRanged ? 0.03 : 0.05;
      w.speed = base.speed * rangedSpeedBase * (1 + (lvl - 1) * speedPerLevel) * (runStats.projectileSpeed || 1.0);
    }
    if (base.range !== undefined) {
      var rangedRangeBase = isRanged ? 0.78 : 1.0;
      w.range = base.range * rangedRangeBase * (runStats.area || 1.0);
    }
    if (base.life !== undefined) {
      var rangedLifeBase = isRanged ? 0.62 : 1.0;
      var lifePerLevel = isRanged ? 0.02 : 0.0;
      w.life = base.life * rangedLifeBase * (1 + (lvl - 1) * lifePerLevel) * (runStats.duration || 1.0);
    }
    if (base.blast !== undefined && lvl >= 4) w.blast = base.blast + Math.floor((lvl - 1) / 3);
    if (base.pierce !== undefined && lvl >= 4) w.pierce = base.pierce + Math.floor((lvl - 1) / 3);
    if (base.bounce !== undefined && lvl >= 5) w.bounce = base.bounce + Math.floor((lvl - 2) / 4);
  }
}

function getStarterKitSummaryForClass(classData) {
  if (!classData) return '';
  var primary = normalizeWeaponKey(classData.wep);
  var kit = getClassStarterKit(classData.id, primary);
  var slotWeapons = [];
  if (Array.isArray(kit.aimed)) slotWeapons = slotWeapons.concat(kit.aimed);
  if (Array.isArray(kit.auto)) slotWeapons = slotWeapons.concat(kit.auto);
  if (!slotWeapons.length) slotWeapons.push(primary);
  slotWeapons = slotWeapons.slice(0, 6).map(normalizeWeaponKey).map(formatWeaponName);
  var passives = (kit.passives || []).slice(0, 2).map(function (id) {
    var def = getPassiveItemDef(id);
    return def ? def.name : id;
  });
  return 'Armes: ' + (slotWeapons.join(', ') || 'Aucune')
    + ' | Objets: ' + (passives.join(', ') || 'Aucun');
}
