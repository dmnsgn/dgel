import { k as global_1, m as isCallable, f as functionUncurryThis, L as anObject, w as wellKnownSymbol, h as hasOwnProperty_1, o as objectDefineProperty } from './iterators-6f335e8d.js';

var String = global_1.String;
var TypeError = global_1.TypeError;

var aPossiblePrototype = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw TypeError("Can't set " + String(argument) + ' as a prototype');
};

/* eslint-disable no-proto -- safe */




// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es-x/no-object-setprototypeof -- safe
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
    setter = functionUncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var defineProperty = objectDefineProperty.f;



var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var setToStringTag = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwnProperty_1(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

export { objectSetPrototypeOf as o, setToStringTag as s };
