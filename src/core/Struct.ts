import Variable from "./Variable.js";
import { formatLowerFirst } from "../utils.js";

class Struct {
  constructor(
    public type: string,
    public members: (Variable | Struct)[],
    public name?: string,
    public visibility?: GPUShaderStageFlags,
    public arrayCount?: number
  ) {
    this.name = name || formatLowerFirst(type);
  }

  public getGLSLString(): string {
    return /* glsl */ `struct ${this.type} {
${this.members
  .map((variable) => `  ${variable.type} ${variable.name};`)
  .join("\n")}
};
`;
  }
}

export default Struct;
