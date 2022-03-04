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
                clearValue: colorAttachment.value,
                loadOp: colorAttachment.op,
                storeOp: colorAttachment.storeOp,
              } as GPURenderPassColorAttachment)
          ),
        }),
        ...((this.depthAttachment || this.stencilAttachment) && {
          depthStencilAttachment: {
            view: this.depthAttachment.view,
            depthLoadOp: this.depthAttachment?.op || "clear",
            depthClearValue: this.depthAttachment?.value || 0,
            depthStoreOp: this.depthAttachment?.storeOp || "store",
            stencilLoadOp: this.stencilAttachment?.op || "clear",
            stencilClearValue: this.stencilAttachment?.value || 0,
            stencilStoreOp: this.stencilAttachment?.storeOp || "store",
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
