import Struct from "./Struct.js";
import { formatLowerFirst, formatUpperFirst } from "../utils.js";
import { AccessMode, BindingType, StorageClass, GPUShaderStage, } from "../constants.js";
const isBindingVisible = (uniformOrBinding, stage) => !uniformOrBinding.visibility || uniformOrBinding.visibility === stage;
class Program {
    constructor(bindGroupLayouts, shaders, language) {
        this.bindGroupLayouts = bindGroupLayouts;
        this.shaders = shaders;
        this.language = language;
    }
    init() {
        const headers = this.bindGroupLayouts?.map((bindGroupLayout, index) => this[`get${this.language.toUpperCase()}Headers`](index, bindGroupLayout.entries));
        for (const [key, shader] of Object.entries(this.shaders)) {
            shader.init(headers?.map((header) => header[key]).join("\n"));
        }
    }
    getWGSLBufferString(binding, bindingIndex, uniforms, set, storageClass, accesMode) {
        const structName = `${binding.name}${formatUpperFirst(storageClass)}`;
        const params = new Struct(structName, uniforms).getWGSLString();
        const referenceType = [storageClass, accesMode].filter(Boolean).join(",");
        return /* wgsl */ `${params}
[[group(${set}), binding(${bindingIndex})]] var<${referenceType}> ${formatLowerFirst(binding.name)}: ${structName};
`;
    }
    getWGSLHeaders(set, entries) {
        let vertex = "";
        let fragment = "";
        let compute = "";
        for (let i = 0; i < entries.length; i++) {
            const binding = entries[i];
            if (binding.buffer) {
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
                    if (vertexUniforms.length) {
                        vertex += this.getWGSLBufferString(binding, i, vertexUniforms, set, StorageClass.Uniform);
                    }
                    if (fragmentUniforms.length) {
                        fragment += this.getWGSLBufferString(binding, i, fragmentUniforms, set, StorageClass.Uniform);
                    }
                    if (computeUniforms.length) {
                        compute += this.getWGSLBufferString(binding, i, computeUniforms, set, StorageClass.Uniform);
                    }
                }
                else if ([
                    BindingType.Storage,
                    BindingType.ReadonlyStorage,
                ].includes(binding.buffer.type)) {
                    const computeVariables = binding.members.filter(() => isBindingVisible(binding, GPUShaderStage.COMPUTE));
                    compute += this.getWGSLBufferString(binding, i, computeVariables, set, StorageClass.Storage, binding.buffer.type === BindingType.ReadonlyStorage
                        ? AccessMode.Read
                        : AccessMode.Write);
                }
            }
            else if (binding.sampler) {
                const samplerLayout = /* wgsl*/ `[[group(${set}), binding(${i})]] var ${binding.name}: sampler;`;
                if (isBindingVisible(binding, GPUShaderStage.VERTEX)) {
                    vertex += `${samplerLayout}\n`;
                }
                if (isBindingVisible(binding, GPUShaderStage.FRAGMENT)) {
                    fragment += `${samplerLayout}\n`;
                }
            }
            else if (binding.texture) {
                const referenceType = binding.texture.sampleType || "f32";
                const textureLayout = /* wgsl*/ `[[group(${set}), binding(${i})]] var ${binding.name}: texture_${binding.dimension}<${referenceType}>;`;
                if (isBindingVisible(binding, GPUShaderStage.VERTEX)) {
                    vertex += `${textureLayout}\n`;
                }
                if (isBindingVisible(binding, GPUShaderStage.FRAGMENT)) {
                    fragment += `${textureLayout}\n`;
                }
            }
            else if (binding.storageTexture) {
                const referenceType = [
                    binding.storageTexture.format,
                    binding.storageTexture.access,
                ]
                    .filter(Boolean)
                    .join(",");
                const storageTextureLayout = /* wgsl*/ `[[group(${set}), binding(${i})]] var ${binding.name}: texture_storage_${binding.dimension}<${referenceType}>;`;
                if (isBindingVisible(binding, GPUShaderStage.VERTEX)) {
                    vertex += `${storageTextureLayout}\n`;
                }
                if (isBindingVisible(binding, GPUShaderStage.FRAGMENT)) {
                    fragment += `${storageTextureLayout}\n`;
                }
            }
        }
        return { vertex, fragment, compute };
    }
    getGLSLBufferString(binding, bindingIndex, uniforms, set, bindingType, layoutQualifierString) {
        const structName = `${binding.name}${formatUpperFirst(bindingType)}`;
        return `layout(${layoutQualifierString}set = ${set}, binding = ${bindingIndex}) ${bindingType} ${structName} {
  ${uniforms
            .map((uniform) => `${uniform.glslType} ${formatLowerFirst(uniform.name)}${uniform.arrayCount ? `[${uniform.arrayCount}]` : ""};`)
            .join("\n  ")}
} ${formatLowerFirst(binding.name)};\n\n`;
    }
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
                    binding.buffer.type === StorageClass.Uniform) {
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
                    // Vertex
                    if (vertexUniforms.length) {
                        vertex += this.getGLSLBufferString(binding, i, vertexUniforms, set, "uniform", layoutQualifierString);
                    }
                    // Fragment
                    if (fragmentUniforms.length) {
                        fragment += this.getGLSLBufferString(binding, i, fragmentUniforms, set, "uniform", layoutQualifierString);
                    }
                    if (computeUniforms.length) {
                        compute += this.getGLSLBufferString(binding, i, computeUniforms, set, "uniform", layoutQualifierString);
                    }
                }
                else if (binding.buffer.type === StorageClass.Storage) {
                    const computeVariables = binding.members.filter(() => isBindingVisible(binding, GPUShaderStage.COMPUTE));
                    compute += this.getGLSLBufferString(binding, i, computeVariables, set, "buffer", layoutQualifierString);
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