import State from "./State.js";
import { GPUBufferUsage } from "../constants.js";

class Buffer {
  public gpuBuffer: GPUBuffer;

  public create(
    usage: GPUBufferUsageFlags,
    data: ArrayBufferView | null,
    size?: number
  ): Buffer {
    this.gpuBuffer = State.device.createBuffer({
      size: size || data.byteLength,
      usage,
    });
    if (data) this.setSubData(0, data);

    return this;
  }

  public vertexBuffer(data: ArrayBufferView): Buffer {
    return this.create(GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST, data);
  }

  public indexBuffer(data: ArrayBufferView): Buffer {
    return this.create(GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST, data);
  }

  public uniformBuffer(size: number): Buffer {
    return this.create(
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      null,
      size
    );
  }

  // https://github.com/gpuweb/gpuweb/blob/main/design/BufferOperations.md
  public setSubData(offset: number, data: ArrayBufferView): void {
    const srcArrayBuffer = data.buffer;
    const byteCount = srcArrayBuffer.byteLength;
    const srcBuffer = State.device.createBuffer({
      mappedAtCreation: true,
      size: byteCount,
      usage: GPUBufferUsage.COPY_SRC,
    });
    const arrayBuffer = srcBuffer.getMappedRange();

    new Uint8Array(arrayBuffer).set(new Uint8Array(srcArrayBuffer)); // memcpy
    srcBuffer.unmap();

    this.copyToBuffer(srcBuffer, offset, byteCount);

    srcBuffer.destroy();
  }

  public copyToBuffer(
    srcBuffer: GPUBuffer,
    offset: number,
    byteCount: number
  ): void {
    const commandEncoder = State.device.createCommandEncoder();
    commandEncoder.copyBufferToBuffer(
      srcBuffer,
      0,
      this.gpuBuffer,
      offset,
      byteCount
    );
    State.device.queue.submit([commandEncoder.finish()]);
  }

  public copyToTexture(
    bytesPerRow: number,
    rowsPerImage: number,
    destination: GPUImageCopyTexture,
    extent: GPUExtent3D
  ): void {
    const commandEncoder = State.device.createCommandEncoder();
    commandEncoder.copyBufferToTexture(
      {
        buffer: this.gpuBuffer,
        bytesPerRow,
        rowsPerImage,
      },
      destination,
      extent
    );
    State.device.queue.submit([commandEncoder.finish()]);
  }

  public destroy(): void {
    this.gpuBuffer.destroy();
  }
}

export default Buffer;
