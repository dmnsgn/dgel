import State from "./State.js";

import Attribute from "./Attribute.js";
import Struct from "./Struct.js";
import { GLSLShaderType } from "../types.js";
import { addLineNumbers } from "../utils.js";

class Shader {
  public version = "#version 450";

  public shaderModule: GPUShaderModule;
  private source: string;

  constructor(
    public type: GLSLShaderType,
    public body: string,
    public ins?: Attribute[],
    public outs?: Attribute[],
    public structs?: Struct[]
  ) {}

  public init(uniformHeaders: string): void {
    const { structs, ins, outs } = this.getGLSLHeaders();

    this.source = `${this.version}
${[structs, uniformHeaders, ins, outs].filter(Boolean).join("\n")}

${this.body}`;
    if (State.debug) console.log(addLineNumbers(this.source));

    this.shaderModule = State.device.createShaderModule({
      code: State.glslang.compileGLSL(this.source, this.type),
    });
  }

  public getGLSLHeaders(): { structs?: string; ins?: string; outs?: string } {
    const structs =
      this.structs?.map((struct) => struct.getGLSLString()).join("\n") || "";
    const ins =
      this.ins
        ?.map(
          (attribute, index) =>
            `layout(location = ${index}) in ${attribute.type} ${attribute.name};`
        )
        .join("\n") || "";
    const outs =
      this.outs
        ?.map(
          (attribute, index) =>
            `layout(location = ${index}) out ${attribute.type} ${attribute.name};`
        )
        .join("\n") || "";

    return {
      structs,
      ins,
      outs,
    };
  }
}

export default Shader;
