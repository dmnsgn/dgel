const BLINNPHONG = /* wgsl */ `
// #define SPECULAR_BLINNPHONG
fn Specular(lightDirection: vec3<f32>, viewDirection: vec3<f32>, surfaceNormal: vec3<f32>, material: Material) -> f32 {
  let halfwayVector = normalize(viewDirection + lightDirection);

  return pow(max(0.0, dot(surfaceNormal, halfwayVector)), material.shininess);
}
`;

const PHONG = /* wgsl */ `
// #define SPECULAR_PHONG
fn Specular(lightDirection: vec3<f32>, viewDirection: vec3<f32>, surfaceNormal: vec3<f32>, material: Material) -> f32 {
  let reflectDirection = -reflect(lightDirection, surfaceNormal);

  return pow(max(0.0, dot(viewDirection, reflectDirection)), material.shininess);
}
`;

const GAUSSIAN = /* wgsl */ `
// #define SPECULAR_GAUSSIAN
fn Specular(lightDirection: vec3<f32>, viewDirection: vec3<f32>, surfaceNormal: vec3<f32>, material: Material) -> f32 {
  let H = normalize(lightDirection + viewDirection);
  let theta = acos(dot(H, surfaceNormal));
  let w = theta / material.shininess;

  return exp(-w * w);
}
`;

const BECKMANN_DISTRIBUTION = /* wgsl */ `
fn beckmannDistribution(x: f32, roughness: f32) -> f32 {
  let NdotH = max(x, EPSILON);
  let cos2Alpha = NdotH * NdotH;
  let tan2Alpha = (cos2Alpha - 1.0) / cos2Alpha;
  let roughness2 = roughness * roughness;
  let denom = PI * roughness2 * cos2Alpha * cos2Alpha;

  return exp(tan2Alpha / roughness2) / denom;
}
`;

const BECKMANN = /* wgsl */ `
// #define SPECULAR_BECKMANN
${BECKMANN_DISTRIBUTION}
fn Specular(lightDirection: vec3<f32>, viewDirection: vec3<f32>, surfaceNormal: vec3<f32>, material: Material) -> f32 {
  return beckmannDistribution(dot(surfaceNormal, normalize(lightDirection + viewDirection)), material.roughness);
}
`;

const COOK_TORRANCE = /* wgsl */ `
// #define SPECULAR_COOK_TORRANCE
${BECKMANN_DISTRIBUTION}
fn Specular(lightDirection: vec3<f32>, viewDirection: vec3<f32>, surfaceNormal: vec3<f32>, material: Material) -> f32 {
  let VdotN = max(dot(viewDirection, surfaceNormal), 0.0);
  let LdotN = max(dot(lightDirection, surfaceNormal), 0.0);

  // Half angle vector
  let H = normalize(lightDirection + viewDirection);

  // Geometric term
  let NdotH = max(dot(surfaceNormal, H), 0.0);
  let VdotH = max(dot(viewDirection, H), EPSILON);
  let x = 2.0 * NdotH / VdotH;
  let G = min(1.0, min(x * VdotN, x * LdotN));

  // Distribution term
  let D = beckmannDistribution(NdotH, material.roughness);

  // Fresnel term
  let F = pow(1.0 - VdotN, material.fresnel);

  return G * F * D / max(PI * VdotN * LdotN, EPSILON);
}
`;

// const WARD = /* wgsl */ `
// #define SPECULAR_WARD
// fn Specular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, vec3 fiberParallel, vec3 fiberPerpendicular, float shinyParallel, float shinyPerpendicular) -> f32 {
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

// const HEIDRICH_SEIDEL = /* wgsl */ `
// fn Specular(lightDirection: vec3<f32>, viewDirection: vec3<f32>, surfaceNormal: vec3<f32>, material: Material, float anisoRoughness, vec3 specDirection) -> f32 {
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
  COOK_TORRANCE,
  // WARD,
  // HEIDRICH_SEIDEL,
};
