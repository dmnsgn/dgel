class Clock {
    constructor() {
        this.startTime = 0;
        this.prevTime = 0;
        this.time = 0;
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
//# sourceMappingURL=Clock.js.map