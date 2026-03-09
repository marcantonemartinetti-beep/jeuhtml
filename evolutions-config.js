// ==================== EVOLUTIONS (VS-LIKE RECIPES) ====================
// Recipe format:
// - baseWeaponId: weapon key in WEAPONS
// - requiredPassiveId: passive item id from PASSIVE_ITEMS
// - evolvedWeaponId: future evolved weapon key
// - requiresMaxPassive: if true, passive must be max level
var EVOLUTION_RECIPES = [
  { baseWeaponId: 'SCEPTER', requiredPassiveId: 'empty_tome', evolvedWeaponId: 'HOLY_WAND', requiresMaxPassive: false },
  { baseWeaponId: 'DAGGERS', requiredPassiveId: 'bracer', evolvedWeaponId: 'THOUSAND_EDGE', requiresMaxPassive: false },
  { baseWeaponId: 'AXE', requiredPassiveId: 'candelabrador', evolvedWeaponId: 'DEATH_SPIRAL', requiresMaxPassive: false },
  { baseWeaponId: 'WHIP', requiredPassiveId: 'hollow_heart', evolvedWeaponId: 'BLOODY_TEAR', requiresMaxPassive: false },
  { baseWeaponId: 'BOW', requiredPassiveId: 'clover', evolvedWeaponId: 'HEAVEN_SWORD', requiresMaxPassive: false },
  { baseWeaponId: 'LIGHTNING_ROD', requiredPassiveId: 'duplicator', evolvedWeaponId: 'THUNDER_LOOP', requiresMaxPassive: false },
  { baseWeaponId: 'POTION', requiredPassiveId: 'attractorb', evolvedWeaponId: 'LA_BORRA', requiresMaxPassive: false },
  { baseWeaponId: 'GRIMOIRE', requiredPassiveId: 'spellbinder', evolvedWeaponId: 'UNHOLY_VESPERS', requiresMaxPassive: false },
  { baseWeaponId: 'ARCANE_ORB', requiredPassiveId: 'spellbinder', evolvedWeaponId: 'ASTRAL_ORBIT', requiresMaxPassive: false },
  { baseWeaponId: 'SAW_BLADE', requiredPassiveId: 'bracer', evolvedWeaponId: 'COSMIC_RIPSAW', requiresMaxPassive: false },
  { baseWeaponId: 'FIRE_STAFF', requiredPassiveId: 'spinach', evolvedWeaponId: 'HELLFIRE_STAFF', requiresMaxPassive: false },
  { baseWeaponId: 'BLOOD_LANCE', requiredPassiveId: 'hollow_heart', evolvedWeaponId: 'BLOODSTORM_LANCE', requiresMaxPassive: false },
  { baseWeaponId: 'MAGIC_MISSILE', requiredPassiveId: 'empty_tome', evolvedWeaponId: 'INFINITE_MISSILE', requiresMaxPassive: false },
  { baseWeaponId: 'SHADOW_DISC', requiredPassiveId: 'bracer', evolvedWeaponId: 'ECLIPSE_DISC', requiresMaxPassive: false },
  { baseWeaponId: 'CELESTIAL_SPEAR', requiredPassiveId: 'duplicator', evolvedWeaponId: 'SPEAR_OF_RUIN', requiresMaxPassive: false },
  { baseWeaponId: 'PHANTOM_TAROT', requiredPassiveId: 'clover', evolvedWeaponId: 'ARCANA_STORM', requiresMaxPassive: false },
  { baseWeaponId: 'DRAGON_SPARK', requiredPassiveId: 'duplicator', evolvedWeaponId: 'JUDGMENT_CHAIN', requiresMaxPassive: false },
  { baseWeaponId: 'SACRED_FLASK', requiredPassiveId: 'attractorb', evolvedWeaponId: 'ALCHEMICAL_DELUGE', requiresMaxPassive: false },
  { baseWeaponId: 'RAIL_LANCE', requiredPassiveId: 'hawk_eye', evolvedWeaponId: 'SKY_BREAKER', requiresMaxPassive: false },
  { baseWeaponId: 'NOVA_TOME', requiredPassiveId: 'arcane_ink', evolvedWeaponId: 'APOCALYPSE_TOME', requiresMaxPassive: false },
  { baseWeaponId: 'SIEGE_MORTAR', requiredPassiveId: 'siege_manual', evolvedWeaponId: 'OBLIVION_MORTAR', requiresMaxPassive: false },
  { baseWeaponId: 'FATE_NEEDLE', requiredPassiveId: 'stone_mask', evolvedWeaponId: 'FATE_WEAVER', requiresMaxPassive: false },

  // New VS-like branches
  { baseWeaponId: 'KNIFE_VOLLEY', requiredPassiveId: 'bracer', evolvedWeaponId: 'MILLION_EDGE', requiresMaxPassive: false },
  { baseWeaponId: 'HOLY_BIBLE', requiredPassiveId: 'spellbinder', evolvedWeaponId: 'SANCTIFIED_SCRIPTURE', requiresMaxPassive: false },
  { baseWeaponId: 'GARLIC_AURA', requiredPassiveId: 'armor', evolvedWeaponId: 'SOUL_EATER', requiresMaxPassive: false },
  { baseWeaponId: 'PHIAL_RAIN', requiredPassiveId: 'attractorb', evolvedWeaponId: 'TOXIC_MONSOON', requiresMaxPassive: false },
  { baseWeaponId: 'BONE_SWARM', requiredPassiveId: 'candelabrador', evolvedWeaponId: 'BONE_STORM', requiresMaxPassive: false },
  { baseWeaponId: 'CLOCK_LANCET', requiredPassiveId: 'empty_tome', evolvedWeaponId: 'INFINITE_CORRIDOR', requiresMaxPassive: false },
  { baseWeaponId: 'MANA_CHANT', requiredPassiveId: 'arcane_ink', evolvedWeaponId: 'MELODY_OF_ABYSS', requiresMaxPassive: false },
  { baseWeaponId: 'THUNDER_DRUM', requiredPassiveId: 'duplicator', evolvedWeaponId: 'TEMPEST_FINALE', requiresMaxPassive: false },
  { baseWeaponId: 'RUNE_TRACER', requiredPassiveId: 'armor', evolvedWeaponId: 'OMEGA_TRACER', requiresMaxPassive: false },
  { baseWeaponId: 'HEAVEN_BIRDS', requiredPassiveId: 'clover', evolvedWeaponId: 'COSMOS_FALCON', requiresMaxPassive: false },
  { baseWeaponId: 'SILVER_WIND', requiredPassiveId: 'spinach', evolvedWeaponId: 'FESTIVAL_OF_WINDS', requiresMaxPassive: false },
  { baseWeaponId: 'CELESTIAL_BELLS', requiredPassiveId: 'spellbinder', evolvedWeaponId: 'SERAPHIC_CARILLON', requiresMaxPassive: false },
  { baseWeaponId: 'PHOENIX_ASH', requiredPassiveId: 'spinach', evolvedWeaponId: 'APOCALYPSE_PLUME', requiresMaxPassive: false },
  { baseWeaponId: 'RAZOR_GALE', requiredPassiveId: 'bracer', evolvedWeaponId: 'HURRICANE_RAZORS', requiresMaxPassive: false }
];

function findEvolutionRecipe(baseWeaponId) {
  if (!baseWeaponId) return null;
  for (var i = 0; i < EVOLUTION_RECIPES.length; i++) {
    if (EVOLUTION_RECIPES[i].baseWeaponId === baseWeaponId) return EVOLUTION_RECIPES[i];
  }
  return null;
}
