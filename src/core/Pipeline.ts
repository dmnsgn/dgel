import State from "./State.js";
import BindGroupLayout from "./BindGroupLayout.js";
import Attribute from "./Attribute.js";
import Program from "./Program.js";

import Shader from "./Shader.js";
import Struct from "./Struct.js";
import { GLSLShaderType, GLSLShaderTypeObjectKeys } from "../types.js";
import { GPUPrimitiveTopology } from "../constants.js";

const mapAttributes = (
  attributes: Attribute[],
  locationOffset = 0
): GPUVertexBufferLayout[] => {
  let prevAttributeSize: number;

  return attributes.reduce((currentAttributes, attribute, index) => {
    currentAttributes.push({
      shaderLocation: index + locationOffset,
      size: attribute.getSize(),
      offset: currentAttributes.length
        ? currentAttributes[currentAttributes.length - 1].offset +
          prevAttributeSize
        : 0,
      format: attribute.format,
    });

    prevAttributeSize = attribute.getSize();
    return currentAttributes;
  }, []);
};

type PipelineVertexBufferIns = {
  stepMode: GPUInputStepMode;
  attributes: Attribute[];
};

interface PipelineOptions extends GLSLShaderTypeObjectKeys {
  bindGroupLayouts?: BindGroupLayout[];
  ins?: Attribute[] | PipelineVertexBufferIns[];
  outs?: Attribute[];
  structs?: Struct[];
  fragmentOuts?: Attribute[];
  descriptor?: Partial<GPURenderPipelineDescriptor>;
  stepMode?: GPUInputStepMode;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Pipeline extends PipelineOptions {}

const DEFAULT_FRAGMENT_OUT_COLOR = [new Attribute("outColor", "vec4")];

class Pipeline {
  public gpuPipeline: GPUPipelineBase;
  public program: Program;

  constructor(options: PipelineOptions) {
    Object.assign(this, options);

    const shaders: { [key in GLSLShaderType]?: Shader } = {};

    let insAttributes: Attribute[];
    let hasArrayOfAttributes = false;
    if (this.ins?.length > 0) {
      hasArrayOfAttributes = this.ins[0] instanceof Attribute;
      insAttributes = hasArrayOfAttributes
        ? (this.ins as Attribute[])
        : (this.ins as PipelineVertexBufferIns[])
            .map((vertexBuffer) => vertexBuffer.attributes)
            .flat();
    }

    if (this.compute) {
      shaders.compute = new Shader(
        "compute",
        this.compute,
        insAttributes,
        this.outs,
        this.structs
      );

      this.program = new Program(this.bindGroupLayouts, shaders);
      this.program.init();

      this.gpuPipeline = State.device.createComputePipeline({
        layout: State.device.createPipelineLayout({
          bindGroupLayouts: this.bindGroupLayouts.map(
            (bindGroupLayout) => bindGroupLayout.gpuBindGroupLayout
          ),
        }),
        computeStage: {
          module: this.program.shaders.compute.shaderModule,
          entryPoint: "main",
        },
      });
      return;
    } else {
      if (this.vertex) {
        shaders.vertex = new Shader(
          "vertex",
          this.vertex,
          insAttributes,
          this.outs
        );
      }
      if (this.fragment) {
        shaders.fragment = new Shader(
          "fragment",
          this.fragment,
          this.outs,
          this.fragmentOuts || DEFAULT_FRAGMENT_OUT_COLOR
        );
      }

      const vertexBuffers = hasArrayOfAttributes
        ? ([
            {
              stepMode: this.stepMode || "vertex",
              arrayStride: (this.ins as Attribute[])
                .map((attribute) => attribute.getSize())
                .reduce((a, b) => a + b, 0),
              attributes: mapAttributes(this.ins as Attribute[]),
            },
          ] as GPUVertexBufferLayout[])
        : ((this.ins as PipelineVertexBufferIns[]).map(
            ({ stepMode, attributes }, index) => ({
              stepMode,
              arrayStride: attributes
                .map((attribute) => attribute.getSize())
                .reduce((a, b) => a + b, 0),
              attributes: mapAttributes(
                attributes,
                (this.ins as PipelineVertexBufferIns[])[index - 1]?.attributes
                  .length || 0
              ),
            })
          ) as GPUVertexBufferLayout[]);

      this.program = new Program(this.bindGroupLayouts, shaders);
      this.program.init();

      this.gpuPipeline = State.device.createRenderPipeline({
        layout: State.device.createPipelineLayout({
          bindGroupLayouts: this.bindGroupLayouts.map(
            (bindGroupLayout) => bindGroupLayout.gpuBindGroupLayout
          ),
        }),
        vertex: {
          buffers: vertexBuffers,
          module: this.program.shaders.vertex.shaderModule,
          entryPoint: "main",
        },
        fragment: {
          module: this.program.shaders.fragment.shaderModule,
          entryPoint: "main",
          // TODO: parameter
          targets: [
            {
              format: "bgra8unorm",
              blend: {
                color: {
                  srcFactor: "src-alpha",
                  dstFactor: "one-minus-src-alpha",
                  operation: "add",
                },
                alpha: {
                  srcFactor: "src-alpha",
                  dstFactor: "one-minus-src-alpha",
                  operation: "add",
                },
              },
            },
          ],
        },
        primitive: { topology: GPUPrimitiveTopology.TriangleList },
        depthStencil: {
          depthWriteEnabled: true,
          depthCompare: "less",
          format: "depth24plus-stencil8",
        },
        ...(this.descriptor || {}),
      });
    }
  }
}

export default Pipeline;
