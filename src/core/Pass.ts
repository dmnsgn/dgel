import Attachment from "./Attachment.js";
import { PassType } from "../types.js";

class Pass {
  constructor(
    public type: PassType,
    public colorAttachments?: Attachment[],
    public depthAttachment?: Attachment,
    public stencilAttachment?: Attachment
  ) {}

  public get descriptor(): GPURenderPassDescriptor | null {
    if (this.type === "render") {
      return {
        ...(this.colorAttachments && {
          colorAttachments: this.colorAttachments.map(
            (colorAttachment) =>
              ({
                loadValue: colorAttachment.value,
                ...((colorAttachment.op && { storeOp: colorAttachment.op }) ||
                  {}),
              } as GPURenderPassColorAttachment)
          ),
        }),
        ...((this.depthAttachment || this.stencilAttachment) && {
          depthStencilAttachment: {
            depthLoadValue: this.depthAttachment.value || 0.0,
            depthStoreOp: this.depthAttachment.op || "store",
            stencilLoadValue: this.depthAttachment.value || 0.0,
            stencilStoreOp: this.depthAttachment.op || "store",
          } as GPURenderPassDepthStencilAttachment,
        }),
      };
    }
    // else if (this.type === "compute") {
    // }
    return null;
  }
}

export default Pass;
