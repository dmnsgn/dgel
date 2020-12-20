declare const _default: "\nfloat toLinear(float v) {\n  return pow(v, GAMMA);\n}\nvec2 toLinear(vec2 v) {\n  return pow(v, vec2(GAMMA));\n}\nvec3 toLinear(vec3 v) {\n  return pow(v, vec3(GAMMA));\n}\nvec4 toLinear(vec4 v) {\n  return vec4(toLinear(v.rgb), v.a);\n}";
export default _default;
