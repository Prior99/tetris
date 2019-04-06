import { Interval } from "utils";

export class Statistics {
    public pastIntervals: Interval[] = [];
    private nextInterval = new Interval(0);
    private currentTime = 0;
    public overallInterval = new Interval(0);

    public tick(seconds: number) {
        this.nextInterval.addTime(seconds - this.currentTime);
        this.overallInterval.addTime(seconds - this.currentTime);
        this.currentTime = seconds;
        if (this.nextInterval.completed) {
            this.pastIntervals.push(this.nextInterval);
            this.nextInterval = new Interval(this.currentTime);
        }
    }

    public reportScore(score: number) {
        this.nextInterval.score += score;
    }

    public reportLock() {
        this.nextInterval.reportLock();
        this.overallInterval.reportLock();
    }

    public get currentInterval(): Interval | undefined {
        return this.pastIntervals[this.pastIntervals.length - 1];
    }

    public reportLines(count: number) {
        this.nextInterval.reportLines(count);
        this.overallInterval.reportLines(count);
    }

    public lastN(n: number) {
        const intervals = [...this.pastIntervals, this.nextInterval];
        const result = Interval.combine(...intervals.slice(intervals.length - n, intervals.length));
        return result;
    }

    public get currentLocksPerMinute() {
        return this.overallInterval.locksPerMinute;
    }
}
