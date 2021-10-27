const PHONG = /* wgsl */ `
fn getDirectShading(
  material: Material,
  light: Light,
  surfaceNormal: vec3<f32>,
  viewDirection: vec3<f32>,
  positionToLight: vec3<f32>,
  distanceAttenuation: bool,
  angleAttenuation: bool
) -> vec3<f32> {
  let lightDirection = normalize(positionToLight);

  // Diffuse reflection (Lambertial reflectance)
  // #ifdef DIFFUSE_LAMBERT
  // let diff = Diffuse(lightDirection, surfaceNormal);
  // #elif defined(DIFFUSE_OREN_NAYAR)
  let diff = Diffuse(
    lightDirection,
    viewDirection,
    surfaceNormal,
    material
  );
  // #endif

  if (diff <= 0.0) {
    return vec3<f32>(0.0);
  }

  // Specular relection
  // #ifdef WARD
  // float spec = Specular(lightDirection, viewDirection, surfaceNormal, material, fiberParallel, fiberPerpendicular, shinyParallel, shinyPerpendicular);
  // #elif defined(HEIDRICH_SEIDEL)
  // float spec = Specular(lightDirection, viewDirection, surfaceNormal, material, anisoRoughness, specDirection);
  // #else
  let spec = Specular(lightDirection, viewDirection, surfaceNormal, material);
  // #endif

  // Combine results
  let diffuse = material.diffuseColor * diff;
  let specular = material.specularColor * spec;

  // Attenuation
  var attenuation = 1.0;

  if (distanceAttenuation) {
		attenuation = attenuation * pow(saturate(1.0 - length(positionToLight) / light.range), 2.0);
  }

  if (angleAttenuation) {
    let theta = dot(lightDirection, normalize(-light.direction));

    if (theta > light.innerAngle) {
      let epsilon = light.innerAngle - light.angle;
      attenuation = attenuation * clamp((theta - light.angle) / epsilon, 0.0, 1.0);
    }
  }

  return attenuation * (light.color.xyz * (material.ambientColor + diffuse + specular)) * light.color.a;
}
`;

export default {
  PHONG,
};
