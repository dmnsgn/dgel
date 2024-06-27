/**
 * @module typedArrayConcat
 */ /**
 * Concatenate n typed arrays
 *
 * @alias module:typedArrayConcat
 * @param {TypedArray} ResultConstructor Returned typed array constructor
 * @param {...TypedArray} arrays Arrays to concatenate
 * @returns {TypedArray}
 */ function typedArrayConcat(ResultConstructor) {
    for(var _len = arguments.length, arrays = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        arrays[_key - 1] = arguments[_key];
    }
    let totalLength = 0;
    for (const arr of arrays){
        totalLength += arr.length;
    }
    const result = new ResultConstructor(totalLength);
    let offset = 0;
    for (const arr of arrays){
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

export { typedArrayConcat as default };
