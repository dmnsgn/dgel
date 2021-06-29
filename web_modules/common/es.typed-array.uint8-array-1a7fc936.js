import { t as typedArrayConstructor } from './typed-array-constructor-b01e3ece.js';

// `Uint8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
