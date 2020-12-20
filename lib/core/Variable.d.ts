/// <reference types="@webgpu/types" />
import { GLSLLayoutQualifier } from "../types.js";
declare class Variable {
    name: string;
    type: string;
    visibility?: GPUShaderStageFlags;
    arrayCount?: number;
    constructor(name: string, type: string, visibility?: GPUShaderStageFlags, arrayCount?: number);
    get format(): string;
    static getAlignement(size: number, qualifier?: GLSLLayoutQualifier): number;
    getSize(qualifier?: GLSLLayoutQualifier): number;
}
export default Variable;
