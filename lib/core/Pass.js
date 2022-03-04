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
                        clearValue: colorAttachment.value,
                        loadOp: colorAttachment.op,
                        storeOp: colorAttachment.storeOp,
                    })),
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