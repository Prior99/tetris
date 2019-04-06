import { external, inject } from "tsdi";
import { Config } from "config";

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

    constructor(public start: number) {}

    public addTime(seconds: number) {
        this.time += seconds;
    }

    public get completed() {
        return this.time >= this.config.statisticsInterval;
    }

    public reportLock() {
        this.locks++;
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
        this.lineDistribution.forEach((value, index) => {
            result.lineDistribution.set(index, value + other.lineDistribution.get(index)!);
        });
        return result;
    }
}
