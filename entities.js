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
    if (Math.random() < 0.3 || name.includes('Démon') || name.includes('Minotaure')) {
      const h = mkSprite(0xdddddd, 0.15 * S, 0.5 * S, 'tri');
      addAcc(p.head, h, -0.2 * S, 0.4 * S, -0.01);
      const h2 = mkSprite(0xdddddd, 0.15 * S, 0.5 * S, 'tri');
      addAcc(p.head, h2, 0.2 * S, 0.4 * S, -0.01);
    }
    if (Math.random() < 0.3 || isConstruct || hasWeapon) {
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
    if (hasWeapon) {
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
    if (hasStaff) {
      const st = mkSprite(0x553311, 0.1 * S, 1.2 * S);
      addAcc(p.armRD, st, 0, -0.3 * S, 0.1);
      p.weapon = st;
      const gem = mkSprite(eyeC, 0.3 * S, 0.3 * S, 'diamond');
      addAcc(p.armRD, gem, 0, 0.4 * S, 0.11);
      p.weapon2 = gem;
    }
    if (isArcher) {
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
  } else { // human
    const isBeast = shape === 'beast';
    const by = isBeast ? 1.1 : 1.5;
    const hy = isBeast ? 1.6 : 2.25;
    p.torso.position.y = by * S + bob;
    p.head.position.y = hy * S + bob;

    if (isBeast) {
      p.armLU.position.y = 0.5 * S + w1 * amp;
      p.armRU.position.y = 0.5 * S + w2 * amp;
      p.legLU.position.y = 0.5 * S + w2 * amp;
      p.legRU.position.y = 0.5 * S + w1 * amp;
    } else {
      if (p.legLU) {
        p.legLU.position.y = 0.90 * S + w1 * amp;
        p.legRU.position.y = 0.90 * S + w2 * amp;
        p.legLD.position.y = 0.36 * S + w1 * amp * 0.8;
        p.legRD.position.y = 0.36 * S + w2 * amp * 0.8;
      }
      p.armLU.position.y = 1.72 * S + w2 * amp;
      p.armRU.position.y = 1.72 * S + w1 * amp;
      p.armLD.position.y = 1.15 * S + w2 * amp * 0.8;
      p.armRD.position.y = 1.15 * S + w1 * amp * 0.8;
      p.armLD.position.x = -0.68 * S + w2 * amp * 0.3;
      p.armRD.position.x = 0.68 * S + w1 * amp * 0.3;

      if (p.wingL) {
        const fl = Math.sin(t * 10);
        p.wingL.scale.x = 1.2 * S * (1 + fl * 0.3);
        p.wingR.scale.x = 1.2 * S * (1 + fl * 0.3);
      }
    }
  }
}

// ==================== MONSTER CLASS ====================
class Monster {
  constructor(x, z, ti = null) {
    let typeData;
    if (ti !== null) typeData = MTYPES[ti];
    else if(GameState.pBiome && GameState.pBiome.id === 'omega') {
         const candidates = MTYPES.filter(m => m.hp < 2000); // Exclude bosses
         typeData = candidates[Math.floor(Math.random()*candidates.length)];
      } else {
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

    this.T.hp *= diffMult;
    this.T.dmg *= diffMult;
    this.xpVal = Math.floor(100 * diff * (this.baseTint !== 0xffffff ? 1.5 : 1));
    if (GameState.pBiome) this.xpVal = Math.floor(this.xpVal * GameState.pBiome.diff);

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

    const bw = 1.2 * this.T.S;
    this.hBg = new THREE.Mesh(GEOS.quad, MATS.hpBg);
    this.hBg.scale.set(bw, 0.1, 1);
    this.hBg.position.set(0, 2.9 * this.T.S, 0);
    this.hBg.renderOrder = 999;
    this.root.add(this.hBg);
    this.hFill = new THREE.Mesh(GEOS.quad, MATS.hpFill);
    this.hFill.scale.set(bw, 0.1, 1);
    this.hFill.position.set(0, 2.9 * this.T.S, 0.01);
    this.hFill.renderOrder = 1000;
    this.root.add(this.hFill);
    this.bw = bw;

    this.root.position.set(x, terrainH(x, z), z);
    scene.add(this.root);
  }

  makeBoss() {
    const diff = 0.6 + GameState.pT / 180;
    this.boss = true;
    this.hp = this.mhp = 400 * diff;
    this.T = { ...this.T, dmg: 20 * diff, spd: 1.2 };
    this.xpVal = 800 * diff;
    this.root.scale.setScalar(1.8);
    this.baseTint = 0xff3300;
    Object.values(this.p).forEach(s => s.material.color.setHex(this.baseTint));
  }

  makeFinalBoss() {
    this.boss = true;
    this.finalBoss = true;
    this.hp = this.mhp = 60000;
    this.T = { ...this.T, dmg: 80, spd: 3.5 };
    this.xpVal = 100000;
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
      this.hBg.visible = false;
      this.hFill.visible = false;
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

    // LOD
    const lodHigh = dist < 25;
    const lodMed = dist < 50;
    this.root.visible = dist < 90;
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
    }

    if (lodHigh || (lodMed && Math.floor(this.t * 60) % 3 === 0) || Math.floor(this.t * 60) % 6 === 0) {
      animPuppet(this.p, this.t, mv, this.T.S, this.T.shape);
    }

    if (lodHigh && this.bleed.length && !this.dead && Math.random() < 0.2) {
      const b = this.bleed[Math.floor(Math.random() * this.bleed.length)];
      b.getWorldPosition(_v1);
      spawnPart(_v1, 0x880000, 1, 1);
    }

    Object.values(this.p).forEach(s => {
      if (s.visible) s.material.color.setHex(this.flash > 0 ? 0xff7777 : this.baseTint);
    });

    this.hBg.lookAt(camera.position);
    this.hFill.lookAt(camera.position);
    const pct = Math.max(0, this.hp / this.mhp);

    if (lodMed || Math.floor(this.t * 60) % 10 === 0) {
      this.hFill.scale.x = pct;
      this.hFill.position.x = -(1 - pct) * this.bw * 0.5;
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

// ==================== PLAYER MODEL BUILDER ====================
function buildPlayerModel(cls) {
  if (!cls) return { root: new THREE.Group(), parts: {}, typeData: {} };
  
  // Définition des styles par classe
  const styles = {
    mage:       { C: 0x3366cc, SK: 0xffccaa, shape: 'human', eyeC: 0x88ccff, S: 1.0 },
    knight:     { C: 0x8899aa, SK: 0xffccaa, shape: 'human', eyeC: 0xffffff, S: 1.1 },
    barbarian:  { C: 0x884422, SK: 0xcc8866, shape: 'human', eyeC: 0xff0000, S: 1.25 },
    ranger:     { C: 0x448844, SK: 0xffccaa, shape: 'human', eyeC: 0x88ff88, S: 1.0 },
    rogue:      { C: 0x222222, SK: 0xffccaa, shape: 'human', eyeC: 0xffff00, S: 0.9 },
    lancer:     { C: 0x4444aa, SK: 0xffccaa, shape: 'human', eyeC: 0xffffff, S: 1.05 },
    paladin:    { C: 0xeeeeee, SK: 0xffccaa, shape: 'human', eyeC: 0xffd700, S: 1.2 },
    hunter:     { C: 0x554433, SK: 0xffccaa, shape: 'human', eyeC: 0x44ff44, S: 1.0 },
    necro:      { C: 0x220022, SK: 0xdddddd, shape: 'human', eyeC: 0x00ff00, S: 0.95 },
    samurai:    { C: 0xaa2222, SK: 0xffccaa, shape: 'human', eyeC: 0x000000, S: 1.0 },
    monk:       { C: 0xffaa00, SK: 0xffccaa, shape: 'human', eyeC: 0xffffff, S: 1.0 },
    warlock:    { C: 0x440088, SK: 0xccaaff, shape: 'human', eyeC: 0xff00ff, S: 0.95 },
    tamer:      { C: 0x664422, SK: 0xffccaa, shape: 'human', eyeC: 0xffaa00, S: 0.9 },
    gambler:    { C: 0x111111, SK: 0xffccaa, shape: 'human', eyeC: 0xff00aa, S: 1.0 },
    pirate:     { C: 0xaa4444, SK: 0xffccaa, shape: 'human', eyeC: 0x000000, S: 1.05 },
    gladiator:  { C: 0x885522, SK: 0xffccaa, shape: 'human', eyeC: 0xffffff, S: 1.2 },
    sniper:     { C: 0x334433, SK: 0xffccaa, shape: 'human', eyeC: 0x00ff00, S: 0.95 },
    ninja:      { C: 0x111111, SK: 0xffccaa, shape: 'human', eyeC: 0xffffff, S: 0.85 },
    voidmage:   { C: 0x220044, SK: 0xaa88ff, shape: 'human', eyeC: 0x00ffff, S: 1.0 },
    crusader:   { C: 0xdddddd, SK: 0xffccaa, shape: 'human', eyeC: 0xff0000, S: 1.2 },
    engineer:   { C: 0xcc6622, SK: 0xffccaa, shape: 'human', eyeC: 0x00aaff, S: 0.9 },
    pyro:       { C: 0xaa2200, SK: 0xffccaa, shape: 'human', eyeC: 0xffaa00, S: 1.0 },
    druid:      { C: 0x226622, SK: 0xffccaa, shape: 'human', eyeC: 0xaaffaa, S: 1.05 },
    alchemist:  { C: 0x225544, SK: 0xffccaa, shape: 'human', eyeC: 0x00ff88, S: 0.9 },
    bard:       { C: 0xaa2266, SK: 0xffccaa, shape: 'human', eyeC: 0xffffaa, S: 0.95 },
    valkyrie:   { C: 0x88ccff, SK: 0xffccaa, shape: 'human', eyeC: 0xffffff, S: 1.1 },
    arbalist:   { C: 0x553322, SK: 0xffccaa, shape: 'human', eyeC: 0xffff00, S: 1.0 },
    runemaster: { C: 0x444466, SK: 0xffccaa, shape: 'human', eyeC: 0x00ffff, S: 1.0 },
    duelist:    { C: 0x332244, SK: 0xffccaa, shape: 'human', eyeC: 0xff00ff, S: 0.95 },
    gunner:     { C: 0x443322, SK: 0xffccaa, shape: 'human', eyeC: 0xffaa00, S: 1.0 },
    shaman:     { C: 0x662200, SK: 0xffccaa, shape: 'human', eyeC: 0xff4400, S: 1.05 },
    werewolf:   { C: 0x553322, SK: 0x775544, shape: 'beast', eyeC: 0xffaa00, S: 1.15 },
    templar:    { C: 0xeeeeee, SK: 0xffccaa, shape: 'human', eyeC: 0x0000ff, S: 1.2 },
    illusionist:{ C: 0x8800aa, SK: 0xffccaa, shape: 'human', eyeC: 0xff00ff, S: 0.95 },
    cowboy:     { C: 0x664422, SK: 0xffccaa, shape: 'human', eyeC: 0x000000, S: 1.0 },
    witchdoc:   { C: 0x331144, SK: 0x553355, shape: 'human', eyeC: 0x00ff00, S: 0.9 },
    stormcaller:{ C: 0x222266, SK: 0xaaccff, shape: 'human', eyeC: 0xffff00, S: 1.0 },
    frostarcher:{ C: 0x44aaff, SK: 0xddeeff, shape: 'human', eyeC: 0x00ffff, S: 1.0 },
    cultist:    { C: 0x330000, SK: 0xdddddd, shape: 'human', eyeC: 0xff0000, S: 0.9 },
    mechanic:   { C: 0x555566, SK: 0xffccaa, shape: 'human', eyeC: 0x00ff00, S: 0.95 },
    astronomer: { C: 0x111133, SK: 0xffccaa, shape: 'human', eyeC: 0xffffaa, S: 1.0 },
    chef:       { C: 0xffffff, SK: 0xffccaa, shape: 'human', eyeC: 0x000000, S: 1.1 },
    juggler:    { C: 0xff0055, SK: 0xffccaa, shape: 'human', eyeC: 0x00ff00, S: 0.95 },
    executioner:{ C: 0x220000, SK: 0xddbb99, shape: 'human', eyeC: 0x000000, S: 1.3 },
    geomancer:  { C: 0x554433, SK: 0x776655, shape: 'human', eyeC: 0x00ff00, S: 1.0 },
    apothecary: { C: 0x224433, SK: 0xffccaa, shape: 'human', eyeC: 0x88ff88, S: 0.9 },
    kyudo:      { C: 0xeeeeee, SK: 0xffccaa, shape: 'human', eyeC: 0x000000, S: 1.0 },
    darkknight: { C: 0x111111, SK: 0x555555, shape: 'human', eyeC: 0xff0000, S: 1.2 },
    sunpriest:  { C: 0xffd700, SK: 0xffccaa, shape: 'human', eyeC: 0xffffff, S: 1.05 },
    chronomancer:{ C: 0x00aaaa, SK: 0xffccaa, shape: 'human', eyeC: 0xffffff, S: 0.95 }
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
    eyeC: def.eyeC
  };

  const { g, p } = buildPuppet(typeData);
  return { root: g, parts: p, typeData: typeData };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Monster, buildPuppet, animPuppet, buildPlayerModel };
}
