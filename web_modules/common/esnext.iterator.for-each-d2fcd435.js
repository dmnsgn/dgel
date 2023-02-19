import { _ as _export, g as getIteratorDirect } from './iterator-close-07759417.js';
import { a as asyncIteratorIteration } from './async-iterator-iteration-12e0c84c.js';
import { i as iterate } from './iterate-249f247d.js';
import { G as aCallable } from './object-create-d6cb7a41.js';

var $forEach = asyncIteratorIteration.forEach;

// `AsyncIterator.prototype.forEach` method
// https://github.com/tc39/proposal-iterator-helpers
_export({ target: 'AsyncIterator', proto: true, real: true }, {
  forEach: function forEach(fn) {
    return $forEach(this, fn);
  }
});

// `Iterator.prototype.forEach` method
// https://github.com/tc39/proposal-iterator-helpers
_export({ target: 'Iterator', proto: true, real: true }, {
  forEach: function forEach(fn) {
    var record = getIteratorDirect(this);
    var counter = 0;
    aCallable(fn);
    iterate(record, function (value) {
      fn(value, counter++);
    }, { IS_RECORD: true });
  }
});
