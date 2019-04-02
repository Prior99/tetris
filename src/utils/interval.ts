import { external, inject } from "tsdi";
import { Config } from "config";

@external
export class Interval {
    @inject private config: Config;

    private time = 0;
    public lineDistribution = new Map<number, number>([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
    ]);
    public locks = 0;

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
        return (this.lines / this.time) * 60;
    }

    public get locksPerMinute() {
        return (this.locks / this.time) * 60;
    }
}
