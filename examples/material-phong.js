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
  Struct,
  Uniform,
  Variable,
  WGSLBuiltIn,
} from "../lib/index.js";

import { mat4 } from "gl-matrix";
import interleaveTypedArray from "typed-array-interleave";
import concatTypedArray from "typed-array-concat";
import { PerspectiveCamera, Controls } from "cameras";
import { torus } from "primitive-geometry";

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
// const geometry = sphere();
// const geometry = cube();
const geometry = torus({ radius: 0.5, minorRadius: 0.25 });
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
geometryIndicesBuffer.indexBuffer(new Uint32Array(geometry.cells));

// Pipeline
const pipeline = new Pipeline({
  bindGroupLayouts: [systemBindGroupLayout, meshBindGroupLayout],
  ins: [
    new Attribute("position", "vec3"),
    new Attribute("normal", "vec3"),
    new Attribute("uv", "vec2"),
  ],
  outs: [
    WGSLBuiltIn.FrontFacing,
    WGSLBuiltIn.Position,
    new Attribute("vPositionWorld", "vec3"),
    new Attribute("vPositionView", "vec3"),
    new Attribute("vNormalView", "vec3"),
    new Attribute("vNormalWorld", "vec3"),
  ],
  structs: [
    new Struct(
      "Material",
      [
        new Variable("ambientColor", "vec3<f32>"),
        new Variable("diffuseColor", "vec3<f32>"),
        new Variable("specularColor", "vec3<f32>"),
        new Variable("shininess", "f32"),
        new Variable("roughness", "f32"),
        new Variable("albedo", "f32"),
        new Variable("fresnel", "f32"),
      ],
      GPUShaderStage.FRAGMENT
    ),
    new Struct(
      "Light",
      [
        new Variable("position", "vec3<f32>"),
        new Variable("color", "vec4<f32>"),
        new Variable("attenuation", "f32"),

        // Spot
        new Variable("direction", "vec3<f32>"),
        new Variable("innerAngle", "f32"),
        new Variable("angle", "f32"),

        // Spot and Point
        new Variable("range", "f32"),
      ],
      GPUShaderStage.FRAGMENT
    ),
  ],
  vertex: /* wgsl */ `
  var output: Output;
  output.vPositionWorld = (mesh.modelMatrix * vec4<f32>(position, 1.0)).xyz;
  output.vPositionView = (system.viewMatrix * vec4<f32>(output.vPositionWorld, 1.0)).xyz;

  output.vNormalView = mesh.normalMatrix * normal;
  output.vNormalWorld = normalize((system.inverseViewMatrix * vec4<f32>(output.vNormalView, 0.0)).xyz);

  output.position = system.projectionMatrix * vec4<f32>(output.vPositionView, 1.0);

  return output;
`,
  fragmentBody: /* wgsl */ `
${Shaders.CONSTANTS.PI}
${Shaders.CONSTANTS.EPSILON}

${Shaders.DIFFUSE.OREN_NAYAR}
${Shaders.SPECULAR.PHONG}
${Shaders.DIRECT.PHONG}
`,
  fragment: /* wgsl */ `
  var color = vec3<f32>(0.0);

  // Renormalize
  var normalWorld = normalize(vNormalWorld);
  normalWorld = normalWorld * (f32(front_facing) * 2.0 - 1.0);

  var normalView = normalize(vNormalView);
  normalView = normalView * (f32(front_facing) * 2.0 - 1.0);

  var material: Material;
  material.ambientColor = vec3<f32>(0.05, 0.05, 0.05);
  material.diffuseColor = vec3<f32>(1.0, 1.0, 1.0);
  material.diffuseColor = normalWorld * 0.5 + 0.5;
  material.specularColor = vec3<f32>(0.9, 0.9, 0.9);
  material.shininess = 20.0;
  material.roughness = 0.2;
  // #ifdef DIFFUSE_OREN_NAYAR
  material.albedo = 2.0;
  // #endif
  // #ifdef SPECULAR_GAUSSIAN
  // material.shininess = 0.2;
  // #endif
  // #ifdef SPECULAR_COOK_TORRANCE
  // material.fresnel = 0.1;
  // #endif

  let viewDirectionWorld = normalize(system.cameraPosition - vPositionWorld);
  let viewDirectionView = normalize(-vPositionView);

  // Directional
  var directionnalLight: Light;
  directionnalLight.position = vec3<f32>(-1.0, 0.0, -1.0);
  // directionnalLight.position.x = 2.0 * cos(system.time);
  // directionnalLight.position.z = 2.0 * sin(system.time);
  directionnalLight.color = vec4<f32>(0.2, 0.1, 0.1, 1.0);
  let positionToLight = -directionnalLight.position;
  color = color + getDirectShading(material, directionnalLight, normalWorld, viewDirectionWorld, positionToLight, false, false);

  // View space
  // let lightPositionView = (system.viewMatrix * vec4(directionnalLight.position, 1.0)).xyz;
  // directionnalLight.position = lightPositionView - vPositionView;
  // let positionToLight = -directionnalLight.position;
  // color += getDirectShading(material, light, normalView, viewDirectionView, positionToLight, false, false);

  // Point
  var pointLight: Light;
  pointLight.position = vec3<f32>(0.0, 0.0, 0.0);
  // pointLight.position.x = 2.0 * cos(system.time);
  // pointLight.position.z = 2.0 * sin(system.time);
  pointLight.color = vec4<f32>(0.1, 0.1, 0.2, 2.5);
  pointLight.range = 2.5;
  let positionToPointLight = pointLight.position - vPositionWorld;
  color = color + getDirectShading(
    material,
    pointLight,
    normalWorld,
    viewDirectionWorld,
    positionToPointLight,
    true,
    false
  );

  // Spot
  var spotLight: Light;
  spotLight.position = vec3<f32>(0.0, 1.0, 0.0);
  spotLight.direction = vec3<f32>(0.0, -1.0, 0.0);
  spotLight.color = vec4<f32>(0.1, 0.2, 0.1, 2.5);
  spotLight.range = 2.5;
  spotLight.angle = PI / 4.0;
  spotLight.innerAngle = PI / 5.0;
  let positionToSpotLight = spotLight.position - vPositionWorld;
  color = color + getDirectShading(
    material,
    spotLight,
    normalWorld,
    viewDirectionWorld,
    positionToSpotLight,
    true,
    true
  );
  return vec4<f32>(color, 1.0);
`,

  // GLSL
  glsl: {
    language: "glsl",
    vertex: /* glsl */ `
  vPositionWorld = (mesh.modelMatrix * vec4(position, 1.0)).xyz;
  vPositionView = (system.viewMatrix * vec4(vPositionWorld, 1.0)).xyz;

  vNormalView = mesh.normalMatrix * normal;
  vNormalWorld = normalize((system.inverseViewMatrix * vec4(vNormalView, 0.0)).xyz);

  gl_Position = system.projectionMatrix * vec4(vPositionView, 1.0);
`,
    fragmentBody: /* glsl */ `
${Shaders.GLSL.UTILS.SATURATE}
${Shaders.GLSL.CONSTANTS.PI}
${Shaders.GLSL.CONSTANTS.EPSILON}

${Shaders.GLSL.DIFFUSE.OREN_NAYAR}
${Shaders.GLSL.SPECULAR.PHONG}
${Shaders.GLSL.DIRECT.PHONG}
    `,
    fragment: /* glsl */ `
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
      // context.submit(axes.command);
      context.submit(drawGeometryCommand);
    });
  });
  requestAnimationFrame(frame);
});
clock.start();

window.addEventListener("resize", onResize);
