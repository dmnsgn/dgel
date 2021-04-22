import Uniform from "./core/Uniform.js";
import Variable from "./core/Variable.js";
import Struct from "./core/Struct.js";

export type GLSLShaderType = "vertex" | "fragment" | "compute";

export type GLSLShaderTypeObjectKeys = { [key in GLSLShaderType]?: string };

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
export type GLSLStorageQualifier = "shared";
export interface GLSLTypeQualifiers {
  layout?: GLSLLayoutQualifier;
  storage?: GLSLStorageQualifier;
}

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

export type PassType = "render" | "compute";

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
