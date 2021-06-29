// https://github.com/gpuweb/gpuweb/blob/402b69138fbedf4a3c9c85cd1bf7e1cc27c1b34e/spec/index.bs

// tslint:disable:variable-name

// Strings
export const BindingType = {
  Uniform: "uniform",
  Storage: "storage",
  ReadonlyStorage: "read-only-storage",
  Filtering: "filtering",
  NonFiltering: "non-filtering",
  Comparison: "comparison",
  Float: "float",
  UnFilterableFloat: "unfilterable-float",
  Depth: "depth",
  Sint: "sint",
  Uint: "uint",
  ReadOnly: "read-only",
  WriteOnly: "write-only",
};
export const GPUIndexFormat: { [key: string]: GPUIndexFormat } = {
  Uint16: "uint16",
  Uint32: "uint32",
};
export const GPUPrimitiveTopology: { [key: string]: GPUPrimitiveTopology } = {
  PointList: "point-list",
  LineList: "line-list",
  LineStrip: "line-strip",
  TriangleList: "triangle-list",
  TriangleStrip: "triangle-strip",
};

// Bit fields
export const GPUBufferUsage = {
  MAP_READ: 0x0001,
  MAP_WRITE: 0x0002,
  COPY_SRC: 0x0004,
  COPY_DST: 0x0008,
  INDEX: 0x0010,
  VERTEX: 0x0020,
  UNIFORM: 0x0040,
  STORAGE: 0x0080,
  INDIRECT: 0x0100,
};
export const GPUTextureUsage = {
  COPY_SRC: 0x01,
  COPY_DST: 0x02,
  SAMPLED: 0x04,
  STORAGE: 0x08,
  RENDER_ATTACHMENT: 0x10,
};
export const GPUShaderStage = {
  VERTEX: 0x1,
  FRAGMENT: 0x2,
  COMPUTE: 0x4,
};
