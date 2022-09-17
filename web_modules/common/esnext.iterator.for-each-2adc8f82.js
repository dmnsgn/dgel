import { _ as _export } from './iterators-d4972d1c.js';
import { a as asyncIteratorIteration } from './async-iterator-iteration-28d12ff4.js';
import { i as iterate } from './iterate-2e6eabaa.js';
import { g as getIteratorDirect } from './iterator-close-d9f17de2.js';

// https://github.com/tc39/proposal-iterator-helpers

var $forEach = asyncIteratorIteration.forEach;

_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  forEach: function forEach(fn) {
    return $forEach(this, fn);
  }
});

// https://github.com/tc39/proposal-iterator-helpers




_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
  forEach: function forEach(fn) {
    iterate(getIteratorDirect(this), fn, { IS_RECORD: true });
  }
});
