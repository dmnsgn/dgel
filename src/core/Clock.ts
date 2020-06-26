class Clock {
  public startTime = 0;
  public prevTime = 0;
  public time = 0;

  public reset(): void {
    this.startTime = 0;
    this.prevTime = 0;
    this.time = 0;
  }

  public start(): void {
    this.startTime = performance.now();
    this.prevTime = this.startTime;
  }

  public getDelta(): number {
    const newTime = performance.now();
    const delta = (newTime - this.prevTime) / 1000;

    this.prevTime = newTime;
    this.time += delta;

    return delta;
  }
}

export default Clock;
