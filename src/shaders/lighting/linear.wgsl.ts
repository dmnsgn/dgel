export default /* wgsl */ `
fn toLinear(v: f32) -> f32 {
  return pow(v, GAMMA);
}
fn toLinear(v: vec2<f32>) -> vec2<f32> {
  return pow(v, vec2<f32>(GAMMA));
}
fn toLinear(v: vec3<f32>) -> vec3<f32> {
  return pow(v, vec3<f32>(GAMMA));
}
fn toLinear(v: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(toLinear(v.rgb), v.a);
}`;
