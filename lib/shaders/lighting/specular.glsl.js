const BLINNPHONG =
/* glsl */
`
#define SPECULAR_BLINNPHONG
float Specular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, Material material) {
  vec3 halfwayVector = normalize(viewDirection + lightDirection);

  return pow(max(0.0, dot(surfaceNormal, halfwayVector)), material.shininess);
}
`;
const PHONG =
/* glsl */
`
#define SPECULAR_PHONG
float Specular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, Material material) {
  vec3 reflectDirection = -reflect(lightDirection, surfaceNormal);

  return pow(max(0.0, dot(viewDirection, reflectDirection)), material.shininess);
}
`;
const GAUSSIAN =
/* glsl */
`
#define SPECULAR_GAUSSIAN
float Specular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, Material material) {
  vec3 H = normalize(lightDirection + viewDirection);
  float theta = acos(dot(H, surfaceNormal));
  float w = theta / material.shininess;

  return exp(-w * w);
}
`;
const BECKMANN_DISTRIBUTION =
/* glsl */
`
float beckmannDistribution(float x, float roughness) {
  float NdotH = max(x, EPSILON);
  float cos2Alpha = NdotH * NdotH;
  float tan2Alpha = (cos2Alpha - 1.0) / cos2Alpha;
  float roughness2 = roughness * roughness;
  float denom = PI * roughness2 * cos2Alpha * cos2Alpha;

  return exp(tan2Alpha / roughness2) / denom;
}
`;
const BECKMANN =
/* glsl */
`
#define SPECULAR_BECKMANN
${BECKMANN_DISTRIBUTION}
float Specular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, Material material) {
  return beckmannDistribution(dot(surfaceNormal, normalize(lightDirection + viewDirection)), material.roughness);
}
`;
const COOK_TORRANCE =
/* glsl */
`
#define SPECULAR_COOK_TORRANCE
${BECKMANN_DISTRIBUTION}
float Specular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, Material material) {
  float VdotN = max(dot(viewDirection, surfaceNormal), 0.0);
  float LdotN = max(dot(lightDirection, surfaceNormal), 0.0);

  // Half angle vector
  vec3 H = normalize(lightDirection + viewDirection);

  // Geometric term
  float NdotH = max(dot(surfaceNormal, H), 0.0);
  float VdotH = max(dot(viewDirection, H), EPSILON);
  float x = 2.0 * NdotH / VdotH;
  float G = min(1.0, min(x * VdotN, x * LdotN));

  // Distribution term
  float D = beckmannDistribution(NdotH, material.roughness);

  // Fresnel term
  float F = pow(1.0 - VdotN, material.fresnel);

  return G * F * D / max(PI * VdotN * LdotN, EPSILON);
}
`; // const WARD = /* glsl */ `
// #define SPECULAR_WARD
// float Specular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, vec3 fiberParallel, vec3 fiberPerpendicular, float shinyParallel, float shinyPerpendicular) {
//   float NdotL = dot(surfaceNormal, lightDirection);
//   float NdotR = dot(surfaceNormal, viewDirection);
//   if (NdotL < 0.0 || NdotR < 0.0) {
//     return 0.0;
//   }
//   vec3 H = normalize(lightDirection + viewDirection);
//   float NdotH = dot(surfaceNormal, H);
//   float XdotH = dot(fiberParallel, H);
//   float YdotH = dot(fiberPerpendicular, H);
//   float coeff = sqrt(NdotL / NdotR) / (4.0 * PI * shinyParallel * shinyPerpendicular);
//   float theta = (pow(XdotH / shinyParallel, 2.0) + pow(YdotH / shinyPerpendicular, 2.0)) / (1.0 + NdotH);
//   return coeff * exp(-2.0 * theta);
// }
// `;
// const HEIDRICH_SEIDEL = /* glsl */ `
// float Specular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, Material material, float anisoRoughness, vec3 specDirection) {
//   vec3 threadDirection = cross(surfaceNormal, normalize(specDirection));
//   float LdotT = dot(lightDirection, threadDirection);
//   float vDotT = dot(viewDirection, threadDirection);
//   // Half angle vector
//   vec3 H = normalize(lightDirection + viewDirection);
//   float kSpec = pow(dot(surfaceNormal, H), 1.0 / material.roughness);
//   float aniso = pow(sin(LdotT) * sin(vDotT) + cos(LdotT) * cos(vDotT), 1.0 / material.roughness);
//   return kSpec * aniso;
// }
// `;

export default {
  BLINNPHONG,
  PHONG,
  GAUSSIAN,
  BECKMANN,
  COOK_TORRANCE // WARD,
  // HEIDRICH_SEIDEL,

};