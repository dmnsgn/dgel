import Variable from "./Variable.js";
class Attribute extends Variable {
    constructor(name, type) {
        super(name, type);
        this.name = name;
        this.type = type;
    }
    getWGSLString(index) {
        return /* wgsl */ `[[location(${index})]] ${this.name}: ${this.arrayCount ? `array<` : ""}${this.wgslType}${this.arrayCount ? `, ${this.arrayCount}>` : ""}`;
    }
}
export default Attribute;
//# sourceMappingURL=Attribute.js.map