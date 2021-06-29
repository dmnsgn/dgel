import { A as aFunction, d as toObject, B as indexedObject, g as toLength, f as fails, e as classofRaw, j as global_1, _ as _export, h as engineV8Version } from './common/a-function-58034956.js';

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = indexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

var arrayReduce = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

var engineIsNode = classofRaw(global_1.process) == 'process';

var $reduce = arrayReduce.left;




var STRICT_METHOD = arrayMethodIsStrict('reduce');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !engineIsNode && engineV8Version > 79 && engineV8Version < 83;

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
_export({ target: 'Array', proto: true, forced: !STRICT_METHOD || CHROME_BUG }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

/**
 * @module interleaveTypedArray
 */

/**
 * Interleave n typed arrays
 *
 * @alias module:interleaveTypedArray
 * @param {TypedArray} ResultConstructor Returned typed array constructor
 * @param {Array} elements Number of elements to group for each typed array
 * @param {...TypedArray} arrays Arrays to interleave
 * @returns {TypedArray}
 */
function interleaveTypedArray(ResultConstructor, elements, ...arrays) {
  const totalLength = arrays.reduce((total, arr) => total + arr.length, 0);
  const result = new ResultConstructor(totalLength);
  const stride = elements.reduce((a, b) => a + b);

  for (let i = 0; i < totalLength; i++) {
    let offset = 0;

    for (let j = 0; j < elements.length; j++) {
      for (let k = 0; k < elements[j]; k++) {
        result[i * stride + offset] = arrays[j][elements[j] * i + k];
        offset++;
      }
    }
  }

  return result;
}

export default interleaveTypedArray;
