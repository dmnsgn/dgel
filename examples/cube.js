import {
  Attachment,
  Attribute,
  Axes,
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
  Sampler,
  State,
  Texture,
  Uniform,
  WGSLBuiltIn,
} from "../lib/index.js";

import { mat4 } from "gl-matrix";
import interleaveTypedArray from "typed-array-interleave";
import concatTypedArray from "typed-array-concat";
import { PerspectiveCamera, Controls } from "cameras";
import { cube } from "primitive-geometry";

State.debug = true;

const context = new Context();
if (!(await context.init())) {
  const message = "Your browser doesn't support WebGPU.";
  document.body.textContent = message;
  throw new Error(message);
}
document.body.appendChild(context.canvas);

const clock = new Clock();

// Camera
const camera = new PerspectiveCamera({
  position: [3, 3, 3],
});
camera.update();
const controls = new Controls({
  element: context.canvas,
  camera,
  position: camera.position,
  target: camera.target,
  distanceBounds: [camera.near, camera.far],
});

const onResize = () => {
  context.resize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
onResize();

// Layouts
const systemBindGroupLayout = new BindGroupLayout([
  {
    buffer: {},
    visibility: GPUShaderStage.VERTEX,
    name: "System",
    uniforms: [
      new Uniform("projectionMatrix", "mat4"),
      new Uniform("viewMatrix", "mat4"),
    ],
  },
]);

const meshBindGroupLayout = new BindGroupLayout([
  {
    buffer: {},
    visibility: GPUShaderStage.VERTEX,
    name: "Mesh",
    uniforms: [new Uniform("modelMatrix", "mat4")],
  },
  {
    sampler: {},
    visibility: GPUShaderStage.FRAGMENT,
    name: "uSampler",
  },
  {
    texture: {},
    visibility: GPUShaderStage.FRAGMENT,
    name: "uTexture",
    dimension: "2d",
  },
]);

// Buffers
const systemUniformsBuffer = new Buffer();
systemUniformsBuffer.uniformBuffer(systemBindGroupLayout.getBindGroupSize());

const meshUniformsBuffer = new Buffer();
meshUniformsBuffer.uniformBuffer(meshBindGroupLayout.getBindGroupSize());

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

const uvSampler = new Sampler();

const uvImage = document.createElement("img");
uvImage.src = "assets/uv.jpg";
await uvImage.decode();

const uvTexture = new Texture(null, uvImage);

const meshUniformBindGroup = new BindGroup({
  layout: meshBindGroupLayout.gpuBindGroupLayout,
  resources: [
    {
      buffer: meshUniformsBuffer.gpuBuffer,
      offset: 0,
      size: meshBindGroupLayout.getBindGroupSize(),
    },
    uvSampler.gpuSampler,
    uvTexture.gpuTexture.createView(),
  ],
});

// Geometry
const modelMatrix = mat4.create();

const geometry = cube();
const geometryVertexBuffer = new Buffer();
const geometryIndicesBuffer = new Buffer();

geometryVertexBuffer.vertexBuffer(
  interleaveTypedArray(
    Float32Array,
    [3, 3, 2],
    geometry.positions,
    geometry.normals,
    geometry.uvs
  )
);
geometryIndicesBuffer.indexBuffer(new Uint16Array(geometry.cells));

// Pipeline
const pipeline = new Pipeline({
  bindGroupLayouts: [systemBindGroupLayout, meshBindGroupLayout],
  ins: [
    new Attribute("position", "vec3"),
    new Attribute("normal", "vec3"),
    new Attribute("uv", "vec2"),
  ],
  outs: [
    WGSLBuiltIn.Position,
    new Attribute("vNormal", "vec3"),
    new Attribute("vUv", "vec2"),
  ],

  // WGSL
  vertex: /* wgsl */ `
  var output: Output;
  output.vNormal = normal;
  output.vUv = uv;

  output.position = system.projectionMatrix * system.viewMatrix * mesh.modelMatrix * vec4<f32>(position, 1.0);

  return output;
`,
  fragment: /* wgsl */ `
  // return vec4<f32>(vNormal * 0.5 + 0.5, 1.0);
  var outColor: vec4<f32>;
  outColor = textureSample(uTexture, uSampler, vUv);
  return outColor;
`,

  // GLSL
  glsl: {
    language: "glsl",
    vertex: /* glsl */ `
vNormal = normal;
vUv = uv;

gl_Position = system.projectionMatrix * system.viewMatrix * mesh.modelMatrix * vec4(position, 1.0);
`,
    fragment: /* glsl */ `
// outColor = vec4(vNormal * 0.5 + 0.5, 1.0);
outColor = texture(sampler2D(uTexture, uSampler), vUv);
`,
  },
});

// Command
const clearCommand = new Command({
  pass: new Pass(
    "render",
    [new Attachment({ r: 0.07, g: 0.07, b: 0.07, a: 1 })],
    new Attachment(1)
  ),
});
const drawGeometryCommand = new Command({
  pipeline,
  bindGroups: [systemUniformBindGroup, meshUniformBindGroup],
  vertexBuffers: [geometryVertexBuffer],
  indexBuffer: geometryIndicesBuffer,
  indexFormat: GPUIndexFormat.Uint16,
  count: geometry.cells.length,
});

// Helpers
// const axes = new Axes(systemBindGroupLayout, systemUniformBindGroup);

// Frame
requestAnimationFrame(function frame() {
  if (State.error) return;

  clock.getDelta();

  controls.update();
  camera.position = controls.position;
  camera.target = controls.target;
  camera.update();

  systemUniformsBuffer.setSubData(
    0,
    concatTypedArray(Float32Array, camera.projectionMatrix, camera.viewMatrix)
  );
  meshUniformsBuffer.setSubData(0, modelMatrix);

  context.render(() => {
    context.submit(clearCommand, () => {
      // context.submit(axes.command);
      context.submit(drawGeometryCommand);
    });
  });
  requestAnimationFrame(frame);
});
clock.start();

window.addEventListener("resize", onResize);
