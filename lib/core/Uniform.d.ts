/// <reference types="@webgpu/types" />
import Variable from "./Variable.js";
declare class Uniform extends Variable {
    name: string;
    type: string;
    visibility?: GPUShaderStageFlags;
    arrayCount?: number;
    constructor(name: string, type: string, visibility?: GPUShaderStageFlags, arrayCount?: number);
}
export default Uniform;
