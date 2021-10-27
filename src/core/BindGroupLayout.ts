import State from "./State.js";

import { BindingType } from "../constants.js";
import { BindGroupLayoutEntry } from "../types.js";

class BindGroupLayout {
  public gpuBindGroupLayout: GPUBindGroupLayout;

  constructor(public entries: BindGroupLayoutEntry[] = []) {
    this.gpuBindGroupLayout = State.device.createBindGroupLayout({
      entries: entries.map(
        (
          { visibility, buffer, sampler, texture, storageTexture },
          binding
        ) => ({
          binding,
          visibility,
          buffer,
          sampler,
          texture,
          storageTexture,
        })
      ),
    });
  }

  public getBindGroupSize(): number {
    let size = 0;

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];

      if (
        entry.buffer &&
        (!entry.buffer.type || entry.buffer.type === BindingType.Uniform)
      ) {
        size += this.getBindingSize(entry);
      }
    }

    return size;
  }

  public getBindingSize(entry: BindGroupLayoutEntry): number {
    let size = 0;

    if (
      entry.buffer &&
      (!entry.buffer.type || entry.buffer.type === BindingType.Uniform)
    ) {
      size += entry.uniforms
        .map(
          (uniform) =>
            uniform.getSize(entry.qualifiers?.layout) *
            (uniform.arrayCount || 1)
        )
        .reduce((a, b) => a + b, 0);
    }

    return size;
  }
}

export default BindGroupLayout;
