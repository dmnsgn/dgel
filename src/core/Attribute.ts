import Variable from "./Variable.js";

class Attribute extends Variable {
  constructor(public name: string, public type: string) {
    super(name, type);
  }
}

export default Attribute;
