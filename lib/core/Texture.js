function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import State from "./State.js";
import Buffer from "./Buffer.js";
import { GPUTextureUsage, GPUBufferUsage } from "../constants.js";
const imageCanvas = document.createElement("canvas");
const imageCanvasContext = imageCanvas.getContext("2d"); // document.body.appendChild(imageCanvas)

class Texture {
  constructor(descriptor, image) {
    var _image, _ref, _image2, _ref2;

    this.descriptor = descriptor;
    this.image = image;

    _defineProperty(this, "gpuTexture", void 0);

    _defineProperty(this, "mipLevelCount", void 0);

    this.mipLevelCount = image ? Math.floor(Math.log2(Math.max(image.width, image.height))) + 1 : 1;
    this.gpuTexture = State.device.createTexture(_objectSpread({
      dimension: "2d",
      format: "rgba8unorm",
      mipLevelCount: this.mipLevelCount,
      sampleCount: 1,
      size: {
        width: ((_image = image) === null || _image === void 0 ? void 0 : _image.width) || ((_ref = descriptor.size) === null || _ref === void 0 ? void 0 : _ref.width),
        height: ((_image2 = image) === null || _image2 === void 0 ? void 0 : _image2.height) || ((_ref2 = descriptor.size) === null || _ref2 === void 0 ? void 0 : _ref2.height),
        depth: 1
      },
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED
    }, descriptor || {}));

    if (image) {
      this.setMipMap(image);
    }
  }

  setMipMap(image) {
    let faceWidth = image.width;
    let faceHeight = image.height;
    this.update(faceHeight, faceHeight, 0);

    for (let i = 1; i <= this.mipLevelCount - 1; i++) {
      faceWidth = Math.max(Math.floor(faceWidth / 2), 1);
      faceHeight = Math.max(Math.floor(faceHeight / 2), 1);
      this.update(faceHeight, faceHeight, i);
    }
  }

  update(width, height, mipLevel, face = -1) {
    imageCanvas.width = width;
    imageCanvas.height = height;
    imageCanvasContext.translate(0, height);
    imageCanvasContext.scale(1, -1);
    imageCanvasContext.drawImage(this.image, 0, 0, width, height);
    const imageData = imageCanvasContext.getImageData(0, 0, width, height);
    let data = null;
    const bytesPerRow = Math.ceil(width * 4 / 256) * 256;

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
    textureDataBuffer.create(GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC, data);
    textureDataBuffer.copyToTexture(bytesPerRow, height, {
      texture: this.gpuTexture,
      mipLevel,
      origin: {
        z: Math.max(face, 0)
      }
    }, {
      width,
      height,
      depth: 1
    });
    textureDataBuffer.destroy();
  }

}

export default Texture;