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
    // Use relative squash/stretch factors; absolute scaling here would double-apply size and sink the slime.
    const sy = 1 - sq;
    const sx = 1 + sq;
    p.torso.scale.set(sx, sy, 1);
    p.torso.position.y = 0.6 * S * sy;
    if (p.core) p.core.position.y = 0.6 * S * sy;
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

