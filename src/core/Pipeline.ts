import State from "./State.js";
import Attribute from "./Attribute.js";
import Program from "./Program.js";
import Shader from "./Shader.js";

import { GPUPrimitiveTopology } from "../constants.js";
import {
  Language,
  PipelineOptions,
  PipelineVertexBufferIns,
} from "../types.js";

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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Pipeline extends PipelineOptions {}

const DEFAULT_GLSL_FRAGMENT_OUT_COLOR: Attribute[] = [
  new Attribute("outColor", "vec4"),
];

class Pipeline {
  public gpuPipeline: GPUPipelineBase;
  public program: Program;
  public language: Language = "wgsl";
  public fragmentTargets: GPUColorTargetState[] = [
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
  ];

  constructor(options: PipelineOptions) {
    Object.assign(this, options);

    this.init();
  }

  public init(): void {
    let insAttributes: Attribute[];
    let hasArrayOfAttributes = false;
    if (this.ins?.length > 0) {
      hasArrayOfAttributes = this.ins.some(
        (variable) => variable instanceof Attribute
      );
      insAttributes = hasArrayOfAttributes
        ? (this.ins as Attribute[])
        : (this.ins as PipelineVertexBufferIns[])
            .map((vertexBuffer) => vertexBuffer.attributes)
            .flat();
    }

    if (this.compute) {
      this.program = new Program(
        this.bindGroupLayouts,
        {
          compute: new Shader({
            type: GPUShaderStage.COMPUTE,
            main: this.compute,
            body: this.computeBody,
            ins: insAttributes,
            outs: this.outs,
            structs: this.structs,
            language: this.language,
          }),
        },
        this.language
      );
      this.program.init();

      this.gpuPipeline = State.device.createComputePipeline({
        layout: State.device.createPipelineLayout({
          bindGroupLayouts: this.bindGroupLayouts?.map(
            (bindGroupLayout) => bindGroupLayout.gpuBindGroupLayout
          ),
        }),
        compute: {
          module: this.program.shaders.compute.shaderModule,
          entryPoint: "main",
        },
      });
    } else {
      const vertexBuffers = hasArrayOfAttributes
        ? ([
            {
              stepMode: this.stepMode || "vertex",
              arrayStride: (this.ins as Attribute[])
                .filter((variable) => variable instanceof Attribute)
                .map((attribute) => attribute.getSize())
                .reduce((a, b) => a + b, 0),
              attributes: mapAttributes(
                (this.ins as Attribute[]).filter(
                  (variable) => variable instanceof Attribute
                )
              ),
            },
          ] as GPUVertexBufferLayout[])
        : // When stepMode needs to be specified
          ((this.ins as PipelineVertexBufferIns[]).map(
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

      this.program = new Program(
        this.bindGroupLayouts,
        {
          vertex: new Shader({
            type: GPUShaderStage.VERTEX,
            main: this.vertex,
            body: this.vertexBody,
            ins: insAttributes,
            outs: this.outs,
            structs: this.structs,
            language: this.language,
          }),
          fragment: new Shader({
            type: GPUShaderStage.FRAGMENT,
            main: this.fragment,
            body: this.fragmentBody,
            ins: this.outs,
            outs:
              this.fragmentOuts ||
              (this.language === "glsl" ? DEFAULT_GLSL_FRAGMENT_OUT_COLOR : []),
            structs: this.structs,
            language: this.language,
          }),
        },
        this.language
      );
      this.program.init();

      this.gpuPipeline = State.device.createRenderPipeline({
        ...(this.bindGroupLayouts
          ? {
              layout: State.device.createPipelineLayout({
                bindGroupLayouts:
                  this.bindGroupLayouts.map(
                    (bindGroupLayout) => bindGroupLayout.gpuBindGroupLayout
                  ) || [],
              }),
            }
          : {
              layout: "auto",
            }),
        vertex: {
          buffers: vertexBuffers,
          module: this.program.shaders.vertex.shaderModule,
          entryPoint: "main",
        },
        fragment: {
          module: this.program.shaders.fragment.shaderModule,
          entryPoint: "main",
          targets: this.fragmentTargets,
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
