function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Clock {
  constructor() {
    _defineProperty(this, "startTime", 0);

    _defineProperty(this, "prevTime", 0);

    _defineProperty(this, "time", 0);
  }

  reset() {
    this.startTime = 0;
    this.prevTime = 0;
    this.time = 0;
  }

  start() {
    this.startTime = performance.now();
    this.prevTime = this.startTime;
  }

  getDelta() {
    const newTime = performance.now();
    const delta = (newTime - this.prevTime) / 1000;
    this.prevTime = newTime;
    this.time += delta;
    return delta;
  }

}

export default Clock;