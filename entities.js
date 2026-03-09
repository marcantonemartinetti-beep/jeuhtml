// ═══════════════════════════════════════════════
// DUNGEON WORLD - Entity Classes
// ═══════════════════════════════════════════════

// ==================== PUPPET BUILDER ====================
function buildPuppet(T) {
  const { shape, C, SK, S, eyeC = 0xff2200, name } = T;
  const g = new THREE.Group();
  const p = {};
  const legC = new THREE.Color(C).multiplyScalar(0.6).getHex();
  const armorC = new THREE.Color(C).multiplyScalar(0.4).getHex();

  const addAcc = (parent, mesh, x, y, z, s = 1) => {
    mesh.position.set(x, y, z);
    mesh.scale.multiplyScalar(s);
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    parent.add(mesh);
  };

  // Sub-types detection
  const isGhost = name.includes('Spectre') || name.includes('Fantôme') || name.includes('Ombre') || name.includes('Feu Follet') || name.includes('Djinn') || name.includes('Esprit');
  const isConstruct = name.includes('Golem') || name.includes('Construct') || name.includes('Armure') || name.includes('Statue') || name.includes('Gargouille');
  const isSkeleton = name.includes('Squelette') || name.includes('Liche') || name.includes('Crâne') || name.includes('Os');
  const hasWeapon = !isGhost && (name.includes('Guerrier') || name.includes('Chevalier') || name.includes('Orc') || name.includes('Gobelin') || name.includes('Squelette') || name.includes('Pillard') || name.includes('Bandit') || name.includes('Voleur') || name.includes('Bourreau') || name.includes('Minotaure'));
  const hasStaff = !isGhost && (name.includes('Mage') || name.includes('Nécro') || name.includes('Sorcier') || name.includes('Liche') || name.includes('Druide') || name.includes('Hag') || name.includes('Prêtre') || name.includes('Shaman'));
  const isArcher = name.includes('Archer') || name.includes('Chasseur') || name.includes('Rôdeur') || name.includes('Elfe');
  const hasWings = shape !== 'flyer' && (name.includes('Ange') || name.includes('Démon') || name.includes('Harpie') || name.includes('Vampire') || name.includes('Dragon') || name.includes('Gargouille') || name.includes('Succube'));
  const hasTail = shape === 'beast' || name.includes('Dragon') || name.includes('Lézard') || name.includes('Salamandre') || name.includes('Rat') || name.includes('Loup') || name.includes('Renard') || name.includes('Chimère') || name.includes('Diablotin') || name.includes('Succube');
  const hasHood = hasStaff || name.includes('Voleur') || name.includes('Assassin') || name.includes('Moine') || name.includes('Spectre');
  const hasBeak = name.includes('Vautour') || name.includes('Aigle') || name.includes('Harpie') || name.includes('Griffon') || name.includes('Hibou') || name.includes('Tengu');
  const hasEars = name.includes('Elfe') || name.includes('Gobelin') || name.includes('Loup') || name.includes('Renard') || name.includes('Chat') || name.includes('Vampire') || name.includes('Rat');
  const isRoyal = name.includes('Roi') || name.includes('Seigneur') || name.includes('Reine') || name.includes('Prince') || name.includes('Chef');

  // BODY CORE
  if (shape === 'blob') {
    p.torso = mkSprite(C, 1.4 * S, 1.2 * S, 'circle');
    p.torso.position.y = 0.6 * S;
    g.add(p.torso);
    p.core = mkSprite(SK, 0.8 * S, 0.8 * S, 'circle');
    p.core.position.set(0, 0.6 * S, 0.01);
    g.add(p.core);
    p.eyeL = mkSprite(eyeC, 0.2 * S, 0.2 * S, 'circle');
    addAcc(p.torso, p.eyeL, -0.2 * S, 0.2 * S, 0.02);
    p.eyeR = mkSprite(eyeC, 0.2 * S, 0.2 * S, 'circle');
    addAcc(p.torso, p.eyeR, 0.2 * S, 0.2 * S, 0.02);
  } else if (shape === 'flyer') {
    p.torso = mkSprite(C, 0.6 * S, 0.6 * S, 'circle');
    p.torso.position.y = 2.5 * S;
    g.add(p.torso);
    p.head = mkSprite(SK, 0.5 * S, 0.5 * S, 'circle');
    p.head.position.set(0, 2.9 * S, 0.01);
    g.add(p.head);
    p.wingL = mkSprite(legC, 1.2 * S, 0.8 * S, 'tri');
    p.wingL.position.set(-0.6 * S, 2.7 * S, -0.01);
    g.add(p.wingL);
    p.wingR = mkSprite(legC, 1.2 * S, 0.8 * S, 'tri');
    p.wingR.position.set(0.6 * S, 2.7 * S, -0.01);
    g.add(p.wingR);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle');
    addAcc(p.head, p.eyeL, -0.1 * S, 0.05 * S, 0.02);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle');
    addAcc(p.head, p.eyeR, 0.1 * S, 0.05 * S, 0.02);
  } else if (shape === 'spider') {
    p.torso = mkSprite(C, 1.0 * S, 0.8 * S, 'circle');
    p.torso.position.y = 0.9 * S;
    g.add(p.torso);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle');
    p.head.position.set(0, 0.3 * S, 0.01);
    p.torso.add(p.head);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle');
    addAcc(p.head, p.eyeL, -0.15 * S, 0.1 * S, 0.02);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle');
    addAcc(p.head, p.eyeR, 0.15 * S, 0.1 * S, 0.02);
    for (let i = 0; i < 4; i++) {
      const l = mkSprite(legC, 0.2 * S, 0.8 * S, 'tri');
      l.position.set(-0.6 * S, 0.7 * S, (i - 1.5) * 0.01);
      p['legL' + i] = l;
      g.add(l);
      const r = mkSprite(legC, 0.2 * S, 0.8 * S, 'tri');
      r.position.set(0.6 * S, 0.7 * S, (i - 1.5) * 0.01);
      p['legR' + i] = r;
      g.add(r);
      p['legL' + i].userData = { hp: 15 * S, max: 15 * S };
      p['legR' + i].userData = { hp: 15 * S, max: 15 * S };
    }
  } else if (shape === 'worm') {
    p.head = mkSprite(SK, 0.7 * S, 0.7 * S, 'circle');
    p.head.position.y = 0.8 * S;
    g.add(p.head);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle');
    addAcc(p.head, p.eyeL, -0.15 * S, 0.15 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle');
    addAcc(p.head, p.eyeR, 0.15 * S, 0.15 * S, 0.1);
    for (let i = 0; i < 5; i++) {
      const s = mkSprite(C, (0.6 - i * 0.08) * S, (0.6 - i * 0.08) * S, 'circle');
      s.position.set(0, 0.8 * S, (i + 1) * 0.4 * S);
      p['seg' + i] = s;
      g.add(s);
    }
  } else if (shape === 'elemental') {
    p.core = mkSprite(C, 0.8 * S, 0.8 * S, 'diamond');
    p.core.position.y = 1.8 * S;
    g.add(p.core);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle');
    addAcc(p.core, p.eyeL, -0.15 * S, 0.1 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle');
    addAcc(p.core, p.eyeR, 0.15 * S, 0.1 * S, 0.1);
    for (let i = 0; i < 4; i++) {
      const b = mkSprite(SK, 0.3 * S, 0.3 * S, 'tri');
      p['bit' + i] = b;
      g.add(b);
    }
  } else if (shape === 'hydra') {
    p.torso = mkSprite(C, 1.4 * S, 1.0 * S, 'circle');
    p.torso.position.y = 0.8 * S;
    g.add(p.torso);
    for (let i = 0; i < 3; i++) {
      const neck = mkSprite(C, 0.3 * S, 1.0 * S);
      neck.position.set((i - 1) * 0.5 * S, 1.2 * S, -0.1 * Math.abs(i - 1));
      p['neck' + i] = neck;
      g.add(neck);
      const head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle');
      head.position.set(0, 0.6 * S, 0.1);
      neck.add(head);
      p['head' + i] = head;
      const eL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle');
      addAcc(head, eL, -0.12 * S, 0.05 * S, 0.1);
      const eR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle');
      addAcc(head, eR, 0.12 * S, 0.05 * S, 0.1);
    }
    p.tail = mkSprite(C, 0.2 * S, 1.2 * S);
    p.tail.position.set(0, 0.5 * S, -0.2);
    p.tail.rotation.z = 0.5;
    g.add(p.tail);
  } else if (shape === 'eye') {
    p.torso = mkSprite(C, 1.4 * S, 1.4 * S, 'circle');
    p.torso.position.y = 2.5 * S;
    g.add(p.torso);
    p.pupil = mkSprite(eyeC, 0.5 * S, 0.5 * S, 'circle');
    p.pupil.position.set(0, 0, 0.1);
    p.torso.add(p.pupil);
    for (let i = 0; i < 5; i++) {
      const t = mkSprite(C, 0.15 * S, 0.8 * S);
      t.position.set(0, -0.6 * S, -0.1);
      p['tent' + i] = t;
      p.torso.add(t);
    }
  } else if (shape === 'plant') {
    p.base = mkSprite(C, 1.0 * S, 0.6 * S);
    p.base.position.y = 0.3 * S;
    g.add(p.base);
    p.stalk = mkSprite(C, 0.3 * S, 1.5 * S);
    p.stalk.position.y = 1.2 * S;
    g.add(p.stalk);
    p.head = mkSprite(SK, 1.0 * S, 1.0 * S, 'circle');
    p.head.position.y = 2.0 * S;
    g.add(p.head);
    p.mouth = mkSprite(0x440000, 0.6 * S, 0.4 * S, 'circle');
    p.mouth.position.set(0, 2.0 * S, 0.1);
    g.add(p.mouth);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle');
    addAcc(p.head, p.eyeL, -0.2 * S, 0.2 * S, 0.2);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle');
    addAcc(p.head, p.eyeR, 0.2 * S, 0.2 * S, 0.2);
  } else if (shape === 'titan') {
    p.pelvis = mkSprite(C, 1.0 * S, 0.6 * S);
    p.pelvis.position.y = 3.0 * S;
    g.add(p.pelvis);
    p.torso = mkSprite(C, 1.4 * S, 1.8 * S);
    p.torso.position.y = 4.2 * S;
    g.add(p.torso);
    p.head = mkSprite(C, 0.8 * S, 0.9 * S, 'circle');
    p.head.position.set(0, 5.6 * S, 0.1);
    g.add(p.head);
    p.brain = mkSprite(0xff88aa, 0.5 * S, 0.4 * S, 'circle');
    p.brain.position.set(0, 5.7 * S, 0.15);
    g.add(p.brain);
    p.eyeL = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle');
    addAcc(p.head, p.eyeL, -0.15 * S, 0, 0.2);
    p.eyeR = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle');
    addAcc(p.head, p.eyeR, 0.15 * S, 0, 0.2);
    p.heart = mkSprite(0xaa0000, 0.4 * S, 0.4 * S, 'tri');
    p.heart.position.set(0.2 * S, 4.6 * S, 0.1);
    g.add(p.heart);
    p.lungs = mkSprite(0xcc6666, 0.9 * S, 0.6 * S);
    p.lungs.position.set(0, 4.6 * S, 0.05);
    g.add(p.lungs);
    p.stomach = mkSprite(0xcc8866, 0.5 * S, 0.4 * S, 'circle');
    p.stomach.position.set(-0.2 * S, 4.0 * S, 0.1);
    g.add(p.stomach);
    p.intestines = mkSprite(0xaa6666, 0.8 * S, 0.6 * S);
    p.intestines.position.set(0, 3.6 * S, 0.1);
    g.add(p.intestines);
    // Limbs (simplified for titan)
    p.armLU = mkSprite(C, 0.4 * S, 1.0 * S);
    p.armLU.position.set(-1.0 * S, 4.8 * S, 0);
    g.add(p.armLU);
    p.armLD = mkSprite(C, 0.35 * S, 1.0 * S);
    p.armLD.position.set(-1.0 * S, 3.8 * S, 0);
    g.add(p.armLD);
    p.handL = mkSprite(C, 0.3 * S, 0.4 * S);
    p.handL.position.set(-1.0 * S, 3.1 * S, 0);
    g.add(p.handL);
    p.armRU = mkSprite(C, 0.4 * S, 1.0 * S);
    p.armRU.position.set(1.0 * S, 4.8 * S, 0);
    g.add(p.armRU);
    p.armRD = mkSprite(C, 0.35 * S, 1.0 * S);
    p.armRD.position.set(1.0 * S, 3.8 * S, 0);
    g.add(p.armRD);
    p.handR = mkSprite(C, 0.3 * S, 0.4 * S);
    p.handR.position.set(1.0 * S, 3.1 * S, 0);
    g.add(p.handR);
    p.legLU = mkSprite(C, 0.45 * S, 1.2 * S);
    p.legLU.position.set(-0.4 * S, 2.2 * S, 0);
    g.add(p.legLU);
    p.legLD = mkSprite(C, 0.4 * S, 1.2 * S);
    p.legLD.position.set(-0.4 * S, 1.0 * S, 0);
    g.add(p.legLD);
    p.footL = mkSprite(C, 0.4 * S, 0.3 * S);
    p.footL.position.set(-0.4 * S, 0.2 * S, 0.2 * S);
    g.add(p.footL);
    p.legRU = mkSprite(C, 0.45 * S, 1.2 * S);
    p.legRU.position.set(0.4 * S, 2.2 * S, 0);
    g.add(p.legRU);
    p.legRD = mkSprite(C, 0.4 * S, 1.2 * S);
    p.legRD.position.set(0.4 * S, 1.0 * S, 0);
    g.add(p.legRD);
    p.footR = mkSprite(C, 0.4 * S, 0.3 * S);
    p.footR.position.set(0.4 * S, 0.2 * S, 0.2 * S);
    g.add(p.footR);
  } else if (shape === 'naga') {
    p.torso = mkSprite(C, 1.0 * S, 1.1 * S);
    p.torso.position.y = 1.6 * S;
    g.add(p.torso);
    p.head = mkSprite(SK, 0.65 * S, 0.65 * S, 'circle');
    p.head.position.y = 2.35 * S;
    g.add(p.head);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.12 * S, 'circle');
    addAcc(p.head, p.eyeL, -0.15 * S, 0.05 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.12 * S, 'circle');
    addAcc(p.head, p.eyeR, 0.15 * S, 0.05 * S, 0.1);
    p.armLU = mkSprite(C, 0.3 * S, 0.8 * S); p.armLU.position.set(-0.6 * S, 1.8 * S, 0.1); g.add(p.armLU);
    p.armRU = mkSprite(C, 0.3 * S, 0.8 * S); p.armRU.position.set(0.6 * S, 1.8 * S, 0.1); g.add(p.armRU);
    for(let i=0; i<6; i++){
      const s = (1.0 - i*0.12) * S;
      const tail = mkSprite(legC, s, s*0.8, 'circle');
      tail.position.set(0, (1.1 - i*0.15)*S, -i*0.2*S);
      p['tail'+i] = tail;
      g.add(tail);
    }
    if(hasWeapon || hasStaff){
       const w = mkSprite(0xeeeeee, 0.1 * S, 1.2 * S);
       addAcc(p.armRU, w, 0, -0.4 * S, 0.1);
    }
  } else if (shape === 'centaur') {
    p.horse = mkSprite(legC, 1.6 * S, 0.9 * S);
    p.horse.position.y = 1.0 * S;
    g.add(p.horse);
    p.torso = mkSprite(C, 0.8 * S, 1.0 * S);
    p.torso.position.set(0.4 * S, 1.7 * S, 0.1);
    g.add(p.torso);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'box');
    p.head.position.set(0.4 * S, 2.4 * S, 0.2);
    g.add(p.head);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.12 * S, 'circle');
    addAcc(p.head, p.eyeL, -0.15 * S, 0.05 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.12 * S, 'circle');
    addAcc(p.head, p.eyeR, 0.15 * S, 0.05 * S, 0.1);
    for(let i=0; i<4; i++){
       const l = mkSprite(legC, 0.25 * S, 0.8 * S);
       const xOff = (i<2 ? 0.5 : -0.5) * S; 
       const zOff = (i%2===0 ? 0.2 : -0.2) * S;
       l.position.set(xOff, 0.5 * S, zOff);
       p['leg'+i] = l;
       g.add(l);
    }
    p.armLU = mkSprite(C, 0.25 * S, 0.7 * S); p.armLU.position.set(0.0 * S, 1.9 * S, 0.2); g.add(p.armLU);
    p.armRU = mkSprite(C, 0.25 * S, 0.7 * S); p.armRU.position.set(0.8 * S, 1.9 * S, 0.2); g.add(p.armRU);
    if(hasWeapon){
       const w = mkSprite(0xeeeeee, 0.1 * S, 1.4 * S);
       addAcc(p.armRU, w, 0, -0.5 * S, 0.1);
    }
  } else if (shape === 'mech') {
    p.pelvis = mkSprite(legC, 0.8 * S, 0.4 * S); p.pelvis.position.y = 1.4 * S; g.add(p.pelvis);
    p.torso = mkSprite(C, 1.2 * S, 1.2 * S, 'box'); p.torso.position.y = 2.0 * S; g.add(p.torso);
    p.head = mkSprite(SK, 0.6 * S, 0.5 * S, 'box'); p.head.position.set(0, 2.8 * S, 0.1); g.add(p.head);
    p.eye = mkSprite(eyeC, 0.4 * S, 0.15 * S, 'box'); addAcc(p.head, p.eye, 0, 0, 0.1);
    
    p.legL = mkSprite(legC, 0.3 * S, 1.2 * S); p.legL.position.set(-0.5 * S, 0.8 * S, 0); g.add(p.legL);
    p.legR = mkSprite(legC, 0.3 * S, 1.2 * S); p.legR.position.set(0.5 * S, 0.8 * S, 0); g.add(p.legR);
    
    p.armL = mkSprite(C, 0.3 * S, 1.0 * S); p.armL.position.set(-0.8 * S, 2.0 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.3 * S, 1.0 * S); p.armR.position.set(0.8 * S, 2.0 * S, 0); g.add(p.armR);
    
    // Shoulder cannons
    const canL = mkSprite(0x333333, 0.2 * S, 0.8 * S); canL.rotation.z = 0.5; addAcc(p.torso, canL, -0.6 * S, 0.6 * S, -0.1);
    const canR = mkSprite(0x333333, 0.2 * S, 0.8 * S); canR.rotation.z = -0.5; addAcc(p.torso, canR, 0.6 * S, 0.6 * S, -0.1);

  } else if (shape === 'insectoid') {
    p.abdomen = mkSprite(C, 1.0 * S, 1.5 * S, 'circle'); p.abdomen.position.set(0, 0.8 * S, -0.5 * S); p.abdomen.rotation.x = 0.5; g.add(p.abdomen);
    p.thorax = mkSprite(C, 0.8 * S, 0.8 * S, 'circle'); p.thorax.position.y = 1.0 * S; g.add(p.thorax);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'tri'); p.head.position.set(0, 1.5 * S, 0.3 * S); p.head.rotation.z = Math.PI; g.add(p.head);
    
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, -0.1 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, -0.1 * S, 0.1);
    
    for(let i=0; i<6; i++) {
      const l = mkSprite(legC, 0.15 * S, 1.2 * S);
      const side = i%2===0 ? 1 : -1;
      const row = Math.floor(i/2);
      l.position.set(side * 0.6 * S, 0.6 * S, (row - 1) * 0.3 * S);
      l.rotation.z = side * -0.5;
      p['leg'+i] = l;
      g.add(l);
    }
  } else if (shape === 'dino') {
    p.torso = mkSprite(C, 1.4 * S, 0.8 * S, 'box'); p.torso.position.y = 1.5 * S; g.add(p.torso);
    p.head = mkSprite(SK, 0.7 * S, 0.6 * S, 'box'); p.head.position.set(0, 2.1 * S, 0.6 * S); g.add(p.head);
    p.jaw = mkSprite(C, 0.6 * S, 0.2 * S, 'box'); p.jaw.position.set(0, 1.8 * S, 0.7 * S); g.add(p.jaw);
    p.tail = mkSprite(C, 0.3 * S, 1.2 * S); p.tail.position.set(0, 1.6 * S, -0.8 * S); p.tail.rotation.x = 0.8; g.add(p.tail);
    
    p.legL = mkSprite(legC, 0.35 * S, 1.0 * S); p.legL.position.set(-0.4 * S, 0.7 * S, 0); g.add(p.legL);
    p.legR = mkSprite(legC, 0.35 * S, 1.0 * S); p.legR.position.set(0.4 * S, 0.7 * S, 0); g.add(p.legR);
    p.armL = mkSprite(C, 0.15 * S, 0.4 * S); p.armL.position.set(-0.5 * S, 1.4 * S, 0.5 * S); p.armL.rotation.x = -0.5; g.add(p.armL);
    p.armR = mkSprite(C, 0.15 * S, 0.4 * S); p.armR.position.set(0.5 * S, 1.4 * S, 0.5 * S); p.armR.rotation.x = -0.5; g.add(p.armR);
    
    p.eyeL = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeL, -0.25 * S, 0.1 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeR, 0.25 * S, 0.1 * S, 0.1);
  } else if (shape === 'fish') {
    p.torso = mkSprite(C, 0.8 * S, 1.4 * S, 'circle'); p.torso.position.y = 1.5 * S; p.torso.rotation.x = Math.PI/2; g.add(p.torso);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.set(0, 1.5 * S, 0.6 * S); g.add(p.head);
    p.tail = mkSprite(legC, 0.8 * S, 0.6 * S, 'tri'); p.tail.position.set(0, 1.5 * S, -0.8 * S); p.tail.rotation.x = -Math.PI/2; g.add(p.tail);
    p.finL = mkSprite(legC, 0.4 * S, 0.6 * S, 'tri'); p.finL.position.set(-0.5 * S, 1.5 * S, 0); p.finL.rotation.y = 0.5; g.add(p.finL);
    p.finR = mkSprite(legC, 0.4 * S, 0.6 * S, 'tri'); p.finR.position.set(0.5 * S, 1.5 * S, 0); p.finR.rotation.y = -0.5; g.add(p.finR);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.2 * S, 0.1 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.2 * S, 0.1 * S, 0.1);
  } else if (shape === 'wheel') {
    p.wheel = mkSprite(legC, 1.2 * S, 1.2 * S, 'circle'); p.wheel.position.y = 0.6 * S; g.add(p.wheel);
    p.torso = mkSprite(C, 0.8 * S, 0.8 * S, 'box'); p.torso.position.y = 1.4 * S; g.add(p.torso);
    p.head = mkSprite(SK, 0.5 * S, 0.5 * S, 'box'); p.head.position.set(0, 2.0 * S, 0.1); g.add(p.head);
    p.eye = mkSprite(eyeC, 0.3 * S, 0.15 * S, 'box'); addAcc(p.head, p.eye, 0, 0, 0.1);
    
    p.armL = mkSprite(C, 0.2 * S, 0.8 * S); p.armL.position.set(-0.6 * S, 1.4 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.2 * S, 0.8 * S); p.armR.position.set(0.6 * S, 1.4 * S, 0); g.add(p.armR);
    
    const hub = mkSprite(0x888888, 0.4 * S, 0.4 * S, 'circle'); p.wheel.add(hub); hub.position.z=0.1;
  } else if (shape === 'floating_skull') {
    p.head = mkSprite(SK, 1.2 * S, 1.4 * S, 'circle'); p.head.position.y = 2.0 * S; g.add(p.head);
    p.jaw = mkSprite(SK, 0.8 * S, 0.4 * S, 'box'); p.jaw.position.set(0, 1.4 * S, 0.1); g.add(p.jaw);
    p.eyeL = mkSprite(eyeC, 0.25 * S, 0.25 * S, 'circle'); addAcc(p.head, p.eyeL, -0.3 * S, 0.1 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.25 * S, 0.25 * S, 'circle'); addAcc(p.head, p.eyeR, 0.3 * S, 0.1 * S, 0.1);
    
    p.handL = mkSprite(C, 0.5 * S, 0.6 * S); p.handL.position.set(-1.2 * S, 1.5 * S, 0.2); g.add(p.handL);
    p.handR = mkSprite(C, 0.5 * S, 0.6 * S); p.handR.position.set(1.2 * S, 1.5 * S, 0.2); g.add(p.handR);
  } else if (shape === 'serpent') {
    p.head = mkSprite(SK, 0.7 * S, 0.6 * S, 'box'); p.head.position.set(0, 0.8 * S, 0.8 * S); g.add(p.head);
    p.jaw = mkSprite(C, 0.7 * S, 0.2 * S, 'box'); p.jaw.position.set(0, 0.7 * S, 0.9 * S); g.add(p.jaw);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.25 * S, 0.1 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.25 * S, 0.1 * S, 0.1);
    
    for(let i=0; i<8; i++){
      const s = (1.0 - i*0.08) * S;
      const seg = mkSprite(C, s, s*0.8, 'circle');
      seg.position.set(0, 0.7 * S, -i*0.5*S);
      p['seg'+i] = seg;
      g.add(seg);
    }
  } else if (shape === 'construct') {
    p.core = mkSprite(C, 1.0 * S, 1.0 * S, 'diamond'); p.core.position.y = 2.0 * S; g.add(p.core);
    p.eye = mkSprite(eyeC, 0.4 * S, 0.4 * S, 'circle'); p.eye.position.z = 0.1; p.core.add(p.eye);
    
    for(let i=0; i<4; i++){
      const bit = mkSprite(SK, 0.4 * S, 0.4 * S, 'box');
      p['bit'+i] = bit;
      g.add(bit);
    }
  } else if (shape === 'book') {
    p.spine = mkSprite(C, 0.2 * S, 1.0 * S, 'box'); p.spine.position.y = 2.0 * S; g.add(p.spine);
    p.coverL = mkSprite(C, 0.8 * S, 1.0 * S, 'box'); p.coverL.position.set(-0.5 * S, 2.0 * S, 0); g.add(p.coverL);
    p.coverR = mkSprite(C, 0.8 * S, 1.0 * S, 'box'); p.coverR.position.set(0.5 * S, 2.0 * S, 0); g.add(p.coverR);
    p.pageL = mkSprite(0xffffff, 0.7 * S, 0.9 * S, 'box'); p.pageL.position.set(-0.45 * S, 2.0 * S, 0.05); g.add(p.pageL);
    p.pageR = mkSprite(0xffffff, 0.7 * S, 0.9 * S, 'box'); p.pageR.position.set(0.45 * S, 2.0 * S, 0.05); g.add(p.pageR);
  } else if (shape === 'cloud') {
    p.core = mkSprite(C, 1.0 * S, 0.8 * S, 'circle'); p.core.position.y = 2.0 * S; g.add(p.core);
    for(let i=0; i<5; i++) {
      const puff = mkSprite(C, 0.6 * S, 0.6 * S, 'circle');
      puff.position.set((Math.random()-0.5)*1.2*S, 2.0*S + (Math.random()-0.5)*0.8*S, (Math.random()-0.5)*0.5*S);
      p['puff'+i] = puff; g.add(puff);
    }
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.core, p.eyeL, -0.2 * S, 0, 0.2);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.core, p.eyeR, 0.2 * S, 0, 0.2);
  } else if (shape === 'ghost') {
    p.head = mkSprite(SK, 0.7 * S, 0.7 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.body = mkSprite(C, 0.8 * S, 1.2 * S, 'tri'); p.body.position.y = 1.5 * S; p.body.rotation.z = Math.PI; g.add(p.body);
    p.armL = mkSprite(C, 0.25 * S, 0.6 * S); p.armL.position.set(-0.5 * S, 1.8 * S, 0.1); p.armL.rotation.z = 0.5; g.add(p.armL);
    p.armR = mkSprite(C, 0.25 * S, 0.6 * S); p.armR.position.set(0.5 * S, 1.8 * S, 0.1); p.armR.rotation.z = -0.5; g.add(p.armR);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0, 0.1);
  } else if (shape === 'slime_cube') {
    p.torso = mkSprite(C, 1.2 * S, 1.2 * S, 'box'); p.torso.position.y = 0.7 * S; g.add(p.torso);
    p.core = mkSprite(SK, 0.6 * S, 0.6 * S, 'box'); p.core.position.set(0, 0.6 * S, 0.01); g.add(p.core);
    p.eyeL = mkSprite(eyeC, 0.2 * S, 0.2 * S, 'box'); addAcc(p.torso, p.eyeL, -0.3 * S, 0.2 * S, 0.02);
    p.eyeR = mkSprite(eyeC, 0.2 * S, 0.2 * S, 'box'); addAcc(p.torso, p.eyeR, 0.3 * S, 0.2 * S, 0.02);
  } else if (shape === 'crystal_golem') {
    p.torso = mkSprite(C, 1.0 * S, 1.4 * S, 'diamond'); p.torso.position.y = 1.8 * S; g.add(p.torso);
    p.head = mkSprite(SK, 0.6 * S, 0.8 * S, 'diamond'); p.head.position.set(0, 2.8 * S, 0.1); g.add(p.head);
    p.armL = mkSprite(C, 0.4 * S, 1.0 * S, 'diamond'); p.armL.position.set(-0.8 * S, 2.0 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.4 * S, 1.0 * S, 'diamond'); p.armR.position.set(0.8 * S, 2.0 * S, 0); g.add(p.armR);
    p.legL = mkSprite(legC, 0.5 * S, 1.2 * S, 'diamond'); p.legL.position.set(-0.4 * S, 0.8 * S, 0); g.add(p.legL);
    p.legR = mkSprite(legC, 0.5 * S, 1.2 * S, 'diamond'); p.legR.position.set(0.4 * S, 0.8 * S, 0); g.add(p.legR);
  } else if (shape === 'bat') {
    p.torso = mkSprite(C, 0.5 * S, 0.5 * S, 'circle'); p.torso.position.y = 2.0 * S; g.add(p.torso);
    p.head = mkSprite(SK, 0.4 * S, 0.3 * S, 'circle'); p.head.position.set(0, 2.3 * S, 0.01); g.add(p.head);
    p.wingL = mkSprite(legC, 1.0 * S, 0.6 * S, 'tri'); p.wingL.position.set(-0.6 * S, 2.0 * S, 0); p.wingL.rotation.z = 0.2; g.add(p.wingL);
    p.wingR = mkSprite(legC, 1.0 * S, 0.6 * S, 'tri'); p.wingR.position.set(0.6 * S, 2.0 * S, 0); p.wingR.rotation.z = -0.2; g.add(p.wingR);
    p.earL = mkSprite(C, 0.1 * S, 0.3 * S, 'tri'); addAcc(p.head, p.earL, -0.15 * S, 0.2 * S, 0.01);
    p.earR = mkSprite(C, 0.1 * S, 0.3 * S, 'tri'); addAcc(p.head, p.earR, 0.15 * S, 0.2 * S, 0.01);
  } else if (shape === 'mushroom') {
    p.stalk = mkSprite(legC, 0.6 * S, 1.0 * S, 'box'); p.stalk.position.y = 0.5 * S; g.add(p.stalk);
    p.cap = mkSprite(C, 1.4 * S, 0.8 * S, 'circle'); p.cap.position.y = 1.2 * S; g.add(p.cap);
    p.spot1 = mkSprite(SK, 0.3 * S, 0.3 * S, 'circle'); addAcc(p.cap, p.spot1, -0.4 * S, 0.2 * S, 0.01);
    p.spot2 = mkSprite(SK, 0.3 * S, 0.3 * S, 'circle'); addAcc(p.cap, p.spot2, 0.4 * S, 0.2 * S, 0.01);
    p.spot3 = mkSprite(SK, 0.3 * S, 0.3 * S, 'circle'); addAcc(p.cap, p.spot3, 0, 0.5 * S, 0.01);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.stalk, p.eyeL, -0.15 * S, 0.2 * S, 0.02);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.stalk, p.eyeR, 0.15 * S, 0.2 * S, 0.02);
  } else if (shape === 'mimic') {
    p.base = mkSprite(C, 1.0 * S, 0.6 * S, 'box'); p.base.position.y = 0.3 * S; g.add(p.base);
    p.lid = mkSprite(C, 1.0 * S, 0.4 * S, 'box'); p.lid.position.set(0, 0.8 * S, -0.5 * S); g.add(p.lid);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.lid, p.eyeL, -0.2 * S, 0, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.lid, p.eyeR, 0.2 * S, 0, 0.1);
  } else if (shape === 'scorpion') {
    p.torso = mkSprite(C, 0.8 * S, 1.0 * S, 'circle'); p.torso.position.y = 0.8 * S; p.torso.rotation.x = Math.PI/2; g.add(p.torso);
    p.head = mkSprite(SK, 0.5 * S, 0.5 * S, 'box'); p.head.position.set(0, 0.9 * S, 0.4 * S); g.add(p.head);
    p.clawL = mkSprite(legC, 0.4 * S, 0.6 * S, 'diamond'); p.clawL.position.set(-0.6 * S, 0.8 * S, 0.6 * S); g.add(p.clawL);
    p.clawR = mkSprite(legC, 0.4 * S, 0.6 * S, 'diamond'); p.clawR.position.set(0.6 * S, 0.8 * S, 0.6 * S); g.add(p.clawR);
    for(let i=0; i<5; i++){
        const s = (0.4 - i*0.05)*S;
        const seg = mkSprite(C, s, s, 'circle');
        seg.position.set(0, 0.8*S + i*0.2*S, -0.5*S - i*0.1*S);
        p['tail'+i] = seg; g.add(seg);
    }
    p.stinger = mkSprite(0xff0000, 0.3*S, 0.3*S, 'tri'); p.stinger.position.set(0, 1.8*S, 0); g.add(p.stinger);
    for(let i=0; i<3; i++){
        const l = mkSprite(legC, 0.1*S, 0.8*S); l.position.set(-0.5*S, 0.6*S, (i-1)*0.3*S); l.rotation.z = 0.5; p['legL'+i]=l; g.add(l);
        const r = mkSprite(legC, 0.1*S, 0.8*S); r.position.set(0.5*S, 0.6*S, (i-1)*0.3*S); r.rotation.z = -0.5; p['legR'+i]=r; g.add(r);
    }
  } else if (shape === 'djinn') {
    p.torso = mkSprite(C, 1.0 * S, 1.2 * S, 'tri'); p.torso.position.y = 2.0 * S; p.torso.rotation.z = Math.PI; g.add(p.torso);
    p.head = mkSprite(SK, 0.6 * S, 0.7 * S, 'circle'); p.head.position.set(0, 2.8 * S, 0.1); g.add(p.head);
    p.armL = mkSprite(C, 0.3 * S, 1.0 * S); p.armL.position.set(-0.7 * S, 2.2 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.3 * S, 1.0 * S); p.armR.position.set(0.7 * S, 2.2 * S, 0); g.add(p.armR);
    for(let i=0; i<4; i++){
        const s = (0.8 - i*0.15)*S;
        const seg = mkSprite(legC, s, s, 'circle');
        seg.position.set(0, 1.4*S - i*0.3*S, 0);
        p['tail'+i] = seg; g.add(seg);
    }
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0, 0.1);
  } else if (shape === 'treant') {
    p.torso = mkSprite(C, 1.2 * S, 1.8 * S, 'box'); p.torso.position.y = 1.8 * S; g.add(p.torso);
    p.head = mkSprite(0x228822, 1.5 * S, 1.0 * S, 'circle'); p.head.position.set(0, 2.8 * S, 0.1); g.add(p.head);
    p.face = mkSprite(SK, 0.6 * S, 0.6 * S, 'box'); p.face.position.set(0, 2.4 * S, 0.2); g.add(p.face);
    p.armL = mkSprite(C, 0.4 * S, 1.5 * S); p.armL.position.set(-0.9 * S, 2.0 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.4 * S, 1.5 * S); p.armR.position.set(0.9 * S, 2.0 * S, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.5 * S, 1.0 * S); p.legL.position.set(-0.4 * S, 0.8 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.5 * S, 1.0 * S); p.legR.position.set(0.4 * S, 0.8 * S, 0); g.add(p.legR);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'box'); addAcc(p.face, p.eyeL, -0.15 * S, 0.1 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'box'); addAcc(p.face, p.eyeR, 0.15 * S, 0.1 * S, 0.1);
  } else if (shape === 'note') {
    p.head = mkSprite(SK, 0.6 * S, 0.5 * S, 'circle'); p.head.position.y = 0.5 * S; g.add(p.head);
    p.stem = mkSprite(C, 0.15 * S, 1.5 * S); p.stem.position.set(0.25 * S, 1.2 * S, 0); g.add(p.stem);
    p.flag = mkSprite(C, 0.6 * S, 0.4 * S, 'tri'); p.flag.position.set(0.5 * S, 1.8 * S, 0); g.add(p.flag);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.1 * S, 0, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.1 * S, 0, 0.1);
  } else if (shape === 'utensil') {
    p.handle = mkSprite(C, 0.2 * S, 1.2 * S); p.handle.position.y = 1.0 * S; g.add(p.handle);
    p.head = mkSprite(SK, 0.6 * S, 0.8 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.handL = mkSprite(C, 0.2 * S, 0.6 * S); p.handL.position.set(-0.5 * S, 1.5 * S, 0.1); g.add(p.handL);
    p.handR = mkSprite(C, 0.2 * S, 0.6 * S); p.handR.position.set(0.5 * S, 1.5 * S, 0.1); g.add(p.handR);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.1 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.1 * S, 0.1);
  } else if (shape === 'doll') {
    p.torso = mkSprite(C, 0.8 * S, 1.0 * S, 'box'); p.torso.position.y = 1.5 * S; g.add(p.torso);
    p.head = mkSprite(SK, 0.7 * S, 0.7 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.armL = mkSprite(C, 0.25 * S, 0.8 * S); p.armL.position.set(-0.6 * S, 1.8 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.25 * S, 0.8 * S); p.armR.position.set(0.6 * S, 1.8 * S, 0); g.add(p.armR);
    p.legL = mkSprite(legC, 0.3 * S, 0.8 * S); p.legL.position.set(-0.3 * S, 0.6 * S, 0); g.add(p.legL);
    p.legR = mkSprite(legC, 0.3 * S, 0.8 * S); p.legR.position.set(0.3 * S, 0.6 * S, 0); g.add(p.legR);
    p.key = mkSprite(0xffd700, 0.6 * S, 0.6 * S, 'tri'); p.key.position.set(0, 1.5 * S, -0.5 * S); g.add(p.key);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0, 0.1);
  } else if (shape === 'gear') {
    p.core = mkSprite(C, 1.2 * S, 1.2 * S, 'circle'); p.core.position.y = 1.5 * S; g.add(p.core);
    p.eye = mkSprite(eyeC, 0.4 * S, 0.4 * S, 'circle'); p.eye.position.z = 0.1; p.core.add(p.eye);
    p.legL = mkSprite(legC, 0.3 * S, 1.0 * S); p.legL.position.set(-0.4 * S, 0.5 * S, 0); g.add(p.legL);
    p.legR = mkSprite(legC, 0.3 * S, 1.0 * S); p.legR.position.set(0.4 * S, 0.5 * S, 0); g.add(p.legR);
  } else if (shape === 'shade') {
    p.torso = mkSprite(C, 0.8 * S, 1.2 * S, 'tri'); p.torso.position.y = 1.5 * S; p.torso.rotation.z = Math.PI; g.add(p.torso);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.armL = mkSprite(C, 0.2 * S, 1.0 * S); p.armL.position.set(-0.6 * S, 1.8 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.2 * S, 1.0 * S); p.armR.position.set(0.6 * S, 1.8 * S, 0); g.add(p.armR);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0, 0.1);
  } else if (shape === 'mage_robed') {
    // Mage: Robed wizard with staff and magical aura - detailedversión
    p.robe = mkSprite(C, 1.0 * S, 0.8 * S, 'box'); p.robe.position.y = 1.6 * S; g.add(p.robe);
    p.robeMiddle = mkSprite(C, 1.05 * S, 0.7 * S, 'box'); p.robeMiddle.position.y = 1.1 * S; g.add(p.robeMiddle);
    p.robeBottom = mkSprite(C, 1.1 * S, 0.8 * S, 'tri'); p.robeBottom.position.y = 0.5 * S; p.robeBottom.rotation.z = Math.PI; g.add(p.robeBottom);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.hat = mkSprite(C, 0.5 * S, 0.7 * S, 'tri'); p.hat.position.y = 2.9 * S; g.add(p.hat);
    p.hatBand = mkSprite(0x884422, 0.55 * S, 0.1 * S, 'circle'); addAcc(p.hat, p.hatBand, 0, -0.2 * S, 0.05);
    // Bras gauche détaillé
    p.armLU = mkSprite(C, 0.22 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.2 * S, 0.5 * S); p.armLD.position.set(-0.75 * S, 1.3 * S, 0); g.add(p.armLD);
    p.handL = mkSprite(0xddcc99, 0.15 * S, 0.15 * S, 'circle'); p.handL.position.set(-0.75 * S, 0.9 * S, 0); g.add(p.handL);
    // Bras droit détaillé
    p.armRU = mkSprite(C, 0.22 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.2 * S, 0.5 * S); p.armRD.position.set(0.75 * S, 1.3 * S, 0); g.add(p.armRD);
    p.handR = mkSprite(0xddcc99, 0.15 * S, 0.15 * S, 'circle'); p.handR.position.set(0.75 * S, 0.9 * S, 0); g.add(p.handR);
    // Jambes détaillées
    p.legLU = mkSprite(C, 0.25 * S, 0.6 * S); p.legLU.position.set(-0.3 * S, 1.0 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(SK, 0.22 * S, 0.55 * S); p.legLD.position.set(-0.3 * S, 0.4 * S, 0); g.add(p.legLD);
    p.footL = mkSprite(0x333333, 0.2 * S, 0.12 * S); p.footL.position.set(-0.3 * S, 0.05 * S, 0.1); g.add(p.footL);
    p.legRU = mkSprite(C, 0.25 * S, 0.6 * S); p.legRU.position.set(0.3 * S, 1.0 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(SK, 0.22 * S, 0.55 * S); p.legRD.position.set(0.3 * S, 0.4 * S, 0); g.add(p.legRD);
    p.footR = mkSprite(0x333333, 0.2 * S, 0.12 * S); p.footR.position.set(0.3 * S, 0.05 * S, 0.1); g.add(p.footR);
    p.aura = mkSprite(eyeC, 1.5 * S, 1.5 * S, 'circle'); p.aura.position.y = 1.5 * S; p.aura.material.opacity = 0.3; p.aura.material.transparent = true; g.add(p.aura);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.1 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.1 * S, 0.1);
  } else if (shape === 'knight_plate') {
    // Knight: Full plate armor with shield and sword - detailed
    p.pelvis = mkSprite(C, 0.9 * S, 0.5 * S, 'box'); p.pelvis.position.y = 1.1 * S; g.add(p.pelvis);
    p.torso = mkSprite(C, 1.0 * S, 1.2 * S, 'box'); p.torso.position.y = 1.8 * S; g.add(p.torso);
    p.chestplate = mkSprite(legC, 0.85 * S, 0.9 * S, 'box'); addAcc(p.torso, p.chestplate, 0, 0, 0.1);
    p.pauldronL = mkSprite(legC, 0.4 * S, 0.4 * S, 'circle'); p.pauldronL.position.set(-0.65 * S, 1.95 * S, 0); g.add(p.pauldronL);
    p.pauldronR = mkSprite(legC, 0.4 * S, 0.4 * S, 'circle'); p.pauldronR.position.set(0.65 * S, 1.95 * S, 0); g.add(p.pauldronR);
    p.gauntletL = mkSprite(legC, 0.2 * S, 0.7 * S, 'box'); p.gauntletL.position.set(-0.8 * S, 1.2 * S, 0); g.add(p.gauntletL);
    p.gauntletR = mkSprite(legC, 0.2 * S, 0.7 * S, 'box'); p.gauntletR.position.set(0.8 * S, 1.2 * S, 0); g.add(p.gauntletR);
    p.helmet = mkSprite(legC, 0.65 * S, 0.75 * S, 'box'); p.helmet.position.y = 2.4 * S; g.add(p.helmet);
    p.visor = mkSprite(0x444444, 0.25 * S, 0.15 * S, 'box'); p.visor.position.set(0, 2.4 * S, 0.15); g.add(p.visor);
    // Bras détaillés
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.75 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.22 * S, 0.5 * S); p.armLD.position.set(-0.8 * S, 1.25 * S, 0); g.add(p.armLD);
    p.handL = mkSprite(0xddcc99, 0.15 * S, 0.15 * S, 'circle'); p.handL.position.set(-0.8 * S, 0.85 * S, 0); g.add(p.handL);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.75 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.22 * S, 0.5 * S); p.armRD.position.set(0.8 * S, 1.25 * S, 0); g.add(p.armRD);
    p.handR = mkSprite(0xddcc99, 0.15 * S, 0.15 * S, 'circle'); p.handR.position.set(0.8 * S, 0.85 * S, 0); g.add(p.handR);
    // Jambes détaillées
    p.legLU = mkSprite(C, 0.3 * S, 0.55 * S); p.legLU.position.set(-0.35 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.28 * S, 0.5 * S); p.legLD.position.set(-0.35 * S, 0.25 * S, 0); g.add(p.legLD);
    p.footL = mkSprite(0x444444, 0.25 * S, 0.12 * S); p.footL.position.set(-0.35 * S, 0, 0.1); g.add(p.footL);
    p.legRU = mkSprite(C, 0.3 * S, 0.55 * S); p.legRU.position.set(0.35 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.28 * S, 0.5 * S); p.legRD.position.set(0.35 * S, 0.25 * S, 0); g.add(p.legRD);
    p.footR = mkSprite(0x444444, 0.25 * S, 0.12 * S); p.footR.position.set(0.35 * S, 0, 0.1); g.add(p.footR);
    p.eyeL = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.helmet, p.eyeL, -0.15 * S, 0.05 * S, 0.2);
    p.eyeR = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.helmet, p.eyeR, 0.15 * S, 0.05 * S, 0.2);
  } else if (shape === 'barbarian_wild') {
    // Barbarian: Muscular, furs, wild
    p.torso = mkSprite(C, 1.2 * S, 1.1 * S, 'box'); p.torso.position.y = 1.6 * S; g.add(p.torso);
    p.fur1 = mkSprite(legC, 1.3 * S, 0.3 * S, 'circle'); p.fur1.position.set(0, 2.1 * S, -0.1); p.fur1.rotation.z = 0.3; g.add(p.fur1);
    p.fur2 = mkSprite(legC, 0.9 * S, 0.5 * S); p.fur2.position.set(-0.6 * S, 1.6 * S, -0.1); g.add(p.fur2);
    p.fur3 = mkSprite(legC, 0.9 * S, 0.5 * S); p.fur3.position.set(0.6 * S, 1.6 * S, -0.1); g.add(p.fur3);
    p.head = mkSprite(SK, 0.7 * S, 0.7 * S, 'circle'); p.head.position.y = 2.4 * S; g.add(p.head);
    p.horn1 = mkSprite(armorC, 0.15 * S, 0.5 * S, 'tri'); p.horn1.position.set(-0.25 * S, 3.0 * S, 0); g.add(p.horn1);
    p.horn2 = mkSprite(armorC, 0.15 * S, 0.5 * S, 'tri'); p.horn2.position.set(0.25 * S, 3.0 * S, 0); g.add(p.horn2);
    p.armLU = mkSprite(C, 0.28 * S, 0.6 * S); p.armLU.position.set(-0.8 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.26 * S, 0.5 * S); p.armLD.position.set(-0.8 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.28 * S, 0.6 * S); p.armRU.position.set(0.8 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.26 * S, 0.5 * S); p.armRD.position.set(0.8 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.32 * S, 0.55 * S); p.legLU.position.set(-0.35 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.3 * S, 0.5 * S); p.legLD.position.set(-0.35 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.32 * S, 0.55 * S); p.legRU.position.set(0.35 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.3 * S, 0.5 * S); p.legRD.position.set(0.35 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xff6600, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.2 * S, 0.1 * S, 0.1);
    p.eyeR = mkSprite(0xff6600, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.2 * S, 0.1 * S, 0.1);
  } else if (shape === 'ranger_archer') {
    // Ranger: Leather armor, bow, quiver, cape
    p.tunic = mkSprite(C, 0.95 * S, 1.0 * S, 'box'); p.tunic.position.y = 1.6 * S; g.add(p.tunic);
    p.quiver = mkSprite(0x8B4513, 0.25 * S, 0.8 * S, 'box'); p.quiver.position.set(-0.5 * S, 1.6 * S, -0.15); g.add(p.quiver);
    p.cape = mkSprite(legC, 0.5 * S, 1.0 * S, 'tri'); p.cape.position.set(0.6 * S, 1.8 * S, -0.2); g.add(p.cape);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.hood = mkSprite(C, 0.7 * S, 0.5 * S); p.hood.position.set(0, 2.4 * S, 0.1); g.add(p.hood);
    p.armLU = mkSprite(C, 0.23 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.2 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.23 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.2 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.26 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.26 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'rogue_shadow') {
    // Rogue: Sleek, shadow aura, hood
    p.torso = mkSprite(C, 0.85 * S, 1.0 * S, 'box'); p.torso.position.y = 1.5 * S; g.add(p.torso);
    p.armor1 = mkSprite(0x111111, 0.5 * S, 0.3 * S, 'box'); p.armor1.position.set(-0.5 * S, 1.7 * S, 0.05); g.add(p.armor1);
    p.armor2 = mkSprite(0x111111, 0.5 * S, 0.3 * S, 'box'); p.armor2.position.set(0.5 * S, 1.7 * S, 0.05); g.add(p.armor2);
    p.head = mkSprite(SK, 0.55 * S, 0.55 * S, 'circle'); p.head.position.y = 2.15 * S; g.add(p.head);
    p.hood = mkSprite(C, 0.65 * S, 0.7 * S, 'circle'); p.hood.position.y = 2.3 * S; g.add(p.hood);
    p.shadow = mkSprite(C, 1.3 * S, 1.3 * S, 'circle'); p.shadow.position.y = 1.5 * S; p.shadow.material.opacity = 0.2; p.shadow.material.transparent = true; g.add(p.shadow);
    p.armLU = mkSprite(C, 0.2 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.18 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.2 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.18 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.25 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.23 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.25 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.23 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.12 * S, 0.05 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.12 * S, 0.05 * S, 0.1);
  } else if (shape === 'paladin_holy') {
    // Paladin: Holy armor with glowing cross, shield, sword
    p.armor = mkSprite(0xeeeeee, 1.0 * S, 1.2 * S, 'box'); p.armor.position.y = 1.8 * S; g.add(p.armor);
    p.shoulderL = mkSprite(legC, 0.35 * S, 0.35 * S, 'circle'); p.shoulderL.position.set(-0.7 * S, 1.95 * S, 0); g.add(p.shoulderL);
    p.shoulderR = mkSprite(legC, 0.35 * S, 0.35 * S, 'circle'); p.shoulderR.position.set(0.7 * S, 1.95 * S, 0); g.add(p.shoulderR);
    p.helmet = mkSprite(legC, 0.65 * S, 0.75 * S, 'box'); p.helmet.position.y = 2.45 * S; g.add(p.helmet);
    p.cross = mkSprite(0xffd700, 0.25 * S, 0.5 * S); p.cross.position.set(0, 1.8 * S, 0.15); g.add(p.cross);
    p.cross2 = mkSprite(0xffd700, 0.5 * S, 0.12 * S); p.cross2.position.set(0, 1.8 * S, 0.15); g.add(p.cross2);
    p.aura = mkSprite(0xffd700, 1.6 * S, 1.6 * S, 'circle'); p.aura.position.y = 1.8 * S; p.aura.material.opacity = 0.25; p.aura.material.transparent = true; g.add(p.aura);
    p.armLU = mkSprite(legC, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.75 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(C, 0.22 * S, 0.5 * S); p.armLD.position.set(-0.75 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(legC, 0.25 * S, 0.6 * S); p.armRU.position.set(0.75 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(C, 0.22 * S, 0.5 * S); p.armRD.position.set(0.75 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(0xeeeeee, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.35 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.35 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(0xeeeeee, 0.28 * S, 0.55 * S); p.legRU.position.set(0.35 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.35 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.helmet, p.eyeL, -0.15 * S, 0.05 * S, 0.15);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.helmet, p.eyeR, 0.15 * S, 0.05 * S, 0.15);
  } else if (shape === 'lancer_pike') {
    // Lancer: Mounted warrior with pike
    p.torso = mkSprite(C, 1.0 * S, 1.1 * S, 'box'); p.torso.position.y = 1.7 * S; g.add(p.torso);
    p.chestplate = mkSprite(legC, 0.6 * S, 0.8 * S, 'box'); p.chestplate.position.set(0, 1.7 * S, 0.1); g.add(p.chestplate);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.helmet = mkSprite(legC, 0.35 * S, 0.5 * S, 'tri'); p.helmet.position.y = 2.8 * S; p.helmet.scale.x *= 0.7; g.add(p.helmet);
    p.pike = mkSprite(0xaa8855, 0.08 * S, 1.6 * S); p.pike.position.set(0.7 * S, 2.0 * S, 0.1); p.pike.rotation.z = 0.15; g.add(p.pike);
    p.tip = mkSprite(0xaaaaaa, 0.25 * S, 0.3 * S, 'tri'); p.tip.position.set(0.7 * S, 2.9 * S, 0.15); g.add(p.tip);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.35 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.35 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.35 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.35 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'ninja_shadow') {
    // Ninja: Black outfit, shuriken, very compact
    p.bodysuit = mkSprite(C, 0.8 * S, 0.95 * S, 'box'); p.bodysuit.position.y = 1.45 * S; g.add(p.bodysuit);
    p.mask = mkSprite(C, 0.7 * S, 0.5 * S, 'box'); p.mask.position.y = 2.2 * S; g.add(p.mask);
    p.head = mkSprite(SK, 0.5 * S, 0.5 * S, 'circle'); p.head.position.y = 2.15 * S; g.add(p.head);
    p.armLU = mkSprite(C, 0.2 * S, 0.55 * S); p.armLU.position.set(-0.65 * S, 1.85 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.18 * S, 0.45 * S); p.armLD.position.set(-0.65 * S, 1.25 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.2 * S, 0.55 * S); p.armRU.position.set(0.65 * S, 1.85 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.18 * S, 0.45 * S); p.armRD.position.set(0.65 * S, 1.25 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.24 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.22 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.24 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.22 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeL, -0.12 * S, 0.05 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeR, 0.12 * S, 0.05 * S, 0.1);
  } else if (shape === 'engineer_mech') {
    // Engineer: Mechanical suit with gears
    p.torso = mkSprite(C, 1.05 * S, 1.15 * S, 'box'); p.torso.position.y = 1.75 * S; g.add(p.torso);
    p.gear1 = mkSprite(0x555555, 0.35 * S, 0.35 * S, 'circle'); p.gear1.position.set(-0.5 * S, 1.75 * S, 0.1); g.add(p.gear1);
    p.gear2 = mkSprite(0x555555, 0.35 * S, 0.35 * S, 'circle'); p.gear2.position.set(0.5 * S, 1.75 * S, 0.1); g.add(p.gear2);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'box'); p.head.position.y = 2.35 * S; g.add(p.head);
    p.visor = mkSprite(0xff6600, 0.3 * S, 0.15 * S, 'box'); p.visor.position.set(0, 2.35 * S, 0.15); g.add(p.visor);
    p.armLU = mkSprite(C, 0.26 * S, 0.6 * S); p.armLU.position.set(-0.75 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.24 * S, 0.5 * S); p.armLD.position.set(-0.75 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.26 * S, 0.6 * S); p.armRU.position.set(0.75 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.24 * S, 0.5 * S); p.armRD.position.set(0.75 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.35 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.35 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.35 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.35 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xff6600, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.05 * S, 0.15);
    p.eyeR = mkSprite(0xff6600, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.05 * S, 0.15);
  } else if (shape === 'werewolf_beast') {
    // Werewolf: Beast with fur and claws
    p.bodyFur = mkSprite(C, 1.3 * S, 0.9 * S, 'circle'); p.bodyFur.position.y = 1.3 * S; g.add(p.bodyFur);
    p.head = mkSprite(SK, 0.7 * S, 0.7 * S, 'circle'); p.head.position.y = 1.9 * S; p.head.position.z = 0.3 * S; g.add(p.head);
    p.snout = mkSprite(0xaa6644, 0.35 * S, 0.25 * S); p.snout.position.set(0, 1.7 * S, 0.5 * S); g.add(p.snout);
    p.earL = mkSprite(SK, 0.2 * S, 0.4 * S, 'tri'); p.earL.position.set(-0.3 * S, 2.3 * S, 0.1); g.add(p.earL);
    p.earR = mkSprite(SK, 0.2 * S, 0.4 * S, 'tri'); p.earR.position.set(0.3 * S, 2.3 * S, 0.1); g.add(p.earR);
    p.armLU = mkSprite(C, 0.3 * S, 0.6 * S); p.armLU.position.set(-0.75 * S, 1.5 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.28 * S, 0.5 * S); p.armLD.position.set(-0.75 * S, 0.9 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.3 * S, 0.6 * S); p.armRU.position.set(0.75 * S, 1.5 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.28 * S, 0.5 * S); p.armRD.position.set(0.75 * S, 0.9 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.35 * S, 0.55 * S); p.legLU.position.set(-0.35 * S, 0.75 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(C, 0.33 * S, 0.5 * S); p.legLD.position.set(-0.35 * S, 0.15 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.35 * S, 0.55 * S); p.legRU.position.set(0.35 * S, 0.75 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(C, 0.33 * S, 0.5 * S); p.legRD.position.set(0.35 * S, 0.15 * S, 0); g.add(p.legRD);
    p.tail = mkSprite(SK, 0.2 * S, 1.0 * S); p.tail.position.set(0, 1.0 * S, -0.3 * S); p.tail.rotation.z = 0.5; g.add(p.tail);
    p.eyeL = mkSprite(0xffaa00, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeL, -0.2 * S, 0.15 * S, 0.2);
    p.eyeR = mkSprite(0xffaa00, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyeR, 0.2 * S, 0.15 * S, 0.2);
  } else if (shape === 'samurai_warrior') {
    // Samurai: Japanese warrior with katana and armor
    p.hakama = mkSprite(C, 0.95 * S, 0.8 * S); p.hakama.position.y = 1.2 * S; g.add(p.hakama);
    p.do = mkSprite(C, 1.0 * S, 1.1 * S, 'box'); p.do.position.y = 1.7 * S; g.add(p.do);
    p.kusazuri = mkSprite(legC, 1.0 * S, 0.5 * S); p.kusazuri.position.y = 1.35 * S; g.add(p.kusazuri);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.kabuto = mkSprite(legC, 0.8 * S, 0.4 * S); p.kabuto.position.y = 2.5 * S; g.add(p.kabuto);
    p.horns = mkSprite(legC, 0.25 * S, 0.4 * S); p.horns.position.set(0, 2.85 * S, 0.05); p.horns.name = 'horns'; g.add(p.horns);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(legC, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(legC, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(SK, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(SK, 0.26 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'necro_dark') {
    // Necromancer: Dark robes, skeleton parts, scythe
    p.robe = mkSprite(C, 1.0 * S, 1.3 * S, 'box'); p.robe.position.y = 1.4 * S; g.add(p.robe);
    p.robeHem = mkSprite(C, 1.15 * S, 0.7 * S, 'tri'); p.robeHem.position.y = 0.55 * S; p.robeHem.rotation.z = Math.PI; g.add(p.robeHem);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.skull = mkSprite(0xdddddd, 0.4 * S, 0.4 * S, 'circle'); p.skull.position.set(0, 2.3 * S, 0.1); g.add(p.skull);
    p.armL = mkSprite(C, 0.2 * S, 0.95 * S); p.armL.position.set(-0.7 * S, 1.7 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.2 * S, 0.95 * S); p.armR.position.set(0.7 * S, 1.7 * S, 0); g.add(p.armR);
    p.aura = mkSprite(0x00ff00, 1.5 * S, 1.5 * S, 'circle'); p.aura.position.y = 1.5 * S; p.aura.material.opacity = 0.2; p.aura.material.transparent = true; g.add(p.aura);
    p.eyeL = mkSprite(0x00ff00, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.1 * S, 0.1);
    p.eyeR = mkSprite(0x00ff00, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.1 * S, 0.1);
  } else if (shape === 'monk_martial') {
    // Monk: Simple robes, gloves, martial arts gear
    p.torso = mkSprite(C, 0.95 * S, 1.0 * S, 'box'); p.torso.position.y = 1.6 * S; g.add(p.torso);
    p.sash = mkSprite(0xff8800, 0.95 * S, 0.25 * S); p.sash.position.y = 1.5 * S; g.add(p.sash);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.25 * S; g.add(p.head);
    p.topknot = mkSprite(C, 0.2 * S, 0.35 * S, 'circle'); p.topknot.position.y = 2.75 * S; g.add(p.topknot);
    p.armL = mkSprite(C, 0.25 * S, 0.9 * S); p.armL.position.set(-0.7 * S, 1.7 * S, 0); g.add(p.armL);
    p.gloveL = mkSprite(0xff8800, 0.2 * S, 0.2 * S, 'circle'); p.gloveL.position.set(-0.7 * S, 0.95 * S, 0); g.add(p.gloveL);
    p.armR = mkSprite(C, 0.25 * S, 0.9 * S); p.armR.position.set(0.7 * S, 1.7 * S, 0); g.add(p.armR);
    p.gloveR = mkSprite(0xff8800, 0.2 * S, 0.2 * S, 'circle'); p.gloveR.position.set(0.7 * S, 0.95 * S, 0); g.add(p.gloveR);
    p.legL = mkSprite(C, 0.28 * S, 0.95 * S); p.legL.position.set(-0.3 * S, 0.55 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.28 * S, 0.95 * S); p.legR.position.set(0.3 * S, 0.55 * S, 0); g.add(p.legR);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'pirate_sailor') {
    // Pirate: Pirate outfit, tricorn hat, cutlass
    p.coat = mkSprite(C, 1.0 * S, 1.1 * S, 'box'); p.coat.position.y = 1.7 * S; g.add(p.coat);
    p.vest = mkSprite(0x883333, 0.7 * S, 0.8 * S, 'box'); p.vest.position.set(0, 1.7 * S, 0.1); g.add(p.vest);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.hat = mkSprite(C, 0.85 * S, 0.3 * S); p.hat.position.y = 2.8 * S; p.hat.rotation.z = 0.2; g.add(p.hat);
    p.feather = mkSprite(0xffff00, 0.1 * S, 0.4 * S, 'tri'); p.feather.position.set(-0.35 * S, 2.95 * S, 0.05); g.add(p.feather);
    p.eyepatch = mkSprite(0x000000, 0.15 * S, 0.15 * S, 'circle'); addAcc(p.head, p.eyepatch, -0.2 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0xff0000, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
    p.armL = mkSprite(C, 0.25 * S, 0.9 * S); p.armL.position.set(-0.7 * S, 1.7 * S, 0); g.add(p.armL);
    p.hook = mkSprite(0xaa8844, 0.15 * S, 0.35 * S, 'tri'); p.hook.position.set(-0.75 * S, 0.95 * S, 0); g.add(p.hook);
    p.armR = mkSprite(C, 0.25 * S, 0.9 * S); p.armR.position.set(0.7 * S, 1.7 * S, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.28 * S, 0.95 * S); p.legL.position.set(-0.3 * S, 0.55 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.28 * S, 0.95 * S); p.legR.position.set(0.3 * S, 0.55 * S, 0); g.add(p.legR);
  } else if (shape === 'dragoon') {
    // Dragoon: Lance wielder with dragon motif
    p.torso = mkSprite(C, 1.0 * S, 1.15 * S, 'box'); p.torso.position.y = 1.75 * S; g.add(p.torso);
    p.dragonskin = mkSprite(0x8B4513, 0.7 * S, 0.6 * S); p.dragonskin.position.set(0, 1.75 * S, 0.1); g.add(p.dragonskin);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.35 * S; g.add(p.head);
    p.dragonhelm = mkSprite(0x8B4513, 0.5 * S, 0.5 * S, 'tri'); p.dragonhelm.position.y = 2.85 * S; g.add(p.dragonhelm);
    p.armL = mkSprite(C, 0.25 * S, 0.9 * S); p.armL.position.set(-0.7 * S, 1.8 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.25 * S, 0.9 * S); p.armR.position.set(0.7 * S, 1.8 * S, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.3 * S, 1.0 * S); p.legL.position.set(-0.35 * S, 0.6 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.3 * S, 1.0 * S); p.legR.position.set(0.35 * S, 0.6 * S, 0); g.add(p.legR);
    p.eyeL = mkSprite(0xff6600, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0xff6600, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'crusader_shield') {
    // Crusader: Holy warrior with large shield
    p.armor = mkSprite(C, 1.0 * S, 1.2 * S, 'box'); p.armor.position.y = 1.8 * S; g.add(p.armor);
    p.cross = mkSprite(0xffd700, 0.3 * S, 0.6 * S); p.cross.position.set(0, 1.8 * S, 0.15); g.add(p.cross);
    p.helmet = mkSprite(legC, 0.7 * S, 0.8 * S, 'box'); p.helmet.position.y = 2.45 * S; g.add(p.helmet);
    p.legL = mkSprite(C, 0.3 * S, 0.95 * S, 'box'); p.legL.position.set(-0.35 * S, 0.6 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.3 * S, 0.95 * S, 'box'); p.legR.position.set(0.35 * S, 0.6 * S, 0); g.add(p.legR);
    p.aura = mkSprite(0xffd700, 1.6 * S, 1.6 * S, 'circle'); p.aura.position.y = 1.8 * S; p.aura.material.opacity = 0.25; p.aura.material.transparent = true; g.add(p.aura);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.helmet, p.eyeL, -0.18 * S, 0.05 * S, 0.15);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.helmet, p.eyeR, 0.18 * S, 0.05 * S, 0.15);
  } else if (shape === 'gambler_lucky') {
    // Gambler: Fancy clothes, cards, lucky charms
    p.suit = mkSprite(C, 0.95 * S, 1.05 * S, 'box'); p.suit.position.y = 1.65 * S; g.add(p.suit);
    p.vest = mkSprite(0xff0055, 0.7 * S, 0.8 * S, 'box'); p.vest.position.set(0, 1.65 * S, 0.1); g.add(p.vest);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.25 * S; g.add(p.head);
    p.tophat = mkSprite(0x111111, 0.5 * S, 0.6 * S, 'box'); p.tophat.position.y = 2.95 * S; g.add(p.tophat);
    p.band = mkSprite(0xff0055, 0.6 * S, 0.12 * S); p.band.position.y = 2.75 * S; g.add(p.band);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.26 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.26 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xff00aa, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0xff00aa, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'gladiator_arena') {
    // Gladiator: Arena fighter with minimal armor and trident
    p.torso = mkSprite(C, 1.1 * S, 0.95 * S, 'box'); p.torso.position.y = 1.6 * S; g.add(p.torso);
    p.bracerL = mkSprite(legC, 0.25 * S, 0.8 * S, 'box'); p.bracerL.position.set(-0.7 * S, 1.5 * S, 0); g.add(p.bracerL);
    p.bracerR = mkSprite(legC, 0.25 * S, 0.8 * S, 'box'); p.bracerR.position.set(0.7 * S, 1.5 * S, 0); g.add(p.bracerR);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.helmet = mkSprite(legC, 0.7 * S, 0.65 * S); p.helmet.position.set(0, 2.35 * S, 0.1); g.add(p.helmet);
    p.armLU = mkSprite(C, 0.3 * S, 0.6 * S); p.armLU.position.set(-0.75 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.28 * S, 0.5 * S); p.armLD.position.set(-0.75 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.3 * S, 0.6 * S); p.armRU.position.set(0.75 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.28 * S, 0.5 * S); p.armRD.position.set(0.75 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.32 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.3 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.32 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.3 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'duelist_blade') {
    // Duelist: Elegant swordsman with thin blade
    p.torso = mkSprite(C, 0.95 * S, 1.05 * S, 'box'); p.torso.position.y = 1.65 * S; g.add(p.torso);
    p.shirt = mkSprite(0xffffff, 0.8 * S, 0.8 * S, 'box'); p.shirt.position.set(0, 1.65 * S, 0.1); g.add(p.shirt);
    p.head = mkSprite(SK, 0.55 * S, 0.55 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.hat = mkSprite(C, 0.6 * S, 0.25 * S, 'circle'); p.hat.position.y = 2.75 * S; g.add(p.hat);
    p.feather = mkSprite(0xffaa00, 0.08 * S, 0.35 * S, 'tri'); p.feather.position.set(0.25 * S, 2.85 * S, 0.05); g.add(p.feather);
    p.armLU = mkSprite(C, 0.2 * S, 0.6 * S); p.armLU.position.set(-0.65 * S, 1.85 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.18 * S, 0.5 * S); p.armLD.position.set(-0.65 * S, 1.25 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.2 * S, 0.6 * S); p.armRU.position.set(0.65 * S, 1.85 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.18 * S, 0.5 * S); p.armRD.position.set(0.65 * S, 1.25 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.26 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.26 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeL, -0.13 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeR, 0.13 * S, 0.08 * S, 0.1);
  } else if (shape === 'shaman_tribal') {
    // Shaman: Tribal outfit with totem and mask
    p.torso = mkSprite(C, 1.0 * S, 1.0 * S, 'box'); p.torso.position.y = 1.6 * S; g.add(p.torso);
    p.feathers = mkSprite(legC, 0.8 * S, 0.6 * S); p.feathers.position.set(0, 2.0 * S, -0.1); g.add(p.feathers);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.25 * S; g.add(p.head);
    p.mask = mkSprite(0xff6600, 0.7 * S, 0.65 * S, 'box'); p.mask.position.set(0, 2.25 * S, 0.15); g.add(p.mask);
    p.markingL = mkSprite(eyeC, 0.1 * S, 0.2 * S, 'circle'); p.markingL.position.set(-0.35 * S, 2.15 * S, 0.2); g.add(p.markingL);
    p.markingR = mkSprite(eyeC, 0.1 * S, 0.2 * S, 'circle'); p.markingR.position.set(0.35 * S, 2.15 * S, 0.2); g.add(p.markingR);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
  } else if (shape === 'cow boy_gunslinger') {
    // Cowboy: Western outfit with revolver and holster
    p.shirt = mkSprite(C, 1.0 * S, 1.0 * S, 'box'); p.shirt.position.y = 1.65 * S; g.add(p.shirt);
    p.vest = mkSprite(0x8B4513, 0.75 * S, 0.8 * S, 'box'); p.vest.position.set(0, 1.65 * S, 0.1); g.add(p.vest);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.hat = mkSprite(0x8B4513, 1.0 * S, 0.3 * S, 'circle'); p.hat.position.y = 2.85 * S; g.add(p.hat);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(0x8B4513, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(0x8B4513, 0.28 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'gunner_ranged') {
    // Gunner: Explosive expert with bombs and dynamite
    p.torso = mkSprite(C, 1.0 * S, 1.05 * S, 'box'); p.torso.position.y = 1.65 * S; g.add(p.torso);
    p.ammunition = mkSprite(0x555555, 0.5 * S, 0.6 * S, 'box'); p.ammunition.position.set(-0.5 * S, 1.65 * S, 0.05); g.add(p.ammunition);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.goggles = mkSprite(0xff6600, 0.5 * S, 0.25 * S, 'box'); p.goggles.position.y = 2.35 * S; g.add(p.goggles);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xff6600, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0xff6600, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'valkyrie_winged') {
    // Valkyrie: Armored warrior with wings
    p.armor = mkSprite(C, 1.0 * S, 1.15 * S, 'box'); p.armor.position.y = 1.8 * S; g.add(p.armor);
    p.wingL = mkSprite(legC, 0.8 * S, 0.5 * S, 'tri'); p.wingL.position.set(-0.6 * S, 2.0 * S, -0.1); p.wingL.rotation.z = -0.3; g.add(p.wingL);
    p.wingR = mkSprite(legC, 0.8 * S, 0.5 * S, 'tri'); p.wingR.position.set(0.6 * S, 2.0 * S, -0.1); p.wingR.rotation.z = 0.3; g.add(p.wingR);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.4 * S; g.add(p.head);
    p.helmet = mkSprite(legC, 0.7 * S, 0.7 * S, 'circle'); p.helmet.position.y = 2.5 * S; p.helmet.scale.set(0.8, 0.9, 1); g.add(p.helmet);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.35 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.35 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.35 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.35 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.1 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.1 * S, 0.1);
  } else if (shape === 'executioner_heavy') {
    // Executioner: Heavy armor with massive greatsword
    p.torso = mkSprite(C, 1.15 * S, 1.3 * S, 'box'); p.torso.position.y = 1.9 * S; g.add(p.torso);
    p.pauldrons = mkSprite(legC, 1.2 * S, 0.5 * S); p.pauldrons.position.set(0, 2.1 * S, 0); g.add(p.pauldrons);
    p.helmet = mkSprite(legC, 0.8 * S, 0.9 * S, 'box'); p.helmet.position.y = 2.65 * S; g.add(p.helmet);
    p.executionerGrin = mkSprite(0x000000, 0.5 * S, 0.3 * S); p.executionerGrin.position.set(0, 2.5 * S, 0.2); g.add(p.executionerGrin);
    p.armLU = mkSprite(C, 0.32 * S, 0.6 * S); p.armLU.position.set(-0.8 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.3 * S, 0.5 * S); p.armLD.position.set(-0.8 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.32 * S, 0.6 * S); p.armRU.position.set(0.8 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.3 * S, 0.5 * S); p.armRD.position.set(0.8 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.35 * S, 0.55 * S); p.legLU.position.set(-0.4 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.33 * S, 0.5 * S); p.legLD.position.set(-0.4 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.35 * S, 0.55 * S); p.legRU.position.set(0.4 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.33 * S, 0.5 * S); p.legRD.position.set(0.4 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xff0000, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.helmet, p.eyeL, -0.2 * S, 0.05 * S, 0.2);
    p.eyeR = mkSprite(0xff0000, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.helmet, p.eyeR, 0.2 * S, 0.05 * S, 0.2);
  } else if (shape === 'druid_nature') {
    // Druid: Nature-themed with leaves and staff
    p.torso = mkSprite(C, 1.0 * S, 1.0 * S, 'box'); p.torso.position.y = 1.6 * S; g.add(p.torso);
    p.leafCloak = mkSprite(legC, 1.2 * S, 0.8 * S, 'tri'); p.leafCloak.position.set(0, 1.6 * S, -0.15); p.leafCloak.rotation.z = Math.PI; g.add(p.leafCloak);
    p.head = mkSprite(SK, 0.55 * S, 0.55 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.horns = mkSprite(legC, 0.4 * S, 0.5 * S, 'tri'); p.horns.position.y = 2.8 * S; p.horns.name = 'horns'; g.add(p.horns);
    p.armLU = mkSprite(C, 0.23 * S, 0.6 * S); p.armLU.position.set(-0.65 * S, 1.85 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armLD.position.set(-0.65 * S, 1.25 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.23 * S, 0.6 * S); p.armRU.position.set(0.65 * S, 1.85 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armRD.position.set(0.65 * S, 1.25 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.27 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.25 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.27 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.25 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xaaffaa, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.12 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0xaaffaa, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.12 * S, 0.08 * S, 0.1);
  } else if (shape === 'alchemist_tech') {
    // Alchemist: Goggles, potions, tech gear
    p.torso = mkSprite(C, 1.0 * S, 1.0 * S, 'box'); p.torso.position.y = 1.65 * S; g.add(p.torso);
    p.potion_belt = mkSprite(0x8B4513, 0.9 * S, 0.4 * S); p.potion_belt.position.y = 1.35 * S; g.add(p.potion_belt);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.25 * S; g.add(p.head);
    p.goggles = mkSprite(0xff9900, 0.65 * S, 0.25 * S, 'box'); p.goggles.position.y = 2.3 * S; g.add(p.goggles);
    p.goggle1 = mkSprite(0x111111, 0.15 * S, 0.15 * S, 'circle'); p.goggle1.position.set(-0.2 * S, 2.3 * S, 0.15); g.add(p.goggle1);
    p.goggle2 = mkSprite(0x111111, 0.15 * S, 0.15 * S, 'circle'); p.goggle2.position.set(0.2 * S, 2.3 * S, 0.15); g.add(p.goggle2);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0x00ff88, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0x00ff88, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'bard_musical') {
    // Bard: Colorful outfit with instrument
    p.torso = mkSprite(C, 0.95 * S, 1.0 * S, 'box'); p.torso.position.y = 1.6 * S; g.add(p.torso);
    p.ribbons = mkSprite(0xff88ff, 0.5 * S, 0.6 * S); p.ribbons.position.set(0.55 * S, 1.6 * S, -0.05); g.add(p.ribbons);
    p.head = mkSprite(SK, 0.55 * S, 0.55 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.hat = mkSprite(C, 0.7 * S, 0.4 * S, 'circle'); p.hat.position.y = 2.75 * S; g.add(p.hat);
    p.armLU = mkSprite(C, 0.23 * S, 0.6 * S); p.armLU.position.set(-0.65 * S, 1.85 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armLD.position.set(-0.65 * S, 1.25 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.23 * S, 0.6 * S); p.armRU.position.set(0.65 * S, 1.85 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armRD.position.set(0.65 * S, 1.25 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.26 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.26 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xffffaa, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeL, -0.13 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0xffffaa, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeR, 0.13 * S, 0.08 * S, 0.1);
  } else if (shape === 'runemaster_arcane') {
    // Runemaster: Arcane robes with runestones
    p.robe = mkSprite(C, 1.0 * S, 1.25 * S, 'box'); p.robe.position.y = 1.5 * S; g.add(p.robe);
    p.rune1 = mkSprite(0x00ffff, 0.3 * S, 0.3 * S, 'diamond'); p.rune1.position.set(-0.5 * S, 1.8 * S, 0.1); g.add(p.rune1);
    p.rune2 = mkSprite(0x00ffff, 0.3 * S, 0.3 * S, 'diamond'); p.rune2.position.set(0.5 * S, 1.8 * S, 0.1); g.add(p.rune2);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.25 * S; g.add(p.head);
    p.crown = mkSprite(0x00ffff, 0.65 * S, 0.35 * S); p.crown.position.y = 2.85 * S; g.add(p.crown);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0x00ffff, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0x00ffff, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'illusionist_mirror') {
    // Illusionist: Fancy outfit with mirror and clone effect
    p.torso = mkSprite(C, 0.95 * S, 1.0 * S, 'box'); p.torso.position.y = 1.6 * S; g.add(p.torso);
    p.mirror = mkSprite(0xdddddd, 0.4 * S, 0.7 * S, 'box'); p.mirror.position.set(0.6 * S, 1.6 * S, 0.05); g.add(p.mirror);
    p.head = mkSprite(SK, 0.55 * S, 0.55 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.mask = mkSprite(0x8800aa, 0.5 * S, 0.3 * S, 'box'); p.mask.position.set(0, 2.2 * S, 0.15); g.add(p.mask);
    p.armLU = mkSprite(C, 0.23 * S, 0.6 * S); p.armLU.position.set(-0.65 * S, 1.85 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armLD.position.set(-0.65 * S, 1.25 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.23 * S, 0.6 * S); p.armRU.position.set(0.65 * S, 1.85 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armRD.position.set(0.65 * S, 1.25 * S, 0); g.add(p.armRD);
    p.phantom = mkSprite(0x8800aa, 1.1 * S, 1.1 * S, 'circle'); p.phantom.position.y = 1.6 * S; p.phantom.material.opacity = 0.3; p.phantom.material.transparent = true; g.add(p.phantom);
    p.legLU = mkSprite(C, 0.26 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.26 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xff00ff, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeL, -0.13 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0xff00ff, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeR, 0.13 * S, 0.08 * S, 0.1);
  } else if (shape === 'witchdoc_voodoo') {
    // Witchdoc: Voodoo outfit with dolls and bones
    p.torso = mkSprite(C, 0.95 * S, 1.0 * S, 'box'); p.torso.position.y = 1.6 * S; g.add(p.torso);
    p.bones = mkSprite(0xdddddd, 0.7 * S, 0.5 * S); p.bones.position.set(-0.5 * S, 1.6 * S, 0.05); g.add(p.bones);
    p.head = mkSprite(SK, 0.55 * S, 0.55 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.crown = mkSprite(C, 0.6 * S, 0.4 * S); p.crown.position.y = 2.75 * S; g.add(p.crown);
    p.armLU = mkSprite(C, 0.23 * S, 0.6 * S); p.armLU.position.set(-0.65 * S, 1.85 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armLD.position.set(-0.65 * S, 1.25 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.23 * S, 0.6 * S); p.armRU.position.set(0.65 * S, 1.85 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armRD.position.set(0.65 * S, 1.25 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.26 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.26 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0x00ff00, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeL, -0.13 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0x00ff00, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeR, 0.13 * S, 0.08 * S, 0.1);
  } else if (shape === 'cultist_twisted') {
    // Cultist: Dark robes with twisted features
    p.robe = mkSprite(C, 1.0 * S, 1.25 * S, 'box'); p.robe.position.y = 1.5 * S; g.add(p.robe);
    p.symbol = mkSprite(0xff0000, 0.4 * S, 0.4 * S, 'circle'); p.symbol.position.set(0, 1.6 * S, 0.15); g.add(p.symbol);
    p.head = mkSprite(SK, 0.55 * S, 0.55 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.crown = mkSprite(0xff0000, 0.6 * S, 0.4 * S, 'tri'); p.crown.position.y = 2.75 * S; g.add(p.crown);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xff0000, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.13 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0xff0000, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.13 * S, 0.08 * S, 0.1);
  } else if (shape === 'chef_cook') {
    // Chef: White chef outfit with cleaver
    p.whites = mkSprite(C, 1.0 * S, 1.05 * S, 'box'); p.whites.position.y = 1.65 * S; g.add(p.whites);
    p.apron = mkSprite(0xff0000, 0.8 * S, 0.8 * S); p.apron.position.set(0, 1.65 * S, 0.1); g.add(p.apron);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.toque = mkSprite(0xffffff, 0.6 * S, 0.6 * S, 'circle'); p.toque.position.y = 2.85 * S; g.add(p.toque);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'juggler_acrobat') {
    // Juggler: Acrobat outfit with theatrical style
    p.leotard = mkSprite(C, 0.95 * S, 1.0 * S, 'box'); p.leotard.position.y = 1.6 * S; g.add(p.leotard);
    p.stripe1 = mkSprite(0xffff00, 0.4 * S, 0.15 * S); p.stripe1.position.set(0, 1.8 * S, 0.1); g.add(p.stripe1);
    p.stripe2 = mkSprite(0xffff00, 0.4 * S, 0.15 * S); p.stripe2.position.set(0, 1.4 * S, 0.1); g.add(p.stripe2);
    p.head = mkSprite(SK, 0.55 * S, 0.55 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.crown = mkSprite(0xffff00, 0.7 * S, 0.25 * S, 'circle'); p.crown.position.y = 2.7 * S; g.add(p.crown);
    p.jewel = mkSprite(0xff0055, 0.15 * S, 0.15 * S, 'circle'); p.jewel.position.y = 2.75 * S; g.add(p.jewel);
    p.armLU = mkSprite(C, 0.23 * S, 0.6 * S); p.armLU.position.set(-0.65 * S, 1.85 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armLD.position.set(-0.65 * S, 1.25 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.23 * S, 0.6 * S); p.armRU.position.set(0.65 * S, 1.85 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armRD.position.set(0.65 * S, 1.25 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.26 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.26 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.24 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0x00ff00, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeL, -0.13 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0x00ff00, 0.1 * S, 0.1 * S, 'circle'); addAcc(p.head, p.eyeR, 0.13 * S, 0.08 * S, 0.1);
  } else if (shape === 'geomancer_earth') {
    // Geomancer: Earth-themed with rocky texture
    p.torso = mkSprite(C, 1.0 * S, 1.05 * S, 'box'); p.torso.position.y = 1.65 * S; g.add(p.torso);
    p.stone1 = mkSprite(0x666666, 0.4 * S, 0.4 * S, 'diamond'); p.stone1.position.set(-0.55 * S, 1.85 * S, 0.05); g.add(p.stone1);
    p.stone2 = mkSprite(0x666666, 0.4 * S, 0.4 * S, 'diamond'); p.stone2.position.set(0.55 * S, 1.85 * S, 0.05); g.add(p.stone2);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.crown = mkSprite(0x666666, 0.7 * S, 0.3 * S); p.crown.position.y = 2.8 * S; g.add(p.crown);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0x00ff00, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0x00ff00, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'astronomer_celestial') {
    // Astronomer: Robes with celestial motif
    p.robe = mkSprite(C, 1.0 * S, 1.2 * S, 'box'); p.robe.position.y = 1.6 * S; g.add(p.robe);
    p.stars = mkSprite(0xffff00, 0.6 * S, 0.5 * S); p.stars.position.set(0, 1.6 * S, 0.1); g.add(p.stars);
    p.head = mkSprite(SK, 0.55 * S, 0.55 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.armLU = mkSprite(C, 0.23 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.85 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.25 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.23 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.85 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.21 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.25 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.27 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.25 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.27 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.25 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xffffaa, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.12 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0xffffaa, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.12 * S, 0.08 * S, 0.1);
  } else if (shape === 'darkknight_evil') {
    // Dark Knight: Edgy armor with dark aura
    p.armor = mkSprite(C, 1.0 * S, 1.2 * S, 'box'); p.armor.position.y = 1.8 * S; g.add(p.armor);
    p.spikes = mkSprite(0x555555, 0.8 * S, 0.3 * S); p.spikes.position.set(0, 2.1 * S, 0.05); g.add(p.spikes);
    p.helmet = mkSprite(C, 0.7 * S, 0.8 * S, 'box'); p.helmet.position.y = 2.45 * S; g.add(p.helmet);
    p.horns = mkSprite(0x555555, 0.4 * S, 0.6 * S); p.horns.position.y = 3.0 * S; p.horns.name = 'horns'; g.add(p.horns);
    p.darkAura = mkSprite(0x220000, 1.5 * S, 1.5 * S, 'circle'); p.darkAura.position.y = 1.8 * S; p.darkAura.material.opacity = 0.2; p.darkAura.material.transparent = true; g.add(p.darkAura);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.3 * S, 0.55 * S); p.legLU.position.set(-0.35 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.28 * S, 0.5 * S); p.legLD.position.set(-0.35 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.3 * S, 0.55 * S); p.legRU.position.set(0.35 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.28 * S, 0.5 * S); p.legRD.position.set(0.35 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xff0000, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.helmet, p.eyeL, -0.18 * S, 0.05 * S, 0.15);
    p.eyeR = mkSprite(0xff0000, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.helmet, p.eyeR, 0.18 * S, 0.05 * S, 0.15);
  } else if (shape === 'sunpriest_radiant') {
    // Sun Priest: Holy outfit with glowing sun elements
    p.robes = mkSprite(C, 1.0 * S, 1.15 * S, 'box'); p.robes.position.y = 1.75 * S; g.add(p.robes);
    p.sun1 = mkSprite(0xffd700, 0.4 * S, 0.4 * S, 'circle'); p.sun1.position.set(-0.6 * S, 1.85 * S, 0.1); g.add(p.sun1);
    p.sun2 = mkSprite(0xffd700, 0.4 * S, 0.4 * S, 'circle'); p.sun2.position.set(0.6 * S, 1.85 * S, 0.1); g.add(p.sun2);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.35 * S; g.add(p.head);
    p.halo = mkSprite(0xffd700, 0.9 * S, 0.15 * S, 'circle'); p.halo.position.y = 1.5 * S; p.halo.material.opacity = 0.18; p.halo.material.transparent = true; g.add(p.halo);
    p.armLU = mkSprite(C, 0.25 * S, 0.6 * S); p.armLU.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armLU);
    p.armLD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armLD.position.set(-0.7 * S, 1.3 * S, 0); g.add(p.armLD);
    p.armRU = mkSprite(C, 0.25 * S, 0.6 * S); p.armRU.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armRU);
    p.armRD = mkSprite(SK, 0.23 * S, 0.5 * S); p.armRD.position.set(0.7 * S, 1.3 * S, 0); g.add(p.armRD);
    p.legLU = mkSprite(C, 0.28 * S, 0.55 * S); p.legLU.position.set(-0.3 * S, 0.85 * S, 0); g.add(p.legLU);
    p.legLD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legLD.position.set(-0.3 * S, 0.25 * S, 0); g.add(p.legLD);
    p.legRU = mkSprite(C, 0.28 * S, 0.55 * S); p.legRU.position.set(0.3 * S, 0.85 * S, 0); g.add(p.legRU);
    p.legRD = mkSprite(legC, 0.26 * S, 0.5 * S); p.legRD.position.set(0.3 * S, 0.25 * S, 0); g.add(p.legRD);
    p.eyeL = mkSprite(0xffffff, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeL, -0.15 * S, 0.08 * S, 0.1);
    p.eyeR = mkSprite(0xffffff, 0.12 * S, 0.12 * S, 'circle'); addAcc(p.head, p.eyeR, 0.15 * S, 0.08 * S, 0.1);
  } else if (shape === 'windmill') {
    // Moulin hanté: base carrée + 4 pales rotatives
    p.base = mkSprite(C, 1.2 * S, 1.8 * S, 'box'); p.base.position.y = 1.0 * S; g.add(p.base);
    p.door = mkSprite(0x442211, 0.4 * S, 0.6 * S); p.door.position.set(0, 0.4 * S, 0.62 * S); g.add(p.door);
    p.blades = mkSprite(0x886644, 0.1 * S, 2.0 * S); p.blades.position.set(0, 1.5 * S, 0.65 * S); g.add(p.blades);
    p.blades2 = mkSprite(0x886644, 2.0 * S, 0.1 * S); p.blades2.position.set(0, 1.5 * S, 0.65 * S); g.add(p.blades2);
  } else if (shape === 'scarecrow') {
    // Épouvantail: poteau vertical + corps cruciforme
    p.post = mkSprite(0x442211, 0.15 * S, 1.5 * S); p.post.position.y = 0.75 * S; g.add(p.post);
    p.torso = mkSprite(C, 0.8 * S, 0.7 * S, 'box'); p.torso.position.y = 1.5 * S; g.add(p.torso);
    p.head = mkSprite(0xddaa88, 0.5 * S, 0.5 * S, 'circle'); p.head.position.y = 2.2 * S; g.add(p.head);
    p.hat = mkSprite(0x664422, 0.8 * S, 0.4 * S, 'circle'); p.hat.position.y = 2.7 * S; g.add(p.hat);
    p.armL = mkSprite(C, 0.8 * S, 0.15 * S); p.armL.position.set(-1.1 * S, 1.5 * S, 0); p.armL.rotation.z = -0.5; g.add(p.armL);
    p.armR = mkSprite(C, 0.8 * S, 0.15 * S); p.armR.position.set(1.1 * S, 1.5 * S, 0); p.armR.rotation.z = 0.5; g.add(p.armR);
    p.eyeL = mkSprite(0x000000, 0.1 * S, 0.1 * S, 'circle'); p.eyeL.position.set(-0.15 * S, 2.25 * S, 0.3 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(0x000000, 0.1 * S, 0.1 * S, 'circle'); p.eyeR.position.set(0.15 * S, 2.25 * S, 0.3 * S); g.add(p.eyeR);
  } else if (shape === 'sack') {
    // Sac de grain: blob irrégulier
    p.body = mkSprite(C, 1.3 * S, 1.5 * S, 'circle'); p.body.position.y = 0.8 * S; g.add(p.body);
    p.rope = mkSprite(0x664422, 0.6 * S, 0.15 * S); p.rope.position.y = 1.4 * S; g.add(p.rope);
  } else if (shape === 'scythe') {
    // Faux volante: manche + grande lame courbe
    p.handle = mkSprite(0x5a3310, 0.1 * S, 1.8 * S); p.handle.position.y = 1.5 * S; g.add(p.handle);
    p.blade = mkSprite(0xaaaaaa, 1.2 * S, 0.4 * S, 'tri'); p.blade.position.set(-0.6 * S, 2.4 * S, 0); p.blade.rotation.z = -2.0; g.add(p.blade);
  } else if (shape === 'plow') {
    // Charrue possédée: corps mécanique + lames
    p.body = mkSprite(C, 1.0 * S, 0.8 * S, 'box'); p.body.position.y = 1.0 * S; g.add(p.body);
    p.blade1 = mkSprite(0x888888, 0.6 * S, 0.3 * S, 'tri'); p.blade1.position.set(-0.5 * S, 0.7 * S, 0.3 * S); g.add(p.blade1);
    p.blade2 = mkSprite(0x888888, 0.6 * S, 0.3 * S, 'tri'); p.blade2.position.set(0.5 * S, 0.7 * S, 0.3 * S); g.add(p.blade2);
    p.wheel = mkSprite(0x442211, 0.5 * S, 0.5 * S, 'circle'); p.wheel.position.set(0, 0.5 * S, -0.3 * S); g.add(p.wheel);
  } else if (shape === 'troll') {
    // Troll: grand humanoïde bossu
    p.hump = mkSprite(C, 0.9 * S, 0.7 * S, 'circle'); p.hump.position.y = 2.0 * S; g.add(p.hump);
    p.torso = mkSprite(C, 1.1 * S, 1.0 * S, 'box'); p.torso.position.y = 1.4 * S; g.add(p.torso);
    p.head = mkSprite(SK, 0.7 * S, 0.6 * S, 'circle'); p.head.position.y = 1.8 * S; p.head.position.z = 0.3 * S; g.add(p.head);
    p.armL = mkSprite(C, 0.35 * S, 1.0 * S); p.armL.position.set(-0.8 * S, 1.5 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.35 * S, 1.0 * S); p.armR.position.set(0.8 * S, 1.5 * S, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.35 * S, 0.9 * S); p.legL.position.set(-0.35 * S, 0.6 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.35 * S, 0.9 * S); p.legR.position.set(0.35 * S, 0.6 * S, 0); g.add(p.legR);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); p.eyeL.position.set(-0.2 * S, 1.85 * S, 0.6 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); p.eyeR.position.set(0.2 * S, 1.85 * S, 0.6 * S); g.add(p.eyeR);
  } else if (shape === 'werewolf') {
    // Loup-garou debout
    p.torso = mkSprite(C, 1.0 * S, 1.0 * S, 'box'); p.torso.position.y = 1.6 * S; g.add(p.torso);
    p.head = mkSprite(SK, 0.7 * S, 0.7 * S, 'circle'); p.head.position.y = 2.4 * S; g.add(p.head);
    p.snout = mkSprite(0xaa6644, 0.4 * S, 0.3 * S); p.snout.position.set(0, 2.35 * S, 0.4 * S); g.add(p.snout);
    p.earL = mkSprite(SK, 0.25 * S, 0.5 * S, 'tri'); p.earL.position.set(-0.3 * S, 2.8 * S, 0); g.add(p.earL);
    p.earR = mkSprite(SK, 0.25 * S, 0.5 * S, 'tri'); p.earR.position.set(0.3 * S, 2.8 * S, 0); g.add(p.earR);
    p.armL = mkSprite(C, 0.3 * S, 0.9 * S); p.armL.position.set(-0.75 * S, 1.8 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.3 * S, 0.9 * S); p.armR.position.set(0.75 * S, 1.8 * S, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.32 * S, 0.9 * S); p.legL.position.set(-0.35 * S, 0.7 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.32 * S, 0.9 * S); p.legR.position.set(0.35 * S, 0.7 * S, 0); g.add(p.legR);
    p.tail = mkSprite(SK, 0.15 * S, 0.8 * S); p.tail.position.set(0, 1.3 * S, -0.5 * S); p.tail.rotation.z = 0.5; g.add(p.tail);
    p.eyeL = mkSprite(0xffaa00, 0.15 * S, 0.15 * S, 'circle'); p.eyeL.position.set(-0.2 * S, 2.45 * S, 0.4 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(0xffaa00, 0.15 * S, 0.15 * S, 'circle'); p.eyeR.position.set(0.2 * S, 2.45 * S, 0.4 * S); g.add(p.eyeR);
  } else if (shape === 'monkey') {
    // Singe: petit avec longs bras
    p.torso = mkSprite(C, 0.7 * S, 0.8 * S, 'circle'); p.torso.position.y = 1.2 * S; g.add(p.torso);
    p.head = mkSprite(SK, 0.5 * S, 0.5 * S, 'circle'); p.head.position.y = 1.7 * S; g.add(p.head);
    p.armL = mkSprite(C, 0.15 * S, 1.1 * S); p.armL.position.set(-0.55 * S, 1.3 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.15 * S, 1.1 * S); p.armR.position.set(0.55 * S, 1.3 * S, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.2 * S, 0.7 * S); p.legL.position.set(-0.25 * S, 0.5 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.2 * S, 0.7 * S); p.legR.position.set(0.25 * S, 0.5 * S, 0); g.add(p.legR);
    p.tail = mkSprite(SK, 0.1 * S, 1.2 * S); p.tail.position.set(0, 0.9 * S, -0.4 * S); p.tail.rotation.z = 0.8; g.add(p.tail);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); p.eyeL.position.set(-0.15 * S, 1.75 * S, 0.3 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); p.eyeR.position.set(0.15 * S, 1.75 * S, 0.3 * S); g.add(p.eyeR);
  } else if (shape === 'gorilla') {
    // Gorille: large avec bras massifs
    p.torso = mkSprite(C, 1.4 * S, 1.1 * S, 'circle'); p.torso.position.y = 1.3 * S; g.add(p.torso);
    p.head = mkSprite(SK, 0.9 * S, 0.8 * S, 'circle'); p.head.position.y = 1.9 * S; g.add(p.head);
    p.armL = mkSprite(C, 0.4 * S, 1.3 * S); p.armL.position.set(-0.9 * S, 0.8 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.4 * S, 1.3 * S); p.armR.position.set(0.9 * S, 0.8 * S, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.4 * S, 0.9 * S); p.legL.position.set(-0.4 * S, 0.7 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.4 * S, 0.9 * S); p.legR.position.set(0.4 * S, 0.7 * S, 0); g.add(p.legR);
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); p.eyeL.position.set(-0.25 * S, 1.95 * S, 0.5 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); p.eyeR.position.set(0.25 * S, 1.95 * S, 0.5 * S); g.add(p.eyeR);
  } else if (shape === 'frog' || shape === 'toad') {
    // Grenouille/Crapaud: corps rond, pattes arrière puissantes
    const size = shape === 'toad' ? 1.4 : 1.0;
    p.body = mkSprite(C, 1.0 * S * size, 0.8 * S, 'circle'); p.body.position.y = 0.7 * S; g.add(p.body);
    p.head = mkSprite(SK, 0.9 * S * size, 0.7 * S, 'circle'); p.head.position.y = 0.7 * S; g.add(p.head);
    p.eyeL = mkSprite(eyeC, 0.25 * S, 0.25 * S, 'circle'); p.eyeL.position.set(-0.3 * S * size, 1.0 * S, 0.3 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(eyeC, 0.25 * S, 0.25 * S, 'circle'); p.eyeR.position.set(0.3 * S * size, 1.0 * S, 0.3 * S); g.add(p.eyeR);
   p.legL = mkSprite(C, 0.25 * S, 0.7 * S); p.legL.position.set(-0.5 * S * size, 0.3 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.25 * S, 0.7 * S); p.legR.position.set(0.5 * S * size, 0.3 * S, 0); g.add(p.legR);
  } else if (shape === 'crocodile') {
    // Crocodile: long corps reptilien
    p.body = mkSprite(C, 1.8 * S, 0.6 * S, 'box'); p.body.position.y = 0.5 * S; g.add(p.body);
    p.head = mkSprite(SK, 0.8 * S, 0.5 * S, 'box'); p.head.position.set(1.1 * S, 0.6 * S, 0); g.add(p.head);
    p.jaw = mkSprite(SK, 0.8 * S, 0.3 * S, 'box'); p.jaw.position.set(1.1 * S, 0.5 * S, 0); g.add(p.jaw);
    p.tail = mkSprite(C, 0.15 * S, 1.5 * S); p.tail.position.set(-1.0 * S, 0.5 * S, 0); p.tail.rotation.z = -0.5; g.add(p.tail);
    for(let i=0; i<4; i++) {
      const leg = mkSprite(C, 0.2 * S, 0.4 * S);
      const x = (i<2 ? 0.6 : -0.3) * S;
      const z = (i%2===0 ? -0.4 : 0.4) * S;
      leg.position.set(x, 0.3 * S, z);
      g.add(leg);
      p['leg'+i] = leg;
    }
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); p.eyeL.position.set(0.95 * S, 0.75 * S, 0.3 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); p.eyeR.position.set(1.25 * S, 0.75 * S, 0.3 * S); g.add(p.eyeR);
  } else if (shape === 'hag') {
    // Sorcière bossue avec bâton
    p.torso = mkSprite(C, 0.9 * S, 0.9 * S, 'box'); p.torso.position.y = 1.3 * S; p.torso.rotation.z = 0.2; g.add(p.torso);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.0 * S; g.add(p.head);
    p.hat = mkSprite(0x220022, 0.7 * S, 0.9 * S, 'tri'); p.hat.position.y = 2.7 * S; g.add(p.hat);
    p.armL = mkSprite(C, 0.2 * S, 0.7 * S); p.armL.position.set(-0.65 * S, 1.5 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.2 * S, 0.7 * S); p.armR.position.set(0.65 * S, 1.5 * S, 0); g.add(p.armR);
    p.staff = mkSprite(0x442211, 0.1 * S, 1.5 * S); p.staff.position.set(0.7 * S, 1.5 * S, 0); g.add(p.staff);
    p.orb = mkSprite(eyeC, 0.25 * S, 0.25 * S, 'circle'); p.orb.position.set(0.7 * S, 2.3 * S, 0); g.add(p.orb);
    p.legL = mkSprite(C, 0.25 * S, 0.8 * S); p.legL.position.set(-0.3 * S, 0.6 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.25 * S, 0.8 * S); p.legR.position.set(0.3 * S, 0.6 * S, 0); g.add(p.legR);
    p.eyeL = mkSprite(0xff0000, 0.12 * S, 0.12 * S, 'circle'); p.eyeL.position.set(-0.15 * S, 2.05 * S, 0.35 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(0xff0000, 0.12 * S, 0.12 * S, 'circle'); p.eyeR.position.set(0.15 * S, 2.05 * S, 0.35 * S); g.add(p.eyeR);
  } else if (shape === 'penguin') {
    // Pingouin: corps ovale, petites ailes
    p.body = mkSprite(C, 0.7 * S, 1.1 * S, 'circle'); p.body.position.y = 1.0 * S; g.add(p.body);
    p.belly = mkSprite(0xffffff, 0.5 * S, 0.8 * S, 'circle'); p.belly.position.set(0, 1.0 * S, 0.4 * S); g.add(p.belly);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 1.6 * S; g.add(p.head);
    p.beak = mkSprite(0xff8800, 0.15 * S, 0.2 * S, 'tri'); p.beak.position.set(0, 1.55 * S, 0.35 * S); p.beak.rotation.z = Math.PI; g.add(p.beak);
    p.wingL = mkSprite(C, 0.25 * S, 0.6 * S); p.wingL.position.set(-0.6 * S, 1.1 * S, 0); p.wingL.rotation.z = -0.3; g.add(p.wingL);
    p.wingR = mkSprite(C, 0.25 * S, 0.6 * S); p.wingR.position.set(0.6 * S, 1.1 * S, 0); p.wingR.rotation.z = 0.3; g.add(p.wingR);
    p.legL = mkSprite(0xff8800, 0.3 * S, 0.15 * S); p.legL.position.set(-0.25 * S, 0.2 * S, 0.2 * S); g.add(p.legL);
    p.legR = mkSprite(0xff8800, 0.3 * S, 0.15 * S); p.legR.position.set(0.25 * S, 0.2 * S, 0.2 * S); g.add(p.legR);
    p.eyeL = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); p.eyeL.position.set(-0.15 * S, 1.65 * S, 0.35 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); p.eyeR.position.set(0.15 * S, 1.65 * S, 0.35 * S); g.add(p.eyeR);
  } else if (shape === 'mammoth') {
    // Mammouth: très grand quadrupède avec défenses
    p.body = mkSprite(C, 2.0 * S, 1.5 * S, 'box'); p.body.position.y = 2.0 * S; g.add(p.body);
    p.head = mkSprite(SK, 1.2 * S, 1.2 * S, 'box'); p.head.position.set(1.0 * S, 2.5 * S, 0); g.add(p.head);
    p.trunk = mkSprite(SK, 0.3 * S, 1.2 * S); p.trunk.position.set(1.3 * S, 2.3 * S, 0); g.add(p.trunk);
    p.tuskL = mkSprite(0xffffee, 0.15 * S, 1.0 * S, 'tri'); p.tuskL.position.set(0.9 * S, 2.2 * S, 0.5 * S); p.tuskL.rotation.z = -0.5; g.add(p.tuskL);
    p.tuskR = mkSprite(0xffffee, 0.15 * S, 1.0 * S, 'tri'); p.tuskR.position.set(1.1 * S, 2.2 * S, 0.5 * S); p.tuskR.rotation.z = 0.5; g.add(p.tuskR);
    for(let i=0; i<4; i++) {
      const leg = mkSprite(C, 0.5 * S, 1.4 * S);
      const x = (i<2 ? 0.7 : -0.7) * S;
      const z = (i%2===0 ? -0.5 : 0.5) * S;
      leg.position.set(x, 0.9 * S, z);
      g.add(leg);
      p['leg'+i] = leg;
    }
    p.eyeL = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); p.eyeL.position.set(0.85 * S, 2.7 * S, 0.6 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(eyeC, 0.15 * S, 0.15 * S, 'circle'); p.eyeR.position.set(1.15 * S, 2.7 * S, 0.6 * S); g.add(p.eyeR);
  } else if (shape === 'yeti') {
    // Yeti: grand humanoïde poilu
    p.torso = mkSprite(C, 1.3 * S, 1.4 * S, 'box'); p.torso.position.y = 2.0 * S; g.add(p.torso);
    p.fur = mkSprite(0xffffff, 1.4 * S, 1.3 * S); p.fur.position.set(0, 2.0 * S, 0.05); p.fur.material.opacity = 0.8; p.fur.material.transparent = true; g.add(p.fur);
    p.head = mkSprite(SK, 0.9 * S, 0.9 * S, 'circle'); p.head.position.y = 2.8 * S; g.add(p.head);
    p.armL = mkSprite(C, 0.4 * S, 1.2 * S); p.armL.position.set(-0.9 * S, 2.2 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.4 * S, 1.2 * S); p.armR.position.set(0.9 * S, 2.2 * S, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.45 * S, 1.2 * S); p.legL.position.set(-0.4 * S, 0.9 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.45 * S, 1.2 * S); p.legR.position.set(0.4 * S, 0.9 * S, 0); g.add(p.legR);
    p.eyeL = mkSprite(0x88ddff, 0.15 * S, 0.15 * S, 'circle'); p.eyeL.position.set(-0.25 * S, 2.85 * S, 0.5 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(0x88ddff, 0.15 * S, 0.15 * S, 'circle'); p.eyeR.position.set(0.25 * S, 2.85 * S, 0.5 * S); g.add(p.eyeR);
  } else if (shape === 'mummy') {
    // Momie: humanoïde enveloppé de bandages
    p.torso = mkSprite(C, 0.9 * S, 1.0 * S, 'box'); p.torso.position.y = 1.6 * S; g.add(p.torso);
    p.bandage1 = mkSprite(0xeeddcc, 0.95 * S, 0.15 * S); p.bandage1.position.set(0, 1.8 * S, 0.5 * S); g.add(p.bandage1);
    p.bandage2 = mkSprite(0xeeddcc, 0.95 * S, 0.15 * S); p.bandage2.position.set(0, 1.4 * S, 0.5 * S); g.add(p.bandage2);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.3 * S; g.add(p.head);
    p.bandageH = mkSprite(0xeeddcc, 0.65 * S, 0.15 * S); p.bandageH.position.set(0, 2.3 * S, 0.35 * S); g.add(p.bandageH);
    p.armL = mkSprite(C, 0.25 * S, 0.85 * S); p.armL.position.set(-0.7 * S, 1.7 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.25 * S, 0.85 * S); p.armR.position.set(0.7 * S, 1.7 * S, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.28 * S, 0.9 * S); p.legL.position.set(-0.3 * S, 0.7 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.28 * S, 0.9 * S); p.legR.position.set(0.3 * S, 0.7 * S, 0); g.add(p.legR);
    p.eyeL = mkSprite(0x00ff00, 0.12 * S, 0.12 * S, 'circle'); p.eyeL.position.set(-0.15 * S, 2.35 * S, 0.35 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(0x00ff00, 0.12 * S, 0.12 * S, 'circle'); p.eyeR.position.set(0.15 * S, 2.35 * S, 0.35 * S); g.add(p.eyeR);
  } else if (shape === 'vampire') {
    // Vampire: élégant avec cape dramatique
    p.torso = mkSprite(C, 0.95 * S, 1.05 * S, 'box'); p.torso.position.y = 1.7 * S; g.add(p.torso);
    p.vest = mkSprite(0x880000, 0.8 * S, 0.9 * S, 'box'); p.vest.position.set(0, 1.7 * S, 0.5 * S); g.add(p.vest);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.4 * S; g.add(p.head);
    p.cape = mkSprite(0x220000, 1.4 * S, 1.6 * S); p.cape.position.set(0, 1.5 * S, -0.3 * S); g.add(p.cape);
    p.collar = mkSprite(0x000000, 1.0 * S, 0.4 * S); p.collar.position.set(0, 2.1 * S, 0.1 * S); g.add(p.collar);
    p.armL = mkSprite(C, 0.25 * S, 0.9 * S); p.armL.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.25 * S, 0.9 * S); p.armR.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.27 * S, 0.95 * S); p.legL.position.set(-0.3 * S, 0.8 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.27 * S, 0.95 * S); p.legR.position.set(0.3 * S, 0.8 * S, 0); g.add(p.legR);
    p.eyeL = mkSprite(0xff0000, 0.15 * S, 0.15 * S, 'circle'); p.eyeL.position.set(-0.15 * S, 2.45 * S, 0.35 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(0xff0000, 0.15 * S, 0.15 * S, 'circle'); p.eyeR.position.set(0.15 * S, 2.45 * S, 0.35 * S); g.add(p.eyeR);
  } else if (shape === 'lich') {
    // Liche: squelette flottant avec robe et aura magique
    p.robe = mkSprite(C, 1.1 * S, 1.5 * S, 'box'); p.robe.position.y = 1.3 * S; g.add(p.robe);
    p.torso = mkSprite(0xeeeedd, 0.7 * S, 0.9 * S, 'box'); p.torso.position.y = 1.8 * S; g.add(p.torso);
    p.head = mkSprite(0xffffee, 0.7 * S, 0.7 * S, 'circle'); p.head.position.y = 2.5 * S; g.add(p.head);
    p.crown = mkSprite(0xffd700, 0.8 * S, 0.4 * S); p.crown.position.y = 2.95 * S; g.add(p.crown);
    p.aura = mkSprite(0x00ff00, 1.6 * S, 1.6 * S, 'circle'); p.aura.position.y = 1.8 * S; p.aura.material.opacity = 0.2; p.aura.material.transparent = true; g.add(p.aura);
    p.armL = mkSprite(0xeeeedd, 0.2 * S, 0.8 * S); p.armL.position.set(-0.7 * S, 2.0 * S, 0); g.add(p.armL);
    p.armR = mkSprite(0xeeeedd, 0.2 * S, 0.8 * S); p.armR.position.set(0.7 * S, 2.0 * S, 0); g.add(p.armR);
    p.eyeL = mkSprite(0x00ff00, 0.15 * S, 0.15 * S, 'circle'); p.eyeL.position.set(-0.2 * S, 2.55 * S, 0.4 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(0x00ff00, 0.15 * S, 0.15 * S, 'circle'); p.eyeR.position.set(0.2 * S, 2.55 * S, 0.4 * S); g.add(p.eyeR);
  } else if (shape === 'banshee') {
    // Banshee: esprit féminin flottant avec longs cheveux
    p.body = mkSprite(C, 0.9 * S, 1.3 * S, 'tri'); p.body.position.y = 2.0 * S; p.body.rotation.z = Math.PI; p.body.material.opacity = 0.7; p.body.material.transparent = true; g.add(p.body);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.7 * S; p.head.material.opacity = 0.7; p.head.material.transparent = true; g.add(p.head);
    p.hair = mkSprite(C, 0.8 * S, 1.2 * S); p.hair.position.set(0, 2.7 * S, -0.2 * S); p.hair.material.opacity = 0.6; p.hair.material.transparent = true; g.add(p.hair);
    p.armL = mkSprite(C, 0.2 * S, 0.9 * S); p.armL.position.set(-0.6 * S, 2.2 * S, 0); p.armL.material.opacity = 0.7; p.armL.material.transparent = true; g.add(p.armL);
    p.armR = mkSprite(C, 0.2 * S, 0.9 * S); p.armR.position.set(0.6 * S, 2.2 * S, 0); p.armR.material.opacity = 0.7; p.armR.material.transparent = true; g.add(p.armR);
    p.eyeL = mkSprite(0x88ffff, 0.15 * S, 0.15 * S, 'circle'); p.eyeL.position.set(-0.15 * S, 2.75 * S, 0.35 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(0x88ffff, 0.15 * S, 0.15 * S, 'circle'); p.eyeR.position.set(0.15 * S, 2.75 * S, 0.35 * S); g.add(p.eyeR);
  } else if (shape === 'oni' || shape === 'demon' || shape === 'imp' || shape === 'ogre') {
    // Créatures démoniaques: oni, démons, diablotins, ogres
    const sz = shape === 'imp' ? 0.7 : (shape === 'ogre' ? 1.6 : 1.2);
    p.torso = mkSprite(C, 1.0 * S * sz, 1.1 * S * sz, 'box'); p.torso.position.y = 1.7 * S * sz; g.add(p.torso);
    p.head = mkSprite(SK, 0.7 * S * sz, 0.7 * S * sz, 'circle'); p.head.position.y = 2.4 * S * sz; g.add(p.head);
    p.hornL = mkSprite(legC, 0.15 * S * sz, 0.5 * S * sz, 'tri'); p.hornL.position.set(-0.3 * S * sz, 2.85 * S * sz, 0); p.hornL.name = 'horns'; g.add(p.hornL);
    p.hornR = mkSprite(legC, 0.15 * S * sz, 0.5 * S * sz, 'tri'); p.hornR.position.set(0.3 * S * sz, 2.85 * S * sz, 0); p.hornR.name = 'horns'; g.add(p.hornR);
    p.armL = mkSprite(C, 0.3 * S * sz, 0.9 * S * sz); p.armL.position.set(-0.75 * S * sz, 2.0 * S * sz, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.3 * S * sz, 0.9 * S * sz); p.armR.position.set(0.75 * S * sz, 2.0 * S * sz, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.32 * S * sz, 1.0 * S * sz); p.legL.position.set(-0.35 * S * sz, 0.8 * S * sz, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.32 * S * sz, 1.0 * S * sz); p.legR.position.set(0.35 * S * sz, 0.8 * S * sz, 0); g.add(p.legR);
    if(shape === 'imp' || shape === 'demon') {
      p.wingL = mkSprite(legC, 0.8 * S * sz, 0.6 * S * sz, 'tri'); p.wingL.position.set(-0.6 * S * sz, 2.0 * S * sz, -0.2 * S); g.add(p.wingL);
      p.wingR = mkSprite(legC, 0.8 * S * sz, 0.6 * S * sz, 'tri'); p.wingR.position.set(0.6 * S * sz, 2.0 * S * sz, -0.2 * S); g.add(p.wingR);
      p.tail = mkSprite(SK, 0.15 * S * sz, 1.0 * S * sz); p.tail.position.set(0, 1.4 * S * sz, -0.4 * S); p.tail.rotation.z = 0.7; g.add(p.tail);
    }
    p.eyeL = mkSprite(0xff0000, 0.15 * S * sz, 0.15 * S * sz, 'circle'); p.eyeL.position.set(-0.2 * S * sz, 2.45 * S * sz, 0.4 * S * sz); g.add(p.eyeL);
    p.eyeR = mkSprite(0xff0000, 0.15 * S * sz, 0.15 * S * sz, 'circle'); p.eyeR.position.set(0.2 * S * sz, 2.45 * S * sz, 0.4 * S * sz); g.add(p.eyeR);
  } else if (shape === 'kappa' || shape === 'tengu') {
    // Créatures japonaises
    p.torso = mkSprite(C, 0.9 * S, 1.0 * S, 'box'); p.torso.position.y = 1.7 * S; g.add(p.torso);
    if(shape === 'kappa') {
      p.shell = mkSprite(0x228844, 1.2 * S, 0.9 * S, 'circle'); p.shell.position.set(0, 1.3 * S, -0.3 * S); g.add(p.shell);
      p.bowl = mkSprite(0x4488ff, 0.5 * S, 0.15 * S, 'circle'); p.bowl.position.y = 1.9 * S; g.add(p.bowl);
    }
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.4 * S; g.add(p.head);
    if(shape === 'tengu') {
      p.beak = mkSprite(0xaa4422, 0.3 * S, 0.25 * S, 'tri'); p.beak.position.set(0, 2.3 * S, 0.35 * S); p.beak.rotation.z = Math.PI; g.add(p.beak);
      p.wingL = mkSprite(legC, 1.0 * S, 0.7 * S, 'tri'); p.wingL.position.set(-0.7 * S, 2.0 * S, -0.2 * S); g.add(p.wingL);
      p.wingR = mkSprite(legC, 1.0 * S, 0.7 * S, 'tri'); p.wingR.position.set(0.7 * S, 2.0 * S, -0.2 * S); g.add(p.wingR);
    }
    p.armL = mkSprite(C, 0.25 * S, 0.85 * S); p.armL.position.set(-0.7 * S, 1.9 * S, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.25 * S, 0.85 * S); p.armR.position.set(0.7 * S, 1.9 * S, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.28 * S, 0.9 * S); p.legL.position.set(-0.3 * S, 0.7 * S, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.28 * S, 0.9 * S); p.legR.position.set(0.3 * S, 0.7 * S, 0); g.add(p.legR);
    p.eyeL = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); p.eyeL.position.set(-0.15 * S, 2.45 * S, 0.35 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(eyeC, 0.12 * S, 0.12 * S, 'circle'); p.eyeR.position.set(0.15 * S, 2.45 * S, 0.35 * S); g.add(p.eyeR);
  } else if (shape === 'dragon' || shape === 'phoenix' || shape === 'cerberus' || shape === 'salamander') {
    // Créatures mythologiques grandes
    const isPhoenix = shape === 'phoenix';
    const isDragon = shape === 'dragon';
    const isCerberus = shape === 'cerberus';
    const sz = isDragon ? 1.8 : 1.2;
    p.body = mkSprite(C, 1.5 * S * sz, 1.0 * S * sz, 'box'); p.body.position.y = (isDragon ? 2.5 : (isPhoenix ? 2.0 : 1.5)) * S; g.add(p.body);
    if(isDragon) {
      p.neck = mkSprite(C, 0.7 * S * sz, 1.0 * S * sz); p.neck.position.set(0.8 * S * sz, 3.2 * S, 0); g.add(p.neck);
      p.head = mkSprite(SK, 1.0 * S * sz, 0.8 * S * sz, 'box'); p.head.position.set(1.3 * S * sz, 3.8 * S, 0); g.add(p.head);
      p.wingL = mkSprite(legC, 1.5 * S * sz, 1.2 * S * sz, 'tri'); p.wingL.position.set(-1.0 * S * sz, 2.8 * S, -0.3 * S); g.add(p.wingL);
      p.wingR = mkSprite(legC, 1.5 * S * sz, 1.2 * S * sz, 'tri'); p.wingR.position.set(1.0 * S * sz, 2.8 * S, -0.3 * S); g.add(p.wingR);
      p.tail = mkSprite(C, 0.4 * S * sz, 2.0 * S * sz); p.tail.position.set(-1.2 * S * sz, 1.8 * S, 0); p.tail.rotation.z = -0.6; g.add(p.tail);
    } else if(isPhoenix) {
      p.head = mkSprite(SK, 0.7 * S, 0.7 * S, 'circle'); p.head.position.y = 2.5 * S; g.add(p.head);
      p.beak = mkSprite(0xffaa00, 0.2 * S, 0.25 * S, 'tri'); p.beak.position.set(0, 2.4 * S, 0.4 * S); p.beak.rotation.z = Math.PI; g.add(p.beak);
      p.wingL = mkSprite(0xff4400, 1.2 * S, 0.9 * S, 'tri'); p.wingL.position.set(-0.9 * S, 2.2 * S, -0.2 * S); g.add(p.wingL);
      p.wingR = mkSprite(0xff4400, 1.2 * S, 0.9 * S, 'tri'); p.wingR.position.set(0.9 * S, 2.2 * S, -0.2 * S); g.add(p.wingR);
      p.tail = mkSprite(0xff8800, 0.5 * S, 1.5 * S); p.tail.position.set(0, 1.5 * S, -0.5 * S); g.add(p.tail);
      p.flames = mkSprite(0xffaa00, 1.5 * S, 1.5 * S, 'circle'); p.flames.position.y = 2.0 * S; p.flames.material.opacity = 0.4; p.flames.material.transparent = true; g.add(p.flames);
    } else if(isCerberus) {
      p.head1 = mkSprite(SK, 0.7 * S, 0.7 * S, 'circle'); p.head1.position.set(-0.6 * S, 2.0 * S, 0.3 * S); g.add(p.head1);
      p.head2 = mkSprite(SK, 0.7 * S, 0.7 * S, 'circle'); p.head2.position.set(0, 2.0 * S, 0.6 * S); g.add(p.head2);
      p.head3 = mkSprite(SK, 0.7 * S, 0.7 * S, 'circle'); p.head3.position.set(0.6 * S, 2.0 * S, 0.3 * S); g.add(p.head3);
      p.tail = mkSprite(SK, 0.2 * S, 1.0 * S); p.tail.position.set(0, 1.2 * S, -0.7 * S); p.tail.rotation.z = 0.8; g.add(p.tail);
    } else {
      p.head = mkSprite(SK, 0.7 * S, 0.6 * S, 'box'); p.head.position.set(0.9 * S, 1.2 * S, 0); g.add(p.head);
      p.tail = mkSprite(C, 0.2 * S, 1.2 * S); p.tail.position.set(-1.0 * S, 1.0 * S, 0); p.tail.rotation.z = -0.6; g.add(p.tail);
      if(shape === 'salamander') {
        p.flames = mkSprite(0xff4400, 1.2 * S, 1.0 * S, 'circle'); p.flames.position.y = 1.5 * S; p.flames.material.opacity = 0.5; p.flames.material.transparent = true; g.add(p.flames);
      }
    }
    const numLegs = (isDragon || isCerberus) ? 4 : 2;
    for(let i=0; i<numLegs; i++) {
      const leg = mkSprite(C, 0.35 * S * sz, 0.9 * S * sz);
      const x = (i<2 ? (isPhoenix ? -0.4 : 0.6) : (isPhoenix ? 0.4 : -0.6)) * S * sz;
      const z = (i%2===0 ? -0.4 : 0.4) * S * sz;
      leg.position.set(x, (isPhoenix ? 1.0 : (isDragon ? 1.2 : 0.7)) * S, z);
      g.add(leg);
      p['leg'+i] = leg;
    }
    p.eyeL = mkSprite(0xff8800, 0.15 * S, 0.15 * S, 'circle'); g.add(p.eyeL);
    p.eyeR = mkSprite(0xff8800, 0.15 * S, 0.15 * S, 'circle'); g.add(p.eyeR);
    if(isDragon) {
      p.eyeL.position.set(1.15 * S * sz, 3.85 * S, 0.45 * S);
      p.eyeR.position.set(1.45 * S * sz, 3.85 * S, 0.45 * S);
    } else if(isPhoenix) {
      p.eyeL.position.set(-0.2 * S, 2.55 * S, 0.4 * S);
      p.eyeR.position.set(0.2 * S, 2.55 * S, 0.4 * S);
    } else if(isCerberus) {
      p.eyeL.position.set(-0.1 * S, 2.05 * S, 0.7 * S);
      p.eyeR.position.set(0.1 * S, 2.05 * S, 0.7 * S);
    } else {
      p.eyeL.position.set(0.95 * S, 1.25 * S, 0.35 * S);
      p.eyeR.position.set(1.05 * S, 1.25 * S, 0.35 * S);
    }
  } else if (shape === 'griffin' || shape === 'harpy' || shape === 'gargoyle' || shape === 'succubus') {
    // Créatures ailées hybrides
    const isHarpy = shape === 'harpy' || shape === 'succubus';
    p.torso = mkSprite(C, 1.0 * S, 1.0 * S, 'box'); p.torso.position.y = (isHarpy ? 1.7 : 1.5) * S; g.add(p.torso);
    if(shape === 'griffin') {
      p.chest = mkSprite(0xddaa66, 1.1 * S, 0.9 * S, 'box'); p.chest.position.y = 1.8 * S; p.chest.position.z = 0.2 * S; g.add(p.chest);
      p.head = mkSprite(SK, 0.7 * S, 0.6 * S, 'box'); p.head.position.set(0.6 * S, 2.3 * S, 0); g.add(p.head);
      p.beak = mkSprite(0xffaa00, 0.25 * S, 0.3 * S, 'tri'); p.beak.position.set(0.75 * S, 2.2 * S, 0.15 * S); p.beak.rotation.z = Math.PI; g.add(p.beak);
      p.tail = mkSprite(C, 0.25 * S, 1.2 * S); p.tail.position.set(-0.7 * S, 1.2 * S, 0); p.tail.rotation.z = -0.5; g.add(p.tail);
    } else {
      p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = (isHarpy ? 2.4 : 2.3) * S; g.add(p.head);
      if(shape === 'succubus' || shape === 'gargoyle') {
        p.hornL = mkSprite(legC, 0.12 * S, 0.4 * S, 'tri'); p.hornL.position.set(-0.25 * S, 2.75 * S, 0); p.hornL.name = 'horns'; g.add(p.hornL);
        p.hornR = mkSprite(legC, 0.12 * S, 0.4 * S, 'tri'); p.hornR.position.set(0.25 * S, 2.75 * S, 0); p.hornR.name = 'horns'; g.add(p.hornR);
      }
      if(shape === 'succubus') {
        p.tail = mkSprite(SK, 0.12 * S, 0.9 * S); p.tail.position.set(0, 1.4 * S, -0.4 * S); p.tail.rotation.z = 0.7; g.add(p.tail);
      }
    }
    p.wingL = mkSprite(legC, 1.1 * S, 0.8 * S, 'tri'); p.wingL.position.set(-0.7 * S, (isHarpy ? 2.0 : 1.8) * S, -0.2 * S); g.add(p.wingL);
    p.wingR = mkSprite(legC, 1.1 * S, 0.8 * S, 'tri'); p.wingR.position.set(0.7 * S, (isHarpy ? 2.0 : 1.8) * S, -0.2 * S); g.add(p.wingR);
    if(isHarpy) {
      p.armL = mkSprite(C, 0.2 * S, 0.8 * S); p.armL.position.set(-0.6 * S, 1.9 * S, 0); g.add(p.armL);
      p.armR = mkSprite(C, 0.2 * S, 0.8 * S); p.armR.position.set(0.6 * S, 1.9 * S, 0); g.add(p.armR);
      p.legL = mkSprite(C, 0.25 * S, 0.9 * S); p.legL.position.set(-0.3 * S, 1.0 * S, 0); g.add(p.legL);
      p.legR = mkSprite(C, 0.25 * S, 0.9 * S); p.legR.position.set(0.3 * S, 1.0 * S, 0); g.add(p.legR);
    } else {
      p.legFL = mkSprite(C, 0.3 * S, 0.8 * S); p.legFL.position.set(0.2 * S, 1.0 * S, 0.3 * S); g.add(p.legFL);
      p.legFR = mkSprite(C, 0.3 * S, 0.8 * S); p.legFR.position.set(0.2 * S, 1.0 * S, -0.3 * S); g.add(p.legFR);
      p.legBL = mkSprite(C, 0.3 * S, 0.8 * S); p.legBL.position.set(-0.5 * S, 0.7 * S, 0.3 * S); g.add(p.legBL);
      p.legBR = mkSprite(C, 0.3 * S, 0.8 * S); p.legBR.position.set(-0.5 * S, 0.7 * S, -0.3 * S); g.add(p.legBR);
    }
    p.eyeL = mkSprite((shape === 'succubus' ? 0xff00ff : eyeC), 0.12 * S, 0.12 * S, 'circle'); g.add(p.eyeL);
    p.eyeR = mkSprite((shape === 'succubus' ? 0xff00ff : eyeC), 0.12 * S, 0.12 * S, 'circle'); g.add(p.eyeR);
    if(shape === 'griffin') {
      p.eyeL.position.set(0.55 * S, 2.35 * S, 0.35 * S);
      p.eyeR.position.set(0.75 * S, 2.35 * S, 0.35 * S);
    } else {
      p.eyeL.position.set(-0.15 * S, (isHarpy ? 2.45 : 2.35) * S, 0.35 * S);
      p.eyeR.position.set(0.15 * S, (isHarpy ? 2.45 : 2.35) * S, 0.35 * S);
    }
  } else if (shape === 'cactus') {
    // Cactus: plante avec bras
    p.body = mkSprite(C, 0.8 * S, 1.8 * S, 'box'); p.body.position.y = 1.5 * S; g.add(p.body);
    p.armL = mkSprite(C, 0.5 * S, 0.2 * S); p.armL.position.set(-0.65 * S, 1.8 * S, 0); p.armL.rotation.z = 0.5; g.add(p.armL);
    p.armR = mkSprite(C, 0.5 * S, 0.2 * S); p.armR.position.set(0.65 * S, 1.8 * S, 0); p.armR.rotation.z = -0.5; g.add(p.armR);
    p.eyeL = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); p.eyeL.position.set(-0.2 * S, 2.0 * S, 0.45 * S); g.add(p.eyeL);
    p.eyeR = mkSprite(eyeC, 0.1 * S, 0.1 * S, 'circle'); p.eyeR.position.set(0.2 * S, 2.0 * S, 0.45 * S); g.add(p.eyeR);
  } else if (shape === 'stone_golem' || shape === 'ice_golem' || shape === 'lava_golem' || shape === 'iron_golem' || shape === 'animated_armor') {
    // Golems et armures
    const sz = (shape === 'iron_golem' || shape === 'lava_golem') ? 1.4 : 1.2;
    p.torso = mkSprite(C, 1.1 * S * sz, 1.2 * S * sz, 'box'); p.torso.position.y = 2.0 * S * sz; g.add(p.torso);
    p.core = mkSprite(eyeC, 0.4 * S * sz, 0.4 * S * sz, 'diamond'); p.core.position.set(0, 2.0 * S * sz, 0.6 * S * sz); g.add(p.core);
    p.head = mkSprite(SK, 0.8 * S * sz, 0.8 * S * sz, 'box'); p.head.position.y = 2.8 * S * sz; g.add(p.head);
    if(shape === 'lava_golem') {
      p.glow = mkSprite(0xff4400, 1.8 * S * sz, 1.8 * S * sz, 'circle'); p.glow.position.y = 2.0 * S * sz; p.glow.material.opacity = 0.3; p.glow.material.transparent = true; g.add(p.glow);
    }
    p.armL = mkSprite(C, 0.35 * S * sz, 1.0 * S * sz, 'box'); p.armL.position.set(-0.8 * S * sz, 2.2 * S * sz, 0); g.add(p.armL);
    p.armR = mkSprite(C, 0.35 * S * sz, 1.0 * S * sz, 'box'); p.armR.position.set(0.8 * S * sz, 2.2 * S * sz, 0); g.add(p.armR);
    p.legL = mkSprite(C, 0.4 * S * sz, 1.1 * S * sz, 'box'); p.legL.position.set(-0.35 * S * sz, 0.9 * S * sz, 0); g.add(p.legL);
    p.legR = mkSprite(C, 0.4 * S * sz, 1.1 * S * sz, 'box'); p.legR.position.set(0.35 * S * sz, 0.9 * S * sz, 0); g.add(p.legR);
    p.eyeL = mkSprite((shape === 'lava_golem' ? 0xff4400 : eyeC), 0.15 * S * sz, 0.15 * S * sz, 'circle'); p.eyeL.position.set(-0.25 * S * sz, 2.85 * S * sz, 0.45 * S * sz); g.add(p.eyeL);
    p.eyeR = mkSprite((shape === 'lava_golem' ? 0xff4400 : eyeC), 0.15 * S * sz, 0.15 * S * sz, 'circle'); p.eyeR.position.set(0.25 * S * sz, 2.85 * S * sz, 0.45 * S * sz); g.add(p.eyeR);
  } else if (shape === 'shadow' || shape === 'leech' || shape === 'poltergeist' || shape === 'jailer_ghost') {
    // Créatures spectrales/ombres
    const opacity = (shape === 'shadow' || shape === 'poltergeist') ? 0.5 : 0.7;
    p.body = mkSprite(C, 0.9 * S, 1.3 * S); p.body.position.y = 1.5 * S; p.body.material.opacity = opacity; p.body.material.transparent = true; g.add(p.body);
    p.head = mkSprite(SK, 0.6 * S, 0.6 * S, 'circle'); p.head.position.y = 2.2 * S; p.head.material.opacity = opacity; p.head.material.transparent = true; g.add(p.head);
    if(shape === 'leech') {
      p.mouth = mkSprite(0xff0000, 0.4 * S, 0.4 * S, 'circle'); p.mouth.position.set(0, 1.5 * S, 0.5 * S); g.add(p.mouth);
    } else {
      p.armL = mkSprite(C,0.2 * S, 0.8 * S); p.armL.position.set(-0.65 * S, 1.7 * S, 0); p.armL.material.opacity = opacity; p.armL.material.transparent = true; g.add(p.armL);
      p.armR = mkSprite(C, 0.2 * S, 0.8 * S); p.armR.position.set(0.65 * S, 1.7 * S, 0); p.armR.material.opacity = opacity; p.armR.material.transparent = true; g.add(p.armR);
    }
    p.eyeL = mkSprite((shape === 'shadow' ? 0xff0000 : 0x00ffff), 0.15 * S, 0.15 * S, 'circle'); p.eyeL.position.set(-0.15 * S, 2.25 * S, 0.35 * S); g.add(p.eyeL);
    p.eyeR = mkSprite((shape === 'shadow' ? 0xff0000 : 0x00ffff), 0.15 * S, 0.15 * S, 'circle'); p.eyeR.position.set(0.15 * S, 2.25 * S, 0.35 * S); g.add(p.eyeR);
  } else { // Standard Humanoid / Beast
    const isBeast = shape === 'beast';
    const wScale = isConstruct ? 1.4 : (0.8 + Math.random() * 0.4);
    const hScale = isConstruct ? 1.2 : (0.8 + Math.random() * 0.4);
    const torsoShp = isConstruct ? 'box' : (isGhost ? 'tri' : 'box');

    p.torso = mkSprite(C, (isBeast ? 1.4 : 0.9) * S * wScale, (isBeast ? 0.7 : 1.0) * S * hScale, torsoShp);
    p.torso.position.y = (isBeast ? 1.1 : 1.5) * S;
    if (isGhost) p.torso.rotation.z = Math.PI;
    g.add(p.torso);

    const headShp = isSkeleton ? 'circle' : 'box';
    p.head = mkSprite(SK, 0.65 * S, 0.65 * S, headShp);
    p.head.position.y = (isBeast ? 1.6 : 2.25) * S;
    p.head.position.z = (isBeast ? 0.5 : 0.1) * S;
    g.add(p.head);

    p.eyeL = mkSprite(eyeC, 0.16 * S, 0.13 * S, 'circle');
    addAcc(p.head, p.eyeL, -0.13 * S, 0.07 * S, 0.05 * S);
    p.eyeR = mkSprite(eyeC, 0.16 * S, 0.13 * S, 'circle');
    addAcc(p.head, p.eyeR, 0.13 * S, 0.07 * S, 0.05 * S);

    // Accessories
    // Add horns only for shapes that logically should have them
    const shouldHaveHorns = shape === 'oni' || shape === 'demon' || shape === 'imp' || shape === 'ogre' || 
                            shape === 'minotaur' || shape === 'devil' || shape === 'succubus' || 
                            shape === 'gargoyle' || shape === 'dragon' || name.includes('Démon') || 
                            name.includes('Minotaure') || name.includes('Oni') || name.includes('Diable');
    if (shouldHaveHorns) {
      const h = mkSprite(0xdddddd, 0.15 * S, 0.5 * S, 'tri');
      addAcc(p.head, h, -0.2 * S, 0.4 * S, -0.01);
      const h2 = mkSprite(0xdddddd, 0.15 * S, 0.5 * S, 'tri');
      addAcc(p.head, h2, 0.2 * S, 0.4 * S, -0.01);
    }
    if (isConstruct || hasWeapon) {
      const sp = mkSprite(armorC, 0.4 * S, 0.1 * S);
      addAcc(p.torso, sp, -0.5 * S, 0.4 * S, 0.05);
      const sp2 = mkSprite(armorC, 0.4 * S, 0.1 * S);
      addAcc(p.torso, sp2, 0.5 * S, 0.4 * S, 0.05);
    }
    if (hasHood) {
      const hood = mkSprite(C, 0.85 * S, 0.85 * S, 'circle');
      addAcc(p.head, hood, 0, 0, -0.05);
    }
    if (hasEars && !hasHood) {
      const earL = mkSprite(SK, 0.15 * S, 0.4 * S, 'tri');
      earL.rotation.z = 0.5;
      addAcc(p.head, earL, -0.35 * S, 0.2 * S, -0.02);
      const earR = mkSprite(SK, 0.15 * S, 0.4 * S, 'tri');
      earR.rotation.z = -0.5;
      addAcc(p.head, earR, 0.35 * S, 0.2 * S, -0.02);
    }
    if (hasBeak) {
      const beak = mkSprite(0xffff00, 0.15 * S, 0.2 * S, 'tri');
      beak.rotation.z = Math.PI;
      addAcc(p.head, beak, 0, -0.1 * S, 0.1);
    }
    if (isRoyal) {
      const crown = mkSprite(0xffd700, 0.5 * S, 0.3 * S, 'tri');
      addAcc(p.head, crown, 0, 0.4 * S, 0.05);
    }
    if (name.includes('Vampire') || name.includes('Roi') || name.includes('Seigneur') || name.includes('Chevalier') || name.includes('Héros')) {
      const cape = mkSprite(0x330000, 1.2 * S, 1.6 * S);
      cape.position.set(0, 0.8 * S, 0.2 * S);
      g.add(cape);
      p.cape = cape;
    }
    if (name.includes('Shaman') || name.includes('Masque') || name.includes('Voleur') || name.includes('Assassin')) {
      const m = mkSprite(0x333333, 0.5 * S, 0.3 * S, 'box');
      addAcc(p.head, m, 0, -0.15 * S, 0.15);
    }
    if (name.includes('Barbe') || name.includes('Nain') || name.includes('Viking')) {
      const beard = mkSprite(C, 0.4 * S, 0.3 * S, 'tri');
      beard.rotation.z = Math.PI;
      addAcc(p.head, beard, 0, -0.3 * S, 0.1);
    }
    if (isArcher) {
      const quiver = mkSprite(0x5a3310, 0.4 * S, 0.7 * S);
      quiver.position.set(0.3 * S, 0.2 * S, -0.1 * S);
      p.torso.add(quiver);
    }
    if (name.includes('Ange') || name.includes('Paladin') || name.includes('Saint')) {
      const halo = mkSprite(0xffff00, 0.5 * S, 0.1 * S);
      halo.position.set(0, 0.5 * S, 0);
      p.head.add(halo);
    }
    if (name.includes('Spectre') || name.includes('Bourreau') || name.includes('Esclave')) {
      const chain = mkSprite(0x888888, 0.8 * S, 0.2 * S);
      addAcc(p.torso, chain, 0, -0.1 * S, 0.1);
    }
    if (name.includes('Faucheuse')) {
      const scythe = mkSprite(0x888888, 0.1 * S, 1.5 * S);
      scythe.position.set(0.5 * S, 0.5 * S, -0.2 * S);
      scythe.rotation.z = 0.5;
      p.torso.add(scythe);
      const blade = mkSprite(0xaaaaaa, 0.8 * S, 0.8 * S, 'tri');
      blade.position.set(0, 0.6 * S, 0);
      blade.rotation.z = 2.0;
      scythe.add(blade);
    }

    if (hasWings) {
      p.wingL = mkSprite(legC, 1.2 * S, 0.8 * S, 'tri');
      p.wingL.position.set(-0.6 * S, 0.5 * S, -0.1);
      p.torso.add(p.wingL);
      p.wingR = mkSprite(legC, 1.2 * S, 0.8 * S, 'tri');
      p.wingR.position.set(0.6 * S, 0.5 * S, -0.1);
      p.torso.add(p.wingR);
    }
    if (hasTail) {
      const tail = mkSprite(C, 0.2 * S, 1.2 * S);
      tail.rotation.z = -0.5;
      addAcc(p.torso, tail, 0, -0.5 * S, -0.2);
    }

    // Limbs
    const armL = 1.0 + Math.random() * 0.4;
    p.armLU = mkSprite(C, 0.32 * S, 0.55 * S * armL);
    p.armLU.position.set(-0.65 * S, 1.72 * S, 0);
    g.add(p.armLU);
    p.armRU = mkSprite(C, 0.32 * S, 0.55 * S * armL);
    p.armRU.position.set(0.65 * S, 1.72 * S, 0);
    g.add(p.armRU);
    p.armLD = mkSprite(SK, 0.26 * S, 0.45 * S * armL);
    p.armLD.position.set(-0.68 * S, 1.15 * S, 0);
    g.add(p.armLD);
    p.armRD = mkSprite(SK, 0.26 * S, 0.45 * S * armL);
    p.armRD.position.set(0.68 * S, 1.15 * S, 0);
    g.add(p.armRD);

    if (!isGhost && !hasStaff) {
      p.legLU = mkSprite(legC, 0.34 * S, 0.55 * S);
      p.legLU.position.set(-0.26 * S, 0.90 * S, 0);
      g.add(p.legLU);
      p.legRU = mkSprite(legC, 0.34 * S, 0.55 * S);
      p.legRU.position.set(0.26 * S, 0.90 * S, 0);
      g.add(p.legRU);
      p.legLD = mkSprite(0x222222, 0.30 * S, 0.45 * S);
      p.legLD.position.set(-0.27 * S, 0.36 * S, 0);
      g.add(p.legLD);
      p.legRD = mkSprite(0x222222, 0.30 * S, 0.45 * S);
      p.legRD.position.set(0.27 * S, 0.36 * S, 0);
      g.add(p.legRD);
    } else if (hasStaff) {
      const robe = mkSprite(legC, 0.8 * S, 1.1 * S);
      robe.position.set(0, 0.6 * S, 0);
      g.add(robe);
      p.robe = robe;
    }

    if (isBeast) {
      p.armLU.position.set(-0.5 * S, 0.5 * S, 0.3 * S);
      p.armRU.position.set(0.5 * S, 0.5 * S, 0.3 * S);
      p.armLD.visible = false;
      p.armRD.visible = false;
      p.legLU.position.set(-0.6 * S, 0.5 * S, -0.3 * S);
      p.legRU.position.set(0.6 * S, 0.5 * S, -0.3 * S);
      p.legLD.visible = false;
      p.legRD.visible = false;
    }

    // Held Items
    // If weapon type is specified, use detailed weapon builder
    if (T.wep && p.armRD) {
      buildSpriteWeapon(T.wep, p.armRD, S);
      // Add shield for knight-like classes
      if (name.includes('Chevalier') || name.includes('Knight') || name.includes('Paladin') || name.includes('Gardien') || name.includes('Tortue')) {
        const shield = mkSprite(armorC, 0.6 * S, 0.7 * S, 'box');
        addAcc(p.armLD, shield, 0, -0.2 * S, 0.15);
        p.shield = shield;
      }
    }
    // Legacy weapon system for named monsters without weapon type
    else if (hasWeapon) {
      if (name.includes('Orc') || name.includes('Barbare') || name.includes('Bourreau')) {
        const handle = mkSprite(0x5a3310, 0.1 * S, 1.0 * S);
        addAcc(p.armRD, handle, 0, -0.4 * S, 0.1);
        p.weapon = handle;
        const head = mkSprite(0xaaaaaa, 0.5 * S, 0.4 * S, 'tri');
        head.rotation.z = Math.PI / 2;
        addAcc(p.armRD, head, 0.1 * S, -0.8 * S, 0.11);
        p.weapon2 = head;
      } else if (name.includes('Marteau') || name.includes('Paladin')) {
        const handle = mkSprite(0x5a3310, 0.1 * S, 1.0 * S);
        addAcc(p.armRD, handle, 0, -0.4 * S, 0.1);
        p.weapon = handle;
        const head = mkSprite(0x888888, 0.4 * S, 0.3 * S, 'box');
        addAcc(p.armRD, head, 0, -0.8 * S, 0.11);
        p.weapon2 = head;
      } else {
        const w = mkSprite(0xeeeeee, 0.1 * S, 1.0 * S);
        addAcc(p.armRD, w, 0, -0.4 * S, 0.1);
        p.weapon = w;
        const g = mkSprite(0x664422, 0.3 * S, 0.1 * S);
        addAcc(p.armRD, g, 0, -0.1 * S, 0.11);
      }
      if (name.includes('Chevalier') || name.includes('Gardien') || name.includes('Tortue')) {
        const shield = mkSprite(armorC, 0.6 * S, 0.7 * S, 'box');
        addAcc(p.armLD, shield, 0, -0.2 * S, 0.15);
        p.shield = shield;
      }
    }
    else if (hasStaff) {
      const st = mkSprite(0x553311, 0.1 * S, 1.2 * S);
      addAcc(p.armRD, st, 0, -0.3 * S, 0.1);
      p.weapon = st;
      const gem = mkSprite(eyeC, 0.3 * S, 0.3 * S, 'diamond');
      addAcc(p.armRD, gem, 0, 0.4 * S, 0.11);
      p.weapon2 = gem;
    }
    else if (isArcher) {
      const bow = mkSprite(0x5a3310, 0.1 * S, 1.2 * S);
      addAcc(p.armLD, bow, 0, -0.3 * S, 0.1);
      p.weapon = bow;
    }
  }
  return { g, p };
}

// ==================== ANIMATION ====================
function animPuppet(p, t, moving, S = 1, shape = 'human') {
  const freq = 3.5, amp = moving ? 0.18 : 0.04, bob = moving ? Math.sin(t * freq * 2) * 0.04 : 0;
  const w1 = Math.sin(t * freq), w2 = -w1;

  if (shape === 'blob') {
    const sq = Math.sin(t * 4) * 0.1;
    const h = 1.2 * S * (1 - sq);
    p.torso.scale.set(1.4 * S * (1 + sq), h, 1);
    p.torso.position.y = h / 2;
    p.core.position.y = h / 2 + Math.sin(t * 2) * 0.1 * S;
  } else if (shape === 'flyer') {
    const fl = Math.sin(t * 12);
    p.torso.position.y = 2.5 * S + Math.sin(t * 3) * 0.3 * S;
    p.head.position.y = 2.9 * S + Math.sin(t * 3) * 0.3 * S;
    p.eyeL.position.y = 2.95 * S + Math.sin(t * 3) * 0.3 * S;
    p.eyeR.position.y = 2.95 * S + Math.sin(t * 3) * 0.3 * S;
    p.wingL.position.y = 2.7 * S + Math.sin(t * 3) * 0.3 * S;
    p.wingR.position.y = 2.7 * S + Math.sin(t * 3) * 0.3 * S;
    p.wingL.scale.x = 1.2 * S * (1 + fl * 0.3);
    p.wingR.scale.x = 1.2 * S * (1 + fl * 0.3);
  } else if (shape === 'spider') {
    p.torso.position.y = 0.9 * S + bob;
    p.head.position.y = 1.2 * S + bob;
    for (let i = 0; i < 4; i++) {
      const off = (i % 2 === 0) ? w1 : w2;
      if (p['legL' + i]) p['legL' + i].position.y = 0.7 * S + off * amp;
      if (p['legR' + i]) p['legR' + i].position.y = 0.7 * S - off * amp;
    }
  } else if (shape === 'worm') {
    const spd = 6;
    p.head.position.y = 0.8 * S + Math.sin(t * spd) * 0.1 * S;
    p.head.rotation.z = Math.sin(t * spd) * 0.1;
    for (let i = 0; i < 5; i++) {
      if (p['seg' + i]) {
        p['seg' + i].position.x = Math.sin(t * spd - i * 0.8) * 0.2 * S;
        p['seg' + i].position.y = 0.8 * S + Math.sin(t * spd - i * 0.8) * 0.1 * S;
      }
    }
  } else if (shape === 'elemental') {
    p.core.position.y = 1.8 * S + Math.sin(t * 2) * 0.2 * S;
    p.core.rotation.z = Math.sin(t) * 0.1;
    for (let i = 0; i < 4; i++) {
      if (p['bit' + i]) {
        const a = t * 2 + i * (Math.PI / 2);
        const r = 0.8 * S + Math.sin(t * 3 + i) * 0.1 * S;
        p['bit' + i].position.set(Math.cos(a) * r, 1.8 * S + Math.sin(a) * 0.5 * r, Math.sin(a) * r);
        p['bit' + i].rotation.z = a;
      }
    }
  } else if (shape === 'hydra') {
    p.torso.position.y = 0.8 * S + bob;
    p.tail.rotation.z = 0.5 + Math.sin(t * 3) * 0.2;
    for (let i = 0; i < 3; i++) {
      if (p['neck' + i]) {
        p['neck' + i].position.y = 1.2 * S + bob;
        p['neck' + i].rotation.z = (i - 1) * 0.3 + Math.sin(t * 2 + i) * 0.15;
      }
    }
  } else if (shape === 'eye') {
    p.torso.position.y = 2.5 * S + Math.sin(t) * 0.3 * S;
    p.pupil.position.x = Math.sin(t * 1.3) * 0.15 * S;
    p.pupil.position.y = Math.cos(t * 0.7) * 0.15 * S;
    for (let i = 0; i < 5; i++) {
      if (p['tent' + i]) {
        const a = i * (Math.PI * 2 / 5) + t;
        p['tent' + i].position.set(Math.cos(a) * 0.6 * S, Math.sin(a) * 0.2 * S - 0.5 * S, -0.1);
        p['tent' + i].rotation.z = a + Math.PI / 2;
      }
    }
  } else if (shape === 'plant') {
    p.stalk.rotation.z = Math.sin(t) * 0.2;
    p.head.position.x = Math.sin(t) * 0.3 * S;
    p.head.rotation.z = Math.sin(t) * 0.1;
  } else if (shape === 'titan') {
    p.torso.position.y = 4.2 * S + bob;
    p.head.position.y = 5.6 * S + bob;
    p.brain.position.y = 5.7 * S + bob;
    p.eyeL.position.y = 5.6 * S + bob;
    p.eyeR.position.y = 5.6 * S + bob;
    p.heart.position.y = 4.6 * S + bob;
    p.lungs.position.y = 4.6 * S + bob;
    p.stomach.position.y = 4.0 * S + bob;
    p.intestines.position.y = 3.6 * S + bob;
    p.pelvis.position.y = 3.0 * S + bob;
    p.legLU.position.y = 2.2 * S + w1 * amp;
    p.legRU.position.y = 2.2 * S + w2 * amp;
    p.legLD.position.y = 1.0 * S + w1 * amp * 0.8;
    p.legRD.position.y = 1.0 * S + w2 * amp * 0.8;
    p.footL.position.y = 0.2 * S + w1 * amp * 0.8;
    p.footR.position.y = 0.2 * S + w2 * amp * 0.8;
    p.armLU.position.y = 4.8 * S + w2 * amp;
    p.armRU.position.y = 4.8 * S + w1 * amp;
    p.armLD.position.y = 3.8 * S + w2 * amp * 0.8;
    p.armRD.position.y = 3.8 * S + w1 * amp * 0.8;
    p.handL.position.y = 3.1 * S + w2 * amp * 0.8;
    p.handR.position.y = 3.1 * S + w1 * amp * 0.8;
  } else if (shape === 'naga') {
    p.torso.position.y = 1.6 * S + bob;
    p.head.position.y = 2.35 * S + bob;
    p.armLU.position.y = 1.8 * S + bob + w2 * amp;
    p.armRU.position.y = 1.8 * S + bob + w1 * amp;
    for(let i=0; i<6; i++){
       if(p['tail'+i]){
          p['tail'+i].position.x = Math.sin(t*3 + i*0.5) * 0.2 * S * (moving?1:0.2);
          p['tail'+i].position.y = (1.1 - i*0.15)*S + bob;
       }
    }
  } else if (shape === 'centaur') {
    p.horse.position.y = 1.0 * S + bob;
    p.torso.position.y = 1.7 * S + bob;
    p.head.position.y = 2.4 * S + bob;
    p.armLU.position.y = 1.9 * S + bob + w2 * amp;
    p.armRU.position.y = 1.9 * S + bob + w1 * amp;
    for(let i=0; i<4; i++){
       if(p['leg'+i]){
          const off = (i%2===0) ? w1 : w2;
          p['leg'+i].position.y = 0.5 * S + off * amp;
          p['leg'+i].rotation.z = off * 0.2;
       }
    }
  } else if (shape === 'mech') {
    p.torso.position.y = 2.0 * S + bob;
    p.head.position.y = 2.8 * S + bob;
    p.legL.position.y = 0.8 * S + w1 * amp;
    p.legR.position.y = 0.8 * S + w2 * amp;
    p.armL.rotation.x = Math.sin(t * freq) * 0.5;
    p.armR.rotation.x = Math.sin(t * freq + Math.PI) * 0.5;
  } else if (shape === 'insectoid') {
    p.thorax.position.y = 1.0 * S + bob;
    p.head.position.y = 1.5 * S + bob;
    p.abdomen.position.y = 0.8 * S + bob;
    p.abdomen.rotation.x = 0.5 + Math.sin(t * 2) * 0.1;
    for(let i=0; i<6; i++) {
      if(p['leg'+i]) {
        const off = (i%2===0 ? w1 : w2) * ((Math.floor(i/2)%2===0)?1:-1);
        p['leg'+i].rotation.z = (i%2===0 ? -0.5 : 0.5) + off * 0.2;
      }
    }
  } else if (shape === 'dino') {
    p.torso.position.y = 1.5 * S + bob;
    p.head.position.y = 2.1 * S + bob;
    p.jaw.position.y = 1.8 * S + bob + Math.sin(t*5)*0.05*S;
    p.tail.rotation.z = Math.sin(t*3)*0.2;
    p.legL.position.y = 0.7 * S + w1 * amp;
    p.legR.position.y = 0.7 * S + w2 * amp;
  } else if (shape === 'fish') {
    p.torso.position.y = 1.5 * S + Math.sin(t*2)*0.2*S;
    p.head.position.y = 1.5 * S + Math.sin(t*2)*0.2*S;
    p.tail.position.y = 1.5 * S + Math.sin(t*2)*0.2*S;
    p.tail.rotation.y = Math.sin(t*8)*0.5;
    p.finL.rotation.z = Math.sin(t*4)*0.3;
    p.finR.rotation.z = -Math.sin(t*4)*0.3;
  } else if (shape === 'wheel') {
    p.wheel.rotation.z = -t * 5;
    p.torso.position.y = 1.4 * S + bob;
    p.head.position.y = 2.0 * S + bob;
    p.armL.rotation.x = Math.sin(t * 3) * 0.5;
    p.armR.rotation.x = -Math.sin(t * 3) * 0.5;
  } else if (shape === 'floating_skull') {
    p.head.position.y = 2.0 * S + Math.sin(t * 2) * 0.2 * S;
    p.jaw.position.y = 1.4 * S + Math.sin(t * 2) * 0.2 * S + Math.sin(t * 5) * 0.05 * S;
    p.handL.position.y = 1.5 * S + Math.sin(t * 2 + 1) * 0.3 * S;
    p.handR.position.y = 1.5 * S + Math.sin(t * 2 + 2) * 0.3 * S;
    p.handL.position.x = -1.2 * S + Math.sin(t * 1.5) * 0.2 * S;
    p.handR.position.x = 1.2 * S - Math.sin(t * 1.5) * 0.2 * S;
  } else if (shape === 'serpent') {
    p.head.position.y = 1.0 * S + Math.sin(t*3)*0.1*S;
    p.head.rotation.y = Math.sin(t*2)*0.3;
    for(let i=0; i<8; i++){
      if(p['seg'+i]){
        p['seg'+i].position.x = Math.sin(t*3 - i*0.5) * 0.3 * S;
        p['seg'+i].position.y = 0.7 * S + Math.sin(t*5 - i)*0.05*S;
      }
    }
  } else if (shape === 'construct') {
    p.core.position.y = 2.0 * S + Math.sin(t)*0.2*S;
    p.core.rotation.y = t;
    p.core.rotation.z = Math.sin(t*0.5)*0.2;
    for(let i=0; i<4; i++){
      if(p['bit'+i]){
        const a = t*2 + i*(Math.PI/2);
        const r = 1.2 * S + Math.sin(t*3+i)*0.2*S;
        p['bit'+i].position.set(Math.cos(a)*r, 2.0*S + Math.sin(a)*0.5*S, Math.sin(a)*r);
        p['bit'+i].rotation.z = a;
        p['bit'+i].rotation.x = t*3;
      }
    }
  } else if (shape === 'book') {
    p.spine.position.y = 2.0 * S + bob;
    const flap = Math.sin(t * 10) * 0.5 + 0.5;
    p.coverL.rotation.y = -flap; p.coverL.position.y = 2.0 * S + bob;
    p.coverR.rotation.y = flap; p.coverR.position.y = 2.0 * S + bob;
    p.pageL.rotation.y = -flap * 0.8; p.pageL.position.y = 2.0 * S + bob;
    p.pageR.rotation.y = flap * 0.8; p.pageR.position.y = 2.0 * S + bob;
  } else if (shape === 'cloud') {
    p.core.position.y = 2.0 * S + bob;
    for(let i=0; i<5; i++) {
      if(p['puff'+i]) {
        p['puff'+i].position.x += Math.sin(t*2 + i)*0.005*S;
        p['puff'+i].position.y = 2.0*S + (Math.random()-0.5)*0.8*S + bob + Math.sin(t*3+i)*0.1*S;
      }
    }
  } else if (shape === 'ghost') {
    const float = Math.sin(t * 3) * 0.2 * S;
    p.head.position.y = 2.2 * S + float;
    p.body.position.y = 1.5 * S + float;
    p.body.scale.x = 0.8 * S * (1 + Math.sin(t * 5) * 0.1);
    p.armL.position.y = 1.8 * S + float; p.armR.position.y = 1.8 * S + float;
    p.armL.rotation.z = 0.5 + Math.sin(t * 4) * 0.2;
    p.armR.rotation.z = -0.5 - Math.sin(t * 4) * 0.2;
  } else if (shape === 'slime_cube') {
    const sq = Math.sin(t * 4) * 0.1;
    const h = 1.2 * S * (1 - sq);
    p.torso.scale.set(1.2 * S * (1 + sq), h, 1);
    p.torso.position.y = h / 2;
    p.core.rotation.z = t;
  } else if (shape === 'crystal_golem') {
    p.torso.position.y = 1.8 * S + bob;
    p.head.position.y = 2.8 * S + bob + Math.sin(t * 2) * 0.05 * S;
    p.armL.position.y = 2.0 * S + bob + Math.sin(t * 3) * 0.1 * S;
    p.armR.position.y = 2.0 * S + bob + Math.cos(t * 3) * 0.1 * S;
    p.legL.position.y = 0.8 * S + w1 * amp;
    p.legR.position.y = 0.8 * S + w2 * amp;
  } else if (shape === 'bat') {
    p.torso.position.y = 2.0 * S + Math.sin(t * 5) * 0.2 * S;
    p.head.position.y = 2.3 * S + Math.sin(t * 5) * 0.2 * S;
    p.wingL.scale.x = 1.0 * S * (1 + Math.sin(t * 15) * 0.5);
    p.wingR.scale.x = 1.0 * S * (1 + Math.sin(t * 15) * 0.5);
  } else if (shape === 'mushroom') {
    const sq = Math.sin(t * 5) * 0.1;
    p.stalk.scale.y = 1.0 * S * (1 - sq);
    p.cap.position.y = 1.2 * S - sq * 0.5 * S;
    p.cap.scale.x = 1.4 * S * (1 + sq * 0.5);
  } else if (shape === 'mimic') {
    const open = Math.sin(t * 5) * 0.5 + 0.5;
    p.lid.rotation.x = -open * 1.0;
    p.lid.position.y = 0.8 * S + open * 0.2 * S;
  } else if (shape === 'scorpion') {
    p.torso.position.y = 0.8 * S + bob;
    p.head.position.y = 0.9 * S + bob;
    p.clawL.position.z = 0.6 * S + Math.sin(t*5)*0.2*S;
    p.clawR.position.z = 0.6 * S + Math.cos(t*5)*0.2*S;
    for(let i=0; i<5; i++){
        if(p['tail'+i]){
            p['tail'+i].position.y = 0.8*S + i*0.2*S + bob + Math.sin(t*2 + i)*0.1*S;
            p['tail'+i].position.z = -0.5*S - i*0.1*S + Math.cos(t*2 + i)*0.1*S;
        }
    }
    if(p.stinger) {
        p.stinger.position.y = 1.8*S + bob + Math.sin(t*2 + 5)*0.2*S;
        p.stinger.position.z = -1.0*S + Math.cos(t*2 + 5)*0.2*S + 1.0*S;
    }
    for(let i=0; i<3; i++){
        const off = (i%2===0)?w1:w2;
        if(p['legL'+i]) p['legL'+i].rotation.z = 0.5 + off*0.2;
        if(p['legR'+i]) p['legR'+i].rotation.z = -0.5 - off*0.2;
    }
  } else if (shape === 'djinn') {
    p.torso.position.y = 2.0 * S + Math.sin(t*2)*0.2*S;
    p.head.position.y = 2.8 * S + Math.sin(t*2)*0.2*S;
    p.armL.position.y = 2.2 * S + Math.sin(t*2)*0.2*S + Math.sin(t*3)*0.1*S;
    p.armR.position.y = 2.2 * S + Math.sin(t*2)*0.2*S + Math.cos(t*3)*0.1*S;
    for(let i=0; i<4; i++){
        if(p['tail'+i]) p['tail'+i].position.x = Math.sin(t*3 + i)*0.1*S;
    }
  } else if (shape === 'treant') {
    p.torso.position.y = 1.8 * S + bob;
    p.head.position.y = 2.8 * S + bob;
    p.face.position.y = 2.4 * S + bob;
    p.armL.rotation.z = Math.sin(t*2)*0.2;
    p.armR.rotation.z = -Math.sin(t*2)*0.2;
    p.legL.position.y = 0.8 * S + w1 * amp;
    p.legR.position.y = 0.8 * S + w2 * amp;
  } else if (shape === 'pixie') {
    p.torso.position.y = 2.0 * S + Math.sin(t*5)*0.2*S;
    p.head.position.y = 2.5 * S + Math.sin(t*5)*0.2*S;
    p.wingL.position.y = 2.2 * S + Math.sin(t*5)*0.2*S;
    p.wingR.position.y = 2.2 * S + Math.sin(t*5)*0.2*S;
    p.wingL.scale.x = 1.5 * S * (1 + Math.sin(t*20)*0.5);
    p.wingR.scale.x = 1.5 * S * (1 + Math.sin(t*20)*0.5);
  } else if (shape === 'gear') {
    p.core.rotation.z = t * 2;
    p.core.position.y = 1.5 * S + bob;
    p.legL.position.y = 0.8 * S + w1 * amp;
    p.legR.position.y = 0.8 * S + w2 * amp;
  } else if (shape === 'shade') {
    p.torso.position.y = 1.5 * S + Math.sin(t*2)*0.2*S;
    p.head.position.y = 2.2 * S + Math.sin(t*2)*0.2*S;
    p.armL.rotation.z = Math.sin(t*3)*0.5;
    p.armR.rotation.z = -Math.sin(t*3)*0.5;
  } else if (shape === 'doll') {
    p.torso.position.y = 1.5 * S + bob;
    p.head.position.y = 2.3 * S + bob;
    p.armL.rotation.z = Math.sin(t*3)*0.5;
    p.armR.rotation.z = -Math.sin(t*3)*0.5;
    p.legL.position.y = 0.6 * S + w1 * amp;
    p.legR.position.y = 0.6 * S + w2 * amp;
    if(p.key) p.key.rotation.z = t * 2;
  } else if (shape === 'utensil') {
    p.handle.position.y = 1.0 * S + bob;
    p.head.position.y = 2.2 * S + bob;
    p.handle.rotation.z = Math.sin(t*5)*0.1;
    p.head.rotation.z = Math.sin(t*5)*0.1;
    p.handL.position.y = 1.5 * S + Math.sin(t*3)*0.2*S;
    p.handR.position.y = 1.5 * S + Math.cos(t*3)*0.2*S;
  } else if (shape === 'note') {
    p.head.position.y = 0.5 * S + Math.abs(Math.sin(t*4))*0.5*S;
    p.stem.position.y = 1.2 * S + Math.abs(Math.sin(t*4))*0.5*S;
    p.flag.position.y = 1.8 * S + Math.abs(Math.sin(t*4))*0.5*S;
  } else if (shape === 'windmill') {
    // Moulin: base + 4 pales rotatives
    p.base.position.y = 1.5 * S + bob;
    p.blades.rotation.z = t * 2;
    p.blades.position.y = 1.5 * S + bob;
  } else if (shape === 'scarecrow') {
    // Épouvantail: poteau + corps en forme de croix
    p.post.position.y = 1.0 * S + bob;
    p.torso.position.y = 1.5 * S + bob;
    p.head.position.y = 2.2 * S + bob;
    p.armL.rotation.z = 0.8 + Math.sin(t*2)*0.2;
    p.armR.rotation.z = -0.8 - Math.sin(t*2)*0.2;
  } else if (shape === 'sack') {
    // Sac: forme de blob irrégulier
    const sq = Math.sin(t * 4) * 0.1;
    p.body.scale.set(1.3 * S * (1 + sq), 1.5 * S * (1 - sq), 1);
    p.body.position.y = 0.8 * S;
  } else if (shape === 'scythe') {
    // Faux volante: manche + lame
    p.handle.position.y = 1.5 * S + bob;
    p.handle.rotation.z = t * 3;
    p.blade.position.y = 2.2 * S + bob;
    p.blade.rotation.z = t * 3;
  } else if (shape === 'plow') {
    // Charrue: forme mécanique avec lames
    p.body.position.y = 1.0 * S + bob;
    p.blade1.rotation.z = Math.sin(t*2)*0.2;
    p.blade2.rotation.z = -Math.sin(t*2)*0.2;
  } else if (shape === 'troll') {
    // Troll: grand humanoïde bossu
    p.torso.position.y = 1.4 * S + bob;
    p.hump.position.y = 2.0 * S + bob;
    p.head.position.y = 1.8 * S + bob;
    p.armL.position.y = 1.5 * S + bob + w2 * amp;
    p.armR.position.y = 1.5 * S + bob + w1 * amp;
    p.legL.position.y = 0.6 * S + w1 * amp;
    p.legR.position.y = 0.6 * S + w2 * amp;
  } else if (shape === 'werewolf') {
    // Loup-garou: comme werewolf_beast mais debout
    p.torso.position.y = 1.6 * S + bob;
    p.head.position.y = 2.4 * S + bob;
    p.snout.position.y = 2.35 * S + bob;
    p.armL.position.y = 1.8 * S + bob + w2 * amp;
    p.armR.position.y = 1.8 * S + bob + w1 * amp;
    p.legL.position.y = 0.7 * S + w1 * amp;
    p.legR.position.y = 0.7 * S + w2 * amp;
    if(p.tail) p.tail.rotation.z = Math.sin(t*3)*0.3;
  } else if (shape === 'monkey') {
    // Singe: petit avec longs bras
    p.torso.position.y = 1.2 * S + bob;
    p.head.position.y = 1.7 * S + bob;
    p.armL.position.y = 1.3 * S + bob + Math.sin(t*5)*0.3*S;
    p.armR.position.y = 1.3 * S + bob + Math.cos(t*5)*0.3*S;
    p.legL.position.y = 0.5 * S + w1 * amp;
    p.legR.position.y = 0.5 * S + w2 * amp;
    if(p.tail) {
      p.tail.position.y = 0.9 * S + bob;
      p.tail.rotation.z = Math.sin(t*3)*0.5;
    }
  } else if (shape === 'gorilla') {
    // Gorille: large avec bras au sol
    p.torso.position.y = 1.3 * S + bob;
    p.head.position.y = 1.9 * S + bob;
    p.armL.position.y = 0.8 * S + bob + w2 * amp * 0.5;
    p.armR.position.y = 0.8 * S + bob + w1 * amp * 0.5;
    p.legL.position.y = 0.7 * S + w1 * amp;
    p.legR.position.y = 0.7 * S + w2 * amp;
  } else if (shape === 'frog') {
    // Grenouille: corps rond, pas de cou
    p.body.position.y = 0.7 * S + bob + Math.abs(Math.sin(t*3))*0.3*S;
    p.head.position.y = 0.7 * S + bob + Math.abs(Math.sin(t*3))*0.3*S;
    p.legL.position.y = 0.3 * S + Math.abs(Math.sin(t*3))*0.2*S;
    p.legR.position.y = 0.3 * S + Math.abs(Math.sin(t*3))*0.2*S;
    p.eyeL.position.y = 1.0 * S + bob + Math.abs(Math.sin(t*3))*0.3*S;
    p.eyeR.position.y = 1.0 * S + bob + Math.abs(Math.sin(t*3))*0.3*S;
  } else if (shape === 'toad') {
    // Crapaud: comme frog mais plus large
    p.body.position.y = 0.6 * S + bob;
    p.head.position.y = 0.6 * S + bob;
    p.legL.position.y = 0.2 * S + w1 * amp * 0.5;
    p.legR.position.y = 0.2 * S + w2 * amp * 0.5;
    p.body.scale.x = 1.4 * S * (1 + Math.sin(t*2)*0.1);
  } else if (shape === 'crocodile') {
    // Crocodile: long corps, mâchoires
    p.body.position.y = 0.5 * S + bob;
    p.head.position.y = 0.6 * S + bob;
    p.jaw.position.y = 0.5 * S + bob + Math.sin(t*5)*0.05*S;
    p.tail.rotation.z = Math.sin(t*3)*0.3;
    for(let i=0; i<4; i++){
      if(p['leg'+i]) p['leg'+i].position.y = 0.3 * S + ((i%2===0)?w1:w2) * amp * 0.3;
    }
  } else if (shape === 'hag') {
    // Sorcière: humanoïde bossu avec bâton
    p.torso.position.y = 1.3 * S + bob;
    p.head.position.y = 2.0 * S + bob;
    p.armL.position.y = 1.5 * S + bob + w2 * amp;
    p.armR.position.y = 1.5 * S + bob + w1 * amp;
    p.legL.position.y = 0.6 * S + w1 * amp;
    p.legR.position.y = 0.6 * S + w2 * amp;
    if(p.staff) {
      p.staff.position.y = 1.5 * S + bob;
      p.staff.rotation.z = Math.sin(t*2)*0.1;
    }
  } else if (shape === 'penguin') {
    // Pingouin: corps ovale, petites pattes
    p.body.position.y = 1.0 * S + bob;
    p.head.position.y = 1.6 * S + bob;
    p.wingL.rotation.z = Math.sin(t*3)*0.3;
    p.wingR.rotation.z = -Math.sin(t*3)*0.3;
    p.legL.position.y = 0.2 * S + w1 * amp * 0.5;
    p.legR.position.y = 0.2 * S + w2 * amp * 0.5;
  } else if (shape === 'mammoth') {
    // Mammouth: très grand quadrupède
    p.body.position.y = 2.0 * S + bob;
    p.head.position.y = 2.5 * S + bob;
    p.trunk.position.y = 2.3 * S + bob;
    p.trunk.rotation.x = Math.sin(t*2)*0.3;
    for(let i=0; i<4; i++){
      if(p['leg'+i]) p['leg'+i].position.y = 0.9 * S + ((i%2===0)?w1:w2) * amp * 0.5;
    }
  } else if (shape === 'yeti') {
    // Yeti: grand humanoïde poilu
    p.torso.position.y = 2.0 * S + bob;
    p.head.position.y = 2.8 * S + bob;
    p.armL.position.y = 2.2 * S + bob + w2 * amp;
    p.armR.position.y = 2.2 * S + bob + w1 * amp;
    p.legL.position.y = 0.9 * S + w1 * amp;
    p.legR.position.y = 0.9 * S + w2 * amp;
  } else if (shape === 'mummy') {
    // Momie: humanoïde avec bandages
    p.torso.position.y = 1.6 * S + bob;
    p.head.position.y = 2.3 * S + bob;
    p.armL.position.y = 1.7 * S + bob + Math.sin(t*2)*0.1*S;
    p.armR.position.y = 1.7 * S + bob + Math.cos(t*2)*0.1*S;
    p.legL.position.y = 0.7 * S + w1 * amp * 0.7;
    p.legR.position.y = 0.7 * S + w2 * amp * 0.7;
  } else if (shape === 'vampire') {
    // Vampire: humanoïde élégant avec cape
    p.torso.position.y = 1.7 * S + bob;
    p.head.position.y = 2.4 * S + bob;
    p.cape.rotation.x = Math.sin(t*3)*0.2;
    p.armL.position.y = 1.9 * S + bob + w2 * amp;
    p.armR.position.y = 1.9 * S + bob + w1 * amp;
    p.legL.position.y = 0.8 * S + w1 * amp;
    p.legR.position.y = 0.8 * S + w2 * amp;
  } else if (shape === 'lich') {
    // Liche: squelette flottant avec aura
    p.torso.position.y = 1.8 * S + Math.sin(t*2)*0.2*S;
    p.head.position.y = 2.5 * S + Math.sin(t*2)*0.2*S;
    p.robe.position.y = 1.3 * S + Math.sin(t*2)*0.2*S;
    p.armL.position.y = 2.0 * S + Math.sin(t*2)*0.2*S + Math.sin(t*3)*0.1*S;
    p.armR.position.y = 2.0 * S + Math.sin(t*2)*0.2*S + Math.cos(t*3)*0.1*S;
    if(p.aura) p.aura.rotation.z = t;
  } else if (shape === 'banshee') {
    // Banshee: fantôme féminin flottant
    p.body.position.y = 2.0 * S + Math.sin(t*3)*0.3*S;
    p.head.position.y = 2.7 * S + Math.sin(t*3)*0.3*S;
    p.hair.position.y = 2.7 * S + Math.sin(t*3)*0.3*S;
    p.hair.rotation.z = Math.sin(t*5)*0.3;
    p.armL.position.y = 2.2 * S + Math.sin(t*3)*0.3*S;
    p.armR.position.y = 2.2 * S + Math.sin(t*3)*0.3*S;
    p.armL.rotation.z = 0.5 + Math.sin(t*4)*0.3;
    p.armR.rotation.z = -0.5 - Math.sin(t*4)*0.3;
  } else if (shape === 'oni') {
    // Oni: démon japonais musclé
    p.torso.position.y = 1.8 * S + bob;
    p.head.position.y = 2.5 * S + bob;
    p.hornL.rotation.z = 0.3;
    p.hornR.rotation.z = -0.3;
    p.armL.position.y = 2.0 * S + bob + w2 * amp;
    p.armR.position.y = 2.0 * S + bob + w1 * amp;
    p.legL.position.y = 0.8 * S + w1 * amp;
    p.legR.position.y = 0.8 * S + w2 * amp;
  } else if (shape === 'kappa') {
    // Kappa: créature aquatique avec carapace
    p.shell.position.y = 1.3 * S + bob;
    p.head.position.y = 1.6 * S + bob;
    p.bowl.position.y = 1.9 * S + bob;
    p.armL.position.y = 1.4 * S + bob + w2 * amp;
    p.armR.position.y = 1.4 * S + bob + w1 * amp;
    p.legL.position.y = 0.6 * S + w1 * amp;
    p.legR.position.y = 0.6 * S + w2 * amp;
  } else if (shape === 'tengu') {
    // Tengu: corbeau humanoïde
    p.torso.position.y = 1.7 * S + bob;
    p.head.position.y = 2.4 * S + bob;
    p.beak.position.y = 2.3 * S + bob;
    p.wingL.rotation.y = Math.sin(t*4)*0.3;
    p.wingR.rotation.y = -Math.sin(t*4)*0.3;
    p.armL.position.y = 1.9 * S + bob + w2 * amp;
    p.armR.position.y = 1.9 * S + bob + w1 * amp;
    p.legL.position.y = 0.7 * S + w1 * amp;
    p.legR.position.y = 0.7 * S + w2 * amp;
  } else if (shape === 'imp') {
    // Diablotin: petit démon volant
    p.body.position.y = 1.5 * S + Math.sin(t*5)*0.3*S;
    p.head.position.y = 1.9 * S + Math.sin(t*5)*0.3*S;
    p.hornL.position.y = 2.1 * S + Math.sin(t*5)*0.3*S;
    p.hornR.position.y = 2.1 * S + Math.sin(t*5)*0.3*S;
    p.wingL.rotation.z = Math.sin(t*15)*0.5;
    p.wingR.rotation.z = -Math.sin(t*15)*0.5;
    p.tail.rotation.z = Math.sin(t*4)*0.5;
  } else if (shape === 'demon') {
    // Démon: grand humanoïde avec cornes et ailes
    p.torso.position.y = 2.0 * S + bob;
    p.head.position.y = 2.8 * S + bob;
    p.hornL.rotation.z = 0.5;
    p.hornR.rotation.z = -0.5;
    p.wingL.rotation.y = Math.sin(t*3)*0.4;
    p.wingR.rotation.y = -Math.sin(t*3)*0.4;
    p.armL.position.y = 2.2 * S + bob + w2 * amp;
    p.armR.position.y = 2.2 * S + bob + w1 * amp;
    p.legL.position.y = 0.9 * S + w1 * amp;
    p.legR.position.y = 0.9 * S + w2 * amp;
    if(p.tail) p.tail.rotation.z = Math.sin(t*3)*0.4;
  } else if (shape === 'ogre') {
    // Ogre: très grand et massif
    p.torso.position.y = 2.2 * S + bob;
    p.belly.position.y = 1.8 * S + bob;
    p.head.position.y = 3.0 * S + bob;
    p.armL.position.y = 2.4 * S + bob + w2 * amp;
    p.armR.position.y = 2.4 * S + bob + w1 * amp;
    p.legL.position.y = 1.0 * S + w1 * amp;
    p.legR.position.y = 1.0 * S + w2 * amp;
  } else if (shape === 'phoenix') {
    // Phénix: oiseau de feu flottant
    p.body.position.y = 2.0 * S + Math.sin(t*4)*0.3*S;
    p.head.position.y = 2.5 * S + Math.sin(t*4)*0.3*S;
    p.wingL.rotation.y = Math.sin(t*12)*0.8;
    p.wingR.rotation.y = -Math.sin(t*12)*0.8;
    p.tail.position.y = 1.5 * S + Math.sin(t*4)*0.3*S;
    p.tail.rotation.x = Math.sin(t*3)*0.3;
    if(p.flames) p.flames.material.opacity = 0.5 + Math.sin(t*8)*0.3;
  } else if (shape === 'dragon') {
    // Dragon: grand reptile avec ailes
    p.body.position.y = 2.5 * S + bob;
    p.neck.position.y = 3.2 * S + bob;
    p.neck.rotation.x = Math.sin(t*2)*0.2;
    p.head.position.y = 3.8 * S + bob;
    p.wingL.rotation.y = Math.sin(t*3)*0.5;
    p.wingR.rotation.y = -Math.sin(t*3)*0.5;
    p.tail.rotation.z = Math.sin(t*3)*0.3;
    for(let i=0; i<4; i++){
      if(p['leg'+i]) p['leg'+i].position.y = 1.2 * S + ((i%2===0)?w1:w2) * amp;
    }
  } else if (shape === 'salamander') {
    // Salamandre: lézard de feu
    p.body.position.y = 1.0 * S + bob;
    p.head.position.y = 1.2 * S + bob;
    p.tail.rotation.z = Math.sin(t*4)*0.5;
    for(let i=0; i<4; i++){
      if(p['leg'+i]) p['leg'+i].position.y = 0.5 * S + ((i%2===0)?w1:w2) * amp * 0.5;
    }
    if(p.flames) p.flames.material.opacity = 0.6 + Math.sin(t*10)*0.3;
  } else if (shape === 'cerberus') {
    // Cerbère: chien à 3 têtes
    p.body.position.y = 1.5 * S + bob;
    p.head1.position.y = 2.0 * S + bob;
    p.head2.position.y = 2.0 * S + bob;
    p.head3.position.y = 2.0 * S + bob;
    p.head1.rotation.z = -0.3 + Math.sin(t*2)*0.1;
    p.head2.rotation.z = Math.sin(t*2 + 2)*0.1;
    p.head3.rotation.z = 0.3 + Math.sin(t*2 + 4)*0.1;
    for(let i=0; i<4; i++){
      if(p['leg'+i]) p['leg'+i].position.y = 0.7 * S + ((i%2===0)?w1:w2) * amp;
    }
    if(p.tail) p.tail.rotation.z = Math.sin(t*3)*0.4;
  } else if (shape === 'succubus') {
    // Succube: démone ailée séductrice
    p.torso.position.y = 1.8 * S + bob;
    p.head.position.y = 2.5 * S + bob;
    p.hornL.rotation.z = 0.4;
    p.hornR.rotation.z = -0.4;
    p.wingL.rotation.y = Math.sin(t*4)*0.3;
    p.wingR.rotation.y = -Math.sin(t*4)*0.3;
    p.armL.position.y = 2.0 * S + bob + Math.sin(t*3)*0.1*S;
    p.armR.position.y = 2.0 * S + bob + Math.cos(t*3)*0.1*S;
    p.legL.position.y = 0.8 * S + w1 * amp;
    p.legR.position.y = 0.8 * S + w2 * amp;
    if(p.tail) p.tail.rotation.z = Math.sin(t*4)*0.5;
  } else if (shape === 'griffin') {
    // Griffon: aigle-lion
    p.body.position.y = 1.5 * S + bob;
    p.chest.position.y = 1.8 * S + bob;
    p.head.position.y = 2.3 * S + bob;
    p.beak.position.y = 2.2 * S + bob;
    p.wingL.rotation.y = Math.sin(t*4)*0.6;
    p.wingR.rotation.y = -Math.sin(t*4)*0.6;
    p.legFL.position.y = 1.0 * S + w1 * amp;
    p.legFR.position.y = 1.0 * S + w2 * amp;
    p.legBL.position.y = 0.7 * S + w2 * amp;
    p.legBR.position.y = 0.7 * S + w1 * amp;
    if(p.tail) p.tail.rotation.z = Math.sin(t*3)*0.3;
  } else if (shape === 'harpy') {
    // Harpie: femme-oiseau
    p.torso.position.y = 1.7 * S + Math.sin(t*4)*0.2*S;
    p.head.position.y = 2.4 * S + Math.sin(t*4)*0.2*S;
    p.wingL.rotation.y = Math.sin(t*10)*0.8;
    p.wingR.rotation.y = -Math.sin(t*10)*0.8;
    p.armL.position.y = 1.9 * S + Math.sin(t*4)*0.2*S;
    p.armR.position.y = 1.9 * S + Math.sin(t*4)*0.2*S;
    p.legL.position.y = 1.0 * S + Math.sin(t*4)*0.2*S + w1 * amp;
    p.legR.position.y = 1.0 * S + Math.sin(t*4)*0.2*S + w2 * amp;
  } else if (shape === 'gargoyle') {
    // Gargouille: statue vivante ailée
    p.torso.position.y = 1.6 * S + bob;
    p.head.position.y = 2.3 * S + bob;
    p.wingL.rotation.y = Math.sin(t*2)*0.3;
    p.wingR.rotation.y = -Math.sin(t*2)*0.3;
    p.armL.position.y = 1.8 * S + bob + w2 * amp * 0.5;
    p.armR.position.y = 1.8 * S + bob + w1 * amp * 0.5;
    p.legL.position.y = 0.7 * S + w1 * amp * 0.5;
    p.legR.position.y = 0.7 * S + w2 * amp * 0.5;
  } else if (shape === 'cactus') {
    // Cactus: plante avec bras
    p.body.position.y = 1.5 * S + bob;
    p.armL.rotation.z = 0.5 + Math.sin(t*2)*0.2;
    p.armR.rotation.z = -0.5 - Math.sin(t*2)*0.2;
  } else if (shape === 'stone_golem' || shape === 'ice_golem' || shape === 'lava_golem') {
    // Golems: grands constructs
    p.torso.position.y = 2.0 * S + bob;
    p.head.position.y = 2.8 * S + bob;
    p.core.position.y = 2.0 * S + bob;
    if(shape === 'lava_golem' && p.glow) p.glow.material.opacity = 0.6 + Math.sin(t*5)*0.3;
    p.armL.position.y = 2.2 * S + bob + w2 * amp * 0.7;
    p.armR.position.y = 2.2 * S + bob + w1 * amp * 0.7;
    p.legL.position.y = 0.9 * S + w1 * amp * 0.7;
    p.legR.position.y = 0.9 * S + w2 * amp * 0.7;
  } else if (shape === 'shadow') {
    // Ombre: silhouette floue
    p.body.position.y = 1.5 * S + Math.sin(t*3)*0.2*S;
    p.body.material.opacity = 0.5 + Math.sin(t*4)*0.2;
    p.head.position.y = 2.2 * S + Math.sin(t*3)*0.2*S;
    p.armL.position.y = 1.7 * S + Math.sin(t*3)*0.2*S;
    p.armR.position.y = 1.7 * S + Math.sin(t*3)*0.2*S;
    p.armL.rotation.z = Math.sin(t*4)*0.5;
    p.armR.rotation.z = -Math.sin(t*4)*0.5;
  } else if (shape === 'leech') {
    // Sangsue: ver flottant
    p.body.position.y = 1.2 * S + Math.sin(t*4)*0.3*S;
    p.body.rotation.z = Math.sin(t*3)*0.3;
    p.mouth.position.y = 1.5 * S + Math.sin(t*4)*0.3*S;
    p.mouth.scale.x = 1.0 + Math.sin(t*6)*0.3;
  } else { // human / beast / custom player shapes
    const isBeast = shape === 'beast';
    
    // Animation simple pour les nouveaux modèles de joueur (qui n'ont pas armLU/legLU/etc)
    const hasOldStructure = p.armLU !== undefined;
    
    if (!hasOldStructure) {
      // Nouveaux modèles de joueur : animation améliorée avec détails
      if (p.torso) p.torso.position.y = 1.6 * S + bob;
      if (p.robeMiddle) p.robeMiddle.position.y = 1.1 * S + bob;
      if (p.head) p.head.position.y = 2.25 * S + bob;
      
      // Animation des robe/cape
      if (p.robeBottom) p.robeBottom.position.y = 0.5 * S + Math.sin(t * 3) * 0.05 * S;
      if (p.cape) p.cape.rotation.z = 0.1 + Math.sin(t * 2) * 0.05;
      if (p.leafCloak) p.leafCloak.rotation.z = Math.PI + Math.sin(t * 2) * 0.05;
      
      // Animation des bras haut
      if (p.armLU) {
        p.armLU.rotation.z = w1 * amp * 0.5;
        p.armLU.position.y = 1.9 * S + w2 * amp * 0.2;
        p.armLU.position.x = -0.7 * S + w2 * amp * 0.1;
      }
      if (p.armRU) {
        p.armRU.rotation.z = w2 * amp * 0.5;
        p.armRU.position.y = 1.9 * S + w1 * amp * 0.2;
        p.armRU.position.x = 0.7 * S + w1 * amp * 0.1;
      }
      
      // Animation des bras bas/avant-bras
      if (p.armLD) {
        p.armLD.rotation.z = w1 * amp * 0.4 - 0.3;
        p.armLD.position.y = 1.3 * S + w2 * amp * 0.15;
        p.armLD.position.x = -0.75 * S + w2 * amp * 0.15;
      }
      if (p.armRD) {
        p.armRD.rotation.z = w2 * amp * 0.4 - 0.3;
        p.armRD.position.y = 1.3 * S + w1 * amp * 0.15;
        p.armRD.position.x = 0.75 * S + w1 * amp * 0.15;
      }
      
      // Animation des mains
      if (p.handL) {
        p.handL.position.y = 0.9 * S + w2 * amp * 0.1;
        p.handL.rotation.z = w1 * amp * 0.3;
      }
      if (p.handR) {
        p.handR.position.y = 0.9 * S + w1 * amp * 0.1;
        p.handR.rotation.z = w2 * amp * 0.3;
      }
      
      // Animation des jambes haut
      if (p.legLU) {
        p.legLU.position.y = 1.0 * S + w1 * amp * 0.2;
        p.legLU.rotation.z = w1 * amp * 0.2;
      }
      if (p.legRU) {
        p.legRU.position.y = 1.0 * S + w2 * amp * 0.2;
        p.legRU.rotation.z = w2 * amp * 0.2;
      }
      
      // Animation des jambes bas
      if (p.legLD) {
        p.legLD.position.y = 0.4 * S + w1 * amp * 0.15;
        p.legLD.rotation.z = w1 * amp * 0.15;
      }
      if (p.legRD) {
        p.legRD.position.y = 0.4 * S + w2 * amp * 0.15;
        p.legRD.rotation.z = w2 * amp * 0.15;
      }
      
      // Animation des pieds
      if (p.footL) {
        p.footL.position.y = 0.05 * S + w1 * amp * 0.05;
        p.footL.rotation.z = w1 * amp * 0.1 - 0.1;
      }
      if (p.footR) {
        p.footR.position.y = 0.05 * S + w2 * amp * 0.05;
        p.footR.rotation.z = w2 * amp * 0.1 - 0.1;
      }
      
      // Animation des bras simples si présents (anciens modèles simplifiés)
      if (p.armL && !p.armLU) {
        p.armL.rotation.z = w1 * amp * 0.3;
        p.armL.position.y = 1.7 * S + w2 * amp * 0.1;
      }
      if (p.armR && !p.armRU) {
        p.armR.rotation.z = w2 * amp * 0.3;
        p.armR.position.y = 1.7 * S + w1 * amp * 0.1;
      }
      
      // Animation des jambes si présentes
      if (p.legL) p.legL.position.y = 0.55 * S + w1 * amp * 0.15;
      if (p.legR) p.legR.position.y = 0.55 * S + w2 * amp * 0.15;
      
      // Animation des ailes si présentes
      if (p.wingL && p.wingR) {
        const fl = Math.sin(t * 10);
        p.wingL.rotation.z = -0.3 + fl * 0.2;
        p.wingR.rotation.z = 0.3 - fl * 0.2;
      }
    } else {
      // Anciens modèles avec structure complète
      const by = isBeast ? 1.1 : 1.5;
      const hy = isBeast ? 1.6 : 2.25;
      if (p.torso) p.torso.position.y = by * S + bob;
      if (p.head) p.head.position.y = hy * S + bob;

      if (isBeast) {
        if (p.armLU) p.armLU.position.y = 0.5 * S + w1 * amp;
        if (p.armRU) p.armRU.position.y = 0.5 * S + w2 * amp;
        if (p.legLU) p.legLU.position.y = 0.5 * S + w2 * amp;
        if (p.legRU) p.legRU.position.y = 0.5 * S + w1 * amp;
      } else {
        if (p.legLU) {
          p.legLU.position.y = 0.90 * S + w1 * amp;
          p.legRU.position.y = 0.90 * S + w2 * amp;
          if (p.legLD) p.legLD.position.y = 0.36 * S + w1 * amp * 0.8;
          if (p.legRD) p.legRD.position.y = 0.36 * S + w2 * amp * 0.8;
        }
        if (p.armLU) p.armLU.position.y = 1.72 * S + w2 * amp;
        if (p.armRU) p.armRU.position.y = 1.72 * S + w1 * amp;
        if (p.armLD) {
          p.armLD.position.y = 1.15 * S + w2 * amp * 0.8;
          p.armLD.position.x = -0.68 * S + w2 * amp * 0.3;
        }
        if (p.armRD) {
          p.armRD.position.y = 1.15 * S + w1 * amp * 0.8;
          p.armRD.position.x = 0.68 * S + w1 * amp * 0.3;
        }

        if (p.wingL) {
          const fl = Math.sin(t * 10);
          p.wingL.scale.x = 1.2 * S * (1 + fl * 0.3);
          p.wingR.scale.x = 1.2 * S * (1 + fl * 0.3);
        }
      }
    }
  }
}

// ==================== MONSTER CLASS ====================
class Monster {
  constructor(x, z, ti = null) {
    let typeData;
    if (ti !== null) typeData = MTYPES[ti];
    else {
        const mobNames = GameState.pBiome ? GameState.pBiome.mobs : ['Gobelin'];
        const name = mobNames[Math.floor(Math.random() * mobNames.length)];
        typeData = MTYPES.find(m => m.name === name) || MTYPES[0];
      }
    this.T = { ...typeData };
    this.baseName = this.T.name;
    this.baseTint = 0xffffff;

    const diff = 0.4 + GameState.pT / 120;
    let diffMult = diff;
    if (GameState.pBiome && !ti) diffMult *= GameState.pBiome.diff;

    // Loop difficulty scaling (NG+)
    const loopMult = 1.0 + (GameState.loopLevel * 0.5);
    diffMult *= loopMult;

    // Time-based speed scaling (Vampire Survivors style)
    const timeSpeedMult = 1.0 + Math.min(0.8, GameState.pT / 200); // +80% vitesse max après 160s

    if (GameState.biomeFx && !ti) {
      this.T.spd *= GameState.biomeFx.mobSpdMult || 1;
      diffMult *= GameState.biomeFx.mobHpMult || 1;
    }

    this.T.spd *= timeSpeedMult; // Ennemis plus rapides avec le temps
    this.T.hp *= diffMult;
    this.T.dmg *= diffMult * (GameState.biomeFx && !ti ? (GameState.biomeFx.mobDmgMult || 1) : 1);
    this.xpVal = Math.floor(100 * diff * (this.baseTint !== 0xffffff ? 1.5 : 1));
    if (GameState.pBiome) this.xpVal = Math.floor(this.xpVal * GameState.pBiome.diff);
    if (GameState.biomeFx && !ti) this.xpVal = Math.floor(this.xpVal * (GameState.biomeFx.xpMult || 1));

    this.hp = this.mhp = this.T.hp;
    this.dead = false;
    this.dt = 0;
    this.t = Math.random() * 100;
    this.state = 'wander';
    this.wangle = Math.random() * Math.PI * 2;
    this.wtimer = 2 + Math.random() * 3;
    this.acd = 0;
    this.boss = false;
    this.flash = 0;
    this.orbHitT = 0;
    this.finalBoss = false;
    this.bossTimer = 0;

    const { g, p } = buildPuppet(this.T);
    this.bleedStack = 0;
    this.bleedTimer = 0;
    this.root = g;
    this.p = p;
    this.bleed = [];

    // Init limb HP
    const base = this.T.hp * 0.4;
    for (const k in p) {
      if (k.startsWith('eye') && this.T.shape !== 'titan') continue;
      const ratio = (k === 'torso' || k === 'core') ? 1.0 : (k === 'head') ? 0.4 : 0.25;
      p[k].userData = { hp: base * ratio, max: base * ratio };
    }
    Object.values(this.p).forEach(s => {
      s.material.color.setHex(this.baseTint);
      if (this.T.op) s.material.opacity = this.T.op;
    });

    // Nouvelle barre de vie optimisée (1 sprite au lieu de 2 meshes)
    const bw = 1.2 * this.T.S;
    const barH = 0.15;
    const barY = 2.9 * this.T.S;
    
    // Bordure (fond noir)
    this.hpBorder = mkSprite(0x000000, bw + 0.08, barH + 0.04, 'box');
    this.hpBorder.position.set(0, barY, 0);
    this.hpBorder.renderOrder = 998;
    this.root.add(this.hpBorder);
    
    // Fond gris foncé
    this.hpBg = mkSprite(0x222222, bw, barH, 'box');
    this.hpBg.position.set(0, barY, 0.01);
    this.hpBg.renderOrder = 999;
    this.root.add(this.hpBg);
    
    // Barre de vie (couleur dynamique)
    this.hpFill = mkSprite(0xff0000, bw, barH, 'box');
    this.hpFill.position.set(0, barY, 0.02);
    this.hpFill.renderOrder = 1000;
    this.root.add(this.hpFill);
    
    this.bw = bw;
    this.barVisible = true;

    this.root.position.set(x, terrainH(x, z), z);
    scene.add(this.root);
  }

  makeBoss() {
    const diff = 0.6 + GameState.pT / 180;
    const loopMult = 1.0 + (GameState.loopLevel * 0.5); // Loop difficulty scaling
    
    this.boss = true;
    this.hp = this.mhp = 300 * diff * loopMult;
    this.T = { ...this.T, dmg: 15 * diff * loopMult, spd: 1.2 };
    this.xpVal = 1200 * diff * loopMult;
    this.root.scale.setScalar(2.5); // Géant
    this.baseTint = 0xff3300;
    Object.values(this.p).forEach(s => s.material.color.setHex(this.baseTint));
    // Ajouter marqueur au dessus du boss
    this.addBossMarker();
  }
  
  addBossMarker() {
    // HP réduit pour battle raisonnable (environ 2-3 min de combat)
    this.hp = this.mhp = 5000 + GameState.pT * 80;
    this.T = { ...this.T, dmg: 25 + GameState.pT / 10, spd: 2.8 };
    this.xpVal = 50000;
    this.root.scale.setScalar(5.0); // Géant mais pas trop énorme
    this.baseTint = 0xffaa00;
    Object.values(this.p).forEach(s => s.material.color.setHex(this.baseTint));
    // Ajouter marqueur au dessus du boss final
    this.addBossMarker()
    
    const ring = mkSprite(0xffaa00, 2.0, 2.0, 'circle');
    ring.position.set(0, 5 * this.T.S, 0);
    ring.material.transparent = true;
    ring.material.opacity = 0.4;
    ring.material.depthTest = false;
    markerG.add(ring);
    
    this.bossMarker = markerG;
    this.root.add(markerG);
  }

  makeFinalBoss() {
    this.boss = true;
    this.finalBoss = true;
    
    // Loop difficulty scaling (NG+)
    const loopMult = 1.0 + (GameState.loopLevel * 0.5);
    
    this.hp = this.mhp = 60000 * loopMult;
    this.T = { ...this.T, dmg: 80 * loopMult, spd: 3.5 };
    this.xpVal = 100000 * loopMult;
    this.root.scale.setScalar(8.0);
    this.baseTint = 0xffffff;
  }

  update(dt, pp) {
    if (this.dead) {
      this.dt += dt;
      const sc = dt * 3;
      Object.values(this.p).forEach((s, i) => {
        s.position.y -= dt * (1 + i * 0.25);
        s.position.x += Math.sin(i * 137.5) * sc;
        s.position.z += Math.cos(i * 137.5) * sc;
      });
      this.hpBorder.visible = false;
      this.hpBg.visible = false;
      this.hpFill.visible = false;
      return this.dt > 1.8;
    }

    if (this.bleedStack > 0) {
      this.bleedTimer -= dt;
      if (this.bleedTimer <= 0) {
        this.takeDmg(this.bleedStack);
        this.bleedTimer = 1.0;
        spawnPart(this.root.position, 0xaa0000, 3, 1);
      }
    }

    this.orbHitT = Math.max(0, this.orbHitT - dt);
    this.t += dt;
    this.acd = Math.max(0, this.acd - dt);
    this.flash = Math.max(0, this.flash - dt);

    const dx = pp.x - this.root.position.x, dz = pp.z - this.root.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    // Safety check for NaN distance
    if (isNaN(dist)) {
        this.root.position.set(pp.x + 10, pp.y, pp.z + 10); // Teleport away
        return false;
    }

    // LOD avec despawn distance
    const lodHigh = dist < 25;
    const lodMed = dist < 50;
    this.root.visible = dist < 70;
    
    // Despawn si trop loin (optimisation) - sauf pour les boss
    if (dist > 75 && !this.boss && !this.finalBoss) {
      return true; // Signal to remove
    }
    
    if (!this.root.visible) return false;

    if (dist < 22) this.state = 'chase';
    if (dist > 42 && this.state === 'chase') this.state = 'wander';

    let mv = false;
    if (this.state === 'chase') {
      if (dist > 1.6) {
        this.root.position.x += dx / dist * this.T.spd * dt;
        this.root.position.z += dz / dist * this.T.spd * dt;
        mv = true;
      } else if (this.acd <= 0) {
        this.acd = 1.2;
        if (GameState.invTimer <= 0) {
          if (Math.random() < GameState.pDodge) {
            addNotif('💨 Esquive!', '#aaddff');
            return;
          }
          const dmgTaken = Math.max(1, Math.round(this.T.dmg * (1 - GameState.pDmgRed)));
          GameState.pHP = Math.max(0, GameState.pHP - dmgTaken);
          GameState.invTimer = 0.5;
    
    // Reset Combo on hit
    if (GameState.pCombo > 0) {
        addNotif("💔 COMBO PERDU !", "#ff0000");
        GameState.pCombo = 0;
    }
    
          flashDmg();
          addNotif(`💥 -${dmgTaken} PV`, '#e03030');
          if (GameState.pThorns > 0) {
            this.takeDmg(GameState.pThorns);
            spawnPart(this.root.position, 0x88ff00, 5, 3);
          }
          if (GameState.pHP <= 0) gameOver();
        }
      }
    } else {
      this.wtimer -= dt;
      if (this.wtimer < 0) {
        this.wangle += (Math.random() - 0.5) * 2;
        this.wtimer = 2 + Math.random() * 3;
      }
      this.root.position.x += Math.sin(this.wangle) * 0.4 * dt;
      this.root.position.z += Math.cos(this.wangle) * 0.4 * dt;
    }

    // Limb support logic
    let yOff = 0;
    if (this.T.shape === 'flyer') {
      if ((!this.p.wingL || !this.p.wingL.visible) && (!this.p.wingR || !this.p.wingR.visible)) yOff = -2.0 * this.T.S;
    } else if (this.T.shape !== 'blob' && this.T.shape !== 'spider') {
      const legs = ['legLU', 'legRU', 'legFL', 'legBL'].filter(k => this.p[k]);
      const active = legs.filter(k => this.p[k].visible).length;
      if (active === 0) yOff = -0.8 * this.T.S;
    }

    this.root.position.y = terrainH(this.root.position.x, this.root.position.z) + yOff;

    if (lodMed || Math.floor(this.t * 60) % 15 === 0) this.root.lookAt(pp.x, this.root.position.y, pp.z);

    if (this.finalBoss && !this.dead) {
      this.bossTimer -= dt;
      if (this.bossTimer <= 0) {
        this.bossTimer = 2.0;
        const r = Math.random();
        if (r < 0.5) {
          ['eyeL', 'eyeR'].forEach(k => {
            if (this.p[k] && this.p[k].visible) {
              this.p[k].getWorldPosition(_v1);
              const wp = _v1.clone();
              const d = pp.clone().sub(wp).normalize();
              projectiles.push(new Proj(wp, d, 25, 0xaa0000, 18, 4.0));
            }
          });
        }
      }
      
      // Animation du marqueur boss
      if (this.bossMarker) {
        this.bossMarker.children[0].position.y = 6 * this.T.S + Math.sin(this.t * 4) * 0.5;
        this.bossMarker.children[1].rotation.z = this.t * 2;
        this.bossMarker.children[1].material.opacity = 0.3 + Math.sin(this.t * 3) * 0.2;
      }
    }
    
    // Animation du marqueur pour boss standard aussi
    if (this.boss && !this.finalBoss && this.bossMarker) {
      this.bossMarker.children[0].position.y = 6 * this.T.S + Math.sin(this.t * 4) * 0.5;
      this.bossMarker.children[1].rotation.z = this.t * 2;
      this.bossMarker.children[1].material.opacity = 0.3 + Math.sin(this.t * 3) * 0.2;
    }

    // Animation avec LOD amélioré
    // Boss et ennemis proches: animation complète
    // Ennemis moyens: animation réduite
    // Ennemis loin: pas d'animation (statues)
    if (this.boss || this.finalBoss || lodHigh) {
      // Animation complète
      animPuppet(this.p, this.t, mv, this.T.S, this.T.shape);
    } else if (lodMed && Math.floor(this.t * 60) % 3 === 0) {
      // Animation réduite (toutes les 3 frames)
      animPuppet(this.p, this.t, mv, this.T.S, this.T.shape);
    }
    // Sinon: pas d'animation du tout (économise les calculs)

    if (lodHigh && this.bleed.length && !this.dead && Math.random() < 0.2) {
      const b = this.bleed[Math.floor(Math.random() * this.bleed.length)];
      b.getWorldPosition(_v1);
      spawnPart(_v1, 0x880000, 1, 1);
    }

    Object.values(this.p).forEach(s => {
      if (s.visible) s.material.color.setHex(this.flash > 0 ? 0xff7777 : this.baseTint);
    });

    // Mise à jour barre de vie optimisée
    const pct = Math.max(0, this.hp / this.mhp);
    
    // Masquer la barre quand à 100% HP (optimisation)
    const shouldShow = pct < 0.999;
    if (shouldShow !== this.barVisible) {
      this.barVisible = shouldShow;
      this.hpBorder.visible = shouldShow;
      this.hpBg.visible = shouldShow;
      this.hpFill.visible = shouldShow;
    }
    
    if (shouldShow) {
      this.hpBorder.lookAt(camera.position);
      this.hpBg.lookAt(camera.position);
      this.hpFill.lookAt(camera.position);
      
      if (lodMed || Math.floor(this.t * 60) % 10 === 0) {
        // Mise à jour largeur
        this.hpFill.scale.x = pct;
        this.hpFill.position.x = -(1 - pct) * this.bw * 0.5;
        
        // Couleur dynamique: vert (100%) → jaune (50%) → rouge (0%)
        let hpColor;
        if (pct > 0.6) {
          // Vert vers jaune
          const t = (1 - pct) / 0.4;
          hpColor = new THREE.Color(t, 1, 0);
        } else if (pct > 0.3) {
          // Jaune vers orange
          const t = (0.6 - pct) / 0.3;
          hpColor = new THREE.Color(1, 1 - t * 0.5, 0);
        } else {
          // Orange vers rouge
          const t = pct / 0.3;
          hpColor = new THREE.Color(1, t * 0.5, 0);
        }
        this.hpFill.material.color.copy(hpColor);
      }
    }

    if (this.boss) {
      const bf = document.getElementById('bossfill'), bt = document.getElementById('bosstrk');
      if (this.finalBoss) {
        const P = 3, sz = this.mhp / P, cur = Math.max(1, Math.ceil(this.hp / sz));
        const subPct = Math.max(0, (this.hp - (cur - 1) * sz) / sz);
        const cols = ['#d02020', '#f0a020', '#a020f0'];
        bf.style.background = cols[cur - 1];
        bf.style.width = (subPct * 100) + '%';
        bt.style.background = cur > 1 ? cols[cur - 2] : '#300000';
      } else {
        bf.style.background = 'linear-gradient(90deg,#800,#d03030)';
        bt.style.background = 'rgba(0,0,0,.65)';
        bf.style.width = (pct * 100) + '%';
      }
    }

    this.root.updateMatrixWorld();
    return false;
  }

  checkHit(pos, r) {
    if (this.dead) return null;
    if (pos.distanceTo(this.root.position) > 3.5 * this.T.S) return null;
    let hit = null, minD = Infinity;
    for (const [k, sp] of Object.entries(this.p)) {
      if (!sp.visible) continue;
      if (k.startsWith('eye') && this.T.shape !== 'titan') continue;
      sp.getWorldPosition(_v1);
      const d = pos.distanceTo(_v1);
      const hr = (sp.scale.x * this.root.scale.x) * 0.5;
      if (d < hr + r && d < minD) {
        minD = d;
        hit = k;
      }
    }
    return hit;
  }

  hitPart(k, dmg, slow) {
    if (this.dead) return;
    const p = this.p[k];
    p.getWorldPosition(_v1);
    const wp = _v1.clone();
    this.flash = 0.15;

    if (k === 'head' || k === 'torso' || k === 'core') {
      const m = (k === 'head') ? 1.5 : 1;
      this.takeDmg(dmg * m, slow);
      addDmgNum(wp, Math.floor(dmg * m));
    } else {
      p.userData.hp -= dmg;
      this.takeDmg(dmg * 0.3, slow);
      addDmgNum(wp, Math.floor(dmg * 0.3));
      if (p.userData.hp <= 0 && p.visible) {
        p.visible = false;
        this.bleed.push(p);
        spawnPart(wp, this.T.C, 6, 3);
        spawnPart(wp, 0x990000, 8, 4);
        const deps = { 'armLU': 'armLD', 'armRU': 'armRD', 'legLU': 'legLD', 'legRU': 'legRD' };
        if (deps[k] && this.p[deps[k]]) {
          const c = this.p[deps[k]];
          c.visible = false;
          c.getWorldPosition(_v2);
          spawnPart(_v2, this.T.C, 5, 3);
        }
        if (k.includes('leg') || k.includes('wing')) this.T.spd *= 0.5;
        if (this.finalBoss) {
          this.takeDmg(this.mhp * 0.05);
          addNotif("POINT FAIBLE DÉTRUIT!", "#ff0000");
          const organColor = p.material.color.getHex();
          spawnPart(wp, organColor, 40, 15);
          spawnPart(wp, 0xaa0000, 50, 18);
          const flashLight = new THREE.PointLight(0xffaaaa, 8, 30, 2);
          flashLight.position.copy(wp);
          scene.add(flashLight);
          setTimeout(() => scene.remove(flashLight), 180);
        }
      } else {
        spawnPart(wp, this.T.C, 3, 2);
      }
    }
  }

  takeDmg(dmg, slow = false, knock = 0, src = null) {
    if (this.dead) return;
    this.hp -= dmg;
    this.flash = 0.18;
    if (this.hp < this.mhp * GameState.pExec && !this.boss && !this.finalBoss) {
      this.hp = 0;
      addNotif('💀 EXÉCUTION!', '#ff0000');
    }
    if (slow) this.T = { ...this.T, spd: Math.max(0.2, this.T.spd * 0.5) };
    if (knock > 0 && src) {
      const dir = this.root.position.clone().sub(src).normalize();
      this.root.position.addScaledVector(dir, knock);
    }
    if (this.hp <= 0 && !this.dead) this.die();
  }

  die() {
    this.dead = true;
    GameState.pKills++;
    GameState.pScore += this.xpVal;
    
    // Money Drop
    const coins = Math.max(1, Math.floor(this.xpVal / 10 * (GameState.pGoldMult || 1)));
    GameState.saveData.money = (GameState.saveData.money || 0) + coins;
    
    if (Math.random() < GameState.pVamp) {
      GameState.pHP = Math.min(GameState.pMaxHP, GameState.pHP + 5);
      addNotif('🩸 Vampirisme', '#ff0000');
    }
    
    // Card Collection Logic
    if (GameState.saveData && GameState.saveData.cards && !GameState.saveData.cards.includes(this.T.name)) {
      GameState.saveData.cards.push(this.T.name);
      addNotif(`🃏 Carte obtenue: ${this.T.name}`, '#ffaa00');
      // Save is handled periodically or at end of run, but we can force it if needed
      try { localStorage.setItem('dw_save', JSON.stringify(GameState.saveData)); } catch(e) {}
    }

    updateQuest(this);
    if (this.finalBoss) {
      gameWin();
      return;
    }
    xpOrbs.push(new XPOrb(this.root.position, this.xpVal));
    document.getElementById('kills').innerHTML = `<i class="fa-solid fa-skull"></i> ${GameState.pKills}`;
    addNotif(this.boss ? `🏆 BOSS VAINCU! +300 XP` : `💀 ${this.T.name} +${this.boss ? 300 : 50} XP`, '#70e030');
    if (this.boss) {
      GameState.bossAlive = false;
      document.getElementById('bossbar').style.display = 'none';
    }
  }
}

// ==================== SPRITE WEAPON BUILDER ====================
function buildSpriteWeapon(weaponType, armPart, S = 1.0) {
  if (!weaponType || !armPart) return null;
  
  const addAcc = (parent, child, x, y, z) => {
    child.position.set(x, y, z);
    parent.add(child);
    return child;
  };
  
  // Weapon colors
  const C_Blade = 0xffffff;
  const C_Steel = 0x99aacc;
  const C_Wood = 0x5a3a20;
  const C_Gold = 0xffaa00;
  const C_Dark = 0x1a1a1a;
  
  const parts = {};
  
  // SWORDS & BLADES
  if (weaponType === 'sword' || weaponType === 'greatsword' || weaponType === 'dark_blade') {
    const isGreat = weaponType !== 'sword';
    const bladeH = isGreat ? 1.5 : 1.0;
    const bladeW = isGreat ? 0.14 : 0.09;
    const bladeMat = weaponType === 'dark_blade' ? C_Dark : C_Blade;
    
    parts.handle = mkSprite(C_Wood, bladeW * S, bladeH * S);
    addAcc(armPart, parts.handle, 0, -0.4 * S, 0.1);
    parts.blade = mkSprite(bladeMat, (bladeW * 0.8) * S, (bladeH * 0.7) * S);
    addAcc(armPart, parts.blade, 0, (-0.4 - bladeH * 0.5) * S, 0.11);
    parts.guard = mkSprite(C_Gold, 0.3 * S, 0.08 * S);
    addAcc(armPart, parts.guard, 0, (-0.1) * S, 0.11);
    
  } else if (weaponType === 'rapier') {
    parts.handle = mkSprite(C_Wood, 0.06 * S, 0.35 * S);
    addAcc(armPart, parts.handle, 0, -0.15 * S, 0.1);
    parts.blade = mkSprite(C_Blade, 0.04 * S, 1.2 * S);
    addAcc(armPart, parts.blade, 0, -0.7 * S, 0.11);
    parts.guard = mkSprite(C_Gold, 0.2 * S, 0.2 * S, 'circle');
    addAcc(armPart, parts.guard, 0, 0.05 * S, 0.11);
    
  } else if (weaponType === 'katana') {
    parts.handle = mkSprite(C_Dark, 0.07 * S, 0.35 * S);
    addAcc(armPart, parts.handle, 0, -0.15 * S, 0.1);
    parts.blade = mkSprite(C_Blade, 0.07 * S, 1.3 * S);
    addAcc(armPart, parts.blade, 0.04 * S, -0.75 * S, 0.11);
    parts.guard = mkSprite(C_Gold, 0.18 * S, 0.18 * S, 'circle');
    addAcc(armPart, parts.guard, 0, 0.08 * S, 0.11);
    
  } else if (weaponType === 'axe' || weaponType === 'cleaver') {
    const isCleaver = weaponType === 'cleaver';
    parts.handle = mkSprite(C_Wood, 0.1 * S, 1.0 * S);
    addAcc(armPart, parts.handle, 0, -0.4 * S, 0.1);
    if (isCleaver) {
      parts.blade = mkSprite(C_Steel, 0.35 * S, 0.45 * S);
      addAcc(armPart, parts.blade, 0.15 * S, -0.75 * S, 0.11);
    } else {
      parts.blade = mkSprite(C_Steel, 0.4 * S, 0.3 * S, 'tri');
      parts.blade.rotation.z = Math.PI / 2;
      addAcc(armPart, parts.blade, 0.1 * S, -0.8 * S, 0.11);
    }
    
  } else if (weaponType === 'hammer' || weaponType === 'mace') {
    parts.handle = mkSprite(C_Wood, 0.1 * S, 1.0 * S);
    addAcc(armPart, parts.handle, 0, -0.4 * S, 0.1);
    if (weaponType === 'mace') {
      parts.head = mkSprite(C_Steel, 0.25 * S, 0.25 * S, 'circle');
      addAcc(armPart, parts.head, 0, -0.82 * S, 0.11);
    } else {
      parts.head = mkSprite(C_Steel, 0.4 * S, 0.3 * S);
      addAcc(armPart, parts.head, 0, -0.8 * S, 0.11);
    }
    
  } else if (weaponType === 'wrench') {
    parts.handle = mkSprite(0x444444, 0.08 * S, 0.8 * S);
    addAcc(armPart, parts.handle, 0, -0.3 * S, 0.1);
    parts.head = mkSprite(0x444444, 0.3 * S, 0.15 * S);
    addAcc(armPart, parts.head, 0, -0.7 * S, 0.11);
    
  } else if (weaponType === 'spear' || weaponType === 'trident' || weaponType === 'javelin') {
    parts.handle = mkSprite(C_Wood, 0.06 * S, 1.4 * S);
    addAcc(armPart, parts.handle, 0, -0.5 * S, 0.1);
    if (weaponType === 'trident') {
      parts.blade = mkSprite(C_Steel, 0.05 * S, 0.3 * S, 'tri');
      addAcc(armPart, parts.blade, 0, -1.15 * S, 0.11);
      addAcc(armPart, mkSprite(C_Steel, 0.04 * S, 0.2 * S, 'tri'), 0.1 * S, -1.0 * S, 0.11);
      addAcc(armPart, mkSprite(C_Steel, 0.04 * S, 0.2 * S, 'tri'), -0.1 * S, -1.0 * S, 0.11);
    } else {
      parts.blade = mkSprite(C_Steel, 0.07 * S, 0.35 * S, 'tri');
      addAcc(armPart, parts.blade, 0, -1.15 * S, 0.11);
    }
    
  } else if (weaponType === 'scepter' || weaponType === 'void_staff' || weaponType === 'fire_staff' || 
             weaponType === 'sun_staff' || weaponType === 'lightning_rod') {
    const shaftCol = weaponType === 'void_staff' ? C_Dark : C_Wood;
    parts.handle = mkSprite(shaftCol, 0.07 * S, 1.2 * S);
    addAcc(armPart, parts.handle, 0, -0.5 * S, 0.1);
    
    let gemCol = 0x00ffff;
    if (weaponType === 'fire_staff') gemCol = 0xff4400;
    if (weaponType === 'sun_staff') gemCol = 0xffff00;
    if (weaponType === 'void_staff') gemCol = 0xcc00ff;
    if (weaponType === 'lightning_rod') gemCol = 0xffff00;
    
    parts.gem = mkSprite(gemCol, 0.25 * S, 0.25 * S, 'circle');
    addAcc(armPart, parts.gem, 0, -1.15 * S, 0.11);
    
  } else if (weaponType === 'bow' || weaponType === 'crossbow' || weaponType === 'greatbow' || weaponType === 'ice_bow') {
    const bowCol = weaponType === 'ice_bow' ? 0xaaddff : C_Wood;
    if (weaponType === 'crossbow') {
      parts.handle = mkSprite(C_Wood, 0.09 * S, 0.6 * S);
      addAcc(armPart, parts.handle, 0, -0.2 * S, 0.1);
      parts.prod = mkSprite(C_Steel, 0.45 * S, 0.08 * S);
      addAcc(armPart, parts.prod, 0, -0.05 * S, 0.11);
    } else {
      const sz = weaponType === 'greatbow' ? 1.3 : 1.0;
      parts.handle = mkSprite(bowCol, 0.08 * S, sz * S);
      addAcc(armPart, parts.handle, 0, -0.3 * S, 0.1);
    }
    
  } else if (weaponType === 'scythe') {
    parts.handle = mkSprite(C_Wood, 0.07 * S, 1.4 * S);
    addAcc(armPart, parts.handle, 0, -0.5 * S, 0.1);
    parts.blade = mkSprite(C_Steel, 0.5 * S, 0.12 * S);
    addAcc(armPart, parts.blade, 0.2 * S, -1.0 * S, 0.11);
    
  } else if (weaponType === 'flail') {
    parts.handle = mkSprite(C_Wood, 0.07 * S, 0.6 * S);
    addAcc(armPart, parts.handle, 0, -0.25 * S, 0.1);
    parts.chain = mkSprite(C_Steel, 0.02 * S, 0.3 * S);
    addAcc(armPart, parts.chain, 0.05 * S, -0.65 * S, 0.11);
    parts.ball = mkSprite(C_Steel, 0.2 * S, 0.2 * S, 'circle');
    addAcc(armPart, parts.ball, 0.1 * S, -0.85 * S, 0.11);
    
  } else if (weaponType === 'whip') {
    parts.handle = mkSprite(C_Wood, 0.07 * S, 0.3 * S);
    addAcc(armPart, parts.handle, 0, -0.15 * S, 0.1);
    parts.coil = mkSprite(0x8b5a35, 0.2 * S, 0.2 * S, 'circle');
    addAcc(armPart, parts.coil, 0, -0.4 * S, 0.11);
    
  } else if (weaponType === 'boomerang') {
    parts.blade = mkSprite(0xb8860b, 0.5 * S, 0.08 * S);
    addAcc(armPart, parts.blade, 0, -0.3 * S, 0.1);
    
  } else if (weaponType === 'grimoire') {
    parts.book = mkSprite(0x4a0e4e, 0.3 * S, 0.35 * S);
    addAcc(armPart, parts.book, 0, -0.25 * S, 0.1);
    parts.symbol = mkSprite(0xff00ff, 0.15 * S, 0.15 * S, 'circle');
    addAcc(armPart, parts.symbol, 0, -0.25 * S, 0.11);
    
  } else if (weaponType === 'gauntlets') {
    parts.gauntlet = mkSprite(C_Steel, 0.18 * S, 0.25 * S);
    addAcc(armPart, parts.gauntlet, 0, -0.15 * S, 0.1);
    
  } else if (weaponType === 'daggers') {
    parts.blade1 = mkSprite(C_Blade, 0.05 * S, 0.5 * S);
    addAcc(armPart, parts.blade1, -0.08 * S, -0.3 * S, 0.1);
    parts.blade2 = mkSprite(C_Blade, 0.05 * S, 0.5 * S);
    addAcc(armPart, parts.blade2, 0.08 * S, -0.3 * S, 0.1);
    
  } else if (weaponType === 'cards') {
    parts.card = mkSprite(0xffffff, 0.2 * S, 0.28 * S);
    addAcc(armPart, parts.card, 0, -0.2 * S, 0.1);
    parts.symbol = mkSprite(0xff0000, 0.12 * S, 0.12 * S, 'diamond');
    addAcc(armPart, parts.symbol, 0, -0.2 * S, 0.11);
    
  } else if (weaponType === 'pistol' || weaponType === 'rifle' || weaponType === 'revolver') {
    const isRifle = weaponType === 'rifle';
    const len = isRifle ? 0.9 : 0.5;
    parts.barrel = mkSprite(0x444444, 0.07 * S, len * S);
    addAcc(armPart, parts.barrel, 0, -0.3 * S, 0.1);
    parts.grip = mkSprite(C_Wood, 0.1 * S, 0.2 * S);
    addAcc(armPart, parts.grip, 0, 0, 0.1);
    
  } else if (weaponType === 'shuriken') {
    parts.star = mkSprite(C_Steel, 0.25 * S, 0.25 * S, 'diamond');
    addAcc(armPart, parts.star, 0, -0.2 * S, 0.1);
    
  } else if (weaponType === 'runestone') {
    parts.rune = mkSprite(0x6644aa, 0.25 * S, 0.25 * S, 'circle');
    addAcc(armPart, parts.rune, 0, -0.2 * S, 0.1);
    
  } else if (weaponType === 'bomb') {
    parts.bomb = mkSprite(0x222222, 0.25 * S, 0.25 * S, 'circle');
    addAcc(armPart, parts.bomb, 0, -0.2 * S, 0.1);
    parts.fuse = mkSprite(0xff4400, 0.02 * S, 0.15 * S);
    addAcc(armPart, parts.fuse, 0, -0.35 * S, 0.11);
    
  } else if (weaponType === 'totem') {
    parts.totem = mkSprite(C_Wood, 0.15 * S, 0.6 * S);
    addAcc(armPart, parts.totem, 0, -0.3 * S, 0.1);
    parts.face = mkSprite(0xff4400, 0.12 * S, 0.12 * S, 'circle');
    addAcc(armPart, parts.face, 0, -0.45 * S, 0.11);
    
  } else if (weaponType === 'claws') {
    parts.claw1 = mkSprite(C_Steel, 0.04 * S, 0.35 * S, 'tri');
    addAcc(armPart, parts.claw1, -0.08 * S, -0.25 * S, 0.1);
    parts.claw2 = mkSprite(C_Steel, 0.04 * S, 0.35 * S, 'tri');
    addAcc(armPart, parts.claw2, 0.08 * S, -0.25 * S, 0.1);
    
  } else if (weaponType === 'mirror') {
    parts.mirror = mkSprite(0x88aacc, 0.3 * S, 0.4 * S);
    addAcc(armPart, parts.mirror, 0, -0.25 * S, 0.1);
    parts.frame = mkSprite(C_Gold, 0.32 * S, 0.42 * S);
    addAcc(armPart, parts.frame, 0, -0.25 * S, 0.09);
    
  } else if (weaponType === 'needles') {
    parts.needle = mkSprite(C_Steel, 0.02 * S, 0.4 * S);
    addAcc(armPart, parts.needle, 0, -0.25 * S, 0.1);
    
  } else if (weaponType === 'drill') {
    parts.drill = mkSprite(0x444444, 0.12 * S, 0.7 * S);
    addAcc(armPart, parts.drill, 0, -0.35 * S, 0.1);
    parts.bit = mkSprite(C_Steel, 0.08 * S, 0.15 * S, 'tri');
    addAcc(armPart, parts.bit, 0, -0.7 * S, 0.11);
    
  } else if (weaponType === 'star_globe') {
    parts.globe = mkSprite(0x2244aa, 0.3 * S, 0.3 * S, 'circle');
    addAcc(armPart, parts.globe, 0, -0.25 * S, 0.1);
    parts.star = mkSprite(0xffffaa, 0.15 * S, 0.15 * S, 'diamond');
    addAcc(armPart, parts.star, 0, -0.25 * S, 0.11);
    
  } else if (weaponType === 'balls') {
    parts.ball = mkSprite(0xff0055, 0.18 * S, 0.18 * S, 'circle');
    addAcc(armPart, parts.ball, 0, -0.2 * S, 0.1);
    
  } else if (weaponType === 'rock') {
    parts.rock = mkSprite(0x777777, 0.28 * S, 0.28 * S, 'circle');
    addAcc(armPart, parts.rock, 0, -0.25 * S, 0.1);
    
  } else if (weaponType === 'potion' || weaponType === 'blowgun') {
    if (weaponType === 'potion') {
      parts.bottle = mkSprite(0x00ff88, 0.15 * S, 0.3 * S);
      addAcc(armPart, parts.bottle, 0, -0.2 * S, 0.1);
    } else {
      parts.tube = mkSprite(C_Wood, 0.06 * S, 0.6 * S);
      addAcc(armPart, parts.tube, 0, -0.3 * S, 0.1);
    }
    
  } else if (weaponType === 'leaf_blade') {
    parts.blade = mkSprite(0x44aa44, 0.12 * S, 0.9 * S);
    addAcc(armPart, parts.blade, 0, -0.5 * S, 0.1);
    parts.handle = mkSprite(C_Wood, 0.08 * S, 0.3 * S);
    addAcc(armPart, parts.handle, 0, -0.1 * S, 0.1);
    
  } else if (weaponType === 'lute') {
    parts.body = mkSprite(C_Wood, 0.3 * S, 0.35 * S);
    addAcc(armPart, parts.body, 0, -0.25 * S, 0.1);
    parts.neck = mkSprite(C_Wood, 0.08 * S, 0.5 * S);
    addAcc(armPart, parts.neck, 0, -0.6 * S, 0.1);
    
  } else if (weaponType === 'hourglass') {
    parts.glass = mkSprite(0x88ccff, 0.2 * S, 0.35 * S);
    addAcc(armPart, parts.glass, 0, -0.25 * S, 0.1);
    parts.frame = mkSprite(C_Gold, 0.22 * S, 0.05 * S);
    addAcc(armPart, parts.frame, 0, -0.1 * S, 0.11);
    parts.frame2 = mkSprite(C_Gold, 0.22 * S, 0.05 * S);
    addAcc(armPart, parts.frame2, 0, -0.4 * S, 0.11);
    
  } else if (weaponType === 'dagger_sac') {
    parts.blade = mkSprite(C_Steel, 0.06 * S, 0.4 * S);
    addAcc(armPart, parts.blade, 0, -0.25 * S, 0.1);
    parts.handle = mkSprite(0x660000, 0.08 * S, 0.2 * S);
    addAcc(armPart, parts.handle, 0, 0, 0.1);
  }
  
  return parts;
}

// ==================== PLAYER MODEL BUILDER ====================
function buildPlayerModel(cls) {
  if (!cls) return { root: new THREE.Group(), parts: {}, typeData: {} };
  
  // Unique shapes for each character class
  const styles = {
    mage:       { C: 0x3366cc, SK: 0xffccaa, shape: 'mage_robed', eyeC: 0x88ccff, S: 1.0 },
    knight:     { C: 0x8899aa, SK: 0xffccaa, shape: 'knight_plate', eyeC: 0xffffff, S: 1.1 },
    barbarian:  { C: 0x884422, SK: 0xcc8866, shape: 'barbarian_wild', eyeC: 0xff0000, S: 1.25 },
    ranger:     { C: 0x448844, SK: 0xffccaa, shape: 'ranger_archer', eyeC: 0x88ff88, S: 1.0 },
    rogue:      { C: 0x222222, SK: 0xffccaa, shape: 'rogue_shadow', eyeC: 0xffff00, S: 0.9 },
    lancer:     { C: 0x4444aa, SK: 0xffccaa, shape: 'lancer_pike', eyeC: 0xffffff, S: 1.05 },
    paladin:    { C: 0xeeeeee, SK: 0xffccaa, shape: 'paladin_holy', eyeC: 0xffd700, S: 1.2 },
    hunter:     { C: 0x554433, SK: 0xffccaa, shape: 'dragoon', eyeC: 0x44ff44, S: 1.0 },
    necro:      { C: 0x220022, SK: 0xdddddd, shape: 'necro_dark', eyeC: 0x00ff00, S: 0.95 },
    samurai:    { C: 0xaa2222, SK: 0xffccaa, shape: 'samurai_warrior', eyeC: 0x000000, S: 1.0 },
    monk:       { C: 0xffaa00, SK: 0xffccaa, shape: 'monk_martial', eyeC: 0xffffff, S: 1.0 },
    warlock:    { C: 0x440088, SK: 0xccaaff, shape: 'lich', eyeC: 0xff00ff, S: 0.95 },
    tamer:      { C: 0x664422, SK: 0xffccaa, shape: 'monkey', eyeC: 0xffaa00, S: 0.9 },
    gambler:    { C: 0x111111, SK: 0xffccaa, shape: 'gambler_lucky', eyeC: 0xff00aa, S: 1.0 },
    pirate:     { C: 0xaa4444, SK: 0xffccaa, shape: 'pirate_sailor', eyeC: 0x000000, S: 1.05 },
    gladiator:  { C: 0x885522, SK: 0xffccaa, shape: 'gladiator_arena', eyeC: 0xffffff, S: 1.2 },
    sniper:     { C: 0x334433, SK: 0xffccaa, shape: 'tengu', eyeC: 0x00ff00, S: 0.95 },
    ninja:      { C: 0x111111, SK: 0xffccaa, shape: 'ninja_shadow', eyeC: 0xffffff, S: 0.85 },
    voidmage:   { C: 0x220044, SK: 0xaa88ff, shape: 'shade', eyeC: 0x00ffff, S: 1.0 },
    crusader:   { C: 0xdddddd, SK: 0xffccaa, shape: 'crusader_shield', eyeC: 0xff0000, S: 1.2 },
    engineer:   { C: 0xcc6622, SK: 0xffccaa, shape: 'engineer_mech', eyeC: 0x00aaff, S: 0.95 },
    pyro:       { C: 0xaa2200, SK: 0xffccaa, shape: 'oni', eyeC: 0xffaa00, S: 1.0 },
    druid:      { C: 0x226622, SK: 0xffccaa, shape: 'treant', eyeC: 0xaaffaa, S: 1.05 },
    alchemist:  { C: 0x225544, SK: 0xffccaa, shape: 'alchemist_tech', eyeC: 0x00ff88, S: 0.9 },
    bard:       { C: 0xaa2266, SK: 0xffccaa, shape: 'bard_musical', eyeC: 0xffffaa, S: 0.95 },
    valkyrie:   { C: 0x88ccff, SK: 0xffccaa, shape: 'valkyrie_winged', eyeC: 0xffffff, S: 1.1 },
    arbalist:   { C: 0x553322, SK: 0xffccaa, shape: 'banshee', eyeC: 0xffff00, S: 1.0 },
    runemaster: { C: 0x444466, SK: 0xffccaa, shape: 'runemaster_arcane', eyeC: 0x00ffff, S: 1.0 },
    duelist:    { C: 0x332244, SK: 0xffccaa, shape: 'duelist_blade', eyeC: 0xff00ff, S: 0.95 },
    gunner:     { C: 0x443322, SK: 0xffccaa, shape: 'gunner_ranged', eyeC: 0xffaa00, S: 1.0 },
    shaman:     { C: 0x662200, SK: 0xffccaa, shape: 'shaman_tribal', eyeC: 0xff4400, S: 1.05 },
    werewolf:   { C: 0x553322, SK: 0x775544, shape: 'werewolf_beast', eyeC: 0xffaa00, S: 1.15 },
    templar:    { C: 0xeeeeee, SK: 0xffccaa, shape: 'vampire', eyeC: 0x0000ff, S: 1.2 },
    illusionist:{ C: 0x8800aa, SK: 0xffccaa, shape: 'illusionist_mirror', eyeC: 0xff00ff, S: 0.95 },
    cowboy:     { C: 0x664422, SK: 0xffccaa, shape: 'cowboy_gunslinger', eyeC: 0x000000, S: 1.0 },
    witchdoc:   { C: 0x331144, SK: 0x553355, shape: 'witchdoc_voodoo', eyeC: 0x00ff00, S: 0.9 },
    stormcaller:{ C: 0x222266, SK: 0xaaccff, shape: 'djinn', eyeC: 0xffff00, S: 1.0 },
    frostarcher:{ C: 0x44aaff, SK: 0xddeeff, shape: 'yeti', eyeC: 0x00ffff, S: 1.0 },
    cultist:    { C: 0x330000, SK: 0xdddddd, shape: 'cultist_twisted', eyeC: 0xff0000, S: 0.9 },
    mechanic:   { C: 0x555566, SK: 0xffccaa, shape: 'mech', eyeC: 0x00ff00, S: 0.95 },
    astronomer: { C: 0x111133, SK: 0xffccaa, shape: 'astronomer_celestial', eyeC: 0xffffaa, S: 1.0 },
    chef:       { C: 0xffffff, SK: 0xffccaa, shape: 'chef_cook', eyeC: 0x000000, S: 1.1 },
    juggler:    { C: 0xff0055, SK: 0xffccaa, shape: 'juggler_acrobat', eyeC: 0x00ff00, S: 0.95 },
    executioner:{ C: 0x220000, SK: 0xddbb99, shape: 'executioner_heavy', eyeC: 0x000000, S: 1.3 },
    geomancer:  { C: 0x554433, SK: 0x776655, shape: 'geomancer_earth', eyeC: 0x00ff00, S: 1.0 },
    apothecary: { C: 0x224433, SK: 0xffccaa, shape: 'hag', eyeC: 0x88ff88, S: 0.9 },
    kyudo:      { C: 0xeeeeee, SK: 0xffccaa, shape: 'kappa', eyeC: 0x000000, S: 1.0 },
    darkknight: { C: 0x111111, SK: 0x555555, shape: 'darkknight_evil', eyeC: 0xff0000, S: 1.2 },
    sunpriest:  { C: 0xffd700, SK: 0xffccaa, shape: 'sunpriest_radiant', eyeC: 0xffffff, S: 1.05 },
    chronomancer:{ C: 0x00aaaa, SK: 0xffccaa, shape: 'gear', eyeC: 0xffffff, S: 0.95 },
    
    // Shop Characters
    phoenix:    { C: 0xff4400, SK: 0xffaa00, shape: 'phoenix', eyeC: 0xffff00, S: 1.1 },
    minotaur:   { C: 0x553311, SK: 0x442200, shape: 'horned_beast', eyeC: 0xff0000, S: 1.4 },
    siren:      { C: 0x4488ff, SK: 0xaaddff, shape: 'fish', eyeC: 0x00ffff, S: 1.0 },
    golem:      { C: 0x888888, SK: 0x666666, shape: 'stone_golem', eyeC: 0xffaa00, S: 1.5 },
    djinn:      { C: 0x8800ff, SK: 0xcc88ff, shape: 'ghost', eyeC: 0x00ffff, S: 1.2 },
    vampire_lord:{ C: 0x330000, SK: 0xdddddd, shape: 'wraith', eyeC: 0xff0000, S: 1.1 },
    kitsune:    { C: 0xff8833, SK: 0xffccaa, shape: 'fox_spirit', eyeC: 0xffaa00, S: 0.9 },
    angel:      { C: 0xffffff, SK: 0xffeeee, shape: 'seraph', eyeC: 0xffd700, S: 1.15 },
    demon_lord: { C: 0x990000, SK: 0x330000, shape: 'demon', eyeC: 0xff0000, S: 1.3 },
    treant:     { C: 0x664422, SK: 0x886633, shape: 'plant', eyeC: 0x00ff00, S: 1.4 },
    sphinx:     { C: 0xffaa00, SK: 0xffdd88, shape: 'riddle_sphinx', eyeC: 0x0000ff, S: 1.2 },
    banshee:    { C: 0x555577, SK: 0x888899, shape: 'ghost', eyeC: 0x00ffff, S: 1.0 },
    dragonkin:  { C: 0xaa2200, SK: 0xcc5544, shape: 'dragon', eyeC: 0xffaa00, S: 1.3 },
    lich_king:  { C: 0x220033, SK: 0xaaaaaa, shape: 'construct', eyeC: 0x00ff00, S: 1.1 },
    basilisk:   { C: 0x335533, SK: 0x556655, shape: 'serpent', eyeC: 0xff0000, S: 1.2 },
    kraken_slayer:{ C: 0x004488, SK: 0xffccaa, shape: 'human', eyeC: 0x0066ff, S: 1.1 },
    fairy_queen:{ C: 0xff88ff, SK: 0xffddff, shape: 'flyer', eyeC: 0xffffaa, S: 0.7 },
    centaur_archer:{ C: 0x886644, SK: 0xffccaa, shape: 'centaur', eyeC: 0x88ff88, S: 1.2 },
    gargoyle:   { C: 0x555555, SK: 0x666666, shape: 'gargoyle', eyeC: 0xff0000, S: 1.3 },
    elemental_lord:{ C: 0xff6600, SK: 0xffaa44, shape: 'elemental', eyeC: 0xffffff, S: 1.2 },
    mummy:      { C: 0xccaa88, SK: 0xddbb99, shape: 'mummy', eyeC: 0x00ff00, S: 1.1 },
    yeti:       { C: 0xffffff, SK: 0xdddddd, shape: 'elder_beast', eyeC: 0x0088ff, S: 1.4 },
    chimera:    { C: 0x996633, SK: 0xaa7744, shape: 'multi_beast', eyeC: 0xff0000, S: 1.3 },
    pegasus_rider:{ C: 0xeeeeee, SK: 0xffccaa, shape: 'pegasus', eyeC: 0x88ccff, S: 1.1 },
    oni_warrior:{ C: 0xaa0000, SK: 0xffccaa, shape: 'ogre', eyeC: 0xff0000, S: 1.3 },
    medusa:     { C: 0x336633, SK: 0xaaddaa, shape: 'naga', eyeC: 0xffff00, S: 1.1 },
    cerberus:   { C: 0x331111, SK: 0x442222, shape: 'cerberus', eyeC: 0xff0000, S: 1.4 },
    harpy:      { C: 0x664422, SK: 0x886644, shape: 'harpy', eyeC: 0xffaa00, S: 0.9 },
    cyclops:    { C: 0x887766, SK: 0x998877, shape: 'colossus', eyeC: 0x0000ff, S: 1.6 },
    griffin:    { C: 0xaa8844, SK: 0xccaa66, shape: 'griffin', eyeC: 0xffaa00, S: 1.2 },
    wraith:     { C: 0x222244, SK: 0x444466, shape: 'phantom', eyeC: 0xff0000, S: 0.9 },
    archdruid:  { C: 0x446622, SK: 0xffccaa, shape: 'druid_nature', eyeC: 0x00ff00, S: 1.1 },
    frost_giant:{ C: 0xaaddff, SK: 0xccddff, shape: 'ogre', eyeC: 0x00ffff, S: 1.5 },
    thunder_lord:{ C: 0x4444aa, SK: 0xaaccff, shape: 'storm_entity', eyeC: 0xffff00, S: 1.1 },
    sand_golem: { C: 0xddbb88, SK: 0xccaa77, shape: 'sand_dune', eyeC: 0xffaa00, S: 1.3 },
    blood_knight:{ C: 0x660000, SK: 0xffccaa, shape: 'scarlet_warrior', eyeC: 0xff0000, S: 1.2 },
    moonlight_assassin:{ C: 0x222244, SK: 0xffccaa, shape: 'shadow_stalker', eyeC: 0xaaaaff, S: 0.9 },
    crystal_mage:{ C: 0x88ccff, SK: 0xaaddff, shape: 'crystal_sage', eyeC: 0x00ffff, S: 1.0 },
    void_reaper:{ C: 0x110022, SK: 0x332244, shape: 'shadow', eyeC: 0x8800ff, S: 1.1 },
    lava_titan: { C: 0xff4400, SK: 0xcc3300, shape: 'lava_golem', eyeC: 0xffff00, S: 1.5 },
    star_guardian:{ C: 0x2244aa, SK: 0xffccaa, shape: 'flyer', eyeC: 0xffffaa, S: 1.1 },
    shadow_dancer:{ C: 0x111111, SK: 0x333333, shape: 'shadow_whirlwind', eyeC: 0xff00ff, S: 0.85 },
    nature_spirit:{ C: 0x88ff88, SK: 0xaaffaa, shape: 'grove_spirit', eyeC: 0x00ff00, S: 1.0 },
    chaos_mage: { C: 0x884488, SK: 0xffccaa, shape: 'entropy_mage', eyeC: 0xff00ff, S: 1.0 },
    samurai_lord:{ C: 0x880000, SK: 0xffccaa, shape: 'dino', eyeC: 0x000000, S: 1.1 },
    plague_doctor:{ C: 0x222222, SK: 0xffccaa, shape: 'mummy', eyeC: 0x00ff00, S: 1.0 },
    time_knight:{ C: 0x0088aa, SK: 0xffccaa, shape: 'chrono_warrior', eyeC: 0x00ffff, S: 1.1 },
    necro_lord: { C: 0x220022, SK: 0x444444, shape: 'specter', eyeC: 0x00ff00, S: 1.1 },
    battle_bard:{ C: 0xaa4488, SK: 0xffccaa, shape: 'human', eyeC: 0xffaa00, S: 1.0 },
    arcane_archer:{ C: 0x6644aa, SK: 0xffccaa, shape: 'spider', eyeC: 0xaa00ff, S: 1.0 },
    berserker:  { C: 0x884422, SK: 0xcc6644, shape: 'frenzy_warrior', eyeC: 0xff0000, S: 1.35 }
  };

  // Valeurs par défaut
  let def = styles[cls.id] || { C: 0x4488ff, SK: 0xffccaa, shape: 'human', eyeC: 0xffffff };
  
  // Gestion des boss jouables (si applicable)
  if (cls.id.startsWith('boss_')) {
      let bossType = null;
      if (cls.linkedBiome && typeof BIOMES !== 'undefined') {
          const biome = BIOMES.find(b => b.id === cls.linkedBiome);
          if (biome && biome.boss && typeof MTYPES !== 'undefined') {
              bossType = MTYPES.find(m => m.name === biome.boss);
          }
      }
      if (!bossType && typeof MTYPES !== 'undefined') {
          bossType = MTYPES.find(m => m.name === cls.name);
      }
      if (bossType) {
          def = { C: bossType.C, SK: bossType.SK, shape: bossType.shape, eyeC: bossType.eyeC || 0xff0000, S: Math.max(1.0, (bossType.S || 1.0) * 0.6) };
      } else {
          def = { C: 0x550000, SK: 0xaa5555, shape: 'human', eyeC: 0xff0000, S: 1.2 };
      }
  }

  const typeData = {
    name: cls.name,
    shape: def.shape,
    C: def.C,
    SK: def.SK,
    S: def.S || 1.0,
    eyeC: def.eyeC,
    wep: cls.wep || null
  };

  const { g, p } = buildPuppet(typeData);
  return { root: g, parts: p, typeData: typeData };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Monster, buildPuppet, animPuppet, buildPlayerModel };
}
