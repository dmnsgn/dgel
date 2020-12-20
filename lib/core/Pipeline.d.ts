/// <reference types="@webgpu/types" />
import BindGroupLayout from "./BindGroupLayout.js";
import Attribute from "./Attribute.js";
import Program from "./Program.js";
import Struct from "./Struct.js";
import { GLSLShaderTypeObjectKeys } from "../types.js";
declare type PipelineVertexBufferIns = {
    stepMode: GPUInputStepMode;
    attributes: Attribute[];
};
interface PipelineOptions extends GLSLShaderTypeObjectKeys {
    bindGroupLayouts?: BindGroupLayout[];
    ins?: Attribute[] | PipelineVertexBufferIns[];
    outs?: Attribute[];
    structs?: Struct[];
    fragmentOuts?: Attribute[];
    descriptor?: Partial<GPURenderPipelineDescriptor>;
    stepMode?: GPUInputStepMode;
}
interface Pipeline extends PipelineOptions {
}
declare class Pipeline {
    gpuPipeline: GPUPipelineBase;
    program: Program;
    constructor(options: PipelineOptions);
}
export default Pipeline;
