/// <reference types="@webgpu/types" />
declare class Texture {
    descriptor: GPUTextureDescriptor;
    image: HTMLImageElement;
    gpuTexture: GPUTexture;
    mipLevelCount: number;
    constructor(descriptor: GPUTextureDescriptor, image: HTMLImageElement);
    setMipMap(image: HTMLImageElement): void;
    update(width: number, height: number, mipLevel: number, face?: number): void;
}
export default Texture;
