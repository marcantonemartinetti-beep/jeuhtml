// ═══════════════════════════════════════════════
// DUNGEON WORLD - Weapons Configuration
// ═══════════════════════════════════════════════

// ==================== WEAPONS ====================
var WEAPONS = {
  SCEPTER: {active:true,level:1,icon:'fa-solid fa-wand-magic-sparkles',dmg:12,cd:0,maxCd:0.6,count:1,spread:0.05,speed:25,life:1.5,homing:0.1,blast:0,pierce:0,bounce:0,fire:false,ice:false,lightning:false},
  SWORD: {active:false,level:1,icon:'fa-solid fa-sword',dmg:35,cd:0,maxCd:0.5,range:4.5,arc:2.0},
  AXE: {active:false,level:1,icon:'fa-solid fa-axe',dmg:55,cd:0,maxCd:1.1,range:4.0,arc:Math.PI*2},
  BOW: {active:false,level:1,icon:'fa-solid fa-bow-arrow',dmg:45,cd:0,maxCd:0.8,speed:3.0,arc:1.5},
  SPEAR: {active:false,level:1,icon:'fa-solid fa-khanda',dmg:30,cd:0,maxCd:0.7,range:7.0,arc:0.8},
  HAMMER: {active:false,level:1,icon:'fa-solid fa-hammer',dmg:70,cd:0,maxCd:1.4,range:3.5,arc:2.5},
  BOOMERANG: {active:false,level:1,icon:'fa-solid fa-fan',dmg:25,cd:0,maxCd:0.8,speed:25,life:2.5,count:1,spread:0.1,boomerang:true},
  SCYTHE: {active:false,level:1,icon:'fa-solid fa-skull',dmg:45,cd:0,maxCd:1.1,range:5.0,arc:2.5},
  KATANA: {active:false,level:1,icon:'fa-solid fa-khanda',dmg:28,cd:0,maxCd:0.3,range:3.5,arc:1.2},
  GAUNTLETS: {active:false,level:1,icon:'fa-solid fa-hand-fist',dmg:20,cd:0,maxCd:0.15,range:2.5,arc:1.0},
  GRIMOIRE: {active:false,level:1,icon:'fa-solid fa-book-skull',dmg:15,cd:0,maxCd:0.6,speed:18,life:3.0,count:3,spread:0.4},
  WHIP: {active:false,level:1,icon:'fa-solid fa-paw',dmg:35,cd:0,maxCd:0.5,range:6.0,arc:2.5},
  CARDS: {active:false,level:1,icon:'fa-solid fa-diamond',dmg:22,cd:0,maxCd:0.4,speed:35,life:1.2,count:3,spread:0.3,bounce:1},
  PISTOL: {active:false,level:1,icon:'fa-solid fa-skull-crossbones',dmg:30,cd:0,maxCd:0.5,speed:40,life:1.0,count:1,spread:0.02},
  TRIDENT: {active:false,level:1,icon:'fa-solid fa-helmet-battle',dmg:50,cd:0,maxCd:0.9,speed:30,life:2.0,count:1,spread:0.05,pierce:3},
  RIFLE: {active:false,level:1,icon:'fa-solid fa-crosshairs',dmg:90,cd:0,maxCd:1.5,speed:80,life:2.0,count:1,spread:0.001,pierce:10},
  SHURIKEN: {active:false,level:1,icon:'fa-solid fa-user-ninja',dmg:15,cd:0,maxCd:0.25,speed:35,life:1.0,count:2,spread:0.2},
  VOID_STAFF: {active:false,level:1,icon:'fa-solid fa-circle-notch',dmg:60,cd:0,maxCd:1.2,speed:15,life:3.0,count:1,spread:0,blast:4},
  FLAIL: {active:false,level:1,icon:'fa-solid fa-cross',dmg:50,cd:0,maxCd:1.0,range:4.0,arc:Math.PI*2},
  WRENCH: {active:false,level:1,icon:'fa-solid fa-gears',dmg:65,cd:0,maxCd:1.2,range:3.0,arc:2.0},
  FIRE_STAFF: {active:false,level:1,icon:'fa-solid fa-fire',dmg:40,cd:0,maxCd:0.8,speed:20,life:2.0,count:1,spread:0.05,blast:2},
  LEAF_BLADE: {active:false,level:1,icon:'fa-solid fa-leaf',dmg:20,cd:0,maxCd:0.4,speed:25,life:2.0,count:2,spread:0.3,homing:0.5},
  POTION: {active:false,level:1,icon:'fa-solid fa-flask',dmg:30,cd:0,maxCd:1.0,speed:15,life:1.5,count:1,spread:0.1,blast:3},
  LUTE: {active:false,level:1,icon:'fa-solid fa-music',dmg:25,cd:0,maxCd:0.7,range:8.0,arc:Math.PI*2},
  JAVELIN: {active:false,level:1,icon:'fa-solid fa-feather-pointed',dmg:55,cd:0,maxCd:1.0,speed:40,life:2.0,count:1,spread:0.02,pierce:3},
  CROSSBOW: {active:false,level:1,icon:'fa-solid fa-crosshairs',dmg:45,cd:0,maxCd:0.9,speed:60,life:1.5,count:1,spread:0.01,pierce:1},
  RUNESTONE: {active:false,level:1,icon:'fa-solid fa-cube',dmg:70,cd:0,maxCd:1.3,speed:20,life:2.0,count:1,spread:0.05,blast:3},
  RAPIER: {active:false,level:1,icon:'fa-solid fa-pen-nib',dmg:25,cd:0,maxCd:0.25,range:4.0,arc:0.8},
  BOMB: {active:false,level:1,icon:'fa-solid fa-bomb',dmg:80,cd:0,maxCd:1.5,speed:15,life:2.0,count:1,spread:0.1,blast:5},
  TOTEM: {active:false,level:1,icon:'fa-solid fa-mask',dmg:60,cd:0,maxCd:1.2,range:3.5,arc:Math.PI*2},
  CLAWS: {active:false,level:1,icon:'fa-solid fa-dog',dmg:15,cd:0,maxCd:0.15,range:2.0,arc:1.5},
  MACE: {active:false,level:1,icon:'fa-solid fa-gavel',dmg:50,cd:0,maxCd:0.9,range:3.0,arc:2.0},
  MIRROR: {active:false,level:1,icon:'fa-solid fa-clone',dmg:30,cd:0,maxCd:0.6,speed:30,life:2.0,count:2,spread:0.2,bounce:2},
  REVOLVER: {active:false,level:1,icon:'fa-solid fa-hat-cowboy',dmg:35,cd:0,maxCd:0.4,speed:70,life:1.0,count:1,spread:0.05},
  NEEDLES: {active:false,level:1,icon:'fa-solid fa-vihara',dmg:10,cd:0,maxCd:0.1,speed:45,life:1.0,count:1,spread:0.1},
  LIGHTNING_ROD: {active:false,level:1,icon:'fa-solid fa-bolt',dmg:45,cd:0,maxCd:0.8,speed:50,life:1.0,count:1,spread:0.02,lightning:true},
  ARCANE_ORB: {active:false,level:1,icon:'fa-solid fa-circle-dot',dmg:34,cd:0,maxCd:0.5,count:1,spread:0.04,speed:23,life:2.0,homing:0.2,pierce:1},
  SAW_BLADE: {active:false,level:1,icon:'fa-solid fa-compact-disc',dmg:26,cd:0,maxCd:0.62,speed:27,life:2.4,count:1,spread:0.08,boomerang:true,pierce:1},
  BLOOD_LANCE: {active:false,level:1,icon:'fa-solid fa-staff-snake',dmg:66,cd:0,maxCd:0.92,speed:42,life:2.2,count:1,spread:0.02,pierce:4},
  CHAIN_LIGHTNING: {active:false,level:1,icon:'fa-solid fa-bolt-lightning',dmg:52,cd:0,maxCd:0.72,speed:60,life:1.1,count:1,spread:0.03,lightning:true,pierce:2},
  MAGIC_MISSILE: {active:false,level:1,icon:'fa-solid fa-wand-sparkles',dmg:32,cd:0,maxCd:0.48,count:1,spread:0.03,speed:27,life:1.9,homing:0.18,pierce:1},
  SHADOW_DISC: {active:false,level:1,icon:'fa-solid fa-compact-disc',dmg:29,cd:0,maxCd:0.58,speed:30,life:2.6,count:1,spread:0.09,boomerang:true,pierce:2},
  CELESTIAL_SPEAR: {active:false,level:1,icon:'fa-solid fa-khanda',dmg:62,cd:0,maxCd:0.88,speed:44,life:2.3,count:1,spread:0.02,pierce:4},
  PHANTOM_TAROT: {active:false,level:1,icon:'fa-solid fa-diamond',dmg:26,cd:0,maxCd:0.38,speed:36,life:1.4,count:3,spread:0.33,bounce:1},
  DRAGON_SPARK: {active:false,level:1,icon:'fa-solid fa-bolt',dmg:58,cd:0,maxCd:0.66,speed:64,life:1.2,count:1,spread:0.03,lightning:true,pierce:2},
  SACRED_FLASK: {active:false,level:1,icon:'fa-solid fa-flask',dmg:38,cd:0,maxCd:0.94,speed:16,life:1.9,count:1,spread:0.14,blast:4},
  RAIL_LANCE: {active:false,level:1,icon:'fa-solid fa-arrows-to-dot',dmg:72,cd:0,maxCd:1.0,speed:52,life:2.5,count:1,spread:0.01,pierce:5},
  NOVA_TOME: {active:false,level:1,icon:'fa-solid fa-book-open-reader',dmg:24,cd:0,maxCd:0.52,speed:20,life:3.4,count:4,spread:0.5,pierce:2},
  SIEGE_MORTAR: {active:false,level:1,icon:'fa-solid fa-cannon',dmg:92,cd:0,maxCd:1.35,speed:18,life:2.1,count:1,spread:0.1,blast:6},
  FATE_NEEDLE: {active:false,level:1,icon:'fa-solid fa-thumbtack',dmg:18,cd:0,maxCd:0.14,speed:52,life:1.2,count:2,spread:0.15,pierce:1},
  HOLY_WAND: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-wand-magic-sparkles',dmg:24,cd:0,maxCd:0.42,count:2,spread:0.04,speed:28,life:1.8,homing:0.35,blast:0,pierce:1,bounce:0,fire:false,ice:false,lightning:false},
  THOUSAND_EDGE: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-dagger',dmg:38,cd:0,maxCd:0.18,range:3.2,arc:1.6},
  DEATH_SPIRAL: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-axe',dmg:88,cd:0,maxCd:0.78,range:6.5,arc:Math.PI*2},
  BLOODY_TEAR: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-paw',dmg:62,cd:0,maxCd:0.34,range:7.2,arc:2.8},
  HEAVEN_SWORD: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-bow-arrow',dmg:70,cd:0,maxCd:0.5,speed:3.6,arc:1.7,pierce:2,count:2,spread:0.05},
  THUNDER_LOOP: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-bolt',dmg:90,cd:0,maxCd:0.55,speed:65,life:1.2,count:2,spread:0.03,lightning:true,pierce:2},
  LA_BORRA: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-flask',dmg:55,cd:0,maxCd:0.7,speed:17,life:2.3,count:2,spread:0.2,blast:5},
  UNHOLY_VESPERS: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-book-skull',dmg:30,cd:0,maxCd:0.22,speed:19,life:4.0,count:6,spread:0.55,pierce:99},
  ASTRAL_ORBIT: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-galaxy',dmg:68,cd:0,maxCd:0.34,count:2,spread:0.08,speed:30,life:2.8,homing:0.45,pierce:3},
  COSMIC_RIPSAW: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-circle-radiation',dmg:74,cd:0,maxCd:0.46,speed:32,life:3.0,count:2,spread:0.12,boomerang:true,pierce:3},
  HELLFIRE_STAFF: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-fire-flame-curved',dmg:95,cd:0,maxCd:0.62,speed:25,life:2.3,count:2,spread:0.07,blast:4,fire:true},
  BLOODSTORM_LANCE: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-staff-aesculapius',dmg:108,cd:0,maxCd:0.66,speed:50,life:2.5,count:2,spread:0.05,pierce:7},
  INFINITE_MISSILE: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-wand-sparkles',dmg:70,cd:0,maxCd:0.3,count:2,spread:0.05,speed:34,life:2.2,homing:0.42,pierce:3},
  ECLIPSE_DISC: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-circle-radiation',dmg:84,cd:0,maxCd:0.42,speed:34,life:3.2,count:2,spread:0.14,boomerang:true,pierce:4},
  SPEAR_OF_RUIN: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-khanda',dmg:118,cd:0,maxCd:0.6,speed:56,life:2.8,count:2,spread:0.05,pierce:8},
  ARCANA_STORM: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-diamond',dmg:54,cd:0,maxCd:0.22,speed:40,life:1.8,count:6,spread:0.6,bounce:3},
  JUDGMENT_CHAIN: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-bolt-lightning',dmg:104,cd:0,maxCd:0.5,speed:70,life:1.4,count:2,spread:0.05,lightning:true,pierce:4},
  ALCHEMICAL_DELUGE: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-flask',dmg:78,cd:0,maxCd:0.58,speed:20,life:2.7,count:2,spread:0.24,blast:6},
  SKY_BREAKER: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-arrows-to-dot',dmg:138,cd:0,maxCd:0.62,speed:62,life:3.0,count:2,spread:0.04,pierce:10},
  APOCALYPSE_TOME: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-book-skull',dmg:44,cd:0,maxCd:0.28,speed:24,life:4.4,count:7,spread:0.65,pierce:4},
  OBLIVION_MORTAR: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-cannon',dmg:152,cd:0,maxCd:0.72,speed:24,life:2.6,count:2,spread:0.18,blast:9},
  FATE_WEAVER: {active:false,level:1,maxLevel:1,icon:'fa-solid fa-thumbtack',dmg:38,cd:0,maxCd:0.07,speed:62,life:1.6,count:4,spread:0.22,pierce:3},
  ICE_BOW: {active:false,level:1,icon:'fa-solid fa-snowflake',dmg:35,cd:0,maxCd:0.9,speed:55,life:1.5,count:1,spread:0.01,ice:true},
  DAGGER_SAC: {active:false,level:1,icon:'fa-solid fa-heart-crack',dmg:25,cd:0,maxCd:0.4,range:2.5,arc:1.2},
  DRILL: {active:false,level:1,icon:'fa-solid fa-screwdriver',dmg:10,cd:0,maxCd:0.05,range:2.0,arc:0.5},
  STAR_GLOBE: {active:false,level:1,icon:'fa-solid fa-star',dmg:40,cd:0,maxCd:0.8,speed:20,life:3.0,count:2,spread:0.5,homing:1.0},
  CLEAVER: {active:false,level:1,icon:'fa-solid fa-utensils',dmg:50,cd:0,maxCd:0.7,speed:30,life:1.0,count:1,spread:0.05,pierce:2},
  BALLS: {active:false,level:1,icon:'fa-solid fa-baseball',dmg:20,cd:0,maxCd:0.3,speed:25,life:2.0,count:1,spread:0.1,bounce:3},
  GREATSWORD: {active:false,level:1,icon:'fa-solid fa-khanda',dmg:100,cd:0,maxCd:1.8,range:5.0,arc:2.5},
  ROCK: {active:false,level:1,icon:'fa-solid fa-gem',dmg:60,cd:0,maxCd:1.1,speed:25,life:1.5,count:1,spread:0.05,blast:2},
  BLOWGUN: {active:false,level:1,icon:'fa-solid fa-wind',dmg:15,cd:0,maxCd:0.3,speed:50,life:1.0,count:1,spread:0.02},
  GREATBOW: {active:false,level:1,icon:'fa-solid fa-bullseye',dmg:120,cd:0,maxCd:2.0,speed:90,life:2.0,count:1,spread:0.0,pierce:5},
  DARK_BLADE: {active:false,level:1,icon:'fa-solid fa-moon',dmg:65,cd:0,maxCd:1.0,range:5.5,arc:2.0},
  SUN_STAFF: {active:false,level:1,icon:'fa-solid fa-sun',dmg:55,cd:0,maxCd:0.9,speed:40,life:1.5,count:1,spread:0.01,blast:1},
  HOURGLASS: {active:false,level:1,icon:'fa-solid fa-hourglass',dmg:30,cd:0,maxCd:0.8,speed:20,life:2.0,count:1,spread:0.1},
  MOON_SHOT: {active:false,level:1,icon:'fa-solid fa-moon',dmg:64,cd:0,maxCd:0.72,speed:68,life:1.9,count:1,spread:0.01,pierce:2},
  PLASMA_GLAIVE: {active:false,level:1,icon:'fa-solid fa-atom',dmg:38,cd:0,maxCd:0.54,speed:34,life:2.7,count:1,spread:0.1,boomerang:true,pierce:2},
  RUNE_CANNON: {active:false,level:1,icon:'fa-solid fa-cannon',dmg:96,cd:0,maxCd:1.18,speed:22,life:2.4,count:1,spread:0.1,blast:6},
  DAGGERS: {active:false,level:1,icon:'fa-solid fa-dagger',dmg:20,cd:0,maxCd:0.35,range:2.5,arc:1.0}
};

// Weapon meta to support unique run decisions and branching upgrades.
const MELEE_WEAPONS = ['SWORD','AXE','SPEAR','HAMMER','SCYTHE','KATANA','FLAIL','GAUNTLETS','WHIP','WRENCH','RAPIER','TOTEM','CLAWS','MACE','DAGGER_SAC','DRILL','GREATSWORD','DARK_BLADE','DAGGERS','THOUSAND_EDGE','DEATH_SPIRAL','BLOODY_TEAR'];
const RANGED_WEAPONS = ['SCEPTER','BOW','BOOMERANG','GRIMOIRE','CARDS','PISTOL','TRIDENT','RIFLE','SHURIKEN','VOID_STAFF','FIRE_STAFF','LEAF_BLADE','POTION','JAVELIN','CROSSBOW','RUNESTONE','BOMB','MIRROR','REVOLVER','NEEDLES','LIGHTNING_ROD','ARCANE_ORB','SAW_BLADE','BLOOD_LANCE','CHAIN_LIGHTNING','MAGIC_MISSILE','SHADOW_DISC','CELESTIAL_SPEAR','PHANTOM_TAROT','DRAGON_SPARK','SACRED_FLASK','RAIL_LANCE','NOVA_TOME','SIEGE_MORTAR','FATE_NEEDLE','HOLY_WAND','HEAVEN_SWORD','THUNDER_LOOP','LA_BORRA','UNHOLY_VESPERS','ASTRAL_ORBIT','COSMIC_RIPSAW','HELLFIRE_STAFF','BLOODSTORM_LANCE','INFINITE_MISSILE','ECLIPSE_DISC','SPEAR_OF_RUIN','ARCANA_STORM','JUDGMENT_CHAIN','ALCHEMICAL_DELUGE','SKY_BREAKER','APOCALYPSE_TOME','OBLIVION_MORTAR','FATE_WEAVER','ICE_BOW','STAR_GLOBE','CLEAVER','BALLS','ROCK','BLOWGUN','GREATBOW','SUN_STAFF','HOURGLASS','MOON_SHOT','PLASMA_GLAIVE','RUNE_CANNON'];

function weaponSeed(k) {
  let s = 0;
  for (let i = 0; i < k.length; i++) s = (s * 131 + k.charCodeAt(i)) % 1000003;
  return s;
}

function weaponRand(seed, off) {
  const x = Math.sin(seed * 12.9898 + off * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

for (const k in WEAPONS) {
  const w = WEAPONS[k];
  const seed = weaponSeed(k);
  w.key = k;
  w.kind = MELEE_WEAPONS.includes(k) ? 'melee' : 'ranged';
  w.identity = {
    ferocity: 0.8 + weaponRand(seed, 1) * 1.6,
    precision: 0.8 + weaponRand(seed, 2) * 1.6,
    tempo: 0.8 + weaponRand(seed, 3) * 1.6,
    control: 0.8 + weaponRand(seed, 4) * 1.6,
    volatility: 0.8 + weaponRand(seed, 5) * 1.6
  };
  w.critBonus = (weaponRand(seed, 6) * 0.18);
  w.statusChance = 0.04 + weaponRand(seed, 7) * 0.12;
  w.comboGain = 0.03 + weaponRand(seed, 8) * 0.09;
  w.stagger = 0.4 + weaponRand(seed, 9) * 1.8;
  w.executeBonus = 0.05 + weaponRand(seed, 10) * 0.2;
  w.armorBreak = weaponRand(seed, 11) * 0.2;
  w.pathPower = 0;
  w.pathControl = 0;
  w.pathChaos = 0;
  if (w.kind === 'ranged') {
    w.accel = -0.15 + weaponRand(seed, 12) * 0.55;
    w.drag = weaponRand(seed, 13) * 0.08;
    w.zigzagAmp = weaponRand(seed, 14) * 0.14;
    w.zigzagFreq = 3.0 + weaponRand(seed, 15) * 8.0;
  }
}
