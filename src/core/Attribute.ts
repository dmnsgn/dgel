import Variable from "./Variable.js";

class Attribute extends Variable {
  constructor(public name: string, public type: string) {
    super(name, type);
  }

  public getWGSLString(index: number): string {
    return /* wgsl */ `@location(${index}) ${this.name}: ${
      this.arrayCount ? `array<` : ""
    }${this.wgslType}${this.arrayCount ? `, ${this.arrayCount}>` : ""}`;
  }
}

export default Attribute;
