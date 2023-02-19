import { i as isCallable, j as functionUncurryThis, a as anObject, K as functionCall } from './object-create-d6cb7a41.js';

var $String = String;
var $TypeError = TypeError;

var aPossiblePrototype = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};

/* eslint-disable no-proto -- safe */




// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
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

// eslint-disable-next-line es/no-map -- safe
var MapPrototype = Map.prototype;

var mapHelpers = {
  // eslint-disable-next-line es/no-map -- safe
  Map: Map,
  set: functionUncurryThis(MapPrototype.set),
  get: functionUncurryThis(MapPrototype.get),
  has: functionUncurryThis(MapPrototype.has),
  remove: functionUncurryThis(MapPrototype['delete']),
  proto: MapPrototype
};

var iterateSimple = function (iterator, fn, $next) {
  var next = $next || iterator.next;
  var step, result;
  while (!(step = functionCall(next, iterator)).done) {
    result = fn(step.value);
    if (result !== undefined) return result;
  }
};

var Map$1 = mapHelpers.Map;
var MapPrototype$1 = mapHelpers.proto;
var forEach = functionUncurryThis(MapPrototype$1.forEach);
var entries = functionUncurryThis(MapPrototype$1.entries);
var next = entries(new Map$1()).next;

var mapIterate = function (map, fn, interruptible) {
  return interruptible ? iterateSimple(entries(map), function (entry) {
    return fn(entry[1], entry[0]);
  }, next) : forEach(map, fn);
};

export { mapHelpers as a, iterateSimple as i, mapIterate as m, objectSetPrototypeOf as o };
