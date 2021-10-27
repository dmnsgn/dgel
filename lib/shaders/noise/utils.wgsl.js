const MOD289_1 = /* wgsl */ `
fn mod289_1(x: f32) -> f32 {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
`;
const MOD289_2 = /* wgsl */ `
fn mod289_2(x: vec2<f32>) -> vec2<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
`;
const MOD289_3 = /* wgsl */ `
fn mod289_3(x: vec3<f32>) -> vec3<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
`;
const MOD289_4 = /* wgsl */ `
fn mod289_4(x: vec4<f32>) -> vec4<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
`;
const PERMUTE_1 = /* wgsl */ `
fn permute_1(x: f32) -> f32 {
  return mod289_1(((x * 34.0) + 10.0) * x);
}
`;
const PERMUTE_3 = /* wgsl */ `
fn permute_3(x: vec3<f32>) -> vec3<f32> {
  return mod289_3(((x * 34.0) + 10.0) * x);
}
`;
const PERMUTE_4 = /* wgsl */ `
fn permute_4(x: vec4<f32>) -> vec4<f32> {
  return mod289_4(((x * 34.0) + 10.0) * x);
}
`;
const FADE_2 = /* wgsl */ `
fn fade_2(t: vec2<f32>) -> vec2<f32> {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
`;
const FADE_3 = /* wgsl */ `
fn fade_3(t: vec3<f32>) -> vec3<f32> {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
`;
const FADE_4 = /* wgsl */ `
fn fade_4(t: vec4<f32>) -> vec4<f32> {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
`;
const TAYLOR_INV_SQRT_1 = /* wgsl */ `
fn taylorInvSqrt_1(r: f32) -> f32 {
  return 1.79284291400159 - 0.85373472095314 * r;
}
`;
const TAYLOR_INV_SQRT_4 = /* wgsl */ `
fn taylorInvSqrt_4(r: vec4<f32>) -> vec4<f32> {
  return 1.79284291400159 - 0.85373472095314 * r;
}
`;
export { MOD289_1, MOD289_2, MOD289_3, MOD289_4, PERMUTE_1, PERMUTE_3, PERMUTE_4, FADE_2, FADE_3, FADE_4, TAYLOR_INV_SQRT_1, TAYLOR_INV_SQRT_4, };
//# sourceMappingURL=utils.wgsl.js.map