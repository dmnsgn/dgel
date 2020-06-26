import State from "./State.js";
import { BindGroupOptions } from "../types.js";

class BindGroup {
  public gpuBindGroup: GPUBindGroup;

  constructor(options: BindGroupOptions) {
    this.gpuBindGroup = State.device.createBindGroup({
      layout: options.layout,
      entries: options.resources.map((resource, i) => ({
        binding: i,
        resource,
      })),
    });
  }
}

export default BindGroup;
