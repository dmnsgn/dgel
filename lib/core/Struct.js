import { formatLowerFirst } from "../utils.js";

class Struct {
  constructor(type, members, name, visibility, arrayCount) {
    this.type = type;
    this.members = members;
    this.name = name;
    this.visibility = visibility;
    this.arrayCount = arrayCount;
    this.name = name || formatLowerFirst(type);
  }

  getGLSLString() {
    return (
      /* glsl */
      `struct ${this.type} {
${this.members.map(variable => `  ${variable.type} ${variable.name};`).join("\n")}
};
`
    );
  }

}

export default Struct;