import { MOD289_2, MOD289_3, PERMUTE_3 } from "./utils.wgsl.js";

const WORLEY2D = /* wgsl */ `
// https://github.com/ashima/webgl-noise
${MOD289_2}
${MOD289_3}
${PERMUTE_3}

// Modulo 7 without a division
fn mod7(x: vec3<f32>) -> vec3<f32> {
  return x - floor(x * (1.0 / 7.0)) * 7.0;
}

// Cellular noise, returning F1 and F2 in a vec2.
// Standard 3x3 search window for good F1 and F2 values
fn worley2d(P: vec2<f32>) -> vec2<f32> {
  let K = 0.142857142857; // 1/7
  let Ko = 0.428571428571; // 3/7
  let jitter = 1.0; // Less gives more regular pattern

  let Pi = mod289_2(floor(P));
  let Pf = fract(P);

  var oi = vec3<f32>(-1.0, 0.0, 1.0);
  var of = vec3<f32>(-0.5, 0.5, 1.5);

  var px = permute_3(Pi.x + oi);
  var p = permute_3(px.x + Pi.y + oi); // p11, p12, p13

  var ox = fract(p * K) - Ko;
  var oy = mod7(floor(p * K)) * K - Ko;
  var dx = Pf.x + 0.5 + jitter * ox;
  var dy = Pf.y - of + jitter * oy;

  var d1 = dx * dx + dy * dy; // d11, d12 and d13, squared
  p = permute_3(px.y + Pi.y + oi); // p21, p22, p23
  ox = fract(p * K) - Ko;
  oy = mod7(floor(p * K)) * K - Ko;
  dx = Pf.x - 0.5 + jitter * ox;
  dy = Pf.y - of + jitter * oy;
  var d2 = dx * dx + dy * dy; // d21, d22 and d23, squared
  p = permute_3(px.z + Pi.y + oi); // p31, p32, p33
  ox = fract(p * K) - Ko;
  oy = mod7(floor(p * K)) * K - Ko;
  dx = Pf.x - 1.5 + jitter * ox;
  dy = Pf.y - of + jitter * oy;
  var d3 = dx * dx + dy * dy; // d31, d32 and d33, squared
  // Sort out the two smallest distances (F1, F2)
  var d1a = min(d1, d2);
  d2 = max(d1, d2); // Swap to keep candidates for F2
  d2 = min(d2, d3); // neither F1 nor F2 are now in d3
  d1 = min(d1a, d2); // F1 is now in d1
  d2 = max(d1a, d2); // Swap to keep candidates for F2

  // Swap if smaller
  if (d1.x >= d1.y) {
    let x = d1.x;
    d1.x = d1.y;
    d1.y = x;
  }

  // F1 is in d1.x
  if (d1.x >= d1.z) {
    let x = d1.x;
    d1.x = d1.z;
    d1.z = x;
  }

  d1.y = min(d1.y, d2.y); // F2 is now not in d2.yz
  d1.z = min(d1.z, d2.z); // F2 is now not in d2.yz
  d1.y = min(d1.y, d1.z); // nor in  d1.z
  d1.y = min(d1.y, d2.x); // F2 is in d1.y, we're done.

  return sqrt(d1.xy);
}
`;

export default {
  WORLEY2D,
};
