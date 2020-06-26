import Shader from "./Shader";
import BindGroupLayout from "./BindGroupLayout.js";
import Uniform from "./Uniform.js";
import { GLSLShaderType, BindGroupLayoutEntry } from "../types.js";
import { formatLowerFirst } from "../utils.js";
import { GPUShaderStage } from "../constants.js";

const isBindingVisible = (
  uniformOrBinding: Uniform | BindGroupLayoutEntry,
  stage: GPUShaderStageFlags
): boolean =>
  !uniformOrBinding.visibility || uniformOrBinding.visibility === stage;

class Program {
  constructor(
    public bindGroupLayouts: BindGroupLayout[],
    public shaders: { [key in GLSLShaderType]?: Shader }
  ) {}

  public init(): void {
    const headers = this.bindGroupLayouts.map((bindGroupLayout, index) =>
      this.getGLSLHeaders(index, bindGroupLayout.entries)
    );

    for (const [key, shader] of Object.entries(this.shaders)) {
      shader.init(
        headers.map((header) => header[key as GLSLShaderType]).join("\n")
      );
    }
  }

  // TODO:
  // "storage-buffer",
  // "readonly-storage-buffer",
  // "storage-texture"

  public getGLSLHeaders(
    set: number,
    entries: BindGroupLayoutEntry[]
  ): { [key in GLSLShaderType]?: string } {
    let vertex = "";
    let fragment = "";
    let compute = "";

    for (let i = 0; i < entries.length; i++) {
      const binding = entries[i];

      const layoutQualifierString = binding.qualifiers?.layout
        ? `${binding.qualifiers.layout || ""}, `
        : "";

      // uniform-buffer
      if (binding.type === "uniform-buffer") {
        let vertexUniforms;
        let fragmentUniforms;
        if (
          isBindingVisible(
            binding,
            GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT
          )
        ) {
          vertexUniforms = binding.uniforms;
          fragmentUniforms = binding.uniforms;
        } else {
          vertexUniforms = binding.uniforms.filter(() =>
            isBindingVisible(binding, GPUShaderStage.VERTEX)
          );
          fragmentUniforms = binding.uniforms.filter(() =>
            isBindingVisible(binding, GPUShaderStage.FRAGMENT)
          );
        }

        const computeUniforms = binding.uniforms.filter(() =>
          isBindingVisible(binding, GPUShaderStage.COMPUTE)
        );

        // TODO: refactor
        // Vertex
        if (vertexUniforms.length) {
          vertex += `layout(${layoutQualifierString}set = ${set}, binding = ${i}) uniform ${
            binding.name
          }Uniforms {
  ${vertexUniforms
    .map(
      (uniform) =>
        `${uniform.type} ${uniform.name}${
          uniform.arrayCount ? `[${uniform.arrayCount}]` : ""
        };`
    )
    .join("\n  ")}
} ${formatLowerFirst(binding.name)};\n\n`;
        }

        // Fragment
        if (fragmentUniforms.length) {
          fragment += `layout(${layoutQualifierString}set = ${set}, binding = ${i}) uniform ${
            binding.name
          } {
  ${fragmentUniforms
    .map(
      (uniform) =>
        `${uniform.type} ${uniform.name}${
          uniform.arrayCount ? `[${uniform.arrayCount}]` : ""
        };`
    )
    .join("\n  ")}
} ${formatLowerFirst(binding.name)};\n\n`;
        }

        if (computeUniforms.length) {
          compute += `layout(${layoutQualifierString}set = ${set}, binding = ${i}) uniform ${
            binding.name
          }Uniforms {
  ${computeUniforms
    .map(
      (uniform) =>
        `${uniform.type} ${uniform.name}${
          uniform.arrayCount ? `[${uniform.arrayCount}]` : ""
        };`
    )
    .join("\n  ")}
} ${formatLowerFirst(binding.name)};\n\n`;
        }
      }

      // storage-buffer
      if (binding.type === "storage-buffer") {
        const computeVariable = binding.members.filter(() =>
          isBindingVisible(binding, GPUShaderStage.COMPUTE)
        );

        compute += `layout(${layoutQualifierString}set = ${set}, binding = ${i}) buffer ${
          binding.name
        }Buffer {
${computeVariable
  .map(
    (variable) =>
      `  ${variable.type} ${variable.name}${
        variable.arrayCount ? `[${variable.arrayCount}]` : ""
      };`
  )
  .join("\n  ")}
} ${formatLowerFirst(binding.name)};\n\n`;
      }

      // sampler
      if (binding.type === "sampler") {
        const samplerLayout = `layout(set = ${set}, binding = ${i}) uniform ${binding.type} ${binding.name};`;

        if (isBindingVisible(binding, GPUShaderStage.VERTEX)) {
          vertex += `${samplerLayout}\n`;
        }
        if (isBindingVisible(binding, GPUShaderStage.FRAGMENT)) {
          fragment += `${samplerLayout}\n`;
        }
      }

      // sampled-texture
      if (binding.type === "sampled-texture") {
        const sampledTextureLayout = `layout(set = ${set}, binding = ${i}) uniform texture${binding.dimension.toUpperCase()} ${
          binding.name
        };`;

        if (isBindingVisible(binding, GPUShaderStage.VERTEX)) {
          vertex += `${sampledTextureLayout}\n`;
        }
        if (isBindingVisible(binding, GPUShaderStage.FRAGMENT)) {
          fragment += `${sampledTextureLayout}\n`;
        }
      }
    }

    return { vertex, fragment, compute };
  }
}

export default Program;
