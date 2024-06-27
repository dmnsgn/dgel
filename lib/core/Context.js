import State from "./State.js";
import { GPUCanvasCompositingAlphaMode, GPUTextureUsage, } from "../constants.js";
class Context {
    constructor({ canvas, context, pixelRatio } = {}) {
        this.canvas = canvas || document.createElement("canvas");
        this.context =
            context || this.canvas.getContext("webgpu");
        this.pixelRatio = pixelRatio || window.devicePixelRatio || 1;
    }
    async init(requestAdapter = {}, deviceDescriptor = {}, presentationContextDescriptor = {}, { glslangPath = "", twgslPath = "" } = {}) {
        try {
            if (!this.context) {
                throw new Error(`Failed to instantiate "webgpu" context.`);
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
            this.context.configure({
                device: State.device,
                format: navigator.gpu.getPreferredCanvasFormat(),
                usage: GPUTextureUsage.RENDER_ATTACHMENT,
                alphaMode: GPUCanvasCompositingAlphaMode.Premultiplied,
                ...presentationContextDescriptor,
            });
            State.glslang = await (await import(
            /* webpackIgnore: true */ glslangPath ||
                "@webgpu/glslang/dist/web-devel/glslang.js")).default();
            // https://github.com/BabylonJS/Babylon.js/tree/fe4df00abcd88585dc3249acb01633e67c2e7969/packages/tools/babylonServer/public/twgsl
            const twgslUrl = twgslPath ||
                new URL("assets/twgsl.js", window.location.href).toString();
            await import(/* webpackIgnore: true */ twgslUrl);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            State.twgsl = await window.twgsl(twgslUrl.replace(".js", ".wasm"));
        }
        catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }
    resize(width, height, presentationContextDescriptor = {}) {
        const w = width * this.pixelRatio;
        const h = height * this.pixelRatio;
        this.canvas.width = w;
        this.canvas.height = h;
        Object.assign(this.canvas.style, { width, height });
        this.context.configure({
            device: State.device,
            format: navigator.gpu.getPreferredCanvasFormat(),
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            alphaMode: GPUCanvasCompositingAlphaMode.Premultiplied,
            ...presentationContextDescriptor,
        });
        this.defaultDepthStencilAttachment = State.device
            .createTexture({
            size: { width: w, height: h, depthOrArrayLayers: 1 },
            mipLevelCount: 1,
            sampleCount: 1,
            dimension: "2d",
            format: "depth24plus-stencil8",
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
        })
            .createView();
    }
    submit(command, subcommand) {
        var _a, _b;
        if (!this.commandEncoder) {
            console.warn("You need to submit commands inside the render callback.");
            return;
        }
        const currentTexture = this.context.getCurrentTexture();
        if (command.pass) {
            if (command.pass.type === "render") {
                const descriptor = { ...command.pass.descriptor };
                if (descriptor.colorAttachments) {
                    const currentView = currentTexture.createView();
                    const views = descriptor.colorAttachments;
                    for (let i = 0; i < views.length; i++) {
                        (_a = views[i]).view || (_a.view = currentView);
                    }
                }
                if (descriptor.depthStencilAttachment) {
                    (_b = descriptor.depthStencilAttachment).view || (_b.view = this.defaultDepthStencilAttachment);
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
        else if (command.dispatchWorkgroups) {
            this.passEncoder.dispatchWorkgroups(...(Array.isArray(command.dispatchWorkgroups)
                ? command.dispatchWorkgroups
                : [command.dispatchWorkgroups]));
        }
        if (subcommand)
            subcommand();
        if (command.pass) {
            this.passEncoder.end();
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