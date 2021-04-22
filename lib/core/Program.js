import { formatLowerFirst } from "../utils.js";
import { BindingType, GPUShaderStage } from "../constants.js";
const isBindingVisible = (uniformOrBinding, stage) => !uniformOrBinding.visibility || uniformOrBinding.visibility === stage;
class Program {
    constructor(bindGroupLayouts, shaders) {
        this.bindGroupLayouts = bindGroupLayouts;
        this.shaders = shaders;
    }
    init() {
        const headers = this.bindGroupLayouts.map((bindGroupLayout, index) => this.getGLSLHeaders(index, bindGroupLayout.entries));
        for (const [key, shader] of Object.entries(this.shaders)) {
            shader.init(headers.map((header) => header[key]).join("\n"));
        }
    }
    getGLSLDimension() { }
    getGLSLHeaders(set, entries) {
        let vertex = "";
        let fragment = "";
        let compute = "";
        for (let i = 0; i < entries.length; i++) {
            const binding = entries[i];
            const layoutQualifierString = binding.qualifiers?.layout
                ? `${binding.qualifiers.layout || ""}, `
                : "";
            // GPUBufferBinding
            if (binding.buffer) {
                // uniform-buffer
                if (!binding.buffer.type ||
                    binding.buffer.type === BindingType.Uniform) {
                    let vertexUniforms;
                    let fragmentUniforms;
                    if (isBindingVisible(binding, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT)) {
                        vertexUniforms = binding.uniforms;
                        fragmentUniforms = binding.uniforms;
                    }
                    else {
                        vertexUniforms = binding.uniforms.filter(() => isBindingVisible(binding, GPUShaderStage.VERTEX));
                        fragmentUniforms = binding.uniforms.filter(() => isBindingVisible(binding, GPUShaderStage.FRAGMENT));
                    }
                    const computeUniforms = binding.uniforms.filter(() => isBindingVisible(binding, GPUShaderStage.COMPUTE));
                    // TODO: refactor
                    // Vertex
                    if (vertexUniforms.length) {
                        vertex += `layout(${layoutQualifierString}set = ${set}, binding = ${i}) uniform ${binding.name}Uniforms {
  ${vertexUniforms
                            .map((uniform) => `${uniform.type} ${uniform.name}${uniform.arrayCount ? `[${uniform.arrayCount}]` : ""};`)
                            .join("\n  ")}
} ${formatLowerFirst(binding.name)};\n\n`;
                    }
                    // Fragment
                    if (fragmentUniforms.length) {
                        fragment += `layout(${layoutQualifierString}set = ${set}, binding = ${i}) uniform ${binding.name} {
  ${fragmentUniforms
                            .map((uniform) => `${uniform.type} ${uniform.name}${uniform.arrayCount ? `[${uniform.arrayCount}]` : ""};`)
                            .join("\n  ")}
} ${formatLowerFirst(binding.name)};\n\n`;
                    }
                    if (computeUniforms.length) {
                        compute += `layout(${layoutQualifierString}set = ${set}, binding = ${i}) uniform ${binding.name}Uniforms {
  ${computeUniforms
                            .map((uniform) => `${uniform.type} ${uniform.name}${uniform.arrayCount ? `[${uniform.arrayCount}]` : ""};`)
                            .join("\n  ")}
} ${formatLowerFirst(binding.name)};\n\n`;
                    }
                }
                else if (binding.buffer.type === BindingType.Storage) {
                    const computeVariable = binding.members.filter(() => isBindingVisible(binding, GPUShaderStage.COMPUTE));
                    compute += `layout(${layoutQualifierString}set = ${set}, binding = ${i}) buffer ${binding.name}Buffer {
${computeVariable
                        .map((variable) => `  ${variable.type} ${variable.name}${variable.arrayCount ? `[${variable.arrayCount}]` : ""};`)
                        .join("\n  ")}
} ${formatLowerFirst(binding.name)};\n\n`;
                }
            }
            else if (binding.sampler) {
                const samplerLayout = `layout(set = ${set}, binding = ${i}) uniform sampler${binding.samplerType || ""} ${binding.name};`;
                if (isBindingVisible(binding, GPUShaderStage.VERTEX)) {
                    vertex += `${samplerLayout}\n`;
                }
                if (isBindingVisible(binding, GPUShaderStage.FRAGMENT)) {
                    fragment += `${samplerLayout}\n`;
                }
            }
            else if (binding.texture) {
                const textureLayout = `layout(set = ${set}, binding = ${i}) uniform texture${binding.dimension.toUpperCase()} ${binding.name};`;
                if (isBindingVisible(binding, GPUShaderStage.VERTEX)) {
                    vertex += `${textureLayout}\n`;
                }
                if (isBindingVisible(binding, GPUShaderStage.FRAGMENT)) {
                    fragment += `${textureLayout}\n`;
                }
            }
            else if (binding.storageTexture) {
                // TODO:
            }
        }
        return { vertex, fragment, compute };
    }
}
export default Program;
//# sourceMappingURL=Program.js.map