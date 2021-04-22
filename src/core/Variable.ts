import { GLSLLayoutQualifier } from "../types.js";

// TODO: parameter
const dataType = "32";

class Variable {
  constructor(
    public name: string,
    public type: string,
    public visibility?: GPUShaderStageFlags,
    public arrayCount?: number
  ) {}

  public get format(): string {
    // Scalars
    if (this.type === "float") {
      return `float${dataType}`;
    } else if (this.type === "double") {
      return "double";
    } else if (this.type === "int") {
      return `sint${dataType}`;
    } else if (this.type === "uint") {
      return `uint${dataType}`;
    } else if (this.type === "bool") {
      return ""; // TODO: ??
    }
    // Vectors
    else if (this.type.startsWith("vec")) {
      return `float${dataType}x${this.type.substring(3)}`;
    } else if (this.type.startsWith("dvec")) {
      return `double${this.type.substring(4)}`;
    } else if (this.type.startsWith("ivec")) {
      return `sint${dataType}x${this.type.substring(4)}`;
    } else if (this.type.startsWith("uvec")) {
      return `uint${dataType}x${this.type.substring(4)}`;
    } else if (this.type.startsWith("bvec")) {
      return ""; // TODO: ??
    }
    // Matrices
    else if (this.type.startsWith("mat")) {
      return `float${dataType}`;
    } else if (this.type.startsWith("dmat")) {
      return "double";
    }

    console.error(`Unsupported variable type ${this.type}`);

    return "";
  }

  // https://www.khronos.org/registry/OpenGL/specs/gl/glspec45.core.pdf#page=159
  public static getAlignement(
    size: number,
    qualifier?: GLSLLayoutQualifier
  ): number {
    // Shader storage blocks only
    if (!qualifier || qualifier === "std430") {
      return size;
    }
    // Standard Uniform Block Layout and Shader storage blocks
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

  public getSize(qualifier?: GLSLLayoutQualifier): number {
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
    }
    // Vectors
    else if (this.type.startsWith("vec")) {
      return (
        Float32Array.BYTES_PER_ELEMENT *
        Variable.getAlignement(parseInt(this.type.substring(3)), qualifier)
      );
    } else if (this.type.startsWith("dvec")) {
      return (
        Float64Array.BYTES_PER_ELEMENT *
        Variable.getAlignement(parseInt(this.type.substring(4)), qualifier)
      );
    } else if (this.type.startsWith("ivec")) {
      return (
        Int16Array.BYTES_PER_ELEMENT *
        Variable.getAlignement(parseInt(this.type.substring(4)), qualifier)
      );
    } else if (this.type.startsWith("uvec")) {
      return (
        Uint16Array.BYTES_PER_ELEMENT *
        Variable.getAlignement(parseInt(this.type.substring(4)), qualifier)
      );
    } else if (this.type.startsWith("bvec")) {
      return (
        1 * Variable.getAlignement(parseInt(this.type.substring(4)), qualifier)
      );
    }
    // Matrices
    else if (this.type.startsWith("mat")) {
      const [col, row] = this.type.substring(3).split("x").map(parseInt);
      return (
        Float32Array.BYTES_PER_ELEMENT *
        Variable.getAlignement(col, qualifier) *
        Variable.getAlignement(row || col, qualifier)
      );
    } else if (this.type.startsWith("dmat")) {
      const [col, row] = this.type.substring(4).split("x").map(parseInt);
      return (
        Float64Array.BYTES_PER_ELEMENT *
        Variable.getAlignement(col, qualifier) *
        Variable.getAlignement(row || col, qualifier)
      );
    }

    console.error(`Unsupported variable type ${this.type}`);

    return -1;
  }
}

export default Variable;
