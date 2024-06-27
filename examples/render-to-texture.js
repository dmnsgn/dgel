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
  GPUPrimitiveTopology,
} from "../lib/index.js";

import { mat4 } from "gl-matrix";
import typedArrayInterleave from "typed-array-interleave";
import typedArrayConcat from "typed-array-concat";
import { PerspectiveCamera, Controls } from "cameras";
import { cube } from "primitive-geometry";
import { Pane } from "tweakpane";

State.debug = true;

const context = new Context();
if (!(await context.init())) {
  const message = "Your browser doesn't support WebGPU.";
  document.body.textContent = message;
  throw new Error(message);
}
document.body.appendChild(context.canvas);

const CONFIG = {
  debug: false,
  rotate: true,
};
const rttFormat = "rgba32float";

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
const meshBindGroupLayoutRTT = new BindGroupLayout([
  {
    buffer: {},
    visibility: GPUShaderStage.VERTEX,
    name: "Mesh",
    uniforms: [new Uniform("modelMatrix", "mat4")],
  },
  {
    texture: { sampleType: "unfilterable-float" },
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

const meshUniformsBufferRTT = new Buffer();
meshUniformsBufferRTT.uniformBuffer(meshBindGroupLayoutRTT.getBindGroupSize());

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

const uvImage = document.createElement("img");
uvImage.src = "assets/uv.jpg";
await uvImage.decode();

const meshUniformBindGroup = new BindGroup({
  layout: meshBindGroupLayout.gpuBindGroupLayout,
  resources: [
    {
      buffer: meshUniformsBuffer.gpuBuffer,
      offset: 0,
      size: meshBindGroupLayout.getBindGroupSize(),
    },
    new Sampler().gpuSampler,
    new Texture(null, uvImage).gpuTexture.createView(),
  ],
});

// Geometry
const modelMatrix = mat4.create();
const modelMatrixRTT = mat4.create();

const geometry = cube();
const geometryVertexBuffer = new Buffer();
const geometryIndicesBuffer = new Buffer();

geometryVertexBuffer.vertexBuffer(
  typedArrayInterleave(
    Float32Array,
    [3, 3, 2],
    geometry.positions,
    geometry.normals,
    geometry.uvs
  )
);
geometryIndicesBuffer.indexBuffer(new Uint16Array(geometry.cells));

// Command
const rttCommand = new Command({
  pass: new Pass(
    "render",
    [new Attachment({ r: 0.14, g: 0.14, b: 0.14, a: 1 }, { view: null })],
    new Attachment(1)
  ),
});
const drawGeometryToTextureCommand = new Command({
  pipeline: new Pipeline({
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
    fragmentOuts: [new Attribute("color", "vec4")],
    fragmentTargets: [{ format: rttFormat }],

    // WGSL
    vertex: /* wgsl */ `
    var output: Output;
    output.vNormal = normal;
    output.vUv = uv;

    output.position = system.projectionMatrix * system.viewMatrix * mesh.modelMatrix * vec4<f32>(position, 1.0);

    return output;
  `,
    fragment: /* wgsl */ `
    var output: Output;
    output.color = textureSample(uTexture, uSampler, vUv);
    return output;
  `,
  }),
  bindGroups: [systemUniformBindGroup, meshUniformBindGroup],
  vertexBuffers: [geometryVertexBuffer],
  indexBuffer: geometryIndicesBuffer,
  indexFormat: GPUIndexFormat.Uint16,
  count: geometry.cells.length,
});
const clearCommand = new Command({
  pass: new Pass(
    "render",
    [new Attachment({ r: 0.07, g: 0.07, b: 0.07, a: 1 })],
    new Attachment(1)
  ),
});
const drawGeometryCommand = new Command({
  pipeline: new Pipeline({
    bindGroupLayouts: [systemBindGroupLayout, meshBindGroupLayoutRTT],
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
    let textureSize = textureDimensions(uTexture);

    return textureLoad(
      uTexture,
      vec2<i32>(vec2(vUv.x, 1.0 - vUv.y) * vec2<f32>(textureSize)),
      0
    );
  `,
  }),
  bindGroups: [systemUniformBindGroup, null],
  vertexBuffers: [geometryVertexBuffer],
  indexBuffer: geometryIndicesBuffer,
  indexFormat: GPUIndexFormat.Uint16,
  count: geometry.cells.length,
});

// RTT
const updateRTT = () => {
  const rttTexture = new Texture({
    format: rttFormat,
    size: { width: context.canvas.width, height: context.canvas.height },
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });

  const rttTextureView = rttTexture.gpuTexture.createView({
    format: rttFormat,
  });

  rttCommand.pass.colorAttachments[0].view = rttTextureView;

  drawGeometryCommand.bindGroups[1] = new BindGroup({
    layout: meshBindGroupLayoutRTT.gpuBindGroupLayout,
    resources: [
      {
        buffer: meshUniformsBufferRTT.gpuBuffer,
        offset: 0,
        size: meshBindGroupLayoutRTT.getBindGroupSize(),
      },
      rttTextureView,
    ],
  });
};

const onResize = () => {
  context.resize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  updateRTT();
};
onResize();

// Helpers
// const axes = new Axes(systemBindGroupLayout, systemUniformBindGroup, {
//   fragmentTargets: [{ format: "rgba32float" }],
// });

// Frame
requestAnimationFrame(function frame() {
  if (State.error) return;

  clock.getDelta();

  controls.update();
  camera.position = controls.position;
  camera.target = controls.target;
  camera.update();

  mat4.identity(modelMatrix);
  if (CONFIG.rotate) {
    mat4.rotateX(modelMatrix, modelMatrix, clock.time * 0.25);
    mat4.rotateY(modelMatrix, modelMatrix, clock.time);
    mat4.rotateZ(modelMatrix, modelMatrix, clock.time * 0.75);
  }

  systemUniformsBuffer.setSubData(
    0,
    typedArrayConcat(Float32Array, camera.projectionMatrix, camera.viewMatrix)
  );
  meshUniformsBuffer.setSubData(0, modelMatrix);
  meshUniformsBufferRTT.setSubData(0, modelMatrixRTT);

  context.render(() => {
    if (!CONFIG.debug) {
      context.submit(rttCommand, () => {
        // context.submit(axes.command);
        context.submit(drawGeometryToTextureCommand);
      });
      context.submit(clearCommand, () => {
        context.submit(drawGeometryCommand);
      });
    } else {
      context.submit(clearCommand, () => {
        context.submit(drawGeometryToTextureCommand);
      });
    }
  });

  requestAnimationFrame(frame);
});
clock.start();

window.addEventListener("resize", onResize);

// GUI
const pane = new Pane({ title: "Parameters" });
pane.addBinding(CONFIG, "debug").on("change", (event) => {
  drawGeometryToTextureCommand.pipeline.fragmentTargets = !event.value
    ? [{ format: rttFormat }]
    : [{ format: "bgra8unorm" }];
  drawGeometryToTextureCommand.pipeline.init();
});
pane.addBinding(CONFIG, "rotate");
