const OREN_NAYAR = /* glsl */ `
#define DIFFUSE_OREN_NAYAR
float Diffuse(
  vec3 lightDirection,
  vec3 viewDirection,
  vec3 surfaceNormal,
  Material material
) {
  float LdotV = dot(lightDirection, viewDirection);
  float NdotL = dot(lightDirection, surfaceNormal);
  float NdotV = dot(surfaceNormal, viewDirection);

  float s = LdotV - NdotL * NdotV;
  float t = mix(1.0, max(NdotL, NdotV), step(0.0, s));

  float sigma2 = material.roughness * material.roughness;
  float A = 1.0 + sigma2 * (material.albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));
  float B = 0.45 * sigma2 / (sigma2 + 0.09);

  return material.albedo * max(0.0, NdotL) * (A + B * s / t) / PI;
}
`;

const LAMBERT = /* glsl */ `
#define DIFFUSE_LAMBERT
float Diffuse(
  vec3 lightDirection,
  vec3 surfaceNormal
) {
  return max(0.0, dot(surfaceNormal, lightDirection));
}
`;

export default {
  OREN_NAYAR,
  LAMBERT,
};
