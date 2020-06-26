function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import State from "./State.js";

class Sampler {
  constructor(descriptor = {
    magFilter: "linear",
    minFilter: "linear",
    mipmapFilter: "linear"
  }) {
    _defineProperty(this, "gpuSampler", void 0);

    this.gpuSampler = State.device.createSampler(descriptor);
  }

}

export default Sampler;