import { AttachmentOptions } from "../types.js";

class Attachment {
  public op: GPULoadOp = "clear";
  public storeOp: GPUStoreOp = "store";

  public view?: GPUTextureView;
  public resolveTarget?: GPUTextureView;

  constructor(
    public value: GPUColorDict | GPUColor | number,
    options: AttachmentOptions
  ) {
    Object.assign(this, options);
  }
}

export default Attachment;
