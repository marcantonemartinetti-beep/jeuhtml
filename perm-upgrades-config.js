// ==================== PERMANENT UPGRADES ====================
var PERM_UPGRADES = [
  {id:'p_health', name:'Vitalité', icon:'fa-solid fa-heart', baseCost:100, costMult:1.5, max:20, desc:'+5 PV Max au départ.', stat:'pMaxHP', val:5},
  {id:'p_strength', name:'Force', icon:'fa-solid fa-hand-fist', baseCost:150, costMult:1.6, max:20, desc:'+2% Dégâts infligés.', stat:'dmgMult', val:0.02},
  {id:'p_greed', name:'Avidité', icon:'fa-solid fa-coins', baseCost:200, costMult:1.4, max:10, desc:'+10% Gain d\'or.', stat:'goldMult', val:0.1},
  {id:'p_regen', name:'Régénération', icon:'fa-solid fa-leaf', baseCost:300, costMult:1.8, max:10, desc:'+0.2 PV/sec.', stat:'pRegen', val:0.2},
  {id:'p_armor', name:'Peau de Fer', icon:'fa-solid fa-shield-halved', baseCost:250, costMult:1.7, max:10, desc:'-1% Dégâts subis.', stat:'pDmgRed', val:0.01},
  {id:'p_luck', name:'Fortune', icon:'fa-solid fa-clover', baseCost:200, costMult:1.5, max:10, desc:'+5% Chance.', stat:'pLuck', val:0.05},
  {id:'p_speed', name:'Célérité', icon:'fa-solid fa-person-running', baseCost:400, costMult:2.0, max:5, desc:'+2% Vitesse.', stat:'spdMult', val:0.02}
];
