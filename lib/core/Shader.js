import State from "./State.js";
import Uniform from "./Uniform.js";
import Attribute from "./Attribute.js";
import BuiltIn from "./BuiltIn.js";
import Struct from "./Struct.js";
import { addLineNumbers, TAB } from "../utils.js";
import { GPUShaderStageName } from "../constants.js";
class Shader {
    constructor(options) {
        Object.assign(this, options);
    }
    init(uniformHeaders) {
        const isWGSL = this.language === "wgsl";
        const { structs, ins, outs } = isWGSL
            ? this.getWGSLHeaders()
            : this.getGLSLHeaders();
        const stage = GPUShaderStageName[this.type];
        this.source = isWGSL
            ? /* wgsl */ `${[structs, uniformHeaders, outs]
                .filter(Boolean)
                .join("\n")}
${this.body || ""}
@stage(${stage})
fn main(
${TAB}${ins}
) -> ${outs ? "Output" : "@location(0) vec4<f32>"} {${this.main}}`
            : /* glsl */ `#version 450
${[structs, uniformHeaders, ins, outs].filter(Boolean).join("\n")}
${this.body || ""}
void main() {${this.main}}`;
        if (State.debug)
            console.log(addLineNumbers(this.source));
        this.shaderModule = State.device.createShaderModule({
            code: isWGSL
                ? this.source
                : State.glslang.compileGLSL(this.source, stage),
        });
    }
    getWGSLHeaders() {
        const structs = this.structs
            ?.filter((struct) => struct.visibility !== undefined
            ? struct.visibility === this.type
            : true)
            .map((struct) => struct.getWGSLString())
            .join("\n") || "";
        const ins = (this.ins
            ? [
                ...this.ins
                    .filter((member) => member instanceof BuiltIn)
                    .filter((member) => member.visibility === this.type)
                    .map((variable) => variable.getWGSLString()),
                ...this.ins
                    .filter((member) => member instanceof Attribute)
                    .map((variable, index) => variable.getWGSLString(index)),
                ...this.ins
                    .filter((member) => member instanceof Uniform)
                    .map((variable) => variable.getWGSLString()),
            ]
            : []).join(`,\n${TAB}`);
        const outs = this.outs?.filter((member) => {
            if (member.io) {
                return (member.visibility === this.type && member.io === "out");
            }
            return true;
        });
        return {
            structs,
            ins,
            outs: outs?.length ? new Struct("Output", outs).getWGSLString() : "",
        };
    }
    getGLSLHeaders() {
        const structs = this.structs
            ?.filter((struct) => struct.visibility !== undefined
            ? struct.visibility === this.type
            : true)
            .map((struct) => struct.getGLSLString())
            .join("\n") || "";
        const ins = this.ins
            ?.filter((member) => !(member instanceof BuiltIn))
            .map((attribute, index) => `layout(location = ${index}) in ${attribute.type} ${attribute.name};`)
            .join("\n") || "";
        const outs = this.outs
            ?.filter((member) => !(member instanceof BuiltIn))
            .map((attribute, index) => `layout(location = ${index}) out ${attribute.type} ${attribute.name};`)
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