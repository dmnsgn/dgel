/// <reference types="@webgpu/types" />
import Attribute from "./Attribute.js";
import Struct from "./Struct.js";
import { GLSLShaderType } from "../types.js";
declare class Shader {
    type: GLSLShaderType;
    body: string;
    ins?: Attribute[];
    outs?: Attribute[];
    structs?: Struct[];
    version: string;
    shaderModule: GPUShaderModule;
    private source;
    constructor(type: GLSLShaderType, body: string, ins?: Attribute[], outs?: Attribute[], structs?: Struct[]);
    init(uniformHeaders: string): void;
    getGLSLHeaders(): {
        structs?: string;
        ins?: string;
        outs?: string;
    };
}
export default Shader;
