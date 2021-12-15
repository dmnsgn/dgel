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
                        view: colorAttachment.view,
                        resolveTarget: colorAttachment.resolveTarget,
                        loadValue: colorAttachment.value,
                        storeOp: colorAttachment.op,
                    })),
                }),
                ...((this.depthAttachment || this.stencilAttachment) && {
                    depthStencilAttachment: {
                        view: this.depthAttachment.view,
                        depthLoadValue: this.depthAttachment?.value || 0.0,
                        depthStoreOp: this.depthAttachment?.op || "store",
                        stencilLoadValue: this.stencilAttachment?.value || 0.0,
                        stencilStoreOp: this.stencilAttachment?.op || "store",
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