/// <reference types="@webgpu/types" />
import { BindGroupLayoutEntry } from "../types.js";
declare class BindGroupLayout {
    entries: BindGroupLayoutEntry[];
    gpuBindGroupLayout: GPUBindGroupLayout;
    constructor(entries?: BindGroupLayoutEntry[]);
    getBindGroupSize(): number;
    getBindingSize(entry: BindGroupLayoutEntry): number;
}
export default BindGroupLayout;
