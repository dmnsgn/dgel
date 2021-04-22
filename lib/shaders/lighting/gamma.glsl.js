export default /* glsl */ `
float toGamma(float v) {
  return pow(v, 1.0 / GAMMA);
}
vec2 toGamma(vec2 v) {
  return pow(v, vec2(1.0 / GAMMA));
}
vec3 toGamma(vec3 v) {
  return pow(v, vec3(1.0 / GAMMA));
}
vec4 toGamma(vec4 v) {
  return vec4(toGamma(v.rgb), v.a);
}`;
//# sourceMappingURL=gamma.glsl.js.map