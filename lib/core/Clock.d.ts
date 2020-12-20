declare class Clock {
    startTime: number;
    prevTime: number;
    time: number;
    reset(): void;
    start(): void;
    getDelta(): number;
}
export default Clock;
