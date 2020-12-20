/// <reference types="@webgpu/types" />
declare class Buffer {
    gpuBuffer: GPUBuffer;
    create(usage: GPUBufferUsageFlags, data: ArrayBufferView | null, size?: number): Buffer;
    vertexBuffer(data: ArrayBufferView): Buffer;
    indexBuffer(data: ArrayBufferView): Buffer;
    uniformBuffer(size: number): Buffer;
    setSubData(offset: number, data: ArrayBufferView): void;
    copyToBuffer(srcBuffer: GPUBuffer, offset: number, byteCount: number): void;
    copyToTexture(bytesPerRow: number, rowsPerImage: number, destination: GPUTextureCopyView, extent: GPUExtent3D): void;
    destroy(): void;
}
export default Buffer;
