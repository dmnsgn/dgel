const PHONG = /* glsl */ `
vec3 getDirectShading(
  const in Material material,
  const in Light light,
  const in vec3 surfaceNormal,
  const in vec3 viewDirection,
  const in vec3 positionToLight,
  const in bool distanceAttenuation,
  const in bool angleAttenuation
) {
  vec3 lightDirection = normalize(positionToLight);

  // Diffuse reflection (Lambertial reflectance)
  #ifdef DIFFUSE_LAMBERT
  float diff = Diffuse(lightDirection, surfaceNormal);
  #elif defined(DIFFUSE_OREN_NAYAR)
  float diff = Diffuse(
    lightDirection,
    viewDirection,
    surfaceNormal,
    material
  );
  #endif

  if (diff <= 0.0) return vec3(0.0);

  // Specular relection
  // #ifdef WARD
  // float spec = Specular(lightDirection, viewDirection, surfaceNormal, material, fiberParallel, fiberPerpendicular, shinyParallel, shinyPerpendicular);
  // #elif defined(HEIDRICH_SEIDEL)
  // float spec = Specular(lightDirection, viewDirection, surfaceNormal, material, anisoRoughness, specDirection);
  // #else
  float spec = Specular(lightDirection, viewDirection, surfaceNormal, material);
  // #endif

  // Combine results
  vec3 diffuse = material.diffuseColor * diff;
  vec3 specular = material.specularColor * spec;

  // Attenuation
  float attenuation = 1.0;

  if (distanceAttenuation) {
		attenuation *= pow(saturate(1.0 - length(positionToLight) / light.range), 2.0);
  }

  if (angleAttenuation) {
    float theta = dot(lightDirection, normalize(-light.direction));

    if (theta > light.innerAngle) {
      float epsilon = light.innerAngle - light.angle;
      attenuation *= clamp((theta - light.angle) / epsilon, 0.0, 1.0);
    }
  }

  return attenuation * (light.color.xyz * (material.ambientColor + diffuse + specular)) * light.color.a;
}
`;
export default {
    PHONG,
};
//# sourceMappingURL=direct.glsl.js.map