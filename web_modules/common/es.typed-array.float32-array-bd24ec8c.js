import { t as typedArrayConstructor } from './esnext.typed-array.with-72a47fc3.js';

// `Float32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Float32', function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
