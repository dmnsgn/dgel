declare const FUNCTIONS = "\nvec4 mod289(vec4 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x)\n{\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n";
declare const FADE2 = "\nvec2 fade(vec2 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n";
declare const FADE3 = "\nvec3 fade(vec3 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n";
declare const FADE4 = "\nvec4 fade(vec4 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n";
export { FUNCTIONS, FADE2, FADE3, FADE4 };
