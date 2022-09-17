import State from "./State.js";
import Buffer from "./Buffer.js";
import { GPUTextureUsage, GPUBufferUsage } from "../constants.js";

const imageCanvas = document.createElement("canvas");
const imageCanvasContext = imageCanvas.getContext("2d", {
  willReadFrequently: true,
}) as CanvasRenderingContext2D;
// document.body.appendChild(imageCanvas)

class Texture {
  public gpuTexture: GPUTexture;
  public mipLevelCount: number;

  constructor(
    public descriptor: GPUTextureDescriptor,
    public image: HTMLImageElement
  ) {
    this.mipLevelCount = image
      ? Math.floor(Math.log2(Math.max(image.width, image.height))) + 1
      : 1;

    this.gpuTexture = State.device.createTexture({
      dimension: "2d",
      format: "rgba8unorm",
      mipLevelCount: this.mipLevelCount,
      sampleCount: 1,
      size: {
        width: image?.width || (descriptor.size as GPUExtent3DDict)?.width,
        height: image?.height || (descriptor.size as GPUExtent3DDict)?.height,
      },
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED,
      ...(descriptor || {}),
    });

    if (image) {
      this.setMipMap(image);
    }
  }

  public setMipMap(image: HTMLImageElement): void {
    let faceWidth = image.width;
    let faceHeight = image.height;

    this.update(faceHeight, faceHeight, 0);

    for (let i = 1; i <= this.mipLevelCount - 1; i++) {
      faceWidth = Math.max(Math.floor(faceWidth / 2), 1);
      faceHeight = Math.max(Math.floor(faceHeight / 2), 1);
      this.update(faceHeight, faceHeight, i);
    }
  }

  public update(
    width: number,
    height: number,
    mipLevel: number,
    face = -1
  ): void {
    imageCanvas.width = width;
    imageCanvas.height = height;

    imageCanvasContext.translate(0, height);
    imageCanvasContext.scale(1, -1);
    imageCanvasContext.drawImage(this.image, 0, 0, width, height);

    const imageData = imageCanvasContext.getImageData(0, 0, width, height);

    let data = null;
    const bytesPerRow = Math.ceil((width * 4) / 256) * 256;
    if (bytesPerRow === width * 4) {
      data = imageData.data;
    } else {
      data = new Uint8Array(bytesPerRow * height);
      let pixelsIndex = 0;
      for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
          const i = x * 4 + y * bytesPerRow;
          data[i] = imageData.data[pixelsIndex];
          data[i + 1] = imageData.data[pixelsIndex + 1];
          data[i + 2] = imageData.data[pixelsIndex + 2];
          data[i + 3] = imageData.data[pixelsIndex + 3];
          pixelsIndex += 4;
        }
      }
    }

    const textureDataBuffer = new Buffer();
    textureDataBuffer.create(
      GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
      data
    );
    textureDataBuffer.copyToTexture(
      bytesPerRow,
      height,
      {
        texture: this.gpuTexture,
        mipLevel,
        origin: { z: Math.max(face, 0) },
      },
      {
        width,
        height,
      }
    );
    textureDataBuffer.destroy();
  }
}

export default Texture;
