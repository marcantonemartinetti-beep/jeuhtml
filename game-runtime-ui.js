// ═══════════════════════════════════════════════
// DUNGEON WORLD - Runtime UI Helpers
// ═══════════════════════════════════════════════

// ==================== MINIMAP ====================
function drawMinimap() {
  if (!minimapCtx) return;
  const ctx = minimapCtx, w = 120, h = 120, cx = w / 2, cy = h / 2, scale = 1.5;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0f0';
  ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
  const pp = playerPivot.position;
  ctx.fillStyle = '#f00';
  monsters.forEach(m => { if (m.dead) return; const dx = (m.root.position.x - pp.x) * scale, dz = (m.root.position.z - pp.z) * scale; if (dx * dx + dz * dz < (w / 2) * (w / 2)) { ctx.beginPath(); ctx.arc(cx + dx, cy + dz, 2, 0, Math.PI * 2); ctx.fill(); } });
  ctx.fillStyle = '#fd0';
  chests.forEach(c => { const dx = (c.m.position.x - pp.x) * scale, dz = (c.m.position.z - pp.z) * scale; if (dx * dx + dz * dz < (w / 2) * (w / 2)) { ctx.beginPath(); ctx.arc(cx + dx, cy + dz, 3, 0, Math.PI * 2); ctx.fill(); } });
}

// ==================== BOSS POINTER ====================
function updateBossPointer() {
  const pointer = document.getElementById('bossPointer');
  if (!pointer) return;

  const boss = monsters.find(m => (m.boss || m.finalBoss) && !m.dead);

  if (!boss) {
    pointer.style.display = 'none';
    return;
  }

  const pp = playerPivot.position;
  const bp = boss.root.position;
  const dx = bp.x - pp.x;
  const dz = bp.z - pp.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist < 15) {
    pointer.style.display = 'none';
    return;
  }

  pointer.style.display = 'block';

  const angleToBoss = Math.atan2(dx, dz);
  const angleFromView = angleToBoss - camYaw;

  let normalizedAngle = angleFromView;
  while (normalizedAngle > Math.PI) normalizedAngle -= Math.PI * 2;
  while (normalizedAngle < -Math.PI) normalizedAngle += Math.PI * 2;

  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const edgeMargin = 60;

  const screenAngle = normalizedAngle + Math.PI / 2;
  const radius = Math.min(screenW, screenH) * 0.4;

  let x = screenW / 2 + Math.cos(screenAngle) * radius;
  let y = screenH / 2 - Math.sin(screenAngle) * radius;

  x = Math.max(edgeMargin, Math.min(screenW - edgeMargin, x));
  y = Math.max(edgeMargin, Math.min(screenH - edgeMargin, y));

  pointer.style.left = x + 'px';
  pointer.style.top = y + 'px';

  const arrowRotation = (-normalizedAngle * 180 / Math.PI) - 90;
  pointer.querySelector('.boss-arrow').style.transform = 'rotate(' + arrowRotation + 'deg)';

  const distText = Math.floor(dist) + 'm';
  pointer.querySelector('.boss-dist').textContent = distText;
}
