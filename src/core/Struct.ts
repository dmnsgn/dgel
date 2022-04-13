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
  public memberName?: string;

  constructor(
    public name: string,
    public members: (Variable | Struct)[],
    public visibility?: GPUShaderStageFlags,
    public arrayCount?: number
  ) {
    super(name);
  }

  public get wgslType(): string {
    return this.name;
  }

  public get glslType(): string {
    return this.name;
  }

  public get format(): string {
    return "float32";
  }

  public getSize(): number {
    return this.members
      .map((member) => member.getSize() * (member.arrayCount || 1))
      .reduce((a, b) => a + b, 0);
  }

  // TODO:
  // stride
  // align
  // size
  public getWGSLMemberString(): string {
    return `${this.wgslType} ${this.memberName || formatLowerFirst(this.name)}${
      this.arrayCount ? `[${this.arrayCount}]` : ""
    }`;
  }
  public getGLSLMemberString(): string {
    return `${this.glslType} ${this.memberName || formatLowerFirst(this.name)}${
      this.arrayCount ? `[${this.arrayCount}]` : ""
    }`;
  }

  public getWGSLString(): string {
    if (!this.members.length) {
      console.error("Struct missing members.", this);
      return "";
    }

    const builtIns = this.members
      .filter((member) => member instanceof BuiltIn)
      .map((variable) => (variable as BuiltIn).getWGSLString() + ",");
    const attributes = this.members
      .filter((member) => member instanceof Attribute)
      .map(
        (variable, index) => (variable as Attribute).getWGSLString(index) + ","
      );
    const uniforms = this.members
      .filter((member) => member instanceof Uniform)
      .map((variable) => (variable as Uniform).getWGSLString() + ",");
    const structs = this.members
      .filter((member) => member instanceof Struct)
      .map((variable) => (variable as Struct).getWGSLMemberString() + ",");
    const variables = this.members
      .filter((member) => member.constructor.name === "Variable")
      .map((variable) => (variable as BuiltIn).getWGSLString() + ",");

    return /* wgsl */ `struct ${this.name} {
${TAB}${[...builtIns, ...attributes, ...uniforms, ...structs, ...variables]
      .filter(Boolean)
      .join(`\n${TAB}`)}
};
`;
  }

  public getGLSLString(): string {
    const attributes = this.members
      .filter((member) => member instanceof Attribute)
      .map((variable) => (variable as Attribute).getGLSLString() + ";");
    const uniforms = this.members
      .filter((member) => member instanceof Uniform)
      .map((variable) => (variable as Uniform).getGLSLString() + ";");
    const structs = this.members
      .filter((member) => member instanceof Struct)
      .map((variable) => (variable as Struct).getWGSLMemberString() + ";");
    const variables = this.members
      .filter((member) => member.constructor.name === "Variable")
      .map((variable) => (variable as BuiltIn).getGLSLString() + ";");

    return /* glsl */ `struct ${this.name} {
${TAB}${[...attributes, ...uniforms, ...structs, ...variables]
      .filter(Boolean)
      .join(`\n${TAB}`)}
};
`;
  }
}

export default Struct;
