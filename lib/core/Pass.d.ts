/// <reference types="@webgpu/types" />
import Attachment from "./Attachment.js";
import { PassType } from "../types.js";
declare class Pass {
    type: PassType;
    colorAttachments?: Attachment[];
    depthAttachment?: Attachment;
    stencilAttachment?: Attachment;
    constructor(type: PassType, colorAttachments?: Attachment[], depthAttachment?: Attachment, stencilAttachment?: Attachment);
    get descriptor(): GPURenderPassDescriptor | null;
}
export default Pass;
