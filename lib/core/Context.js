import State from "./State.js";
import { GPUTextureUsage } from "../constants.js";
class Context {
    constructor({ canvas, context } = {}) {
        this.canvas = canvas || document.createElement("canvas");
        this.context =
            context ||
                this.canvas.getContext("gpupresent");
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
            State.device.addEventListener("uncapturederror", (error) => {
                console.log(error);
                State.error = true;
            });
            this.swapChain = this.context.configureSwapChain({
                device: State.device,
                format: "bgra8unorm",
                usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
                ...swapChainDescriptor,
            });
            State.glslang = await (await import(
            /* webpackIgnore: true */ glslangPath ||
                "@webgpu/glslang/dist/web-devel/glslang.js")).default();
        }
        catch (error) {
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
            },
            mipLevelCount: 1,
            sampleCount: 1,
            dimension: "2d",
            format: "depth24plus-stencil8",
            usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC,
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
                const descriptor = { ...command.pass.descriptor };
                const currentView = swapChainTexture.createView();
                if (descriptor.colorAttachments) {
                    const views = descriptor.colorAttachments;
                    for (let i = 0; i < views.length; i++) {
                        views[i].view = views[i].view || currentView;
                    }
                }
                if (descriptor.depthStencilAttachment) {
                    descriptor.depthStencilAttachment.view =
                        descriptor.depthStencilAttachment
                            .view || this.defaultDepthStencilAttachment;
                }
                this.passEncoder = this.commandEncoder.beginRenderPass(descriptor);
            }
            else if (command.pass.type === "compute") {
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
            this.passEncoder.setIndexBuffer(command.indexBuffer.gpuBuffer, command.indexFormat);
        }
        if (command.bindGroups) {
            for (let i = 0; i < command.bindGroups.length; i++) {
                this.passEncoder.setBindGroup(i, command.bindGroups[i].gpuBindGroup);
            }
        }
        if (command.indexBuffer) {
            this.passEncoder.drawIndexed(command.count || 0, command.instances || 1, 0, 0, 0);
        }
        else if (command.count) {
            this.passEncoder.draw(command.count, command.instances || 1, 0, 0);
        }
        else if (command.dispatch) {
            this.passEncoder.dispatch(...(Array.isArray(command.dispatch)
                ? command.dispatch
                : [command.dispatch]));
        }
        if (subcommand)
            subcommand();
        if (command.pass) {
            this.passEncoder.endPass();
            this.passEncoder = null;
        }
    }
    render(cb) {
        this.commandEncoder = State.device.createCommandEncoder();
        // Submit commands
        cb();
        State.device.queue.submit([this.commandEncoder.finish()]);
        this.commandEncoder = null;
    }
}
export default Context;
//# sourceMappingURL=Context.js.map