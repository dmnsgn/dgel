function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import State from "./State.js";
import { GPUTextureUsage } from "../constants.js";

class Context {
  constructor({
    canvas,
    context
  } = {}) {
    _defineProperty(this, "canvas", void 0);

    _defineProperty(this, "context", void 0);

    _defineProperty(this, "adapter", void 0);

    _defineProperty(this, "swapChain", void 0);

    _defineProperty(this, "commandEncoder", void 0);

    _defineProperty(this, "passEncoder", void 0);

    _defineProperty(this, "defaultDepthStencilAttachment", void 0);

    this.canvas = canvas || document.createElement("canvas");
    this.context = context || this.canvas.getContext("gpupresent");
  }

  async init(requestAdapter = {}, deviceDescriptor = {}, swapChainDescriptor = {}, glslangPath) {
    try {
      if (!this.context) {
        throw new Error(`Failed to instantiate "gpupresent" context.`);
      }

      if (!navigator.gpu) {
        throw new Error(`Missing "navigator.gpu".`);
      }

      this.adapter = await navigator.gpu.requestAdapter(requestAdapter);
      State.device = await this.adapter.requestDevice(deviceDescriptor);
      State.device.addEventListener("uncapturederror", error => console.log(error));
      this.swapChain = this.context.configureSwapChain(_objectSpread({
        device: State.device,
        format: "bgra8unorm",
        usage: GPUTextureUsage.OUTPUT_ATTACHMENT
      }, swapChainDescriptor));
      State.glslang = await (await import(
      /* webpackIgnore: true */
      glslangPath || "@webgpu/glslang/dist/web-devel/glslang.js")).default();
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    const depthStencilTexture = State.device.createTexture({
      size: {
        width,
        height,
        depth: 1
      },
      mipLevelCount: 1,
      sampleCount: 1,
      dimension: "2d",
      format: "depth24plus-stencil8",
      usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC
    });
    this.defaultDepthStencilAttachment = depthStencilTexture.createView();
  }

  submit(command, subcommand) {
    if (!this.commandEncoder) {
      console.warn("You need to submit commands inside the render callback.");
      return;
    }

    const swapChainTexture = this.swapChain.getCurrentTexture();

    if (command.pass) {
      if (command.pass.type === "render") {
        const descriptor = _objectSpread({}, command.pass.descriptor);

        const currentView = swapChainTexture.createView();

        if (descriptor.colorAttachments) {
          const attachments = descriptor.colorAttachments;

          for (let i = 0; i < attachments.length; i++) {
            attachments[i].attachment = attachments[i].attachment || currentView;
          }
        }

        if (descriptor.depthStencilAttachment) {
          descriptor.depthStencilAttachment.attachment = descriptor.depthStencilAttachment.attachment || this.defaultDepthStencilAttachment;
        }

        this.passEncoder = this.commandEncoder.beginRenderPass(descriptor);
      } else if (command.pass.type === "compute") {
        this.passEncoder = this.commandEncoder.beginComputePass();
      }
    }

    if (command.pipeline) {
      this.passEncoder.setPipeline(command.pipeline.gpuPipeline);
    }

    if (command.vertexBuffers) {
      for (let i = 0; i < command.vertexBuffers.length; i++) {
        this.passEncoder.setVertexBuffer(i, command.vertexBuffers[i].gpuBuffer);
      }
    }

    if (command.indexBuffer) {
      this.passEncoder.setIndexBuffer(command.indexBuffer.gpuBuffer);
    }

    if (command.bindGroups) {
      for (let i = 0; i < command.bindGroups.length; i++) {
        this.passEncoder.setBindGroup(i, command.bindGroups[i].gpuBindGroup);
      }
    }

    if (command.indexBuffer) {
      this.passEncoder.drawIndexed(command.count || 0, command.instances || 1, 0, 0, 0);
    } else if (command.count) {
      this.passEncoder.draw(command.count, command.instances || 1, 0, 0);
    } else if (command.dispatch) {
      this.passEncoder.dispatch(...(Array.isArray(command.dispatch) ? command.dispatch : [command.dispatch]));
    }

    if (subcommand) subcommand();

    if (command.pass) {
      this.passEncoder.endPass();
      this.passEncoder = null;
    }
  }

  render(cb) {
    this.commandEncoder = State.device.createCommandEncoder(); // Submit commands

    cb();
    State.device.defaultQueue.submit([this.commandEncoder.finish()]);
    this.commandEncoder = null;
  }

}

export default Context;