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
                view: colorAttachment.view,
                resolveTarget: colorAttachment.resolveTarget,
                loadValue: colorAttachment.value,
                storeOp: colorAttachment.op,
              } as GPURenderPassColorAttachment)
          ),
        }),
        ...((this.depthAttachment || this.stencilAttachment) && {
          depthStencilAttachment: {
            view: this.depthAttachment.view,
            depthLoadValue: this.depthAttachment?.value || 0.0,
            depthStoreOp: this.depthAttachment?.op || "store",
            stencilLoadValue: this.stencilAttachment?.value || 0.0,
            stencilStoreOp: this.stencilAttachment?.op || "store",
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
