import { formatLowerFirst } from "../utils.js";
import {
  GLSL_SCALARS_TO_WGSL,
  WGSL_SCALARS_TO_GLSL_PREFIX,
  WGSL_MATRIX_TO_GLSL,
  WGSL_TYPE_TO_GPU_VERTEX_FORMAT,
} from "../constants.js";
import { GLSLLayoutQualifier } from "../types.js";

// TODO: parameter
const dataType = "32";

class Variable {
  static isWgsl(type: string): boolean {
    return (
      type.includes("<") ||
      Object.keys(WGSL_SCALARS_TO_GLSL_PREFIX).includes(type)
    );
  }

  constructor(
    public name: string,
    public type?: string,
    public visibility?: GPUShaderStageFlags,
    public arrayCount?: number
  ) {}

  // Type conversion
  // https://www.w3.org/TR/WGSL/#alignment-and-size
  public get wgslType(): string {
    if (Variable.isWgsl(this.type)) {
      return this.type;
    }

    // Scalars
    if (Object.keys(GLSL_SCALARS_TO_WGSL).includes(this.type)) {
      return GLSL_SCALARS_TO_WGSL[this.type];
    }
    // Vectors
    else if (this.type.startsWith("vec")) {
      return `${this.type}<f32>`;
    } else if (this.type.substring(1, 4).startsWith("dvec")) {
      return `${this.type}<f32>`;
      // return `${this.type}<f64>`;
    } else if (this.type.startsWith("ivec")) {
      return `${this.type.substring(1, 4)}<i32>`;
    } else if (this.type.startsWith("uvec")) {
      return `${this.type.substring(1, 4)}<u32>`;
    } else if (this.type.startsWith("bvec")) {
      return `${this.type.substring(1, 4)}<bool>`;
    }
    // Matrices
    else if (this.type.startsWith("mat")) {
      const [col, row] = this.type.substring(3).split("x").map(parseInt);
      return `${row ? this.type : `${this.type}x${col}`}<f32>`;
    } else if (this.type.startsWith("dmat")) {
      const [col, row] = this.type.substring(3).split("x").map(parseInt);
      return `${row ? this.type : `${this.type}x${col}`}<f64>`;
    }

    console.error(`Unsupported variable type ${this.type}`);

    return "";
  }

  public get glslType(): string {
    if (Variable.isWgsl(this.type)) {
      // Scalars
      if (Object.values(GLSL_SCALARS_TO_WGSL).includes(this.type)) {
        return Object.keys(GLSL_SCALARS_TO_WGSL).find(
          (key) => GLSL_SCALARS_TO_WGSL[key] === this.type
        );
      }
      // Vectors
      else if (this.type.startsWith("vec")) {
        const prefix =
          WGSL_SCALARS_TO_GLSL_PREFIX[
            this.type.substring(
              this.type.indexOf("<") + 1,
              this.type.lastIndexOf(">")
            )
          ];

        return `${prefix}${this.type.substring(0, 4)}`;
      }
      // Matrices
      else if (this.type.startsWith("mat")) {
        return WGSL_MATRIX_TO_GLSL[this.type.substring(0, 6)];
      } else {
        console.error(`Unsupported variable type ${this.type}`);
      }
    }

    return this.type;
  }

  // WebGPU vertex format
  // https://www.w3.org/TR/webgpu/#vertex-formats
  public get format(): string {
    if (Variable.isWgsl(this.type)) {
      return WGSL_TYPE_TO_GPU_VERTEX_FORMAT[this.type];
    }

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
    if (this.type === "float" || this.type === "f32") {
      return Float32Array.BYTES_PER_ELEMENT;
    } else if (this.type === "double" || this.type === "f64") {
      return Float64Array.BYTES_PER_ELEMENT;
    } else if (this.type === "int" || this.type === "i32") {
      return Int16Array.BYTES_PER_ELEMENT;
    } else if (this.type === "uint") {
      return Uint16Array.BYTES_PER_ELEMENT;
    } else if (this.type === "u32") {
      return Uint32Array.BYTES_PER_ELEMENT;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getWGSLString(_index?: number): string {
    return /* wgsl */ `${this.name}: ${this.arrayCount ? `array<` : ""}${
      this.wgslType
    }${this.arrayCount ? `, ${this.arrayCount}>` : ""}`;
  }

  public getGLSLString(): string {
    return /* glsl */ `${this.glslType} ${formatLowerFirst(this.name)}${
      this.arrayCount ? `[${this.arrayCount}]` : ""
    }`;
  }
}

export default Variable;
