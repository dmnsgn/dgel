export default /* wgsl */ `
fn toGamma(v: f32) -> f32 {
  return pow(v, 1.0 / GAMMA);
}
fn toGamma(v: vec2<f32>) -> vec2<f32> {
  return pow(v, vec2<f32>(1.0 / GAMMA));
}
fn toGamma(v: vec3<f32>) -> vec3<f32> {
  return pow(v, vec3<f32>(1.0 / GAMMA));
}
fn toGamma(v: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(toGamma(v.rgb), v.a);
}`;
