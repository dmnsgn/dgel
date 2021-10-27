const OREN_NAYAR = /* wgsl */ `
// #define DIFFUSE_OREN_NAYAR
fn Diffuse(
  lightDirection: vec3<f32>,
  viewDirection: vec3<f32>,
  surfaceNormal: vec3<f32>,
  material: Material
) -> f32 {
  let LdotV = dot(lightDirection, viewDirection);
  let NdotL = dot(lightDirection, surfaceNormal);
  let NdotV = dot(surfaceNormal, viewDirection);

  let s = LdotV - NdotL * NdotV;
  let t = mix(1.0, max(NdotL, NdotV), step(0.0, s));

  let sigma2 = material.roughness * material.roughness;
  let A = 1.0 + sigma2 * (material.albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));
  let B = 0.45 * sigma2 / (sigma2 + 0.09);

  return material.albedo * max(0.0, NdotL) * (A + B * s / t) / PI;
}
`;

const LAMBERT = /* wgsl */ `
// #define DIFFUSE_LAMBERT
fn Diffuse(
  lightDirection: vec3<f32>,
  surfaceNormal: vec3<f32>
) -> f32 {
  return max(0.0, dot(surfaceNormal, lightDirection));
}
`;

export default {
  OREN_NAYAR,
  LAMBERT,
};
