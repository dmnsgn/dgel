import Variable from "./Variable.js";
import Uniform from "./Uniform.js";
import Attribute from "./Attribute.js";
import BuiltIn from "./BuiltIn.js";
import { formatLowerFirst, TAB } from "../utils.js";
// https://www.w3.org/TR/WGSL/#struct-types
// A structure member type must be one of:
// - a scalar type
// - a vector type
// - a matrix type
// - an atomic type
// - an array type
// - a structure type
class Struct extends Variable {
    constructor(name, members, visibility, arrayCount) {
        super(name);
        this.name = name;
        this.members = members;
        this.visibility = visibility;
        this.arrayCount = arrayCount;
    }
    get wgslType() {
        return this.name;
    }
    get glslType() {
        return this.name;
    }
    get format() {
        return "float32";
    }
    getSize() {
        return this.members
            .map((member) => member.getSize() * (member.arrayCount || 1))
            .reduce((a, b) => a + b, 0);
    }
    // TODO:
    // stride
    // align
    // size
    getWGSLMemberString() {
        return `${this.wgslType} ${this.memberName || formatLowerFirst(this.name)}${this.arrayCount ? `[${this.arrayCount}]` : ""}`;
    }
    getGLSLMemberString() {
        return `${this.glslType} ${this.memberName || formatLowerFirst(this.name)}${this.arrayCount ? `[${this.arrayCount}]` : ""}`;
    }
    getWGSLString() {
        if (!this.members.length) {
            console.error("Struct missing members.", this);
            return "";
        }
        const builtIns = this.members
            .filter((member) => member instanceof BuiltIn)
            .map((variable) => variable.getWGSLString() + ",");
        const attributes = this.members
            .filter((member) => member instanceof Attribute)
            .map((variable, index) => variable.getWGSLString(index) + ",");
        const uniforms = this.members
            .filter((member) => member instanceof Uniform)
            .map((variable) => variable.getWGSLString() + ",");
        const structs = this.members
            .filter((member) => member instanceof Struct)
            .map((variable) => variable.getWGSLMemberString() + ",");
        const variables = this.members
            .filter((member) => member.constructor.name === "Variable")
            .map((variable) => variable.getWGSLString() + ",");
        return /* wgsl */ `struct ${this.name} {
${TAB}${[...builtIns, ...attributes, ...uniforms, ...structs, ...variables]
            .filter(Boolean)
            .join(`\n${TAB}`)}
};
`;
    }
    getGLSLString() {
        const attributes = this.members
            .filter((member) => member instanceof Attribute)
            .map((variable) => variable.getGLSLString() + ";");
        const uniforms = this.members
            .filter((member) => member instanceof Uniform)
            .map((variable) => variable.getGLSLString() + ";");
        const structs = this.members
            .filter((member) => member instanceof Struct)
            .map((variable) => variable.getWGSLMemberString() + ";");
        const variables = this.members
            .filter((member) => member.constructor.name === "Variable")
            .map((variable) => variable.getGLSLString() + ";");
        return /* glsl */ `struct ${this.name} {
${TAB}${[...attributes, ...uniforms, ...structs, ...variables]
            .filter(Boolean)
            .join(`\n${TAB}`)}
};
`;
    }
}
export default Struct;
//# sourceMappingURL=Struct.js.map