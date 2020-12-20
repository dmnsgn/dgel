/// <reference types="@webgpu/types" />
import Uniform from "./core/Uniform.js";
import Variable from "./core/Variable.js";
import Struct from "./core/Struct.js";
export declare type GLSLShaderType = "vertex" | "fragment" | "compute";
export declare type GLSLShaderTypeObjectKeys = {
    [key in GLSLShaderType]?: string;
};
export declare type GLSLLayoutQualifier = "std140" | "std430";
export declare type GLSLStorageQualifier = "shared";
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
}
export interface BindGroupOptions extends GPUBindGroupDescriptor {
    resources: GPUBindingResource[];
}
export declare type PassType = "render" | "compute";
declare const _default: any;
export default _default;
