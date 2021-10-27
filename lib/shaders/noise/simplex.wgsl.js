import { MOD289_1, MOD289_2, MOD289_3, MOD289_4, PERMUTE_1, PERMUTE_3, PERMUTE_4, TAYLOR_INV_SQRT_1, TAYLOR_INV_SQRT_4, } from "./utils.wgsl.js";
const SNOISE2D = /* wgsl */ `
// https://github.com/ashima/webgl-noise
${MOD289_2}
${MOD289_3}
${PERMUTE_3}

fn snoise2d(v: vec2<f32>) -> f32 {
  let C = vec4<f32>(
    0.211324865405187, // (3.0-sqrt(3.0))/6.0
    0.366025403784439, // 0.5*(sqrt(3.0)-1.0)
    -0.577350269189626, // -1.0 + 2.0 * C.x
    0.024390243902439 // 1.0 / 41.0
  );

  // First corner
  var i  = floor(v + dot(v, C.yy));
  let x0 = v - i + dot(i, C.xx);

  // Other corners
  var i1: vec2<f32>;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  if (x0.x > x0.y) {
    i1 = vec2<f32>(1.0, 0.0);
  } else {
    i1 = vec2<f32>(0.0, 1.0);
  }
  // i1 = (x0.x > x0.y) ? vec2<f32>(1.0, 0.0) : vec2<f32>(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  var x12 = x0.xyxy + C.xxzz;
  // x12.x = x12.x - i1.x;
  // x12.y = x12.y - i1.y;
  x12 = vec4<f32>(x12.x - i1.x, x12.y - i1.y, x12.z, x12.w);

  // Permutations
  i = mod289_2(i); // Avoid truncation effects in permutation
  let p = permute(permute(i.y + vec3<f32>(0.0, i1.y, 1.0)) + i.x + vec3<f32>(0.0, i1.x, 1.0));

  var m = max(vec3<f32>(0.5) - vec3<f32>(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), vec3<f32>(0.0));
  m = m * m;
  m = m * m;

  // Gradients: 41 points uniformly over a line, mapped onto a diamond.
  // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
  let x = 2.0 * fract(p * C.www) - 1.0;
  let h = abs(x) - 0.5;
  let ox = floor(x + 0.5);
  let a0 = x - ox;

  // Normalise gradients implicitly by scaling m
  // Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m = m * (1.79284291400159 - 0.85373472095314 * (a0*a0 + h * h));

  // Compute final noise value at P
  var g: vec3<f32>;
  g.x  = a0.x  * x0.x + h.x * x0.y;
  let gyz = a0.yz * x12.xz + h.yz * x12.yw;
  g = vec3<f32>(g.x, gyz.x, gyz.y);
  return 130.0 * dot(m, g);
}
`;
const SNOISE3D = /* wgsl */ `
// https://github.com/ashima/webgl-noise
${MOD289_3}
${MOD289_4}
${PERMUTE_4}
${TAYLOR_INV_SQRT_4}

fn snoise3d(v: vec3<f32>) -> f32 {
  let C = vec2<f32>(1.0 / 6.0, 1.0 / 3.0) ;
  let D = vec4<f32>(0.0, 0.5, 1.0, 2.0);

  // First corner
  var i = floor(v + dot(v, C.yyy));
  let x0 = v - i + dot(i, C.xxx);

  // Other corners
  let g = step(x0.yzx, x0.xyz);
  let l = 1.0 - g;
  let i1 = min( g.xyz, l.zxy );
  let i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  let x1 = x0 - i1 + C.xxx;
  let x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  let x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289_3(i);
  let p = permute_4(
    permute_4(
      permute_4(i.z + vec4<f32>(0.0, i1.z, i2.z, 1.0)) + i.y + vec4<f32>(0.0, i1.y, i2.y, 1.0)
    ) + i.x + vec4<f32>(0.0, i1.x, i2.x, 1.0)
  );

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  let n_ = 0.142857142857; // 1.0/7.0
  let  ns = n_ * D.wyz - D.xzx;

  let j = p - 49.0 * floor(p * ns.z * ns.z); // mod(p, 7 * 7)

  let x_ = floor(j * ns.z);
  let y_ = floor(j - 7.0 * x_); // mod(j, N)

  let x = x_ * ns.x + ns.yyyy;
  let y = y_ * ns.x + ns.yyyy;
  let h = 1.0 - abs(x) - abs(y);

  let b0 = vec4<f32>(x.xy, y.xy);
  let b1 = vec4<f32>(x.zw, y.zw);

  // let s0 = vec4<f32>(lessThan(b0,0.0))*2.0 - 1.0;
  // let s1 = vec4<f32>(lessThan(b1,0.0))*2.0 - 1.0;
  let s0 = floor(b0) * 2.0 + 1.0;
  let s1 = floor(b1) * 2.0 + 1.0;
  let sh = -step(h, vec4<f32>(0.0));

  let a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  let a1 = b1.xzyw + s1.xzyw*sh.zzww;

  var p0 = vec3<f32>(a0.xy, h.x);
  var p1 = vec3<f32>(a0.zw, h.y);
  var p2 = vec3<f32>(a1.xy, h.z);
  var p3 = vec3<f32>(a1.zw, h.w);

  // Normalise gradients
  let norm = taylorInvSqrt_4(vec4<f32>(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 = p0 * norm.x;
  p1 = p1 * norm.y;
  p2 = p2 * norm.z;
  p3 = p3 * norm.w;

  // Mix final noise value
  var m = max(0.6 - vec4<f32>(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), vec4<f32>(0.0));
  m = m * m;

  return 42.0 * dot(
    m * m,
    vec4<f32>(dot(p0, x0), dot(p1,x1), dot(p2,x2), dot(p3,x3))
  );
}`;
const SNOISE4D = /* wgsl */ `
// https://github.com/ashima/webgl-noise
${MOD289_1}
${MOD289_4}
${PERMUTE_1}
${PERMUTE_4}
${TAYLOR_INV_SQRT_1}
${TAYLOR_INV_SQRT_4}

fn grad4(j: f32, ip: vec4<f32>) -> vec4<f32> {
  let ones = vec4<f32>(1.0, 1.0, 1.0, -1.0);
  var p: vec4<f32>;
  var s: vec4<f32>;

  var pxyz = floor(fract(vec3<f32>(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p = vec4<f32>(pxyz.x, pxyz.y, pxyz.z, 1.5 - dot(abs(pxyz), ones.xyz));
  s = vec4<f32>(f32(p.x < 0.0), f32(p.y < 0.0), f32(p.z < 0.0), f32(p.w < 0.0));
  pxyz = p.xyz + (s.xyz * 2.0 - 1.0) * s.www;

  return vec4<f32>(pxyz.x, pxyz.y, pxyz.z, p.w);
}

// (sqrt(5) - 1)/4 = F4, used once below
let F4 = 0.309016994374947451;

fn snoise(v: vec4<f32>) -> f32 {
  let C = vec4<f32>(
    0.138196601125011, // (5 - sqrt(5))/20  G4
    0.276393202250021, // 2 * G4
    0.414589803375032, // 3 * G4
    -0.447213595499958 // -1 + 4 * G4
  );

  // First corner
  var i  = floor(v + dot(v, vec4<f32>(F4)));
  let x0 = v - i + dot(i, C.xxxx);

  // Other corners
  // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  var i0: vec4<f32>;
  let isX = step(x0.yzw, x0.xxx);
  let isYZ = step(x0.zww, x0.yyz);
  //  i0.x = dot(isX, vec3<f32>(1.0));
  i0.x = isX.x + isX.y + isX.z;

  i0.y = 1.0 - isX.x;
  i0.z = 1.0 - isX.y;
  i0.w = 1.0 - isX.z;

  // i0.y +=dot(isYZ.xy, vec2<f32>( 1.0 ) );
  i0.y = i0.y + (isYZ.x + isYZ.y);

  i0.z = i0.z + (1.0 - isYZ.x);
  i0.w = i0.w + (1.0 - isYZ.y);

  i0.z = i0.z + (isYZ.z);
  i0.w = i0.w + (1.0 - isYZ.z);

  // i0 now contains the unique values 0,1,2,3 in each channel
  let i3 = clamp(i0, vec4<f32>(0.0), vec4<f32>(1.0));
  let i2 = clamp(i0 - 1.0, vec4<f32>(0.0), vec4<f32>(1.0));
  let i1 = clamp(i0 - 2.0, vec4<f32>(0.0), vec4<f32>(1.0));

  //  x0 = x0 - 0.0 + 0.0 * C.xxxx
  //  x1 = x0 - i1  + 1.0 * C.xxxx
  //  x2 = x0 - i2  + 2.0 * C.xxxx
  //  x3 = x0 - i3  + 3.0 * C.xxxx
  //  x4 = x0 - 1.0 + 4.0 * C.xxxx
  let x1 = x0 - i1 + C.xxxx;
  let x2 = x0 - i2 + C.yyyy;
  let x3 = x0 - i3 + C.zzzz;
  let x4 = x0 + C.wwww;

  // Permutations
  i = mod289_4(i);
  let j0 = permute_1(permute_1(permute_1(permute_1(i.w) + i.z) + i.y) + i.x);
  let j1 = permute_4(
    permute_4(
      permute_4(
        permute_4(i.w + vec4<f32>(i1.w, i2.w, i3.w, 1.0))
           + i.z + vec4<f32>(i1.z, i2.z, i3.z, 1.0)
      ) + i.y + vec4<f32>(i1.y, i2.y, i3.y, 1.0)
    ) + i.x + vec4<f32>(i1.x, i2.x, i3.x, 1.0)
  );

  // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
  // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  let ip = vec4<f32>(1.0 / 294.0, 1.0 / 49.0, 1.0 / 7.0, 0.0);

  var p0 = grad4(j0, ip);
  var p1 = grad4(j1.x, ip);
  var p2 = grad4(j1.y, ip);
  var p3 = grad4(j1.z, ip);
  var p4 = grad4(j1.w, ip);

  // Normalise gradients
  let norm = taylorInvSqrt_4(vec4<f32>(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 = p0 * norm.x;
  p1 = p1 * norm.y;
  p2 = p2 * norm.z;
  p3 = p3 * norm.w;
  p4 = p4 * taylorInvSqrt_1(dot(p4, p4));

  // Mix contributions from the five corners
  var m0 = max(0.6 - vec3<f32>(dot(x0,x0), dot(x1,x1), dot(x2,x2)), vec3<f32>(0.0));
  var m1 = max(0.6 - vec2<f32>(dot(x3,x3), dot(x4,x4)), vec2<f32>(0.0));
  m0 = m0 * m0;
  m1 = m1 * m1;

  return 49.0 * (
      dot(m0 * m0, vec3<f32>(dot(p0, x0), dot(p1, x1), dot(p2, x2))) + dot(m1 * m1, vec2<f32>(dot(p3, x3), dot(p4, x4)))
    );
  }
`;
export default {
    SNOISE2D,
    SNOISE3D,
    SNOISE4D,
};
//# sourceMappingURL=simplex.wgsl.js.map