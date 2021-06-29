import { a as typedArrayConstructorsRequireWrappers, b as arrayBufferViewCore } from './common/typed-array-constructor-b01e3ece.js';
import './common/es.typed-array.float32-array-0e38058f.js';
import './common/es.typed-array.uint32-array-1cc93ef8.js';
import './common/es.typed-array.uint8-array-1a7fc936.js';
import './common/a-function-58034956.js';

var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayStaticMethod = arrayBufferViewCore.exportTypedArrayStaticMethod;

// `%TypedArray%.of` method
// https://tc39.es/ecma262/#sec-%typedarray%.of
exportTypedArrayStaticMethod('of', function of(/* ...items */) {
  var index = 0;
  var length = arguments.length;
  var result = new (aTypedArrayConstructor(this))(length);
  while (length > index) result[index] = arguments[index++];
  return result;
}, typedArrayConstructorsRequireWrappers);

/**
 * @module utils
 */

/**
 * Two times PI.
 * @constant {number}
 */
const TAU = Math.PI * 2;
/**
 * Normalize a vector 3.
 * @param {number[]} v Vector 3 array
 * @returns {number[]} Normalized vector
 */

function normalize(v) {
  const l = 1 / (Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1);
  v[0] *= l;
  v[1] *= l;
  v[2] *= l;
  return v;
}
/**
 * @private
 */

let TYPED_ARRAY_TYPE;
/**
 * Enforce a typed array constructor for cells
 * @param {(Class<Uint8Array>|Class<Uint16Array>|Class<Uint32Array>)} type
 */

function setTypedArrayType(type) {
  TYPED_ARRAY_TYPE = type;
}
/**
 * Select cells typed array from a size determined by amount of vertices.
 *
 * @param {number} size The max value expected
 * @returns {(Uint8Array|Uint16Array|Uint32Array)}
 * @see [MDN TypedArray objects]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#typedarray_objects}
 */

const getCellsTypedArray = size => TYPED_ARRAY_TYPE || (size <= 255 ? Uint8Array : size <= 65535 ? Uint16Array : Uint32Array);

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  TAU: TAU,
  normalize: normalize,
  setTypedArrayType: setTypedArrayType,
  getCellsTypedArray: getCellsTypedArray
});

/**
 * @typedef {Object} QuadOptions
 * @property {number} [scale=0.5]
 */

/**
 * @alias module:quad
 * @param {QuadOptions} [options={}]
 * @returns {import("../types.js").SimplicialComplex}
 */

const quad = ({
  scale = 0.5
} = {}) => ({
  // prettier-ignore
  positions: Float32Array.of(-scale, -scale, 0, scale, -scale, 0, scale, scale, 0, -scale, scale, 0),
  // prettier-ignore
  normals: Int8Array.of(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1),
  // prettier-ignore
  uvs: Uint8Array.of(0, 0, 1, 0, 1, 1, 0, 1),
  // prettier-ignore
  cells: getCellsTypedArray(12).of(0, 1, 2, 2, 3, 0)
});

/**
 * @typedef {Object} PlaneOptions
 * @property {number} [sx=1]
 * @property {number} [sy=sx]
 * @property {number} [nx=1]
 * @property {number} [ny=nx]
 */

/**
 * @alias module:plane
 * @param {PlaneOptions} [options={}]
 * @returns {import("../types.js").SimplicialComplex}
 */

function plane({
  sx = 1,
  sy = sx,
  nx = 1,
  ny = nx
} = {}) {
  const size = (nx + 1) * (ny + 1);
  const positions = new Float32Array(size * 3);
  const normals = new Float32Array(size * 3);
  const uvs = new Float32Array(size * 2);
  const cells = new (getCellsTypedArray(size))(nx * ny * 6);
  let vertexIndex = 0;
  const halfSX = sx * 0.5;
  const halfSY = sy * 0.5;

  for (let y = 0; y <= ny; y++) {
    for (let x = 0; x <= nx; x++) {
      const u = x / nx;
      const v = y / ny;
      positions[vertexIndex * 3] = -halfSX + u * sx;
      positions[vertexIndex * 3 + 1] = halfSY - v * sy;
      positions[vertexIndex * 3 + 2] = 0;
      normals[vertexIndex * 3] = 0;
      normals[vertexIndex * 3 + 1] = 0;
      normals[vertexIndex * 3 + 2] = 1;
      uvs[vertexIndex * 2] = u;
      uvs[vertexIndex * 2 + 1] = 1 - v;

      if (y < ny && x < nx) {
        const a = y * (nx + 1) + x;
        const b = (y + 1) * (nx + 1) + x + 1;
        const c = y * (nx + 1) + x + 1;
        const d = (y + 1) * (nx + 1) + x;
        cells[vertexIndex * 6] = a;
        cells[vertexIndex * 6 + 1] = b;
        cells[vertexIndex * 6 + 2] = c;
        cells[vertexIndex * 6 + 3] = b;
        cells[vertexIndex * 6 + 4] = a;
        cells[vertexIndex * 6 + 5] = d;
      }

      vertexIndex++;
    }
  }

  return {
    positions,
    normals,
    uvs,
    cells
  };
}

/**
 * @typedef {Object} CubeOptions
 * @property {number} [sx=1]
 * @property {number} [sy=sx]
 * @property {number} [sz=sx]
 * @property {number} [nx=1]
 * @property {number} [ny=nx]
 * @property {number} [nz=nx]
 */

/**
 * @alias module:cube
 * @param {CubeOptions} [options={}]
 * @returns {import("../types.js").SimplicialComplex}
 */

function cube({
  sx = 1,
  sy = sx,
  sz = sx,
  nx = 1,
  ny = nx,
  nz = nx
} = {}) {
  const size = (nx + 1) * (ny + 1) * 2 + (nx + 1) * (nz + 1) * 2 + (nz + 1) * (ny + 1) * 2;
  const positions = new Float32Array(size * 3);
  const normals = new Float32Array(size * 3);
  const uvs = new Float32Array(size * 2);
  const cells = new (getCellsTypedArray(size))((nx * ny * 2 + nx * nz * 2 + nz * ny * 2) * 6);
  let vertexIndex = 0;
  let cellIndex = 0;

  function computePlane(u, v, w, su, sv, nu, nv, pw, flipU, flipV) {
    const vertexOffset = vertexIndex;

    for (let j = 0; j <= nv; j++) {
      for (let i = 0; i <= nu; i++) {
        positions[vertexIndex * 3 + u] = (-su / 2 + i * su / nu) * flipU;
        positions[vertexIndex * 3 + v] = (-sv / 2 + j * sv / nv) * flipV;
        positions[vertexIndex * 3 + w] = pw;
        normals[vertexIndex * 3 + u] = 0;
        normals[vertexIndex * 3 + v] = 0;
        normals[vertexIndex * 3 + w] = pw / Math.abs(pw);
        uvs[vertexIndex * 2] = i / nu;
        uvs[vertexIndex * 2 + 1] = 1 - j / nv;
        vertexIndex++;

        if (j < nv && i < nu) {
          const n = vertexOffset + j * (nu + 1) + i;
          cells[cellIndex] = n;
          cells[cellIndex + 1] = n + nu + 1;
          cells[cellIndex + 2] = n + nu + 2;
          cells[cellIndex + 3] = n;
          cells[cellIndex + 4] = n + nu + 2;
          cells[cellIndex + 5] = n + 1;
          cellIndex += 6;
        }
      }
    }
  }

  const halfSX = sx * 0.5;
  const halfSY = sy * 0.5;
  const halfSZ = sz * 0.5;
  computePlane(0, 1, 2, sx, sy, nx, ny, halfSZ, 1, -1); // front

  computePlane(0, 1, 2, sx, sy, nx, ny, -halfSZ, -1, -1); // back

  computePlane(2, 1, 0, sz, sy, nz, ny, -halfSX, 1, -1); // left

  computePlane(2, 1, 0, sz, sy, nz, ny, halfSX, -1, -1); // right

  computePlane(0, 2, 1, sx, sz, nx, nz, halfSY, 1, 1); // top

  computePlane(0, 2, 1, sx, sz, nx, nz, -halfSY, 1, -1); // bottom

  return {
    positions,
    normals,
    uvs,
    cells
  };
}

/**
 * @module rounded-cube
 */
const TMP = [0, 0, 0];
/**
 * @typedef {Object} RoundedCubeOptions
 * @property {number} [sx=1]
 * @property {number} [sy=sx]
 * @property {number} [sz=sx]
 * @property {number} [nx=16]
 * @property {number} [ny=nx]
 * @property {number} [nz=nx]
 * @property {number} [radius=sx * 0.25]
 */

/**
 * @alias module:rounded-cube
 * @param {RoundedCubeOptions} [options={}]
 * @returns {import("../types.js").SimplicialComplex}
 */

function roundedCube({
  sx = 1,
  sy = sx,
  sz = sx,
  nx = 16,
  ny = nx,
  nz = nx,
  radius = sx * 0.25
} = {}) {
  const geometry = cube({
    sx,
    sy,
    sz,
    nx,
    ny,
    nz
  });
  const rx = sx * 0.5;
  const ry = sy * 0.5;
  const rz = sz * 0.5;

  for (let i = 0; i < geometry.positions.length; i += 3) {
    const position = [geometry.positions[i], geometry.positions[i + 1], geometry.positions[i + 2]];
    TMP[0] = position[0];
    TMP[1] = position[1];
    TMP[2] = position[2];

    if (position[0] < -rx + radius) {
      position[0] = -rx + radius;
    } else if (position[0] > rx - radius) {
      position[0] = rx - radius;
    }

    if (position[1] < -ry + radius) {
      position[1] = -ry + radius;
    } else if (position[1] > ry - radius) {
      position[1] = ry - radius;
    }

    if (position[2] < -rz + radius) {
      position[2] = -rz + radius;
    } else if (position[2] > rz - radius) {
      position[2] = rz - radius;
    }

    TMP[0] -= position[0];
    TMP[1] -= position[1];
    TMP[2] -= position[2];
    normalize(TMP);
    geometry.normals[i] = TMP[0];
    geometry.normals[i + 1] = TMP[1];
    geometry.normals[i + 2] = TMP[2];
    geometry.positions[i] = position[0] + radius * TMP[0];
    geometry.positions[i + 1] = position[1] + radius * TMP[1];
    geometry.positions[i + 2] = position[2] + radius * TMP[2];
  }

  return geometry;
}

const TMP$1 = [0, 0, 0];
/**
 * @typedef {Object} CylinderOptions
 * @property {number} [height=1]
 * @property {number} [radius=0.25]
 * @property {number} [nx=16]
 * @property {number} [ny=1]
 * @property {number} [radiusApex=radius]
 * @property {number} [capSegments=1]
 * @property {boolean} [capApex=true]
 * @property {boolean} [capBase=true]
 */

/**
 * @alias module:cylinder
 * @param {CylinderOptions} [options={}]
 * @returns {import("../types.js").SimplicialComplex}
 */

function cylinder({
  height = 1,
  radius = 0.25,
  nx = 16,
  ny = 1,
  radiusApex = radius,
  capSegments = 1,
  capApex = true,
  capBase = true
} = {}) {
  let capCount = 0;
  if (capApex) capCount++;
  if (capBase) capCount++;
  const segments = nx + 1;
  const slices = ny + 1;
  const size = segments * slices + segments * capSegments * 2 * capCount;
  const positions = new Float32Array(size * 3);
  const normals = new Float32Array(size * 3);
  const uvs = new Float32Array(size * 2);
  const cells = new (getCellsTypedArray(size))((nx * ny + nx * capSegments * capCount) * 6);
  let vertexIndex = 0;
  let cellIndex = 0;
  const halfHeight = height / 2;
  const segmentIncrement = 1 / (segments - 1);
  const ringIncrement = 1 / (slices - 1);

  for (let i = 0; i < segments; i++) {
    const u = i * segmentIncrement;

    for (let j = 0; j < slices; j++) {
      const v = j * ringIncrement;
      const phi = u * TAU;
      const cosPhi = -Math.cos(phi);
      const sinPhi = Math.sin(phi);
      const r = radius * (1 - v) + radiusApex * v;
      positions[vertexIndex * 3] = r * cosPhi;
      positions[vertexIndex * 3 + 1] = height * v - halfHeight;
      positions[vertexIndex * 3 + 2] = r * sinPhi;
      TMP$1[0] = height * cosPhi;
      TMP$1[1] = radius - radiusApex;
      TMP$1[2] = height * sinPhi;
      normalize(TMP$1);
      normals[vertexIndex * 3] = TMP$1[0];
      normals[vertexIndex * 3 + 1] = TMP$1[1];
      normals[vertexIndex * 3 + 2] = TMP$1[2];
      uvs[vertexIndex * 2] = u;
      uvs[vertexIndex * 2 + 1] = v;
      vertexIndex++;
    }
  }

  for (let j = 0; j < slices - 1; j++) {
    for (let i = 0; i < segments - 1; i++) {
      cells[cellIndex + 0] = (i + 0) * slices + (j + 0);
      cells[cellIndex + 1] = (i + 1) * slices + (j + 0);
      cells[cellIndex + 2] = (i + 1) * slices + (j + 1);
      cells[cellIndex + 3] = (i + 0) * slices + (j + 0);
      cells[cellIndex + 4] = (i + 1) * slices + (j + 1);
      cells[cellIndex + 5] = (i + 0) * slices + (j + 1);
      cellIndex += 6;
    }
  }

  function computeCap(flip, height, radius) {
    const index = vertexIndex;
    const segmentIncrement = 1 / (segments - 1);

    for (let r = 0; r < capSegments; r++) {
      for (let i = 0; i < segments; i++) {
        const cosPhi = -Math.cos(i * segmentIncrement * TAU);
        const sinPhi = Math.sin(i * segmentIncrement * TAU); // inner point

        positions[vertexIndex * 3] = radius * cosPhi * r / capSegments;
        positions[vertexIndex * 3 + 1] = height;
        positions[vertexIndex * 3 + 2] = radius * sinPhi * r / capSegments;
        normals[vertexIndex * 3] = 0;
        normals[vertexIndex * 3 + 1] = -flip;
        normals[vertexIndex * 3 + 2] = 0;
        uvs[vertexIndex * 2] = 0.5 * cosPhi * r / capSegments + 0.5;
        uvs[vertexIndex * 2 + 1] = 0.5 * sinPhi * r / capSegments + 0.5;
        vertexIndex++; // outer point

        positions[vertexIndex * 3] = radius * cosPhi * (r + 1) / capSegments;
        positions[vertexIndex * 3 + 1] = height;
        positions[vertexIndex * 3 + 2] = radius * sinPhi * (r + 1) / capSegments;
        normals[vertexIndex * 3] = 0;
        normals[vertexIndex * 3 + 1] = -flip;
        normals[vertexIndex * 3 + 2] = 0;
        uvs[vertexIndex * 2] = 0.5 * (cosPhi * (r + 1)) / capSegments + 0.5;
        uvs[vertexIndex * 2 + 1] = 0.5 * (sinPhi * (r + 1)) / capSegments + 0.5;
        vertexIndex++;
      }
    }

    for (let r = 0; r < capSegments; r++) {
      for (let i = 0; i < segments - 1; i++) {
        const n = index + r * segments * 2 + i * 2;
        const a = n + 0;
        const b = n + 1;
        const c = n + 2;
        const d = n + 3;

        if (flip === 1) {
          cells[cellIndex] = a;
          cells[cellIndex + 1] = c;
          cells[cellIndex + 2] = d;
          cells[cellIndex + 3] = a;
          cells[cellIndex + 4] = d;
          cells[cellIndex + 5] = b;
        } else {
          cells[cellIndex + 0] = a;
          cells[cellIndex + 1] = d;
          cells[cellIndex + 2] = c;
          cells[cellIndex + 3] = a;
          cells[cellIndex + 4] = b;
          cells[cellIndex + 5] = d;
        }

        cellIndex += 6;
      }
    }
  }

  if (capBase) computeCap(1, -halfHeight, radius);
  if (capApex) computeCap(-1, halfHeight, radiusApex);
  return {
    positions,
    normals,
    uvs,
    cells
  };
}

/**
 * @module cone
 */
/**
 * @typedef {Object} ConeOptions
 * @property {number} [height=1]
 * @property {number} [radius=0.25]
 * @property {number} [nx=16]
 * @property {number} [ny=1]
 * @property {number} [capSegments=1]
 * @property {boolean} [capBase=true]
 */

/**
 * @alias module:cone
 * @param {ConeOptions} [options={}]
 * @returns {import("../types.js").SimplicialComplex}
 */

const cone = ({
  height,
  radius,
  nx,
  ny,
  capSegments,
  capBase
} = {}) => cylinder({
  height,
  radius,
  nx,
  ny,
  capSegments,
  capBase,
  radiusApex: 0,
  capApex: false
});

/**
 * @typedef {Object} CapsuleOptions
 * @property {number} [height=1]
 * @property {number} [radius=0.25]
 * @property {number} [nx=16]
 * @property {number} [ny=32]
 */

/**
 * @alias module:capsule
 * @param {CapsuleOptions} [options={}]
 * @returns {import("../types.js").SimplicialComplex}
 */

function capsule({
  height = 0.5,
  radius = 0.25,
  nx = 16,
  ny = 32
} = {}) {
  const ringsBody = ny + 1;
  const ringsTotal = ny + ringsBody;
  const size = ringsTotal * nx;
  const positions = new Float32Array(size * 3);
  const normals = new Float32Array(size * 3);
  const uvs = new Float32Array(size * 2);
  const cells = new (getCellsTypedArray(size))((ringsTotal - 1) * (nx - 1) * 6);
  let vertexIndex = 0;
  let cellIndex = 0;
  const segmentIncrement = 1 / (nx - 1);
  const ringIncrement = 1 / (ny - 1);
  const bodyIncrement = 1 / (ringsBody - 1);

  function computeRing(r, y, dy) {
    for (let s = 0; s < nx; s++) {
      const x = -Math.cos(s * segmentIncrement * TAU) * r;
      const z = Math.sin(s * segmentIncrement * TAU) * r;
      const py = radius * y + height * dy;
      positions[vertexIndex * 3] = radius * x;
      positions[vertexIndex * 3 + 1] = py;
      positions[vertexIndex * 3 + 2] = radius * z;
      normals[vertexIndex * 3] = x;
      normals[vertexIndex * 3 + 1] = y;
      normals[vertexIndex * 3 + 2] = z;
      uvs[vertexIndex * 2] = s * segmentIncrement;
      uvs[vertexIndex * 2 + 1] = 1 - (0.5 - py / (2 * radius + height));
      vertexIndex++;
    }
  }

  for (let r = 0; r < ringsBody; r++) {
    computeRing(1, 0, r * bodyIncrement - 0.5);
  }

  for (let r = 0; r < ny; r++) {
    if (r < ny * 0.5) {
      computeRing(Math.sin(Math.PI * r * ringIncrement), Math.sin(Math.PI * (r * ringIncrement - 0.5)), -0.5);
    } else {
      computeRing(Math.sin(Math.PI * r * ringIncrement), Math.sin(Math.PI * (r * ringIncrement - 0.5)), 0.5);
    }
  }

  for (let r = 0; r < ringsTotal - 1; r++) {
    for (let s = 0; s < nx - 1; s++) {
      const a = r * nx;
      const b = (r + 1) * nx;
      const s1 = s + 1;
      cells[cellIndex] = a + s;
      cells[cellIndex + 1] = a + s1;
      cells[cellIndex + 2] = b + s1;
      cells[cellIndex + 3] = a + s;
      cells[cellIndex + 4] = b + s1;
      cells[cellIndex + 5] = b + s;
      cellIndex += 6;
    }
  }

  return {
    positions,
    normals,
    uvs,
    cells
  };
}

const TMP$2 = [0, 0, 0];
/**
 * @typedef {Object} EllipsoidOptions
 * @property {number} [radius=0.5]
 * @property {number} [nx=32]
 * @property {number} [ny=16]
 * @property {number} [rx=1]
 * @property {number} [rx=0.5]
 * @property {number} [rz=ry]
 */

/**
 * Default to an oblate spheroid.
 * @alias module:ellipsoid
 * @param {EllipsoidOptions} [options={}]
 * @returns {import("../types.js").SimplicialComplex}
 */

function ellipsoid({
  radius = 1,
  nx = 32,
  ny = 16,
  rx = 0.5,
  ry = 0.25,
  rz = ry
} = {}) {
  const size = (ny + 1) * (nx + 1);
  const positions = new Float32Array(size * 3);
  const normals = new Float32Array(size * 3);
  const uvs = new Float32Array(size * 2);
  const cells = new (getCellsTypedArray(size))(ny * nx * 6);
  let vertexIndex = 0;
  let cellIndex = 0;

  for (let y = 0; y <= ny; y++) {
    const v = y / ny;
    const theta = v * Math.PI;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    for (let x = 0; x <= nx; x++) {
      const u = x / nx;
      const phi = u * TAU;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      TMP$2[0] = -rx * cosPhi * sinTheta;
      TMP$2[1] = -ry * cosTheta;
      TMP$2[2] = rz * sinPhi * sinTheta;
      positions[vertexIndex * 3] = radius * TMP$2[0];
      positions[vertexIndex * 3 + 1] = radius * TMP$2[1];
      positions[vertexIndex * 3 + 2] = radius * TMP$2[2];
      normalize(TMP$2);
      normals[vertexIndex * 3] = TMP$2[0];
      normals[vertexIndex * 3 + 1] = TMP$2[1];
      normals[vertexIndex * 3 + 2] = TMP$2[2];
      uvs[vertexIndex * 2] = u;
      uvs[vertexIndex * 2 + 1] = v;
      vertexIndex++;
    }

    if (y > 0) {
      for (let i = vertexIndex - 2 * (nx + 1); i + nx + 2 < vertexIndex; i++) {
        const a = i;
        const b = i + 1;
        const c = i + nx + 1;
        const d = i + nx + 2;
        cells[cellIndex] = a;
        cells[cellIndex + 1] = b;
        cells[cellIndex + 2] = c;
        cells[cellIndex + 3] = c;
        cells[cellIndex + 4] = b;
        cells[cellIndex + 5] = d;
        cellIndex += 6;
      }
    }
  }

  return {
    positions,
    normals,
    uvs,
    cells
  };
}

/**
 * @module sphere
 */
/**
 * @typedef {Object} SphereOptions
 * @property {number} [radius=0.5]
 * @property {number} [nx=32]
 * @property {number} [ny=16]
 */

/**
 * @alias module:sphere
 * @param {SphereOptions} [options={}]
 * @returns {import("../types.js").SimplicialComplex}
 */

const sphere = ({
  radius = 0.5,
  nx = 32,
  ny = 16
} = {}) => ellipsoid({
  radius,
  nx,
  ny,
  rx: 1,
  ry: 1
});

const f = 0.5 + Math.sqrt(5) / 2;
/**
 * @typedef {Object} IcosphereOptions
 * @property {number} [radius=0.5]
 * @property {number} [subdivisions=2]
 */

/**
 * @alias module:icosphere
 * @param {IcosphereOptions} [options={}]
 * @returns {import("../types.js").SimplicialComplex}
 */

function icosphere({
  radius = 0.5,
  subdivisions = 2
} = {}) {
  if (subdivisions > 10) throw new Error("Max subdivisions is 10.");
  const T = Math.pow(4, subdivisions);
  const numVertices = 10 * T + 2;
  const numDuplicates = subdivisions === 0 ? 3 : Math.pow(2, subdivisions) * 3 + 9;
  const size = numVertices + numDuplicates;
  const positions = new Float32Array(size * 3);
  const uvs = new Float32Array(size * 2); // prettier-ignore

  positions.set(Float32Array.of(-1, f, 0, 1, f, 0, -1, -f, 0, 1, -f, 0, 0, -1, f, 0, 1, f, 0, -1, -f, 0, 1, -f, f, 0, -1, f, 0, 1, -f, 0, -1, -f, 0, 1)); // prettier-ignore

  let cells = Uint16Array.of(0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 11, 10, 2, 5, 11, 4, 1, 5, 9, 7, 1, 8, 10, 7, 6, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 9, 8, 1, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7);
  let vertexIndex = 12;
  const midCache = subdivisions ? {} : null;

  function addMidPoint(a, b) {
    // Cantor's pairing function
    const key = Math.floor((a + b) * (a + b + 1) / 2 + Math.min(a, b));
    const i = midCache[key];

    if (i !== undefined) {
      delete midCache[key];
      return i;
    }

    midCache[key] = vertexIndex;
    positions[3 * vertexIndex + 0] = (positions[3 * a + 0] + positions[3 * b + 0]) * 0.5;
    positions[3 * vertexIndex + 1] = (positions[3 * a + 1] + positions[3 * b + 1]) * 0.5;
    positions[3 * vertexIndex + 2] = (positions[3 * a + 2] + positions[3 * b + 2]) * 0.5;
    return vertexIndex++;
  }

  let cellsPrev = cells;
  const IndexArray = subdivisions > 5 ? Uint32Array : getCellsTypedArray(size); // Subdivide

  for (let i = 0; i < subdivisions; i++) {
    const prevLen = cellsPrev.length;
    cells = new IndexArray(prevLen * 4);

    for (let k = 0; k < prevLen; k += 3) {
      const v1 = cellsPrev[k + 0];
      const v2 = cellsPrev[k + 1];
      const v3 = cellsPrev[k + 2];
      const a = addMidPoint(v1, v2);
      const b = addMidPoint(v2, v3);
      const c = addMidPoint(v3, v1);
      cells[k * 4 + 0] = v1;
      cells[k * 4 + 1] = a;
      cells[k * 4 + 2] = c;
      cells[k * 4 + 3] = v2;
      cells[k * 4 + 4] = b;
      cells[k * 4 + 5] = a;
      cells[k * 4 + 6] = v3;
      cells[k * 4 + 7] = c;
      cells[k * 4 + 8] = b;
      cells[k * 4 + 9] = a;
      cells[k * 4 + 10] = b;
      cells[k * 4 + 11] = c;
    }

    cellsPrev = cells;
  } // Normalize


  for (let i = 0; i < numVertices * 3; i += 3) {
    const v1 = positions[i + 0];
    const v2 = positions[i + 1];
    const v3 = positions[i + 2];
    const m = 1 / Math.sqrt(v1 * v1 + v2 * v2 + v3 * v3);
    positions[i + 0] *= m;
    positions[i + 1] *= m;
    positions[i + 2] *= m;
  }

  for (let i = 0; i < numVertices; i++) {
    uvs[2 * i + 0] = -Math.atan2(positions[3 * i + 2], positions[3 * i]) / TAU + 0.5;
    uvs[2 * i + 1] = Math.asin(positions[3 * i + 1]) / Math.PI + 0.5;
  }

  const duplicates = {};

  function addDuplicate(i, uvx, uvy, cached) {
    if (cached) {
      const dupe = duplicates[i];
      if (dupe !== undefined) return dupe;
    }

    positions[3 * vertexIndex + 0] = positions[3 * i + 0];
    positions[3 * vertexIndex + 1] = positions[3 * i + 1];
    positions[3 * vertexIndex + 2] = positions[3 * i + 2];
    uvs[2 * vertexIndex + 0] = uvx;
    uvs[2 * vertexIndex + 1] = uvy;
    if (cached) duplicates[i] = vertexIndex;
    return vertexIndex++;
  }

  for (let i = 0; i < cells.length; i += 3) {
    const a = cells[i + 0];
    const b = cells[i + 1];
    const c = cells[i + 2];
    let ax = uvs[2 * a];
    let bx = uvs[2 * b];
    let cx = uvs[2 * c];
    const ay = uvs[2 * a + 1];
    const by = uvs[2 * b + 1];
    const cy = uvs[2 * c + 1];
    if (ax - bx >= 0.5 && ay !== 1) bx += 1;
    if (bx - cx > 0.5) cx += 1;
    if (ax < 0.5 && cx - ax > 0.5 || ax === 1 && cy === 0) ax += 1;
    if (bx < 0.5 && ax - bx > 0.5) bx += 1; // Poles

    const isPoleA = ay === 0 || ay === 1;
    const isPoleB = by === 0 || by === 1;
    const isPoleC = cy === 0 || cy === 1;

    if (isPoleA) {
      ax = (bx + cx) * 0.5;

      if (ay === 1 - bx) {
        uvs[2 * a] = ax;
      } else {
        cells[i + 0] = addDuplicate(a, ax, ay, false);
      }
    } else if (isPoleB) {
      bx = (ax + cx) * 0.5;

      if (by === ax) {
        uvs[2 * b] = bx;
      } else {
        cells[i + 1] = addDuplicate(b, bx, by, false);
      }
    } else if (isPoleC) {
      cx = (ax + bx) * 0.5;

      if (cy === ax) {
        uvs[2 * c] = cx;
      } else {
        cells[i + 2] = addDuplicate(c, cx, cy, false);
      }
    } // Seam zipper


    if (ax !== uvs[2 * a] && !isPoleA) {
      cells[i + 0] = addDuplicate(a, ax, ay, true);
    }

    if (bx !== uvs[2 * b] && !isPoleB) {
      cells[i + 1] = addDuplicate(b, bx, by, true);
    }

    if (cx !== uvs[2 * c] && !isPoleC) {
      cells[i + 2] = addDuplicate(c, cx, cy, true);
    }
  }

  return {
    positions: positions.map(v => v * radius),
    normals: positions,
    uvs,
    cells
  };
}

const TMP$3 = [0, 0, 0];
/**
 * @typedef {Object} TorusOptions
 * @property {number} [radius=0.5]
 * @property {number} [segments=64]
 * @property {number} [minorRadius=0.1]
 * @property {number} [minorSegments=16]
 * @property {number} [arc=2 * Math.PI]
 */

/**
 * @alias module:torus
 * @param {TorusOptions} [options={}]
 * @returns {import("../types.js").SimplicialComplex}
 */

function torus({
  radius = 0.3,
  segments = 64,
  minorRadius = 0.1,
  minorSegments = 32,
  arc = TAU
} = {}) {
  const size = (minorSegments + 1) * (segments + 1);
  const positions = new Float32Array(size * 3);
  const normals = new Float32Array(size * 3);
  const uvs = new Float32Array(size * 2);
  const cells = new (getCellsTypedArray(size))(minorSegments * segments * 6);
  let vertexIndex = 0;
  let cellIndex = 0;

  for (let j = 0; j <= minorSegments; j++) {
    const v = j / minorSegments;

    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const phi = u * arc;
      const cosPhi = -Math.cos(phi);
      const sinPhi = Math.sin(phi);
      const theta = v * TAU;
      const cosTheta = -Math.cos(theta);
      const sinTheta = Math.sin(theta);
      TMP$3[0] = (radius + minorRadius * cosTheta) * cosPhi;
      TMP$3[1] = (radius + minorRadius * cosTheta) * sinPhi;
      TMP$3[2] = minorRadius * sinTheta;
      positions[vertexIndex * 3] = TMP$3[0];
      positions[vertexIndex * 3 + 1] = TMP$3[1];
      positions[vertexIndex * 3 + 2] = TMP$3[2];
      TMP$3[0] -= radius * cosPhi;
      TMP$3[1] -= radius * sinPhi;
      normalize(TMP$3);
      normals[vertexIndex * 3] = TMP$3[0];
      normals[vertexIndex * 3 + 1] = TMP$3[1];
      normals[vertexIndex * 3 + 2] = TMP$3[2];
      uvs[vertexIndex * 2] = u;
      uvs[vertexIndex * 2 + 1] = v;
      vertexIndex++;

      if (j > 0 && i > 0) {
        const a = (segments + 1) * j + i - 1;
        const b = (segments + 1) * (j - 1) + i - 1;
        const c = (segments + 1) * (j - 1) + i;
        const d = (segments + 1) * j + i;
        cells[cellIndex] = a;
        cells[cellIndex + 1] = b;
        cells[cellIndex + 2] = d;
        cells[cellIndex + 3] = b;
        cells[cellIndex + 4] = c;
        cells[cellIndex + 5] = d;
        cellIndex += 6;
      }
    }
  }

  return {
    positions,
    normals,
    uvs,
    cells
  };
}

/**
 * @module box
 */

/**
 * @typedef {Object} BoxOptions
 * @property {number} [sx=1]
 * @property {number} [sy=sx]
 * @property {number} [sz=sx]
 */

/**
 * @alias module:box
 * @param {BoxOptions} [options={}]
 * @returns {import("../types.js").BasicSimplicialComplex}
 */
function box({
  sx = 1,
  sy = sx,
  sz = sx
} = {}) {
  const x = sx / 2;
  const y = sy / 2;
  const z = sz / 2;
  return {
    // prettier-ignore
    positions: Float32Array.of(-x, y, z, -x, -y, z, x, -y, z, x, y, z, // -z
    x, y, -z, x, -y, -z, -x, -y, -z, -x, y, -z),
    // prettier-ignore
    cells: Uint8Array.of(0, 1, 2, 3, // +z
    3, 2, 5, 4, // +x
    4, 5, 6, 7, // -z
    7, 6, 1, 0, // -x
    7, 0, 3, 4, // +y
    1, 6, 5, 2 // -y
    )
  };
}

/**
 * @typedef {Object} BoxOptions
 * @property {number} [radius=0.5]
 * @property {number} [segments=32]
 */

/**
 * @alias module:circle
 * @param {BoxOptions} [options={}]
 * @returns {import("../types.js").BasicSimplicialComplex}
 */

function circle({
  radius = 0.5,
  segments = 32
} = {}) {
  const positions = new Float32Array(segments * 2);
  const cells = new (getCellsTypedArray(segments))((segments - 1) * 2);

  for (let i = 0; i < segments; i++) {
    positions[i * 2] = radius * Math.cos(i / segments * TAU);
    positions[i * 2 + 1] = radius * Math.sin(i / segments * TAU);

    if (i > 0) {
      cells[(i - 1) * 2] = i - 1;
      cells[(i - 1) * 2 + 1] = i;
    }
  }

  return {
    positions: positions,
    cells: cells
  };
}

export { box, capsule, circle, cone, cube, cylinder, ellipsoid, icosphere, plane, quad, roundedCube, sphere, torus, utils };
