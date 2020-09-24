import State from "./State.js";
import Command from "./Command.js";

import { ContextOptions } from "../types.js";
import { GPUTextureUsage } from "../constants.js";

class Context {
  public canvas: HTMLCanvasElement;
  public context: GPUCanvasContext;

  private adapter: GPUAdapter;
  private swapChain: GPUSwapChain;

  private commandEncoder: GPUCommandEncoder | null;
  private passEncoder: GPURenderPassEncoder | GPUComputePassEncoder | null;

  private defaultDepthStencilAttachment: GPUTextureView | null;

  constructor({ canvas, context }: ContextOptions = {}) {
    this.canvas = canvas || document.createElement("canvas");
    this.context =
      context ||
      ((this.canvas.getContext("gpupresent") as unknown) as GPUCanvasContext);
  }

  public async init(
    requestAdapter = {},
    deviceDescriptor = {},
    swapChainDescriptor = {},
    glslangPath: string
  ): Promise<boolean> {
    try {
      if (!this.context) {
        throw new Error(`Failed to instantiate "gpupresent" context.`);
      }
      if (!navigator.gpu) {
        throw new Error(`Missing "navigator.gpu".`);
      }

      this.adapter = await navigator.gpu.requestAdapter(requestAdapter);
      State.device = await this.adapter.requestDevice(deviceDescriptor);
      State.device.addEventListener("uncapturederror", (error) =>
        console.log(error)
      );

      this.swapChain = this.context.configureSwapChain({
        device: State.device,
        format: "bgra8unorm",
        usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
        ...swapChainDescriptor,
      });

      State.glslang = await (
        await import(
          /* webpackIgnore: true */ glslangPath ||
            "@webgpu/glslang/dist/web-devel/glslang.js"
        )
      ).default();
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;

    const depthStencilTexture = State.device.createTexture({
      size: { width, height, depth: 1 },
      mipLevelCount: 1,
      sampleCount: 1,
      dimension: "2d",
      format: "depth24plus-stencil8",
      usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    });
    this.defaultDepthStencilAttachment = depthStencilTexture.createView();
  }

  public submit(command: Command, subcommand?: () => unknown): void {
    if (!this.commandEncoder) {
      console.warn("You need to submit commands inside the render callback.");
      return;
    }

    const swapChainTexture = this.swapChain.getCurrentTexture();

    if (command.pass) {
      if (command.pass.type === "render") {
        const descriptor = { ...command.pass.descriptor };
        const currentView = swapChainTexture.createView();
        if (descriptor.colorAttachments) {
          const attachments = descriptor.colorAttachments as Array<
            GPURenderPassColorAttachmentDescriptor
          >;
          for (let i = 0; i < attachments.length; i++) {
            attachments[i].attachment =
              attachments[i].attachment || currentView;
          }
        }
        if (descriptor.depthStencilAttachment) {
          descriptor.depthStencilAttachment.attachment =
            descriptor.depthStencilAttachment.attachment ||
            this.defaultDepthStencilAttachment;
        }

        this.passEncoder = this.commandEncoder.beginRenderPass(descriptor);
      } else if (command.pass.type === "compute") {
        this.passEncoder = this.commandEncoder.beginComputePass();
      }
    }

    if (command.pipeline) {
      this.passEncoder.setPipeline(
        command.pipeline.gpuPipeline as GPURenderPipeline & GPUComputePipeline
      );
    }

    if (command.vertexBuffers) {
      for (let i = 0; i < command.vertexBuffers.length; i++) {
        (this.passEncoder as GPURenderPassEncoder).setVertexBuffer(
          i,
          command.vertexBuffers[i].gpuBuffer
        );
      }
    }

    if (command.indexBuffer) {
      (this.passEncoder as GPURenderPassEncoder).setIndexBuffer(
        command.indexBuffer.gpuBuffer
      );
    }

    if (command.bindGroups) {
      for (let i = 0; i < command.bindGroups.length; i++) {
        this.passEncoder.setBindGroup(i, command.bindGroups[i].gpuBindGroup);
      }
    }

    if (command.indexBuffer) {
      (this.passEncoder as GPURenderPassEncoder).drawIndexed(
        command.count || 0,
        command.instances || 1,
        0,
        0,
        0
      );
    } else if (command.count) {
      (this.passEncoder as GPURenderPassEncoder).draw(
        command.count,
        command.instances || 1,
        0,
        0
      );
    } else if (command.dispatch) {
      (this.passEncoder as GPUComputePassEncoder).dispatch(
        ...((Array.isArray(command.dispatch)
          ? command.dispatch
          : [command.dispatch]) as [number, number?, number?])
      );
    }

    if (subcommand) subcommand();

    if (command.pass) {
      this.passEncoder.endPass();
      this.passEncoder = null;
    }
  }

  public render(cb: () => unknown): void {
    this.commandEncoder = State.device.createCommandEncoder();
    // Submit commands
    cb();
    State.device.defaultQueue.submit([this.commandEncoder.finish()]);
    this.commandEncoder = null;
  }
}

export default Context;
