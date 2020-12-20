/// <reference types="@webgpu/types" />
import Pass from "./Pass.js";
import Pipeline from "./Pipeline.js";
import Buffer from "./Buffer.js";
import BindGroup from "./BindGroup.js";
declare class Command {
    pass?: Pass;
    pipeline?: Pipeline;
    vertexBuffers?: Buffer[];
    indexBuffer?: Buffer;
    indexFormat?: GPUIndexFormat;
    bindGroups?: BindGroup[];
    count?: number;
    instances?: number;
    dispatch?: number | [number, number?, number?];
    constructor(options: Command);
}
export default Command;
