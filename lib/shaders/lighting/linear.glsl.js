export default
/* glsl */
`
float toLinear(float v) {
  return pow(v, GAMMA);
}
vec2 toLinear(vec2 v) {
  return pow(v, vec2(GAMMA));
}
vec3 toLinear(vec3 v) {
  return pow(v, vec3(GAMMA));
}
vec4 toLinear(vec4 v) {
  return vec4(toLinear(v.rgb), v.a);
}`;