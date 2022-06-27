import { t as typedArrayConstructor } from './esnext.typed-array.with-929b01f0.js';

// `Int8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Int8', function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Uint32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint32', function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
