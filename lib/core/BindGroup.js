function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import State from "./State.js";

class BindGroup {
  constructor(options) {
    _defineProperty(this, "gpuBindGroup", void 0);

    this.gpuBindGroup = State.device.createBindGroup({
      layout: options.layout,
      entries: options.resources.map((resource, i) => ({
        binding: i,
        resource
      }))
    });
  }

}

export default BindGroup;