/// <reference types="@webgpu/types" />
import { BindGroupOptions } from "../types.js";
declare class BindGroup {
    gpuBindGroup: GPUBindGroup;
    constructor(options: BindGroupOptions);
}
export default BindGroup;
