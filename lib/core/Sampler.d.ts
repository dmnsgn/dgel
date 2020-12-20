/// <reference types="@webgpu/types" />
declare class Sampler {
    gpuSampler: GPUSampler;
    constructor(descriptor?: GPUSamplerDescriptor);
}
export default Sampler;
