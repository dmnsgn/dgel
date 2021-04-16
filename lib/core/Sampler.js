import State from "./State.js";
class Sampler {
    constructor(descriptor = {
        magFilter: "linear",
        minFilter: "linear",
        mipmapFilter: "linear",
    }) {
        this.gpuSampler = State.device.createSampler(descriptor);
    }
}
export default Sampler;
//# sourceMappingURL=Sampler.js.map