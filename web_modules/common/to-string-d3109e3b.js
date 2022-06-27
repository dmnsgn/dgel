import { P as functionBindNative, k as global_1 } from './iterators-6f335e8d.js';
import { c as classof } from './is-array-iterator-method-5c50626b.js';

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es-x/no-reflect -- safe
var functionApply = typeof Reflect == 'object' && Reflect.apply || (functionBindNative ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});

var String = global_1.String;

var toString_1 = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return String(argument);
};

export { functionApply as f, toString_1 as t };
