const PHONG =
/* glsl */
`
vec3 computeDirectionalLight(
  const in Material material,
  const in DirectionalLight light,
  const in vec3 surfaceNormal,
  const in vec3 viewDirection
) {
  vec3 lightDirection = normalize(-light.direction);

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
  return (light.color.xyz * (material.ambientColor + diffuse + specular)) * light.color.a;
}
`;
export default {
  PHONG
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGFkZXJzL2xpZ2h0aW5nL2RpcmVjdGlvbmFsTGlnaHRzLmdsc2wudHMiXSwibmFtZXMiOlsiUEhPTkciXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLEtBQUs7QUFBRztBQUFZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBQTFCO0FBdUNBLGVBQWU7QUFDYkEsRUFBQUE7QUFEYSxDQUFmIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUEhPTkcgPSAvKiBnbHNsICovIGBcbnZlYzMgY29tcHV0ZURpcmVjdGlvbmFsTGlnaHQoXG4gIGNvbnN0IGluIE1hdGVyaWFsIG1hdGVyaWFsLFxuICBjb25zdCBpbiBEaXJlY3Rpb25hbExpZ2h0IGxpZ2h0LFxuICBjb25zdCBpbiB2ZWMzIHN1cmZhY2VOb3JtYWwsXG4gIGNvbnN0IGluIHZlYzMgdmlld0RpcmVjdGlvblxuKSB7XG4gIHZlYzMgbGlnaHREaXJlY3Rpb24gPSBub3JtYWxpemUoLWxpZ2h0LmRpcmVjdGlvbik7XG5cbiAgLy8gRGlmZnVzZSByZWZsZWN0aW9uIChMYW1iZXJ0aWFsIHJlZmxlY3RhbmNlKVxuICAjaWZkZWYgRElGRlVTRV9MQU1CRVJUXG4gIGZsb2F0IGRpZmYgPSBEaWZmdXNlKGxpZ2h0RGlyZWN0aW9uLCBzdXJmYWNlTm9ybWFsKTtcbiAgI2VsaWYgZGVmaW5lZChESUZGVVNFX09SRU5fTkFZQVIpXG4gIGZsb2F0IGRpZmYgPSBEaWZmdXNlKFxuICAgIGxpZ2h0RGlyZWN0aW9uLFxuICAgIHZpZXdEaXJlY3Rpb24sXG4gICAgc3VyZmFjZU5vcm1hbCxcbiAgICBtYXRlcmlhbFxuICApO1xuICAjZW5kaWZcblxuICBpZiAoZGlmZiA8PSAwLjApIHJldHVybiB2ZWMzKDAuMCk7XG5cbiAgLy8gU3BlY3VsYXIgcmVsZWN0aW9uXG4gIC8vICNpZmRlZiBXQVJEXG4gIC8vIGZsb2F0IHNwZWMgPSBTcGVjdWxhcihsaWdodERpcmVjdGlvbiwgdmlld0RpcmVjdGlvbiwgc3VyZmFjZU5vcm1hbCwgbWF0ZXJpYWwsIGZpYmVyUGFyYWxsZWwsIGZpYmVyUGVycGVuZGljdWxhciwgc2hpbnlQYXJhbGxlbCwgc2hpbnlQZXJwZW5kaWN1bGFyKTtcbiAgLy8gI2VsaWYgZGVmaW5lZChIRUlEUklDSF9TRUlERUwpXG4gIC8vIGZsb2F0IHNwZWMgPSBTcGVjdWxhcihsaWdodERpcmVjdGlvbiwgdmlld0RpcmVjdGlvbiwgc3VyZmFjZU5vcm1hbCwgbWF0ZXJpYWwsIGFuaXNvUm91Z2huZXNzLCBzcGVjRGlyZWN0aW9uKTtcbiAgLy8gI2Vsc2VcbiAgZmxvYXQgc3BlYyA9IFNwZWN1bGFyKGxpZ2h0RGlyZWN0aW9uLCB2aWV3RGlyZWN0aW9uLCBzdXJmYWNlTm9ybWFsLCBtYXRlcmlhbCk7XG4gIC8vICNlbmRpZlxuXG4gIC8vIENvbWJpbmUgcmVzdWx0c1xuICB2ZWMzIGRpZmZ1c2UgPSBtYXRlcmlhbC5kaWZmdXNlQ29sb3IgKiBkaWZmO1xuICB2ZWMzIHNwZWN1bGFyID0gbWF0ZXJpYWwuc3BlY3VsYXJDb2xvciAqIHNwZWM7XG4gIHJldHVybiAobGlnaHQuY29sb3IueHl6ICogKG1hdGVyaWFsLmFtYmllbnRDb2xvciArIGRpZmZ1c2UgKyBzcGVjdWxhcikpICogbGlnaHQuY29sb3IuYTtcbn1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgUEhPTkcsXG59O1xuIl19