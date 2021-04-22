import { e as esm } from './common/index-ac4cbebc.js';
import './common/vec2-5054ab4c.js';
import './common/es.typed-array.float32-array-cc49d38f.js';
import './common/typed-array-constructor-6a40afc1.js';

var primitiveQuad_1 = primitiveQuad;

function primitiveQuad(scale) {
  scale = typeof scale !== 'undefined' ? scale : 1;

  if (!Array.isArray(scale)) {
    scale = [scale, scale];
  }

  var positions = [[-scale[0], -scale[1], 0], [scale[0], -scale[1], 0], [scale[0], scale[1], 0], [-scale[0], scale[1], 0]];
  var cells = [[0, 1, 2], [2, 3, 0]];
  var uvs = [[0, 0], [1, 0], [1, 1], [0, 1]];
  var n = [0, 0, -1];
  var normals = [n.slice(), n.slice(), n.slice(), n.slice()];
  return {
    positions: positions,
    cells: cells,
    uvs: uvs,
    normals: normals
  };
}

// 3x3 plane:
//
//  0   1   2   3
//  4   5   6   7
//  8   9  10  11
// 12  13  14  15
function createPlane(sx, sy, nx, ny, options) {
  sx = sx || 1;
  sy = sy || sx;
  nx = nx || 1;
  ny = ny || nx;
  var quads = options && options.quads ? options.quads : false;
  var positions = [];
  var uvs = [];
  var normals = [];
  var cells = [];

  for (var iy = 0; iy <= ny; iy++) {
    for (var ix = 0; ix <= nx; ix++) {
      var u = ix / nx;
      var v = iy / ny;
      var x = -sx / 2 + u * sx; // starts on the left

      var y = sy / 2 - v * sy; // starts at the top

      positions.push([x, y, 0]);
      uvs.push([u, 1.0 - v]);
      normals.push([0, 0, 1]);

      if (iy < ny && ix < nx) {
        if (quads) {
          cells.push([iy * (nx + 1) + ix, (iy + 1) * (nx + 1) + ix, (iy + 1) * (nx + 1) + ix + 1, iy * (nx + 1) + ix + 1]);
        } else {
          cells.push([iy * (nx + 1) + ix, (iy + 1) * (nx + 1) + ix + 1, iy * (nx + 1) + ix + 1]);
          cells.push([(iy + 1) * (nx + 1) + ix + 1, iy * (nx + 1) + ix, (iy + 1) * (nx + 1) + ix]);
        }
      }
    }
  }

  return {
    positions: positions,
    normals: normals,
    uvs: uvs,
    cells: cells
  };
}

var primitivePlane = createPlane;

function createCube(sx, sy, sz, nx, ny, nz) {
  if (sx === undefined) sx = 1.0;
  if (sy === undefined) sy = sx;
  if (sz === undefined) sz = sx;
  if (nx === undefined) nx = 1.0;
  if (ny === undefined) ny = nx;
  if (nz === undefined) nz = nx;
  var vertexIndex = 0;
  var positions = [];
  var normals = [];
  var uvs = [];
  var cells = [];

  function makePlane(u, v, w, su, sv, nu, nv, pw, flipu, flipv) {
    var vertShift = vertexIndex;

    for (var j = 0; j <= nv; j++) {
      for (var i = 0; i <= nu; i++) {
        var vert = positions[vertexIndex] = [0, 0, 0];
        vert[u] = (-su / 2 + i * su / nu) * flipu;
        vert[v] = (-sv / 2 + j * sv / nv) * flipv;
        vert[w] = pw;
        var normal = normals[vertexIndex] = [0, 0, 0];
        normal[u] = 0;
        normal[v] = 0;
        normal[w] = pw / Math.abs(pw);
        var texCoord = uvs[vertexIndex] = [0, 0];
        texCoord[0] = i / nu;
        texCoord[1] = 1.0 - j / nv;
        ++vertexIndex;
      }
    }

    for (var j = 0; j < nv; j++) {
      for (var i = 0; i < nu; i++) {
        var n = vertShift + j * (nu + 1) + i;
        cells.push([n, n + nu + 1, n + nu + 2]);
        cells.push([n, n + nu + 2, n + 1]);
      }
    }
  }

  makePlane(0, 1, 2, sx, sy, nx, ny, sz / 2, 1, -1); //front

  makePlane(0, 1, 2, sx, sy, nx, ny, -sz / 2, -1, -1); //back

  makePlane(2, 1, 0, sz, sy, nz, ny, -sx / 2, 1, -1); //left

  makePlane(2, 1, 0, sz, sy, nz, ny, sx / 2, -1, -1); //right

  makePlane(0, 2, 1, sx, sz, nx, nz, sy / 2, 1, 1); //top

  makePlane(0, 2, 1, sx, sz, nx, nz, -sy / 2, 1, -1); //bottom

  return {
    positions: positions,
    normals: normals,
    uvs: uvs,
    cells: cells
  };
}

var primitiveCube = createCube;

function create() {
  return [0, 0, 0];
}

function equals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function equals3(a, x, y, z) {
  return a[0] === x && a[1] === y && a[2] === z;
}

function set(a, b) {
  a[0] = b[0];
  a[1] = b[1];
  a[2] = b[2];
  return a;
}

function set3(a, x, y, z) {
  a[0] = x;
  a[1] = y;
  a[2] = z;
  return a;
}

function add(a, b) {
  a[0] += b[0];
  a[1] += b[1];
  a[2] += b[2];
  return a;
}

function add3(a, x, y, z) {
  a[0] += x;
  a[1] += y;
  a[2] += z;
  return a;
}

function sub(a, b) {
  a[0] -= b[0];
  a[1] -= b[1];
  a[2] -= b[2];
  return a;
}

function sub3(a, x, y, z) {
  a[0] -= x;
  a[1] -= y;
  a[2] -= z;
  return a;
}

function scale(a, n) {
  a[0] *= n;
  a[1] *= n;
  a[2] *= n;
  return a;
}

function multMat4(a, m) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  a[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
  a[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
  a[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
  return a;
}

function multQuat(a, q) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var qx = q[0];
  var qy = q[1];
  var qz = q[2];
  var qw = q[3];
  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;
  a[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  a[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  a[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return a;
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a, b) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var vx = b[0];
  var vy = b[1];
  var vz = b[2];
  a[0] = y * vz - vy * z;
  a[1] = z * vx - vz * x;
  a[2] = x * vy - vx * y;
  return a;
}

function cross3(a, x, y, z) {
  var _x = a[0];
  var _y = a[1];
  var _z = a[2];
  a[0] = _y * z - y * _z;
  a[1] = _z * x - z * _x;
  a[2] = _x * y - x * _y;
  return a;
}

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}

function lengthSq(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}

function normalize(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var l = Math.sqrt(x * x + y * y + z * z);
  l = 1.0 / (l || 1);
  a[0] *= l;
  a[1] *= l;
  a[2] *= l;
  return a;
}

function distance(a, b) {
  return distance3(a, b[0], b[1], b[2]);
}

function distance3(a, x, y, z) {
  var dx = x - a[0];
  var dy = y - a[1];
  var dz = z - a[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function distanceSq(a, b) {
  return distanceSq3(a, b[0], b[1], b[2]);
}

function distanceSq3(a, x, y, z) {
  var dx = x - a[0];
  var dy = y - a[1];
  var dz = z - a[2];
  return dx * dx + dy * dy + dz * dz;
}

function limit(a, n) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var dsq = x * x + y * y + z * z;
  var lsq = n * n;

  if (lsq > 0 && dsq > lsq) {
    var nd = n / Math.sqrt(dsq);
    a[0] *= nd;
    a[1] *= nd;
    a[2] *= nd;
  }

  return a;
}

function invert(a) {
  a[0] *= -1;
  a[1] *= -1;
  a[2] *= -1;
  return a;
}

function lerp(a, b, n) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  a[0] = x + (b[0] - x) * n;
  a[1] = y + (b[1] - y) * n;
  a[2] = z + (b[2] - z) * n;
  return a;
}

function toZero(a) {
  a[0] = a[1] = a[2] = 0;
  return a;
}

function toOne(a) {
  a[0] = a[1] = a[2] = 1;
  return a;
}

function toMax(a) {
  a[0] = a[1] = a[2] = Number.MAX_VALUE;
  return a;
}

function toMin(a) {
  a[0] = a[1] = a[2] = -Number.MAX_VALUE;
  return a;
}

function toAbs(a) {
  a[0] = Math.abs(a[0]);
  a[1] = Math.abs(a[1]);
  a[2] = Math.abs(a[2]);
  return a;
}

function xAxis() {
  return [1, 0, 0];
}

function yAxis() {
  return [0, 1, 0];
}

function zAxis() {
  return [0, 0, 1];
}

function toString(a, precision) {
  precision = precision || Math.pow(10, 4);
  var s = '[';
  s += Math.floor(a[0] * precision) / precision + ', ';
  s += Math.floor(a[1] * precision) / precision + ', ';
  s += Math.floor(a[2] * precision) / precision + ']';
  return s;
}

function copy(a, out) {
  if (out !== undefined) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }

  return a.slice(0);
}

var Vec3 = {
  create: create,
  set: set,
  set3: set3,
  copy: copy,
  equals: equals,
  equals3: equals3,
  add: add,
  add3: add3,
  sub: sub,
  sub3: sub3,
  scale: scale,
  multMat4: multMat4,
  multQuat: multQuat,
  dot: dot,
  cross: cross,
  cross3: cross3,
  length: length,
  lengthSq: lengthSq,
  normalize: normalize,
  distance: distance,
  distance3: distance3,
  distanceSq: distanceSq,
  distanceSq3: distanceSq3,
  limit: limit,
  invert: invert,
  lerp: lerp,
  toZero: toZero,
  toOne: toOne,
  toMin: toMin,
  toMax: toMax,
  toAbs: toAbs,
  xAxis: xAxis,
  yAxis: yAxis,
  zAxis: zAxis,
  toString: toString
};
var Vec3_1 = Vec3;

function createRoundedCube(sx, sy, sz, nx, ny, nz, radius) {
  if (sx === undefined) sx = 1.0;
  if (sy === undefined) sy = sx;
  if (sz === undefined) sz = sx;
  if (nx === undefined) nx = 1.0;
  if (ny === undefined) ny = nx;
  if (nz === undefined) nz = nx;
  if (radius == undefined) radius = 0;
  var rx = sx / 2.0;
  var ry = sy / 2.0;
  var rz = sz / 2.0;
  var cube = primitiveCube(sx, sy, sz, nx, ny, nz);
  var positions = cube.positions;
  var normals = cube.normals;
  var tmp = [0, 0, 0];

  for (var i = 0; i < positions.length; i++) {
    var pos = positions[i];
    var normal = normals[i];
    var inner = Vec3_1.copy(pos);

    if (pos[0] < -rx + radius) {
      inner[0] = -rx + radius;
    } else if (pos[0] > rx - radius) {
      inner[0] = rx - radius;
    }

    if (pos[1] < -ry + radius) {
      inner[1] = -ry + radius;
    } else if (pos[1] > ry - radius) {
      inner[1] = ry - radius;
    }

    if (pos[2] < -rz + radius) {
      inner[2] = -rz + radius;
    } else if (pos[2] > rz - radius) {
      inner[2] = rz - radius;
    }

    Vec3_1.set(normal, pos);
    Vec3_1.sub(normal, inner);
    Vec3_1.normalize(normal);
    Vec3_1.set(pos, inner);
    Vec3_1.set(tmp, normal);
    Vec3_1.scale(tmp, radius);
    Vec3_1.add(pos, tmp);
  }

  return cube;
}

var primitiveRoundedCube = createRoundedCube;

function createCapsule(radius, height, numSubdivisionsHeight, numSegments) {
  if (radius === undefined) radius = 0.5;
  if (height === undefined) height = radius * 2;
  if (numSubdivisionsHeight === undefined) numSubdivisionsHeight = 12;
  if (numSegments === undefined) numSegments = 12;
  var positions = [];
  var normals = [];
  var uvs = [];
  var cells = [];

  function calculateRing(segments, r, y, dy) {
    var segIncr = 1.0 / (segments - 1);

    for (var s = 0; s < segments; s++) {
      var x = -Math.cos(Math.PI * 2 * s * segIncr) * r;
      var z = Math.sin(Math.PI * 2 * s * segIncr) * r;
      positions.push([radius * x, radius * y + height * dy, radius * z]);
      normals.push([x, y, z]);
      var u = s * segIncr;
      var v = 0.5 - (radius * y + height * dy) / (2.0 * radius + height);
      uvs.push([u, 1.0 - v]);
    }
  }

  var ringsBody = numSubdivisionsHeight + 1;
  var ringsTotal = numSubdivisionsHeight + ringsBody;
  var bodyIncr = 1.0 / (ringsBody - 1);
  var ringIncr = 1.0 / (numSubdivisionsHeight - 1);

  for (var r = 0; r < numSubdivisionsHeight / 2; r++) {
    calculateRing(numSegments, Math.sin(Math.PI * r * ringIncr), Math.sin(Math.PI * (r * ringIncr - 0.5)), -0.5);
  }

  for (var r = 0; r < ringsBody; r++) {
    calculateRing(numSegments, 1.0, 0.0, r * bodyIncr - 0.5);
  }

  for (var r = numSubdivisionsHeight / 2; r < numSubdivisionsHeight; r++) {
    calculateRing(numSegments, Math.sin(Math.PI * r * ringIncr), Math.sin(Math.PI * (r * ringIncr - 0.5)), +0.5);
  }

  for (var r = 0; r < ringsTotal - 1; r++) {
    for (var s = 0; s < numSegments - 1; s++) {
      cells.push([r * numSegments + (s + 0), r * numSegments + (s + 1), (r + 1) * numSegments + (s + 1)]);
      cells.push([r * numSegments + s, (r + 1) * numSegments + (s + 1), (r + 1) * numSegments + (s + 0)]);
    }
  }

  return {
    positions: positions,
    normals: normals,
    uvs: uvs,
    cells: cells
  };
}

var primitiveCapsule = createCapsule;

var identity_1 = identity;
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

var rotateY_1 = rotateY;
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY(out, a, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad),
      a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3],
      a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

var rotateZ_1 = rotateZ;
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad),
      a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3],
      a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}

var scale_1 = scale$1;
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale$1(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}

var transformMat4_1 = transformMat4;
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}

var normalize_1 = normalize$1;
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize$1(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
  }

  return out;
}

var matRotY = identity_1([]);
var matRotZ = identity_1([]);
var up = [0, 1, 0];
var tmpVec3 = [0, 0, 0];
var primitiveSphere_1 = primitiveSphere;

function primitiveSphere(radius, opt) {
  opt = opt || {};
  radius = typeof radius !== 'undefined' ? radius : 1;
  var segments = typeof opt.segments !== 'undefined' ? opt.segments : 32;
  var totalZRotationSteps = 2 + segments;
  var totalYRotationSteps = 2 * totalZRotationSteps;
  var indices = [];
  var positions = [];
  var normals = [];
  var uvs = [];

  for (var zRotationStep = 0; zRotationStep <= totalZRotationSteps; zRotationStep++) {
    var normalizedZ = zRotationStep / totalZRotationSteps;
    var angleZ = normalizedZ * Math.PI;

    for (var yRotationStep = 0; yRotationStep <= totalYRotationSteps; yRotationStep++) {
      var normalizedY = yRotationStep / totalYRotationSteps;
      var angleY = normalizedY * Math.PI * 2;
      identity_1(matRotZ);
      rotateZ_1(matRotZ, matRotZ, -angleZ);
      identity_1(matRotY);
      rotateY_1(matRotY, matRotY, angleY);
      transformMat4_1(tmpVec3, up, matRotZ);
      transformMat4_1(tmpVec3, tmpVec3, matRotY);
      scale_1(tmpVec3, tmpVec3, -radius);
      positions.push(tmpVec3.slice());
      normalize_1(tmpVec3, tmpVec3);
      normals.push(tmpVec3.slice());
      uvs.push([normalizedY, normalizedZ]);
    }

    if (zRotationStep > 0) {
      var verticesCount = positions.length;
      var firstIndex = verticesCount - 2 * (totalYRotationSteps + 1);

      for (; firstIndex + totalYRotationSteps + 2 < verticesCount; firstIndex++) {
        indices.push([firstIndex, firstIndex + 1, firstIndex + totalYRotationSteps + 1]);
        indices.push([firstIndex + totalYRotationSteps + 1, firstIndex + 1, firstIndex + totalYRotationSteps + 2]);
      }
    }
  }

  return {
    cells: indices,
    positions: positions,
    normals: normals,
    uvs: uvs
  };
}

var normalizeNd = normalize$2;

function normalize$2(vec) {
  var mag = 0;

  for (var n = 0; n < vec.length; n++) {
    mag += vec[n] * vec[n];
  }

  mag = Math.sqrt(mag); // avoid dividing by zero

  if (mag === 0) {
    return Array.apply(null, new Array(vec.length)).map(Number.prototype.valueOf, 0);
  }

  for (var n = 0; n < vec.length; n++) {
    vec[n] /= mag;
  }

  return vec;
}

var icosphere_1 = icosphere;

function icosphere(subdivisions) {
  subdivisions = +subdivisions | 0;
  var positions = [];
  var faces = [];
  var t = 0.5 + Math.sqrt(5) / 2;
  positions.push([-1, +t, 0]);
  positions.push([+1, +t, 0]);
  positions.push([-1, -t, 0]);
  positions.push([+1, -t, 0]);
  positions.push([0, -1, +t]);
  positions.push([0, +1, +t]);
  positions.push([0, -1, -t]);
  positions.push([0, +1, -t]);
  positions.push([+t, 0, -1]);
  positions.push([+t, 0, +1]);
  positions.push([-t, 0, -1]);
  positions.push([-t, 0, +1]);
  faces.push([0, 11, 5]);
  faces.push([0, 5, 1]);
  faces.push([0, 1, 7]);
  faces.push([0, 7, 10]);
  faces.push([0, 10, 11]);
  faces.push([1, 5, 9]);
  faces.push([5, 11, 4]);
  faces.push([11, 10, 2]);
  faces.push([10, 7, 6]);
  faces.push([7, 1, 8]);
  faces.push([3, 9, 4]);
  faces.push([3, 4, 2]);
  faces.push([3, 2, 6]);
  faces.push([3, 6, 8]);
  faces.push([3, 8, 9]);
  faces.push([4, 9, 5]);
  faces.push([2, 4, 11]);
  faces.push([6, 2, 10]);
  faces.push([8, 6, 7]);
  faces.push([9, 8, 1]);
  var complex = {
    cells: faces,
    positions: positions
  };

  while (subdivisions-- > 0) {
    complex = subdivide(complex);
  }

  positions = complex.positions;

  for (var i = 0; i < positions.length; i++) {
    normalizeNd(positions[i]);
  }

  return complex;
} // TODO: work out the second half of loop subdivision
// and extract this into its own module.


function subdivide(complex) {
  var positions = complex.positions;
  var cells = complex.cells;
  var newCells = [];
  var newPositions = [];
  var midpoints = {};
  var l = 0;

  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i];
    var c0 = cell[0];
    var c1 = cell[1];
    var c2 = cell[2];
    var v0 = positions[c0];
    var v1 = positions[c1];
    var v2 = positions[c2];
    var a = getMidpoint(v0, v1);
    var b = getMidpoint(v1, v2);
    var c = getMidpoint(v2, v0);
    var ai = newPositions.indexOf(a);
    if (ai === -1) ai = l++, newPositions.push(a);
    var bi = newPositions.indexOf(b);
    if (bi === -1) bi = l++, newPositions.push(b);
    var ci = newPositions.indexOf(c);
    if (ci === -1) ci = l++, newPositions.push(c);
    var v0i = newPositions.indexOf(v0);
    if (v0i === -1) v0i = l++, newPositions.push(v0);
    var v1i = newPositions.indexOf(v1);
    if (v1i === -1) v1i = l++, newPositions.push(v1);
    var v2i = newPositions.indexOf(v2);
    if (v2i === -1) v2i = l++, newPositions.push(v2);
    newCells.push([v0i, ai, ci]);
    newCells.push([v1i, bi, ai]);
    newCells.push([v2i, ci, bi]);
    newCells.push([ai, bi, ci]);
  }

  return {
    cells: newCells,
    positions: newPositions
  }; // reuse midpoint vertices between iterations.
  // Otherwise, there'll be duplicate vertices in the final
  // mesh, resulting in sharp edges.

  function getMidpoint(a, b) {
    var point = midpoint(a, b);
    var pointKey = pointToKey(point);
    var cachedPoint = midpoints[pointKey];

    if (cachedPoint) {
      return cachedPoint;
    } else {
      return midpoints[pointKey] = point;
    }
  }

  function pointToKey(point) {
    return point[0].toPrecision(6) + ',' + point[1].toPrecision(6) + ',' + point[2].toPrecision(6);
  }

  function midpoint(a, b) {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  }
}

var cross_1 = cross$1;
/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */

function cross$1(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
}

var subtract_1 = subtract;
/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}

var tmpX = [0, 0, 0];
var tmpY = [0, 0, 0];

var isUvSeam = function isUVBroken(uvs, a, b, c) {
  var uvA = uvs[a];
  var uvB = uvs[b];
  var uvC = uvs[c];
  subtract_1(tmpX, uvB, uvA);
  subtract_1(tmpY, uvC, uvA);
  cross_1(tmpX, tmpX, tmpY);
  return tmpX[2] < 0;
};

var MIN = 0.25;
var MAX = 0.75;
var fixWrappedUvs = fixWrappedUVs;

function fixWrappedUVs(mesh) {
  var positions = mesh.positions;
  var cells = mesh.cells;
  var uvs = mesh.uvs;
  var newVertices = positions.slice();
  var newUvs = uvs.slice();
  var visited = {};

  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i];
    var a = cell[0];
    var b = cell[1];
    var c = cell[2];

    if (!isUvSeam(uvs, a, b, c)) {
      continue;
    }

    var p0 = positions[a];
    var p1 = positions[b];
    var p2 = positions[c];
    var uv0 = uvs[a];
    var uv1 = uvs[b];
    var uv2 = uvs[c];

    if (uv0[0] < MIN) {
      a = revisit(visited, a, uv0, p0);
    }

    if (uv1[0] < MIN) {
      b = revisit(visited, b, uv1, p1);
    }

    if (uv2[0] < MIN) {
      c = revisit(visited, c, uv2, p2);
    }

    cell[0] = a;
    cell[1] = b;
    cell[2] = c;
  }

  fixUVEdges(cells, newUvs); // modify mesh in place with new lists

  mesh.positions = newVertices;
  mesh.uvs = newUvs;

  function revisit(cache, face, uv, position) {
    if (!(face in cache)) {
      newVertices.push(position.slice());
      newUvs.push(uv.slice());
      var verticeIndex = newVertices.length - 1;
      cache[face] = verticeIndex;
      return verticeIndex;
    } else {
      return cache[face];
    }
  }
}

function fixUVEdges(cells, uvs) {
  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i];
    var uv0 = uvs[cell[0]];
    var uv1 = uvs[cell[1]];
    var uv2 = uvs[cell[2]];
    var max = Math.max(uv0[0], uv1[0], uv2[0]);
    var min = Math.min(uv0[0], uv1[0], uv2[0]);

    if (max > MAX && min < MIN) {
      if (uv0[0] < MIN) uv0[0] += 1;
      if (uv1[0] < MIN) uv1[0] += 1;
      if (uv2[0] < MIN) uv2[0] += 1;
    }
  }
}

var fixPoleUvs = fixPoleUVs;

function fixPoleUVs(mesh) {
  var positions = mesh.positions;
  var cells = mesh.cells;
  var uvs = mesh.uvs;
  var northIndex = firstYIndex(positions, 1);
  var southIndex = firstYIndex(positions, -1);

  if (northIndex === -1 || southIndex === -1) {
    // could not find any poles, bail early
    return;
  }

  var newVertices = positions.slice();
  var newUvs = uvs.slice();
  var verticeIndex = newVertices.length - 1;

  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i];
    var a = cell[0];
    var b = cell[1];
    var c = cell[2];

    if (a === northIndex) {
      visit(cell, northIndex, b, c);
    } else if (a === southIndex) {
      visit(cell, southIndex, b, c);
    }
  }

  mesh.positions = newVertices;
  mesh.uvs = newUvs;

  function visit(cell, poleIndex, b, c) {
    var uv1 = uvs[b];
    var uv2 = uvs[c];
    uvs[poleIndex][0] = (uv1[0] + uv2[0]) / 2;
    verticeIndex++;
    newVertices.push(positions[poleIndex].slice());
    newUvs.push(uvs[poleIndex].slice());
    cell[0] = verticeIndex;
  }
}

function firstYIndex(list, value) {
  for (var i = 0; i < list.length; i++) {
    var vec = list[i];

    if (Math.abs(vec[1] - value) <= 1e-4) {
      return i;
    }
  }

  return -1;
}

var primitiveIcosphere = function primitiveIcosphere(radius, opt) {
  opt = opt || {};
  radius = typeof radius !== 'undefined' ? radius : 1;
  var subdivisions = typeof opt.subdivisions !== 'undefined' ? opt.subdivisions : 2;
  var complex = icosphere_1(subdivisions);
  var normals = [];
  var uvs = [];
  var i, position;

  for (i = 0; i < complex.positions.length; i++) {
    position = complex.positions[i]; // get UV from unit icosphere

    var u = 0.5 * (-(Math.atan2(position[2], -position[0]) / Math.PI) + 1.0);
    var v = 0.5 + Math.asin(position[1]) / Math.PI;
    uvs.push([1 - u, 1 - v]);
  }

  var mesh = {
    positions: complex.positions,
    cells: complex.cells,
    uvs: uvs,
    normals: normals
  }; // attempt to fix some of the glaring seam issues

  fixPoleUvs(mesh);
  fixWrappedUvs(mesh); // now determine normals

  for (i = 0; i < mesh.positions.length; i++) {
    position = mesh.positions[i]; // get normal

    var normal = normalize_1([0, 0, 0], position);
    normals.push(normal); // and scale sphere to radius

    scale_1(position, position, radius);
  }

  return mesh;
};

const {
  vec3
} = esm;
const tmp = [0, 0, 0];

function createEllipsoid(radius = 1, options) {
  // Default to an oblate spheroid
  const {
    latSegments = 32,
    lngSegments = 64,
    rx = 2,
    ry = 1,
    rz = 1
  } = { ...options
  };
  const cells = [];
  const positions = [];
  const normals = [];
  const uvs = [];

  for (let latSteps = 0; latSteps <= latSegments; latSteps++) {
    const normalizedZ = latSteps / latSegments;
    const theta = normalizedZ * Math.PI;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lngSteps = 0; lngSteps <= lngSegments; lngSteps++) {
      const normalizedY = lngSteps / lngSegments;
      const phi = normalizedY * Math.PI * 2;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const x = rx * cosPhi * sinTheta;
      const y = ry * cosTheta;
      const z = -rz * sinPhi * sinTheta;
      vec3.set(tmp, x, y, z);
      vec3.scale(tmp, tmp, -radius);
      positions.push([...tmp]);
      vec3.normalize(tmp, tmp);
      normals.push([...tmp]);
      uvs.push([normalizedY, normalizedZ]);
    }

    if (latSteps > 0) {
      const verticesCount = positions.length;

      for (let firstIndex = verticesCount - 2 * (lngSegments + 1); firstIndex + lngSegments + 2 < verticesCount; firstIndex++) {
        cells.push([firstIndex + 0, firstIndex + 1, firstIndex + lngSegments + 1]);
        cells.push([firstIndex + lngSegments + 1, firstIndex + 1, firstIndex + lngSegments + 2]);
      }
    }
  }

  return {
    cells,
    positions,
    normals,
    uvs
  };
}

var primitiveEllipsoid = createEllipsoid;

var defined = function () {
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i] !== undefined) return arguments[i];
  }
};

var subtract_1$1 = subtract$1;
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function subtract$1(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

var primitiveTorus = createTorusMesh;

function createTorusMesh(opt) {
  opt = opt || {};
  var majorRadius = defined(opt.majorRadius, 1);
  var minorRadius = defined(opt.minorRadius, 0.25);
  var minorSegments = defined(opt.minorSegments, 32);
  var majorSegments = defined(opt.majorSegments, 64);
  var arc = defined(opt.arc, Math.PI * 2);
  var PI2 = Math.PI * 2;
  var center = [0, 0, 0];
  var uvs = [];
  var positions = [];
  var cells = [];
  var tmp = [0, 0, 0];
  var normals = [];

  for (var j = 0; j <= minorSegments; j++) {
    for (var i = 0; i <= majorSegments; i++) {
      var u = i / majorSegments * arc;
      var v = j / minorSegments * PI2;
      center[0] = majorRadius * Math.cos(u);
      center[1] = majorRadius * Math.sin(u);
      var vertex = [(majorRadius + minorRadius * Math.cos(v)) * Math.cos(u), (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u), minorRadius * Math.sin(v)];
      positions.push(vertex);
      subtract_1$1(tmp, vertex, center);
      normalize_1(tmp, tmp);
      normals.push(tmp.slice());
      uvs.push([i / majorSegments, j / minorSegments]);
    }
  }

  for (var j = 1; j <= minorSegments; j++) {
    for (var i = 1; i <= majorSegments; i++) {
      var a = (majorSegments + 1) * j + i - 1;
      var b = (majorSegments + 1) * (j - 1) + i - 1;
      var c = (majorSegments + 1) * (j - 1) + i;
      var d = (majorSegments + 1) * j + i;
      cells.push([a, b, d]);
      cells.push([b, c, d]);
    }
  }

  return {
    uvs: uvs,
    cells: cells,
    normals: normals,
    positions: positions
  };
}

function createCylinderMesh(radiusTop, radiusBottom, height, radialSegments, heightSegments) {
  var index = 0;
  var indexOffset = 0;
  var indexArray = [];
  radiusTop = typeof radiusTop !== 'undefined' ? radiusTop : 1;
  radiusBottom = typeof radiusBottom !== 'undefined' ? radiusBottom : 1;
  height = typeof height !== 'undefined' ? height : 5;
  radialSegments = typeof radialSegments !== 'undefined' ? radialSegments : 64;
  heightSegments = typeof heightSegments !== 'undefined' ? heightSegments : 8;
  var capCount = 0;

  if (radiusTop > 0) {
    capCount++;
  }

  if (radiusBottom > 0) {
    capCount++;
  }

  var vertexCount = (radialSegments + 1) * (heightSegments + 1) + (radialSegments + 2) * capCount;
  var cellCount = radialSegments * heightSegments * 2 + radialSegments * capCount;
  var normals = new Array(vertexCount);
  var vertices = new Array(vertexCount);
  var uvs = new Array(vertexCount);
  var cells = new Array(cellCount);
  var slope = (radiusBottom - radiusTop) / height;
  var thetaLength = 2.0 * Math.PI;

  for (var y = 0; y <= heightSegments; y++) {
    var indexRow = [];
    var v = y / heightSegments;
    var radius = v * (radiusBottom - radiusTop) + radiusTop;

    for (var x = 0; x <= radialSegments; x++) {
      var u = x / radialSegments;
      var theta = u * thetaLength;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);
      vertices[index] = [radius * sinTheta, -v * height + height / 2, radius * cosTheta];
      normals[index] = [sinTheta, slope, cosTheta];
      uvs[index] = [u, 1 - v];
      indexRow.push(index);
      index++;
    }

    indexArray.push(indexRow);
  }

  for (var x = 0; x < radialSegments; x++) {
    for (var y = 0; y < heightSegments; y++) {
      var i1 = indexArray[y][x];
      var i2 = indexArray[y + 1][x];
      var i3 = indexArray[y + 1][x + 1];
      var i4 = indexArray[y][x + 1]; // face one

      cells[indexOffset] = [i1, i2, i4];
      indexOffset++; // face two

      cells[indexOffset] = [i2, i3, i4];
      indexOffset++;
    }
  }

  var generateCap = function (top) {
    var vertex = new Array(3).fill(0);
    var radius = top === true ? radiusTop : radiusBottom;
    var sign = top === true ? 1 : -1;
    var centerIndexStart = index;

    for (var x = 1; x <= radialSegments; x++) {
      vertices[index] = [0, height * sign / 2, 0];
      normals[index] = [0, sign, 0];
      uvs[index] = [0.5, 0.5];
      index++;
    }

    var centerIndexEnd = index;

    for (var x = 0; x <= radialSegments; x++) {
      var u = x / radialSegments;
      var theta = u * thetaLength;
      var cosTheta = Math.cos(theta);
      var sinTheta = Math.sin(theta);
      vertices[index] = [radius * sinTheta, height * sign / 2, radius * cosTheta];
      normals[index] = [0, sign, 0];
      uvs[index] = [cosTheta * 0.5 + 0.5, sinTheta * 0.5 * sign + 0.5];
      index++;
    }

    for (var x = 0; x < radialSegments; x++) {
      var c = centerIndexStart + x;
      var i = centerIndexEnd + x;

      if (top === true) {
        // face top
        cells[indexOffset] = [i, i + 1, c];
        indexOffset++;
      } else {
        // face bottom
        cells[indexOffset] = [i + 1, i, c];
        indexOffset++;
      }
    }
  };

  if (radiusTop > 0) {
    generateCap(true);
  }

  if (radiusBottom > 0) {
    generateCap(false);
  }

  return {
    uvs: uvs,
    cells: cells,
    normals: normals,
    positions: vertices
  };
}

var primitiveCylinder = createCylinderMesh;

function createBox(sx, sy, sz) {
  if (sx === undefined) sx = 1.0;
  if (sy === undefined) sy = sx;
  if (sz === undefined) sz = sx;
  var x = sx / 2;
  var y = sy / 2;
  var z = sz / 2;
  var positions = [//+z
  [-x, y, z], [-x, -y, z], [x, -y, z], [x, y, z], //-z
  [x, y, -z], [x, -y, -z], [-x, -y, -z], [-x, y, -z]];
  var cells = [[0, 1, 2, 3], //+z
  [3, 2, 5, 4], //+x
  [4, 5, 6, 7], //-z
  [7, 6, 1, 0], //-x
  [7, 0, 3, 4], //+y
  [1, 6, 5, 2] //-y
  ];
  return {
    positions: positions,
    cells: cells
  };
}

var primitiveBox = createBox;

function primitiveCircle(r, segments) {
  r = typeof r !== 'undefined' ? r : 1;
  segments = typeof segments !== 'undefined' ? segments : 32;
  const positions = [];
  const cells = [];

  for (let i = 0; i < segments; i++) {
    const x = Math.cos(i / segments * Math.PI * 2);
    const y = Math.sin(i / segments * Math.PI * 2);
    positions.push([r * x, r * y]);

    if (i > 0) {
      cells.push([i - 1, i]);
    }
  }

  return {
    positions: positions,
    cells: cells
  };
}

var primitiveCircle_1 = primitiveCircle;

var primitiveGeometry = {
  quad: primitiveQuad_1,
  plane: primitivePlane,
  cube: primitiveCube,
  roundedCube: primitiveRoundedCube,
  capsule: primitiveCapsule,
  sphere: primitiveSphere_1,
  icosphere: primitiveIcosphere,
  ellipsoid: primitiveEllipsoid,
  torus: primitiveTorus,
  cylinder: primitiveCylinder,
  box: primitiveBox,
  circle: primitiveCircle_1
};

var box = primitiveGeometry.box;
var capsule = primitiveGeometry.capsule;
var circle = primitiveGeometry.circle;
var cube = primitiveGeometry.cube;
var cylinder = primitiveGeometry.cylinder;
export default primitiveGeometry;
var ellipsoid = primitiveGeometry.ellipsoid;
var icosphere$1 = primitiveGeometry.icosphere;
var plane = primitiveGeometry.plane;
var quad = primitiveGeometry.quad;
var roundedCube = primitiveGeometry.roundedCube;
var sphere = primitiveGeometry.sphere;
var torus = primitiveGeometry.torus;
export { primitiveGeometry as __moduleExports, box, capsule, circle, cube, cylinder, ellipsoid, icosphere$1 as icosphere, plane, quad, roundedCube, sphere, torus };
