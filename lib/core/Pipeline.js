function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import State from "./State.js";
import Attribute from "./Attribute.js";
import Program from "./Program.js";
import Shader from "./Shader.js";

const mapAttributes = (attributes, locationOffset = 0) => {
  let prevAttributeSize;
  return attributes.reduce((currentAttributes, attribute, index) => {
    currentAttributes.push({
      shaderLocation: index + locationOffset,
      size: attribute.getSize(),
      offset: currentAttributes.length ? currentAttributes[currentAttributes.length - 1].offset + prevAttributeSize : 0,
      format: attribute.format
    });
    prevAttributeSize = attribute.getSize();
    return currentAttributes;
  }, []);
};

const DEFAULT_FRAGMENT_OUT_COLOR = [new Attribute("outColor", "vec4")];

class Pipeline {
  constructor(options) {
    var _this$ins;

    _defineProperty(this, "gpuPipeline", void 0);

    _defineProperty(this, "program", void 0);

    Object.assign(this, options);
    const shaders = {};
    let insAttributes;
    let hasArrayOfAttributes = false;

    if (((_this$ins = this.ins) === null || _this$ins === void 0 ? void 0 : _this$ins.length) > 0) {
      hasArrayOfAttributes = this.ins[0] instanceof Attribute;
      insAttributes = hasArrayOfAttributes ? this.ins : this.ins.map(vertexBuffer => vertexBuffer.attributes).flat();
    }

    if (this.compute) {
      shaders.compute = new Shader("compute", this.compute, insAttributes, this.outs, this.structs);
      this.program = new Program(this.bindGroupLayouts, shaders);
      this.program.init();
      this.gpuPipeline = State.device.createComputePipeline({
        layout: State.device.createPipelineLayout({
          bindGroupLayouts: this.bindGroupLayouts.map(bindGroupLayout => bindGroupLayout.gpuBindGroupLayout)
        }),
        computeStage: {
          module: this.program.shaders.compute.shaderModule,
          entryPoint: "main"
        }
      });
      return;
    } else {
      if (this.vertex) {
        shaders.vertex = new Shader("vertex", this.vertex, insAttributes, this.outs);
      }

      if (this.fragment) {
        shaders.fragment = new Shader("fragment", this.fragment, this.outs, this.fragmentOuts || DEFAULT_FRAGMENT_OUT_COLOR);
      }

      const vertexBuffers = hasArrayOfAttributes ? [{
        stepMode: this.stepMode || "vertex",
        arrayStride: this.ins.map(attribute => attribute.getSize()).reduce((a, b) => a + b, 0),
        attributes: mapAttributes(this.ins)
      }] : this.ins.map(({
        stepMode,
        attributes
      }, index) => {
        var _ref;

        return {
          stepMode,
          arrayStride: attributes.map(attribute => attribute.getSize()).reduce((a, b) => a + b, 0),
          attributes: mapAttributes(attributes, ((_ref = this.ins[index - 1]) === null || _ref === void 0 ? void 0 : _ref.attributes.length) || 0)
        };
      });
      this.program = new Program(this.bindGroupLayouts, shaders);
      this.program.init();
      this.gpuPipeline = State.device.createRenderPipeline(_objectSpread({
        layout: State.device.createPipelineLayout({
          bindGroupLayouts: this.bindGroupLayouts.map(bindGroupLayout => bindGroupLayout.gpuBindGroupLayout)
        }),
        vertexStage: {
          module: this.program.shaders.vertex.shaderModule,
          entryPoint: "main"
        },
        fragmentStage: {
          module: this.program.shaders.fragment.shaderModule,
          entryPoint: "main"
        },
        vertexState: {
          vertexBuffers
        },
        colorStates: [{
          format: "bgra8unorm",
          alphaBlend: {
            srcFactor: "src-alpha",
            dstFactor: "one-minus-src-alpha",
            operation: "add"
          }
        }],
        primitiveTopology: "triangle-list",
        depthStencilState: {
          depthWriteEnabled: true,
          depthCompare: "less",
          format: "depth24plus-stencil8"
        }
      }, this.descriptor || {}));
    }
  }

}

export default Pipeline;