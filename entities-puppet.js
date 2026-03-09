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
  const {
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
  } = getPuppetTraits(name, shape);

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
    p.halo = mkSprite(0xffd700, 0.9 * S, 0.15 * S, 'circle'); p.halo.position.y = 2.9 * S; p.halo.material.opacity = 0.4; p.halo.material.transparent = true; g.add(p.halo);
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

