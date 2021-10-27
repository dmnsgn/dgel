import Variable from "./Variable.js";
class BuiltIn extends Variable {
    constructor(name, type, visibility, io) {
        super(name, type);
        this.name = name;
        this.type = type;
        this.visibility = visibility;
        this.io = io;
    }
    getWGSLString() {
        return /* wgsl */ `[[builtin(${this.name})]] ${this.name}: ${this.wgslType}`;
    }
}
export default BuiltIn;
//# sourceMappingURL=BuiltIn.js.map