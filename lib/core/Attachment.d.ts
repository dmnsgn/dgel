/// <reference types="@webgpu/types" />
declare class Attachment {
    value: GPUColorDict | GPUColor | number;
    view?: GPUTextureView;
    op: GPUStoreOp;
    constructor(value: GPUColorDict | GPUColor | number, view?: GPUTextureView, op?: GPUStoreOp);
}
export default Attachment;
