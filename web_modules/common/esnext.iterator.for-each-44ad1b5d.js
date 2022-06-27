import { _ as _export, L as anObject } from './iterators-6f335e8d.js';
import { a as asyncIteratorIteration } from './async-iterator-iteration-6f4bd21a.js';
import { i as iterate } from './iterate-e8a51d17.js';

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
    iterate(anObject(this), fn, { IS_ITERATOR: true });
  }
});
