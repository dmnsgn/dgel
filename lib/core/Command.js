function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Command {
  constructor(options) {
    _defineProperty(this, "pass", void 0);

    _defineProperty(this, "pipeline", void 0);

    _defineProperty(this, "vertexBuffers", void 0);

    _defineProperty(this, "indexBuffer", void 0);

    _defineProperty(this, "bindGroups", void 0);

    _defineProperty(this, "count", void 0);

    _defineProperty(this, "instances", void 0);

    _defineProperty(this, "dispatch", void 0);

    Object.assign(this, options);
  }

}

export default Command;