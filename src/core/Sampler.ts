import State from "./State.js";

class Sampler {
  public gpuSampler: GPUSampler;

  constructor(
    descriptor: GPUSamplerDescriptor = {
      magFilter: "linear",
      minFilter: "linear",
      mipmapFilter: "linear",
    }
  ) {
    this.gpuSampler = State.device.createSampler(descriptor);
  }
}

export default Sampler;
