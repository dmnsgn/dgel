import { _ as _export, g as getIteratorDirect, b as asyncIteratorClose } from './iterator-close-07759417.js';
import { l as getBuiltIn, G as aCallable, a as anObject, K as functionCall, c as isObject } from './object-create-d6cb7a41.js';
import { i as iterate } from './iterate-249f247d.js';

var Promise = getBuiltIn('Promise');
var $TypeError = TypeError;

// `AsyncIterator.prototype.reduce` method
// https://github.com/tc39/proposal-iterator-helpers
_export({ target: 'AsyncIterator', proto: true, real: true }, {
  reduce: function reduce(reducer /* , initialValue */) {
    var record = getIteratorDirect(this);
    var iterator = record.iterator;
    var next = record.next;
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    var counter = 0;
    aCallable(reducer);

    return new Promise(function (resolve, reject) {
      var ifAbruptCloseAsyncIterator = function (error) {
        asyncIteratorClose(iterator, reject, error, reject);
      };

      var loop = function () {
        try {
          Promise.resolve(anObject(functionCall(next, iterator))).then(function (step) {
            try {
              if (anObject(step).done) {
                noInitial ? reject($TypeError('Reduce of empty iterator with no initial value')) : resolve(accumulator);
              } else {
                var value = step.value;
                if (noInitial) {
                  noInitial = false;
                  accumulator = value;
                  loop();
                } else try {
                  var result = reducer(accumulator, value, counter);

                  var handler = function ($result) {
                    accumulator = $result;
                    loop();
                  };

                  if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator);
                  else handler(result);
                } catch (error3) { ifAbruptCloseAsyncIterator(error3); }
              }
              counter++;
            } catch (error2) { reject(error2); }
          }, reject);
        } catch (error) { reject(error); }
      };

      loop();
    });
  }
});

var $TypeError$1 = TypeError;

// `Iterator.prototype.reduce` method
// https://github.com/tc39/proposal-iterator-helpers
_export({ target: 'Iterator', proto: true, real: true }, {
  reduce: function reduce(reducer /* , initialValue */) {
    var record = getIteratorDirect(this);
    aCallable(reducer);
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    var counter = 0;
    iterate(record, function (value) {
      if (noInitial) {
        noInitial = false;
        accumulator = value;
      } else {
        accumulator = reducer(accumulator, value, counter);
      }
      counter++;
    }, { IS_RECORD: true });
    if (noInitial) throw $TypeError$1('Reduce of empty iterator with no initial value');
    return accumulator;
  }
});
