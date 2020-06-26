import Variable from "./Variable.js";

class Uniform extends Variable {
  constructor(
    public name: string,
    public type: string,
    public visibility?: GPUShaderStageFlags,
    public arrayCount?: number
  ) {
    super(name, type);
  }
}

export default Uniform;
