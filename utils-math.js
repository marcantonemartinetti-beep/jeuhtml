// ═══════════════════════════════════════════════
// DUNGEON WORLD - Math Utilities (Noise Functions)
// ═══════════════════════════════════════════════

// ==================== NOISE FUNCTIONS ====================
var SEED = 12345;

function hash(n) {
  let x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function mix(a, b, t) {
  const u = t * t * (3 - 2 * t);
  return a + (b - a) * u;
}

function noise2(x, z) {
  const X = x + SEED, Z = z + SEED;
  const ix = Math.floor(X), iz = Math.floor(Z), fx = X - ix, fz = Z - iz;
  const a = hash(ix + iz * 397), b = hash(ix + 1 + iz * 397), c = hash(ix + (iz + 1) * 397), d = hash(ix + 1 + (iz + 1) * 397);
  return mix(mix(a, b, fx), mix(c, d, fx), fz);
}

function octave(x, z, oct, lac, gain) {
  let v = 0, amp = 1, freq = 1, mx = 0;
  for (let i = 0; i < oct; i++) {
    v += noise2(x * freq, z * freq) * amp;
    mx += amp;
    amp *= gain;
    freq *= lac;
  }
  return v / mx;
}
