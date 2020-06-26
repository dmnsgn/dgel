import Variable from "./Variable.js";

class Uniform extends Variable {
  constructor(name, type, visibility, arrayCount) {
    super(name, type);
    this.name = name;
    this.type = type;
    this.visibility = visibility;
    this.arrayCount = arrayCount;
  }

}

export default Uniform;