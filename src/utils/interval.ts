import { external, inject } from "tsdi";
import { Config } from "config";

export interface SerializedInterval {
    time: number;
    lineDistribution: {
        [1]: number;
        [2]: number;
        [3]: number;
        [4]: number;
    };
    locks: number;
    score: number;
    holes: number;
    highestBlock: number;
    start: number;
}

@external
export class Interval {
    public static combine(...intervals: Interval[]): Interval | undefined {
        if (intervals.length === 0) { return; }
        return intervals.reduce((last, current) => last.combineWith(current));
    }

    @inject private config: Config;

    public time = 0;
    public lineDistribution = new Map<number, number>([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
    ]);
    public locks = 0;
    public score = 0;
    public holes = 0;
    public highestBlock = 0;
    public start = 0;

    constructor(start: number, highestBlock?: number, holes?: number);
    constructor(interval: SerializedInterval);
    constructor(arg1: number | SerializedInterval, highestBlock?: number, holes?: number) {
        if (typeof arg1 === "object") {
            this.time = arg1.time;
            this.lineDistribution.set(1, arg1.lineDistribution[1]);
            this.lineDistribution.set(2, arg1.lineDistribution[2]);
            this.lineDistribution.set(3, arg1.lineDistribution[3]);
            this.lineDistribution.set(4, arg1.lineDistribution[4]);
            this.locks = arg1.locks;
            this.score = arg1.score;
            this.holes = arg1.holes;
            this.highestBlock = arg1.highestBlock;
            this.start = arg1.start;
            return;
        }
        this.start = arg1;
        if (highestBlock) { this.highestBlock = highestBlock; }
        if (holes) { this.holes = holes; }
    }

    public addTime(seconds: number) {
        this.time += seconds;
    }

    public get completed() {
        return this.time >= this.config.statisticsInterval;
    }

    public reportLock(highestBlock: number, holes: number) {
        this.locks++;
        this.highestBlock = highestBlock;
        this.holes = holes;
    }

    public reportLines(count: number) {
        this.lineDistribution.set(count, this.lineDistribution.get(count)! + 1);
    }

    public get lines() {
        return Array.from(this.lineDistribution.entries())
            .map(([combination, count]) => combination * count)
            .reduce((result, current) => result + current);
    }

    public get linesPerMinute() {
        if (this.time === 0) { return 0; }
        return (this.lines / this.time) * 60;
    }

    public get locksPerMinute() {
        if (this.time === 0) { return 0; }
        return (this.locks / this.time) * 60;
    }

    public combineWith(other: Interval): Interval {
        const result = new Interval(Math.min(this.start, other.start));
        result.time = this.time + other.time;
        result.locks = this.locks + other.locks;
        Array.from(this.lineDistribution.entries()).forEach(([index, value]) => {
            result.lineDistribution.set(index, value + other.lineDistribution.get(index)!);
        });
        return result;
    }

    public get serialized(): SerializedInterval {
        return {
            time: this.time,
            lineDistribution: {
                [1]: this.lineDistribution.get(1)!,
                [2]: this.lineDistribution.get(2)!,
                [3]: this.lineDistribution.get(3)!,
                [4]: this.lineDistribution.get(4)!,
            },
            locks: this.locks,
            score: this.score,
            holes: this.holes,
            highestBlock: this.highestBlock,
            start: this.start,
        };
    }
}
