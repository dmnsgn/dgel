class Pass {
    constructor(type, colorAttachments, depthAttachment, stencilAttachment) {
        this.type = type;
        this.colorAttachments = colorAttachments;
        this.depthAttachment = depthAttachment;
        this.stencilAttachment = stencilAttachment;
    }
    get descriptor() {
        if (this.type === "render") {
            return {
                ...(this.colorAttachments && {
                    colorAttachments: this.colorAttachments.map((colorAttachment) => ({
                        loadValue: colorAttachment.value,
                        ...((colorAttachment.op && { storeOp: colorAttachment.op }) ||
                            {}),
                    })),
                }),
                ...((this.depthAttachment || this.stencilAttachment) && {
                    depthStencilAttachment: {
                        depthLoadValue: this.depthAttachment.value || 0.0,
                        depthStoreOp: this.depthAttachment.op || "store",
                        stencilLoadValue: this.depthAttachment.value || 0.0,
                        stencilStoreOp: this.depthAttachment.op || "store",
                    },
                }),
            };
        }
        // else if (this.type === "compute") {
        // }
        return null;
    }
}
export default Pass;
//# sourceMappingURL=Pass.js.map