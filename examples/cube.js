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
  GPUShaderStage,
  Pass,
  Pipeline,
  Sampler,
  Texture,
  Uniform,
} from "../lib/index.js";

import { mat4 } from "gl-matrix";
import concatTypedArray from "concat-typed-array";
import { PerspectiveCamera, Controls } from "cameras";
import Geometries from "primitive-geometry";

(async () => {
  const context = new Context();
  document.body.appendChild(context.canvas);
  const webGPUSupported = await context.init();

  if (!webGPUSupported)
    return (document.body.textContent = "Your browser doesn't support WebGPU.");

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
      type: "uniform-buffer",
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
      type: "uniform-buffer",
      visibility: GPUShaderStage.VERTEX,
      name: "Mesh",
      uniforms: [new Uniform("modelMatrix", "mat4")],
    },
    {
      type: "sampler",
      visibility: GPUShaderStage.FRAGMENT,
      name: "uSampler",
    },
    {
      type: "sampled-texture",
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

  const geometry = Geometries.cube();
  const geometryVertexBuffer = new Buffer();
  const geometryIndicesBuffer = new Buffer();

  geometryVertexBuffer.vertexBuffer(
    new Float32Array(
      geometry.positions
        .map((_, index) => [
          geometry.positions[index],
          geometry.normals[index],
          geometry.uvs[index],
        ])
        .flat()
        .flat()
    )
  );
  const indices = new Uint32Array(geometry.cells.flat());
  geometryIndicesBuffer.indexBuffer(indices);

  // Pipeline
  const pipeline = new Pipeline({
    bindGroupLayouts: [systemBindGroupLayout, meshBindGroupLayout],
    ins: [
      new Attribute("position", "vec3"),
      new Attribute("normal", "vec3"),
      new Attribute("uv", "vec2"),
    ],
    outs: [new Attribute("vNormal", "vec3"), new Attribute("vUv", "vec2")],
    vertex: /* glsl */ `
void main() {
  vNormal = normal;
  vUv = uv;

  gl_Position = system.projectionMatrix * system.viewMatrix * mesh.modelMatrix * vec4(position, 1.0);
}`,
    fragment: /* glsl */ `
void main() {
  // outColor = vec4(vNormal * 0.5 + 0.5, 1.0);
  outColor = texture(sampler2D(uTexture, uSampler), vUv);
}`,
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
    count: indices.length,
  });

  // Helpers
  const axes = new Axes(systemBindGroupLayout, systemUniformBindGroup);

  // Frame
  requestAnimationFrame(function frame() {
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
        context.submit(axes.command);
        context.submit(drawGeometryCommand);
      });
    });
    requestAnimationFrame(frame);
  });
  clock.start();

  window.addEventListener("resize", onResize);
})();
