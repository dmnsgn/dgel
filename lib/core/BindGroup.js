import State from "./State.js";
class BindGroup {
    constructor(options) {
        this.gpuBindGroup = State.device.createBindGroup({
            layout: options.layout,
            entries: options.resources.map((resource, i) => ({
                binding: i,
                resource,
            })),
        });
    }
}
export default BindGroup;
//# sourceMappingURL=BindGroup.js.map