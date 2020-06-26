function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import State from "./State.js";
import { GPUBufferUsage } from "../constants.js";

class Buffer {
  constructor() {
    _defineProperty(this, "gpuBuffer", void 0);
  }

  create(usage, data, size) {
    this.gpuBuffer = State.device.createBuffer({
      size: size || data.byteLength,
      usage
    });
    if (data) this.setSubData(0, data);
    return this;
  }

  vertexBuffer(data) {
    return this.create(GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST, data);
  }

  indexBuffer(data) {
    return this.create(GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST, data);
  }

  uniformBuffer(size) {
    return this.create(GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, null, size);
  } // https://github.com/gpuweb/gpuweb/blob/main/design/BufferOperations.md


  setSubData(offset, data) {
    const srcArrayBuffer = data.buffer;
    const byteCount = srcArrayBuffer.byteLength;
    const [srcBuffer, arrayBuffer] = State.device.createBufferMapped({
      size: byteCount,
      usage: GPUBufferUsage.COPY_SRC
    });
    new Uint8Array(arrayBuffer).set(new Uint8Array(srcArrayBuffer)); // memcpy

    srcBuffer.unmap();
    this.copyToBuffer(srcBuffer, offset, byteCount);
    srcBuffer.destroy();
  }

  copyToBuffer(srcBuffer, offset, byteCount) {
    const commandEncoder = State.device.createCommandEncoder();
    commandEncoder.copyBufferToBuffer(srcBuffer, 0, this.gpuBuffer, offset, byteCount);
    State.device.defaultQueue.submit([commandEncoder.finish()]);
  }

  copyToTexture(bytesPerRow, rowsPerImage, destination, extent) {
    const commandEncoder = State.device.createCommandEncoder();
    commandEncoder.copyBufferToTexture({
      buffer: this.gpuBuffer,
      bytesPerRow,
      rowsPerImage
    }, destination, extent);
    State.device.defaultQueue.submit([commandEncoder.finish()]);
  }

  destroy() {
    this.gpuBuffer.destroy();
  }

}

export default Buffer;