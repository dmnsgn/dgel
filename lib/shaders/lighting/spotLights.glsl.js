const UNIFORMS = ["vec3 diffuse;", "vec3 specular;", "vec3 position;", "vec3 direction;", "float cutOff;"];
const FUNCTION =
/* glsl */
`
vec3 computeSpotLight(
  const in PhongMaterial material,
  const in SpotLight light,
  const in vec3 normal,
  const in vec3 viewDirection,
  const in vec3 fragmentPosition
) {
  vec3 lightDirection = normalize(light.position - fragmentPosition);

  float theta = dot(lightDirection, normalize(-light.direction));

  // Ambient
  vec3 ambientColor = vec3(0.5);
  float ambientIntensity = 0.5;
  #ifdef AMBIENT_LIGHT
  ambientColor = uAmbientLightColor;
  ambientIntensity = uAmbientLightIntensity;
  #endif

  // Diffuse reflection (Lambertial reflectance)
  float diff = max(dot(normal, lightDirection), 0.0);

  // Specular shading
  vec3 reflectDirection = -reflect(lightDirection, normal);
  float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), material.shininess);

  vec3 ambient = ambientColor * ambientIntensity * material.ambientColor;
  vec3 diffuse = light.diffuse * diff * material.diffuseColor;
  vec3 specular = light.specular * spec * material.specularColor;

  if (theta > light.cutOff) {
    return (ambient + diffuse + specular);
  } else {
    return ambient;
  }
}
`;
export default {
  UNIFORMS,
  FUNCTION
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGFkZXJzL2xpZ2h0aW5nL3Nwb3RMaWdodHMuZ2xzbC50cyJdLCJuYW1lcyI6WyJVTklGT1JNUyIsIkZVTkNUSU9OIl0sIm1hcHBpbmdzIjoiQUFBQSxNQUFNQSxRQUFRLEdBQUcsQ0FDZixlQURlLEVBRWYsZ0JBRmUsRUFHZixnQkFIZSxFQUlmLGlCQUplLEVBS2YsZUFMZSxDQUFqQjtBQVFBLE1BQU1DLFFBQVE7QUFBRztBQUFZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBQTdCO0FBdUNBLGVBQWU7QUFBRUQsRUFBQUEsUUFBRjtBQUFZQyxFQUFBQTtBQUFaLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBVTklGT1JNUyA9IFtcbiAgXCJ2ZWMzIGRpZmZ1c2U7XCIsXG4gIFwidmVjMyBzcGVjdWxhcjtcIixcbiAgXCJ2ZWMzIHBvc2l0aW9uO1wiLFxuICBcInZlYzMgZGlyZWN0aW9uO1wiLFxuICBcImZsb2F0IGN1dE9mZjtcIixcbl07XG5cbmNvbnN0IEZVTkNUSU9OID0gLyogZ2xzbCAqLyBgXG52ZWMzIGNvbXB1dGVTcG90TGlnaHQoXG4gIGNvbnN0IGluIFBob25nTWF0ZXJpYWwgbWF0ZXJpYWwsXG4gIGNvbnN0IGluIFNwb3RMaWdodCBsaWdodCxcbiAgY29uc3QgaW4gdmVjMyBub3JtYWwsXG4gIGNvbnN0IGluIHZlYzMgdmlld0RpcmVjdGlvbixcbiAgY29uc3QgaW4gdmVjMyBmcmFnbWVudFBvc2l0aW9uXG4pIHtcbiAgdmVjMyBsaWdodERpcmVjdGlvbiA9IG5vcm1hbGl6ZShsaWdodC5wb3NpdGlvbiAtIGZyYWdtZW50UG9zaXRpb24pO1xuXG4gIGZsb2F0IHRoZXRhID0gZG90KGxpZ2h0RGlyZWN0aW9uLCBub3JtYWxpemUoLWxpZ2h0LmRpcmVjdGlvbikpO1xuXG4gIC8vIEFtYmllbnRcbiAgdmVjMyBhbWJpZW50Q29sb3IgPSB2ZWMzKDAuNSk7XG4gIGZsb2F0IGFtYmllbnRJbnRlbnNpdHkgPSAwLjU7XG4gICNpZmRlZiBBTUJJRU5UX0xJR0hUXG4gIGFtYmllbnRDb2xvciA9IHVBbWJpZW50TGlnaHRDb2xvcjtcbiAgYW1iaWVudEludGVuc2l0eSA9IHVBbWJpZW50TGlnaHRJbnRlbnNpdHk7XG4gICNlbmRpZlxuXG4gIC8vIERpZmZ1c2UgcmVmbGVjdGlvbiAoTGFtYmVydGlhbCByZWZsZWN0YW5jZSlcbiAgZmxvYXQgZGlmZiA9IG1heChkb3Qobm9ybWFsLCBsaWdodERpcmVjdGlvbiksIDAuMCk7XG5cbiAgLy8gU3BlY3VsYXIgc2hhZGluZ1xuICB2ZWMzIHJlZmxlY3REaXJlY3Rpb24gPSAtcmVmbGVjdChsaWdodERpcmVjdGlvbiwgbm9ybWFsKTtcbiAgZmxvYXQgc3BlYyA9IHBvdyhtYXgoZG90KHZpZXdEaXJlY3Rpb24sIHJlZmxlY3REaXJlY3Rpb24pLCAwLjApLCBtYXRlcmlhbC5zaGluaW5lc3MpO1xuXG4gIHZlYzMgYW1iaWVudCA9IGFtYmllbnRDb2xvciAqIGFtYmllbnRJbnRlbnNpdHkgKiBtYXRlcmlhbC5hbWJpZW50Q29sb3I7XG4gIHZlYzMgZGlmZnVzZSA9IGxpZ2h0LmRpZmZ1c2UgKiBkaWZmICogbWF0ZXJpYWwuZGlmZnVzZUNvbG9yO1xuICB2ZWMzIHNwZWN1bGFyID0gbGlnaHQuc3BlY3VsYXIgKiBzcGVjICogbWF0ZXJpYWwuc3BlY3VsYXJDb2xvcjtcblxuICBpZiAodGhldGEgPiBsaWdodC5jdXRPZmYpIHtcbiAgICByZXR1cm4gKGFtYmllbnQgKyBkaWZmdXNlICsgc3BlY3VsYXIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBhbWJpZW50O1xuICB9XG59XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7IFVOSUZPUk1TLCBGVU5DVElPTiB9O1xuIl19