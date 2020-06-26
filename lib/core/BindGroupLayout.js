function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import State from "./State.js";

class BindGroupLayout {
  constructor(entries = []) {
    this.entries = entries;

    _defineProperty(this, "gpuBindGroupLayout", void 0);

    this.gpuBindGroupLayout = State.device.createBindGroupLayout({
      entries: entries.map((option, binding) => ({
        binding,
        visibility: option.visibility,
        type: option.type
      }))
    });
  }

  getBindGroupSize() {
    let size = 0;

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];

      if (entry.type === "uniform-buffer") {
        size += this.getBindingSize(entry);
      }
    }

    return size;
  }

  getBindingSize(entry) {
    let size = 0;

    if (entry.type === "uniform-buffer") {
      size += entry.uniforms.map(uniform => uniform.arrayCount ? uniform.getSize(entry.qualifiers?.layout) * uniform.arrayCount : uniform.getSize(entry.qualifiers?.layout)).reduce((a, b) => a + b, 0);
    }

    return size;
  }

}

export default BindGroupLayout;