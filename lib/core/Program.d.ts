import Shader from "./Shader";
import BindGroupLayout from "./BindGroupLayout.js";
import { GLSLShaderType, BindGroupLayoutEntry } from "../types.js";
declare class Program {
    bindGroupLayouts: BindGroupLayout[];
    shaders: {
        [key in GLSLShaderType]?: Shader;
    };
    constructor(bindGroupLayouts: BindGroupLayout[], shaders: {
        [key in GLSLShaderType]?: Shader;
    });
    init(): void;
    getGLSLHeaders(set: number, entries: BindGroupLayoutEntry[]): {
        [key in GLSLShaderType]?: string;
    };
}
export default Program;
