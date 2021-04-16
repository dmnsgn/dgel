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
  Shaders,
  State,
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
    position: new Float32Array([3, 3, 3]),
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
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      name: "System",
      uniforms: [
        new Uniform("projectionMatrix", "mat4"),
        new Uniform("viewMatrix", "mat4"),
        new Uniform("inverseViewMatrix", "mat4"),
        new Uniform("cameraPosition", "vec3"),
        new Uniform("time", "float"),
      ],
    },
  ]);

  const meshBindGroupLayout = new BindGroupLayout([
    {
      buffer: {},
      visibility: GPUShaderStage.VERTEX,
      name: "Mesh",
      uniforms: [
        new Uniform("modelMatrix", "mat4"),
        new Uniform("normalMatrix", "mat3"),
      ],
      qualifiers: { layout: "std140" },
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

  const meshUniformBindGroup = new BindGroup({
    layout: meshBindGroupLayout.gpuBindGroupLayout,
    resources: [
      {
        buffer: meshUniformsBuffer.gpuBuffer,
        offset: 0,
        size: meshBindGroupLayout.getBindGroupSize(),
      },
    ],
  });

  // Geometry
  const modelMatrix = mat4.create();
  const normalMatrix = mat4.create();
  // const geometry = Geometries.sphere(0.5);
  // const geometry = Geometries.cube(1.5);
  const geometry = Geometries.torus({ majorRadius: 0.5, minorRadius: 0.25 });
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
    outs: [
      new Attribute("vPositionWorld", "vec3"),
      new Attribute("vPositionView", "vec3"),
      new Attribute("vNormalView", "vec3"),
      new Attribute("vNormalWorld", "vec3"),
    ],
    vertex: /* glsl */ `
void main() {
  vPositionWorld = (mesh.modelMatrix * vec4(position, 1.0)).xyz;
  vPositionView = (system.viewMatrix * vec4(vPositionWorld, 1.0)).xyz;

  vNormalView = mesh.normalMatrix * normal;
  vNormalWorld = normalize((system.inverseViewMatrix * vec4(vNormalView, 0.0)).xyz);

  gl_Position = system.projectionMatrix * vec4(vPositionView, 1.0);
}`,
    fragment: /* glsl */ `
struct Material {
  vec3 ambientColor;
  vec3 diffuseColor;
  vec3 specularColor;
  float	shininess;
  float	roughness;
  float	albedo;
  float	fresnel;
};

struct Light {
  vec3 position;
  vec4 color;
  float attenuation;

  // Spot
  vec3 direction;
  float innerAngle;
  float angle;

  // Spot and Point
  float range;
};

${Shaders.UTILS.SATURATE}
${Shaders.CONSTANTS.PI}
${Shaders.CONSTANTS.EPSILON}

${Shaders.DIFFUSE.OREN_NAYAR}
${Shaders.SPECULAR.PHONG}
${Shaders.DIRECT.PHONG}

void main() {
  vec3 color = vec3(0.0);

  // Renormalize
  vec3 normalWorld = normalize(vNormalWorld);
  normalWorld *= float(gl_FrontFacing) * 2.0 - 1.0;

  vec3 normalView = normalize(vNormalView);
  normalView *= float(gl_FrontFacing) * 2.0 - 1.0;

  Material material;
  material.ambientColor = vec3(0.05, 0.05, 0.05);
  material.diffuseColor = vec3(1.0, 1.0, 1.0);
  material.diffuseColor = normalWorld * 0.5 + 0.5;
  material.specularColor = vec3(0.9, 0.9, 0.9);
  material.shininess = 20.0;
  material.roughness = 0.2;
  #ifdef DIFFUSE_OREN_NAYAR
  material.albedo = 2.0;
  #endif
  #ifdef SPECULAR_GAUSSIAN
  material.shininess = 0.2;
  #endif
  #ifdef SPECULAR_COOK_TORRANCE
  material.fresnel = 0.1;
  #endif

  vec3 viewDirectionWorld = normalize(system.cameraPosition - vPositionWorld);
  vec3 viewDirectionView = normalize(-vPositionView);

  // Directional
  Light directionnalLight;
  directionnalLight.position = vec3(-1.0, 0.0, -1.0);
  // directionnalLight.position.x = 2.0 * cos(system.time);
  // directionnalLight.position.z = 2.0 * sin(system.time);
  directionnalLight.color = vec4(0.2, 0.1, 0.1, 1.0);
  vec3 positionToLight = -directionnalLight.position;
  color += getDirectShading(material, directionnalLight, normalWorld, viewDirectionWorld, positionToLight, false, false);

  // View space
  // vec3 lightPositionView = (system.viewMatrix * vec4(directionnalLight.position, 1.0)).xyz;
  // directionnalLight.position = lightPositionView - vPositionView;
  // vec3 positionToLight = -directionnalLight.position;
  // color += getDirectShading(material, light, normalView, viewDirectionView, positionToLight, false, false);

  // Point
  Light pointLight;
  pointLight.position = vec3(0.0, 0.0, 0.0);
  // pointLight.position.x = 2.0 * cos(system.time);
  // pointLight.position.z = 2.0 * sin(system.time);
  pointLight.color = vec4(0.1, 0.1, 0.2, 2.5);
  pointLight.range = 2.5;
  vec3 positionToPointLight = pointLight.position - vPositionWorld;
  color += getDirectShading(
    material,
    pointLight,
    normalWorld,
    viewDirectionWorld,
    positionToPointLight,
    true,
    false
  );

  // Spot
  Light spotLight;
  spotLight.position = vec3(0.0, 1.0, 0.0);
  spotLight.direction = vec3(0.0, -1.0, 0.0);
  spotLight.color = vec4(0.1, 0.2, 0.1, 2.5);
  spotLight.range = 2.5;
  spotLight.angle = PI / 4.0;
  spotLight.innerAngle = PI / 5.0;
  vec3 positionToSpotLight = spotLight.position - vPositionWorld;
  color += getDirectShading(
    material,
    spotLight,
    normalWorld,
    viewDirectionWorld,
    positionToSpotLight,
    true,
    true
  );

  outColor = vec4(color, 1.0);
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
    if (State.error) return;

    clock.getDelta();

    controls.update();
    camera.position = controls.position;
    camera.target = controls.target;
    camera.update();

    mat4.identity(modelMatrix);
    mat4.rotateX(modelMatrix, modelMatrix, clock.time * 0.25);
    mat4.rotateY(modelMatrix, modelMatrix, clock.time);
    mat4.rotateZ(modelMatrix, modelMatrix, clock.time * 0.75);

    systemUniformsBuffer.setSubData(
      0,
      concatTypedArray(
        Float32Array,
        camera.projectionMatrix,
        camera.viewMatrix,
        camera.inverseViewMatrix,
        camera.position,
        Float32Array.of(clock.time)
      )
    );

    mat4.multiply(normalMatrix, camera.viewMatrix, modelMatrix);
    mat4.invert(normalMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    // TODO: alignment seems to be wrong, using multiple of 4 bytes instead
    // mat3.fromMat4(mat3.create(), normalMatrix)

    meshUniformsBuffer.setSubData(
      0,
      concatTypedArray(Float32Array, modelMatrix, normalMatrix)
    );

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
