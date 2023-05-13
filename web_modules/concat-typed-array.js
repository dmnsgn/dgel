/**
 * @module concatTypedArray
 */

/**
 * Concatenate n typed arrays
 *
 * @alias module:concatTypedArray
 * @param {TypedArray} ResultConstructor Returned typed array constructor
 * @param {...TypedArray} arrays Arrays to concatenate
 * @returns {TypedArray}
 */
function concatTypedArray(ResultConstructor, ...arrays) {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new ResultConstructor(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

export default concatTypedArray;
