import BuiltIn from "./core/BuiltIn.js";
import { ShaderStageName } from "./types.js";

// Bit fields
// https://github.com/gpuweb/gpuweb/blob/main/spec/index.bs
export const GPUBufferUsage: { [key: string]: GPUBufferUsageFlags } = {
  MAP_READ: 0x0001,
  MAP_WRITE: 0x0002,
  COPY_SRC: 0x0004,
  COPY_DST: 0x0008,
  INDEX: 0x0010,
  VERTEX: 0x0020,
  UNIFORM: 0x0040,
  STORAGE: 0x0080,
  INDIRECT: 0x0100,
};
export const GPUTextureUsage: { [key: string]: GPUTextureUsageFlags } = {
  COPY_SRC: 0x01,
  COPY_DST: 0x02,
  SAMPLED: 0x04,
  STORAGE: 0x08,
  RENDER_ATTACHMENT: 0x10,
};
export const GPUShaderStage: { [key: string]: GPUShaderStageFlags } = {
  VERTEX: 0x1,
  FRAGMENT: 0x2,
  COMPUTE: 0x4,
};

// WebGPU
// Strings
// https://gpuweb.github.io/gpuweb/#binding-type
export const BindingType: { [key: string]: string } = {
  // buffer
  Uniform: "uniform",
  Storage: "storage",
  ReadonlyStorage: "read-only-storage",
  // sampler
  Filtering: "filtering",
  NonFiltering: "non-filtering",
  Comparison: "comparison",
  // texture
  Float: "float",
  UnFilterableFloat: "unfilterable-float",
  Depth: "depth",
  Sint: "sint",
  Uint: "uint",
  ReadOnly: "read-only",
  // storageTexture
  WriteOnly: "write-only",
};
// https://gpuweb.github.io/gpuweb/#vertex-state
export const GPUIndexFormat: { [key: string]: GPUIndexFormat } = {
  Uint16: "uint16",
  Uint32: "uint32",
};
// https://gpuweb.github.io/gpuweb/#canvas-configuration
export const GPUCanvasCompositingAlphaMode: {
  [key: string]: GPUCanvasCompositingAlphaMode;
} = {
  Opaque: "opaque",
  Premultiplied: "premultiplied",
};
// https://gpuweb.github.io/gpuweb/#primitive-state
export const GPUPrimitiveTopology: { [key: string]: GPUPrimitiveTopology } = {
  PointList: "point-list",
  LineList: "line-list",
  LineStrip: "line-strip",
  TriangleList: "triangle-list",
  TriangleStrip: "triangle-strip",
};
export const GPUShaderStageName: {
  [key: GPUShaderStageFlags]: ShaderStageName;
} = {
  [GPUShaderStage.VERTEX]: "vertex",
  [GPUShaderStage.FRAGMENT]: "fragment",
  [GPUShaderStage.COMPUTE]: "compute",
};
export const GPUTextureSampleType: { [BindingType: string]: string } = {
  [BindingType.Float]: "f32",
  [BindingType.UnFilterableFloat]: "f32",
  [BindingType.Sint]: "i32",
  [BindingType.Uint]: "u32",
};

// WGSL
export const StorageClass: { [key: string]: string } = {
  Function: "function",
  Private: "private",
  Workgroup: "workgroup",
  Uniform: "uniform",
  Storage: "storage",
  Handle: "handle",
};
export type StorageClass = (typeof StorageClass)[keyof typeof StorageClass];

export const AccessMode: { [key: string]: string } = {
  Read: "read",
  Write: "write",
  ReadWrite: "read-write",
};
export type AccessMode = (typeof AccessMode)[keyof typeof AccessMode];

export const GLSL_SCALARS_TO_WGSL: { [key: string]: string } = {
  float: "f32",
  int: "i32",
  uint: "u32",
  bool: "bool",
};

export const WGSL_SCALARS_TO_GLSL_PREFIX: { [key: string]: string } = {
  f32: "",
  i32: "i",
  u32: "u",
  bool: "b",
};

export const WGSL_MATRIX_TO_GLSL: { [key: string]: string } = {
  mat2x2: "mat2",
  mat3x3: "mat3",
  mat4x4: "mat4",
};

export const WGSL_TYPE_TO_GPU_VERTEX_FORMAT: {
  [key: string]: GPUVertexFormat;
} = {
  f32: "float32",
  "vec2<f32>": "float32x2",
  "vec3<f32>": "float32x3",
  "vec4<f32>": "float32x4",

  u32: "uint32",
  "vec2<u32>": "uint32x2",
  "vec3<u32>": "uint32x3",
  "vec4<u32>": "uint32x4",

  i32: "sint32",
  "vec2<i32>": "sint32x2",
  "vec3<i32>": "sint32x3",
  "vec4<i32>": "sint32x4",
};

// https://www.w3.org/TR/WGSL/#builtin-variables
export const WGSLBuiltIn: { [key: string]: BuiltIn } = {
  VertexIndex: new BuiltIn("vertex_index", "u32", GPUShaderStage.VERTEX, "in"),
  InstanceIndex: new BuiltIn(
    "instance_index",
    "u32",
    GPUShaderStage.VERTEX,
    "in"
  ),
  Position: new BuiltIn("position", "vec4<f32>", GPUShaderStage.VERTEX, "out"),
  PositionOut: new BuiltIn(
    "position",
    "vec4<f32>",
    GPUShaderStage.FRAGMENT,
    "in"
  ),
  // Frag
  FrontFacing: new BuiltIn(
    "front_facing",
    "bool",
    GPUShaderStage.FRAGMENT,
    "in"
  ),
  FragDepth: new BuiltIn("frag_depth", "f32", GPUShaderStage.FRAGMENT, "out"),
  SampleIndex: new BuiltIn(
    "sample_index",
    "u32",
    GPUShaderStage.FRAGMENT,
    "in"
  ),
  SampleMask: new BuiltIn("sample_mask", "u32", GPUShaderStage.FRAGMENT, "in"),
  SampleMaskOut: new BuiltIn(
    "sample_mask",
    "u32",
    GPUShaderStage.FRAGMENT,
    "out"
  ),
  // Compute
  LocalInvocationId: new BuiltIn(
    "local_invocation_id",
    "vec3<u32>",
    GPUShaderStage.COMPUTE,
    "in"
  ),
  LocalInvocationIndex: new BuiltIn(
    "local_invocation_index",
    "u32",
    GPUShaderStage.COMPUTE,
    "in"
  ),
  GlobalInvocationId: new BuiltIn(
    "global_invocation_id",
    "vec3<u32>",
    GPUShaderStage.COMPUTE,
    "in"
  ),
  WorkgroupId: new BuiltIn(
    "workgroup_id",
    "vec3<u32>",
    GPUShaderStage.COMPUTE,
    "in"
  ),
  NumWorkgroups: new BuiltIn(
    "num_workgroups",
    "vec3<u32>",
    GPUShaderStage.COMPUTE,
    "in"
  ),
};
