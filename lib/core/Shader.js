import State from "./State.js";
import { addLineNumbers } from "../utils.js";
class Shader {
    constructor(type, body, ins, outs, structs) {
        this.type = type;
        this.body = body;
        this.ins = ins;
        this.outs = outs;
        this.structs = structs;
        this.version = "#version 450";
    }
    init(uniformHeaders) {
        const { structs, ins, outs } = this.getGLSLHeaders();
        this.source = `${this.version}
${[structs, uniformHeaders, ins, outs].filter(Boolean).join("\n")}

${this.body}`;
        if (State.debug)
            console.log(addLineNumbers(this.source));
        this.shaderModule = State.device.createShaderModule({
            code: State.glslang.compileGLSL(this.source, this.type),
        });
    }
    getGLSLHeaders() {
        const structs = this.structs?.map((struct) => struct.getGLSLString()).join("\n") || "";
        const ins = this.ins
            ?.map((attribute, index) => `layout(location = ${index}) in ${attribute.type} ${attribute.name};`)
            .join("\n") || "";
        const outs = this.outs
            ?.map((attribute, index) => `layout(location = ${index}) out ${attribute.type} ${attribute.name};`)
            .join("\n") || "";
        return {
            structs,
            ins,
            outs,
        };
    }
}
export default Shader;
//# sourceMappingURL=Shader.js.map