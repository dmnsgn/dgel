import Command from "../core/Command.js";
import Pipeline from "../core/Pipeline.js";
import Buffer from "../core/Buffer.js";
import Attribute from "../core/Attribute.js";
import { GPUIndexFormat, GPUPrimitiveTopology } from "../constants.js";
// prettier-ignore
const data = new Float32Array([
    /* position */ 0, 0, 0, /* color */ 1, 0, 0, 1,
    /* position */ 1, 0, 0, /* color */ 1, 0.5, 0.5, 1,
    /* position */ 0, 0, 0, /* color */ 0, 1, 0, 1,
    /* position */ 0, 1, 0, /* color */ 0.5, 1, 0.5, 1,
    /* position */ 0, 0, 0, /* color */ 0, 0, 1, 1,
    /* position */ 0, 0, 1, /* color */ 0.5, 0.5, 1, 1,
]);
// prettier-ignore
const indices = new Uint16Array([
    0, 1,
    2, 3,
    4, 5
]);
class Axes {
    constructor(systemBindGroupLayout, systemUniformBindGroup, pipelineOptions = {}) {
        // TODO: make generic draw line pipeline
        const pipeline = new Pipeline({
            bindGroupLayouts: [systemBindGroupLayout],
            ins: [new Attribute("position", "vec3"), new Attribute("color", "vec4")],
            outs: [new Attribute("vColor", "vec4")],
            language: "glsl",
            vertex: /* glsl */ `
  vColor = color;

  gl_Position = system.projectionMatrix * system.viewMatrix * vec4(position, 1.0);
`,
            fragment: /* glsl */ `
  outColor = vColor;
`,
            descriptor: {
                primitive: { topology: GPUPrimitiveTopology.LineList },
            },
            ...pipelineOptions,
        });
        this.buffer = new Buffer().vertexBuffer(data);
        this.command = new Command({
            pipeline,
            bindGroups: [systemUniformBindGroup],
            vertexBuffers: [this.buffer],
            indexBuffer: new Buffer().indexBuffer(indices),
            indexFormat: GPUIndexFormat.Uint16,
            count: indices.length,
        });
    }
    setScale(scale) {
        this.buffer.setSubData(4 * (7 * 1 + 0), Float32Array.of(scale));
        this.buffer.setSubData(4 * (7 * 3 + 1), Float32Array.of(scale));
        this.buffer.setSubData(4 * (7 * 5 + 2), Float32Array.of(scale));
    }
}
export default Axes;
//# sourceMappingURL=Axes.js.map