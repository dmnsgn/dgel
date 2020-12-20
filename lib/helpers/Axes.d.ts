import Command from "../core/Command.js";
import Buffer from "../core/Buffer.js";
import BindGroupLayout from "../core/BindGroupLayout.js";
import BindGroup from "../core/BindGroup.js";
declare class Axes {
    command: Command;
    buffer: Buffer;
    constructor(systemBindGroupLayout: BindGroupLayout, systemUniformBindGroup: BindGroup);
    setScale(scale: number): void;
}
export default Axes;
