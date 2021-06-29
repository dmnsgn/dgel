import {
  Attachment,
  Attribute,
  BindGroup,
  BindGroupLayout,
  Buffer,
  Clock,
  Command,
  Context,
  Pass,
  Pipeline,
  GPUShaderStage,
  Uniform,
  Shaders,
  State,
  GPUIndexFormat,
} from "../lib/index.js";

import { mat4 } from "gl-matrix";
import interleaveTypedArray from "interleave-typed-array";
import concatTypedArray from "concat-typed-array";
import { OrthographicCamera } from "cameras";
import { cube } from "primitive-geometry";

const GRID_SIZE = 16;
const INSTANCES_COUNT = GRID_SIZE * GRID_SIZE;

(async () => {
  const context = new Context();
  document.body.appendChild(context.canvas);
  const webGPUSupported = await context.init();

  if (!webGPUSupported)
    return (document.body.textContent = "Your browser doesn't support WebGPU.");

  const clock = new Clock();

  // Camera
  const camera = new OrthographicCamera({
    position: [3, 1.5, 3],
  });
  camera.update();

  const onResize = () => {
    context.resize(window.innerWidth, window.innerHeight);
    const aspect = window.innerWidth / window.innerHeight;
    const viewSize = 10;
    Object.assign(camera, {
      near: -2000,
      far: 1000,
      left: (-0.5 * viewSize * aspect) / 2,
      right: (0.5 * viewSize * aspect) / 2,
      top: (0.5 * viewSize) / 2,
      bottom: (-0.5 * viewSize) / 2,
      zoom: 10,
    });

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

  const instancesBindGroupLayout = new BindGroupLayout([
    {
      buffer: {},
      visibility: GPUShaderStage.VERTEX,
      name: "Mesh",
      uniforms: [new Uniform("modelMatrix", "mat4", null, INSTANCES_COUNT)],
    },
    {
      buffer: {},
      visibility: GPUShaderStage.VERTEX,
      name: "Custom",
      uniforms: [
        new Uniform("time", "float"),
        new Uniform("amplitude", "float"),
        new Uniform("frequency", "float"),
      ],
    },
  ]);

  // Buffers
  const systemUniformsBuffer = new Buffer();
  systemUniformsBuffer.uniformBuffer(systemBindGroupLayout.getBindGroupSize());

  const meshUniformsBuffer = new Buffer();
  meshUniformsBuffer.uniformBuffer(instancesBindGroupLayout.getBindGroupSize());

  const meshData = new Float32Array(16 * INSTANCES_COUNT + 3);
  const spacing = 1.1;
  let offset = 0;
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let z = 0; z < GRID_SIZE; z++) {
      const m = mat4.create();
      mat4.translate(m, m, [
        x * spacing - GRID_SIZE * spacing * 0.5,
        -2,
        z * spacing - GRID_SIZE * spacing * 0.5,
      ]);

      meshData.set(m, 16 * offset);
      offset++;
    }
  }
  meshData[16 * INSTANCES_COUNT + 0] = 0.0;
  meshData[16 * INSTANCES_COUNT + 1] = 4.0;
  meshData[16 * INSTANCES_COUNT + 2] = 0.05;
  meshUniformsBuffer.setSubData(0, meshData);

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

  const meshUniformBindGroup = new BindGroup({
    layout: instancesBindGroupLayout.gpuBindGroupLayout,
    resources: [
      {
        buffer: meshUniformsBuffer.gpuBuffer,
        offset: 0,
        size: instancesBindGroupLayout.getBindingSize(
          instancesBindGroupLayout.entries[0]
        ),
      },
      {
        buffer: meshUniformsBuffer.gpuBuffer,
        offset: 4 * 16 * INSTANCES_COUNT,
        size: instancesBindGroupLayout.getBindingSize(
          instancesBindGroupLayout.entries[1]
        ),
      },
    ],
  });

  // Geometry
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
    bindGroupLayouts: [systemBindGroupLayout, instancesBindGroupLayout],
    ins: [
      new Attribute("position", "vec3"),
      new Attribute("normal", "vec3"),
      new Attribute("uv", "vec2"),
    ],
    outs: [
      new Attribute("vNormal", "vec3"),
      new Attribute("vUv", "vec2"),
      new Attribute("vColor", "vec4"),
    ],
    vertex: /* glsl */ `
    ${Shaders.CLASSIC_NOISE.CNOISE3D}

void main() {
  vNormal = normal;
  vUv = uv;

  mat4 modelMatrix = mesh.modelMatrix[gl_InstanceIndex];
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  float displacement = custom.amplitude * cnoise3d(custom.frequency * worldPosition.xyz + custom.time);
  vec3 offset = vec3(worldPosition.x, worldPosition.y + displacement, worldPosition.z);

  gl_Position = system.projectionMatrix * system.viewMatrix * modelMatrix * vec4(position + offset, 1.0);
}`,
    fragment: /* glsl */ `
void main() {
  outColor = vec4(vNormal * 0.5 + 0.5, 1.0);
}`,
  });

  // Command
  const drawGeometryCommand = new Command({
    pass: new Pass(
      "render",
      [new Attachment({ r: 0.07, g: 0.07, b: 0.07, a: 1 })],
      new Attachment(1)
    ),
    pipeline,
    bindGroups: [systemUniformBindGroup, meshUniformBindGroup],
    vertexBuffers: [geometryVertexBuffer],
    indexBuffer: geometryIndicesBuffer,
    indexFormat: GPUIndexFormat.Uint16,
    count: geometry.cells.length,
    instances: INSTANCES_COUNT,
  });

  // Frame
  requestAnimationFrame(function frame() {
    if (State.error) return;

    clock.getDelta();

    systemUniformsBuffer.setSubData(
      0,
      concatTypedArray(Float32Array, camera.projectionMatrix, camera.viewMatrix)
    );

    meshUniformsBuffer.setSubData(
      4 * (16 * INSTANCES_COUNT),
      Float32Array.of(clock.time)
    );

    context.render(() => {
      context.submit(drawGeometryCommand);
    });
    requestAnimationFrame(frame);
  });
  clock.start();

  window.addEventListener("resize", onResize);
})();
