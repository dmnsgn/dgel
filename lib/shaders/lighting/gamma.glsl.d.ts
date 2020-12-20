declare const _default: "\nfloat toGamma(float v) {\n  return pow(v, 1.0 / GAMMA);\n}\nvec2 toGamma(vec2 v) {\n  return pow(v, vec2(1.0 / GAMMA));\n}\nvec3 toGamma(vec3 v) {\n  return pow(v, vec3(1.0 / GAMMA));\n}\nvec4 toGamma(vec4 v) {\n  return vec4(toGamma(v.rgb), v.a);\n}";
export default _default;
