// ==================== PASSIVE SPELLS ====================
var PASSIVES = {
  orb:   {active:false,level:0,count:0,meshes:[],angle:0,dmg:15,speed:2.5},
  dagger:{active:false,level:0,cd:0,maxCd:1.8,dmg:25,range:25},
  aura:  {active:false,level:0,cd:0,maxCd:0.8,dmg:8,range:6,mesh:null},
  poison:{active:false,level:0,cd:0,maxCd:3.0,dmg:10,range:4,pools:[]},
  shield:{active:false,level:0,count:0,meshes:[],angle:0,dmg:10,range:2.0},
  turret:{active:false,level:0,count:0,meshes:[],cd:0,maxCd:2.5,dmg:15,range:15},
  skulls:{active:false,level:0,cd:0,maxCd:2.0,dmg:20,range:20},
  meteor:{active:false,level:0,cd:0,maxCd:4.0,dmg:100,range:5},
  lightning:{active:false,level:0,cd:0,maxCd:2.5,dmg:40,range:10},
  rift:{active:false,level:0,cd:0,maxCd:3.6,dmg:30,range:12,pulls:0.9},
  mirrorOrb:{active:false,level:0,count:0,meshes:[],angle:0,dmg:14,speed:1.8,range:3.2}
};

// ==================== UPGRADES ====================
var RARITIES = {
  common: {n:'Commun', m:1, c:'common'},
  rare: {n:'Rare', m:1.5, c:'rare'},
  legendary: {n:'Légendaire', m:2.5, c:'legendary'}
};

var UPGRADES = [
  {id:'rate', name:'Hâte', icon:'fa-solid fa-forward-fast', type:'stat', scale:m=>{const v=Math.round(15*m); return {desc:`+${v}% Vitesse d'attaque`, apply:()=>{const r=(1-v/100); for(let k in WEAPONS) WEAPONS[k].maxCd*=r; WEAPONS.SCEPTER.level++;}}}},
  {id:'dmg', name:'Puissance', icon:'fa-solid fa-bolt', type:'stat', scale:m=>{const v=Math.round(20*m); return {desc:`+${v}% Dégâts`, apply:()=>{const r=(1+v/100); for(let k in WEAPONS) WEAPONS[k].dmg*=r; WEAPONS.SCEPTER.level++;}}}},
  {id:'multi', name:'Multishot', icon:'fa-solid fa-arrows-split-up-and-left', req:()=>WEAPONS.SCEPTER.active||WEAPONS.BOW.active||WEAPONS.BOOMERANG.active||WEAPONS.CARDS.active||WEAPONS.SHURIKEN.active||WEAPONS.RIFLE.active||WEAPONS.FIRE_STAFF.active||WEAPONS.LEAF_BLADE.active||WEAPONS.POTION.active||WEAPONS.CROSSBOW.active||WEAPONS.REVOLVER.active||WEAPONS.NEEDLES.active||WEAPONS.STAR_GLOBE.active||WEAPONS.BALLS.active||WEAPONS.BLOWGUN.active||WEAPONS.SUN_STAFF.active, type:'stat', scale:m=>{const v=Math.floor(1*m); return {desc:`+${v} Projectile(s)`, apply:()=>{for(let k in WEAPONS) if(WEAPONS[k].count) WEAPONS[k].count+=v; WEAPONS.SCEPTER.level++;}}}},
  {id:'spd', name:'Vélocité', icon:'fa-solid fa-wind', req:()=>!WEAPONS.SWORD.active && !WEAPONS.AXE.active && !WEAPONS.HAMMER.active, type:'stat', scale:m=>{const v=Math.round(25*m); return {desc:`+${v}% Vitesse projectile`, apply:()=>{for(let k in WEAPONS) if(WEAPONS[k].speed) WEAPONS[k].speed*=(1+v/100); WEAPONS.SCEPTER.level++;}}}},
  {id:'range', name:'Portée', icon:'fa-solid fa-ruler-horizontal', type:'stat', scale:m=>{const v=Math.round(20*m); return {desc:`+${v}% Portée`, apply:()=>{for(let k in WEAPONS) if(WEAPONS[k].life) WEAPONS[k].life*=(1+v/100); else if(WEAPONS[k].range) WEAPONS[k].range*=(1+v/100); WEAPONS.SCEPTER.level++;}}}},
  {id:'homing', name:'Guidage', icon:'fa-solid fa-eye', req:()=>!WEAPONS.SWORD.active, type:'effect', scale:m=>{const v=Math.round(2*m); return {desc:`Guidage des projectiles (+${v})`, apply:()=>{for(let k in WEAPONS) if(WEAPONS[k].homing !== undefined) WEAPONS[k].homing+=v; WEAPONS.SCEPTER.level++;}}}},
  {id:'blast', name:'Explosion', icon:'fa-solid fa-bomb', req:()=>!WEAPONS.SWORD.active, type:'effect', scale:m=>{const v=Math.round(1.5*m); return {desc:`Explosion à l'impact (+${v}m)`, apply:()=>{for(let k in WEAPONS) if(WEAPONS[k].blast !== undefined) WEAPONS[k].blast+=v; WEAPONS.SCEPTER.level++;}}}},
  {id:'pierce', name:'Perforation', icon:'fa-solid fa-angles-right', req:()=>!WEAPONS.SWORD.active, type:'effect', scale:m=>{const v=Math.floor(1*m); return {desc:`Traverse +${v} ennemi(s)`, apply:()=>{for(let k in WEAPONS) if(WEAPONS[k].pierce !== undefined) WEAPONS[k].pierce+=v; WEAPONS.SCEPTER.level++;}}}},
  {id:'bounce', name:'Ricochet', icon:'fa-solid fa-arrows-turn-to-dots', req:()=>!WEAPONS.SWORD.active, type:'effect', scale:m=>{const v=Math.floor(1*m); return {desc:`Rebondit +${v} fois`, apply:()=>{for(let k in WEAPONS) if(WEAPONS[k].bounce !== undefined) WEAPONS[k].bounce+=v; WEAPONS.SCEPTER.level++;}}}},
  {id:'fire', name:'Enchantement Feu', icon:'fa-solid fa-fire', type:'magic', req:s=>!s.fire, scale:m=>{return {desc:'Brûle les ennemis (Crit)', apply:()=>{WEAPONS.SCEPTER.fire=true;const r=1.1; for(let k in WEAPONS) WEAPONS[k].dmg*=r; WEAPONS.SCEPTER.level++;}}}},
  {id:'ice', name:'Enchantement Glace', icon:'fa-solid fa-snowflake', type:'magic', req:s=>!s.ice, scale:m=>{return {desc:'Ralentit les ennemis', apply:()=>{WEAPONS.SCEPTER.ice=true;WEAPONS.SCEPTER.level++;}}}},
  {id:'light', name:'Enchantement Foudre', icon:'fa-solid fa-bolt-lightning', type:'magic', req:s=>!s.lightning, scale:m=>{return {desc:'Éclairs en chaîne', apply:()=>{WEAPONS.SCEPTER.lightning=true;WEAPONS.SCEPTER.level++;}}}},
  {id:'magnet', name:'Aimant Spirituel', icon:'fa-solid fa-magnet', type:'stat', scale:m=>{const v=Math.round(40*m); return {desc:`+${v}% Portée de ramassage`, apply:()=>{GameState.pPickupRange*=(1+v/100);}}}},
  {id:'maxhp', name:'Vitalité', icon:'fa-solid fa-heart-pulse', type:'stat', scale:m=>{const v=Math.round(25*m); return {desc:`+${v} PV Max`, apply:()=>{GameState.pMaxHP+=v;GameState.pHP+=v;}}}},
  {id:'regen', name:'Régénération', icon:'fa-solid fa-hand-holding-medical', type:'stat', scale:m=>{const v=(1.5*m).toFixed(1); return {desc:`+${v} PV/sec`, apply:()=>{GameState.pRegen+=parseFloat(v);}}}},
  {id:'luck', name:'Chance', icon:'fa-solid fa-clover', type:'stat', scale:m=>{const v=Math.round(20*m); return {desc:`+${v}% Chance (Crit/Loot)`, apply:()=>{GameState.pLuck*=(1+v/100);}}}},
  {id:'vamp', name:'Vampirisme', icon:'fa-solid fa-droplet', type:'stat', scale:m=>{const v=Math.round(5*m); return {desc:`+${v}% Chance de soin au kill`, apply:()=>{GameState.pVamp+=v/100;}}}},
  {id:'exec', name:'Exécution', icon:'fa-solid fa-skull-crossbones', type:'stat', scale:m=>{const v=Math.round(8*m); return {desc:`Tue les ennemis sous ${v}% PV`, apply:()=>{GameState.pExec+=v/100;}}}},
  {id:'thorns', name:'Épines', icon:'fa-solid fa-shield-virus', type:'stat', scale:m=>{const v=Math.round(10*m); return {desc:`Renvoie ${v} dégâts au contact`, apply:()=>{GameState.pThorns+=v;}}}},
  {id:'dash', name:'Agilité', icon:'fa-solid fa-person-running', type:'stat', scale:m=>{const v=Math.round(15*m); return {desc:`-${v}% Cooldown du Dash`, apply:()=>{GameState.pDashCdMult*=(1-v/100);}}}},
  {id:'xp', name:'Sagesse', icon:'fa-solid fa-brain', type:'stat', scale:m=>{const v=Math.round(20*m); return {desc:`+${v}% Gain d'XP`, apply:()=>{GameState.pXpMult*=(1+v/100);}}}},
  {id:'jump', name:'Ailes d\'Hermès', icon:'fa-solid fa-feather-pointed', type:'stat', scale:m=>{const v=Math.floor(1*m); return {desc:`+${v} Saut(s) en l'air`, apply:()=>{GameState.pMaxJumps+=v;}}}},
  {id:'crit', name:'Coups Fatals', icon:'fa-solid fa-burst', type:'stat', scale:m=>{const v=Math.round(50*m); return {desc:`+${v}% Dégûts Critiques`, apply:()=>{GameState.pCritDmg+=v/100;}}}},
  {id:'size', name:'Colosse', icon:'fa-solid fa-maximize', type:'stat', scale:m=>{const v=Math.round(20*m); return {desc:`+${v}% Taille des attaques`, apply:()=>{GameState.pArea*=(1+v/100);}}}},
  {id:'dodge', name:'Esquive', icon:'fa-solid fa-person-falling-burst', type:'stat', scale:m=>{const v=Math.round(10*m); return {desc:`+${v}% Chance d'esquive`, apply:()=>{GameState.pDodge+=v/100;}}}},
  {id:'mastery', name:'Maîtrise', icon:'fa-solid fa-star', type:'stat', scale:m=>{const v=Math.floor(2*m); return {desc:`+${v} Niveau(x) d'arme`, apply:()=>{WEAPONS.SCEPTER.level+=v;}}}},
  {id:'armor', name:'Armure Runique', icon:'fa-solid fa-shield-halved', type:'stat', scale:m=>{const v=Math.round(10*m); return {desc:`-${v}% Dégâts subis`, apply:()=>{GameState.pDmgRed+=v/100;}}}},
  {id:'berserk', name:'Rage', icon:'fa-solid fa-heart-crack', type:'stat', scale:m=>{const v=Math.round(15*m); return {desc:`+${v}% Dégâts si PV bas`, apply:()=>{GameState.pLowHpDmg+=v/100;}}}},
  {id:'bleed', name:'Hémorragie', icon:'fa-solid fa-droplet', type:'effect', scale:m=>{const v=Math.round(10*m); return {desc:`${v}% Chance de saignement`, apply:()=>{GameState.pBleedChance+=v/100;}}}},
  {id:'knock', name:'Impact', icon:'fa-solid fa-hand-fist', type:'effect', scale:m=>{const v=Math.round(1*m); return {desc:`+${v} Force de recul`, apply:()=>{GameState.pKnockback+=v;}}}},
  {id:'orb', name:'Orbe Gardien', icon:'fa-solid fa-circle-nodes', type:'spell', scale:m=>{const d=Math.round(10*m); return {desc:`Invoque un orbe (+${d} dmg)`, apply:()=>{PASSIVES.orb.active=true; PASSIVES.orb.level++; PASSIVES.orb.count++; PASSIVES.orb.dmg+=d;}};}},
  {id:'dagger', name:'Dagues Spirituelles', icon:'fa-solid fa-crosshairs', type:'spell', scale:m=>{const d=Math.round(15*m); return {desc:`Tir auto (+${d} dmg)`, apply:()=>{PASSIVES.dagger.active=true; PASSIVES.dagger.level++; PASSIVES.dagger.maxCd*=0.9; PASSIVES.dagger.dmg+=d;}};}},
  {id:'aura', name:'Aura de Feu', icon:'fa-solid fa-fire-flame-curved', type:'spell', scale:m=>{const d=Math.round(5*m); return {desc:`Brûle autour (+${d} dmg)`, apply:()=>{PASSIVES.aura.active=true; PASSIVES.aura.level++; PASSIVES.aura.dmg+=d; PASSIVES.aura.range+=1.0;}};}},
  {id:'poison', name:'Zone Toxique', icon:'fa-solid fa-flask-vial', type:'spell', scale:m=>{const d=Math.round(8*m); return {desc:`Pose des zones de poison (+${d} dmg)`, apply:()=>{PASSIVES.poison.active=true; PASSIVES.poison.level++; PASSIVES.poison.dmg+=d;}};}},
  {id:'shield', name:'Bouclier Orbital', icon:'fa-solid fa-shield-cat', type:'spell', scale:m=>{const d=Math.round(5*m); return {desc:`Ajoute un bouclier rotatif (+${d} dmg)`, apply:()=>{PASSIVES.shield.active=true; PASSIVES.shield.level++; PASSIVES.shield.count++; PASSIVES.shield.dmg+=d;}};}},
  {id:'turret', name:'Tourelle', icon:'fa-solid fa-chess-rook', type:'spell', scale:m=>{const d=Math.round(8*m); return {desc:`Déploie une tourelle (+${d} dmg)`, apply:()=>{PASSIVES.turret.active=true; PASSIVES.turret.level++; PASSIVES.turret.count++; PASSIVES.turret.dmg+=d;}};}},
  {id:'meteor', name:'Pluie de Météores', icon:'fa-solid fa-meteor', type:'spell', scale:m=>{const d=Math.round(20*m); return {desc:`Bombarde la zone (+${d} dmg)`, apply:()=>{PASSIVES.meteor.active=true; PASSIVES.meteor.level++; PASSIVES.meteor.maxCd*=0.9; PASSIVES.meteor.dmg+=d;}};}},
  {id:'lightning', name:'Tempête', icon:'fa-solid fa-bolt', type:'spell', scale:m=>{const d=Math.round(10*m); return {desc:`Foudroie les ennemis (+${d} dmg)`, apply:()=>{PASSIVES.lightning.active=true; PASSIVES.lightning.level++; PASSIVES.lightning.maxCd*=0.9; PASSIVES.lightning.dmg+=d;}};}},
  {id:'rift', name:'Faille Gravitationnelle', icon:'fa-solid fa-circle-radiation', type:'spell', scale:m=>{const d=Math.round(9*m); return {desc:`Attire et écrase les ennemis (+${d} dmg)`, apply:()=>{PASSIVES.rift.active=true; PASSIVES.rift.level++; PASSIVES.rift.maxCd*=0.92; PASSIVES.rift.dmg+=d; PASSIVES.rift.pulls+=0.12;}};}},
  {id:'mirrorOrb', name:'Orbes Miroirs', icon:'fa-solid fa-yin-yang', type:'spell', scale:m=>{const d=Math.round(6*m); return {desc:`Orbes défensifs réfléchissants (+${d} dmg)`, apply:()=>{PASSIVES.mirrorOrb.active=true; PASSIVES.mirrorOrb.level++; PASSIVES.mirrorOrb.count++; PASSIVES.mirrorOrb.dmg+=d; PASSIVES.mirrorOrb.range+=0.15;}};}}
];
