import { _ as _export, g as getIteratorDirect } from './iterator-close-ed3256eb.js';
import { a as asyncIteratorIteration } from './async-iterator-iteration-3d6321e8.js';
import { i as iterate } from './iterate-7440955a.js';
import { a as anObject, G as aCallable } from './object-create-d35021d9.js';

var $forEach = asyncIteratorIteration.forEach;

// `AsyncIterator.prototype.forEach` method
// https://github.com/tc39/proposal-async-iterator-helpers
_export({ target: 'AsyncIterator', proto: true, real: true }, {
  forEach: function forEach(fn) {
    return $forEach(this, fn);
  }
});

// `Iterator.prototype.forEach` method
// https://github.com/tc39/proposal-iterator-helpers
_export({ target: 'Iterator', proto: true, real: true }, {
  forEach: function forEach(fn) {
    anObject(this);
    aCallable(fn);
    var record = getIteratorDirect(this);
    var counter = 0;
    iterate(record, function (value) {
      fn(value, counter++);
    }, { IS_RECORD: true });
  }
});
