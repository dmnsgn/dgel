import { GPUIndexFormat } from "../constants.js";
class Command {
    constructor(options) {
        this.indexFormat = GPUIndexFormat.Uint32;
        Object.assign(this, options);
    }
}
export default Command;
//# sourceMappingURL=Command.js.map