class Variable {
  constructor(name, type, visibility, arrayCount) {
    this.name = name;
    this.type = type;
    this.visibility = visibility;
    this.arrayCount = arrayCount;
  }

  get format() {
    // Scalars
    if (this.type === "float") {
      return "float";
    } else if (this.type === "double") {
      return "double";
    } else if (this.type === "int") {
      return "int";
    } else if (this.type === "uint") {
      return "uint";
    } else if (this.type === "bool") {
      return ""; // TODO: ??
    } // Vectors
    else if (this.type.startsWith("vec")) {
        return `float${this.type.substring(3)}`;
      } else if (this.type.startsWith("dvec")) {
        return `double${this.type.substring(4)}`;
      } else if (this.type.startsWith("ivec")) {
        return `int${this.type.substring(4)}`;
      } else if (this.type.startsWith("uvec")) {
        return `uint${this.type.substring(4)}`;
      } else if (this.type.startsWith("bvec")) {
        return ""; // TODO: ??
      } // Matrices
      else if (this.type.startsWith("mat")) {
          return "float";
        } else if (this.type.startsWith("dmat")) {
          return "double";
        }

    console.error(`Unsupported variable type ${this.type}`);
    return "";
  } // https://www.khronos.org/registry/OpenGL/specs/gl/glspec45.core.pdf#page=159


  static getAlignement(size, qualifier) {
    // Shader storage blocks only
    if (!qualifier || qualifier === "std430") {
      return size;
    } // Standard Uniform Block Layout and Shader storage blocks
    else if (qualifier === "std140") {
        switch (size) {
          case 0:
            return 1;

          case 1:
            return 1;

          case 2:
            return 2;

          case 3:
            return 4;

          case 4:
            return 4;

          default:
            console.error(`Unsupported variable size ${size}`);
        }
      }
  }

  getSize(qualifier) {
    // Scalars
    if (this.type === "float") {
      return Float32Array.BYTES_PER_ELEMENT;
    } else if (this.type === "double") {
      return Float64Array.BYTES_PER_ELEMENT;
    } else if (this.type === "int") {
      return Int16Array.BYTES_PER_ELEMENT;
    } else if (this.type === "uint") {
      return Uint16Array.BYTES_PER_ELEMENT;
    } else if (this.type === "bool") {
      return 1;
    } // Vectors
    else if (this.type.startsWith("vec")) {
        return Float32Array.BYTES_PER_ELEMENT * Variable.getAlignement(parseInt(this.type.substring(3)), qualifier);
      } else if (this.type.startsWith("dvec")) {
        return Float64Array.BYTES_PER_ELEMENT * Variable.getAlignement(parseInt(this.type.substring(4)), qualifier);
      } else if (this.type.startsWith("ivec")) {
        return Int16Array.BYTES_PER_ELEMENT * Variable.getAlignement(parseInt(this.type.substring(4)), qualifier);
      } else if (this.type.startsWith("uvec")) {
        return Uint16Array.BYTES_PER_ELEMENT * Variable.getAlignement(parseInt(this.type.substring(4)), qualifier);
      } else if (this.type.startsWith("bvec")) {
        return 1 * Variable.getAlignement(parseInt(this.type.substring(4)), qualifier);
      } // Matrices
      else if (this.type.startsWith("mat")) {
          const [col, row] = this.type.substring(3).split("x").map(parseInt);
          return Float32Array.BYTES_PER_ELEMENT * Variable.getAlignement(col, qualifier) * Variable.getAlignement(row || col, qualifier);
        } else if (this.type.startsWith("dmat")) {
          const [col, row] = this.type.substring(4).split("x").map(parseInt);
          return Float64Array.BYTES_PER_ELEMENT * Variable.getAlignement(col, qualifier) * Variable.getAlignement(row || col, qualifier);
        }

    console.error(`Unsupported variable type ${this.type}`);
    return -1;
  }

}

export default Variable;