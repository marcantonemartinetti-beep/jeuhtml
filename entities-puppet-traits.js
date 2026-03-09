// Trait detection helpers for puppet generation.
function normalizePuppetName(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getPuppetTraits(name, shape) {
  const n = normalizePuppetName(name);

  const isGhost =
    n.includes('spectre') ||
    n.includes('fantome') ||
    n.includes('ombre') ||
    n.includes('feu follet') ||
    n.includes('djinn') ||
    n.includes('esprit');

  const isConstruct =
    n.includes('golem') ||
    n.includes('construct') ||
    n.includes('armure') ||
    n.includes('statue') ||
    n.includes('gargouille');

  const isSkeleton =
    n.includes('squelette') ||
    n.includes('liche') ||
    n.includes('crane') ||
    n.includes('os');

  const hasWeapon =
    !isGhost &&
    (n.includes('guerrier') ||
      n.includes('chevalier') ||
      n.includes('orc') ||
      n.includes('gobelin') ||
      n.includes('squelette') ||
      n.includes('pillard') ||
      n.includes('bandit') ||
      n.includes('voleur') ||
      n.includes('bourreau') ||
      n.includes('minotaure'));

  const hasStaff =
    !isGhost &&
    (n.includes('mage') ||
      n.includes('necro') ||
      n.includes('sorcier') ||
      n.includes('liche') ||
      n.includes('druide') ||
      n.includes('hag') ||
      n.includes('pretre') ||
      n.includes('shaman'));

  const isArcher =
    n.includes('archer') ||
    n.includes('chasseur') ||
    n.includes('rodeur') ||
    n.includes('elfe');

  const hasWings =
    shape !== 'flyer' &&
    (n.includes('ange') ||
      n.includes('demon') ||
      n.includes('harpie') ||
      n.includes('vampire') ||
      n.includes('dragon') ||
      n.includes('gargouille') ||
      n.includes('succube'));

  const hasTail =
    shape === 'beast' ||
    n.includes('dragon') ||
    n.includes('lezard') ||
    n.includes('salamandre') ||
    n.includes('rat') ||
    n.includes('loup') ||
    n.includes('renard') ||
    n.includes('chimere') ||
    n.includes('diablotin') ||
    n.includes('succube');

  const hasHood =
    hasStaff ||
    n.includes('voleur') ||
    n.includes('assassin') ||
    n.includes('moine') ||
    n.includes('spectre');

  const hasBeak =
    n.includes('vautour') ||
    n.includes('aigle') ||
    n.includes('harpie') ||
    n.includes('griffon') ||
    n.includes('hibou') ||
    n.includes('tengu');

  const hasEars =
    n.includes('elfe') ||
    n.includes('gobelin') ||
    n.includes('loup') ||
    n.includes('renard') ||
    n.includes('chat') ||
    n.includes('vampire') ||
    n.includes('rat');

  const isRoyal =
    n.includes('roi') ||
    n.includes('seigneur') ||
    n.includes('reine') ||
    n.includes('prince') ||
    n.includes('chef');

  return {
    isGhost,
    isConstruct,
    isSkeleton,
    hasWeapon,
    hasStaff,
    isArcher,
    hasWings,
    hasTail,
    hasHood,
    hasBeak,
    hasEars,
    isRoyal,
  };
}
