import State from "./State.js";
class BindGroupLayout {
    constructor(entries = []) {
        this.entries = entries;
        this.gpuBindGroupLayout = State.device.createBindGroupLayout({
            entries: entries.map(({ visibility, buffer, sampler, texture, storageTexture }, binding) => ({
                binding,
                visibility,
                buffer,
                sampler,
                texture,
                storageTexture,
            })),
        });
    }
    getBindGroupSize() {
        let size = 0;
        for (let i = 0; i < this.entries.length; i++) {
            const entry = this.entries[i];
            if (entry.buffer) {
                size += this.getBindingSize(entry);
            }
        }
        return size;
    }
    getBindingSize(entry) {
        let size = 0;
        if (entry.buffer) {
            size += entry.uniforms
                .map((uniform) => uniform.arrayCount
                ? uniform.getSize(entry.qualifiers?.layout) * uniform.arrayCount
                : uniform.getSize(entry.qualifiers?.layout))
                .reduce((a, b) => a + b, 0);
        }
        return size;
    }
}
export default BindGroupLayout;
//# sourceMappingURL=BindGroupLayout.js.map