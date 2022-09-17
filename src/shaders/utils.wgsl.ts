const RANDOM = /* wgsl */ `
fn random(st: vec2<f32>) -> f32 {
  return fract(sin(dot(st.xy, vec2<f32>(12.9898, 78.233))) * 43758.5453123);
}
`;

export default {
  RANDOM,
};
