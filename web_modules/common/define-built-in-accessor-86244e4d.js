import { o as objectDefineProperty, S as makeBuiltIn_1 } from './iterators-d4972d1c.js';

var defineBuiltInAccessor = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn_1(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn_1(descriptor.set, name, { setter: true });
  return objectDefineProperty.f(target, name, descriptor);
};

export { defineBuiltInAccessor as d };
