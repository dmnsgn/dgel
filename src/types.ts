import Variable from "./core/Variable.js";
import Uniform from "./core/Uniform.js";
import Attribute from "./core/Attribute.js";
import Struct from "./core/Struct.js";
import BindGroupLayout from "./core/BindGroupLayout.js";

// GLSL
export type GLSLStorageQualifier =
  | "const"
  | "in"
  | "out"
  | "inout"
  | "centroid"
  | "patch"
  | "sample"
  | "uniform"
  | "buffer"
  | "shared"
  | "coherent"
  | "volatile"
  | "restrict"
  | "readonly"
  | "writeonly";

export type GLSLLayoutQualifier = "std140" | "std430";
export type GLSLSamplerType =
  | "1D"
  | "2D"
  | "3D"
  | "Cube"
  | "2DRect"
  | "1DArray"
  | "2DArray"
  | "CubeArray"
  | "Buffer"
  | "2DMS"
  | "2DMSArray";
export type GLSLShadowSamplerType =
  | "1DShadow"
  | "2DShadow"
  | "CubeShadow"
  | "2DRectShadow"
  | "1DArrayShadow"
  | "2DArrayShadow"
  | "CubeArrayShadow";
export interface GLSLTypeQualifiers {
  layout?: GLSLLayoutQualifier;
  storage?: GLSLStorageQualifier;
}

// DGEL
export type Language = "glsl" | "wgsl";

export interface ContextState {
  device: GPUDevice;
  glslang: {
    compileGLSL: (source: string, type: string) => string;
  };
  debug: boolean;
  error: boolean;
}

export interface ContextOptions {
  canvas?: HTMLCanvasElement;
  context?: GPUCanvasContext;
  pixelRatio?: number;
}

export interface BindGroupLayoutEntry extends GPUBindGroupLayoutEntry {
  name: string;
  uniforms?: Uniform[];
  members?: (Variable | Struct)[];
  dimension?: GPUTextureDimension;
  qualifiers?: GLSLTypeQualifiers;
  samplerType?: GLSLSamplerType | GLSLShadowSamplerType;
}

export interface BindGroupOptions extends GPUBindGroupDescriptor {
  resources: GPUBindingResource[];
}

export type ShaderStageName = "vertex" | "fragment" | "compute";

export type ShaderStageNameObjectKeys = {
  [key in ShaderStageName]?: string;
};
export type ShaderStageBodyName = "vertexBody" | "fragmentBody" | "computeBody";
export type ShaderStageBodyNameObjectKeys = {
  [key in ShaderStageBodyName]?: string;
};

export type PipelineVertexBufferIns = {
  stepMode: GPUVertexStepMode;
  attributes: Attribute[];
};

export interface PipelineOptions
  extends ShaderStageNameObjectKeys,
    ShaderStageBodyNameObjectKeys {
  bindGroupLayouts?: BindGroupLayout[];
  ins?: Attribute[] | PipelineVertexBufferIns[];
  outs?: Attribute[];
  structs?: Struct[];
  fragmentOuts?: Attribute[];
  fragmentTargets?: GPUColorTargetState[];
  descriptor?: Partial<GPURenderPipelineDescriptor>;
  stepMode?: GPUVertexStepMode;
  language?: Language;
}

export interface ShaderOptions {
  type: GPUShaderStageFlags;
  main: string;
  body?: string;
  ins?: Attribute[];
  outs?: Attribute[];
  structs?: Struct[];
  language?: Language;
}

export interface AttachmentOptions {
  op?: GPUStoreOp;
  view?: GPUTextureView;
  resolveTarget?: GPUTextureView;
}

export type PassType = "render" | "compute";

export type GPUBindingType =
  | GPUBufferBindingType
  | GPUSamplerBindingType
  | GPUTextureSampleType
  | GPUStorageTextureAccess;

// type FormatType =
//   | "uchar" // unsigned 8-bit value
//   | "char" // signed 8-bit value
//   | "ushort" // unsigned 16-bit value
//   | "short" // signed 16-bit value
//   | "half" // half-precision 16-bit floating point value
//   | "float" // 32-bit floating point value
//   | "uint" // unsigned 32-bit integer value
//   | "int"; // signed 32-bit integer value

// type FormatValue = "" | "2" | "3" | "4";

// interface Format {
//   type: FormatType;
//   value?: FormatValue;
//   normalized?: boolean;
// }

export default null;
