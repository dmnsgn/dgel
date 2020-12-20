/// <reference types="@webgpu/types" />
import Variable from "./Variable.js";
declare class Struct {
    type: string;
    members: (Variable | Struct)[];
    name?: string;
    visibility?: GPUShaderStageFlags;
    arrayCount?: number;
    constructor(type: string, members: (Variable | Struct)[], name?: string, visibility?: GPUShaderStageFlags, arrayCount?: number);
    getGLSLString(): string;
}
export default Struct;
