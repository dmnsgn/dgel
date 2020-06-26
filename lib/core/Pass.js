function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Pass {
  constructor(type, colorAttachments, depthAttachment, stencilAttachment) {
    this.type = type;
    this.colorAttachments = colorAttachments;
    this.depthAttachment = depthAttachment;
    this.stencilAttachment = stencilAttachment;
  }

  get descriptor() {
    if (this.type === "render") {
      return _objectSpread(_objectSpread({}, this.colorAttachments && {
        colorAttachments: this.colorAttachments.map(colorAttachment => _objectSpread({
          loadValue: colorAttachment.value
        }, colorAttachment.op && {
          storeOp: colorAttachment.op
        } || {}))
      }), (this.depthAttachment || this.stencilAttachment) && {
        depthStencilAttachment: {
          depthLoadValue: this.depthAttachment.value || 0.0,
          depthStoreOp: this.depthAttachment.op || "store",
          stencilLoadValue: this.depthAttachment.value || 0.0,
          stencilStoreOp: this.depthAttachment.op || "store"
        }
      });
    } // else if (this.type === "compute") {
    // }


    return null;
  }

}

export default Pass;