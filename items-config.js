// ==================== PASSIVE ITEMS (VS-LIKE) ====================
// Run inventory passive slots are handled separately from active/passive attacks.
var PASSIVE_ITEMS = [
  { id: 'spinach', name: 'Spinach', icon: 'fa-solid fa-leaf', maxLevel: 5, rarityWeight: 100, statKey: 'might', perLevel: 0.10, desc: 'Renforce toutes les armes. Plus de degats sur chaque tir et impact.' },
  { id: 'empty_tome', name: 'Empty Tome', icon: 'fa-solid fa-book', maxLevel: 5, rarityWeight: 60, statKey: 'cooldown', perLevel: -0.08, desc: 'Techniques affutees. Reduit le temps de recharge de toutes les armes.' },
  { id: 'candelabrador', name: 'Candelabrador', icon: 'fa-solid fa-expand', maxLevel: 5, rarityWeight: 100, statKey: 'area', perLevel: 0.10, desc: 'Amplifie la zone des attaques. Les coups touchent plus large.' },
  { id: 'bracer', name: 'Bracer', icon: 'fa-solid fa-gauge-high', maxLevel: 5, rarityWeight: 100, statKey: 'projectileSpeed', perLevel: 0.10, desc: 'Canalise la vitesse des projectiles. Tirs plus rapides et plus tendus.' },
  { id: 'spellbinder', name: 'Spellbinder', icon: 'fa-solid fa-hourglass-half', maxLevel: 5, rarityWeight: 100, statKey: 'duration', perLevel: 0.10, desc: 'Allonge la duree des effets. Les projectiles persistent plus longtemps.' },
  { id: 'duplicator', name: 'Duplicator', icon: 'fa-solid fa-clone', maxLevel: 2, rarityWeight: 55, statKey: 'amount', perLevel: 1, desc: 'Cree des copies d attaques. Ajoute des projectiles supplementaires.' },
  { id: 'attractorb', name: 'Attractorb', icon: 'fa-solid fa-magnet', maxLevel: 5, rarityWeight: 100, statKey: 'pickupRange', perLevel: 0.20, desc: 'Attire loot et XP de plus loin. Ramassage plus confortable.' },
  { id: 'clover', name: 'Clover', icon: 'fa-solid fa-clover', maxLevel: 5, rarityWeight: 100, statKey: 'luck', perLevel: 0.10, desc: 'Favorise les bons tirages. Plus de chance sur critiques et recompenses.' },
  { id: 'crown', name: 'Crown', icon: 'fa-solid fa-crown', maxLevel: 5, rarityWeight: 80, statKey: 'growth', perLevel: 0.08, desc: 'Accroit le gain d experience. Monte de niveau plus vite.' },
  { id: 'armor', name: 'Armor', icon: 'fa-solid fa-shield-halved', maxLevel: 5, rarityWeight: 90, statKey: 'armor', perLevel: 1, desc: 'Renforce la defense brute. Diminue les degats recus.' },
  { id: 'hollow_heart', name: 'Hollow Heart', icon: 'fa-solid fa-heart', maxLevel: 5, rarityWeight: 90, statKey: 'maxHpMult', perLevel: 0.20, desc: 'Augmente fortement les PV max pour encaisser les vagues longues.' },
  { id: 'wings', name: 'Wings', icon: 'fa-solid fa-feather', maxLevel: 5, rarityWeight: 60, statKey: 'moveSpeed', perLevel: 0.10, desc: 'Ameliore la mobilite globale. Plus facile d esquiver et kiter.' },
  { id: 'torronas_box', name: 'Torrona Box', icon: 'fa-solid fa-box-open', maxLevel: 5, rarityWeight: 45, statKey: 'might', perLevel: 0.08, desc: 'Artefact polyvalent. Bonus offensif progressif pour builds agressifs.' },
  { id: 'battle_drums', name: 'Battle Drums', icon: 'fa-solid fa-drum', maxLevel: 5, rarityWeight: 55, statKey: 'cooldown', perLevel: -0.05, desc: 'Rythme de guerre. Enchaine les attaques principales et auto plus vite.' },
  { id: 'swift_boots', name: 'Swift Boots', icon: 'fa-solid fa-shoe-prints', maxLevel: 5, rarityWeight: 70, statKey: 'moveSpeed', perLevel: 0.14, desc: 'Bottes legeres. Gros gain de vitesse pour rester hors de danger.' },
  { id: 'lucky_coin', name: 'Lucky Coin', icon: 'fa-solid fa-coins', maxLevel: 5, rarityWeight: 70, statKey: 'luck', perLevel: 0.08, desc: 'Piece benie. Ameliore la qualite moyenne des choix et drops.' },
  { id: 'war_banner', name: 'War Banner', icon: 'fa-solid fa-flag', maxLevel: 5, rarityWeight: 65, statKey: 'area', perLevel: 0.08, desc: 'Etend le controle de zone. Les attaques couvrent un espace plus large.' },
  { id: 'stone_mask', name: 'Stone Mask', icon: 'fa-solid fa-mask-face', maxLevel: 5, rarityWeight: 75, statKey: 'luck', perLevel: 0.06, desc: 'Relique ancienne. Augmente la chance globale de la partie.' },
  { id: 'arcane_ink', name: 'Arcane Ink', icon: 'fa-solid fa-feather-pointed', maxLevel: 5, rarityWeight: 70, statKey: 'duration', perLevel: 0.12, desc: 'Encre mystique. Prolonge la duree des projectiles et effets.' },
  { id: 'giant_belt', name: 'Giant Belt', icon: 'fa-solid fa-weight-hanging', maxLevel: 5, rarityWeight: 80, statKey: 'maxHpMult', perLevel: 0.12, desc: 'Ceinture colossale. Augmente les PV max et la tenue en combat.' },
  { id: 'chrono_gear', name: 'Chrono Gear', icon: 'fa-solid fa-gear', maxLevel: 5, rarityWeight: 58, statKey: 'cooldown', perLevel: -0.04, desc: 'Engrenage temporel. Reduit progressivement les temps de recharge.' },
  { id: 'hawk_eye', name: 'Hawk Eye', icon: 'fa-solid fa-eye', maxLevel: 5, rarityWeight: 68, statKey: 'projectileSpeed', perLevel: 0.12, desc: 'Vision de tireur. Projectile plus rapide et plus precis a distance.' },
  { id: 'siege_manual', name: 'Siege Manual', icon: 'fa-solid fa-book-atlas', maxLevel: 5, rarityWeight: 72, statKey: 'area', perLevel: 0.09, desc: 'Doctrine de siege. Les explosions couvrent plus de terrain.' },
  { id: 'blood_oath', name: 'Blood Oath', icon: 'fa-solid fa-droplet', maxLevel: 5, rarityWeight: 62, statKey: 'might', perLevel: 0.09, desc: 'Serment sanglant. Augmente la puissance offensive brute.' },
  { id: 'phase_compass', name: 'Phase Compass', icon: 'fa-solid fa-compass', maxLevel: 5, rarityWeight: 66, statKey: 'moveSpeed', perLevel: 0.11, desc: 'Lecture de trajectoire. Deplacement plus fluide pendant les vagues denses.' },
  { id: 'battle_lantern', name: 'Battle Lantern', icon: 'fa-solid fa-lightbulb', maxLevel: 5, rarityWeight: 64, statKey: 'duration', perLevel: 0.09, desc: 'Lueur tactique. Les effets persistants tiennent plus longtemps.' },
  { id: 'redline_oil', name: 'Redline Oil', icon: 'fa-solid fa-oil-can', maxLevel: 5, rarityWeight: 59, statKey: 'cooldown', perLevel: -0.03, desc: 'Lubrifiant de guerre. Rotation des armes plus agressive.' },
  { id: 'bastion_plate', name: 'Bastion Plate', icon: 'fa-solid fa-shield', maxLevel: 5, rarityWeight: 78, statKey: 'armor', perLevel: 1, desc: 'Plaque de bastion. Renforce fortement la survie en melee.' }
];

var PASSIVE_ITEM_BY_ID = {};
for (var i = 0; i < PASSIVE_ITEMS.length; i++) {
  PASSIVE_ITEM_BY_ID[PASSIVE_ITEMS[i].id] = PASSIVE_ITEMS[i];
}

function getPassiveItemDef(id) {
  return PASSIVE_ITEM_BY_ID[id] || null;
}
