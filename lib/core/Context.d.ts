/// <reference types="@webgpu/types" />
import Command from "./Command.js";
import { ContextOptions } from "../types.js";
declare class Context {
    canvas: HTMLCanvasElement;
    context: GPUCanvasContext;
    private adapter;
    private swapChain;
    private commandEncoder;
    private passEncoder;
    private defaultDepthStencilAttachment;
    constructor({ canvas, context }?: ContextOptions);
    init(requestAdapter: {}, deviceDescriptor: {}, swapChainDescriptor: {}, glslangPath: string): Promise<boolean>;
    resize(width: number, height: number): void;
    submit(command: Command, subcommand?: () => unknown): void;
    render(cb: () => unknown): void;
}
export default Context;
