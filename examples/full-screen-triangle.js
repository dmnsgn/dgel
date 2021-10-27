import {
  Attachment,
  Attribute,
  BindGroup,
  BindGroupLayout,
  Buffer,
  Clock,
  Command,
  Context,
  GPUIndexFormat,
  GPUShaderStage,
  Pass,
  Pipeline,
  Shaders,
  State,
  Uniform,
  WGSLBuiltIn,
} from "../lib/index.js";

import interleaveTypedArray from "interleave-typed-array";

State.debug = true;

const context = new Context();
if (!(await context.init())) {
  const message = "Your browser doesn't support WebGPU.";
  document.body.textContent = message;
  throw new Error(message);
}
document.body.appendChild(context.canvas);

const clock = new Clock();

// Layouts
const systemBindGroupLayout = new BindGroupLayout([
  {
    buffer: {},
    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
    name: "System",
    uniforms: [new Uniform("resolution", "vec2"), new Uniform("time", "float")],
  },
]);

// Buffers
const systemUniformsBuffer = new Buffer();
systemUniformsBuffer.uniformBuffer(systemBindGroupLayout.getBindGroupSize());

// Bindings
const systemUniformBindGroup = new BindGroup({
  layout: systemBindGroupLayout.gpuBindGroupLayout,
  resources: [
    {
      buffer: systemUniformsBuffer.gpuBuffer,
      offset: 0,
      size: systemBindGroupLayout.getBindGroupSize(),
    },
  ],
});

// Geometry
const geometryVertexBuffer = new Buffer();
const geometryIndicesBuffer = new Buffer();

geometryVertexBuffer.vertexBuffer(
  interleaveTypedArray(
    Float32Array,
    [2, 2],
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    new Float32Array([0, 0, 2, 0, 0, 2])
  )
);
geometryIndicesBuffer.indexBuffer(Uint32Array.of(0, 1, 2));

// Pipeline
const pipeline = new Pipeline({
  bindGroupLayouts: [systemBindGroupLayout],
  ins: [
    new Attribute("position", "vec2<f32>"),
    new Attribute("uv", "vec2<f32>"),
  ],
  outs: [WGSLBuiltIn.Position, new Attribute("vUv", "vec2<f32>")],

  // WGSL
  vertex: /* wgsl */ `
  var output: Output;
  output.vUv = uv;
  output.vUv.x = output.vUv.x * (system.resolution.x / system.resolution.y);
  output.position = vec4<f32>(position, 0.0, 1.0);

  return output;
`,
  fragmentBody: /* wgsl */ `${Shaders.NOISE.WORLEY.WORLEY2D.replace(
    "let jitter = 1.0;",
    "let jitter = 1.0 + 0.5 * sin(2.0 * system.time);"
  )}
    `,
  fragment: /* wgsl */ `
  var p = vUv;
  p.x = p.x + system.time * 0.01;
  p.y = p.y + system.time * 0.01;
  let uv = 1.2 * worley2d(p * 20.0);

  var color = mix(vec3<f32>(0.5, 0.0, 0.0), vec3<f32>(0.9, 0.0, 0.0), uv.y);
  color = mix(color, vec3<f32>(1.0), uv.x);

  return vec4<f32>(color.x, color.y, color.z, 1.0);
`,
});

// Command
const clearCommand = new Command({
  pass: new Pass(
    "render",
    [new Attachment({ r: 0.07, g: 0.07, b: 0.07, a: 1 })],
    new Attachment(1)
  ),
});
const drawTriangleCommand = new Command({
  pipeline,
  bindGroups: [systemUniformBindGroup],
  vertexBuffers: [geometryVertexBuffer],
  indexBuffer: geometryIndicesBuffer,
  indexFormat: GPUIndexFormat.Uint32,
  count: 3,
});

const onResize = () => {
  context.resize(window.innerWidth, window.innerHeight);

  systemUniformsBuffer.setSubData(
    0,
    Float32Array.of(window.innerWidth, window.innerHeight)
  );
};
onResize();

// Frame
requestAnimationFrame(function frame() {
  if (State.error) return;

  clock.getDelta();

  systemUniformsBuffer.setSubData(
    2 * Float32Array.BYTES_PER_ELEMENT,
    Float32Array.of(clock.time)
  );

  context.render(() => {
    context.submit(clearCommand, () => {
      context.submit(drawTriangleCommand);
    });
  });
  requestAnimationFrame(frame);
});
clock.start();

window.addEventListener("resize", onResize);
