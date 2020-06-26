class Attachment {
  constructor(
    public value: GPUColorDict | GPUColor | number,
    public view?: GPUTextureView,
    public op: GPUStoreOp = "store"
  ) {}
}

export default Attachment;
