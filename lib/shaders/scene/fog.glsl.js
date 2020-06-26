const UNIFORMS = ["uniform vec3 uFogColor;", "uniform float uFogDensity;"];
const VERTEX_VARIABLES =
/* glsl */
`
#ifdef FOG
out vec3 vFogDistance;
#endif
`;
const VERTEX_END =
/* glsl */
`
#ifdef FOG
vFogDistance = -vViewPosition;
#endif
`;
const FRAGMENT_VARIABLES =
/* glsl */
`
#ifdef FOG
in vec3 vFogDistance;
#endif
`;
const FRAGMENT_END =
/* glsl */
`
#ifdef FOG
	float fogAmount = fogFactorExp2(length(vFogDistance), uFogDensity);
	outColor.rgb = mix(outColor.rgb, uFogColor, fogAmount);
#endif
`;
const FUNCTION =
/* glsl */
`
#ifdef FOG
float fogFactorExp(
  const float dist,
  const float density
) {
  return 1.0 - clamp(exp(-density * dist), 0.0, 1.0);
}

float fogFactorExp2(
  const float dist,
  const float density
) {
  const float LOG2 = -1.442695;
  float d = density * dist;
  return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}

float fogFactorLinear(
  const float dist,
  const float start,
  const float end
) {
  return 1.0 - clamp((end - dist) / (end - start), 0.0, 1.0);
}
#endif
`;
export default {
  UNIFORMS,
  VERTEX_VARIABLES,
  VERTEX_END,
  FRAGMENT_VARIABLES,
  FRAGMENT_END,
  FUNCTION
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGFkZXJzL3NjZW5lL2ZvZy5nbHNsLnRzIl0sIm5hbWVzIjpbIlVOSUZPUk1TIiwiVkVSVEVYX1ZBUklBQkxFUyIsIlZFUlRFWF9FTkQiLCJGUkFHTUVOVF9WQVJJQUJMRVMiLCJGUkFHTUVOVF9FTkQiLCJGVU5DVElPTiJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTUEsUUFBUSxHQUFHLENBQUMseUJBQUQsRUFBNEIsNEJBQTVCLENBQWpCO0FBRUEsTUFBTUMsZ0JBQWdCO0FBQUc7QUFBWTs7OztDQUFyQztBQU1BLE1BQU1DLFVBQVU7QUFBRztBQUFZOzs7O0NBQS9CO0FBTUEsTUFBTUMsa0JBQWtCO0FBQUc7QUFBWTs7OztDQUF2QztBQU1BLE1BQU1DLFlBQVk7QUFBRztBQUFZOzs7OztDQUFqQztBQU9BLE1BQU1DLFFBQVE7QUFBRztBQUFZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQUE3QjtBQTRCQSxlQUFlO0FBQ2JMLEVBQUFBLFFBRGE7QUFFYkMsRUFBQUEsZ0JBRmE7QUFHYkMsRUFBQUEsVUFIYTtBQUliQyxFQUFBQSxrQkFKYTtBQUtiQyxFQUFBQSxZQUxhO0FBTWJDLEVBQUFBO0FBTmEsQ0FBZiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFVOSUZPUk1TID0gW1widW5pZm9ybSB2ZWMzIHVGb2dDb2xvcjtcIiwgXCJ1bmlmb3JtIGZsb2F0IHVGb2dEZW5zaXR5O1wiXTtcblxuY29uc3QgVkVSVEVYX1ZBUklBQkxFUyA9IC8qIGdsc2wgKi8gYFxuI2lmZGVmIEZPR1xub3V0IHZlYzMgdkZvZ0Rpc3RhbmNlO1xuI2VuZGlmXG5gO1xuXG5jb25zdCBWRVJURVhfRU5EID0gLyogZ2xzbCAqLyBgXG4jaWZkZWYgRk9HXG52Rm9nRGlzdGFuY2UgPSAtdlZpZXdQb3NpdGlvbjtcbiNlbmRpZlxuYDtcblxuY29uc3QgRlJBR01FTlRfVkFSSUFCTEVTID0gLyogZ2xzbCAqLyBgXG4jaWZkZWYgRk9HXG5pbiB2ZWMzIHZGb2dEaXN0YW5jZTtcbiNlbmRpZlxuYDtcblxuY29uc3QgRlJBR01FTlRfRU5EID0gLyogZ2xzbCAqLyBgXG4jaWZkZWYgRk9HXG5cdGZsb2F0IGZvZ0Ftb3VudCA9IGZvZ0ZhY3RvckV4cDIobGVuZ3RoKHZGb2dEaXN0YW5jZSksIHVGb2dEZW5zaXR5KTtcblx0b3V0Q29sb3IucmdiID0gbWl4KG91dENvbG9yLnJnYiwgdUZvZ0NvbG9yLCBmb2dBbW91bnQpO1xuI2VuZGlmXG5gO1xuXG5jb25zdCBGVU5DVElPTiA9IC8qIGdsc2wgKi8gYFxuI2lmZGVmIEZPR1xuZmxvYXQgZm9nRmFjdG9yRXhwKFxuICBjb25zdCBmbG9hdCBkaXN0LFxuICBjb25zdCBmbG9hdCBkZW5zaXR5XG4pIHtcbiAgcmV0dXJuIDEuMCAtIGNsYW1wKGV4cCgtZGVuc2l0eSAqIGRpc3QpLCAwLjAsIDEuMCk7XG59XG5cbmZsb2F0IGZvZ0ZhY3RvckV4cDIoXG4gIGNvbnN0IGZsb2F0IGRpc3QsXG4gIGNvbnN0IGZsb2F0IGRlbnNpdHlcbikge1xuICBjb25zdCBmbG9hdCBMT0cyID0gLTEuNDQyNjk1O1xuICBmbG9hdCBkID0gZGVuc2l0eSAqIGRpc3Q7XG4gIHJldHVybiAxLjAgLSBjbGFtcChleHAyKGQgKiBkICogTE9HMiksIDAuMCwgMS4wKTtcbn1cblxuZmxvYXQgZm9nRmFjdG9yTGluZWFyKFxuICBjb25zdCBmbG9hdCBkaXN0LFxuICBjb25zdCBmbG9hdCBzdGFydCxcbiAgY29uc3QgZmxvYXQgZW5kXG4pIHtcbiAgcmV0dXJuIDEuMCAtIGNsYW1wKChlbmQgLSBkaXN0KSAvIChlbmQgLSBzdGFydCksIDAuMCwgMS4wKTtcbn1cbiNlbmRpZlxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBVTklGT1JNUyxcbiAgVkVSVEVYX1ZBUklBQkxFUyxcbiAgVkVSVEVYX0VORCxcbiAgRlJBR01FTlRfVkFSSUFCTEVTLFxuICBGUkFHTUVOVF9FTkQsXG4gIEZVTkNUSU9OLFxufTtcbiJdfQ==