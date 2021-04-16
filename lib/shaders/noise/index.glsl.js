// https://github.com/ashima/webgl-noise
const FUNCTIONS = /* glsl */ `
vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}
`;
const FADE2 = /* glsl */ `
vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}
`;
const FADE3 = /* glsl */ `
vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}
`;
const FADE4 = /* glsl */ `
vec4 fade(vec4 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}
`;
export { FUNCTIONS, FADE2, FADE3, FADE4 };
//# sourceMappingURL=index.glsl.js.map